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
  G1: "3至4岁幼儿；通过游戏、实物和图像完成观察、比较、配对或两步口头指令，不提前教授小学学科知识",
  G2: "5至6岁幼小衔接；在生活情境中完成分类、规律、数量关系、完整表达和简单原因判断，不做机械小学化训练",
  G3: "7岁，小学一年级；以单项识记、一条明确线索、一步加减和简短英语词句匹配为主",
  G4: "8岁，小学二年级；以短句理解、直接因果、表内乘除和英语日常表达为主，不再考字母、首音、声母或孤立拼音识记",
  G5: "9岁，小学三年级；使用一至两条段落信息、两步整数应用、英语基础时态和直接推断",
  G6: "10岁，小学四年级；使用两步运算、简单数据读取、上下文理解和英语日常信息提取",
  G7: "11岁，小学五年级；使用小数分数应用、跨句理解、条件比较和完整表达，避免论证评价",
  G8: "12岁，小学六年级；使用百分数比例基础、段落主旨、两至三条信息整合和小学毕业衔接英语",
};

const minimumPromptLength: Record<string, number> = { G1: 6, G2: 8, G3: 12, G4: 18, G5: 22, G6: 26, G7: 30, G8: 34 };
const upperGradeBasics = /声母|韵母|孤立拼音|字母大小写|字母音|首音找单词|I like|I can do it|Do you like apples/i;

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
  const visual = String(item.visual).trim();
  if (visualRevealsAnswer(visual, answer)) return null;
  if (String(item.explanation).trim().length < 10) return null;
  const subjectFactor = input.subject.includes("英语") ? 0.7 : input.subject === "数学" ? 0.8 : 1;
  if (String(item.prompt).trim().length < Math.ceil(minimumPromptLength[input.grade] * subjectFactor)) return null;
  if (["G4", "G5", "G6", "G7", "G8"].includes(input.grade) && upperGradeBasics.test(`${item.title} ${item.prompt}`)) return null;
  if (!item.optionExplanations || typeof item.optionExplanations !== "object" || Array.isArray(item.optionExplanations)) return null;
  const rawOptionExplanations = item.optionExplanations as Record<string, unknown>;
  const optionExplanations: Record<string, string> = {};
  for (const option of options) {
    const detail = rawOptionExplanations[option];
    if (typeof detail !== "string" || detail.trim().length < 8) return null;
    optionExplanations[option] = detail.trim();
  }
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
    // 词汇解析是英语题的必备学习内容；语法提示只在题目确实涉及语法时展示。
    // 过去把 grammarTip 设为硬性条件，会把内容正确的词汇/阅读题误判为生成失败。
    if (item.grammarTip !== undefined) {
      if (!item.grammarTip || typeof item.grammarTip !== "object") return null;
      const tip = item.grammarTip as Record<string, unknown>;
      if (["title", "pattern", "explanation"].some((key) => typeof tip[key] !== "string" || String(tip[key]).trim().length < 2)) return null;
      grammarTip = { title: String(tip.title).trim(), pattern: String(tip.pattern).trim(), explanation: String(tip.explanation).trim() };
    }
  }
  return { id: `ai-${input.grade.toLocaleLowerCase()}-${Date.now()}`, grade: input.grade, subject: input.subject, knowledgePoint: input.knowledgePoint, type: "single_choice", difficulty: input.difficulty, source: "ai_generated", title: String(item.title).trim(), eyebrow: `${input.grade} · ${input.subject} · 智能加练`, prompt: String(item.prompt).trim(), visual, options, answer, explanation: String(item.explanation).trim(), optionExplanations, vocabulary, grammarTip };
}

function visualRevealsAnswer(visual: string, answer: string) {
  const normalize = (text: string) => text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const normalizedVisual = normalize(visual);
  const normalizedAnswer = normalize(answer);
  if (!normalizedVisual || !normalizedAnswer) return false;
  const containsChinese = /[\u3400-\u9FFF]/.test(answer);
  if (!containsChinese) return normalizedAnswer.length >= 4 && normalizedVisual.includes(normalizedAnswer);
  if (normalizedAnswer.length < 2) return false;
  if (normalizedVisual.includes(normalizedAnswer)) return true;
  if (normalizedAnswer.length < 4) return false;

  let answerIndex = 0;
  for (const character of normalizedVisual) {
    if (character === normalizedAnswer[answerIndex]) answerIndex += 1;
    if (answerIndex === normalizedAnswer.length) return true;
  }
  return false;
}

