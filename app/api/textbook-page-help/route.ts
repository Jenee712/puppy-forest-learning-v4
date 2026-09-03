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

const textbookLabels: Record<string, PageHelp> = {
  "a listen and write the numbers 1 3 in the correct boxes": {
    translation: "A　听录音，在正确的方框里写上数字1至3。",
    childExplanation: "先听录音里的内容，再判断每段录音对应哪一幅图片，最后把数字写进图片旁边的方框。",
    keyPoints: ["第一遍先听懂大意", "第二遍核对人物和生日蜡烛上的数字"],
    exampleEn: "Listen and write the correct number.",
    exampleZh: "听录音并写出正确的数字。",
  },
  "structure table": {
    translation: "句型结构表",
    childExplanation: "这里把句子的组成方式整理成表格，帮助你看清每个词应该放在哪里。",
    keyPoints: ["先看句子开头", "再看人物、动作或物品的位置"],
    exampleEn: "This is my friend.",
    exampleZh: "这是我的朋友。",
  },
  reading: {
    translation: "阅读",
    childExplanation: "这一部分要读短文或故事，看看人物做了什么、说了什么。",
    keyPoints: ["先看图片猜内容", "再读英文找人物和动作"],
    exampleEn: "Read the story.",
    exampleZh: "读一读这个故事。",
  },
  "language focus": {
    translation: "语言重点",
    childExplanation: "这一部分会学习本课最重要的句型和表达方法。",
    keyPoints: ["留意句子结构", "试着换一个词再说一遍"],
    exampleEn: "This is my teacher.",
    exampleZh: "这是我的老师。",
  },
  vocabulary: {
    translation: "词汇",
    childExplanation: "这一部分会学习本课的新单词。先听发音，再结合图片记住意思。",
    keyPoints: ["听清单词发音", "把单词放进短句里"],
    exampleEn: "This is a book.",
    exampleZh: "这是一本书。",
  },
  phonics: {
    translation: "自然拼读",
    childExplanation: "这一部分学习字母或字母组合的发音，帮助你看到单词就能尝试读出来。",
    keyPoints: ["先听目标音", "再跟读含有这个音的单词"],
    exampleEn: "Listen and say.",
    exampleZh: "听一听，说一说。",
  },
  skill: {
    translation: "学习技能",
    childExplanation: "这里告诉你这一页要练习哪一种英语能力。",
    keyPoints: ["先看清任务", "按步骤完成练习"],
    exampleEn: "Listen and read.",
    exampleZh: "听一听，读一读。",
  },
  task: {
    translation: "任务",
    childExplanation: "这里是需要你完成的小任务，先看要求，再一步一步做。",
    keyPoints: ["先读任务要求", "完成后再检查一次"],
    exampleEn: "Complete the task.",
    exampleZh: "完成这项任务。",
  },
  "your task": {
    translation: "你的任务",
    childExplanation: "轮到你运用刚学过的单词和句型完成任务了。",
    keyPoints: ["回想本课句型", "大胆开口表达"],
    exampleEn: "Talk about your friend.",
    exampleZh: "说一说你的朋友。",
  },
  values: {
    translation: "品德成长",
    childExplanation: "这里会通过英语内容学习友善、礼貌和好习惯。",
    keyPoints: ["理解故事里的做法", "想想自己可以怎样做"],
    exampleEn: "Be kind to your friends.",
    exampleZh: "友善地对待朋友。",
  },
  extension: {
    translation: "拓展学习",
    childExplanation: "这里会在课本内容上多学一点，帮助你把英语用到新的情境里。",
    keyPoints: ["先复习课本内容", "再尝试新的表达"],
    exampleEn: "Try another example.",
    exampleZh: "再试一个例子。",
  },
  "post reading": {
    translation: "阅读后练习",
    childExplanation: "读完故事后，用这些问题检查自己是否看懂了。",
    keyPoints: ["回到原文找答案", "用完整句子回答"],
    exampleEn: "Answer the questions.",
    exampleZh: "回答这些问题。",
  },
  "you will learn to": {
    translation: "你将学会……",
    childExplanation: "这里列出这一单元完成后你能学会的英语本领。",
    keyPoints: ["先看看学习目标", "学完后回来检查"],
    exampleEn: "You will learn to introduce yourself.",
    exampleZh: "你将学会介绍自己。",
  },
};

function localHelp(text: string): PageHelp | null {
  const key = normalize(text);
  if (!key) return null;
  if (textbookLabels[key]) return textbookLabels[key];
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
