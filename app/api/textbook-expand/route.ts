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
    && Array.isArray(item.focus) && item.focus.length === item.knowledge.length
    && item.focus.every((group) => Array.isArray(group) && group.length >= 1 && group.length <= 4
      && group.every((entry) => entry && typeof entry.term === "string" && typeof entry.meaning === "string"))
    && typeof item.challengeEn === "string" && item.challengeEn.length >= 6 && item.challengeEn.length <= 180;
}

function parseJson(text: string) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned) as unknown;
}

const unit3PageStudy: Record<number, Pick<PleExpansion, "knowledgeEn" | "knowledge" | "focus" | "challengeEn" | "challenge">> = {
  26: { knowledgeEn: ["Open the door, please.", "Point to the computer, please.", "Don't look at the window."], knowledge: ["请开门。", "请指向电脑。", "不要看窗户。"], focus: [[{ term: "open the door", meaning: "开门" }], [{ term: "point to", meaning: "指向" }, { term: "computer", meaning: "电脑" }], [{ term: "don't", meaning: "不要" }, { term: "window", meaning: "窗户" }]], challengeEn: "Can you follow these three classroom instructions?", challenge: "你能按顺序完成这三条课堂指令吗？" },
  27: { knowledgeEn: ["What things can you see in your classroom?", "Talk about things we have.", "Write a comic strip about a magic lesson."], knowledge: ["你能在教室里看见哪些东西？", "说一说我们拥有的物品。", "写一则关于魔法课的连环漫画。"], focus: [[{ term: "classroom", meaning: "教室" }, { term: "can you see", meaning: "你能看见" }], [{ term: "talk about", meaning: "谈论" }, { term: "have", meaning: "拥有" }], [{ term: "comic strip", meaning: "连环漫画" }, { term: "magic lesson", meaning: "魔法课" }]], challengeEn: "Name three things you can see in your classroom.", challenge: "请用英语说出教室里的三样东西。" },
  28: { knowledgeEn: ["Good morning, class.", "Look at the blackboard, please.", "Please open your books and turn to page six."], knowledge: ["同学们，早上好。", "请看黑板。", "请打开书并翻到第六页。"], focus: [[{ term: "good morning", meaning: "早上好" }, { term: "class", meaning: "全班同学" }], [{ term: "look at", meaning: "看" }, { term: "blackboard", meaning: "黑板" }], [{ term: "open your books", meaning: "打开书" }, { term: "turn to", meaning: "翻到" }]], challengeEn: "Can you say the three instructions in the story?", challenge: "你能跟着故事说出这三条课堂指令吗？" },
  29: { knowledgeEn: ["Sorry I am late, Miss Bear.", "Please come in, Jerry.", "Are you OK?"], knowledge: ["熊老师，对不起，我迟到了。", "Jerry，请进。", "你还好吗？"], focus: [[{ term: "sorry", meaning: "对不起" }, { term: "late", meaning: "迟到的" }], [{ term: "come in", meaning: "进来" }, { term: "please", meaning: "请" }], [{ term: "Are you OK?", meaning: "你还好吗？" }]], challengeEn: "What can you say when a classmate needs help?", challenge: "同学需要帮助时，你可以对他说什么？" },
  30: { knowledgeEn: ["Read the story again.", "Put them in the correct order.", "Now listen and circle the words you hear."], knowledge: ["再读一遍故事。", "把它们按正确顺序排列。", "现在听一听，圈出你听到的单词。"], focus: [[{ term: "again", meaning: "再一次" }, { term: "read", meaning: "阅读" }], [{ term: "correct order", meaning: "正确顺序" }, { term: "put", meaning: "放置" }], [{ term: "listen", meaning: "听" }, { term: "circle", meaning: "圈出" }]], challengeEn: "Can you hear the difference between sit and six?", challenge: "你能听出 sit 和 six 的不同吗？" },
  31: { knowledgeEn: ["Come in, please.", "Close the door, please.", "Point to the computer, please."], knowledge: ["请进。", "请关门。", "请指向电脑。"], focus: [[{ term: "come in", meaning: "进来" }], [{ term: "close the door", meaning: "关门" }], [{ term: "point to", meaning: "指向" }, { term: "computer", meaning: "电脑" }]], challengeEn: "Can you point to a door, a desk and a chair?", challenge: "你能分别指出门、书桌和椅子吗？" },
  32: { knowledgeEn: ["Stand up, please.", "Turn around.", "Clap your hands."], knowledge: ["请站起来。", "转一圈。", "拍拍手。"], focus: [[{ term: "stand up", meaning: "站起来" }], [{ term: "turn around", meaning: "转身／转一圈" }], [{ term: "clap", meaning: "拍" }, { term: "your hands", meaning: "你的双手" }]], challengeEn: "Listen and do the three actions in the correct order.", challenge: "听一听，并按正确顺序完成三个动作。" },
  33: { knowledgeEn: ["Point to the computer, please.", "The first pupil gets one point.", "Play the game in groups of three."], knowledge: ["请指向电脑。", "第一位指出正确物品的同学得一分。", "三人一组玩这个游戏。"], focus: [[{ term: "point to", meaning: "指向" }], [{ term: "first pupil", meaning: "第一位同学" }, { term: "one point", meaning: "一分" }], [{ term: "groups of three", meaning: "三人一组" }, { term: "play the game", meaning: "玩游戏" }]], challengeEn: "Give one Point to... instruction to a friend.", challenge: "请对朋友说一条以 Point to... 开头的指令。" },
  34: { knowledgeEn: ["Robot Rex, don't look at me.", "Robot Rex, stand up, please.", "Sorry. That is wrong!"], knowledge: ["机器人 Rex，不要看我。", "机器人 Rex，请站起来。", "对不起，那是错的！"], focus: [[{ term: "don't", meaning: "不要" }, { term: "look at", meaning: "看" }], [{ term: "stand up", meaning: "站起来" }], [{ term: "wrong", meaning: "错误的" }, { term: "sorry", meaning: "对不起" }]], challengeEn: "Can you give Robot Rex one do and one don't instruction?", challenge: "你能给机器人 Rex 一条要做和一条不要做的指令吗？" },
  35: { knowledgeEn: ["Look at the blackboard.", "Open the door.", "Close the door."], knowledge: ["看黑板。", "打开门。", "关上门。"], focus: [[{ term: "look at", meaning: "看" }, { term: "blackboard", meaning: "黑板" }], [{ term: "open", meaning: "打开" }, { term: "door", meaning: "门" }], [{ term: "close", meaning: "关上" }, { term: "door", meaning: "门" }]], challengeEn: "Listen and choose the correct picture for each instruction.", challenge: "听指令，为每一句选出正确图片。" },
  36: { knowledgeEn: ["Some signs give us instructions.", "They tell us what to do and what not to do.", "Some signs only have pictures."], knowledge: ["有些标志会给我们指示。", "它们告诉我们该做什么、不该做什么。", "有些标志只有图画。"], focus: [[{ term: "signs", meaning: "标志" }, { term: "instructions", meaning: "指示" }], [{ term: "what to do", meaning: "该做什么" }, { term: "what not to do", meaning: "不该做什么" }], [{ term: "only", meaning: "只有" }, { term: "pictures", meaning: "图画" }]], challengeEn: "What does an EXIT sign tell you to do?", challenge: "EXIT（出口）标志告诉你应该怎么做？" },
  37: { knowledgeEn: ["You can see signs at school and outside school.", "Do not feed the animals.", "Make a sign for your classroom."], knowledge: ["你在学校内外都能看见标志。", "不要给动物喂食。", "为你的教室制作一个标志。"], focus: [[{ term: "at school", meaning: "在学校" }, { term: "outside school", meaning: "在校外" }], [{ term: "do not", meaning: "不要" }, { term: "feed", meaning: "喂食" }], [{ term: "make a sign", meaning: "制作标志" }, { term: "classroom", meaning: "教室" }]], challengeEn: "Draw one classroom sign and say what it means.", challenge: "画一个教室标志，再说说它是什么意思。" },
};

