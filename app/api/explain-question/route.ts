import { createLocalExplanation, generateChildFriendlyExplanation, parseExplainQuestionInput } from "@/lib/ai/questionExplainer";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) return Response.json({ error: "请求内容过大" }, { status: 413 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "请求格式错误" }, { status: 400 }); }
  const input = parseExplainQuestionInput(body);
  if (!input) return Response.json({ error: "题目信息不完整" }, { status: 400 });
  const fallback = createLocalExplanation(input);
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return Response.json({ explanation: fallback, fallback: true });
  const explanation = await generateChildFriendlyExplanation(input, apiKey);
  return Response.json({ explanation: explanation ?? fallback, fallback: !explanation });
}
