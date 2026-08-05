import type { QuestionItem } from "@/data/questionBank";

export type GenerateQuestionInput = {
  grade: string;
  subject: string;
  knowledgePoint: string;
  difficulty: 1 | 2 | 3;
  avoidTitles?: string[];
};

type DeepSeekResponse = { choices?: Array<{ message?: { content?: string | null } }> };

export type DeepSeekFailureCode = "auth" | "balance" | "rate_limit" | "timeout" | "provider" | "empty" | "invalid_json" | "validation";

export class DeepSeekGenerationError extends Error {
  readonly code: DeepSeekFailureCode;

  constructor(code: DeepSeekFailureCode) {
    super(code);
    this.name = "DeepSeekGenerationError";
    this.code = code;
  }
}

const gradeProfiles: Record<string, string> = {
  G1: "3至4岁幼儿，口语化、短句、依靠生活经验和图像提示",
  G2: "5至6岁幼小衔接，规则意识、数量关系和基础表达",
  G3: "7岁，小学一年级，识字数感和简短英语表达",
  G4: "8岁，小学二年级，基础阅读、运算和观察",
  G5: "9岁，小学三年级，段落理解、两步应用和基础英语语法",
  G6: "10岁，小学四年级，多步推理、小数应用和英语语境",
  G7: "11岁，小学五年级，分数应用、信息整合和综合表达",
  G8: "12岁，小学六年级，百分数、观点论证和英语阅读推断",
};

const allowedSubjects = new Set(["语言表达", "数量与空间", "科学探索", "健康习惯", "社会认知", "艺术创造", "英语兴趣", "语文", "数学", "英语", "科学", "阅读与表达", "综合素养"]);

export function parseGenerateQuestionInput(value: unknown): GenerateQuestionInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (typeof input.grade !== "string" || !gradeProfiles[input.grade]) return null;
  if (typeof input.subject !== "string" || !allowedSubjects.has(input.subject)) return null;
  if (typeof input.knowledgePoint !== "string" || input.knowledgePoint.trim().length < 2 || input.knowledgePoint.length > 50) return null;
  if (![1, 2, 3].includes(Number(input.difficulty))) return null;
  const avoidTitles = Array.isArray(input.avoidTitles) ? input.avoidTitles.filter((item): item is string => typeof item === "string").slice(0, 10) : undefined;
  return { grade: input.grade, subject: input.subject, knowledgePoint: input.knowledgePoint.trim(), difficulty: Number(input.difficulty) as 1 | 2 | 3, avoidTitles };
}

export function validateGeneratedQuestion(value: unknown, input: GenerateQuestionInput): QuestionItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const strings = ["title", "prompt", "visual", "answer", "explanation"] as const;
  if (strings.some((key) => typeof item[key] !== "string" || String(item[key]).trim().length < 2)) return null;
  if (!Array.isArray(item.options) || item.options.length < 3 || item.options.length > 4 || item.options.some((option) => typeof option !== "string" || option.trim().length === 0)) return null;
  const options = item.options.map((option) => String(option).trim());
  if (new Set(options.map((option) => option.toLocaleLowerCase())).size !== options.length) return null;
  const answer = String(item.answer).trim();
  if (options.filter((option) => option === answer).length !== 1) return null;
  if (String(item.explanation).trim().length < 10) return null;
  const isEnglish = input.subject.includes("英语");
  let vocabulary: QuestionItem["vocabulary"];
  let grammarTip: QuestionItem["grammarTip"];
  if (isEnglish) {
    if (!Array.isArray(item.vocabulary) || item.vocabulary.length < 1 || item.vocabulary.length > 3) return null;
    vocabulary = item.vocabulary.map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const word = entry as Record<string, unknown>;
      const required = ["term", "tag", "meaning", "expansion", "example", "exampleMeaning"] as const;
      if (required.some((key) => typeof word[key] !== "string" || String(word[key]).trim().length < 2)) return null;
      if (word.phonetic !== undefined && typeof word.phonetic !== "string") return null;
      return { term: String(word.term).trim(), phonetic: typeof word.phonetic === "string" ? word.phonetic.trim() : undefined, tag: String(word.tag).trim(), meaning: String(word.meaning).trim(), expansion: String(word.expansion).trim(), example: String(word.example).trim(), exampleMeaning: String(word.exampleMeaning).trim() };
    }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    if (vocabulary.length !== item.vocabulary.length) return null;
    if (!item.grammarTip || typeof item.grammarTip !== "object") return null;
    const tip = item.grammarTip as Record<string, unknown>;
    if (["title", "pattern", "explanation"].some((key) => typeof tip[key] !== "string" || String(tip[key]).trim().length < 2)) return null;
    grammarTip = { title: String(tip.title).trim(), pattern: String(tip.pattern).trim(), explanation: String(tip.explanation).trim() };
  }
  return { id: `ai-${input.grade.toLocaleLowerCase()}-${Date.now()}`, grade: input.grade, subject: input.subject, knowledgePoint: input.knowledgePoint, type: "single_choice", difficulty: input.difficulty, source: "ai_generated", title: String(item.title).trim(), eyebrow: `${input.grade} · ${input.subject} · 智能加练`, prompt: String(item.prompt).trim(), visual: String(item.visual).trim(), options, answer, explanation: String(item.explanation).trim(), vocabulary, grammarTip };
}

