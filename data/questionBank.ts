export type QuestionItem = {
  id: string;
  grade: string;
  subject: string;
  knowledgePoint: string;
  type: "single_choice" | "fill_blank" | "ordering" | "true_false" | "matching";
  difficulty: 1 | 2 | 3;
  source: "local_core" | "ai_generated";
  title: string;
  eyebrow: string;
  prompt: string;
  visual: string;
  options: string[];
  answer: string;
  explanation: string;
  optionExplanations?: Record<string, string>;
  vocabulary?: Array<{
    term: string;
    phonetic?: string;
    tag: string;
    meaning: string;
    expansion: string;
    example: string;
    exampleMeaning: string;
  }>;
  grammarTip?: {
    title: string;
    pattern: string;
    explanation: string;
  };
  mathModel?: {
    kind: "steps" | "circle";
    title: string;
    values: Array<{ label: string; value: string }>;
    relation: string;
  };
  matchingPairs?: Array<{ left: string; right: string }>;
  activityKind?: "practice" | "phonics" | "trace" | "cn_to_en" | "en_to_cn" | "storybook" | "reading" | "grammar";
  estimatedMinutes?: number;
  traceLetter?: string;
};

const preschoolQuestions: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  "语言表达": { subject: "语言表达", knowledgePoint: "完整句表达", type: "single_choice", difficulty: 1, source: "local_core", title: "把话说完整", prompt: "看到小兔在浇花，哪句话说得最完整？", visual: "🐰 💧 🌷", options: ["小兔。", "浇花。", "小兔正在给花浇水。"], answer: "小兔正在给花浇水。", explanation: "完整的话要说清楚“谁、在做什么”。" },
  "数量与空间": { subject: "数量与空间", knowledgePoint: "5以内点数", type: "single_choice", difficulty: 1, source: "local_core", title: "数量小侦探", prompt: "草地上一共有几只蝴蝶？", visual: "🦋  🦋  🦋", options: ["2只", "3只", "4只"], answer: "3只", explanation: "按顺序点数：1、2、3，一共有3只蝴蝶。" },
  "科学探索": { subject: "科学探索", knowledgePoint: "生命特征", type: "single_choice", difficulty: 1, source: "local_core", title: "生命观察站", prompt: "哪一样东西会慢慢长大？", visual: "🌱  🪨  🧸", options: ["小树苗", "石头", "玩具熊"], answer: "小树苗", explanation: "小树苗是有生命的，需要阳光和水，也会慢慢长大。" },
  "健康习惯": { subject: "健康习惯", knowledgePoint: "餐前卫生", type: "single_choice", difficulty: 1, source: "local_core", title: "干净小手", prompt: "准备吃水果前，应该先做什么？", visual: "🍎  🙌  💧", options: ["先洗手", "先玩玩具", "直接吃"], answer: "先洗手", explanation: "吃东西前认真洗手，可以减少细菌进入身体。" },
  "社会认知": { subject: "社会认知", knowledgePoint: "同伴交往", type: "single_choice", difficulty: 1, source: "local_core", title: "友好小伙伴", prompt: "不小心碰倒朋友的积木，怎么做更合适？", visual: "🧱 💥 🙂", options: ["马上跑开", "说对不起并帮忙搭好", "怪朋友挡路"], answer: "说对不起并帮忙搭好", explanation: "承认不小心并一起解决问题，是友好、负责的做法。" },
  "艺术创造": { subject: "艺术创造", knowledgePoint: "颜色混合", type: "single_choice", difficulty: 1, source: "local_core", title: "颜色魔法", prompt: "黄色和蓝色颜料混在一起，通常会变成什么颜色？", visual: "🟡 + 🔵 = ？", options: ["绿色", "红色", "白色"], answer: "绿色", explanation: "颜料中的黄色和蓝色混合，通常会得到绿色。" },
  "英语兴趣": { subject: "英语兴趣", knowledgePoint: "字母大小写配对", type: "single_choice", difficulty: 1, source: "local_core", title: "字母好朋友", prompt: "哪一组是大写 A 和小写 a？", visual: "A a · apple 🍎", options: ["A a", "A d", "B b"], answer: "A a", explanation: "A 和 a 是同一个字母的大小写，apple 以 a 开头。", vocabulary: [{ term: "apple", phonetic: "/ˈæpəl/", tag: "名词", meaning: "苹果", expansion: "apple 以字母 a 开头，复数是 apples。", example: "This is a red apple.", exampleMeaning: "这是一个红苹果。" }] },
};

const primaryQuestions: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  "语文": { subject: "语文", knowledgePoint: "词语理解", type: "single_choice", difficulty: 1, source: "local_core", title: "词语小森林", prompt: "哪一个词最适合形容春天刚长出的小草？", visual: "春风吹来，小草从土里探出头。", options: ["嫩绿", "漆黑", "冰冷"], answer: "嫩绿", explanation: "春天刚长出的小草颜色浅而鲜亮，用“嫩绿”最合适。" },
  "数学": { subject: "数学", knowledgePoint: "减法应用", type: "single_choice", difficulty: 1, source: "local_core", title: "生活数学", prompt: "小狗有8块积木，送给小兔3块，还剩几块？", visual: "🧱 × 8  −  🧱 × 3", options: ["5块", "6块", "11块"], answer: "5块", explanation: "求剩下的数量用减法：8−3=5。" },
  "英语兴趣": { subject: "英语兴趣", knowledgePoint: "字母音", type: "single_choice", difficulty: 1, source: "local_core", title: "声音与字母", prompt: "哪个单词以字母 B 的声音开头？", visual: "B b", options: ["ball ⚽", "cat 🐱", "sun ☀️"], answer: "ball ⚽", explanation: "ball 的第一个字母是 b，读音从 /b/ 开始。", vocabulary: [{ term: "ball", phonetic: "/bɔːl/", tag: "名词", meaning: "球", expansion: "basketball、football 中也能看到 ball。", example: "The ball is under the chair.", exampleMeaning: "球在椅子下面。" }] },
  "英语": { subject: "英语", knowledgePoint: "喜欢的表达", type: "single_choice", difficulty: 1, source: "local_core", title: "英语句子", prompt: "“我喜欢苹果”用英语怎么说？", visual: "我 ❤️ 🍎", options: ["I like apples.", "I see a dog.", "This is blue."], answer: "I like apples.", explanation: "I like... 表示“我喜欢……”，apples 表示苹果。" },
  "科学": { subject: "科学", knowledgePoint: "植物吸水", type: "single_choice", difficulty: 1, source: "local_core", title: "科学观察", prompt: "植物的根通常从哪里吸收水分？", visual: "☀️  🌱  💧", options: ["土壤", "空气", "花瓣"], answer: "土壤", explanation: "植物的根扎在土壤里，主要从土壤中吸收水和无机盐。" },
  "阅读与表达": { subject: "阅读与表达", knowledgePoint: "线索推断", type: "single_choice", difficulty: 2, source: "local_core", title: "读懂一句话", prompt: "“乌云越来越厚，小蚂蚁忙着搬家。”这句话暗示什么？", visual: "☁️ 🐜 🏠", options: ["可能要下雨", "太阳要出来", "冬天已经到了"], answer: "可能要下雨", explanation: "乌云变厚和蚂蚁搬家都是下雨前常见的现象线索。" },
  "综合素养": { subject: "综合素养", knowledgePoint: "沟通合作", type: "single_choice", difficulty: 1, source: "local_core", title: "解决小问题", prompt: "和同学意见不一样时，先怎么做更合适？", visual: "🧒 💬 👧", options: ["认真听完再说明想法", "大声打断", "马上离开"], answer: "认真听完再说明想法", explanation: "先倾听、再表达，能帮助双方理解彼此并一起解决问题。" },
};

const gradeSpecificQuestions: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  "G3:语文": { subject: "语文", knowledgePoint: "句群信息整合", type: "single_choice", difficulty: 2, source: "local_core", title: "把两句话连起来想", prompt: "小雨把借来的图书包上书皮，每次读完都放回书架。一个月后，图书仍然整洁。哪句话最能概括这段话？", visual: "借书 → 爱护 → 仍然整洁", options: ["小雨很爱护借来的图书", "小雨每天都买新书", "书架一个月没有使用"], answer: "小雨很爱护借来的图书", explanation: "包书皮、读完放回和图书仍整洁是三条相关线索，共同说明小雨爱护图书。" },
  "G4:语文": { subject: "语文", knowledgePoint: "段落因果与概括", type: "single_choice", difficulty: 2, source: "local_core", title: "从变化中找原因", prompt: "原来浑浊的小池塘经过清理，水面不再漂着垃圾，岸边也种上了水草。几周后，蜻蜓和小鱼渐渐多了起来。这段话主要说明什么？", visual: "清理池塘 + 种水草 → 小动物变多", options: ["环境改善让池塘重新有了生机", "蜻蜓把所有垃圾清理干净", "小鱼只喜欢没有水草的池塘"], answer: "环境改善让池塘重新有了生机", explanation: "清理垃圾、种水草是环境改善，小动物增多是结果；第一项完整概括了变化及原因。" },

  "G3:数学": { subject: "数学", knowledgePoint: "两步加减应用", type: "single_choice", difficulty: 1, source: "local_core", title: "图书角的绘本", prompt: "图书角有20本绘本，借走6本，又归还4本。现在有多少本？", visual: "20 − 6 + 4", options: ["18本", "10本", "22本"], answer: "18本", explanation: "先算借走后剩20−6＝14本，再加归还的4本：14＋4＝18本。", mathModel: { kind: "steps", title: "按发生顺序计算", values: [{ label: "原有", value: "20本" }, { label: "借走", value: "−6本" }, { label: "归还", value: "+4本" }], relation: "20−6＋4" } },
  "G4:数学": { subject: "数学", knowledgePoint: "两步加减应用", type: "single_choice", difficulty: 1, source: "local_core", title: "两天借书", prompt: "周一借出12本书，周二借出8本，两天一共借出多少本？", visual: "周一12本｜周二8本", options: ["20本", "4本", "18本"], answer: "20本", explanation: "把两天借出的数量相加：12＋8＝20本。", mathModel: { kind: "steps", title: "找出两个数量再相加", values: [{ label: "周一", value: "12本" }, { label: "周二", value: "8本" }, { label: "合计", value: "12＋8" }], relation: "12＋8" } },

  "G3:英语兴趣": { subject: "英语兴趣", knowledgePoint: "句子信息匹配", type: "single_choice", difficulty: 1, source: "local_core", title: "Read and choose", prompt: "Leo's red lunch box is inside his blue schoolbag. Where is the lunch box?", visual: "🎒 blue · lunch box red · inside", options: ["In the schoolbag.", "On the desk.", "Under the chair."], answer: "In the schoolbag.", explanation: "句子直接说明午餐盒在书包里面，inside 表示“在……里面”。", vocabulary: [{ term: "inside", phonetic: "/ˌɪnˈsaɪd/", tag: "位置词", meaning: "在……里面", expansion: "inside 强调位于某个空间内部。", example: "The key is inside the box.", exampleMeaning: "钥匙在盒子里面。" }, { term: "lunch box", phonetic: "/ˈlʌntʃ bɒks/", tag: "名词词组", meaning: "午餐盒", expansion: "由 lunch 和 box 组成的复合名词。", example: "My lunch box is yellow.", exampleMeaning: "我的午餐盒是黄色的。" }] },
  "G4:英语兴趣": { subject: "英语兴趣", knowledgePoint: "日程信息匹配", type: "single_choice", difficulty: 1, source: "local_core", title: "Read Leo's timetable", prompt: "Leo has art on Monday and Thursday. When does he have art?", visual: "art: Mon/Thu", options: ["On Monday and Thursday.", "Only on Wednesday.", "On Saturday."], answer: "On Monday and Thursday.", explanation: "课程表直接写明美术课在星期一和星期四。", vocabulary: [{ term: "timetable", phonetic: "/ˈtaɪmteɪbəl/", tag: "名词", meaning: "课程表；时间表", expansion: "阅读时间表时要核对日期和活动。", example: "Check the timetable before school.", exampleMeaning: "上学前查看课程表。" }, { term: "art", phonetic: "/ɑːt/", tag: "名词", meaning: "美术课；艺术", expansion: "have art 表示“上美术课”。", example: "We have art on Monday.", exampleMeaning: "我们星期一有美术课。" }], grammarTip: { title: "询问日期", pattern: "When does ...?", explanation: "When 用来询问时间或日期，从课程表中直接找到对应信息。" } },

  "G5:语文": { subject: "语文", knowledgePoint: "联系上下文理解词语", type: "single_choice", difficulty: 2, source: "local_core", title: "读懂上下文", prompt: "“雨后的荷叶更加青翠，水珠在叶面上滚来滚去。”这里的“青翠”最接近什么意思？", visual: "🪷 雨后，荷叶托着亮晶晶的水珠。", options: ["鲜绿", "干枯", "弯曲"], answer: "鲜绿", explanation: "结合雨后荷叶的样子可知，“青翠”表示鲜明、浓绿的颜色。" },
  "G6:语文": { subject: "语文", knowledgePoint: "句段主要意思", type: "single_choice", difficulty: 2, source: "local_core", title: "抓住主要意思", prompt: "清晨，爷爷先给菜地浇水，又把歪倒的竹架扶正，还仔细摘掉了黄叶。太阳升高后，他才收好工具回家。这段话主要写什么？", visual: "🌅  🥬💧  🎋  🍂  🧰", options: ["爷爷清晨认真照料菜地", "爷爷只给菜地浇了水", "爷爷只扶正了歪倒的竹架"], answer: "爷爷清晨认真照料菜地", explanation: "浇水、扶竹架和摘黄叶都是照料菜地的具体动作。第一项能概括全部内容，后两项都只写了其中一个细节。" },
  "G7:语文": { subject: "语文", knowledgePoint: "人物品质推断", type: "single_choice", difficulty: 2, source: "local_core", title: "从行动看人物", prompt: "比赛前，小岚发现同伴忘带画笔，便把自己的备用画笔分给他。这个细节最能表现小岚怎样的品质？", visual: "一个小行动，也能说明人物的特点。", options: ["乐于帮助别人", "做事粗心", "害怕比赛"], answer: "乐于帮助别人", explanation: "小岚主动分享备用画笔，表现出她愿意帮助同伴。" },
  "G8:语文": { subject: "语文", knowledgePoint: "观点与依据", type: "single_choice", difficulty: 3, source: "local_core", title: "判断观点依据", prompt: "“社区图书角不应只增加新书，还要定期淘汰破损、内容过时的书。”下面哪一项最能支持这个观点？", visual: "好的论证，需要让理由和观点紧密对应。", options: ["书架的颜色应该统一", "破损和过时的书会降低阅读体验，也占用有限空间", "周末来图书角的人比较多"], answer: "破损和过时的书会降低阅读体验，也占用有限空间", explanation: "这一理由直接说明为什么要淘汰破损、过时的书，与观点联系最紧密。" },

  "G5:数学": { subject: "数学", knowledgePoint: "两步整数应用", type: "single_choice", difficulty: 1, source: "local_core", title: "平均摆书", prompt: "图书角有24本故事书，又放入12本，平均摆在6层。每层放几本？", visual: "📚（24＋12）÷6", options: ["6本", "8本", "4本"], answer: "6本", explanation: "先求总数：24＋12＝36本，再平均分：36÷6＝6本。" },
  "G6:数学": { subject: "数学", knowledgePoint: "小数加法应用", type: "single_choice", difficulty: 1, source: "local_core", title: "小数付账", prompt: "一个本子6.5元，一支笔3.2元，一共多少钱？", visual: "6.5 + 3.2", options: ["9.7元", "9.5元", "3.3元"], answer: "9.7元", explanation: "小数点对齐相加：6.5＋3.2＝9.7元。" },
  "G7:数学": { subject: "数学", knowledgePoint: "分数应用", type: "single_choice", difficulty: 2, source: "local_core", title: "分数与实际数量", prompt: "合唱队有40人，其中3/5是女生。女生有多少人？", visual: "40 × 3/5", options: ["16人", "24人", "30人"], answer: "24人", explanation: "求40的3/5：40÷5×3＝24。" },
  "G8:数学": { subject: "数学", knowledgePoint: "百分数应用", type: "single_choice", difficulty: 2, source: "local_core", title: "折扣中的数学", prompt: "一个书包原价100元，打八折后多少钱？", visual: "原价100元 → 八折", options: ["80元", "20元", "90元"], answer: "80元", explanation: "八折表示按原价的80%付款：100×80%＝80元。", mathModel: { kind: "steps", title: "把折扣化成百分数", values: [{ label: "原价", value: "100元" }, { label: "八折", value: "× 80%" }], relation: "100 × 80%" } },

  "G5:英语": { subject: "英语", knowledgePoint: "一般现在时", type: "single_choice", difficulty: 2, source: "local_core", title: "Daily routines", prompt: "Choose the correct sentence.", visual: "Tom 🚌 every day", options: ["Tom go to school by bus every day.", "Tom goes to school by bus every day.", "Tom going to school by bus every day."], answer: "Tom goes to school by bus every day.", explanation: "Tom 是第三人称单数，一般现在时中 go 要变成 goes。", vocabulary: [
    { term: "go to school", phonetic: "/ɡəʊ tə skuːl/", tag: "词组", meaning: "去上学", expansion: "go to + 地点，表示去往某地。", example: "I go to school at 7:30.", exampleMeaning: "我七点半去上学。" },
    { term: "by bus", phonetic: "/baɪ bʌs/", tag: "方式短语", meaning: "乘公交车", expansion: "by + 交通工具，中间通常不加冠词。", example: "My sister goes home by bus.", exampleMeaning: "我姐姐乘公交车回家。" },
  ], grammarTip: { title: "一般现在时：第三人称单数", pattern: "He / She / Tom + 动词-s/-es", explanation: "主语是一个人或一个事物时，表示经常发生的动作，动词通常要加-s或-es。" } },
  "G6:英语": { subject: "英语", knowledgePoint: "现在进行时", type: "single_choice", difficulty: 2, source: "local_core", title: "What is happening?", prompt: "Look! The children ____ a science experiment now.", visual: "🧒🧪👧  right now", options: ["do", "are doing", "did"], answer: "are doing", explanation: "Look 和 now 提示动作正在发生，主语 children 是复数，用 are doing。", vocabulary: [
    { term: "science experiment", phonetic: "/ˈsaɪəns ɪkˈsperɪmənt/", tag: "名词词组", meaning: "科学实验", expansion: "do an experiment 表示“做实验”。", example: "We are doing a science experiment.", exampleMeaning: "我们正在做一个科学实验。" },
    { term: "right now", phonetic: "/raɪt naʊ/", tag: "时间短语", meaning: "此刻；现在", expansion: "常用来提示动作正在发生。", example: "Dad is cooking right now.", exampleMeaning: "爸爸此刻正在做饭。" },
  ], grammarTip: { title: "现在进行时", pattern: "主语 + am / is / are + 动词-ing", explanation: "用来表示说话时正在发生的动作；children 是复数，所以使用 are doing。" } },
  "G7:英语": { subject: "英语", knowledgePoint: "一般过去时语境", type: "single_choice", difficulty: 2, source: "local_core", title: "Yesterday's trip", prompt: "Yesterday we ____ the museum and ____ many old pictures.", visual: "Yesterday 🏛️ 🖼️", options: ["visit; see", "visited; saw", "are visiting; seeing"], answer: "visited; saw", explanation: "Yesterday 表示过去，visit 用 visited，see 的过去式是不规则变化 saw。", vocabulary: [
    { term: "visit the museum", phonetic: "/ˈvɪzɪt ðə mjuˈziːəm/", tag: "动词词组", meaning: "参观博物馆", expansion: "visit 后面直接接地点，不需要加 to。", example: "We visited the museum last Sunday.", exampleMeaning: "上周日我们参观了博物馆。" },
    { term: "see — saw", phonetic: "/siː/ — /sɔː/", tag: "不规则动词", meaning: "看见；看到", expansion: "saw 是 see 的过去式，不能写成 seed。", example: "I saw an old train there.", exampleMeaning: "我在那里看到了一辆老火车。" },
  ], grammarTip: { title: "一般过去时", pattern: "过去时间 + 动词过去式", explanation: "yesterday、last week 等过去时间出现时，动作通常使用过去式；规则动词加-ed，不规则动词需要单独记忆。" } },
  "G8:英语": { subject: "英语", knowledgePoint: "短文信息判断", type: "single_choice", difficulty: 2, source: "local_core", title: "Read and decide", prompt: "The nature club moved Saturday's activity to Sunday because of rain. Lucy is free only on Saturday. Can Lucy join the activity?", visual: "📅 activity: Sunday｜Lucy: Saturday only", options: ["Probably not.", "Yes, on Sunday.", "Yes, because it stayed on Saturday."], answer: "Probably not.", explanation: "活动在星期日，而 Lucy 只有星期六有空，所以她很可能不能参加。", vocabulary: [
    { term: "plan to do", phonetic: "/plæn tə duː/", tag: "动词词组", meaning: "计划做某事", expansion: "plan 后接不定式 to do，表示尚未完成的计划。", example: "We plan to plant trees this weekend.", exampleMeaning: "我们计划这个周末植树。" },
    { term: "river bank", phonetic: "/ˈrɪvə bæŋk/", tag: "名词词组", meaning: "河岸", expansion: "bank 除了“银行”，还可以表示河岸。要根据上下文判断词义。", example: "They picked up litter along the river bank.", exampleMeaning: "他们沿着河岸捡垃圾。" },
    { term: "be expected", phonetic: "/bi ɪkˈspektɪd/", tag: "被动表达", meaning: "预计会……", expansion: "常用来表达天气、结果或事件的预测。", example: "Snow is expected tonight.", exampleMeaning: "预计今晚会下雪。" },
    { term: "move ... to ...", phonetic: "/muːv ... tə .../", tag: "动词词组", meaning: "把……改到……", expansion: "可用于更改时间或地点。", example: "They moved the meeting to Friday.", exampleMeaning: "他们把会议改到了星期五。" },
    { term: "may miss", phonetic: "/meɪ mɪs/", tag: "情态动词词组", meaning: "可能错过；可能无法参加", expansion: "may 表示不确定的可能性，后接动词原形。", example: "Hurry up, or we may miss the train.", exampleMeaning: "快一点，否则我们可能会错过火车。" },
  ], grammarTip: { title: "阅读推断：不要只找原句", pattern: "已知事实 A + 已知事实 B → 最合理结论", explanation: "活动改到星期日（A），Lucy只能星期六参加（B），所以可以推断她可能无法参加。may 表示“可能”，符合推断语气。" } },

  "G8:科学": { subject: "科学", knowledgePoint: "控制变量实验", type: "single_choice", difficulty: 3, source: "local_core", title: "设计公平实验", prompt: "要研究“光照是否影响绿豆苗生长”，下面哪种设计最合理？", visual: "研究一个因素时，其他条件应尽量相同。", options: ["两盆相同豆苗，水和温度相同，一盆有光、一盆避光", "一盆多浇水并晒太阳，另一盆少浇水且避光", "用绿豆苗和仙人掌比较"], answer: "两盆相同豆苗，水和温度相同，一盆有光、一盆避光", explanation: "只改变光照条件，其他条件保持相同，才能较可靠地判断光照的影响。" },
  "G8:阅读与表达": { subject: "阅读与表达", knowledgePoint: "信息整合与推断", type: "single_choice", difficulty: 3, source: "local_core", title: "整合多条信息", prompt: "通知写道：“周五的义卖改到室内体育馆，时间不变；易碎物品请加固包装。”小航准备周五下午带玻璃手工作品参加。他最需要做什么？", visual: "地点改变，时间不变，还要注意物品特点。", options: ["改到周六再去", "按原时间去体育馆并加固包装", "仍去操场且不用包装"], answer: "按原时间去体育馆并加固包装", explanation: "需要同时利用“地点改变”“时间不变”和“易碎物品加固”三条信息。" },
};