function buildPrompts(input: GenerateQuestionInput) {
  const englishSchema = input.subject.includes("英语") ? `英语题还必须包含："vocabulary"数组，列出1至3个真正影响理解的重点单词或词组，每项格式为{"term":"英文词或词组","phonetic":"音标","tag":"词性或词组类型","meaning":"简体中文释义","expansion":"构词、搭配或辨析","example":"新的英文例句","exampleMeaning":"例句的简体中文翻译"}。如题目涉及语法、句型或阅读策略，再增加"grammarTip":{"title":"语法或阅读策略名称","pattern":"核心结构","explanation":"简体中文说明"}。词汇解析必须与本题直接相关，例句不能照抄题干。` : "";
  const subjectCalibration = input.subject.includes("英语")
    ? "英语题相对旧版降低约30%：缩短句长，减少生僻词和同时处理的线索；G3至G4以词句和直接信息为主，G5至G6最多整合两条信息，G7至G8以小学毕业阅读、基础时态和日常表达为主，不考论证漏洞或初中语法改写。"
    : input.subject === "数学"
      ? "数学题相对旧版降低约20%：减少一步运算或缩小数字范围，严格使用本年级已学知识；不得用超前年级的方程、函数、勾股定理、圆面积或比例知识。"
      : "保持当前适龄难度。";
  const system = `你是中国儿童分级学习平台的审题老师。${subjectCalibration}只生成原创、无争议、适龄、安全的单项选择题。必须输出json对象，不要Markdown。基础JSON格式：{"title":"题目名称","prompt":"题干","visual":"简短的文字或emoji提示","options":["选项1","选项2","选项3"],"answer":"与某个选项完全一致的答案","explanation":"用简体中文讲清总体推理过程","optionExplanations":{"选项1":"为什么正确或错误","选项2":"为什么正确或错误","选项3":"为什么正确或错误"}}。optionExplanations必须使用与options完全相同的选项文字作为键，逐项说明实际含义、使用的线索以及为什么符合或不符合，不能只写“错误”“不符合题意”。${englishSchema}要求：难度必须相对于本等级判断；答案唯一；三个选项互不重复且处于同一逻辑层级；错误选项应合理但可排除；visual只能呈现作答所需的情境或线索，不得复述答案、结论或任何完整选项；不得出现繁体字、成人内容、品牌营销、政治或医疗建议；解析必须说明使用了哪些线索和步骤，不能只重复答案。`;
  const avoided = input.avoidTitles?.length ? `不要生成与这些题目相似的内容：${input.avoidTitles.join("、")}。` : "";
  return { system, user: `请生成1道${input.subject}题。等级：${input.grade}（${gradeProfiles[input.grade]}）；知识点：${input.knowledgePoint}；难度：${input.difficulty}/3。${avoided}` };
}

function parseModelJson(content: string): unknown {
  const unfenced = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(unfenced);
  } catch {
    const start = unfenced.indexOf("{");
    const end = unfenced.lastIndexOf("}");
    if (start < 0 || end <= start) throw new DeepSeekGenerationError("invalid_json");
    return JSON.parse(unfenced.slice(start, end + 1));
  }
}

export async function generateWithDeepSeek(input: GenerateQuestionInput, apiKey: string): Promise<QuestionItem | null> {
  const prompts = buildPrompts(input);
  let lastFailure: DeepSeekFailureCode = "provider";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const retryGuidance = attempt === 0 ? "" : "\n上一次输出未通过格式或答案审核。请重新检查：答案必须与一个选项逐字一致；visual不得泄露答案；英语题必须提供完整词汇解析；只输出一个json对象。";
    let response: Response;
    try {
      response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: prompts.system }, { role: "user", content: `${prompts.user}${retryGuidance}` }], response_format: { type: "json_object" }, thinking: { type: "disabled" }, temperature: 0.2, max_tokens: input.subject.includes("英语") ? 1800 : 1300, stream: false }),
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
      const question = validateGeneratedQuestion(parseModelJson(content), input);
      if (question) return question;
      lastFailure = "validation";
    } catch {
      lastFailure = "invalid_json";
    }
  }
  throw new DeepSeekGenerationError(lastFailure);
}
