// MDX essay -> Substack-ready markdown: footnotes pulled to the bottom, every
// interactive figure replaced by a labelled image placeholder, prose kept
// verbatim. Tuned to the newt component vocabulary in rules.mjs.
//
// Returns { markdown, figures } where `figures` is the ordered manifest the
// shooter and linker consume (one entry per <figure> the essay renders).

import fs from "node:fs";
import path from "node:path";
import { RULES, SUBSCRIPTS } from "./rules.mjs";

const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const humanize = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/Figure$|Block$/, "").trim();

// --- tiny JSX scanners -----------------------------------------------------

// Parse a JSX open tag starting at `start` ('<'). Tracks {} depth so a `>`
// inside a `prop={<Foo>…</Foo>}` value doesn't end the tag early.
function parseOpenTag(text, start) {
  let depth = 0;
  for (let i = start + 1; i < text.length; i++) {
    const c = text[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) {
      const selfClosing = text[i - 1] === "/";
      const attrsText = text.slice(start, selfClosing ? i - 1 : i);
      return { attrsText, end: i + 1, selfClosing };
    }
  }
  throw new Error("unterminated JSX tag at " + start);
}

// Read a brace-balanced `content={ … }` value out of an open tag's attr text,
// stripping the <TippyTooltipContent> wrapper to leave the footnote body.
function readContentBody(attrsText) {
  const at = attrsText.indexOf("content=");
  if (at === -1) return "";
  const open = attrsText.indexOf("{", at);
  if (open === -1) return "";
  let depth = 0, j = open;
  for (; j < attrsText.length; j++) {
    if (attrsText[j] === "{") depth++;
    else if (attrsText[j] === "}" && --depth === 0) break;
  }
  const cc = RULES.footnote.contentComponent;
  return attrsText
    .slice(open + 1, j)
    .replace(new RegExp(`^\\s*<${cc}>`), "")
    .replace(new RegExp(`</${cc}>\\s*$`), "")
    .trim();
}

// --- transforms ------------------------------------------------------------

function stripScaffolding(src) {
  // import statements (possibly multi-line, terminated by ;)
  src = src.replace(/^import\b[\s\S]*?;\s*\n/gm, "");
  // {/* comments */}
  src = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  // export const metadata = { … };  and  export default function … { … }
  src = removeBalanced(src, /export const metadata\s*=\s*\{/);
  src = removeBalanced(src, /export default function[\s\S]*?\{/, { fromBraceOpen: true });
  return src;
}

// Remove a `{ … }`-balanced block whose start matches `startRe`.
function removeBalanced(src, startRe, { fromBraceOpen = false } = {}) {
  const m = startRe.exec(src);
  if (!m) return src;
  const braceStart = fromBraceOpen ? src.indexOf("{", m.index) : m.index + m[0].length - 1;
  let depth = 0, i = braceStart;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) { i++; break; }
  }
  // also swallow a trailing ; and newline
  while (src[i] === ";" || src[i] === "\n" || src[i] === " ") i++;
  return src.slice(0, m.index) + src.slice(i);
}

function unwrapInline(src) {
  for (const name of RULES.unwrapInline) {
    src = src.replace(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "g"), "$1");
  }
  return src;
}

function applyHeadings(src) {
  for (const [name, hashes] of Object.entries(RULES.headings)) {
    src = src.replace(
      new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "g"),
      `\n${hashes} $1\n`
    );
  }
  return src;
}

// Replace footnote tooltips with [^n] markers (collect bodies); collapse any
// non-footnote tooltips to their anchor text. Single pass so nested `>` in the
// content attr never trips a regex.
function extractFootnotes(text) {
  const TAG = "<" + RULES.footnote.component;
  const CLOSE = "</" + RULES.footnote.component + ">";
  const isFootnote = new RegExp(
    `${RULES.footnote.variantAttr}\\s*=\\s*["']${RULES.footnote.variantValue}["']`
  );
  const footnotes = [];
  let out = "", i = 0;
  while (true) {
    const start = text.indexOf(TAG, i);
    if (start === -1) { out += text.slice(i); break; }
    // Only treat as a component start if followed by space/＞/newline (not e.g. TippyTooltipContent)
    const after = text[start + TAG.length];
    if (!/[\s/>]/.test(after)) { out += text.slice(i, start + TAG.length); i = start + TAG.length; continue; }
    out += text.slice(i, start);
    const tag = parseOpenTag(text, start);
    const foot = isFootnote.test(tag.attrsText);
    let anchor = "", end = tag.end;
    if (!tag.selfClosing) {
      const ci = text.indexOf(CLOSE, tag.end);
      anchor = text.slice(tag.end, ci);
      end = ci + CLOSE.length;
    }
    if (foot) {
      footnotes.push(readContentBody(tag.attrsText));
      out += `${anchor}[^${footnotes.length}]`;
    } else {
      out += anchor; // non-footnote tooltip → keep its anchor text
    }
    i = end;
  }
  return { text: out, footnotes };
}

