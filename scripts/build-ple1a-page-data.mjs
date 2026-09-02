import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const tsvDir = join(root, "tmp/pdfs/ple1a_tsv");
const output = join(root, "data/ple1aPageText.generated.json");

const tidy = (value) => value
  .replace(/^\s*(?:oe|[|>]+)\s+(?=[A-Za-z])/i, "")
  .replace(/^\s*[a-z]\s+(?=[A-Z])/g, "")
  .replace(/[|l]\s+am\b/g, "I am")
  .replace(/\bIam\b/g, "I am")
  .replace(/\s+([,.;:!?])/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

function likelyEnglish(text, confidence) {
  const letters = (text.match(/[A-Za-z]/g) ?? []).length;
  const visible = text.replace(/\s/g, "").length;
  const words = text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
  if (letters < 2 || visible === 0 || letters / visible < 0.58 || text.length > 220) return false;
  if (words.length === 1) return words[0].length >= 2 && confidence >= 72;
  return confidence >= 48;
}

function parsePage(file) {
  const page = Number(basename(file).match(/\d+/)?.[0]);
  const rows = readFileSync(join(tsvDir, file), "utf8").split(/\r?\n/).slice(1);
  const groups = new Map();

  for (const row of rows) {
    if (!row) continue;
    const columns = row.split("\t");
    if (columns.length < 12 || columns[0] !== "5") continue;
    const [level, pageNum, block, paragraph, line, word, left, top, width, height, confidence, ...rest] = columns;
    void level; void pageNum; void word;
    const text = rest.join("\t").trim();
    const score = Number(confidence);
    if (!text || score < 25) continue;
    const key = `${block}:${paragraph}:${line}`;
    const entry = groups.get(key) ?? { words: [], left: Infinity, top: Infinity, right: 0, bottom: 0, scores: [] };
    const x = Number(left); const y = Number(top); const w = Number(width); const h = Number(height);
    entry.words.push(text); entry.left = Math.min(entry.left, x); entry.top = Math.min(entry.top, y);
    entry.right = Math.max(entry.right, x + w); entry.bottom = Math.max(entry.bottom, y + h); entry.scores.push(score);
    groups.set(key, entry);
  }

  const lines = [...groups.values()].map((entry, index) => {
    const text = tidy(entry.words.join(" "));
    const confidence = Math.round(entry.scores.reduce((sum, item) => sum + item, 0) / entry.scores.length);
    return {
      id: `p${page}-l${index + 1}`,
      text,
      x: Number((entry.left / 1440 * 100).toFixed(3)),
      y: Number((entry.top / 1800 * 100).toFixed(3)),
      width: Number(((entry.right - entry.left) / 1440 * 100).toFixed(3)),
      height: Number(((entry.bottom - entry.top) / 1800 * 100).toFixed(3)),
      confidence,
    };
  }).filter((entry) => likelyEnglish(entry.text, entry.confidence));

  return {
    page,
    bookPage: page >= 9 ? page - 8 : null,
    image: `/textbooks/ple1a/pages/page-${String(page).padStart(2, "0")}.jpg`,
    lines,
  };
}

const pages = readdirSync(tsvDir)
  .filter((file) => /^page-\d+\.tsv$/.test(file))
  .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))
  .map(parsePage);

mkdirSync(join(root, "data"), { recursive: true });
writeFileSync(output, `${JSON.stringify(pages, null, 2)}\n`);
const totalLines = pages.reduce((sum, page) => sum + page.lines.length, 0);
console.log(`Generated ${pages.length} pages and ${totalLines} clickable English lines.`);
