import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pages = JSON.parse(readFileSync(new URL("../data/ple1aPageText.generated.json", import.meta.url), "utf8"));
const lines = pages.flatMap((page) => page.lines.map((line) => ({ page: page.page, ...line })));

test("PLE 1A 点读数据覆盖全部教材页且坐标有效", () => {
  assert.equal(pages.length, 98);
  assert.equal(pages.find((page) => page.page === 9)?.bookPage, 2);
  assert.equal(pages.find((page) => page.page === 17)?.bookPage, 10);
  assert.equal(pages.find((page) => page.page === 34)?.bookPage, 27);
  assert.ok(lines.length >= 1800);
  for (const line of lines) {
    assert.ok(line.x >= 0 && line.y >= 0 && line.width > 0 && line.height > 0);
    assert.ok(line.x + line.width <= 100.01 && line.y + line.height <= 100.01);
  }
});

test("漫画对话页包含完整关键对白", () => {
  const page35 = pages.find((page) => page.page === 35).lines.map((line) => line.text);
  for (const sentence of [
    "Good morning, class.",
    "Good morning, Miss Bear",
    "Look at the blackboard, please.",
    "Sit down, Mimi. Don't stand up.",
    "Sorry, I can't see the blackboard.",
    "Thank you, Elly.",
    "Please open your books and turn to page six.",
  ]) assert.ok(page35.includes(sentence), `Missing dialogue: ${sentence}`);
});

test("已知录音图标 OCR 残字不会进入点读文本", () => {
  const artifacts = lines.filter((line) => /^(?:re|rw)\)|^(?:oo|we)\s+Read\b|^ia\)|^cy\s+We\b|^od\s+[A-Z]\s+Listen\b|^•\s+[A-Z]\s+Listen\b|^AS$|^@\s*Look!\s*T$/i.test(line.text));
  assert.deepEqual(artifacts, []);
});