function parseProps(attrsAfterName) {
  const props = {};
  const re = /(\w+)\s*=\s*("([^"]*)"|'([^']*)'|\{([\s\S]*?)\})/g;
  let m;
  while ((m = re.exec(attrsAfterName))) {
    props[m[1]] =
      m[3] ?? m[4] ?? (m[5] !== undefined ? `{${m[5].trim()}}` : "");
  }
  return props;
}

function figureBaseName(name, props) {
  for (const p of RULES.figureNameProps) {
    const v = props[p];
    if (v && !v.startsWith("{")) return kebab(v);
  }
  for (const v of Object.values(props)) {
    if (v.startsWith("{")) {
      const id = v.slice(1, -1).trim();
      const mm = /([A-Z][A-Z0-9_]{2,})/.exec(id);
      if (mm) return kebab(mm[1].replace(/_URL$/, "").toLowerCase());
    }
  }
  return kebab(name);
}

// Replace every block-level capitalized component with an image placeholder,
// building the ordered figure manifest. Drop CTA/layout blocks entirely.
function extractFigures(text, overrides) {
  const figures = [];
  let out = "", i = 0;
  while (i < text.length) {
    const lt = text.indexOf("<", i);
    if (lt === -1) { out += text.slice(i); break; }
    const m = /^<([A-Z][A-Za-z0-9]*)/.exec(text.slice(lt, lt + 48));
    const lineStart = text.lastIndexOf("\n", lt) + 1;
    const blockLevel = text.slice(lineStart, lt).trim() === "";
    if (!m || !blockLevel) { out += text.slice(i, lt + 1); i = lt + 1; continue; }
    const name = m[1];
    const tag = parseOpenTag(text, lt);
    let end = tag.end;
    if (!tag.selfClosing) {
      const ci = text.indexOf(`</${name}>`, tag.end);
      end = ci === -1 ? tag.end : ci + name.length + 3;
    }
    out += text.slice(i, lineStart);
    if (!RULES.dropBlock.includes(name)) {
      const props = parseProps(tag.attrsText.slice(1 + name.length));
      const index = figures.length;
      const file = `${String(index + 1).padStart(2, "0")}-${figureBaseName(name, props)}.png`;
      const ov = overrides.figures?.[file] || {};
      const base = humanize(name);
      const provisional =
        ov.alt ||
        (props.caption && !props.caption.startsWith("{") ? props.caption : null) ||
        (figureBaseName(name, props) !== kebab(name)
          ? `${base}: ${figureBaseName(name, props).replace(/-/g, " ")}`
          : base);
      figures.push({ index, component: name, props, file, alt: provisional, frame: ov.frame ?? null });
      out += `> **[Image — \`${file}\`]** ${provisional}\n`;
    }
    i = end;
  }
  return { text: out, figures };
}

function normalizeEntities(src) {
  for (const [k, v] of Object.entries(RULES.entities)) src = src.split(k).join(v);
  if (RULES.subscriptDigits) {
    src = src.replace(/<sub>(\d+)<\/sub>/g, (_, d) =>
      [...d].map((c) => SUBSCRIPTS[c] || c).join("")
    );
  }
  return src;
}

const tidy = (src) => src.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+\n/g, "\n").trim() + "\n";

function assemble(body, footnotes) {
  if (!footnotes.length) return tidy(body);
  const notes = footnotes.map((b, i) => `[^${i + 1}]: ${b}`).join("\n\n");
  return tidy(body) + `\n\n---\n\n## Footnotes\n\n${notes}\n`;
}

// --- public API ------------------------------------------------------------

export function loadOverrides(root, slug) {
  const p = path.join(root, "pages/essays", slug, "export.config.json");
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return {}; }
}

export function extractEssay(slug, { repoRoot = process.cwd() } = {}) {
  const mdxPath = path.join(repoRoot, RULES.mdxPathFor(slug));
  let src = fs.readFileSync(mdxPath, "utf8");
  const overrides = loadOverrides(repoRoot, slug);

  src = stripScaffolding(src);
  src = unwrapInline(src);
  src = applyHeadings(src);
  const fn = extractFootnotes(src);
  src = fn.text;
  const fig = extractFigures(src, overrides);
  src = fig.text;
  src = normalizeEntities(src);

  return {
    markdown: assemble(src, fn.footnotes),
    figures: fig.figures,
    footnotes: fn.footnotes,
    route: RULES.routeFor(slug),
  };
}