function vocabularyFocus(found: NonNullable<ReturnType<typeof findPle1aLesson>>, sentence: string) {
  const normalized = sentence.toLowerCase();
  const matched = found.lesson.vocabulary.filter((item) => normalized.includes(item.word.toLowerCase())).slice(0, 3);
  return (matched.length ? matched : found.lesson.vocabulary.slice(0, 2)).map((item) => ({ term: item.word, meaning: item.meaning }));
}

function childStudyFallback(found: NonNullable<ReturnType<typeof findPle1aLesson>>, pageContext: string, bookPage: number | null): PleExpansion {
  const pageStudy = bookPage === null ? null : unit3PageStudy[bookPage];
  if (pageStudy) return { titleEn: "Listen, understand and say", title: "听一听、懂意思、自己说", ...pageStudy };
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
    focus: sentences.map((sentence) => vocabularyFocus(found, sentence.en)),
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
  const bookPage = pdfPage ? pdfPage - 7 : null;
  const found = lessonId ? findPle1aLesson(lessonId) : bookPage ? findPle1aLessonByBookPage(bookPage) : null;
  if (!found) return Response.json({ error: "没有找到这个教材课时" }, { status: 404 });

  const fallback = childStudyFallback(found, pageContext, bookPage);
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
          { role: "system", content: "你是陪香港小学一年级孩子预习和复习英语的亲切老师。只依据当前教材页生成孩子可以直接听、跟读、理解和回答的中英双语练习，不写备课建议，不对家长或教师说话，不使用‘教学目标、建议教师、引导学生’等措辞。英文要短、自然、适合6至7岁儿童；中文使用简体字。不得编造教材内容。只输出JSON，不要Markdown。JSON结构必须是：{\"titleEn\":\"给孩子看的英文短标题\",\"title\":\"对应中文标题\",\"knowledgeEn\":[\"本页重点英文句1\",\"本页重点英文句2\",\"本页重点英文句3\"],\"knowledge\":[\"句1的准确中文\",\"句2的准确中文\",\"句3的准确中文\"],\"focus\":[[{\"term\":\"句1重点词或词组\",\"meaning\":\"中文意思\"}],[{\"term\":\"句2重点词或词组\",\"meaning\":\"中文意思\"}],[{\"term\":\"句3重点词或词组\",\"meaning\":\"中文意思\"}]],\"challengeEn\":\"孩子能直接回答或模仿的英文问题\",\"challenge\":\"对应中文问题\"}。三组knowledgeEn、knowledge、focus必须逐项对应；每句提取1至3个真正出现在句中的重点词或词组。" },
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