const englishExtensions: Record<string, Array<Omit<QuestionItem, "id" | "grade" | "eyebrow">>> = {
  G1: [
    { subject: "英语兴趣", knowledgePoint: "字母B与单词", type: "single_choice", difficulty: 1, source: "local_core", title: "B is for ball", prompt: "哪个单词以字母 B 开头？", visual: "B b · ⚽", options: ["ball", "cat", "dog"], answer: "ball", explanation: "ball 的第一个字母是 b。", vocabulary: [{ term: "ball", phonetic: "/bɔːl/", tag: "名词", meaning: "球", expansion: "basketball 和 football 中都有 ball。", example: "This is a ball.", exampleMeaning: "这是一个球。" }] },
    { subject: "英语兴趣", knowledgePoint: "字母C与单词", type: "single_choice", difficulty: 1, source: "local_core", title: "C is for cat", prompt: "哪一组是大写 C、小写 c 和对应单词？", visual: "🐱", options: ["C c · cat", "D d · dog", "A a · apple"], answer: "C c · cat", explanation: "C 和 c 是一对，cat 以 c 开头。", vocabulary: [{ term: "cat", phonetic: "/kæt/", tag: "名词", meaning: "猫", expansion: "a cat 表示一只猫，two cats 表示两只猫。", example: "The cat is cute.", exampleMeaning: "这只猫很可爱。" }] },
  ],
  G2: [
    { subject: "英语兴趣", knowledgePoint: "日常问候", type: "single_choice", difficulty: 1, source: "local_core", title: "Hello, my friend", prompt: "早上见到老师，可以怎么说？", visual: "🌞 👩‍🏫", options: ["Good morning!", "Good night!", "Goodbye!"], answer: "Good morning!", explanation: "早上问候使用 Good morning。", vocabulary: [{ term: "Good morning", phonetic: "/ɡʊd ˈmɔːnɪŋ/", tag: "问候语", meaning: "早上好", expansion: "morning 指从早晨到中午前。", example: "Good morning, Ms Li!", exampleMeaning: "李老师，早上好！" }] },
    { subject: "英语兴趣", knowledgePoint: "表达感谢", type: "single_choice", difficulty: 1, source: "local_core", title: "Thank you", prompt: "朋友把彩笔借给你，你应该说什么？", visual: "🖍️ 🤝", options: ["Thank you.", "Sit down.", "I'm five."], answer: "Thank you.", explanation: "接受别人帮助后，可以用 Thank you 表达感谢。", optionExplanations: { "Thank you.": "意思是“谢谢你”，符合接受朋友帮助后表达感谢的情境。", "Sit down.": "意思是“坐下”，是一条动作指令，不能用来感谢借彩笔的朋友。", "I'm five.": "意思是“我五岁”，是在介绍年龄，与借彩笔和表达感谢无关。" }, vocabulary: [{ term: "Thank you", phonetic: "/ˈθæŋk juː/", tag: "礼貌用语", meaning: "谢谢你", expansion: "回答感谢时可以说 You're welcome。", example: "Thank you for your help.", exampleMeaning: "谢谢你的帮助。" }] },
  ],
  G3: [
    { subject: "英语兴趣", knowledgePoint: "颜色词", type: "single_choice", difficulty: 1, source: "local_core", title: "Colours around us", prompt: "The sky is usually ____ on a sunny day.", visual: "☀️ ☁️", options: ["blue", "green", "black"], answer: "blue", explanation: "晴朗的天空通常是蓝色的。", vocabulary: [{ term: "blue", phonetic: "/bluː/", tag: "颜色词", meaning: "蓝色；蓝色的", expansion: "颜色词可以放在名词前，如 a blue bag。", example: "I have a blue kite.", exampleMeaning: "我有一只蓝色的风筝。" }] },
    { subject: "英语兴趣", knowledgePoint: "物品位置", type: "single_choice", difficulty: 1, source: "local_core", title: "Where is the book?", prompt: "The book is ____ the desk.", visual: "📖 ⬆️ 🪵", options: ["on", "under", "in"], answer: "on", explanation: "图书在桌面上，所以使用 on。", vocabulary: [{ term: "on the desk", phonetic: "/ɒn ðə desk/", tag: "位置词组", meaning: "在书桌上", expansion: "on 表示物体与表面接触。", example: "My pencil is on the desk.", exampleMeaning: "我的铅笔在书桌上。" }], grammarTip: { title: "表达位置", pattern: "物品 + is + 位置词组", explanation: "用 on、in、under 等介词说明物品在哪里。" } },
  ],
  G4: [
    { subject: "英语兴趣", knowledgePoint: "频率与日程", type: "single_choice", difficulty: 2, source: "local_core", title: "After-school clubs", prompt: "Mia goes to the reading club on Tuesday and Friday. Today is Friday. What will she most likely do after school?", visual: "reading club: Tue + Fri｜today: Fri", options: ["Go to the reading club.", "Have a swimming lesson.", "Stay home because it is Sunday."], answer: "Go to the reading club.", explanation: "课程安排和今天的日期都指向 reading club，需要把两条信息合起来判断。", vocabulary: [{ term: "after school", phonetic: "/ˌɑːftə ˈskuːl/", tag: "时间词组", meaning: "放学后", expansion: "用于说明活动发生的时间。", example: "I read after school.", exampleMeaning: "我放学后阅读。" }, { term: "most likely", phonetic: "/məʊst ˈlaɪkli/", tag: "推断词组", meaning: "最有可能", expansion: "阅读题中表示要根据线索作合理推断。", example: "Which answer is most likely?", exampleMeaning: "哪个答案最有可能？" }] },
    { subject: "英语兴趣", knowledgePoint: "过去事件顺序", type: "single_choice", difficulty: 2, source: "local_core", title: "A busy morning", prompt: "Ben missed the bus, so he walked to school. He arrived five minutes late. Why was Ben late?", visual: "missed bus → walked → arrived late", options: ["He missed the bus.", "He got up at school.", "The lesson ended early."], answer: "He missed the bus.", explanation: "missed the bus 是原因，walked 和 arrived late 是后续结果。", vocabulary: [{ term: "miss the bus", phonetic: "/mɪs ðə bʌs/", tag: "动词词组", meaning: "错过公交车", expansion: "miss 在这里表示没赶上。", example: "We missed the bus yesterday.", exampleMeaning: "我们昨天没赶上公交车。" }, { term: "arrive late", phonetic: "/əˈraɪv leɪt/", tag: "动词词组", meaning: "迟到", expansion: "arrive 表示到达，late 表示晚。", example: "Do not arrive late for class.", exampleMeaning: "上课不要迟到。" }] },
    { subject: "英语兴趣", knowledgePoint: "通知信息匹配", type: "single_choice", difficulty: 2, source: "local_core", title: "Class notice", prompt: "NOTICE: Bring a ruler and coloured pencils for Friday's art project. Which student is ready?", visual: "Friday · art project · ruler + coloured pencils", options: ["Lily has a ruler and coloured pencils.", "Tom has only a football.", "Sam brings a bowl and a spoon."], answer: "Lily has a ruler and coloured pencils.", explanation: "通知要求直尺和彩色铅笔，只有 Lily 同时满足两项要求。", vocabulary: [{ term: "be ready", phonetic: "/bi ˈredi/", tag: "形容词词组", meaning: "准备好了", expansion: "ready for... 表示为某事做好准备。", example: "We are ready for the project.", exampleMeaning: "我们为项目做好了准备。" }, { term: "art project", phonetic: "/ɑːt ˈprɒdʒekt/", tag: "名词词组", meaning: "美术项目", expansion: "project 通常指需要若干步骤完成的任务。", example: "Our art project is about trees.", exampleMeaning: "我们的美术项目主题是树。" }] },
    { subject: "英语兴趣", knowledgePoint: "对话意图推断", type: "single_choice", difficulty: 2, source: "local_core", title: "At the bookshop", prompt: "— This storybook is 18 yuan. I have 15 yuan. — You can choose the smaller one. What is the problem?", visual: "book ¥18｜money ¥15", options: ["The child does not have enough money.", "The bookshop has no storybooks.", "The smaller book costs 18 yuan more."], answer: "The child does not have enough money.", explanation: "18元高于15元，所以钱不够；对方建议选择较小的一本也支持这个判断。", vocabulary: [{ term: "enough money", phonetic: "/ɪˈnʌf ˈmʌni/", tag: "名词词组", meaning: "足够的钱", expansion: "enough 放在名词前表示数量足够。", example: "I have enough money for the book.", exampleMeaning: "我有足够的钱买这本书。" }, { term: "choose", phonetic: "/tʃuːz/", tag: "动词", meaning: "选择", expansion: "过去式是 chose。", example: "Choose one book to read.", exampleMeaning: "选择一本书来读。" }] },
  ],
  G5: [
    { subject: "英语", knowledgePoint: "there be句型", type: "single_choice", difficulty: 2, source: "local_core", title: "In our classroom", prompt: "There ____ two maps on the wall.", visual: "🗺️ 🗺️  on the wall", options: ["is", "are", "be"], answer: "are", explanation: "two maps 是复数，所以使用 There are。", vocabulary: [{ term: "on the wall", phonetic: "/ɒn ðə wɔːl/", tag: "位置词组", meaning: "在墙上", expansion: "on 强调物体附着在表面。", example: "There is a clock on the wall.", exampleMeaning: "墙上有一个钟。" }], grammarTip: { title: "There be句型", pattern: "There is + 单数 / There are + 复数", explanation: "be动词要和后面紧接的名词保持单复数一致。" } },
    { subject: "英语", knowledgePoint: "特殊疑问句", type: "fill_blank", difficulty: 2, source: "local_core", title: "Ask about time", prompt: "请填入合适的英文：— ____ do you get up? — At seven o'clock.", visual: "⏰ 7:00", options: [], answer: "What time", explanation: "回答是具体时间，因此使用 What time 提问。", vocabulary: [{ term: "get up", phonetic: "/ɡet ʌp/", tag: "动词词组", meaning: "起床", expansion: "get up 指从床上起来，wake up 指醒来。", example: "I get up at seven.", exampleMeaning: "我七点起床。" }], grammarTip: { title: "询问时间", pattern: "What time do you + 动词原形?", explanation: "询问某个日常活动的时间，用 What time 开头。" } },
  ],
  G6: [
    { subject: "英语", knowledgePoint: "路线指引", type: "single_choice", difficulty: 2, source: "local_core", title: "Find the library", prompt: "Go straight and turn left ____ the second crossing.", visual: "⬆️ then ⬅️ at 2️⃣", options: ["at", "on", "from"], answer: "at", explanation: "在路口这一位置使用介词 at。", vocabulary: [{ term: "turn left", phonetic: "/tɜːn left/", tag: "动词词组", meaning: "向左转", expansion: "相反方向是 turn right。", example: "Turn left at the school gate.", exampleMeaning: "在校门口向左转。" }, { term: "crossing", phonetic: "/ˈkrɒsɪŋ/", tag: "名词", meaning: "十字路口；交叉口", expansion: "the second crossing 表示第二个路口。", example: "The bank is near the crossing.", exampleMeaning: "银行在十字路口附近。" }] },
    { subject: "英语", knowledgePoint: "一般将来时", type: "ordering", difficulty: 2, source: "local_core", title: "Weekend plans", prompt: "点击词语，排列成正确的句子。", visual: "📅 Sunday · 🌳 plant trees", options: ["We", "are going to", "plant", "trees", "this Sunday."], answer: "We | are going to | plant | trees | this Sunday.", explanation: "正确语序是“主语 + be going to + 动词原形 + 其他”。", vocabulary: [{ term: "plant trees", phonetic: "/plɑːnt triːz/", tag: "动词词组", meaning: "植树", expansion: "plant 既可以作动词“种植”，也可以作名词“植物”。", example: "They plant trees every spring.", exampleMeaning: "他们每年春天植树。" }], grammarTip: { title: "表达计划", pattern: "be going to + 动词原形", explanation: "表示已经打算或计划要做的事情。" } },
  ],
  G7: [
    { subject: "英语", knowledgePoint: "比较级", type: "single_choice", difficulty: 2, source: "local_core", title: "Compare the animals", prompt: "An elephant is ____ than a panda.", visual: "🐘 ↔️ 🐼", options: ["heavy", "heavier", "heaviest"], answer: "heavier", explanation: "句中有 than，需要使用比较级 heavier。", vocabulary: [{ term: "heavier than", phonetic: "/ˈhevɪə ðæn/", tag: "比较结构", meaning: "比……更重", expansion: "heavy 变比较级时，y变i再加-er。", example: "This box is heavier than that one.", exampleMeaning: "这个箱子比那个更重。" }], grammarTip: { title: "形容词比较级", pattern: "A + be + 比较级 + than + B", explanation: "比较两个人或事物时使用比较级和 than。" } },
    { subject: "英语", knowledgePoint: "建议表达", type: "single_choice", difficulty: 2, source: "local_core", title: "Give good advice", prompt: "Your friend has a cold. What should you say?", visual: "🤧 🛌 💧", options: ["You should rest and drink water.", "You should run in the rain.", "You should eat more ice cream."], answer: "You should rest and drink water.", explanation: "感冒时休息并补充水分是合理建议。", vocabulary: [{ term: "have a cold", phonetic: "/hæv ə kəʊld/", tag: "固定词组", meaning: "感冒", expansion: "这里的 cold 是名词，不是“寒冷的”。", example: "I have a cold today.", exampleMeaning: "我今天感冒了。" }, { term: "should", phonetic: "/ʃʊd/", tag: "情态动词", meaning: "应该", expansion: "should 后面接动词原形，用来提出建议。", example: "You should go to bed early.", exampleMeaning: "你应该早点睡觉。" }], grammarTip: { title: "提出建议", pattern: "You should + 动词原形", explanation: "should 表示“应该”，语气比命令更温和。" } },
  ],
  G8: [
    { subject: "英语", knowledgePoint: "短文主旨", type: "single_choice", difficulty: 3, source: "local_core", title: "Find the main idea", prompt: "Mia started carrying a reusable bottle, refused plastic straws and asked her family to sort rubbish. Soon, her brother joined her. What is the passage mainly about?", visual: "♻️  🥤  🚫  🗑️  👧→👦", options: ["Mia's green habits influenced her family.", "Mia wanted to buy a new bottle.", "Mia's brother disliked sorting rubbish."], answer: "Mia's green habits influenced her family.", explanation: "三个行为都围绕环保习惯，最后弟弟也加入，主旨是个人行动影响家人。", vocabulary: [{ term: "reusable", phonetic: "/ˌriːˈjuːzəbəl/", tag: "形容词", meaning: "可重复使用的", expansion: "re-表示“再次”，usable表示“可使用的”。", example: "A reusable bag can reduce waste.", exampleMeaning: "可重复使用的袋子能减少垃圾。" }, { term: "sort rubbish", phonetic: "/sɔːt ˈrʌbɪʃ/", tag: "动词词组", meaning: "垃圾分类", expansion: "sort 表示按照类别整理。", example: "We sort rubbish at home.", exampleMeaning: "我们在家进行垃圾分类。" }], grammarTip: { title: "概括文章主旨", pattern: "重复主题 + 结果变化 → 中心意思", explanation: "不要选择只覆盖一个细节的答案，要找能概括全文行为和结果的选项。" } },
    { subject: "英语", knowledgePoint: "条件句语境", type: "single_choice", difficulty: 3, source: "local_core", title: "Weather and plans", prompt: "If it ____ tomorrow, the football match will be held in the school gym.", visual: "🌧️ → ⚽ indoors", options: ["rains", "will rain", "rained"], answer: "rains", explanation: "真实条件句中，if从句用一般现在时，主句使用will。", vocabulary: [{ term: "be held", phonetic: "/bi held/", tag: "被动词组", meaning: "被举行；举办", expansion: "活动作主语时常使用 be held。", example: "The show will be held on Friday.", exampleMeaning: "演出将在星期五举行。" }, { term: "school gym", phonetic: "/skuːl dʒɪm/", tag: "名词词组", meaning: "学校体育馆", expansion: "gym 是 gymnasium 的常用缩写。", example: "We play basketball in the school gym.", exampleMeaning: "我们在学校体育馆打篮球。" }], grammarTip: { title: "真实条件句", pattern: "If + 一般现在时, 主语 + will + 动词原形", explanation: "谈论未来可能发生的条件时，if从句通常不用will。" } },
  ],
};

const mathExtensions: Record<string, Array<Omit<QuestionItem, "id" | "grade" | "eyebrow">>> = {
  G8: [
    { subject: "数学", knowledgePoint: "比与比例", type: "single_choice", difficulty: 3, source: "local_core", title: "配制果汁", prompt: "橙汁和水按2∶3配制。用了400毫升橙汁，需要加入多少毫升水？", visual: "🍊 2份 ︰ 💧 3份", options: ["500毫升", "600毫升", "800毫升"], answer: "600毫升", explanation: "400毫升对应2份，每份是200毫升；水有3份，所以需要200×3＝600毫升。", mathModel: { kind: "steps", title: "先求每份，再求3份水", values: [{ label: "橙汁", value: "2份＝400毫升" }, { label: "每份", value: "400÷2＝200" }, { label: "水", value: "200×3" }], relation: "400 ÷ 2 × 3" } },
    { subject: "数学", knowledgePoint: "圆的周长", type: "single_choice", difficulty: 3, source: "local_core", title: "圆形花坛", prompt: "一个圆形花坛的半径是5米，沿花坛边缘走一圈约是多少米？（π取3.14）", visual: "圆形花坛 · 半径5米", options: ["15.7米", "31.4米", "78.5米"], answer: "31.4米", explanation: "圆的周长＝2×π×半径，所以2×3.14×5＝31.4米。", mathModel: { kind: "circle", title: "看清半径，再选择周长公式", values: [{ label: "半径 r", value: "5米" }, { label: "圆周率 π", value: "3.14" }], relation: "C＝2πr" } },
    { subject: "数学", knowledgePoint: "用方程解决问题", type: "fill_blank", difficulty: 3, source: "local_core", title: "列方程找未知数", prompt: "3个相同的文具盒共75元。设每个文具盒x元，方程3x＝75，x＝____。", visual: "✏️盒 × 3＝75元", options: [], answer: "25", explanation: "方程两边同时除以3，x＝75÷3＝25。", mathModel: { kind: "steps", title: "把总价平均分成3份", values: [{ label: "数量", value: "3个" }, { label: "总价", value: "75元" }, { label: "单价", value: "x元" }], relation: "3x＝75" } },
  ],
};

