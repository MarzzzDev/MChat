#!/usr/bin/env node
/*
 * cleanup.js - whole-project dead/duplicate code finder and remover.
 *
 * Setup:   npm i acorn acorn-walk
 * Report:  node cleanup.js <project-dir>
 * Apply:   node cleanup.js <project-dir> --apply --out=cleaned
 *
 * Reads EVERY .js/.html/.css/.json file in the folder first, so a function
 * used from another file (or from an inline onclick in your HTML) is never
 * treated as dead. Put all your files, including index.html, in the folder.
 *
 * Report mode never touches anything. --apply writes changed files into
 * --out (your originals are not modified). Only things that are provably
 * safe get removed. Everything else is just reported for you to decide.
 */

const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith("--")) || ".");
const apply = args.includes("--apply");
const outArg = args.find((a) => a.startsWith("--out="));
const outDir = path.resolve(outArg ? outArg.slice(6) : "cleaned");

const EXTS = new Set([".js", ".mjs", ".cjs", ".html", ".htm", ".css", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".git", path.basename(outDir)]);
const PURE_CTORS = new Set(["Map", "Set", "WeakMap", "WeakSet", "Array", "Object", "RegExp"]);

// ---------- load everything ----------

function collect(root) {
	const found = [];
	for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
		const full = path.join(root, entry.name);
		if (entry.isDirectory()) {
			if (!SKIP_DIRS.has(entry.name)) found.push(...collect(full));
		} else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
			found.push(full);
		}
	}
	return found;
}

const files = collect(dir).map((full) => ({
	full,
	rel: path.relative(dir, full),
	ext: path.extname(full).toLowerCase(),
	code: fs.readFileSync(full, "utf8"),
	decls: [],
	removed: [],
	parsed: false,
}));

const isJS = (f) => [".js", ".mjs", ".cjs"].includes(f.ext);
const warnings = [];
const findings = { unreachable: [], dupNames: [], dupBodies: [], repeats: [], cssDups: [] };

// ---------- helpers ----------

function isPure(n) {
	if (!n) return true;
	switch (n.type) {
		case "Literal":
		case "Identifier":
		case "FunctionExpression":
		case "ArrowFunctionExpression":
			return true;
		case "TemplateLiteral":
			return n.expressions.length === 0;
		case "ArrayExpression":
			return n.elements.every((e) => e && isPure(e));
		case "ObjectExpression":
			return n.properties.every(
				(p) => p.type === "Property" && !p.computed && isPure(p.value),
			);
		case "UnaryExpression":
			return isPure(n.argument);
		case "BinaryExpression":
		case "LogicalExpression":
			return isPure(n.left) && isPure(n.right);
		case "NewExpression":
			return (
				n.callee.type === "Identifier" &&
				PURE_CTORS.has(n.callee.name) &&
				n.arguments.every(isPure)
			);
		case "CallExpression":
			return (
				n.callee.type === "MemberExpression" &&
				n.callee.object.name === "Object" &&
				n.callee.property.name === "freeze" &&
				n.arguments.every(isPure)
			);
		default:
			return false;
	}
}

function parse(code) {
	const comments = [];
	const opts = {
		ecmaVersion: "latest",
		allowReturnOutsideFunction: true,
		allowAwaitOutsideFunction: true,
		onComment: comments,
	};
	try {
		return { ast: acorn.parse(code, { ...opts, sourceType: "script" }), comments };
	} catch {
		comments.length = 0;
		return { ast: acorn.parse(code, { ...opts, sourceType: "module" }), comments };
	}
}

// extend a node's start backwards over comments attached directly above it
function startWithComments(code, comments, start) {
	let s = start;
	for (;;) {
		const c = comments.find((x) => x.end <= s && /^\s*$/.test(code.slice(x.end, s)));
		if (!c || code.slice(c.end, s).split("\n").length > 2) return s;
		s = c.start;
	}
}

const norm = (s) => s.replace(/\s+/g, " ").trim();

// ---------- parse JS, gather top-level declarations and report-only findings ----------

const allBodies = new Map();
const exprCounts = new Map();
const declaredNames = new Map();

for (const f of files) {
	if (!isJS(f)) continue;
	let parsed;
	try {
		parsed = parse(f.code);
	} catch (error) {
		warnings.push(`${f.rel}: could not parse (${error.message}). Its code counts as "used" but nothing is removed from it.`);
		continue;
	}
	f.parsed = true;
	const { ast, comments } = parsed;

	for (const node of ast.body) {
		let name = null;
		let removable = false;

		if (node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") {
			name = node.id.name;
			removable = true;
		} else if (
			node.type === "VariableDeclaration" &&
			node.declarations.length === 1 &&
			node.declarations[0].id.type === "Identifier"
		) {
			name = node.declarations[0].id.name;
			removable = isPure(node.declarations[0].init);
		}

		if (!name) continue;

		f.decls.push({
			name,
			removable,
			start: startWithComments(f.code, comments, node.start),
			end: node.end,
			line: f.code.slice(0, node.start).split("\n").length,
		});

		if (!declaredNames.has(name)) declaredNames.set(name, []);
		declaredNames.get(name).push(`${f.rel}:${f.code.slice(0, node.start).split("\n").length}`);

		if (node.type === "FunctionDeclaration") {
			const body = norm(f.code.slice(node.body.start, node.body.end));
			if (body.length >= 80) {
				if (!allBodies.has(body)) allBodies.set(body, []);
				allBodies.get(body).push(`${node.id.name} (${f.rel})`);
			}
		}
	}

	walk.full(ast, (node) => {
		// code after return/throw/break/continue in the same block
		if (node.type === "BlockStatement" || node.type === "Program") {
			const list = node.body;
			const idx = list.findIndex((s) =>
				["ReturnStatement", "ThrowStatement", "BreakStatement", "ContinueStatement"].includes(s.type),
			);
			if (idx !== -1 && list.slice(idx + 1).some((s) => s.type !== "FunctionDeclaration")) {
				findings.unreachable.push(`${f.rel}:${f.code.slice(0, list[idx].start).split("\n").length}`);
			}
		}
		// repeated expressions
		if (["CallExpression", "ConditionalExpression", "LogicalExpression"].includes(node.type)) {
			const text = norm(f.code.slice(node.start, node.end));
			if (text.length >= 30 && text.length <= 160) {
				const entry = exprCounts.get(text) || { n: 0, files: new Set() };
				entry.n++;
				entry.files.add(f.rel);
				exprCounts.set(text, entry);
			}
		}
	});
}

