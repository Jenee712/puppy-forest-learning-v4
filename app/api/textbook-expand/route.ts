import { findPle1aLesson, type PleExpansion } from "@/data/ple1aCourse";

const API_URL = "https://api.deepseek.com/chat/completions";

function validExpansion(value: unknown): value is PleExpansion {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PleExpansion>;
  return typeof item.title === "string" && item.title.length >= 2 && item.title.length <= 40
    && Array.isArray(item.knowledge) && item.knowledge.length >= 3 && item.knowledge.length <= 5
    && item.knowledge.every((line) => typeof line === "string" && line.length >= 4 && line.length <= 100)
    && typeof item.challenge === "string" && item.challenge.length >= 6 && item.challenge.length <= 160
    && typeof item.titleEn === "string" && item.titleEn.length >= 2 && item.titleEn.length <= 60
    && Array.isArray(item.knowledgeEn) && item.knowledgeEn.length === item.knowledge.length
    && item.knowledgeEn.every((line) => typeof line === "string" && line.length >= 4 && line.length <= 140)
    && typeof item.challengeEn === "string" && item.challengeEn.length >= 6 && item.challengeEn.length <= 180;
}

function parseJson(text: string) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned) as unknown;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 2_000) return Response.json({ error: "请求内容过大" }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "请求格式错误" }, { status: 400 }); }
  const lessonId = typeof body === "object" && body !== null && typeof (body as { lessonId?: unknown }).lessonId === "string" ? (body as { lessonId: string }).lessonId : "";
  const found = findPle1aLesson(lessonId);
  if (!found) return Response.json({ error: "没有找到这个教材课时" }, { status: 404 });

  const fallback = found.lesson.expansion;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return Response.json({ expansion: fallback, fallback: true });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  const lessonSummary = {
    unit: `${found.unit.title}（${found.unit.zh}）`,
    lesson: found.lesson.title,
    goals: found.lesson.goals,
    vocabulary: found.lesson.vocabulary,
    sentences: found.lesson.sentences,
    knowledge: found.lesson.knowledge,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        temperature: 0.25,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "你是香港小学一年级英语老师。只依据给定教材课时做安全、准确的中英双语知识拓展。英文要短、自然、适合6至7岁儿童；中文只用简体字。语气亲切；不涉及政治、医疗、成人内容、消费品牌，不编造课本事实。只输出JSON，不要Markdown。JSON结构必须是：{\"titleEn\":\"English title\",\"title\":\"中文短标题\",\"knowledgeEn\":[\"English point 1\",\"English point 2\",\"English point 3\"],\"knowledge\":[\"中文知识1\",\"中文知识2\",\"中文知识3\"],\"challengeEn\":\"English challenge\",\"challenge\":\"中文挑战\"}。knowledgeEn与knowledge必须逐项对应。" },
          { role: "user", content: `请围绕这节PLE 1A课生成一组不同于原有知识点、但难度适中的拓展：${JSON.stringify(lessonSummary)}` },
        ],
      }),
    });
    if (!response.ok) throw new Error(`provider_${response.status}`);
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const parsed = parseJson(data.choices?.[0]?.message?.content ?? "");
    if (!validExpansion(parsed)) throw new Error("invalid_expansion");
    return Response.json({ expansion: parsed, fallback: false });
  } catch (error) {
    console.warn("[textbook-expansion-fallback]", error instanceof Error ? error.message : "unknown");
    return Response.json({ expansion: fallback, fallback: true });
  } finally {
    clearTimeout(timer);
  }
}