/**
 * 非英语课程扩展题库：每门课按年级提供 2 道扩展题，配合基础题让课程中心每门课可开放 3+ 课时。
 * 键结构：subjectExtensions[课程名][年级] = 题目数组（不含 id/grade/eyebrow，由 getCourseQuestions 自动补充）
 */
const subjectExtensions: Record<string, Record<string, Array<Omit<QuestionItem, "id" | "grade" | "eyebrow">>>> = {
  // ================= 幼儿阶段 G1/G2 =================
  语言表达: {
    G1: [
      { subject: "语言表达", knowledgePoint: "礼貌用语", type: "single_choice", difficulty: 1, source: "local_core", title: "甜甜的问候", prompt: "早上见到老师，哪句话最有礼貌？", visual: "🌞 🧒 👩‍🏫", options: ["老师，早上好！", "喂，你来了。", "让开，我要过去。"], answer: "老师，早上好！", explanation: "用“早上好”问候老师，是礼貌的做法，别人听了也会开心。" },
      { subject: "语言表达", knowledgePoint: "看图说话", type: "single_choice", difficulty: 1, source: "local_core", title: "小兔在做什么", prompt: "小兔拿着水壶给花浇水，哪句话说得最完整？", visual: "🐰 💧 🌷", options: ["小兔。", "浇水。", "小兔正在给花浇水。"], answer: "小兔正在给花浇水。", explanation: "完整的话要说清楚“谁在做什么”，小兔＋浇水＋花，三样都说到了。" },
      { subject: "语言表达", knowledgePoint: "声音联想", type: "single_choice", difficulty: 1, source: "local_core", title: "听声音猜动物", prompt: "“汪汪汪”是谁在叫？", visual: "🔊 汪汪汪", options: ["小狗", "小猫", "小鸭"], answer: "小狗", explanation: "小狗的叫声是“汪汪汪”，小猫是“喵喵喵”，小鸭是“嘎嘎嘎”。" },
      { subject: "语言表达", knowledgePoint: "礼貌用语", type: "single_choice", difficulty: 1, source: "local_core", title: "道谢怎么说", prompt: "小熊帮你捡起了球，你应该说什么？", visual: "🐻 🤝 ⚽", options: ["谢谢！", "走开！", "给我！"], answer: "谢谢！", explanation: "别人帮助了我们，说“谢谢”是最有礼貌的回应。" },
      { subject: "语言表达", knowledgePoint: "自我介绍", type: "single_choice", difficulty: 1, source: "local_core", title: "介绍自己", prompt: "第一次见到新朋友，下面哪种自我介绍更完整？", visual: "🧒 👋", options: ["大家好，我叫乐乐，我5岁了。", "你好。", "让开。"], answer: "大家好，我叫乐乐，我5岁了。", explanation: "完整的自我介绍要说清楚自己叫什么、几岁了。" },
    ],
    G2: [
      { subject: "语言表达", knowledgePoint: "表达顺序", type: "single_choice", difficulty: 1, source: "local_core", title: "先做什么", prompt: "早上起床后，下面哪个顺序更合理？", visual: "🛏️ → 🪥 → 🍞", options: ["起床→刷牙洗脸→吃早餐", "吃早餐→再睡觉→再起床", "先玩玩具→再吃早餐"], answer: "起床→刷牙洗脸→吃早餐", explanation: "起床后先洗漱再吃早餐，是健康的生活顺序。" },
      { subject: "语言表达", knowledgePoint: "倾听与回应", type: "single_choice", difficulty: 1, source: "local_core", title: "好好回应", prompt: "朋友说：“我的积木城堡搭好了！”你会怎么回应？", visual: "🧒 🏰 🧱", options: ["哇！你好厉害，能带我看看吗？", "有什么好看的。", "我不理你。"], answer: "哇！你好厉害，能带我看看吗？", explanation: "认真听朋友说话并真诚回应，是交朋友的好方法。" },
      { subject: "语言表达", knowledgePoint: "描述动作", type: "single_choice", difficulty: 1, source: "local_core", title: "他们在做什么", prompt: "看图片：两个小朋友在荡秋千。哪句话说得对？", visual: "👧👦 🎠", options: ["小朋友在荡秋千。", "小朋友在睡觉。", "小朋友在吃饭。"], answer: "小朋友在荡秋千。", explanation: "图片里小朋友在玩秋千，用“荡秋千”来描述最准确。" },
      { subject: "语言表达", knowledgePoint: "反义词", type: "single_choice", difficulty: 1, source: "local_core", title: "找相反", prompt: "“大”的相反是哪一个？", visual: "🐘 大 ↔ 小", options: ["小", "多", "高"], answer: "小", explanation: "“大”和“小”是一对反义词，大象很大，蚂蚁很小。" },
      { subject: "语言表达", knowledgePoint: "传话游戏", type: "single_choice", difficulty: 1, source: "local_core", title: "把话说清楚", prompt: "你想请妈妈帮你拿水杯，怎么说得最清楚？", visual: "🧒 💬 👩", options: ["妈妈，请帮我把桌上的水杯拿过来，好吗？", "那个那个……", "嗯嗯嗯。"], answer: "妈妈，请帮我把桌上的水杯拿过来，好吗？", explanation: "把要什么、在哪里说清楚，别人才能明白你的意思。" },
    ],
  },
  数量与空间: {
    G1: [
      { subject: "数量与空间", knowledgePoint: "1-5数数", type: "single_choice", difficulty: 1, source: "local_core", title: "数一数星星", prompt: "天空中有几颗星星？", visual: "⭐ ⭐ ⭐ ⭐", options: ["3颗", "4颗", "5颗"], answer: "4颗", explanation: "一颗一颗数：1、2、3、4，一共有4颗。" },
      { subject: "数量与空间", knowledgePoint: "形状辨认", type: "single_choice", difficulty: 1, source: "local_core", title: "圆形在哪里", prompt: "下面哪一个东西是圆形的？", visual: "⚽ 🟦 📦", options: ["足球", "方盒子", "书本"], answer: "足球", explanation: "足球是圆形的，方盒子和书本都有直直的边。" },
      { subject: "数量与空间", knowledgePoint: "高矮比较", type: "single_choice", difficulty: 1, source: "local_core", title: "谁更高", prompt: "长颈鹿和小兔子站在一起，谁更高？", visual: "🦒 🐰", options: ["长颈鹿", "小兔子", "一样高"], answer: "长颈鹿", explanation: "长颈鹿的脖子很长，个子比小兔子高多了。" },
      { subject: "数量与空间", knowledgePoint: "前后方位", type: "single_choice", difficulty: 1, source: "local_core", title: "排队上车", prompt: "小猫排在小狗的前面，小狗的后面是小兔。谁排在最后？", visual: "🐱 → 🐶 → 🐰", options: ["小兔", "小猫", "小狗"], answer: "小兔", explanation: "从前到后是：小猫、小狗、小兔，小兔排在最后。" },
      { subject: "数量与空间", knowledgePoint: "长短比较", type: "single_choice", difficulty: 1, source: "local_core", title: "谁的铅笔长", prompt: "小明的铅笔比小红的铅笔长，比小刚的铅笔短。谁的铅笔最长？", visual: "✏️ 小明 > 小红 · 小明 < 小刚", options: ["小刚", "小明", "小红"], answer: "小刚", explanation: "小刚的铅笔比小明还长，所以小刚的铅笔最长。" },
    ],
    G2: [
      { subject: "数量与空间", knowledgePoint: "10以内加减", type: "single_choice", difficulty: 1, source: "local_core", title: "苹果分一分", prompt: "盘子里有5个苹果，吃掉2个，还剩几个？", visual: "🍎🍎🍎🍎🍎 − 🍎🍎", options: ["2个", "3个", "7个"], answer: "3个", explanation: "5−2＝3，还剩3个苹果。" },
      { subject: "数量与空间", knowledgePoint: "上下左右", type: "single_choice", difficulty: 1, source: "local_core", title: "小猫在哪里", prompt: "小猫在桌子的什么位置？", visual: "🐱 在桌子下面", options: ["上面", "下面", "旁边"], answer: "下面", explanation: "小猫在桌子下面，躲在桌底下的是“下面”。" },
      { subject: "数量与空间", knowledgePoint: "10以内比较", type: "single_choice", difficulty: 1, source: "local_core", title: "谁更多", prompt: "左边有6颗糖，右边有8颗糖，哪边更多？", visual: "🍬🍬🍬🍬🍬🍬 vs 🍬🍬🍬🍬🍬🍬🍬🍬", options: ["右边更多", "左边更多", "一样多"], answer: "右边更多", explanation: "6比8小，所以右边的8颗糖更多。" },
      { subject: "数量与空间", knowledgePoint: "分类计数", type: "single_choice", difficulty: 1, source: "local_core", title: "数一数小动物", prompt: "草地上有2只兔子、3只小鸡。小动物一共有几只？", visual: "🐰🐰 🐤🐤🐤", options: ["5只", "3只", "6只"], answer: "5只", explanation: "把兔子和鸡合起来数：2＋3＝5只。" },
      { subject: "数量与空间", knowledgePoint: "方位判断", type: "single_choice", difficulty: 1, source: "local_core", title: "皮球滚向哪", prompt: "皮球从斜坡上滚下来，通常会滚向哪里？", visual: "🔴 斜坡 ⬇️", options: ["低处", "高处", "天上"], answer: "低处", explanation: "球会从高处往低处滚，这就是从上到下的方向。" },
    ],
  },
  科学探索: {
    G1: [
      { subject: "科学探索", knowledgePoint: "天气观察", type: "single_choice", difficulty: 1, source: "local_core", title: "看看天空", prompt: "天空乌云密布，还打雷，这是什么天气？", visual: "⛈️", options: ["晴天", "雨天", "下雪天"], answer: "雨天", explanation: "乌云和雷声通常表示要下雨了。" },
      { subject: "科学探索", knowledgePoint: "动物生活", type: "single_choice", difficulty: 1, source: "local_core", title: "鱼儿住哪里", prompt: "小鱼通常生活在哪里？", visual: "🐟 🏠", options: ["水里", "树上", "山洞里"], answer: "水里", explanation: "鱼用鳃呼吸，生活在水里。" },
      { subject: "科学探索", knowledgePoint: "植物观察", type: "single_choice", difficulty: 1, source: "local_core", title: "树的影子", prompt: "晴天正午，站在太阳底下的小树，影子在哪里？", visual: "🌞 🌳 影子", options: ["在小树脚下", "在小树头顶", "影子消失了"], answer: "在小树脚下", explanation: "光被小树挡住，就在小树脚下形成了影子。" },
      { subject: "科学探索", knowledgePoint: "感官观察", type: "single_choice", difficulty: 1, source: "local_core", title: "用眼睛看", prompt: "想知道花的颜色，应该用什么看？", visual: "🌺 👀", options: ["眼睛", "耳朵", "鼻子"], answer: "眼睛", explanation: "颜色要用眼睛看，耳朵听声音，鼻子闻气味。" },
      { subject: "科学探索", knowledgePoint: "磁铁小实验", type: "single_choice", difficulty: 1, source: "local_core", title: "磁铁好朋友", prompt: "磁铁能吸住下面哪样东西？", visual: "🧲 📎", options: ["回形针", "橡皮", "铅笔"], answer: "回形针", explanation: "磁铁能吸住铁做的东西，回形针是铁做的。" },
    ],
    G2: [
      { subject: "科学探索", knowledgePoint: "沉与浮", type: "single_choice", difficulty: 1, source: "local_core", title: "会浮起来吗", prompt: "把木块放进水里，它会怎样？", visual: "🪵 💧", options: ["浮在水面", "沉到水底", "飞上天"], answer: "浮在水面", explanation: "木块比水轻，放进水里会浮在水面上。" },
      { subject: "科学探索", knowledgePoint: "季节变化", type: "single_choice", difficulty: 1, source: "local_core", title: "树叶变黄了", prompt: "很多树的叶子变黄飘落，这是什么季节？", visual: "🍂", options: ["春天", "夏天", "秋天"], answer: "秋天", explanation: "秋天天气转凉，很多树叶会变黄落下来。" },
      { subject: "科学探索", knowledgePoint: "天气与生活", type: "single_choice", difficulty: 1, source: "local_core", title: "下雨天带什么", prompt: "外面下着大雨，出门前应该带上什么？", visual: "🌧️ ☂️", options: ["雨伞", "游泳圈", "风扇"], answer: "雨伞", explanation: "下雨天打伞或穿雨衣，就不会被雨淋湿。" },
      { subject: "科学探索", knowledgePoint: "动物冬眠", type: "single_choice", difficulty: 1, source: "local_core", title: "谁要冬眠", prompt: "冬天到了，下面哪个小动物会睡觉过冬？", visual: "🐻 ❄️", options: ["小熊", "小鸟", "小鱼"], answer: "小熊", explanation: "小熊、小青蛙等动物冬天会冬眠，睡到春天才醒来。" },
      { subject: "科学探索", knowledgePoint: "水的形态", type: "single_choice", difficulty: 1, source: "local_core", title: "水变成冰", prompt: "把水放进冰箱冷冻，水会变成什么？", visual: "💧 ❄️", options: ["冰", "蒸汽", "牛奶"], answer: "冰", explanation: "温度很低时，水会结冰，变成硬硬的冰。" },
    ],
  },
  健康习惯: {
    G1: [
      { subject: "健康习惯", knowledgePoint: "按时作息", type: "single_choice", difficulty: 1, source: "local_core", title: "早睡早起", prompt: "小朋友晚上应该几点左右睡觉更健康？", visual: "🌙 😴", options: ["很晚很晚", "天黑就睡（约8-9点）", "天亮才睡"], answer: "天黑就睡（约8-9点）", explanation: "早睡才能长高高，第二天也有精神学习和游戏。" },
      { subject: "健康习惯", knowledgePoint: "喝水的习惯", type: "single_choice", difficulty: 1, source: "local_core", title: "及时喝水", prompt: "运动出汗后应该怎么做？", visual: "🏃 💦", options: ["马上喝一大瓶冰水", "及时补充温水并休息", "一直不喝水"], answer: "及时补充温水并休息", explanation: "运动后补充温水、慢慢休息，对身体最舒服。" },
      { subject: "健康习惯", knowledgePoint: "蔬果营养", type: "single_choice", difficulty: 1, source: "local_core", title: "多吃蔬菜", prompt: "下面哪一样是蔬菜？", visual: "🥕 🍭 🍔", options: ["胡萝卜", "棒棒糖", "汉堡"], answer: "胡萝卜", explanation: "胡萝卜是蔬菜，多吃蔬菜能让身体更强壮。" },
      { subject: "健康习惯", knowledgePoint: "午睡习惯", type: "single_choice", difficulty: 1, source: "local_core", title: "中午休息", prompt: "中午吃完饭，怎么安排更健康？", visual: "😴 🕛", options: ["安静地午睡一会儿", "一直跑来跑去", "不休息继续玩"], answer: "安静地午睡一会儿", explanation: "午睡能让身体和大脑休息，下午更有精神。" },
      { subject: "健康习惯", knowledgePoint: "感冒防护", type: "single_choice", difficulty: 1, source: "local_core", title: "打喷嚏捂嘴", prompt: "打喷嚏的时候，正确的做法是？", visual: "🤧 🤲", options: ["用手肘或纸巾捂住口鼻", "对着别人打", "张大嘴巴大声打"], answer: "用手肘或纸巾捂住口鼻", explanation: "捂住口鼻打喷嚏，病毒就不会飞得到处都是。" },
    ],
    G2: [
      { subject: "健康习惯", knowledgePoint: "用眼卫生", type: "single_choice", difficulty: 1, source: "local_core", title: "爱护眼睛", prompt: "看电视时，下面哪种做法能保护眼睛？", visual: "📺 👀", options: ["贴着屏幕看", "保持距离并开灯", "关灯躺着看"], answer: "保持距离并开灯", explanation: "保持合适距离、光线充足，眼睛不容易疲劳。" },
      { subject: "健康习惯", knowledgePoint: "运动安全", type: "single_choice", difficulty: 1, source: "local_core", title: "运动前准备", prompt: "跑步之前最好先做什么？", visual: "🏃 🤸", options: ["热身活动身体", "马上冲刺", "吃很多零食"], answer: "热身活动身体", explanation: "先热身可以活动筋骨，减少运动受伤。" },
      { subject: "健康习惯", knowledgePoint: "坐姿习惯", type: "single_choice", difficulty: 1, source: "local_core", title: "坐得端正", prompt: "画画的时候，正确的坐姿是？", visual: "🧒 🪑", options: ["背挺直，坐端正", "趴在地上画", "歪着身子"], answer: "背挺直，坐端正", explanation: "端正的坐姿能保护我们的脊柱和眼睛。" },
      { subject: "健康习惯", knowledgePoint: "睡前准备", type: "single_choice", difficulty: 1, source: "local_core", title: "睡前做什么", prompt: "睡觉前，哪件事更适合做？", visual: "🌙 📖", options: ["听一个安静的故事", "看很久电视", "跑来跑去"], answer: "听一个安静的故事", explanation: "睡前做安静的事，身体慢慢放松，更容易入睡。" },
      { subject: "健康习惯", knowledgePoint: "刷牙习惯", type: "single_choice", difficulty: 1, source: "local_core", title: "早晚刷牙", prompt: "每天什么时候需要刷牙？", visual: "🪥", options: ["早上和晚上各一次", "只要早上刷", "从来不刷"], answer: "早上和晚上各一次", explanation: "早晚刷牙、饭后漱口，牙齿才会白白的、健健康康。" },
    ],
    G3: [
      { subject: "健康习惯", knowledgePoint: "刷牙方法", type: "single_choice", difficulty: 1, source: "local_core", title: "正确刷牙", prompt: "刷牙时，正确的做法是？", visual: "🪥", options: ["上下里外都刷到，刷够时间", "只刷前面几颗牙", "随便沾水就完事"], answer: "上下里外都刷到，刷够时间", explanation: "每颗牙的里外和上面都要刷到，才能保护牙齿。" },
      { subject: "健康习惯", knowledgePoint: "睡眠时长", type: "single_choice", difficulty: 1, source: "local_core", title: "睡够了吗", prompt: "小学生每天大约需要睡多长时间？", visual: "😴", options: ["9-11小时", "3-4小时", "越多越好不用动"], answer: "9-11小时", explanation: "小学生睡眠充足，白天学习才更有精神。" },
      { subject: "健康习惯", knowledgePoint: "视力保护", type: "single_choice", difficulty: 1, source: "local_core", title: "眼保健操", prompt: "连续写了很久作业，眼睛有点酸，应该怎么做？", visual: "👀 ✍️", options: ["放下笔，远眺或做眼保健操", "凑近书本继续写", "用力揉眼睛"], answer: "放下笔，远眺或做眼保健操", explanation: "让眼睛休息、远眺或做眼保健操，能缓解眼睛疲劳。" },
    ],
    G4: [
      { subject: "健康习惯", knowledgePoint: "个人卫生", type: "single_choice", difficulty: 1, source: "local_core", title: "勤洗手", prompt: "下面哪个时刻最需要洗手？", visual: "🙌", options: ["饭前便后", "刚起床", "看完书"], answer: "饭前便后", explanation: "饭前便后洗手能减少细菌进入身体。" },
      { subject: "健康习惯", knowledgePoint: "运动频率", type: "single_choice", difficulty: 1, source: "local_core", title: "天天运动", prompt: "小学生每天运动多长时间比较合适？", visual: "🏃", options: ["至少1小时", "完全不动", "只在体育课动一下"], answer: "至少1小时", explanation: "每天1小时左右运动，有助于长高和增强体质。" },
      { subject: "健康习惯", knowledgePoint: "安全用电", type: "single_choice", difficulty: 2, source: "local_core", title: "安全用电", prompt: "发现插座有点冒火花，正确的做法是？", visual: "⚡", options: ["告诉大人，请大人处理", "自己用手摸一摸", "用湿布擦"], answer: "告诉大人，请大人处理", explanation: "电很危险，遇到异常要远离并立即告诉大人。" },
    ],
    G5: [
      { subject: "健康习惯", knowledgePoint: "饮食均衡", type: "single_choice", difficulty: 2, source: "local_core", title: "营养搭配", prompt: "下面哪份早餐营养更均衡？", visual: "🍳", options: ["牛奶＋鸡蛋＋全麦面包＋水果", "只有一杯可乐", "只有一包薯片"], answer: "牛奶＋鸡蛋＋全麦面包＋水果", explanation: "蛋白质、主食、水果都有，营养更全面。" },
      { subject: "健康习惯", knowledgePoint: "脊柱健康", type: "single_choice", difficulty: 2, source: "local_core", title: "坐姿端正", prompt: "写作业时，正确的坐姿是？", visual: "🪑 ✍️", options: ["挺直腰背，眼睛离书本一尺", "趴着写", "歪着身子"], answer: "挺直腰背，眼睛离书本一尺", explanation: "端正坐姿、保持合适距离，能保护视力和脊柱。" },
      { subject: "健康习惯", knowledgePoint: "户外活动", type: "single_choice", difficulty: 2, source: "local_core", title: "阳光运动", prompt: "周末天气晴朗，哪种安排对身体更好？", visual: "☀️ 🏃", options: ["去户外运动，晒晒太阳", "一整天躺着看手机", "关在屋里吃零食"], answer: "去户外运动，晒晒太阳", explanation: "户外运动和晒太阳有助于增强体质、补充维生素D。" },
    ],
    G6: [
      { subject: "健康习惯", knowledgePoint: "情绪健康", type: "single_choice", difficulty: 2, source: "local_core", title: "心情低落", prompt: "连着几天心情低落，最好的做法是？", visual: "😔", options: ["告诉家长或老师并寻求帮助", "一直憋着", "用游戏麻痹自己"], answer: "告诉家长或老师并寻求帮助", explanation: "情绪低落时向信任的人倾诉、求助，是健康的方式。" },
      { subject: "健康习惯", knowledgePoint: "网络安全健康", type: "single_choice", difficulty: 2, source: "local_core", title: "屏幕时间", prompt: "连续看屏幕很久后，正确的做法是？", visual: "📱 ⏳", options: ["远眺休息并活动身体", "继续看更久", "在黑暗里盯着"], answer: "远眺休息并活动身体", explanation: "每看一段时间就远眺、活动，能减少眼睛疲劳。" },
      { subject: "健康习惯", knowledgePoint: "心理健康", type: "single_choice", difficulty: 2, source: "local_core", title: "缓解紧张", prompt: "上台表演前很紧张，哪种方法能帮助放松？", visual: "🎤 😰", options: ["做几次深呼吸，想象自己很棒", "一直想会出错怎么办", "临阵逃跑"], answer: "做几次深呼吸，想象自己很棒", explanation: "深呼吸能平复心跳，积极暗示能增强信心。" },
    ],
    G7: [
      { subject: "健康习惯", knowledgePoint: "青春期变化", type: "single_choice", difficulty: 2, source: "local_core", title: "身体变化", prompt: "进入青春期，身体开始变化，正确的态度是？", visual: "🌱 成长", options: ["了解知识，正确看待成长变化", "感到害羞完全回避", "和别人比较嘲笑"], answer: "了解知识，正确看待成长变化", explanation: "青春期是正常成长阶段，学习相关知识、坦然面对最重要。" },
      { subject: "健康习惯", knowledgePoint: "急救常识", type: "single_choice", difficulty: 3, source: "local_core", title: "流鼻血处理", prompt: "同学流鼻血时，正确做法是？", visual: "🤧", options: ["身体前倾、按压鼻翼，找大人帮忙", "仰头让血倒流", "用力拍打"], answer: "身体前倾、按压鼻翼，找大人帮忙", explanation: "前倾按压鼻翼可以减少流血，同时要请大人处理。" },
      { subject: "健康习惯", knowledgePoint: "用药安全", type: "single_choice", difficulty: 2, source: "local_core", title: "不乱吃药", prompt: "生病了，哪种做法正确？", visual: "💊", options: ["按医生或大人指导用药", "自己加大药量好得快", "吃别人的药"], answer: "按医生或大人指导用药", explanation: "用药要遵医嘱，不能自行加量或乱吃别人的药。" },
    ],
    G8: [
      { subject: "健康习惯", knowledgePoint: "压力应对", type: "single_choice", difficulty: 3, source: "local_core", title: "备考压力", prompt: "升学考试前压力很大，哪种应对最健康？", visual: "📚 😣", options: ["制定计划、规律作息、适度运动", "通宵刷题", "完全放弃休息"], answer: "制定计划、规律作息、适度运动", explanation: "有节奏地复习、保证睡眠和运动，比熬夜更有效。" },
      { subject: "健康习惯", knowledgePoint: "安全急救意识", type: "single_choice", difficulty: 3, source: "local_core", title: "识别求救", prompt: "发现有人晕倒，第一步应该怎么做？", visual: "🚨", options: ["呼救并请大人拨打急救电话", "自己乱搬动", "围观等待"], answer: "呼救并请大人拨打急救电话", explanation: "先呼救、请成年人拨打急救电话，是安全的第一步。" },
      { subject: "健康习惯", knowledgePoint: "健康生活方式", type: "single_choice", difficulty: 3, source: "local_core", title: "规律生活", prompt: "下列哪种生活方式更健康？", visual: "🌙 🥗 🏃", options: ["规律作息、均衡饮食、坚持锻炼", "熬夜玩游戏、只吃零食", "久坐不动、不喝水"], answer: "规律作息、均衡饮食、坚持锻炼", explanation: "作息、饮食、运动三方面都规律，是健康生活方式的基础。" },
    ],
  },
  社会认知: {
    G1: [
      { subject: "社会认知", knowledgePoint: "分享合作", type: "single_choice", difficulty: 1, source: "local_core", title: "一起玩玩具", prompt: "你想玩小朋友手里的积木，怎么说更好？", visual: "🧒 🧱 🤝", options: ["抢过来", "问：可以一起玩吗？", "把玩具藏起来"], answer: "问：可以一起玩吗？", explanation: "先礼貌地问一问，小朋友更愿意和你分享。" },
      { subject: "社会认知", knowledgePoint: "遵守规则", type: "single_choice", difficulty: 1, source: "local_core", title: "排队滑滑梯", prompt: "玩滑梯时看到前面有小朋友，应该怎么做？", visual: "🛝 👧 👦", options: ["插队抢先", "排到队伍后面等待", "推前面的小朋友"], answer: "排到队伍后面等待", explanation: "排队轮流玩，每个人都能安全地玩到。" },
      { subject: "社会认知", knowledgePoint: "认识家人", type: "single_choice", difficulty: 1, source: "local_core", title: "家人称呼", prompt: "爸爸的爸爸，我们应该怎么称呼？", visual: "👨‍👦 👴", options: ["爷爷", "叔叔", "舅舅"], answer: "爷爷", explanation: "爸爸的爸爸是爷爷，妈妈的妈妈是外婆或姥姥。" },
      { subject: "社会认知", knowledgePoint: "礼貌借物", type: "single_choice", difficulty: 1, source: "local_core", title: "借东西怎么说", prompt: "想借小朋友的蜡笔画画，应该怎么说？", visual: "🖍️ 🧒", options: ["请问可以借你的蜡笔用一下吗？", "直接拿", "抢过来"], answer: "请问可以借你的蜡笔用一下吗？", explanation: "先征求同意再借用，用完了还要记得归还和道谢。" },
      { subject: "社会认知", knowledgePoint: "交通规则", type: "single_choice", difficulty: 1, source: "local_core", title: "过马路", prompt: "过马路时，正确做法是？", visual: "🚦 🚸", options: ["走斑马线，绿灯时牵手过", "乱跑乱冲", "在马路中间玩"], answer: "走斑马线，绿灯时牵手过", explanation: "过马路要走斑马线，牵好大人的手，绿灯亮了再走。" },
    ],
    G2: [
      { subject: "社会认知", knowledgePoint: "情绪表达", type: "single_choice", difficulty: 1, source: "local_core", title: "生气怎么办", prompt: "玩具被弄坏了，你有点生气，怎么做更合适？", visual: "😠 🧸", options: ["大声哭闹摔东西", "深呼吸，告诉大人发生了什么", "一直闷着不说话"], answer: "深呼吸，告诉大人发生了什么", explanation: "用语言说出自己的感受和经过，比哭闹更能解决问题。" },
      { subject: "社会认知", knowledgePoint: "助人为乐", type: "single_choice", difficulty: 1, source: "local_core", title: "帮小忙", prompt: "小伙伴的书本掉在地上，你会怎么做？", visual: "📚 💨", options: ["装作没看见", "帮他捡起来", "踩一脚"], answer: "帮他捡起来", explanation: "看到别人需要帮助时伸出援手，是温暖的举动。" },
      { subject: "社会认知", knowledgePoint: "公共场所", type: "single_choice", difficulty: 1, source: "local_core", title: "图书馆里", prompt: "在图书馆看书时，应该怎么做？", visual: "📚 🤫", options: ["安静看书，不吵闹", "大声唱歌", "跑来跑去"], answer: "安静看书，不吵闹", explanation: "图书馆是公共场所，安静才能不打扰别人。" },
      { subject: "社会认知", knowledgePoint: "爱护公物", type: "single_choice", difficulty: 1, source: "local_core", title: "不乱涂乱画", prompt: "在公园的墙上乱涂乱画，这样做对吗？", visual: "🏞️ 🚫", options: ["不对，要爱护公共设施", "对，画着好玩", "没人管就行"], answer: "不对，要爱护公共设施", explanation: "公园的墙是大家的公共设施，我们要爱护它。" },
      { subject: "社会认知", knowledgePoint: "轮流等待", type: "single_choice", difficulty: 1, source: "local_core", title: "轮流骑小车", prompt: "小朋友都在排队骑小车，该怎么做？", visual: "🚲 👦👧", options: ["排队轮流骑", "一直霸占着", "推别人"], answer: "排队轮流骑", explanation: "轮流玩、一起玩，大家都开心，友谊也更长久。" },
    ],
  },
  艺术创造: {
    G1: [
      { subject: "艺术创造", knowledgePoint: "节奏感知", type: "single_choice", difficulty: 1, source: "local_core", title: "拍拍节奏", prompt: "音乐里鼓点“咚咚咚”很快，可以用什么动作跟上？", visual: "🥁", options: ["快速拍手", "一动不动", "一直打哈欠"], answer: "快速拍手", explanation: "跟着音乐节奏拍手，就是感受节奏的好方法。" },
      { subject: "艺术创造", knowledgePoint: "创意拼贴", type: "single_choice", difficulty: 1, source: "local_core", title: "用形状画画", prompt: "想画一座房子，可以用哪些形状组合？", visual: "🏠", options: ["三角形屋顶＋正方形房子", "只有圆形", "只有一条线"], answer: "三角形屋顶＋正方形房子", explanation: "房子的屋顶像三角形，墙体像正方形，组合起来就是房子。" },
      { subject: "艺术创造", knowledgePoint: "音乐欣赏", type: "single_choice", difficulty: 1, source: "local_core", title: "快慢节奏", prompt: "音乐变得很快很快时，你可以怎么做？", visual: "🎵 ⚡", options: ["跟着快快地拍手", "慢慢打瞌睡", "捂住耳朵跑开"], answer: "跟着快快地拍手", explanation: "音乐快，我们就快快地拍手；音乐慢，我们就慢慢地拍。" },
      { subject: "艺术创造", knowledgePoint: "手工想象", type: "single_choice", difficulty: 1, source: "local_core", title: "彩纸变变变", prompt: "用一张圆圆的彩纸，可以剪成什么？", visual: "⭕ ✂️", options: ["一个太阳", "一座桥", "一辆汽车"], answer: "一个太阳", explanation: "圆圆的彩纸很像太阳，加上光芒就变成小太阳了。" },
      { subject: "艺术创造", knowledgePoint: "色彩感知", type: "single_choice", difficulty: 1, source: "local_core", title: "草地的颜色", prompt: "春天的草地是什么颜色的？", visual: "🌱", options: ["绿色", "黑色", "紫色"], answer: "绿色", explanation: "春天的小草嫩绿嫩绿的，草地看起来一片绿色。" },
    ],
    G2: [
      { subject: "艺术创造", knowledgePoint: "颜色表达", type: "single_choice", difficulty: 1, source: "local_core", title: "画大海", prompt: "画大海时，用哪种颜色最合适？", visual: "🌊", options: ["蓝色", "黑色", "黄色"], answer: "蓝色", explanation: "大海通常是蓝色的，用蓝色画大海最形象。" },
      { subject: "艺术创造", knowledgePoint: "手工安全", type: "single_choice", difficulty: 1, source: "local_core", title: "安全用剪刀", prompt: "用剪刀剪手工纸时，正确做法是？", visual: "✂️", options: ["刀口朝自己乱剪", "在大人指导下小心剪", "拿着剪刀跑来跑去"], answer: "在大人指导下小心剪", explanation: "剪刀刀口锋利，要在大人指导下使用，不拿剪刀奔跑。" },
      { subject: "艺术创造", knowledgePoint: "舞蹈律动", type: "single_choice", difficulty: 1, source: "local_core", title: "跟着音乐跳舞", prompt: "听到欢快的音乐，身体想动起来，你会？", visual: "💃 🎶", options: ["跟着节拍轻轻跳一跳", "站在原地不动", "大声喊叫"], answer: "跟着节拍轻轻跳一跳", explanation: "跟着音乐的节拍律动，是感受音乐的好方法。" },
      { subject: "艺术创造", knowledgePoint: "声音探索", type: "single_choice", difficulty: 1, source: "local_core", title: "小铃铛的声音", prompt: "摇一摇小铃铛，会发出什么声音？", visual: "🔔", options: ["叮叮当当", "咚咚咚", "沙沙沙"], answer: "叮叮当当", explanation: "铃铛是金属做的，摇起来会发出清脆的“叮当”声。" },
      { subject: "艺术创造", knowledgePoint: "观察与模仿", type: "single_choice", difficulty: 1, source: "local_core", title: "小画家观察", prompt: "想画一只小猫，第一步最好先做什么？", visual: "🐱 🎨", options: ["仔细观察小猫的样子", "乱涂乱画", "闭着眼睛画"], answer: "仔细观察小猫的样子", explanation: "先观察小猫的长相和特点，画出来才更像。" },
    ],
  },

  // ================= 小学阶段 G3-G8 =================
  语文: {
    G3: [
      { subject: "语文", knowledgePoint: "多音字辨析", type: "single_choice", difficulty: 1, source: "local_core", title: "一个“长”字两样读", prompt: "“这条小河很长”和“他正在长个子”中的“长”读音一样吗？", visual: "🌊 长河 · 📏 长高", options: ["一样，都读cháng", "不一样，第一个读cháng，第二个读zhǎng", "不一样，第一个读zhǎng，第二个读cháng"], answer: "不一样，第一个读cháng，第二个读zhǎng", explanation: "“长短”的长读cháng，“生长、成长”的长读zhǎng，要注意根据意思判断读音。" },
      { subject: "语文", knowledgePoint: "古诗积累", type: "single_choice", difficulty: 1, source: "local_core", title: "《静夜思》", prompt: "“床前明月光”的下一句是？", visual: "🌙 李白《静夜思》", options: ["疑是地上霜", "春风吹又生", "处处闻啼鸟"], answer: "疑是地上霜", explanation: "《静夜思》：床前明月光，疑是地上霜。举头望明月，低头思故乡。" },
    ],
    G4: [
      { subject: "语文", knowledgePoint: "比喻句理解", type: "single_choice", difficulty: 1, source: "local_core", title: "弯弯的月亮", prompt: "“弯弯的月亮像一只小船。”这句话把月亮比作什么？", visual: "🌙 ⛵", options: ["小船", "太阳", "大山"], answer: "小船", explanation: "比喻句用“像”把月亮比作小船，月亮和小船都是弯弯的。" },
      { subject: "语文", knowledgePoint: "量词运用", type: "single_choice", difficulty: 1, source: "local_core", title: "量词小能手", prompt: "下面哪个量词用得对？", visual: "🌳 🐄 📄", options: ["一棵树", "一匹马", "一袋牛"], answer: "一棵树", explanation: "树用“棵”，马用“匹”，牛用“头”。" },
    ],
    G5: [
      { subject: "语文", knowledgePoint: "关联词运用", type: "single_choice", difficulty: 2, source: "local_core", title: "选对关联词", prompt: "（ ）天气很冷，（ ）同学们依然坚持晨跑。括号里应填什么？", visual: "❄️ 🏃", options: ["虽然……但是……", "因为……所以……", "一边……一边……"], answer: "虽然……但是……", explanation: "前后意思是转折关系：天气冷是困难，坚持跑是做到了，所以用“虽然……但是……”。" },
      { subject: "语文", knowledgePoint: "句子改写", type: "single_choice", difficulty: 2, source: "local_core", title: "把话说得更生动", prompt: "“小鸟在树上叫。”改成更生动的说法是？", visual: "🐦 🌳", options: ["小鸟在树上唱歌。", "小鸟在树上飞。", "树上有一只鸟。"], answer: "小鸟在树上唱歌。", explanation: "把“叫”换成“唱歌”，用拟人的手法让句子更生动。" },
    ],
    G6: [
      { subject: "语文", knowledgePoint: "修辞手法", type: "single_choice", difficulty: 2, source: "local_core", title: "认识拟人", prompt: "“小草偷偷地从土里钻出来。”这句话用了什么修辞手法？", visual: "🌱", options: ["拟人", "比喻", "反问"], answer: "拟人", explanation: "把小草当作人来写，用“偷偷地钻出来”，是拟人的写法。" },
      { subject: "语文", knowledgePoint: "概括段意", type: "single_choice", difficulty: 2, source: "local_core", title: "抓住段落中心", prompt: "“夏天到了，池塘里荷花盛开，荷叶碧绿，青蛙在荷叶上唱歌，蜻蜓在水面点水。”这段话主要写什么？", visual: "🪷 🐸", options: ["夏天的池塘很热闹", "荷花很香", "青蛙会唱歌"], answer: "夏天的池塘很热闹", explanation: "荷花、青蛙、蜻蜓都是夏天池塘里的景象，这段话概括起来是池塘很热闹。" },
    ],
    G7: [
      { subject: "语文", knowledgePoint: "文言文启蒙", type: "single_choice", difficulty: 3, source: "local_core", title: "《守株待兔》", prompt: "“兔走触株，折颈而死。”句中“走”的意思是？", visual: "🐇 🪵", options: ["逃跑", "跑", "行走"], answer: "跑", explanation: "古文中“走”常表示“跑”，兔走触株就是兔子跑过来撞到树桩上。" },
      { subject: "语文", knowledgePoint: "说明方法", type: "single_choice", difficulty: 2, source: "local_core", title: "列数字", prompt: "“这棵树高约15米，树龄有300多年。”这句话用了什么说明方法？", visual: "🌳 15米 · 300年", options: ["列数字", "打比方", "作比较"], answer: "列数字", explanation: "用“15米”“300年”等具体数字来说明，是列数字的说明方法。" },
    ],
    G8: [
      { subject: "语文", knowledgePoint: "古诗情感", type: "single_choice", difficulty: 3, source: "local_core", title: "《九月九日忆山东兄弟》", prompt: "“独在异乡为异客，每逢佳节倍思亲。”表达了诗人怎样的情感？", visual: "🏮 思乡", options: ["思念家乡和亲人", "害怕过节", "喜欢热闹"], answer: "思念家乡和亲人", explanation: "诗人独自在外乡，每到节日就更加思念家乡的亲人。" },
      { subject: "语文", knowledgePoint: "文章结构", type: "single_choice", difficulty: 3, source: "local_core", title: "找出中心句", prompt: "“坚持练习让小林的手越来越巧。一开始他做得又慢又粗糙，三个月后已经又快又好。”这段的中心句是哪一句？", visual: "🎨 小林的变化", options: ["坚持练习让小林的手越来越巧", "一开始他做得又慢又粗糙", "三个月后已经又快又好"], answer: "坚持练习让小林的手越来越巧", explanation: "第一句概括全段意思，后面的内容都是证明这个中心句的例子。" },
    ],
  },
  数学: {
    G3: [
      { subject: "数学", knowledgePoint: "表内乘法", type: "single_choice", difficulty: 1, source: "local_core", title: "乘法口诀", prompt: "4×6等于多少？", visual: "4 × 6", options: ["24", "20", "26"], answer: "24", explanation: "四六二十四，4×6＝24。" },
      { subject: "数学", knowledgePoint: "人民币计算", type: "single_choice", difficulty: 1, source: "local_core", title: "买东西找钱", prompt: "一支铅笔2元，付了5元，应该找回几元？", visual: "✏️ 2元 · 付5元", options: ["3元", "2元", "7元"], answer: "3元", explanation: "5−2＝3，找回3元。" },
    ],
    G4: [
      { subject: "数学", knowledgePoint: "万以内加减", type: "single_choice", difficulty: 1, source: "local_core", title: "大数计算", prompt: "3500＋2800等于多少？", visual: "3500 + 2800", options: ["6300", "5300", "6800"], answer: "6300", explanation: "3500＋2800＝6300，先算35＋28＝63，再补两个0。" },
      { subject: "数学", knowledgePoint: "图形与角", type: "single_choice", difficulty: 2, source: "local_core", title: "认识直角", prompt: "下面哪个图形里有直角？", visual: "📐", options: ["正方形", "圆形", "三角形只有锐角时"], answer: "正方形", explanation: "正方形有4个直角，圆形没有角。" },
    ],
    G5: [
      { subject: "数学", knowledgePoint: "两位数乘除法", type: "single_choice", difficulty: 2, source: "local_core", title: "列竖式计算", prompt: "25×12等于多少？", visual: "25 × 12", options: ["300", "250", "350"], answer: "300", explanation: "25×12＝25×10＋25×2＝250＋50＝300。" },
      { subject: "数学", knowledgePoint: "分数初步", type: "single_choice", difficulty: 2, source: "local_core", title: "认识分数", prompt: "把一块蛋糕平均分成4份，每份是几分之几？", visual: "🍰 ÷ 4", options: ["1/4", "1/2", "1/8"], answer: "1/4", explanation: "平均分成4份，取其中的1份就是1/4。" },
    ],
    G6: [
      { subject: "数学", knowledgePoint: "小数加减", type: "single_choice", difficulty: 2, source: "local_core", title: "小数付账", prompt: "一个本子3.5元，一支笔2.8元，一共多少钱？", visual: "3.5 + 2.8", options: ["6.3元", "5.3元", "6.13元"], answer: "6.3元", explanation: "3.5＋2.8＝6.3，注意小数点要对齐。" },
      { subject: "数学", knowledgePoint: "面积计算", type: "single_choice", difficulty: 2, source: "local_core", title: "长方形面积", prompt: "一个长方形长8米，宽5米，面积是多少？", visual: "8m × 5m", options: ["40平方米", "26平方米", "13平方米"], answer: "40平方米", explanation: "长方形面积＝长×宽＝8×5＝40平方米。" },
    ],
    G7: [
      { subject: "数学", knowledgePoint: "小数乘除法", type: "single_choice", difficulty: 2, source: "local_core", title: "小数乘整数", prompt: "每千克苹果4.8元，买3千克需要多少钱？", visual: "4.8 × 3", options: ["14.4元", "12.4元", "7.8元"], answer: "14.4元", explanation: "4.8×3＝14.4，先按48×3＝144再点上小数点。" },
      { subject: "数学", knowledgePoint: "分数加减", type: "single_choice", difficulty: 2, source: "local_core", title: "分数相减", prompt: "1 − 2/5 等于多少？", visual: "1 − 2/5", options: ["3/5", "2/5", "1/5"], answer: "3/5", explanation: "把1看作5/5，5/5−2/5＝3/5。" },
    ],
  },
  科学: {
    G3: [
      { subject: "科学", knowledgePoint: "动物分类", type: "single_choice", difficulty: 1, source: "local_core", title: "谁有翅膀", prompt: "下面哪种动物有翅膀会飞？", visual: "🐦 🐟 🐢", options: ["小鸟", "小鱼", "乌龟"], answer: "小鸟", explanation: "小鸟有翅膀，能在天空飞翔。" },
      { subject: "科学", knowledgePoint: "植物生长", type: "single_choice", difficulty: 1, source: "local_core", title: "种子发芽", prompt: "种子发芽通常需要什么条件？", visual: "🌱 💧 ☀️", options: ["水、空气和适宜的温度", "只需要黑暗", "只要很冷"], answer: "水、空气和适宜的温度", explanation: "种子发芽需要水分、空气和合适的温度。" },
    ],
    G4: [
      { subject: "科学", knowledgePoint: "磁铁性质", type: "single_choice", difficulty: 1, source: "local_core", title: "磁铁吸什么", prompt: "磁铁能吸起下面哪样东西？", visual: "🧲 🧷", options: ["回形针", "铅笔", "塑料尺"], answer: "回形针", explanation: "磁铁能吸铁制品，回形针是铁做的。" },
      { subject: "科学", knowledgePoint: "溶解现象", type: "single_choice", difficulty: 1, source: "local_core", title: "糖去哪了", prompt: "把糖放进水里搅拌，糖会怎样？", visual: "🍬 💧", options: ["溶解在水里不见了", "浮在水面", "变成石头"], answer: "溶解在水里不见了", explanation: "糖能溶解在水中，搅拌后均匀分散在水里。" },
    ],
    G5: [
      { subject: "科学", knowledgePoint: "热传递", type: "single_choice", difficulty: 2, source: "local_core", title: "金属导热", prompt: "同样粗细的金属勺和木勺放进热水里，哪把勺柄更快变热？", visual: "🥄 🔥", options: ["金属勺", "木勺", "一样快"], answer: "金属勺", explanation: "金属是热的良导体，导热快；木头导热慢。" },
      { subject: "科学", knowledgePoint: "光的传播", type: "single_choice", difficulty: 2, source: "local_core", title: "影子怎么来", prompt: "太阳照在树上，地面出现影子，说明光怎样传播？", visual: "🌞 🌳 ⛅", options: ["光是沿直线传播的", "光会拐弯", "光被树吃掉"], answer: "光是沿直线传播的", explanation: "光是沿直线传播的，树挡住了光，就形成了影子。" },
    ],
    G6: [
      { subject: "科学", knowledgePoint: "简单电路", type: "single_choice", difficulty: 2, source: "local_core", title: "小灯泡亮了", prompt: "让灯泡亮起来，电路需要怎样连接？", visual: "🔋 💡", options: ["电池、导线和灯泡形成闭合回路", "只把电池放桌上", "只把灯泡放桌上"], answer: "电池、导线和灯泡形成闭合回路", explanation: "只有形成闭合回路，电流才能流过灯泡让它发光。" },
      { subject: "科学", knowledgePoint: "岩石分类", type: "single_choice", difficulty: 2, source: "local_core", title: "花岗岩", prompt: "花岗岩通常是什么类型的岩石？", visual: "🪨", options: ["岩浆岩", "沉积岩", "变质岩"], answer: "岩浆岩", explanation: "花岗岩由岩浆冷却形成，属于岩浆岩。" },
    ],
    G7: [
      { subject: "科学", knowledgePoint: "生态系统", type: "single_choice", difficulty: 2, source: "local_core", title: "食物链", prompt: "“草→兔→鹰”中，鹰属于什么角色？", visual: "🌿 🐰 🦅", options: ["消费者", "生产者", "分解者"], answer: "消费者", explanation: "鹰吃兔子，自己不能制造食物，是消费者（肉食消费者）。" },
      { subject: "科学", knowledgePoint: "浮力原理", type: "single_choice", difficulty: 2, source: "local_core", title: "轮船为什么浮", prompt: "钢铁做的轮船能浮在水上，主要是因为？", visual: "🚢", options: ["船体中间是空的，排开的水多，浮力大", "钢铁比水轻", "水变硬了"], answer: "船体中间是空的，排开的水多，浮力大", explanation: "轮船排开的水量很大，受到的浮力足以托起钢铁船体。" },
    ],
    G8: [
      { subject: "科学", knowledgePoint: "物质变化", type: "single_choice", difficulty: 3, source: "local_core", title: "化学变化", prompt: "下面哪一个是化学变化？", visual: "🔥 🍎", options: ["苹果切开会变色", "纸燃烧变成灰", "冰融化成水"], answer: "纸燃烧变成灰", explanation: "纸燃烧产生了新物质（灰），是化学变化；苹果变色和冰融化都没产生新物质。" },
      { subject: "科学", knowledgePoint: "人体系统", type: "single_choice", difficulty: 3, source: "local_core", title: "血液循环", prompt: "心脏的主要功能是？", visual: "❤️ 🔁", options: ["把血液输送到全身", "制造食物", "储存氧气"], answer: "把血液输送到全身", explanation: "心脏像泵一样推动血液在血管里流动，把养分和氧气送到全身。" },
    ],
  },
  阅读与表达: {
    G3: [
      { subject: "阅读与表达", knowledgePoint: "故事要素", type: "single_choice", difficulty: 1, source: "local_core", title: "故事里的人物", prompt: "“小猫去河边钓鱼，钓到一条大鱼。”故事里的人物是谁？", visual: "🐱 🎣", options: ["小猫", "大鱼", "小兔"], answer: "小猫", explanation: "故事主要讲小猫钓鱼，人物是小猫。" },
      { subject: "阅读与表达", knowledgePoint: "顺序梳理", type: "single_choice", difficulty: 1, source: "local_core", title: "先做什么", prompt: "小明的早晨：先穿衣服，再刷牙，然后吃早餐。最先做的是什么？", visual: "👕 🪥 🍞", options: ["穿衣服", "刷牙", "吃早餐"], answer: "穿衣服", explanation: "按故事顺序，穿衣服是第一个动作。" },
    ],
    G4: [
      { subject: "阅读与表达", knowledgePoint: "细节捕捉", type: "single_choice", difficulty: 1, source: "local_core", title: "找细节", prompt: "“小红穿着红色的裙子，拿着黄色的小伞。”小伞是什么颜色？", visual: "☂️", options: ["黄色", "红色", "蓝色"], answer: "黄色", explanation: "文中明确写到“黄色的小伞”。" },
      { subject: "阅读与表达", knowledgePoint: "观点表达", type: "single_choice", difficulty: 2, source: "local_core", title: "说说理由", prompt: "“我喜欢秋天，因为……”下面哪个理由最具体？", visual: "🍂", options: ["因为秋天有黄叶和丰收的果实", "因为秋天很好", "因为大家都喜欢"], answer: "因为秋天有黄叶和丰收的果实", explanation: "说出具体的事物（黄叶、果实），观点才更有说服力。" },
    ],
    G5: [
      { subject: "阅读与表达", knowledgePoint: "因果关系", type: "single_choice", difficulty: 2, source: "local_core", title: "为什么迟到", prompt: "“小明起床晚了，又赶上堵车，所以迟到了。”迟到的直接原因是？", visual: "⏰ 🚗", options: ["起床晚和堵车", "天气太冷", "作业太多"], answer: "起床晚和堵车", explanation: "文中写明“起床晚了，又堵车”导致迟到。" },
      { subject: "阅读与表达", knowledgePoint: "复述故事", type: "single_choice", difficulty: 2, source: "local_core", title: "小种子旅行", prompt: "“种子被风吹到山坡上，雨水帮它扎根，春天它长成了小苗。”按顺序复述，第一步是什么？", visual: "🌱 🍃", options: ["种子被风吹到山坡上", "雨水帮它扎根", "长成小苗"], answer: "种子被风吹到山坡上", explanation: "按故事顺序，先是被风吹到山坡上。" },
    ],
    G6: [
      { subject: "阅读与表达", knowledgePoint: "信息提取", type: "single_choice", difficulty: 2, source: "local_core", title: "阅读通知", prompt: "通知：本周六上午9点，在学校操场举行运动会，请穿运动鞋。运动会几点开始？", visual: "📢 周六 9:00", options: ["上午9点", "下午9点", "中午12点"], answer: "上午9点", explanation: "通知写明“上午9点”开始。" },
      { subject: "阅读与表达", knowledgePoint: "对比阅读", type: "single_choice", difficulty: 2, source: "local_core", title: "谁跑得快", prompt: "“小鹿跑得比小兔快，小兔跑得比乌龟快。”谁最快？", visual: "🦌 🐰 🐢", options: ["小鹿", "小兔", "乌龟"], answer: "小鹿", explanation: "小鹿＞小兔＞乌龟，小鹿最快。" },
    ],
    G7: [
      { subject: "阅读与表达", knowledgePoint: "论证分析", type: "single_choice", difficulty: 2, source: "local_core", title: "理由够不够", prompt: "“我们应该每天阅读，因为阅读能开阔眼界。”这个观点缺少什么？", visual: "📚 💭", options: ["具体的例子或证据", "更多的感叹号", "更长的句子"], answer: "具体的例子或证据", explanation: "只有观点和一句笼统理由，缺少具体例证，说服力不够。" },
      { subject: "阅读与表达", knowledgePoint: "非连续性文本", type: "single_choice", difficulty: 2, source: "local_core", title: "看懂表格", prompt: "表格显示：周一~周五开放，周六周日闭馆。周四可以参观吗？", visual: "📋 一~五开放", options: ["可以", "不可以", "表格没说明"], answer: "可以", explanation: "周四在周一至周五范围内，可以参观。" },
    ],
    G8: [
      { subject: "阅读与表达", knowledgePoint: "主题提炼", type: "single_choice", difficulty: 3, source: "local_core", title: "文章主题", prompt: "一篇文章写了环卫工人清晨清扫街道、志愿者帮助老人过马路、路人捡起垃圾。文章最想表达什么？", visual: "🧹 🤝 🗑️", options: ["城市里有很多温暖的善举", "扫地很辛苦", "老人需要照顾"], answer: "城市里有很多温暖的善举", explanation: "三个事例都在讲善举，把它们放在一起看，主题是城市的温暖与善意。" },
      { subject: "阅读与表达", knowledgePoint: "辩证表达", type: "single_choice", difficulty: 3, source: "local_core", title: "两面看问题", prompt: "“手机方便了沟通，但也减少了面对面交流。”这段话想告诉我们什么？", visual: "📱 💬", options: ["看问题要全面，看到好处也看到不足", "手机没有好处", "面对面交流完全没用"], answer: "看问题要全面，看到好处也看到不足", explanation: "同时看到好处和不足，是全面客观的思考方式。" },
    ],
  },
  综合素养: {
    G3: [
      { subject: "综合素养", knowledgePoint: "时间管理", type: "single_choice", difficulty: 1, source: "local_core", title: "安排好时间", prompt: "周末有作业、运动和玩耍三件事，怎样安排更合理？", visual: "📝 🏃 🎮", options: ["先完成作业再运动和玩", "一直玩到很晚", "只做一样"], answer: "先完成作业再运动和玩", explanation: "先完成重要任务再放松，玩起来更安心。" },
      { subject: "综合素养", knowledgePoint: "分类整理", type: "single_choice", difficulty: 1, source: "local_core", title: "给物品分类", prompt: "铅笔、橡皮、苹果、尺子。哪一样不是学习用品？", visual: "✏️ 🍎 📏", options: ["苹果", "铅笔", "尺子"], answer: "苹果", explanation: "苹果是食物，铅笔、橡皮、尺子是学习用品。" },
    ],
    G4: [
      { subject: "综合素养", knowledgePoint: "安全意识", type: "single_choice", difficulty: 1, source: "local_core", title: "陌生人求助", prompt: "陌生人说“你带路，我送你糖果”，应该怎么做？", visual: "🧍 陌生人", options: ["拒绝并找老师或家长", "跟着去", "接受糖果", "单独带路"], answer: "拒绝并找老师或家长", explanation: "遇到陌生人给好处或求助，都要保持警惕，及时找大人。" },
      { subject: "综合素养", knowledgePoint: "理财启蒙", type: "single_choice", difficulty: 1, source: "local_core", title: "零花钱计划", prompt: "每周零花钱10元，想买20元的玩具，怎样最合理？", visual: "💰 🧸", options: ["每周存5元，四周后买", "一次借很多钱", "放弃储蓄直接找家长买"], answer: "每周存5元，四周后买", explanation: "有计划地储蓄，靠自己的坚持买到想要的东西更有意义。" },
    ],
    G5: [
      { subject: "综合素养", knowledgePoint: "团队合作", type: "single_choice", difficulty: 2, source: "local_core", title: "小组任务", prompt: "小组做手抄报，大家想法不一样，最好的做法是？", visual: "👥 📰", options: ["分工协作，汇总每个人的好点子", "只按一个人的想法", "各做各的不交流"], answer: "分工协作，汇总每个人的好点子", explanation: "团队任务需要分工与合作，让每个人的特长都发挥作用。" },
      { subject: "综合素养", knowledgePoint: "信息辨别", type: "single_choice", difficulty: 2, source: "local_core", title: "真假信息", prompt: "同学说“网上说吃糖能治感冒”，你该信吗？", visual: "📱 ❓", options: ["查证权威资料再判断", "立刻相信", "到处转发"], answer: "查证权威资料再判断", explanation: "网络信息真假难辨，要查证可靠来源再判断。" },
    ],
    G6: [
      { subject: "综合素养", knowledgePoint: "情绪管理", type: "single_choice", difficulty: 2, source: "local_core", title: "考试紧张", prompt: "考试前有点紧张，哪种方法能帮助放松？", visual: "📝 😰", options: ["深呼吸并做几次轻运动", "不睡觉熬夜复习", "不停刷手机"], answer: "深呼吸并做几次轻运动", explanation: "深呼吸和轻运动能帮身体放松，更专注地应对考试。" },
      { subject: "综合素养", knowledgePoint: "网络礼仪", type: "single_choice", difficulty: 2, source: "local_core", title: "文明上网", prompt: "在班级群里发言，下面哪种做法合适？", visual: "💬", options: ["礼貌发言，不刷屏不攻击", "发很多表情刷屏", "骂人取乐"], answer: "礼貌发言，不刷屏不攻击", explanation: "网络言行同样要尊重他人，文明交流。" },
    ],
    G7: [
      { subject: "综合素养", knowledgePoint: "责任担当", type: "single_choice", difficulty: 2, source: "local_core", title: "值日生病了", prompt: "轮到你和同学值日，同学突然生病请假，你会？", visual: "🧹 🤒", options: ["主动承担更多并告诉老师", "也找借口不去", "只做自己那一份就不管"], answer: "主动承担更多并告诉老师", explanation: "同学有困难时伸出援手，同时向老师说明情况，是有责任心的表现。" },
      { subject: "综合素养", knowledgePoint: "决策能力", type: "single_choice", difficulty: 2, source: "local_core", title: "二选一", prompt: "周末上午有两个活动：参观科技馆和在家看电视，怎样决策更合理？", visual: "🔬 📺", options: ["列一列各自的好处再决定", "闭眼随便选", "只看哪个省事"], answer: "列一列各自的好处再决定", explanation: "把选项的好处列出来再比较，是更理性的决策方法。" },
    ],
    G8: [
      { subject: "综合素养", knowledgePoint: "批判思维", type: "single_choice", difficulty: 3, source: "local_core", title: "广告别全信", prompt: "广告说“这款饮品喝了就能考满分”，怎么看待？", visual: "📺 🥤", options: ["夸大宣传，学习成绩靠努力", "马上买来喝", "广告都是真的"], answer: "夸大宣传，学习成绩靠努力", explanation: "“喝了就满分”是夸大宣传，成绩要靠方法与坚持。" },
      { subject: "综合素养", knowledgePoint: "规划能力", type: "single_choice", difficulty: 3, source: "local_core", title: "毕业前规划", prompt: "升入初中前，下面哪个规划更有帮助？", visual: "📅 🎓", options: ["坚持阅读并养成自主学习的习惯", "熬夜把所有游戏通关", "什么都不准备"], answer: "坚持阅读并养成自主学习的习惯", explanation: "初中更考验自主学习，坚持阅读和好习惯是更扎实的准备。" },
    ],
  },
};

