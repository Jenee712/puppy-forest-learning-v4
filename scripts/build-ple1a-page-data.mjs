import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const tsvDir = join(root, "tmp/pdfs/ple1a_tsv");
const sparseTsvDir = join(root, "tmp/pdfs/ple1a_tsv_sparse");
const enhancedSparseTsvDir = join(root, "tmp/pdfs/ple1a_tsv_enhanced_sparse");
const visionJson = join(root, "tmp/pdfs/ple1a_vision.json");
const output = join(root, "data/ple1aPageText.generated.json");
const visionByPage = existsSync(visionJson)
  ? new Map(JSON.parse(readFileSync(visionJson, "utf8")).map((entry) => [entry.page, entry.lines]))
  : new Map();

const tidy = (value) => value
  // 课本中的录音/练习图标会被 OCR 误识别成 re)、rw) 等短前缀。
  .replace(/^\s*(?:re|rw)\)\s*/i, "")
  .replace(/^\s*oo\s+(?=Read\b)/i, "")
  .replace(/^\s*we\s+(?=Read\b)/i, "")
  .replace(/^\s*ia\)\s*/i, "")
  .replace(/^\s*cy\s+(?=We\s+can\b)/i, "")
  .replace(/^\s*[¢*}]\s*/, "")
  .replace(/^\s*(?:oe|[|>]+)\s+(?=[A-Za-z])/i, "")
  // 黄色耳机图标在个别听力标题前会被识别成 "od"。
  .replace(/^\s*od\s+(?=[A-Z]\s+Listen\b)/, "")
  .replace(/^\s*•\s+(?=[A-Z]\s+(?:Listen|Read|Look|Write|Tick|Circle|Match|Complete|Finish|Say|Ask|Point|Choose)\b)/, "")
  .replace(/^\s*[a-z]\s+(?=[A-Z])/g, "")
  .replace(/^\s*\|(?=am\b)/i, "I ")
  .replace(/[|l]\s+am\b/g, "I am")
  .replace(/\bIam\b/g, "I am")
  .replace(/\blam\b/g, "I am")
  .replace(/\bListeningactivity\b/g, "Listening activity")
  .replace(/\bIcan\b/g, "I can")
  .replace(/\s+([,.;:!?])/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

function likelyEnglish(text, confidence) {
  // AS 是课本边栏的 Activity Sheet 图标；这一条残缺文字来自圆形编号图标附近。
  if (/^AS$/i.test(text) || /^@\s*Look!\s*T$/i.test(text)) return false;
  const letters = (text.match(/[A-Za-z]/g) ?? []).length;
  const visible = text.replace(/\s/g, "").length;
  const words = text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
  if (letters < 2 || visible === 0 || letters / visible < 0.58 || text.length > 220) return false;
  if (words.length === 1) return words[0].length >= 2 && confidence >= 72;
  return confidence >= 48;
}

function parseLines(directory, file, source, scale = 1) {
  if (!existsSync(join(directory, file))) return [];
  const rows = readFileSync(join(directory, file), "utf8").split(/\r?\n/).slice(1);
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

  return [...groups.values()].map((entry) => {
    const text = tidy(entry.words.join(" "));
    const confidence = Math.round(entry.scores.reduce((sum, item) => sum + item, 0) / entry.scores.length);
    return {
      text,
      left: entry.left / scale,
      top: entry.top / scale,
      right: entry.right / scale,
      bottom: entry.bottom / scale,
      confidence,
      source,
    };
  }).filter((entry) => likelyEnglish(entry.text, entry.confidence));
}

const normalized = (text) => text.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function overlapRatio(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const intersection = width * height;
  const smallest = Math.min((a.right - a.left) * (a.bottom - a.top), (b.right - b.left) * (b.bottom - b.top));
  return smallest > 0 ? intersection / smallest : 0;
}

function similarLine(a, b) {
  const first = normalized(a.text); const second = normalized(b.text);
  if (!first || !second) return false;
  const firstWords = new Set(first.split(/\s+/)); const secondWords = new Set(second.split(/\s+/));
  const sharedWords = [...firstWords].filter((word) => secondWords.has(word)).length;
  const tokenContainment = sharedWords / Math.max(1, Math.min(firstWords.size, secondWords.size));
  const sameText = first === second || tokenContainment >= 0.6 || (Math.min(first.length, second.length) >= 10 && (first.includes(second) || second.includes(first)));
  const closeCenters = Math.abs((a.left + a.right - b.left - b.right) / 2) < 140 && Math.abs((a.top + a.bottom - b.top - b.bottom) / 2) < 48;
  return sameText && (overlapRatio(a, b) >= 0.35 || closeCenters);
}

function joinWrappedLines(lines) {
  const sorted = [...lines].sort((a, b) => a.top - b.top || a.left - b.left);
  const joined = [];
  for (const line of sorted) {
    const previous = joined.at(-1);
    if (previous) {
      const gap = line.top - previous.bottom;
      const horizontalOverlap = Math.max(0, Math.min(previous.right, line.right) - Math.max(previous.left, line.left));
      const overlapShare = horizontalOverlap / Math.max(1, Math.min(previous.right - previous.left, line.right - line.left));
      const continuesSentence = normalized(previous.text).split(/\s+/).length >= 3 && !/[.!?]["']?$/.test(previous.text) && /^[a-z]/.test(line.text);
      if (continuesSentence && gap >= -5 && gap <= 28 && overlapShare >= 0.45) {
        previous.text = tidy(`${previous.text} ${line.text}`);
        previous.left = Math.min(previous.left, line.left); previous.top = Math.min(previous.top, line.top);
        previous.right = Math.max(previous.right, line.right); previous.bottom = Math.max(previous.bottom, line.bottom);
        previous.confidence = Math.round((previous.confidence + line.confidence) / 2);
        continue;
      }
    }
    joined.push({ ...line });
  }
  return joined;
}

function mergeLines(...sets) {
  const merged = [];
  for (const candidate of sets.flat()) {
    const duplicateIndex = merged.findIndex((line) => similarLine(line, candidate) || overlapRatio(line, candidate) >= 0.72);
    if (duplicateIndex < 0) { merged.push(candidate); continue; }
    const current = merged[duplicateIndex];
    if (current.source === "vision" && candidate.source !== "vision") continue;
    if (candidate.source === "vision" && current.source !== "vision") { merged[duplicateIndex] = candidate; continue; }
    const currentText = normalized(current.text); const candidateText = normalized(candidate.text);
    if (candidateText.length > currentText.length || (candidateText.length === currentText.length && candidate.confidence > current.confidence)) merged[duplicateIndex] = candidate;
  }
  return merged.sort((a, b) => a.top - b.top || a.left - b.left);
}

function parseVisionLines(page) {
  return (visionByPage.get(page) ?? []).map((entry) => ({
    text: tidy(entry.text),
    left: entry.x / 100 * 1440,
    top: entry.y / 100 * 1800,
    right: (entry.x + entry.width) / 100 * 1440,
    bottom: (entry.y + entry.height) / 100 * 1800,
    confidence: entry.confidence,
    source: "vision",
  })).filter((entry) => likelyEnglish(entry.text, entry.confidence));
}

function parsePage(file) {
  const page = Number(basename(file).match(/\d+/)?.[0]);
  const dense = parseLines(tsvDir, file, "dense");
  const sparse = parseLines(sparseTsvDir, file, "sparse");
  const enhancedSparse = parseLines(enhancedSparseTsvDir, file, "enhanced-sparse", 2);
  const vision = joinWrappedLines(parseVisionLines(page));
  // Vision 对气泡和细字体最准确；Tesseract 只补充没有重叠的多词短语，避免人物插画里的杂点变成可点击词。
  const fallback = [...dense, ...sparse, ...enhancedSparse].filter((entry) => normalized(entry.text).split(/\s+/).length >= 2);
  const lines = mergeLines(vision, fallback).map((entry, index) => ({
    id: `p${page}-l${index + 1}`,
    text: entry.text,
    x: Number((entry.left / 1440 * 100).toFixed(3)),
    y: Number((entry.top / 1800 * 100).toFixed(3)),
    width: Number(((entry.right - entry.left) / 1440 * 100).toFixed(3)),
    height: Number(((entry.bottom - entry.top) / 1800 * 100).toFixed(3)),
    confidence: entry.confidence,
  }));

  return {
    page,
    bookPage: page >= 9 ? page - 7 : null,
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
