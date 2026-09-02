import { ple1aUnits } from "@/data/ple1aCourse";

const API_URL = "https://api.deepseek.com/chat/completions";

type PageHelp = {
  translation: string;
  childExplanation: string;
  keyPoints: string[];
  exampleEn: string;
  exampleZh: string;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function localHelp(text: string): PageHelp | null {
  const key = normalize(text);
  if (!key) return null;
  for (const unit of ple1aUnits) {
    for (const lesson of unit.lessons) {
      for (const sentence of lesson.sentences) {
        const sentenceKey = normalize(sentence.en);
        if (sentenceKey.length >= 4 && (key.includes(sentenceKey) || sentenceKey.includes(key))) {
          return {
            translation: sentence.zh,
            childExplanation: sentence.tip ?? `这句话来自“${lesson.subtitle}”，先听一遍，再跟着读一遍。`,
            keyPoints: lesson.knowledge.slice(0, 2),
            exampleEn: sentence.en,
            exampleZh: sentence.zh,
          };
        }
      }
      for (const word of lesson.vocabulary) {
        if (key === normalize(word.word)) {
          return {
            translation: word.meaning,
            childExplanation: `这是“${lesson.subtitle}”中的重点词。听清第一个声音，再试着放进一句话里。`,
            keyPoints: [word.note ?? `${word.word}：${word.meaning}`, lesson.knowledge[0]],
            exampleEn: lesson.sentences.find((item) => normalize(item.en).includes(key))?.en ?? `I can use the word ${word.word}.`,
            exampleZh: lesson.sentences.find((item) => normalize(item.en).includes(key))?.zh ?? `我会使用${word.word}这个词。`,
          };
        }
      }
    }
  }
  return null;
}

function parseJson(text: string): unknown {
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
}

function validHelp(value: unknown): value is PageHelp {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PageHelp>;
  return typeof item.translation === "string" && item.translation.length > 0 && item.translation.length <= 300
    && typeof item.childExplanation === "string" && item.childExplanation.length > 0 && item.childExplanation.length <= 360
    && Array.isArray(item.keyPoints) && item.keyPoints.length >= 1 && item.keyPoints.length <= 4
    && item.keyPoints.every((line) => typeof line === "string" && line.length <= 180)
    && typeof item.exampleEn === "string" && item.exampleEn.length <= 220
    && typeof item.exampleZh === "string" && item.exampleZh.length <= 220;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_000) return Response.json({ error: "请求内容过大" }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "请求格式错误" }, { status: 400 }); }
  const data = typeof body === "object" && body !== null ? body as { text?: unknown; page?: unknown; context?: unknown } : {};
  const text = typeof data.text === "string" ? data.text.trim().slice(0, 500) : "";
  const page = typeof data.page === "number" ? Math.max(1, Math.min(98, Math.round(data.page))) : 1;
  const context = typeof data.context === "string" ? data.context.trim().slice(0, 1_200) : "";
  if (!text || !/[A-Za-z]/.test(text)) return Response.json({ error: "没有可讲解的英文" }, { status: 400 });

  const fallback = localHelp(text);
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    if (fallback) return Response.json({ help: fallback, fallback: true });
    return Response.json({
      help: {
        translation: "这段原文尚未完成中文校对。可以先点击发音，结合课本图片理解。",
        childExplanation: "先听关键词，再看看人物、动作和场景。老师稍后会补充准确翻译。",
        keyPoints: ["先找人物或物品", "再找动作词", "最后看句末标点判断语气"],
        exampleEn: text,
        exampleZh: "待校对",
      } satisfies PageHelp,
      fallback: true,
      needsReview: true,
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.15,
        max_tokens: 650,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "你是香港小学一年级英语老师。准确翻译用户给出的教材英文，只用简体中文；用亲切、清楚、适合6至7岁儿童的语言讲解，但不要夸张鼓励，不编造教材内容。输出JSON：{\"translation\":\"准确中文翻译\",\"childExplanation\":\"孩子能懂的讲解\",\"keyPoints\":[\"重点1\",\"重点2\"],\"exampleEn\":\"一个同难度英文例句\",\"exampleZh\":\"例句中文\"}。" },
          { role: "user", content: `PLE 1A扫描页：PDF第${page}页。\n本页OCR上下文：${context}\n孩子点击的英文：${text}` },
        ],
      }),
    });
    if (!response.ok) throw new Error(`provider_${response.status}`);
    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const parsed = parseJson(result.choices?.[0]?.message?.content ?? "");
    if (!validHelp(parsed)) throw new Error("invalid_help");
    return Response.json({ help: parsed, fallback: false });
  } catch (error) {
    console.warn("[textbook-page-help-fallback]", error instanceof Error ? error.message : "unknown");
    if (fallback) return Response.json({ help: fallback, fallback: true });
    return Response.json({ error: "智能讲解暂时不可用，请稍后再试" }, { status: 503 });
  } finally {
    clearTimeout(timer);
  }
}