/**
 * 每日题量补充题库（2026-08-09）：配合 subjectExtensions 让每科每年级达到 5+ 题，
 * 供「今日学习」每科每天 5 题使用。键结构同 subjectExtensions。
 */
export const subjectDailyExtras: Record<string, Record<string, Array<Omit<QuestionItem, "id" | "grade" | "eyebrow">>>> = {
  // ================= 语文 G3-G8 补充（各补 3 题 → 合计 5 题） =================
  语文: {
    G3: [
      { subject: "语文", knowledgePoint: "部首查字法", type: "single_choice", difficulty: 1, source: "local_core", title: "查字典小能手", prompt: "用部首查字法查“森”字，应该先查哪个部首？", visual: "森 🌳🌳🌳", options: ["木", "三", "林"], answer: "木", explanation: "“森”由三个“木”组成，部首是“木”，先查木部再数笔画。" },
      { subject: "语文", knowledgePoint: "标点符号", type: "single_choice", difficulty: 1, source: "local_core", title: "句子加标点", prompt: "“今天的天气真好呀（ ）”括号里应该填什么标点？", visual: "🌞 ☁️", options: ["！", "？", "。"], answer: "！", explanation: "“真好呀”带着强烈高兴的语气，应该用感叹号。" },
      { subject: "语文", knowledgePoint: "古诗积累", type: "single_choice", difficulty: 1, source: "local_core", title: "《咏鹅》", prompt: "“鹅，鹅，鹅，曲项向天歌。”这首《咏鹅》是谁写的？", visual: "🦢", options: ["骆宾王", "李白", "杜甫"], answer: "骆宾王", explanation: "《咏鹅》相传是七岁的骆宾王写的，写的是大白鹅。" },
    ],
    G4: [
      { subject: "语文", knowledgePoint: "比喻修辞", type: "single_choice", difficulty: 1, source: "local_core", title: "找比喻句", prompt: "下面哪一句是比喻句？", visual: "🌙 ⛵", options: ["弯弯的月亮像小船。", "月亮升起来了。", "月亮很亮。"], answer: "弯弯的月亮像小船。", explanation: "把月亮比作小船，用了“像”，是比喻句。" },
      { subject: "语文", knowledgePoint: "把字句被字句", type: "single_choice", difficulty: 2, source: "local_core", title: "句式转换", prompt: "“小明修好了玩具车。”改成“被”字句，正确的是？", visual: "🧒 🔧 🚗", options: ["玩具车被小明修好了。", "玩具车把小明修好了。", "小明被玩具车修好了。"], answer: "玩具车被小明修好了。", explanation: "“被”字句是把动作的对象放前面：玩具车被小明修好了。" },
      { subject: "语文", knowledgePoint: "词语积累", type: "single_choice", difficulty: 2, source: "local_core", title: "八字成语", prompt: "“尺有所短，寸有所长”告诉我们什么道理？", visual: "📏 ⚖️", options: ["每个人都有自己的长处和短处", "尺子比寸长得多", "长的一定比短的好"], answer: "每个人都有自己的长处和短处", explanation: "尺虽然长但还有更长的，寸虽短但也有用处，比喻各有长短。" },
    ],
    G5: [
      { subject: "语文", knowledgePoint: "说明方法", type: "single_choice", difficulty: 2, source: "local_core", title: "打比方", prompt: "“松鼠的尾巴像一把降落伞。”这句话用了什么说明方法？", visual: "🐿️ 🪂", options: ["打比方", "列数字", "作比较"], answer: "打比方", explanation: "把尾巴比作降落伞，生动形象，是打比方。" },
      { subject: "语文", knowledgePoint: "概括主要内容", type: "single_choice", difficulty: 2, source: "local_core", title: "一句话概括", prompt: "“清晨，小明先帮妈妈浇花，再喂了小金鱼，最后整理了书桌。”这句话主要写什么？", visual: "🌅 💧 🐠 📚", options: ["小明早晨做了几件家务", "小明最喜欢小金鱼", "妈妈让小明浇花"], answer: "小明早晨做了几件家务", explanation: "浇花、喂鱼、整理书桌都是家务，概括起来是早晨做家务。" },
      { subject: "语文", knowledgePoint: "成语运用", type: "single_choice", difficulty: 2, source: "local_core", title: "选对成语", prompt: "比赛前他练习了无数遍，终于拿到冠军。用哪个成语形容他最合适？", visual: "🏆 💪", options: ["熟能生巧", "画蛇添足", "守株待兔"], answer: "熟能生巧", explanation: "反复练习所以熟练、取得好成绩，正是“熟能生巧”。" },
    ],
    G6: [
      { subject: "语文", knowledgePoint: "环境描写作用", type: "single_choice", difficulty: 2, source: "local_core", title: "环境描写", prompt: "“天阴沉沉的，风呜呜地刮着。”这段环境描写最可能烘托什么气氛？", visual: "🌫️ 🌬️", options: ["压抑、紧张", "欢快、热闹", "宁静、美好"], answer: "压抑、紧张", explanation: "阴沉的天和呜呜的风营造出沉闷紧张的氛围。" },
      { subject: "语文", knowledgePoint: "人物语言理解", type: "single_choice", difficulty: 2, source: "local_core", title: "读懂话外音", prompt: "妈妈对沉迷手机的小林说：“作业是不是又忘记在手机里了？”妈妈真正想说的是什么？", visual: "👩 📱 ✍️", options: ["小林应该先完成作业再看手机", "手机里能找到作业", "妈妈在夸小林"], answer: "小林应该先完成作业再看手机", explanation: "妈妈用反问提醒小林别只顾看手机，先写完作业。" },
      { subject: "语文", knowledgePoint: "体会中心思想", type: "single_choice", difficulty: 2, source: "local_core", title: "文章中心", prompt: "一篇文章写环卫工人日复一日清扫街道、从不抱怨，最想赞美什么？", visual: "🧹 🌅", options: ["劳动者的坚守与奉献", "街道很干净", "城市很热闹"], answer: "劳动者的坚守与奉献", explanation: "突出日复一日、从不抱怨，中心是赞美劳动者的坚守奉献。" },
    ],
    G7: [
      { subject: "语文", knowledgePoint: "文言文启蒙", type: "single_choice", difficulty: 3, source: "local_core", title: "《论语》名句", prompt: "“学而时习之，不亦说乎”中的“说”是什么意思？", visual: "📖", options: ["同“悦”，高兴", "说话", "说明"], answer: "同“悦”，高兴", explanation: "这里的“说”是通假字，同“悦”，表示愉快、高兴。" },
      { subject: "语文", knowledgePoint: "论证方法", type: "single_choice", difficulty: 3, source: "local_core", title: "举例论证", prompt: "“许多发明都来自细心观察，比如瓦特看到水壶盖被蒸汽顶起，于是发明了蒸汽机。”这里用了什么论证方法？", visual: "💡 ⚙️", options: ["举例论证", "比喻论证", "对比论证"], answer: "举例论证", explanation: "用瓦特的具体事例来证明“细心观察带来发明”，是举例论证。" },
      { subject: "语文", knowledgePoint: "古诗词理解", type: "single_choice", difficulty: 3, source: "local_core", title: "《望庐山瀑布》", prompt: "“飞流直下三千尺，疑是银河落九天”主要运用了什么写法？", visual: "🏔️ 💦", options: ["夸张", "对偶", "借代"], answer: "夸张", explanation: "“三千尺”“落九天”极度夸大瀑布的高度与气势，是夸张的写法。" },
    ],
    G8: [
      { subject: "语文", knowledgePoint: "议论文论据", type: "single_choice", difficulty: 3, source: "local_core", title: "选择合适论据", prompt: "要证明“坚持就能成功”，下面哪个事例最合适？", visual: "💪 🏆", options: ["爱迪生经历上千次失败后发明了电灯", "小明昨天买了一个新书包", "今天天气很晴朗"], answer: "爱迪生经历上千次失败后发明了电灯", explanation: "爱迪生的故事直接体现“坚持带来成功”，与观点紧密对应。" },
      { subject: "语文", knowledgePoint: "古诗词情感", type: "single_choice", difficulty: 3, source: "local_core", title: "《春夜喜雨》", prompt: "“好雨知时节，当春乃发生”表达了诗人怎样的心情？", visual: "🌧️ 🌱", options: ["对春雨的喜爱", "对冬天的抱怨", "对秋天的思念"], answer: "对春雨的喜爱", explanation: "“好雨”“知时节”用欣喜的语气赞美春雨来得及时。" },
      { subject: "语文", knowledgePoint: "写作手法", type: "single_choice", difficulty: 3, source: "local_core", title: "先抑后扬", prompt: "文章先写家乡小路又窄又难走，再写它见证了几代人的成长、如今焕然一新。这是什么写法？", visual: "🛤️ 🌟", options: ["先抑后扬", "倒叙", "首尾呼应"], answer: "先抑后扬", explanation: "先写不足（抑），再写美好（扬），突出对家乡小路的深厚感情。" },
    ],
  },
  // ================= 数学 G3-G8 补充（G3-G7 各补 3 题 → 5 题；G8 已有基础2+math3=5 题） =================
  数学: {
    G3: [
      { subject: "数学", knowledgePoint: "表内除法", type: "single_choice", difficulty: 1, source: "local_core", title: "平均分", prompt: "把24颗糖平均分给6个小朋友，每人分几颗？", visual: "🍬 × 24 ÷ 6", options: ["4颗", "3颗", "6颗"], answer: "4颗", explanation: "24÷6＝4，平均分用除法。" },
      { subject: "数学", knowledgePoint: "质量单位", type: "single_choice", difficulty: 1, source: "local_core", title: "比轻重", prompt: "下面哪个物品用“千克”作单位最合适？", visual: "⚖️", options: ["一袋大米", "一支铅笔", "一片树叶"], answer: "一袋大米", explanation: "大米比较重，用千克；铅笔和树叶用克更合适。" },
      { subject: "数学", knowledgePoint: "长方形周长", type: "single_choice", difficulty: 1, source: "local_core", title: "围花坛", prompt: "一个长方形花坛长5米、宽3米，围一圈栅栏需要多少米？", visual: "🌷 5m × 3m", options: ["16米", "8米", "15米"], answer: "16米", explanation: "长方形周长＝（长＋宽）×2＝（5＋3）×2＝16米。" },
    ],
    G4: [
      { subject: "数学", knowledgePoint: "表内除法", type: "single_choice", difficulty: 1, source: "local_core", title: "装书", prompt: "42本书，每6本装一箱，需要几个箱子？", visual: "📚 42 ÷ 6", options: ["7个", "6个", "8个"], answer: "7个", explanation: "42÷6＝7，需要7个箱子。" },
      { subject: "数学", knowledgePoint: "长度单位换算", type: "single_choice", difficulty: 1, source: "local_core", title: "单位换算", prompt: "1米等于多少厘米？", visual: "1米 = ? 厘米", options: ["100厘米", "10厘米", "1000厘米"], answer: "100厘米", explanation: "1米＝100厘米。" },
      { subject: "数学", knowledgePoint: "三位数比较", type: "single_choice", difficulty: 1, source: "local_core", title: "比大小", prompt: "680和608，哪个数更大？", visual: "680 vs 608", options: ["680", "608", "一样大"], answer: "680", explanation: "百位相同，比较十位：8＞0，所以680＞608。" },
    ],
    G5: [
      { subject: "数学", knowledgePoint: "两位数除法", type: "single_choice", difficulty: 1, source: "local_core", title: "平均分组", prompt: "36名同学平均分成4组，每组有多少人？", visual: "36 ÷ 4", options: ["9人", "8人", "12人"], answer: "9人", explanation: "36÷4＝9，每组有9人。" },
      { subject: "数学", knowledgePoint: "长方形周长", type: "single_choice", difficulty: 1, source: "local_core", title: "围照片", prompt: "一张长方形照片长8厘米、宽5厘米，周长是多少？", visual: "🖼️ 8cm × 5cm", options: ["26厘米", "40厘米", "13厘米"], answer: "26厘米", explanation: "长方形周长＝（8＋5）×2＝26厘米。" },
      { subject: "数学", knowledgePoint: "乘法应用", type: "single_choice", difficulty: 1, source: "local_core", title: "买练习本", prompt: "每本练习本6元，买8本一共多少钱？", visual: "6 × 8", options: ["48元", "14元", "42元"], answer: "48元", explanation: "单价×数量＝6×8＝48元。" },
    ],
    G6: [
      { subject: "数学", knowledgePoint: "三位数乘一位数", type: "single_choice", difficulty: 1, source: "local_core", title: "购买门票", prompt: "每张门票125元，买4张一共多少钱？", visual: "125 × 4", options: ["500元", "400元", "520元"], answer: "500元", explanation: "125×4＝500元。" },
      { subject: "数学", knowledgePoint: "长方形面积", type: "single_choice", difficulty: 1, source: "local_core", title: "长方形草坪", prompt: "草坪长12米、宽5米，面积是多少平方米？", visual: "▭ 12m × 5m", options: ["60平方米", "34平方米", "17平方米"], answer: "60平方米", explanation: "长方形面积＝长×宽＝12×5＝60平方米。" },
      { subject: "数学", knowledgePoint: "平均数", type: "single_choice", difficulty: 2, source: "local_core", title: "平均每组", prompt: "4个小组一共收集了48节废电池，平均每组多少节？", visual: "48 ÷ 4", options: ["12节", "16节", "44节"], answer: "12节", explanation: "总数÷组数＝48÷4＝12节。" },
    ],
    G7: [
      { subject: "数学", knowledgePoint: "小数加法", type: "single_choice", difficulty: 1, source: "local_core", title: "购物合计", prompt: "一个本子4.8元，一支笔3.5元，一共多少钱？", visual: "4.8 + 3.5", options: ["8.3元", "7.3元", "8.13元"], answer: "8.3元", explanation: "小数点对齐相加：4.8＋3.5＝8.3元。" },
      { subject: "数学", knowledgePoint: "同分母分数加法", type: "single_choice", difficulty: 2, source: "local_core", title: "喝了多少水", prompt: "上午喝了2/5杯水，下午喝了1/5杯，一共喝了多少杯？", visual: "2/5 + 1/5", options: ["3/5杯", "3/10杯", "1/5杯"], answer: "3/5杯", explanation: "同分母分数相加，分母不变，分子相加：2/5＋1/5＝3/5。" },
      { subject: "数学", knowledgePoint: "小数减法", type: "single_choice", difficulty: 1, source: "local_core", title: "还剩多少米", prompt: "一根绳子长10米，用去3.6米，还剩多少米？", visual: "10 − 3.6", options: ["6.4米", "7.4米", "6.6米"], answer: "6.4米", explanation: "10.0−3.6＝6.4米。" },
    ],
    G8: [
      { subject: "数学", knowledgePoint: "按比例分配", type: "single_choice", difficulty: 2, source: "local_core", title: "分配图书", prompt: "把60本书按2∶3分给两个班，较少的班分到多少本？", visual: "60本 · 2∶3", options: ["24本", "36本", "20本"], answer: "24本", explanation: "总份数是2＋3＝5，较少的班占2份：60÷5×2＝24本。" },
      { subject: "数学", knowledgePoint: "路程应用", type: "single_choice", difficulty: 2, source: "local_core", title: "骑车路程", prompt: "小明每分钟骑300米，骑了8分钟，一共骑了多少米？", visual: "🚴 300米/分 × 8分", options: ["2400米", "308米", "375米"], answer: "2400米", explanation: "路程＝速度×时间＝300×8＝2400米。" },
      { subject: "数学", knowledgePoint: "平均数", type: "single_choice", difficulty: 2, source: "local_core", title: "平均身高", prompt: "3名同学的身高分别是150、156、153厘米，平均身高是多少？", visual: "📏 150 · 156 · 153", options: ["153厘米", "150厘米", "156厘米"], answer: "153厘米", explanation: "（150＋156＋153）÷3＝459÷3＝153厘米。" },
    ],
  },
  // __ANCHOR_MORE__
  科学: {
    G3: [
      { subject: "科学", knowledgePoint: "空气", type: "single_choice", difficulty: 1, source: "local_core", title: "看不见的空气", prompt: "把空杯子倒扣着压进水里，杯子里为什么进不了水？", visual: "🥤 💧", options: ["杯子里有空气占着", "水害怕杯子", "杯子太重了"], answer: "杯子里有空气占着", explanation: "杯子里充满空气，空气占据空间，所以水进不去。" },
      { subject: "科学", knowledgePoint: "水的三态", type: "single_choice", difficulty: 1, source: "local_core", title: "水变成气", prompt: "烧水时冒出的“白气”，是由什么变成的？", visual: "♨️", options: ["水受热变成的水蒸气", "烟囱里的烟", "空气变脏了"], answer: "水受热变成的水蒸气", explanation: "水受热会变成水蒸气，白气就是水蒸气遇冷凝结的小水珠。" },
      { subject: "科学", knowledgePoint: "天气观察", type: "single_choice", difficulty: 1, source: "local_core", title: "天气符号", prompt: "天气预报里的“☀️”表示什么天气？", visual: "☀️", options: ["晴天", "雨天", "下雪"], answer: "晴天", explanation: "太阳符号表示晴天，阳光充足。" },
    ],
    G4: [
      { subject: "科学", knowledgePoint: "电路连接", type: "single_choice", difficulty: 2, source: "local_core", title: "串联与并联", prompt: "两节电池首尾相连装进手电筒，这种连接方式是？", visual: "🔋🔋 → 💡", options: ["串联", "并联", "短路"], answer: "串联", explanation: "一节电池的负极接下一节的正极，首尾相接就是串联。" },
      { subject: "科学", knowledgePoint: "声音传播", type: "single_choice", difficulty: 2, source: "local_core", title: "声音的传递", prompt: "把耳朵贴在桌面一端，轻敲桌子另一端，为什么能听到声音？", visual: "👂 🪵", options: ["声音能通过固体传播", "声音会自己飞过来", "桌子会说话"], answer: "声音能通过固体传播", explanation: "声音可以在固体、液体、气体中传播，桌子是固体。" },
      { subject: "科学", knowledgePoint: "植物结构", type: "single_choice", difficulty: 2, source: "local_core", title: "茎的作用", prompt: "植物的茎主要有什么作用？", visual: "🌱", options: ["输送水分和养分", "制造种子", "吸收阳光"], answer: "输送水分和养分", explanation: "茎像管道一样，把根吸收的水分和养分输送到叶和花。" },
    ],
    G5: [
      { subject: "科学", knowledgePoint: "岩石分类", type: "single_choice", difficulty: 2, source: "local_core", title: "沉积岩", prompt: "砂岩、页岩这类由碎屑一层层沉积形成的岩石属于？", visual: "🪨 📚", options: ["沉积岩", "岩浆岩", "变质岩"], answer: "沉积岩", explanation: "泥沙等碎屑沉积、压实形成沉积岩，常有一层层纹理。" },
      { subject: "科学", knowledgePoint: "人体呼吸", type: "single_choice", difficulty: 2, source: "local_core", title: "呼吸的气体", prompt: "人呼出的气体中，哪种气体比吸进去的多？", visual: "😮‍💨", options: ["二氧化碳", "氧气", "氮气"], answer: "二氧化碳", explanation: "呼吸消耗氧气、产生二氧化碳，所以呼出气体中二氧化碳更多。" },
      { subject: "科学", knowledgePoint: "简单机械", type: "single_choice", difficulty: 2, source: "local_core", title: "杠杆原理", prompt: "用撬棍撬起大石头，撬棍属于哪种简单机械？", visual: "🪨 🪄", options: ["杠杆", "滑轮", "斜面"], answer: "杠杆", explanation: "撬棍绕支点转动撬起重物，是利用杠杆原理。" },
    ],
    G6: [
      { subject: "科学", knowledgePoint: "生态系统", type: "single_choice", difficulty: 2, source: "local_core", title: "生态平衡", prompt: "池塘里大量捕杀青蛙后，害虫数量可能怎样变化？", visual: "🐸 → 🐛", options: ["害虫增多", "害虫减少", "没有变化"], answer: "害虫增多", explanation: "青蛙吃害虫，青蛙减少后害虫缺少天敌，数量可能增多。" },
      { subject: "科学", knowledgePoint: "月相变化", type: "single_choice", difficulty: 2, source: "local_core", title: "月亮的形状", prompt: "我们看到的月亮形状会变化，是因为？", visual: "🌙 🌕", options: ["地球挡住太阳光的角度在变化", "月亮自己在变形", "云把月亮遮住了"], answer: "地球挡住太阳光的角度在变化", explanation: "月亮本身不发光，我们看到的是被太阳照亮的部分，角度不同形状就不同。" },
      { subject: "科学", knowledgePoint: "电磁铁", type: "single_choice", difficulty: 2, source: "local_core", title: "电磁铁", prompt: "电磁铁通电后能吸铁，它的磁力来自？", visual: "🧲 🔌", options: ["电流产生的磁性", "铁钉本身", "外面的磁石"], answer: "电流产生的磁性", explanation: "电磁铁通电后，线圈产生磁性吸住铁钉；断电后磁性消失。" },
    ],
    G7: [
      { subject: "科学", knowledgePoint: "分子运动", type: "single_choice", difficulty: 3, source: "local_core", title: "闻到香味", prompt: "在房间一端放一束花，另一端很快能闻到香味，这是因为？", visual: "🌸 👃", options: ["分子在不停地运动", "花会走路", "空气变香了"], answer: "分子在不停地运动", explanation: "花香分子不断运动、扩散到整个房间，这是扩散现象。" },
      { subject: "科学", knowledgePoint: "重力", type: "single_choice", difficulty: 3, source: "local_core", title: "重力方向", prompt: "扔出去的篮球最终落回地面，主要因为？", visual: "🏀 ⬇️", options: ["地球引力（重力）", "空气推它", "它喜欢地面"], answer: "地球引力（重力）", explanation: "地球对物体有引力，物体总受到向下的重力作用。" },
      { subject: "科学", knowledgePoint: "能量转化", type: "single_choice", difficulty: 3, source: "local_core", title: "能量变变变", prompt: "太阳能路灯白天把太阳能储存起来，晚上发光。它把光能转化成了什么再发光？", visual: "☀️ → 🔋 → 💡", options: ["电能", "声能", "热能"], answer: "电能", explanation: "太阳能先转化为电能储存，晚上电能再转化为光能。" },
    ],
    G8: [
      { subject: "科学", knowledgePoint: "化学变化", type: "single_choice", difficulty: 3, source: "local_core", title: "铁生锈", prompt: "铁钉生锈属于哪种变化？", visual: "🔩 🟤", options: ["化学变化", "物理变化", "没有变化"], answer: "化学变化", explanation: "铁生锈产生了新物质（铁锈），是化学变化。" },
      { subject: "科学", knowledgePoint: "遗传", type: "single_choice", difficulty: 3, source: "local_core", title: "像谁", prompt: "孩子的一些外貌特点会像父母，这是因为？", visual: "👨‍👩‍👦", options: ["遗传基因传递", "天天一起吃饭", "衣服穿得一样"], answer: "遗传基因传递", explanation: "父母通过基因把特征传递给孩子，这就是遗传。" },
      { subject: "科学", knowledgePoint: "可再生能源", type: "single_choice", difficulty: 3, source: "local_core", title: "清洁能源", prompt: "下面哪种能源用完了还能再生、对环境更友好？", visual: "🌞 💨", options: ["太阳能", "煤炭", "石油"], answer: "太阳能", explanation: "太阳能取之不尽，可再生且清洁；煤和石油是不可再生资源。" },
    ],
  },
  阅读与表达: {
    G3: [
      { subject: "阅读与表达", knowledgePoint: "朗读停顿", type: "single_choice", difficulty: 1, source: "local_core", title: "读好长句子", prompt: "“小猴/在树上/摘桃子”这样停顿，读起来更清楚。哪一句停顿正确？", visual: "🐒 🍑", options: ["小猴在树上/摘桃子", "小猴在/树上摘桃子", "小/猴在树上摘桃子"], answer: "小猴在树上/摘桃子", explanation: "“谁在哪里做什么”，在动作前稍作停顿，读起来最清楚。" },
      { subject: "阅读与表达", knowledgePoint: "看图说话", type: "single_choice", difficulty: 1, source: "local_core", title: "看图讲故事", prompt: "图上画着：下雨了，小兔撑着伞，看到没伞的小猫。小兔会怎么做？", visual: "🐰 ☂️ 🐱 🌧️", options: ["和小猫一起打伞", "把伞收起来", "跑得远远的"], answer: "和小猫一起打伞", explanation: "看到小伙伴没伞，一起打伞是乐于助人的做法。" },
      { subject: "阅读与表达", knowledgePoint: "童话理解", type: "single_choice", difficulty: 1, source: "local_core", title: "小壁虎借尾巴", prompt: "小壁虎的尾巴断了又长出新尾巴，这个故事告诉我们？", visual: "🦎", options: ["壁虎的尾巴有再生能力", "壁虎不需要尾巴", "壁虎会飞"], answer: "壁虎的尾巴有再生能力", explanation: "壁虎断尾后能重新长出尾巴，这是它保护自己的本领。" },
    ],
    G4: [
      { subject: "阅读与表达", knowledgePoint: "找中心句", type: "single_choice", difficulty: 1, source: "local_core", title: "中心句在哪里", prompt: "“公园的早晨真热闹。有人在打太极，有人在跳舞，还有人在跑步。”这段话的中心句是？", visual: "🏞️ 🌅", options: ["公园的早晨真热闹", "有人在打太极", "还有人在跑步"], answer: "公园的早晨真热闹", explanation: "第一句总说“热闹”，后面都是具体例子，中心句在第一句。" },
      { subject: "阅读与表达", knowledgePoint: "排序表达", type: "single_choice", difficulty: 2, source: "local_core", title: "按顺序说", prompt: "做手工的步骤：①折纸 ②涂胶 ③粘贴。正确的顺序是？", visual: "📄 ✂️ 🖌️", options: ["①折纸→②涂胶→③粘贴", "②涂胶→①折纸→③粘贴", "③粘贴→①折纸→②涂胶"], answer: "①折纸→②涂胶→③粘贴", explanation: "先折好形状，再涂胶水，最后粘贴，顺序不能乱。" },
      { subject: "阅读与表达", knowledgePoint: "表达感受", type: "single_choice", difficulty: 2, source: "local_core", title: "说出感受", prompt: "读完一个感人的故事，怎么表达自己的感受？", visual: "📖 💭", options: ["说出最打动自己的地方和想法", "只说“还行”", "什么都不说"], answer: "说出最打动自己的地方和想法", explanation: "把打动自己的细节和自己的感受说出来，分享更有意义。" },
    ],
    G5: [
      { subject: "阅读与表达", knowledgePoint: "概括段意", type: "single_choice", difficulty: 2, source: "local_core", title: "段落大意", prompt: "“鲸是哺乳动物，用肺呼吸，胎生，靠吃奶长大。”这段话主要讲什么？", visual: "🐋", options: ["鲸是哺乳动物", "鲸很大", "鲸会喷水"], answer: "鲸是哺乳动物", explanation: "用肺呼吸、胎生、吃奶都是哺乳动物的特征，说明鲸是哺乳动物。" },
      { subject: "阅读与表达", knowledgePoint: "表达观点", type: "single_choice", difficulty: 2, source: "local_core", title: "谈谈看法", prompt: "有人说“小学生不应该玩手机”，你觉得最有说服力的理由是？", visual: "📱 🚫", options: ["长时间玩手机影响视力和学习", "因为大家都这么说", "手机很贵"], answer: "长时间玩手机影响视力和学习", explanation: "从健康和学习角度讲清危害，理由具体、有说服力。" },
      { subject: "阅读与表达", knowledgePoint: "非连续性文本", type: "single_choice", difficulty: 2, source: "local_core", title: "看懂车票", prompt: "车票上写着“8:30发车，9:15到达”。这趟车坐了多长时间？", visual: "🎫 8:30 → 9:15", options: ["45分钟", "1小时15分", "30分钟"], answer: "45分钟", explanation: "从8:30到9:15，共45分钟。" },
    ],
    G6: [
      { subject: "阅读与表达", knowledgePoint: "信息整合", type: "single_choice", difficulty: 2, source: "local_core", title: "多条信息判断", prompt: "小明想借《昆虫记》，图书馆通知说：“三楼自然馆有昆虫类书籍，周一闭馆。”今天是周五，小明应该去几楼？", visual: "🏫 3F 📚", options: ["三楼", "二楼", "一楼"], answer: "三楼", explanation: "通知说昆虫类书在三楼自然馆，今天周五开馆，去三楼。" },
      { subject: "阅读与表达", knowledgePoint: "演讲表达", type: "single_choice", difficulty: 2, source: "local_core", title: "演讲开头", prompt: "演讲《爱护环境》时，哪种开头更能吸引听众？", visual: "🎤 🌍", options: ["“如果地球没有绿色，会变成什么样？”", "“大家好，我叫小明。”", "“我今天讲的是爱护环境的问题。”"], answer: "“如果地球没有绿色，会变成什么样？”", explanation: "用问题引发思考，比平淡的自我介绍更吸引人。" },
      { subject: "阅读与表达", knowledgePoint: "细节区分", type: "single_choice", difficulty: 2, source: "local_core", title: "看清细节", prompt: "“这本书共200页，小华第一天读了30页。”小华一共读了多少页？", visual: "📖 200页 · 读了30页", options: ["30页", "200页", "170页"], answer: "30页", explanation: "题目问“一共读了多少页”，文中只写了第一天读30页，所以是30页。" },
    ],
    G7: [
      { subject: "阅读与表达", knowledgePoint: "论据与观点", type: "single_choice", difficulty: 3, source: "local_core", title: "区分观点与论据", prompt: "“多读书能开阔眼界。比如小华读了很多科普书，对科学特别感兴趣。”其中“比如”后面的是什么？", visual: "📚 💡", options: ["论据（例子）", "观点", "结论"], answer: "论据（例子）", explanation: "“比如”后面举了小华的例子来证明观点，是论据。" },
      { subject: "阅读与表达", knowledgePoint: "访谈记录", type: "single_choice", difficulty: 3, source: "local_core", title: "访谈提问", prompt: "采访校足球队队长，想了解他们训练的故事，哪个问题更合适？", visual: "🎙️ ⚽", options: ["你们训练中印象最深的一件事是什么？", "你几岁？", "你叫什么名字？"], answer: "你们训练中印象最深的一件事是什么？", explanation: "开放性问题能引出故事和细节，更适合采访。" },
      { subject: "阅读与表达", knowledgePoint: "总结主旨", type: "single_choice", difficulty: 3, source: "local_core", title: "提炼主旨", prompt: "文章写了竹子：春天破土而出，夏天成林，冬天依然翠绿，还做成各种用具。最想表达什么？", visual: "🎋", options: ["竹子坚韧有用，值得学习", "竹子很高", "竹子的颜色是绿的"], answer: "竹子坚韧有用，值得学习", explanation: "从生长到用途，突出竹子坚韧、有用的品质，托物言志。" },
    ],
    G8: [
      { subject: "阅读与表达", knowledgePoint: "评价性语言", type: "single_choice", difficulty: 3, source: "local_core", title: "评价一个方案", prompt: "同学说：“我打算周末先复习再运动，运动后再预习新课。”你觉得这个安排怎么样？", visual: "📝 🏃 📖", options: ["劳逸结合，安排合理", "完全没必要", "应该只复习不运动"], answer: "劳逸结合，安排合理", explanation: "复习、运动、预习交替，劳逸结合，是合理的安排。" },
      { subject: "阅读与表达", knowledgePoint: "复杂推断", type: "single_choice", difficulty: 3, source: "local_core", title: "看数据说话", prompt: "统计显示：这学期图书馆借阅量比上学期增加了一倍。可以推断出？", visual: "📊 📈", options: ["这学期有更多同学在借书", "书变便宜了", "图书馆变大了"], answer: "这学期有更多同学在借书", explanation: "借阅量翻倍说明借书的人变多了，其他结论没有依据。" },
      { subject: "阅读与表达", knowledgePoint: "说服表达", type: "single_choice", difficulty: 3, source: "local_core", title: "说服别人", prompt: "想说服同学参加环保捡拾活动，哪种说法最打动人？", visual: "🌍 🧹", options: ["“我们一起把公园变干净，你也会很开心！”", "“你必须去。”", "“不去就是不爱环保。”"], answer: "“我们一起把公园变干净，你也会很开心！”", explanation: "强调共同行动和积极感受，比命令、指责更能打动人。" },
    ],
  },
  综合素养: {
    G3: [
      { subject: "综合素养", knowledgePoint: "遵守规则", type: "single_choice", difficulty: 1, source: "local_core", title: "游戏要公平", prompt: "玩飞行棋时，骰子滚出了桌面，应该怎么做？", visual: "🎲 🏁", options: ["捡起来重新掷，大家都一样", "趁机多走几步", "直接到终点"], answer: "捡起来重新掷，大家都一样", explanation: "遵守游戏规则、公平竞赛，游戏才会更有意思。" },
      { subject: "综合素养", knowledgePoint: "认真倾听", type: "single_choice", difficulty: 1, source: "local_core", title: "耐心听讲", prompt: "小朋友发言时，下面哪种做法最礼貌？", visual: "🧒 👂", options: ["安静听完再举手补充", "大声打断", "自顾自玩"], answer: "安静听完再举手补充", explanation: "认真听别人把话说完，再表达自己的想法，是尊重与礼貌。" },
      { subject: "综合素养", knowledgePoint: "自我管理", type: "single_choice", difficulty: 1, source: "local_core", title: "自己的事自己做", prompt: "晚上整理书包这件事，谁来做更合适？", visual: "🎒 ✨", options: ["自己按课表整理", "全部让妈妈做", "不整理直接睡"], answer: "自己按课表整理", explanation: "自己的事情自己做，既能养成好习惯，也能减轻家人的负担。" },
    ],
    G4: [
      { subject: "综合素养", knowledgePoint: "公共礼仪", type: "single_choice", difficulty: 1, source: "local_core", title: "安静的图书馆", prompt: "在图书馆里，同学正在认真看书，你应该？", visual: "📚 🤫", options: ["轻声走路、不大声说话", "大声聊天", "跑来跑去"], answer: "轻声走路、不大声说话", explanation: "公共场合不打扰他人，是尊重别人的基本礼仪。" },
      { subject: "综合素养", knowledgePoint: "换位思考", type: "single_choice", difficulty: 2, source: "local_core", title: "朋友难过时", prompt: "好朋友竞选班委失败了，很失落。你该怎么做？", visual: "😢 🤝", options: ["安慰他，陪他聊聊", "笑话他", "不理他"], answer: "安慰他，陪他聊聊", explanation: "站在朋友的立场理解他的感受，陪伴和安慰最能温暖人心。" },
      { subject: "综合素养", knowledgePoint: "爱护公物", type: "single_choice", difficulty: 2, source: "local_core", title: "不乱涂乱画", prompt: "在公园的长椅上发现有人用小刀刻字，正确的看法是？", visual: "🪑 🔪", options: ["这是破坏公物，应爱护公共设施", "刻着好玩没关系", "人多没人管就没事"], answer: "这是破坏公物，应爱护公共设施", explanation: "公园设施属于大家，爱护公物是每个公民的责任。" },
    ],
    G5: [
      { subject: "综合素养", knowledgePoint: "网络隐私保护", type: "single_choice", difficulty: 2, source: "local_core", title: "不透露隐私", prompt: "陌生网友问你家的详细地址和学校名字，你应该？", visual: "💻 🔒", options: ["不告诉，并告知家长", "直接发给他", "和同学传阅"], answer: "不告诉，并告知家长", explanation: "姓名、住址、学校等信息不能随意透露给网上陌生人，遇到询问要告诉家长。" },
      { subject: "综合素养", knowledgePoint: "志愿服务", type: "single_choice", difficulty: 2, source: "local_core", title: "小小志愿者", prompt: "社区组织周末捡拾垃圾的公益活动，你可以怎么做？", visual: "🧹 🌳", options: ["在家长陪同下积极参加", "不关我的事", "在旁边乱丢垃圾"], answer: "在家长陪同下积极参加", explanation: "参与志愿服务能为社区出力，也让自己体会劳动的快乐。" },
      { subject: "综合素养", knowledgePoint: "认识自我", type: "single_choice", difficulty: 2, source: "local_core", title: "我的优点", prompt: "写自我介绍时，怎样介绍自己更合适？", visual: "🪞 🌟", options: ["说说自己的特长和爱好", "只说自己缺点", "乱夸自己天上地下"], answer: "说说自己的特长和爱好", explanation: "客观认识并展示自己的特长，既能增强自信，也让别人了解你。" },
    ],
    G6: [
      { subject: "综合素养", knowledgePoint: "挫折应对", type: "single_choice", difficulty: 2, source: "local_core", title: "输掉比赛", prompt: "班级篮球赛输了，大家很沮丧。最好的做法是？", visual: "🏀 😣", options: ["一起复盘，下次继续努力", "互相埋怨", "再也不打球"], answer: "一起复盘，下次继续努力", explanation: "输赢是比赛的一部分，总结经验、保持斗志才能不断进步。" },
      { subject: "综合素养", knowledgePoint: "公民责任", type: "single_choice", difficulty: 2, source: "local_core", title: "节约水电", prompt: "看到教室里没人却开着灯和空调，你可以？", visual: "💡 ❄️", options: ["主动关灯关空调", "假装没看见", "把门窗打开吹掉冷气"], answer: "主动关灯关空调", explanation: "节约水电是每个人都有的公民责任，从小事做起爱护资源。" },
      { subject: "综合素养", knowledgePoint: "理性消费", type: "single_choice", difficulty: 2, source: "local_core", title: "不盲目跟风", prompt: "同学都在买一款新文具，你其实并不需要。应该？", visual: "🛍️ 🤔", options: ["按需购买，不盲目跟风", "马上也买一个", "借钱去买"], answer: "按需购买，不盲目跟风", explanation: "消费前先问自己是否需要，理性花钱是重要的生活能力。" },
    ],
    G7: [
      { subject: "综合素养", knowledgePoint: "兴趣特长", type: "single_choice", difficulty: 2, source: "local_core", title: "了解自己", prompt: "小明画画很专注、也喜欢帮班级出板报。这说明他可能在哪些方面有潜力？", visual: "🎨 ✍️", options: ["美术与设计", "体育", "音乐"], answer: "美术与设计", explanation: "从兴趣和擅长的事出发，能帮助自己发现适合的发展方向。" },
      { subject: "综合素养", knowledgePoint: "尊重多元", type: "single_choice", difficulty: 2, source: "local_core", title: "尊重不同", prompt: "新同学来自南方，生活习惯和大家不太一样。正确的态度是？", visual: "🧑‍🤝‍🧑 🌍", options: ["尊重差异，友好相处", "嘲笑他的习惯", "孤立他"], answer: "尊重差异，友好相处", explanation: "每个人都有不同的背景和习惯，尊重差异才能和睦共处。" },
      { subject: "综合素养", knowledgePoint: "协调沟通", type: "single_choice", difficulty: 3, source: "local_core", title: "调解矛盾", prompt: "两个同学因为排队位置吵了起来，你正好在场，可以？", visual: "💬 🤝", options: ["先听双方说清楚，再帮忙协调", "起哄添乱", "直接推一边"], answer: "先听双方说清楚，再帮忙协调", explanation: "先了解情况、再公平协调，是化解同学矛盾的正确方法。" },
    ],
    G8: [
      { subject: "综合素养", knowledgePoint: "谣言辨别", type: "single_choice", difficulty: 3, source: "local_core", title: "不信不传", prompt: "群里有人转发“某地马上要地震”的消息，没有任何官方来源。你应该？", visual: "📱 🚫", options: ["不信不传，以官方发布为准", "马上转发提醒大家", "跟风夸大传播"], answer: "不信不传，以官方发布为准", explanation: "未经证实的信息不要转发传播，造谣传谣都需承担责任。" },
      { subject: "综合素养", knowledgePoint: "民主议事", type: "single_choice", difficulty: 3, source: "local_core", title: "民主表决", prompt: "班级春游有两个方案，投票后 A 方案获胜。正确的做法是？", visual: "🗳️ ✅", options: ["少数服从多数，一起执行A方案", "输的一方退出活动", "再吵一架重选"], answer: "少数服从多数，一起执行A方案", explanation: "民主决策后要尊重结果、团结执行，这是集体生活的基本素养。" },
      { subject: "综合素养", knowledgePoint: "社会责任", type: "single_choice", difficulty: 3, source: "local_core", title: "回馈社会", prompt: "中学生参与社区志愿服务，主要意义是？", visual: "🌱 🏘️", options: ["服务他人、提升社会责任感", "只是浪费时间", "为了完成任务应付"], answer: "服务他人、提升社会责任感", explanation: "志愿服务能帮助他人，也能在实践中培养责任感和公民意识。" },
    ],
  },
  健康习惯: {
    G3: [
      { subject: "健康习惯", knowledgePoint: "指甲卫生", type: "single_choice", difficulty: 1, source: "local_core", title: "勤剪指甲", prompt: "指甲缝里容易藏细菌，应该怎么做？", visual: "✋ 💅", options: ["定期剪短并保持干净", "留长指甲不剪", "咬手指甲"], answer: "定期剪短并保持干净", explanation: "勤剪指甲、保持干净，能减少细菌藏在指甲缝里。" },
      { subject: "健康习惯", knowledgePoint: "饮食卫生", type: "single_choice", difficulty: 1, source: "local_core", title: "不吃三无零食", prompt: "校门口卖的“三无”零食（无生产日期、无保质期、无厂家），应该？", visual: "🍬 ❌", options: ["不买不吃", "看着好吃就买", "便宜多吃点"], answer: "不买不吃", explanation: "三无零食卫生和安全没有保障，不要购买食用。" },
      { subject: "健康习惯", knowledgePoint: "课间休息", type: "single_choice", difficulty: 1, source: "local_core", title: "课间望远", prompt: "课间十分钟，怎样安排对眼睛和身体更好？", visual: "🏃 👀", options: ["到室外活动、看看远处", "趴在桌上玩手机", "一直坐着不动"], answer: "到室外活动、看看远处", explanation: "课间到室外活动、远眺，能让眼睛和身体都得到放松。" },
    ],
    G4: [
      { subject: "健康习惯", knowledgePoint: "换牙护齿", type: "single_choice", difficulty: 1, source: "local_core", title: "换牙期", prompt: "换牙期牙齿松动了，正确的做法是？", visual: "🦷 😁", options: ["顺其自然，必要时请医生处理", "用手使劲拔", "用舌头一直顶"], answer: "顺其自然，必要时请医生处理", explanation: "松动的牙齿会自然脱落，不要硬拔，必要时由牙医处理。" },
      { subject: "健康习惯", knowledgePoint: "玩耍安全", type: "single_choice", difficulty: 2, source: "local_core", title: "不拿笔打闹", prompt: "课间玩耍时，手里拿着铅笔和同学追跑，这样做？", visual: "✏️ 🏃", options: ["危险，应放下尖锐物品再玩", "没什么大不了", "正好当武器"], answer: "危险，应放下尖锐物品再玩", explanation: "铅笔等尖锐物品很容易扎伤自己和别人，玩耍时要放下。" },
      { subject: "健康习惯", knowledgePoint: "健康体重", type: "single_choice", difficulty: 2, source: "local_core", title: "体重管理", prompt: "发现自己体重超标了，哪种做法更健康？", visual: "⚖️ 🥗", options: ["少吃甜食多运动，请教医生", "节食不吃主食", "不管它继续吃"], answer: "少吃甜食多运动，请教医生", explanation: "控制体重要靠均衡饮食和适量运动，严重时请医生指导。" },
    ],
    G5: [
      { subject: "健康习惯", knowledgePoint: "传染病预防", type: "single_choice", difficulty: 2, source: "local_core", title: "预防流感", prompt: "流感高发季，下面哪种做法能帮助预防？", visual: "🤧 🧼", options: ["勤洗手、勤通风、按时接种疫苗", "关紧门窗不出门", "和生病同学共用杯子"], answer: "勤洗手、勤通风、按时接种疫苗", explanation: "勤洗手、多通风和接种疫苗，是预防流感的重要措施。" },
      { subject: "健康习惯", knowledgePoint: "科学饮水", type: "single_choice", difficulty: 2, source: "local_core", title: "喝对水", prompt: "关于喝水，下列说法正确的是？", visual: "💧 🥤", options: ["喝温开水，不喝生水，适量补充", "渴极了才猛灌冰水", "用饮料代替水"], answer: "喝温开水，不喝生水，适量补充", explanation: "生水可能含细菌，冰水刺激肠胃，白开水才是最佳选择。" },
      { subject: "健康习惯", knowledgePoint: "运动后放松", type: "single_choice", difficulty: 2, source: "local_core", title: "运动后拉伸", prompt: "剧烈运动结束后，正确的做法是？", visual: "🏃 🧘", options: ["做做拉伸，慢慢放松", "立刻坐下不动", "马上冲冷水澡"], answer: "做做拉伸，慢慢放松", explanation: "运动后拉伸放松，能让身体慢慢恢复，减少肌肉酸痛。" },
    ],
    G6: [
      { subject: "健康习惯", knowledgePoint: "久坐活动", type: "single_choice", difficulty: 2, source: "local_core", title: "久坐起身", prompt: "连续坐了一个小时写作业，应该？", visual: "🪑 ⏰", options: ["站起来活动活动再继续", "一直坐下去", "躺着继续写"], answer: "站起来活动活动再继续", explanation: "久坐后起身活动，能放松肌肉、保护脊柱和视力。" },
      { subject: "健康习惯", knowledgePoint: "青春期营养", type: "single_choice", difficulty: 2, source: "local_core", title: "补钙长高", prompt: "青春期想长得更高、骨骼更强壮，应该注意？", visual: "🥛 🌱", options: ["多吃奶制品、多晒太阳多运动", "只喝汽水", "熬夜少睡"], answer: "多吃奶制品、多晒太阳多运动", explanation: "钙质、维生素D和运动、睡眠，都是长高的关键因素。" },
      { subject: "健康习惯", knowledgePoint: "睡眠与学习", type: "single_choice", difficulty: 2, source: "local_core", title: "睡好才学得好", prompt: "第二天要考试，前一晚最应该？", visual: "🌙 📖", options: ["按时睡觉，保证充足睡眠", "熬夜通宵复习", "玩到很晚再说"], answer: "按时睡觉，保证充足睡眠", explanation: "充足睡眠帮助大脑巩固记忆，睡眠不足反而影响发挥。" },
    ],
    G7: [
      { subject: "健康习惯", knowledgePoint: "烫伤处理", type: "single_choice", difficulty: 2, source: "local_core", title: "烫伤急救", prompt: "手不小心被开水烫到，第一步应该？", visual: "♨️ 🚿", options: ["用流动冷水持续冲洗", "涂牙膏", "用力揉搓"], answer: "用流动冷水持续冲洗", explanation: "烫伤后立即用冷水冲洗降温，能减轻损伤；不要乱涂东西。" },
      { subject: "健康习惯", knowledgePoint: "心理求助", type: "single_choice", difficulty: 3, source: "local_core", title: "主动求助", prompt: "长期心情压抑、失眠，正确的做法是？", visual: "😔 🆘", options: ["告诉家长并寻求专业心理帮助", "自己硬扛", "上网乱搜偏方"], answer: "告诉家长并寻求专业心理帮助", explanation: "心理问题求助不丢人，及时寻求专业帮助是最好的选择。" },
      { subject: "健康习惯", knowledgePoint: "远离烟酒", type: "single_choice", difficulty: 3, source: "local_core", title: "拒绝烟酒", prompt: "有人递烟给初中生，正确的做法是？", visual: "🚬 🚫", options: ["明确拒绝并远离", "好奇尝一口", "觉得帅就抽"], answer: "明确拒绝并远离", explanation: "青少年吸烟饮酒危害极大，要坚决拒绝，远离不良诱惑。" },
    ],
    G8: [
      { subject: "健康习惯", knowledgePoint: "定期体检", type: "single_choice", difficulty: 3, source: "local_core", title: "重视体检", prompt: "关于体检，下列说法正确的是？", visual: "🩺 ✅", options: ["每年体检能早发现问题、早干预", "不难受就不用检查", "体检越少越好"], answer: "每年体检能早发现问题、早干预", explanation: "定期体检能及早发现健康隐患，是主动健康管理的重要方式。" },
      { subject: "健康习惯", knowledgePoint: "灾害逃生", type: "single_choice", difficulty: 3, source: "local_core", title: "地震避险", prompt: "上课时突然地震，正确的做法是？", visual: "🌊 🏃", options: ["就近躲在课桌下，护住头部，震后有序撤离", "马上往楼下跑", "站在窗户边看"], answer: "就近躲在课桌下，护住头部，震后有序撤离", explanation: "地震时先就近避险、保护头部，震感停止后再有序撤离。" },
      { subject: "健康习惯", knowledgePoint: "健康管理", type: "single_choice", difficulty: 3, source: "local_core", title: "健康计划", prompt: "制定个人健康计划，下面哪项更合理？", visual: "📋 💪", options: ["设定小目标：每天运动1小时、23点前睡", "一口气制定永远完不成的目标", "不制定计划顺其自然"], answer: "设定小目标：每天运动1小时、23点前睡", explanation: "切实可行的小目标更容易坚持，是健康管理的好开端。" },
    ],
  },
};

