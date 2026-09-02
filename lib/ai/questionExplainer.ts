import type { QuestionItem } from "@/data/questionBank";

export type ExplainQuestionMode = "explain" | "simplify" | "example";

export type ExplainQuestionInput = {
  question: Pick<QuestionItem, "grade" | "subject" | "knowledgePoint" | "title" | "prompt" | "options" | "answer" | "explanation" | "optionExplanations">;
  selectedAnswer: string;
  answerState: "correct" | "wrong";
  mode: ExplainQuestionMode;
};

export type ChildFriendlyExplanation = {
  opening: string;
  steps: string[];
  keyPoint: string;
  example: string;
  encouragement: string;
  source: "ai" | "local";
};

type ModelResponse = { choices?: Array<{ message?: { content?: string | null } }> };
const allowedModes = new Set<ExplainQuestionMode>(["explain", "simplify", "example"]);

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseExplainQuestionInput(value: unknown): ExplainQuestionInput | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (!body.question || typeof body.question !== "object") return null;
  const raw = body.question as Record<string, unknown>;
  const grade = text(raw.grade, 8);
  const subject = text(raw.subject, 30);
  const knowledgePoint = text(raw.knowledgePoint, 60);
  const title = text(raw.title, 100);
  const prompt = text(raw.prompt, 900);
  const answer = text(raw.answer, 300);
  const explanation = text(raw.explanation, 900);
  const selectedAnswer = text(body.selectedAnswer, 300);
  const answerState = body.answerState === "correct" || body.answerState === "wrong" ? body.answerState : null;
  const mode = allowedModes.has(body.mode as ExplainQuestionMode) ? body.mode as ExplainQuestionMode : "explain";
  if (!/^G[1-8]$/.test(grade) || !subject || !knowledgePoint || !title || !prompt || !answer || !explanation || !selectedAnswer || !answerState) return null;
  const options = Array.isArray(raw.options) ? raw.options.map((item) => text(item, 300)).filter(Boolean).slice(0, 6) : [];
  if (options.length < 2) return null;
  const details = raw.optionExplanations;
  const optionExplanations = details && typeof details === "object" && !Array.isArray(details)
    ? Object.fromEntries(Object.entries(details as Record<string, unknown>).slice(0, 6).map(([key, detail]) => [text(key, 300), text(detail, 600)]).filter(([key, detail]) => key && detail))
    : undefined;
  return { question: { grade, subject, knowledgePoint, title, prompt, options, answer, explanation, optionExplanations }, selectedAnswer, answerState, mode };
}

export function createLocalExplanation(input: ExplainQuestionInput): ChildFriendlyExplanation {
  const selectedDetail = input.question.optionExplanations?.[input.selectedAnswer];
  const correctDetail = input.question.optionExplanations?.[input.question.answer];
  return {
    opening: input.answerState === "correct" ? "我们把刚才的思路再看清楚。" : "我们换一种更简单的方法来看。",
    steps: [
      `先找题目在问什么：${input.question.knowledgePoint}。`,
      selectedDetail ? `你选的答案可以这样理解：${selectedDetail}` : `再检查“${input.selectedAnswer}”是否符合题目的全部信息。`,
      correctDetail ? `正确思路是：${correctDetail}` : input.question.explanation,
    ],
    keyPoint: `记住：${input.question.explanation}`,
    example: `换一个相似情境时，也先找出和“${input.question.knowledgePoint}”有关的线索。`,
    encouragement: "慢慢找线索，你已经在学会真正理解题目了。",
    source: "local",
  };
}

function parseJson(content: string): unknown {
  const clean = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try { return JSON.parse(clean); } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try { return JSON.parse(clean.slice(start, end + 1)); } catch { return null; }
  }
}

function validateExplanation(value: unknown): Omit<ChildFriendlyExplanation, "source"> | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const opening = text(item.opening, 120);
  const keyPoint = text(item.keyPoint, 240);
  const example = text(item.example, 300);
  const encouragement = text(item.encouragement, 100);
  const steps = Array.isArray(item.steps) ? item.steps.map((step) => text(step, 260)).filter(Boolean).slice(0, 4) : [];
  return opening && steps.length >= 2 && keyPoint && example && encouragement ? { opening, steps, keyPoint, example, encouragement } : null;
}

export async function generateChildFriendlyExplanation(input: ExplainQuestionInput, apiKey: string): Promise<ChildFriendlyExplanation | null> {
  const ageStyle = ["G1", "G2"].includes(input.question.grade)
    ? "面向3至6岁孩子：每句话短而具体，多用生活中的物品作比喻，不使用术语。"
    : ["G3", "G4"].includes(input.question.grade)
      ? "面向小学低年级：一次只讲一个步骤，用简单完整句。"
      : "面向小学中高年级：清楚说明线索、判断过程和可迁移的方法。";
  const modeInstruction = input.mode === "simplify" ? "孩子仍没听懂，请比上一次更简单并换一种说法。" : input.mode === "example" ? "重点给一个新的、同知识点但不重复原题的生活化例子。" : "第一次讲解，请从题干线索开始一步步带孩子理解。";
  const system = `你是儿童学习网站里的“小鹿老师”。只讲解给定题目，不回答题目以外的问题。${ageStyle}${modeInstruction}语气亲切、耐心，不羞辱，不索取个人信息，不提供链接、广告、成人内容或危险建议。孩子已经提交答案，可以说明正确答案，但必须重点讲“为什么”和“以后怎么判断”。只用简体中文；英文词句保持原文。只输出JSON：{"opening":"一句开场","steps":["步骤1","步骤2","步骤3"],"keyPoint":"一句可迁移的重点","example":"一个简短的新例子或小问题","encouragement":"一句具体而克制的鼓励"}。`;
  const user = JSON.stringify({ 年级: input.question.grade, 学科: input.question.subject, 知识点: input.question.knowledgePoint, 题目: input.question.prompt, 选项: input.question.options, 孩子的选择: input.selectedAnswer, 是否答对: input.answerState === "correct", 正确答案: input.question.answer, 本地解析: input.question.explanation, 逐项解析: input.question.optionExplanations });
  let response: Response;
  try {
    response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: system }, { role: "user", content: user }], response_format: { type: "json_object" }, thinking: { type: "disabled" }, temperature: 0.35, max_tokens: 850, stream: false }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch { return null; }
  if (!response.ok) return null;
  const content = ((await response.json()) as ModelResponse).choices?.[0]?.message?.content;
  if (!content) return null;
  const result = validateExplanation(parseJson(content));
  return result ? { ...result, source: "ai" } : null;
}
