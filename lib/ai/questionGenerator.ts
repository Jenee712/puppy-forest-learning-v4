import type { QuestionItem } from "@/data/questionBank";

export type GenerateQuestionInput = {
  grade: string;
  subject: string;
  knowledgePoint: string;
  difficulty: 1 | 2 | 3;
  avoidTitles?: string[];
};

type DeepSeekResponse = { choices?: Array<{ message?: { content?: string | null } }> };

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
  return { id: `ai-${input.grade.toLocaleLowerCase()}-${Date.now()}`, grade: input.grade, subject: input.subject, knowledgePoint: input.knowledgePoint, type: "single_choice", difficulty: input.difficulty, source: "ai_generated", title: String(item.title).trim(), eyebrow: `${input.grade} · ${input.subject} · 智能加练`, prompt: String(item.prompt).trim(), visual: String(item.visual).trim(), options, answer, explanation: String(item.explanation).trim() };
}

function buildPrompts(input: GenerateQuestionInput) {
  const system = `你是中国儿童分级学习平台的审题老师。只生成原创、无争议、适龄、安全的单项选择题。必须输出json对象，不要Markdown。JSON格式示例：{"title":"题目名称","prompt":"题干","visual":"简短的文字或emoji提示","options":["选项1","选项2","选项3"],"answer":"与某个选项完全一致的答案","explanation":"用简体中文讲清推理过程"}。要求：答案唯一；三个选项互不重复；不得出现繁体字、成人内容、品牌营销、政治或医疗建议；解析不能只重复答案。`;
  const avoided = input.avoidTitles?.length ? `不要生成与这些题目相似的内容：${input.avoidTitles.join("、")}。` : "";
  return { system, user: `请生成1道${input.subject}题。等级：${input.grade}（${gradeProfiles[input.grade]}）；知识点：${input.knowledgePoint}；难度：${input.difficulty}/3。${avoided}` };
}

export async function generateWithDeepSeek(input: GenerateQuestionInput, apiKey: string): Promise<QuestionItem | null> {
  const prompts = buildPrompts(input);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: prompts.system }, { role: "user", content: prompts.user }], response_format: { type: "json_object" }, thinking: { type: "disabled" }, temperature: 0.35, max_tokens: 900, stream: false }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) continue;
    const content = ((await response.json()) as DeepSeekResponse).choices?.[0]?.message?.content;
    if (!content) continue;
    try {
      const question = validateGeneratedQuestion(JSON.parse(content), input);
      if (question) return question;
    } catch { /* 无效JSON会自动进行下一次尝试 */ }
  }
  return null;
}