// G5～G7 的旧首批英语题以孤立句型为主。这里提供“高认知密度”首题和扩展题，
// 让每日路线先出现短语篇、表格、条件与证据题，而不是单一时态识别。
const advancedEnglishLead: Record<string, Omit<QuestionItem, "id" | "grade" | "eyebrow">> = {
  G5: { subject: "英语", knowledgePoint: "短文线索推断", type: "single_choice", difficulty: 2, source: "local_core", title: "Why was the door open?", prompt: "Nora arrived at the classroom early. The windows were closed, but the floor was wet and a bucket stood by the open door. What most likely happened?", visual: "early classroom · wet floor · bucket · open door", options: ["Someone had just cleaned the floor.", "It rained through every window.", "The class moved to another school."], answer: "Someone had just cleaned the floor.", explanation: "湿地面和水桶共同指向刚完成清洁；窗户关闭排除了雨水从窗户进入。", vocabulary: [{ term: "most likely", phonetic: "/məʊst ˈlaɪkli/", tag: "推断词组", meaning: "最有可能", expansion: "需要综合多条线索选择最合理结论。", example: "What most likely happened next?", exampleMeaning: "接下来最可能发生什么？" }, { term: "a bucket stood by", phonetic: "/ə ˈbʌkɪt stʊd baɪ/", tag: "描述结构", meaning: "一个水桶放在……旁边", expansion: "stood 在这里表示物体处于直立放置状态。", example: "A bucket stood by the wall.", exampleMeaning: "墙边放着一个水桶。" }] },
  G6: { subject: "英语", knowledgePoint: "非连续文本筛选", type: "single_choice", difficulty: 3, source: "local_core", title: "Choose the right workshop", prompt: "Workshop A: robots, Tuesday 16:00, age 9+. Workshop B: painting, Thursday 15:30, age 8+. Rui is ten, likes machines and is free only on Tuesday. Which workshop fits Rui?", visual: "A robots · Tue · 9+｜B painting · Thu · 8+｜Rui: 10 · machines · Tue", options: ["Workshop A.", "Workshop B.", "Neither workshop because Rui is too young."], answer: "Workshop A.", explanation: "需要同时核对年龄、兴趣和有空日期；只有Workshop A满足全部三项条件。", vocabulary: [{ term: "workshop", phonetic: "/ˈwɜːkʃɒp/", tag: "名词", meaning: "体验课；工作坊", expansion: "常指重视动手实践的小型课程。", example: "We joined a robot workshop.", exampleMeaning: "我们参加了机器人体验课。" }, { term: "fit", phonetic: "/fɪt/", tag: "动词", meaning: "适合；符合", expansion: "fit someone 表示满足某人的条件或需要。", example: "This class fits my schedule.", exampleMeaning: "这门课符合我的时间安排。" }] },
  G7: { subject: "英语", knowledgePoint: "观点与证据", type: "single_choice", difficulty: 3, source: "local_core", title: "Which evidence is stronger?", prompt: "A student claims that the new reading corner helps the class read more. Which piece of evidence best supports the claim?", visual: "claim: reading corner → more reading", options: ["Borrowing records rose from 42 to 76 books in one month.", "The reading corner has two green chairs.", "Some students prefer blue book covers."], answer: "Borrowing records rose from 42 to 76 books in one month.", explanation: "借阅量从42本增至76本是可比较的数据，直接支持“阅读更多”；颜色信息与观点无关。", vocabulary: [{ term: "claim", phonetic: "/kleɪm/", tag: "名词", meaning: "观点；主张", expansion: "观点需要相关、可靠的证据支持。", example: "The report makes a clear claim.", exampleMeaning: "报告提出了一个明确观点。" }, { term: "borrowing records", phonetic: "/ˈbɒrəʊɪŋ ˈrekɔːdz/", tag: "名词词组", meaning: "借阅记录", expansion: "records 是可用于比较和验证的数据记录。", example: "The borrowing records show an increase.", exampleMeaning: "借阅记录显示有所增长。" }, { term: "support", phonetic: "/səˈpɔːt/", tag: "动词", meaning: "支持；证明", expansion: "support a claim 表示用证据支持观点。", example: "The facts support her idea.", exampleMeaning: "事实支持她的想法。" }] },
};

