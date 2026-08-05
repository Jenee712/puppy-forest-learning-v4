import { getCourseQuestion } from "@/data/questionBank";
import { generateWithDeepSeek, parseGenerateQuestionInput } from "@/lib/ai/questionGenerator";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) return Response.json({ error: "请求内容过大" }, { status: 413 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "请求格式错误" }, { status: 400 }); }
  const input = parseGenerateQuestionInput(body);
  if (!input) return Response.json({ error: "等级、学科或知识点不符合要求" }, { status: 400 });

  const fallbackQuestion = getCourseQuestion(input.subject, input.grade);
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return Response.json({ question: fallbackQuestion, engine: "local_core", fallback: true, reason: "AI服务尚未配置，已使用本地核心题" });

  try {
    const question = await generateWithDeepSeek(input, apiKey);
    if (question) return Response.json({ question, engine: "deepseek-v4-flash", fallback: false });
  } catch { /* 网络、超时或供应商异常时使用保底题 */ }
  return Response.json({ question: fallbackQuestion, engine: "local_core", fallback: true, reason: "智能题未通过审核，已使用本地核心题" });
}
