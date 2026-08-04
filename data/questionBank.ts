export type QuestionItem = {
  id: string;
  grade: string;
  subject: string;
  knowledgePoint: string;
  type: "single_choice";
  difficulty: 1 | 2 | 3;
  source: "local_core";
  title: string;
  eyebrow: string;
  prompt: string;
  visual: string;
  options: string[];
  answer: string;
  explanation: string;
};

const dailyQuestions: QuestionItem[] = [
  { id: "daily-letter-m", grade: "G1-G3", subject: "英语兴趣", knowledgePoint: "字母大小写配对", type: "single_choice", difficulty: 1, source: "local_core", title: "字母探险", eyebrow: "英语兴趣 · 大小写配对", prompt: "哪一组是大写 M 和小写 m？", visual: "M m · moon 🌙", options: ["M m", "N n", "W w"], answer: "M m", explanation: "大写 M 和小写 m 是一对。moon 的第一个字母就是 m。" },
  { id: "daily-pattern-color", grade: "G1-G3", subject: "数学", knowledgePoint: "图形规律", type: "single_choice", difficulty: 1, source: "local_core", title: "数学小站", eyebrow: "数学 · 图形规律", prompt: "接下来应该是哪一种颜色？", visual: "🔵 🟡 🔵 🟡 ？", options: ["🔵", "🟡", "🟢"], answer: "🔵", explanation: "蓝色和黄色轮流出现，黄色后面应该是蓝色。" },
  { id: "daily-story-seed", grade: "G1-G3", subject: "阅读", knowledgePoint: "故事信息提取", type: "single_choice", difficulty: 1, source: "local_core", title: "故事树屋", eyebrow: "阅读 · 故事理解", prompt: "小种子最后落在了哪里？", visual: "🌱 乘着风，飞过小河和山坡，最后落在森林边的草地上。", options: ["森林边的草地", "大海里", "月亮上"], answer: "森林边的草地", explanation: "题目要根据故事中明确写出的信息回答，不能只凭想象。" },
];

const preschoolQuestions: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  "语言表达": { subject: "语言表达", knowledgePoint: "完整句表达", type: "single_choice", difficulty: 1, source: "local_core", title: "把话说完整", prompt: "看到小兔在浇花，哪句话说得最完整？", visual: "🐰 💧 🌷", options: ["小兔。", "浇花。", "小兔正在给花浇水。"], answer: "小兔正在给花浇水。", explanation: "完整的话要说清楚“谁、在做什么”。" },
  "数量与空间": { subject: "数量与空间", knowledgePoint: "5以内点数", type: "single_choice", difficulty: 1, source: "local_core", title: "数量小侦探", prompt: "草地上一共有几只蝴蝶？", visual: "🦋  🦋  🦋", options: ["2只", "3只", "4只"], answer: "3只", explanation: "按顺序点数：1、2、3，一共有3只蝴蝶。" },
  "科学探索": { subject: "科学探索", knowledgePoint: "生命特征", type: "single_choice", difficulty: 1, source: "local_core", title: "生命观察站", prompt: "哪一样东西会慢慢长大？", visual: "🌱  🪨  🧸", options: ["小树苗", "石头", "玩具熊"], answer: "小树苗", explanation: "小树苗是有生命的，需要阳光和水，也会慢慢长大。" },
  "健康习惯": { subject: "健康习惯", knowledgePoint: "餐前卫生", type: "single_choice", difficulty: 1, source: "local_core", title: "干净小手", prompt: "准备吃水果前，应该先做什么？", visual: "🍎  🙌  💧", options: ["先洗手", "先玩玩具", "直接吃"], answer: "先洗手", explanation: "吃东西前认真洗手，可以减少细菌进入身体。" },
  "社会认知": { subject: "社会认知", knowledgePoint: "同伴交往", type: "single_choice", difficulty: 1, source: "local_core", title: "友好小伙伴", prompt: "不小心碰倒朋友的积木，怎么做更合适？", visual: "🧱 💥 🙂", options: ["马上跑开", "说对不起并帮忙搭好", "怪朋友挡路"], answer: "说对不起并帮忙搭好", explanation: "承认不小心并一起解决问题，是友好、负责的做法。" },
  "艺术创造": { subject: "艺术创造", knowledgePoint: "颜色混合", type: "single_choice", difficulty: 1, source: "local_core", title: "颜色魔法", prompt: "黄色和蓝色颜料混在一起，通常会变成什么颜色？", visual: "🟡 + 🔵 = ？", options: ["绿色", "红色", "白色"], answer: "绿色", explanation: "颜料中的黄色和蓝色混合，通常会得到绿色。" },
  "英语兴趣": { subject: "英语兴趣", knowledgePoint: "字母大小写配对", type: "single_choice", difficulty: 1, source: "local_core", title: "字母好朋友", prompt: "哪一组是大写 A 和小写 a？", visual: "A a · apple 🍎", options: ["A a", "A d", "B b"], answer: "A a", explanation: "A 和 a 是同一个字母的大小写，apple 以 a 开头。" },
};