const advancedEnglishExtensions: Record<string, Array<Omit<QuestionItem, "id" | "grade" | "eyebrow">>> = {
  G5: [
    { subject: "英语", knowledgePoint: "日程冲突判断", type: "single_choice", difficulty: 2, source: "local_core", title: "Two plans at the same time", prompt: "The science show starts at 3:30 and lasts one hour. Mia's piano lesson begins at 4:00. Why can't she attend the whole show?", visual: "show 3:30–4:30｜piano 4:00", options: ["The two activities overlap.", "The show ends before it starts.", "Her piano lesson is on another day."], answer: "The two activities overlap.", explanation: "科学展持续到4:30，钢琴课4:00开始，两项活动有30分钟时间重叠。", vocabulary: [{ term: "last one hour", phonetic: "/lɑːst wʌn ˈaʊə/", tag: "时间结构", meaning: "持续一小时", expansion: "last 作动词时表示持续。", example: "The film lasts two hours.", exampleMeaning: "电影持续两小时。" }, { term: "overlap", phonetic: "/ˌəʊvəˈlæp/", tag: "动词", meaning: "时间重叠", expansion: "两个活动占用了同一段时间。", example: "The two classes overlap.", exampleMeaning: "两节课时间重叠。" }] },
    { subject: "英语", knowledgePoint: "代词指代", type: "single_choice", difficulty: 2, source: "local_core", title: "What does it refer to?", prompt: "Jack put the plant near the window because it needed more sunlight. What does “it” refer to?", visual: "Jack · plant · window · it needs sunlight", options: ["The plant.", "The window.", "Jack."], answer: "The plant.", explanation: "需要阳光的是plant；根据意义和单数代词it，可以判断指代植物。", vocabulary: [{ term: "refer to", phonetic: "/rɪˈfɜː tə/", tag: "动词词组", meaning: "指的是；指代", expansion: "阅读时要结合前文名词和句意判断代词。", example: "What does 'they' refer to?", exampleMeaning: "they指的是什么？" }] },
  ],
  G6: [
    { subject: "英语", knowledgePoint: "路线条件推理", type: "single_choice", difficulty: 3, source: "local_core", title: "Find the safer route", prompt: "The bridge is closed. Route A crosses the bridge. Route B goes past the bank and reaches the museum in ten extra minutes. Which route should the class take?", visual: "bridge closed｜A crosses bridge｜B +10 min → museum", options: ["Route B, because it avoids the closed bridge.", "Route A, because a closed bridge is faster.", "Neither route reaches the museum."], answer: "Route B, because it avoids the closed bridge.", explanation: "桥关闭使Route A不可行；Route B虽然多十分钟，但能避开关闭路段并到达目的地。", vocabulary: [{ term: "avoid", phonetic: "/əˈvɔɪd/", tag: "动词", meaning: "避开", expansion: "avoid 后可接名词或动词-ing。", example: "This path avoids the busy road.", exampleMeaning: "这条路避开了繁忙道路。" }, { term: "extra minutes", phonetic: "/ˈekstrə ˈmɪnɪts/", tag: "时间词组", meaning: "额外的分钟数", expansion: "extra 表示在原有基础上增加的。", example: "It takes five extra minutes.", exampleMeaning: "这要多花五分钟。" }] },
    { subject: "英语", knowledgePoint: "段落主旨与细节", type: "single_choice", difficulty: 3, source: "local_core", title: "The class energy check", prompt: "Students checked the classroom for one week. They found that lights were often left on during lunch and computers stayed on after school. They made a checklist beside the door. What was the checklist mainly for?", visual: "one-week check → wasted electricity → checklist", options: ["Helping the class remember to turn equipment off.", "Recording everyone's lunch order.", "Choosing new computer games."], answer: "Helping the class remember to turn equipment off.", explanation: "调查发现灯和电脑未关闭造成浪费，门边清单用于提醒离开前关闭设备。", vocabulary: [{ term: "be left on", phonetic: "/bi left ɒn/", tag: "被动词组", meaning: "一直开着；未关闭", expansion: "常用于灯、电器等忘记关闭的情境。", example: "The lights were left on.", exampleMeaning: "灯一直开着。" }, { term: "checklist", phonetic: "/ˈtʃeklɪst/", tag: "名词", meaning: "检查清单", expansion: "按项目逐一核对，避免遗漏。", example: "Use a checklist before leaving.", exampleMeaning: "离开前使用检查清单。" }] },
  ],
  G7: [
    { subject: "英语", knowledgePoint: "连接词与论证", type: "single_choice", difficulty: 3, source: "local_core", title: "Complete the argument", prompt: "Online maps are convenient; ____, printed maps can still be useful when a phone has no power. Which connector best completes the argument?", visual: "online maps convenient ↔ phone no power → printed map useful", options: ["however", "therefore", "for example"], answer: "however", explanation: "前后内容形成转折：在线地图方便，但手机没电时纸质地图仍有用，因此使用however。", vocabulary: [{ term: "however", phonetic: "/haʊˈevə/", tag: "连接副词", meaning: "然而；不过", expansion: "用于连接意义相反或形成转折的观点。", example: "The route is longer; however, it is safer.", exampleMeaning: "这条路线更长，但更安全。" }, { term: "run out of power", phonetic: "/rʌn aʊt əv ˈpaʊə/", tag: "动词词组", meaning: "没电", expansion: "run out of表示把某物用完。", example: "My phone ran out of power.", exampleMeaning: "我的手机没电了。" }] },
    { subject: "英语", knowledgePoint: "结论边界", type: "single_choice", difficulty: 3, source: "local_core", title: "Do not overstate the result", prompt: "Ten students tried a new vocabulary game for one week, and eight remembered more words. Which conclusion is the most careful?", visual: "10 students · 1 week · 8 improved", options: ["The game may help some students, but more testing is needed.", "The game will make every child remember every word.", "Vocabulary games never affect learning."], answer: "The game may help some students, but more testing is needed.", explanation: "样本只有十人、时间只有一周，可以说“可能有帮助”，不能夸大为对所有孩子都一定有效。", vocabulary: [{ term: "overstate", phonetic: "/ˌəʊvəˈsteɪt/", tag: "动词", meaning: "夸大", expansion: "结论超过证据能够支持的范围就是夸大。", example: "Do not overstate the result.", exampleMeaning: "不要夸大结果。" }, { term: "more testing is needed", phonetic: "/mɔː ˈtestɪŋ ɪz ˈniːdɪd/", tag: "被动表达", meaning: "需要更多测试", expansion: "用于说明现有证据还不足以得出确定结论。", example: "More testing is needed before we decide.", exampleMeaning: "决定前需要更多测试。" }] },
  ],
};

