import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the V4 learning platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /小狗的森林学堂 V4/);
  assert.match(html, /八级成长路线/);
  assert.match(html, /G1/);
  assert.match(html, /G8/);
  assert.match(html, /grade-card sunny selected/);
  assert.doesNotMatch(html, /grade-card sun selected/);
  assert.match(html, /已切换到/);
  assert.match(html, /绘本馆/);
  assert.match(html, /32<!-- --> 个学习站/);
  assert.match(html, /先从眼前的三小步开始/);
  assert.match(html, /英语兴趣[\s\S]*?<em>3<!-- -->站<\/em>/);
  assert.match(html, /完整路线共有[\s\S]*?32<!-- --> 站/);
  assert.match(html, /跳到主要内容/);
  assert.match(html, /绘本/);
  assert.match(html, /永久解锁/);
  assert.doesNotMatch(html, /DeepSeek/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});