function buildPrompts(input: GenerateQuestionInput) {
  const englishSchema = input.subject.includes("英语") ? `英语题还必须包含："vocabulary"数组，列出1至3个真正影响理解的重点单词或词组，每项格式为{"term":"英文词或词组","phonetic":"音标","tag":"词性或词组类型","meaning":"简体中文释义","expansion":"构词、搭配或辨析","example":"新的英文例句","exampleMeaning":"例句的简体中文翻译"}；以及"grammarTip":{"title":"语法或阅读策略名称","pattern":"核心结构","explanation":"简体中文说明"}。词汇解析必须与本题直接相关，例句不能照抄题干。` : "";
  const system = `你是中国儿童分级学习平台的审题老师。只生成原创、无争议、适龄、安全的单项选择题。必须输出json对象，不要Markdown。基础JSON格式：{"title":"题目名称","prompt":"题干","visual":"简短的文字或emoji提示","options":["选项1","选项2","选项3"],"answer":"与某个选项完全一致的答案","explanation":"用简体中文讲清推理过程"}。${englishSchema}要求：答案唯一；三个选项互不重复；不得出现繁体字、成人内容、品牌营销、政治或医疗建议；解析不能只重复答案。`;
  const avoided = input.avoidTitles?.length ? `不要生成与这些题目相似的内容：${input.avoidTitles.join("、")}。` : "";
  return { system, user: `请生成1道${input.subject}题。等级：${input.grade}（${gradeProfiles[input.grade]}）；知识点：${input.knowledgePoint}；难度：${input.difficulty}/3。${avoided}` };
}

export async function generateWithDeepSeek(input: GenerateQuestionInput, apiKey: string): Promise<QuestionItem | null> {
  const prompts = buildPrompts(input);
  let lastFailure: DeepSeekFailureCode = "provider";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response: Response;
    try {
      response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: prompts.system }, { role: "user", content: prompts.user }], response_format: { type: "json_object" }, thinking: { type: "disabled" }, temperature: 0.35, max_tokens: input.subject.includes("英语") ? 1800 : 1300, stream: false }),
        signal: AbortSignal.timeout(25_000),
      });
    } catch (error) {
      lastFailure = error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "provider";
      continue;
    }
    if (!response.ok) {
      lastFailure = response.status === 401 || response.status === 403 ? "auth" : response.status === 402 ? "balance" : response.status === 429 ? "rate_limit" : "provider";
      if (lastFailure === "auth" || lastFailure === "balance") break;
      continue;
    }
    const content = ((await response.json()) as DeepSeekResponse).choices?.[0]?.message?.content;
    if (!content?.trim()) {
      lastFailure = "empty";
      continue;
    }
    try {
      const question = validateGeneratedQuestion(JSON.parse(content), input);
      if (question) return question;
      lastFailure = "validation";
    } catch {
      lastFailure = "invalid_json";
    }
  }
  throw new DeepSeekGenerationError(lastFailure);
}