export function getCourseQuestion(courseName: string, grade: string): QuestionItem {
  const englishLead = courseName.includes("英语") ? advancedEnglishLead[grade] : undefined;
  const specific = englishLead ?? gradeSpecificQuestions[`${grade}:${courseName}`] ?? (grade === "G1" || grade === "G2" ? preschoolQuestions[courseName] : primaryQuestions[courseName]);
  // 基础题缺失时（如健康习惯/社会认知等）优先使用该课程的扩展题第一道，而不是回退到英语题
  const extensionFirst = specific ?? subjectExtensions[courseName]?.[grade]?.[0];
  const fallback = preschoolQuestions["英语兴趣"];
  const question = extensionFirst ?? fallback;
  const englishDifficultyCeilings: Record<string, QuestionItem["difficulty"]> = { G1: 1, G2: 1, G3: 1, G4: 1, G5: 2, G6: 2, G7: 2, G8: 2 };
  const difficultyCeiling: QuestionItem["difficulty"] = courseName.includes("英语")
    ? (englishDifficultyCeilings[grade] ?? 2)
    : question.difficulty;
  return { ...question, difficulty: question.difficulty > difficultyCeiling ? difficultyCeiling : question.difficulty, id: `${grade.toLowerCase()}-${courseName}`, grade, eyebrow: `${grade} · ${courseName}` };
}

