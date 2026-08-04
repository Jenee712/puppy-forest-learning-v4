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

const gradeSpecificQuestions: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  "G5:语文": { subject: "语文", knowledgePoint: "联系上下文理解词语", type: "single_choice", difficulty: 2, source: "local_core", title: "读懂上下文", prompt: "“雨后的荷叶更加青翠，水珠在叶面上滚来滚去。”这里的“青翠”最接近什么意思？", visual: "🪷 雨后，荷叶托着亮晶晶的水珠。", options: ["鲜绿", "干枯", "弯曲"], answer: "鲜绿", explanation: "结合雨后荷叶的样子可知，“青翠”表示鲜明、浓绿的颜色。" },
  "G6:语文": { subject: "语文", knowledgePoint: "句段主要意思", type: "single_choice", difficulty: 2, source: "local_core", title: "抓住主要意思", prompt: "清晨，爷爷先给菜地浇水，又把歪倒的竹架扶正，最后才回屋吃早饭。这段话主要写什么？", visual: "爷爷在清晨认真照料菜地。", options: ["爷爷照料菜地", "爷爷喜欢吃早饭", "竹架是怎样做的"], answer: "爷爷照料菜地", explanation: "浇水和扶竹架都属于照料菜地，要把几个动作概括在一起。" },
  "G7:语文": { subject: "语文", knowledgePoint: "人物品质推断", type: "single_choice", difficulty: 2, source: "local_core", title: "从行动看人物", prompt: "比赛前，小岚发现同伴忘带画笔，便把自己的备用画笔分给他。这个细节最能表现小岚怎样的品质？", visual: "一个小行动，也能说明人物的特点。", options: ["乐于帮助别人", "做事粗心", "害怕比赛"], answer: "乐于帮助别人", explanation: "小岚主动分享备用画笔，表现出她愿意帮助同伴。" },
  "G8:语文": { subject: "语文", knowledgePoint: "观点与依据", type: "single_choice", difficulty: 3, source: "local_core", title: "判断观点依据", prompt: "“社区图书角不应只增加新书，还要定期淘汰破损、内容过时的书。”下面哪一项最能支持这个观点？", visual: "好的论证，需要让理由和观点紧密对应。", options: ["书架的颜色应该统一", "破损和过时的书会降低阅读体验，也占用有限空间", "周末来图书角的人比较多"], answer: "破损和过时的书会降低阅读体验，也占用有限空间", explanation: "这一理由直接说明为什么要淘汰破损、过时的书，与观点联系最紧密。" },

  "G5:数学": { subject: "数学", knowledgePoint: "两步应用题", type: "single_choice", difficulty: 2, source: "local_core", title: "两步解决问题", prompt: "图书角原有36本故事书，又放入18本，平均摆在6层。每层放几本？", visual: "📚（36＋18）÷6", options: ["8本", "9本", "12本"], answer: "9本", explanation: "先求总数：36＋18＝54，再平均分：54÷6＝9。" },
  "G6:数学": { subject: "数学", knowledgePoint: "小数乘法应用", type: "single_choice", difficulty: 2, source: "local_core", title: "小数生活题", prompt: "一盒彩笔12.5元，买4盒需要多少钱？", visual: "12.5 × 4", options: ["40元", "50元", "52元"], answer: "50元", explanation: "12.5×4＝50，注意小数点的位置。" },
  "G7:数学": { subject: "数学", knowledgePoint: "分数应用", type: "single_choice", difficulty: 2, source: "local_core", title: "分数与实际数量", prompt: "合唱队有40人，其中3/5是女生。女生有多少人？", visual: "40 × 3/5", options: ["16人", "24人", "30人"], answer: "24人", explanation: "求40的3/5：40÷5×3＝24。" },
  "G8:数学": { subject: "数学", knowledgePoint: "百分数综合应用", type: "single_choice", difficulty: 3, source: "local_core", title: "折扣中的数学", prompt: "一本书原价80元，先打九折，再使用5元优惠券，实际支付多少元？", visual: "原价80元 → 九折 → 再减5元", options: ["67元", "68元", "72元"], answer: "67元", explanation: "九折后是80×90%＝72元，再减5元，实际支付67元。" },

  "G5:英语": { subject: "英语", knowledgePoint: "一般现在时", type: "single_choice", difficulty: 2, source: "local_core", title: "Daily routines", prompt: "Choose the correct sentence.", visual: "Tom 🚌 every day", options: ["Tom go to school by bus every day.", "Tom goes to school by bus every day.", "Tom going to school by bus every day."], answer: "Tom goes to school by bus every day.", explanation: "Tom 是第三人称单数，一般现在时中 go 要变成 goes。" },
  "G6:英语": { subject: "英语", knowledgePoint: "现在进行时", type: "single_choice", difficulty: 2, source: "local_core", title: "What is happening?", prompt: "Look! The children ____ a science experiment now.", visual: "🧒🧪👧  right now", options: ["do", "are doing", "did"], answer: "are doing", explanation: "Look 和 now 提示动作正在发生，主语 children 是复数，用 are doing。" },
  "G7:英语": { subject: "英语", knowledgePoint: "一般过去时语境", type: "single_choice", difficulty: 2, source: "local_core", title: "Yesterday's trip", prompt: "Yesterday we ____ the museum and ____ many old pictures.", visual: "Yesterday 🏛️ 🖼️", options: ["visit; see", "visited; saw", "are visiting; seeing"], answer: "visited; saw", explanation: "Yesterday 表示过去，visit 用 visited，see 的过去式是不规则变化 saw。" },
  "G8:英语": { subject: "英语", knowledgePoint: "短文推断与计划变化", type: "single_choice", difficulty: 3, source: "local_core", title: "Read and infer", prompt: "The school nature club planned to clean the river bank on Saturday. Because heavy rain is expected, the club moved the activity to Sunday. Lucy can only join on Saturday. What is most likely true?", visual: "📅 Saturday → heavy rain → activity moved to Sunday", options: ["Lucy may miss the activity.", "The club will go on Saturday as planned.", "Lucy moved the activity to Sunday."], answer: "Lucy may miss the activity.", explanation: "活动改到星期日，而 Lucy 只能星期六参加，因此她很可能无法参加。这个问题需要整合三条信息后推断。" },

  "G8:科学": { subject: "科学", knowledgePoint: "控制变量实验", type: "single_choice", difficulty: 3, source: "local_core", title: "设计公平实验", prompt: "要研究“光照是否影响绿豆苗生长”，下面哪种设计最合理？", visual: "研究一个因素时，其他条件应尽量相同。", options: ["两盆相同豆苗，水和温度相同，一盆有光、一盆避光", "一盆多浇水并晒太阳，另一盆少浇水且避光", "用绿豆苗和仙人掌比较"], answer: "两盆相同豆苗，水和温度相同，一盆有光、一盆避光", explanation: "只改变光照条件，其他条件保持相同，才能较可靠地判断光照的影响。" },
  "G8:阅读与表达": { subject: "阅读与表达", knowledgePoint: "信息整合与推断", type: "single_choice", difficulty: 3, source: "local_core", title: "整合多条信息", prompt: "通知写道：“周五的义卖改到室内体育馆，时间不变；易碎物品请加固包装。”小航准备周五下午带玻璃手工作品参加。他最需要做什么？", visual: "地点改变，时间不变，还要注意物品特点。", options: ["改到周六再去", "按原时间去体育馆并加固包装", "仍去操场且不用包装"], answer: "按原时间去体育馆并加固包装", explanation: "需要同时利用“地点改变”“时间不变”和“易碎物品加固”三条信息。" },
};

export function getDailyQuestion(index: number) {
  return dailyQuestions[index] ?? dailyQuestions[0];
}

export function getCourseQuestion(courseName: string, grade: string): QuestionItem {
  const source = gradeSpecificQuestions[`${grade}:${courseName}`] ?? (grade === "G1" || grade === "G2" ? preschoolQuestions[courseName] : primaryQuestions[courseName]);
  const fallback = preschoolQuestions["英语兴趣"];
  const question = source ?? fallback;
  return { ...question, id: `${grade.toLowerCase()}-${courseName}`, grade, eyebrow: `${grade} · ${courseName}` };
}