const primaryQuestions: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  "语文": { subject: "语文", knowledgePoint: "词语理解", type: "single_choice", difficulty: 1, source: "local_core", title: "词语小森林", prompt: "哪一个词最适合形容春天刚长出的小草？", visual: "春风吹来，小草从土里探出头。", options: ["嫩绿", "漆黑", "冰冷"], answer: "嫩绿", explanation: "春天刚长出的小草颜色浅而鲜亮，用“嫩绿”最合适。" },
  "数学": { subject: "数学", knowledgePoint: "减法应用", type: "single_choice", difficulty: 1, source: "local_core", title: "生活数学", prompt: "小狗有8块积木，送给小兔3块，还剩几块？", visual: "🧱 × 8  −  🧱 × 3", options: ["5块", "6块", "11块"], answer: "5块", explanation: "求剩下的数量用减法：8−3=5。" },
  "英语兴趣": { subject: "英语兴趣", knowledgePoint: "字母音", type: "single_choice", difficulty: 1, source: "local_core", title: "声音与字母", prompt: "哪个单词以字母 B 的声音开头？", visual: "B b", options: ["ball ⚽", "cat 🐱", "sun ☀️"], answer: "ball ⚽", explanation: "ball 的第一个字母是 b，读音从 /b/ 开始。" },
  "英语": { subject: "英语", knowledgePoint: "喜欢的表达", type: "single_choice", difficulty: 1, source: "local_core", title: "英语句子", prompt: "“我喜欢苹果”用英语怎么说？", visual: "我 ❤️ 🍎", options: ["I like apples.", "I see a dog.", "This is blue."], answer: "I like apples.", explanation: "I like... 表示“我喜欢……”，apples 表示苹果。" },
  "科学": { subject: "科学", knowledgePoint: "植物吸水", type: "single_choice", difficulty: 1, source: "local_core", title: "科学观察", prompt: "植物的根通常从哪里吸收水分？", visual: "☀️  🌱  💧", options: ["土壤", "空气", "花瓣"], answer: "土壤", explanation: "植物的根扎在土壤里，主要从土壤中吸收水和无机盐。" },
  "阅读与表达": { subject: "阅读与表达", knowledgePoint: "线索推断", type: "single_choice", difficulty: 2, source: "local_core", title: "读懂一句话", prompt: "“乌云越来越厚，小蚂蚁忙着搬家。”这句话暗示什么？", visual: "☁️ 🐜 🏠", options: ["可能要下雨", "太阳要出来", "冬天已经到了"], answer: "可能要下雨", explanation: "乌云变厚和蚂蚁搬家都是下雨前常见的现象线索。" },
  "综合素养": { subject: "综合素养", knowledgePoint: "沟通合作", type: "single_choice", difficulty: 1, source: "local_core", title: "解决小问题", prompt: "和同学意见不一样时，先怎么做更合适？", visual: "🧒 💬 👧", options: ["认真听完再说明想法", "大声打断", "马上离开"], answer: "认真听完再说明想法", explanation: "先倾听、再表达，能帮助双方理解彼此并一起解决问题。" },
};

export function getDailyQuestion(index: number) {
  return dailyQuestions[index] ?? dailyQuestions[0];
}

export function getCourseQuestion(courseName: string, grade: string): QuestionItem {
  const source = grade === "G1" || grade === "G2" ? preschoolQuestions[courseName] : primaryQuestions[courseName];
  const fallback = preschoolQuestions["英语兴趣"];
  const question = source ?? fallback;
  return { ...question, id: `${grade.toLowerCase()}-${courseName}`, grade, eyebrow: `${grade} · ${courseName}` };
}