export function getCourseQuestions(courseName: string, grade: string): QuestionItem[] {
  // 英语课程：基础题 + 英语扩展题
  if (courseName.includes("英语")) {
    const first = getCourseQuestion(courseName, grade);
    const extensions = advancedEnglishExtensions[grade] ?? englishExtensions[grade] ?? [];
    const englishDifficultyCeilings: Record<string, QuestionItem["difficulty"]> = { G1: 1, G2: 1, G3: 1, G4: 1, G5: 2, G6: 2, G7: 2, G8: 2 };
    const difficultyCeiling = englishDifficultyCeilings[grade] ?? 2;
    return [first, ...extensions.map((question, index) => ({ ...question, difficulty: question.difficulty > difficultyCeiling ? difficultyCeiling : question.difficulty, id: `${grade.toLowerCase()}-english-${index + 2}`, grade, eyebrow: `${grade} · ${courseName}` }))];
  }
  // 非英语课程：基础题 + 按年级扩展题 + 数学专用扩展 + 每日补充题
  const specific = gradeSpecificQuestions[`${grade}:${courseName}`] ?? (grade === "G1" || grade === "G2" ? preschoolQuestions[courseName] : primaryQuestions[courseName]);
  const extras = (subjectExtensions[courseName]?.[grade] ?? []).map((question, index) => ({ ...question, id: `${grade.toLowerCase()}-${courseName}-ext-${index + 1}`, grade, eyebrow: `${grade} · ${courseName}` }));
  let list: QuestionItem[];
  if (specific) {
    const first = { ...specific, id: `${grade.toLowerCase()}-${courseName}`, grade, eyebrow: `${grade} · ${courseName}` };
    list = [first, ...extras];
  } else {
    list = extras;
  }
  if (courseName === "数学") {
    const extensions = mathExtensions[grade] ?? [];
    list = [...list, ...extensions.map((question, index) => ({ ...question, id: `${grade.toLowerCase()}-math-${index + 2}`, grade, eyebrow: `${grade} · 数学` }))];
  }
  // 每日补充题并入课程中心课时，让每科每年级题量更充足
  const dailyExtras = (subjectDailyExtras[courseName]?.[grade] ?? []).map((question, index) => ({ ...question, id: `${grade.toLowerCase()}-${courseName}-daily-${index + 1}`, grade, eyebrow: `${grade} · ${courseName}` }));
  list = [...list, ...dailyExtras];
  return list.length > 0 ? list : [getCourseQuestion(courseName, grade)];
}

export function validateEnglishDictionaryCoverage() {
  return ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"].flatMap((grade) => {
    const courseName = ["G1", "G2", "G3", "G4"].includes(grade) ? "英语兴趣" : "英语";
    return getCourseQuestions(courseName, grade).filter((question) => !question.vocabulary?.length).map((question) => `${grade}:${question.title}`);
  });
}

const missingEnglishDictionaries = validateEnglishDictionaryCoverage();
if (missingEnglishDictionaries.length > 0) {
  throw new Error(`英语题缺少AI词典解析：${missingEnglishDictionaries.join(", ")}`);
}
