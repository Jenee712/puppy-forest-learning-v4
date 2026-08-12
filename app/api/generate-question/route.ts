import { getCourseQuestion } from "@/data/questionBank";
import { DeepSeekGenerationError, generateWithDeepSeek, parseGenerateQuestionInput, type DeepSeekFailureCode } from "@/lib/ai/questionGenerator";

const failureReasons: Record<DeepSeekFailureCode, string> = {
  auth: "智能出题服务认证失败，已使用本地核心题",
  balance: "智能出题额度不足，已使用本地核心题",
  rate_limit: "智能出题请求较多，请稍后再试；本次已使用本地核心题",
  timeout: "智能出题等待超时，已使用本地核心题",
  provider: "智能出题服务暂时不可用，已使用本地核心题",
  empty: "智能题返回内容为空，已自动重试并使用本地核心题",
  invalid_json: "智能题格式不完整，已自动重试并使用本地核心题",
  validation: "智能题未通过答案与格式审核，已使用本地核心题",
};

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
    if (question) return Response.json({ question, engine: "ai_model", fallback: false });
  } catch (error) {
    const failureCode = error instanceof DeepSeekGenerationError ? error.code : "provider";
    console.warn("[smart-question-fallback]", { failureCode, grade: input.grade, subject: input.subject, knowledgePoint: input.knowledgePoint });
    return Response.json({ question: fallbackQuestion, engine: "local_core", fallback: true, failureCode, reason: failureReasons[failureCode] });
  }
  return Response.json({ question: fallbackQuestion, engine: "local_core", fallback: true, failureCode: "validation", reason: failureReasons.validation });
}
