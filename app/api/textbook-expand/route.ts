import { findPle1aLesson, findPle1aLessonByBookPage, type PleExpansion } from "@/data/ple1aCourse";

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

function childStudyFallback(found: NonNullable<ReturnType<typeof findPle1aLesson>>, pageContext: string): PleExpansion {
  const normalizedContext = pageContext.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const ranked = [...found.lesson.sentences].sort((a, b) => {
    const score = (sentence: string) => normalizedContext.includes(sentence.toLowerCase().replace(/[^a-z0-9]+/g, " ")) ? 1 : 0;
    return score(b.en) - score(a.en);
  });
  const sentences = ranked.slice(0, 3);
  const focusWord = found.lesson.vocabulary[0];
  return {
    titleEn: "Listen, read and say",
    title: "先听、再读、自己说",
    knowledgeEn: sentences.map((sentence) => sentence.en),
    knowledge: sentences.map((sentence) => sentence.zh),
    challengeEn: focusWord ? `Can you use "${focusWord.word}" in a new sentence?` : "Can you say one sentence from this page by yourself?",
    challenge: focusWord ? `你能用“${focusWord.word}”自己说一个新句子吗？` : "你能不看提示，自己说出本页的一句话吗？",
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 5_000) return Response.json({ error: "请求内容过大" }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "请求格式错误" }, { status: 400 }); }
  const data = typeof body === "object" && body !== null ? body as { lessonId?: unknown; page?: unknown; context?: unknown } : {};
  const lessonId = typeof data.lessonId === "string" ? data.lessonId : "";
  const pdfPage = typeof data.page === "number" ? Math.max(1, Math.min(98, Math.round(data.page))) : null;
  const pageContext = typeof data.context === "string" ? data.context.trim().slice(0, 1_600) : "";
  const found = lessonId ? findPle1aLesson(lessonId) : pdfPage ? findPle1aLessonByBookPage(pdfPage - 7) : null;
  if (!found) return Response.json({ error: "没有找到这个教材课时" }, { status: 404 });

  const fallback = childStudyFallback(found, pageContext);
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
    page: pdfPage ? `PDF第${pdfPage}页／课本第${pdfPage - 7}页` : found.lesson.pages,
    pageText: pageContext,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.25,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "你是陪香港小学一年级孩子预习和复习英语的亲切老师。只依据当前教材页生成孩子可以直接听、跟读、理解和回答的中英双语练习，不写备课建议，不对家长或教师说话，不使用‘教学目标、建议教师、引导学生’等措辞。英文要短、自然、适合6至7岁儿童；中文使用简体字。不得编造教材内容。只输出JSON，不要Markdown。JSON结构必须是：{\"titleEn\":\"给孩子看的英文短标题\",\"title\":\"对应中文标题\",\"knowledgeEn\":[\"本页重点英文句1\",\"本页重点英文句2\",\"本页重点英文句3\"],\"knowledge\":[\"句1的准确中文和简短提示\",\"句2的准确中文和简短提示\",\"句3的准确中文和简短提示\"],\"challengeEn\":\"孩子能直接回答或模仿的英文问题\",\"challenge\":\"对应中文问题\"}。knowledgeEn与knowledge必须逐项对应。" },
          { role: "user", content: `请把这一页整理成“预习—跟读—理解—复习小测”，优先使用本页出现的词句，不讲本页未出现的难词：${JSON.stringify(lessonSummary)}` },
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