// ---------- dead top-level declarations, to a fixpoint ----------

const blank = (code, ranges) => {
	let out = code;
	for (const r of ranges) out = out.slice(0, r.start) + out.slice(r.start, r.end).replace(/[^\n]/g, " ") + out.slice(r.end);
	return out;
};

const tokens = (text, into) => {
	for (const m of text.matchAll(/[A-Za-z_$][\w$]*/g)) into.set(m[0], (into.get(m[0]) || 0) + 1);
	return into;
};

const dead = [];
const flagged = new Set();
let progress = true;

while (progress) {
	progress = false;
	const blanked = files.map((f) => blank(f.code, f.removed));
	const counts = new Map();
	blanked.forEach((text) => tokens(text, counts));

	const liveDecls = new Map();
	for (const f of files) for (const d of f.decls) if (!flagged.has(d)) liveDecls.set(d.name, (liveDecls.get(d.name) || 0) + 1);

	files.forEach((f, i) => {
		for (const d of f.decls) {
			if (flagged.has(d) || !d.removable || liveDecls.get(d.name) !== 1) continue;
			const own = tokens(blanked[i].slice(d.start, d.end), new Map()).get(d.name) || 0;
			if (counts.get(d.name) === own) {
				flagged.add(d);
				f.removed.push(d);
				dead.push({ file: f.rel, ...d });
				progress = true;
			}
		}
	});
}

// names declared more than once at top level (the later one silently wins)
for (const [name, where] of declaredNames) if (where.length > 1) findings.dupNames.push(`${name}: ${where.join(", ")}`);

for (const names of allBodies.values()) if (names.length > 1) findings.dupBodies.push(names.join("  =  "));

const repeated = [...exprCounts].filter(([, v]) => v.n >= 3).sort((a, b) => b[0].length * b[1].n - a[0].length * a[1].n);
const shown = [];
for (const [text, v] of repeated) {
	if (shown.some(([t, sv]) => t.includes(text) && sv.n === v.n)) continue;
	shown.push([text, v]);
	if (shown.length >= 12) break;
}
findings.repeats = shown.map(([t, v]) => `${v.n}x  ${t}`);

// ---------- rough CSS duplicate-selector check ----------

for (const f of files.filter((x) => x.ext === ".css")) {
	const text = f.code.replace(/\/\*[\s\S]*?\*\//g, "");
	const seen = new Map();
	let depth = 0;
	let buf = "";
	let skip = false;
	for (const ch of text) {
		if (ch === "{") {
			if (depth === 0) skip = buf.trim().startsWith("@");
			if (depth === 0 && !skip) seen.set(norm(buf), (seen.get(norm(buf)) || 0) + 1);
			depth++;
			if (depth === 1) buf = "";
		} else if (ch === "}") {
			depth--;
			if (depth === 0) buf = "";
		} else if (depth === 0) {
			buf += ch;
		}
	}
	for (const [sel, n] of seen) if (n > 1) findings.cssDups.push(`${f.rel}: "${sel}" defined ${n} times`);
}

// ---------- output ----------

const section = (title, list) => {
	console.log(`\n== ${title} (${list.length}) ==`);
	list.forEach((x) => console.log("  " + x));
};

console.log(`Scanned ${files.length} files in ${dir}:`);
console.log("  " + files.map((f) => f.rel).join(", "));
warnings.forEach((w) => console.log("WARNING: " + w));

section(
	apply ? "Removed: unused top-level functions/variables" : "Unused top-level functions/variables (safe to delete)",
	dead.map((d) => `${d.file}:${d.line}  ${d.name}`),
);
section("Duplicate top-level names (later one overrides, merge or delete)", findings.dupNames);
section("Identical function bodies (probably copy-paste)", findings.dupBodies);
section("Code after return/throw (unreachable)", findings.unreachable);
section("Repeated expressions, 3+ times (candidates for a helper)", findings.repeats);
section("CSS selectors defined more than once (merge candidates)", findings.cssDups);

if (apply) {
	let written = 0;
	for (const f of files) {
		if (!f.removed.length) continue;
		let out = f.code;
		for (const r of [...f.removed].sort((a, b) => b.start - a.start)) {
			let end = r.end;
			if (out[end] === "\r") end++;
			if (out[end] === "\n") end++;
			out = out.slice(0, r.start) + out.slice(end);
		}
		out = out.replace(/\n{3,}/g, "\n\n");
		const target = path.join(outDir, f.rel);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, out);
		written++;
	}
	console.log(`\nWrote ${written} changed file(s) to ${outDir}. Originals untouched. Diff before copying over.`);
} else {
	console.log("\nReport only. Re-run with --apply --out=cleaned to write the dead-code removals.");
}
