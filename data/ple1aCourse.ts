export type PleVocabulary = { word: string; meaning: string; note?: string };
export type PleSentence = { en: string; zh: string; tip?: string };
export type PleExpansion = { title: string; knowledge: string[]; challenge: string; titleEn?: string; knowledgeEn?: string[]; challengeEn?: string };
export type PleQuestion = { en: string; zh: string };

export type PleLesson = {
  id: string;
  title: string;
  subtitle: string;
  pages: string;
  icon: string;
  kind: "故事" | "词句" | "听说" | "阅读" | "写作" | "拼读" | "复习";
  goals: string[];
  vocabulary: PleVocabulary[];
  sentences: PleSentence[];
  knowledge: string[];
  activities: string[];
  questions: PleQuestion[];
  phonics?: string[];
  expansion: PleExpansion;
};

export type PleUnit = {
  id: string;
  number: number;
  title: string;
  zh: string;
  theme: string;
  icon: string;
  color: string;
  lessons: PleLesson[];
};

function makeLessonQuestions(value: Omit<PleLesson, "questions">): PleQuestion[] {
  const words = value.vocabulary.slice(0, 2).map((item) => item.word);
  const modelSentence = value.sentences[0]?.en ?? value.title;
  return [
    { en: `What is "${value.title}" about?`, zh: `“${value.subtitle}”这一课主要讲什么？` },
    { en: `Can you read and use ${words.map((word) => `"${word}"`).join(" and ")}?`, zh: `你会读并正确使用${words.join("、")}吗？` },
    { en: `Listen and repeat: "${modelSentence}"`, zh: `听一听并跟读：“${modelSentence}”` },
    { en: "Can you answer in a complete English sentence?", zh: "你能尝试用一个完整的英文句子回答吗？" },
  ];
}

const lesson = (value: Omit<PleLesson, "questions">): PleLesson => ({ ...value, questions: makeLessonQuestions(value) });

export const ple1aUnits: PleUnit[] = [
  {
    id: "ple1a-u1", number: 1, title: "Nice to meet you", zh: "很高兴认识你", theme: "姓名、年龄、问候和生日", icon: "👋", color: "mint",
    lessons: [
      lesson({
        id: "ple1a-u1-l1", title: "The first day of school", subtitle: "开学第一天", pages: "课本第2–6页", icon: "🏫", kind: "故事",
        goals: ["理解开学第一天认识新朋友的故事", "会主动问候并询问姓名", "能从故事中找出人物和情绪变化"],
        vocabulary: [{ word: "first day", meaning: "第一天" }, { word: "school", meaning: "学校" }, { word: "name", meaning: "名字" }, { word: "friend", meaning: "朋友" }, { word: "happy", meaning: "开心的" }, { word: "birthday", meaning: "生日" }],
        sentences: [{ en: "Good morning. I am Mrs Lee.", zh: "早上好。我是李老师。", tip: "早晨见面使用 Good morning。" }, { en: "What is your name?", zh: "你叫什么名字？", tip: "询问对方姓名。" }, { en: "My name is Katy.", zh: "我的名字是 Katy。" }, { en: "Today is my birthday.", zh: "今天是我的生日。" }],
        knowledge: ["What is 可缩写为 What's", "I am 可缩写为 I'm", "人名第一个字母要大写", "故事阅读时关注：谁、在哪里、发生了什么"],
        activities: ["按出场顺序排列人物", "听姓名并点选对应人物", "角色扮演：老师与新同学", "说一说 Katy 最后为什么开心"],
        phonics: ["h: hello / house", "m: mouse / morning"],
        expansion: { title: "从问候拓展到交朋友", knowledge: ["Hello 和 Hi 都表示你好，Hi 更口语化。", "初次见面还可以说 Nice to meet you。", "别人介绍姓名后，可以回答 Nice to meet you, Katy。"], challenge: "请用三句话完成一次初次见面：问候、介绍姓名、表达很高兴认识对方。" }
      }),
      lesson({
        id: "ple1a-u1-l2", title: "Morning and afternoon", subtitle: "一天中的时间与姓名歌", pages: "课本第7–9页", icon: "☀️", kind: "听说",
        goals: ["区分 morning、noon 和 afternoon", "在不同时间使用合适问候语", "能说姓名并拼读自己的英文名"],
        vocabulary: [{ word: "morning", meaning: "早晨／上午" }, { word: "noon", meaning: "中午" }, { word: "afternoon", meaning: "下午" }, { word: "fine", meaning: "很好" }, { word: "spell", meaning: "拼写" }, { word: "group", meaning: "小组" }],
        sentences: [{ en: "Good morning!", zh: "早上好！" }, { en: "Good afternoon!", zh: "下午好！" }, { en: "How are you?", zh: "你好吗？" }, { en: "I am fine.", zh: "我很好。" }, { en: "S-A-M, Sam.", zh: "S-A-M，拼作 Sam。" }],
        knowledge: ["noon 通常指中午12点左右", "Good afternoon 一般用于午后见面", "拼写姓名时逐个读字母名称", "How are you? 询问近况，不是在问年龄"],
        activities: ["把太阳位置与问候语配对", "听时间场景选择 morning 或 afternoon", "跟着姓名歌替换成自己的名字", "制作小组英文姓名表"],
        phonics: ["y: you / your"],
        expansion: { title: "一天还有哪些时间？", knowledge: ["evening 表示傍晚到晚上。", "Good evening 用于晚上见面，Good night 用于道别或睡前。", "What's your name? 和 My name is... 是一组问答。"], challenge: "根据早晨、下午、晚上三个场景，分别选择最合适的问候语。" }
      }),
      lesson({
        id: "ple1a-u1-l3", title: "How old are you?", subtitle: "询问和回答年龄", pages: "课本第10–11页", icon: "🎂", kind: "词句",
        goals: ["听懂并回答年龄问题", "熟练读出1到10", "能采访小组成员的年龄"],
        vocabulary: [{ word: "old", meaning: "……岁的／年老的" }, { word: "year", meaning: "年" }, { word: "years old", meaning: "……岁" }, { word: "one", meaning: "一" }, { word: "six", meaning: "六" }, { word: "seven", meaning: "七" }, { word: "ten", meaning: "十" }],
        sentences: [{ en: "How old are you?", zh: "你几岁？" }, { en: "I am seven years old.", zh: "我七岁。" }, { en: "What about you?", zh: "你呢？" }, { en: "I am six years old too.", zh: "我也六岁。" }],
        knowledge: ["How old 用来询问年龄", "一岁用 one year old，多于一岁用 years old", "口语中也可以简答 I'm seven", "too 放在肯定句末表示“也”"],
        activities: ["听年龄给人物编号", "数字与英文配对", "两人一组采访年龄", "制作班级年龄统计贴纸"],
        phonics: ["-ix: six / mix"],
        expansion: { title: "数字不只可以说年龄", knowledge: ["数字还可以表示班级、页码、数量和日期。", "How many 询问数量，How old 询问年龄。", "Page six 表示第六页。"], challenge: "判断三个问题分别在问年龄、数量还是页码。" }
      }),
      lesson({
        id: "ple1a-u1-l4", title: "A birthday card", subtitle: "阅读生日卡与参加生日会", pages: "课本第12–13页", icon: "💌", kind: "阅读",
        goals: ["认识生日卡的收件人、祝福语和署名", "从卡片中寻找人物信息", "会在生日会中表达祝福和感谢"],
        vocabulary: [{ word: "birthday card", meaning: "生日卡" }, { word: "to", meaning: "给／致" }, { word: "from", meaning: "来自／署名" }, { word: "wish", meaning: "祝愿" }, { word: "party", meaning: "聚会" }, { word: "present", meaning: "礼物" }],
        sentences: [{ en: "Happy birthday!", zh: "生日快乐！" }, { en: "This is for you.", zh: "这是给你的。" }, { en: "Thank you very much.", zh: "非常感谢你。" }, { en: "Goodbye! Thanks a lot!", zh: "再见！非常感谢！" }],
        knowledge: ["To 后面写收卡人的名字", "From 后面写送卡人的名字", "This is for you 用于递给别人礼物", "Thanks a lot 与 Thank you very much 都表示非常感谢"],
        activities: ["在生日卡中圈出 To 和 From", "听对话选择谁送礼物", "设计一张自己的英文生日卡", "角色扮演生日会问候"],
        phonics: ["h / m / y 单元复习"],
        expansion: { title: "卡片中的英语礼仪", knowledge: ["祝福语通常简短、友善。", "收到礼物先表达感谢，再打开礼物更有礼貌。", "Best wishes 也可以写在贺卡中，表示美好的祝愿。"], challenge: "为同学选择合适的祝福语，并正确填写 To 和 From。" }
      })
    ]
  },
  {
    id: "ple1a-u2", number: 2, title: "People at school", zh: "学校里的人", theme: "介绍同学、朋友和老师", icon: "🧑‍🏫", color: "sky",
    lessons: [
      lesson({
        id: "ple1a-u2-l1", title: "About me and my school", subtitle: "认识 Tammy 和她的学校", pages: "课本第14–18页", icon: "🪪", kind: "阅读",
        goals: ["读懂简短人物介绍", "提取学校、年级、班级和年龄信息", "根据描述判断人物身份"],
        vocabulary: [{ word: "primary school", meaning: "小学" }, { word: "Primary 1", meaning: "小学一年级" }, { word: "classmate", meaning: "同班同学" }, { word: "monitor", meaning: "班长" }, { word: "English teacher", meaning: "英语老师" }, { word: "Maths teacher", meaning: "数学老师" }, { word: "funny", meaning: "有趣的" }, { word: "kind", meaning: "友善的" }],
        sentences: [{ en: "I go to Hope Primary School.", zh: "我在希望小学上学。" }, { en: "I am in Primary 1.", zh: "我读小学一年级。" }, { en: "She is my classmate.", zh: "她是我的同班同学。" }, { en: "He is my friend.", zh: "他是我的朋友。" }],
        knowledge: ["go to school 表示上学", "in Primary 1 表示就读年级", "in Class 1A 表示所在班级", "阅读人物介绍时先圈出姓名和身份"],
        activities: ["人物与描述连线", "填写学校练习本封面", "找出谁在Class 1A", "说出自己学校的英文资料"],
        phonics: ["b: boy / bad", "g: girl / good", "t: teacher / toy"],
        expansion: { title: "学校身份词汇网", knowledge: ["principal 是校长，librarian 是图书管理员。", "classmate 强调同班，friend 强调朋友关系。", "teacher 前可加学科：English teacher、Maths teacher。"], challenge: "根据四段简短描述，把人物放进“老师、同学、朋友”三个类别。" }
      }),
      lesson({
        id: "ple1a-u2-l2", title: "This is my teacher", subtitle: "介绍学校人物", pages: "课本第19–21页", icon: "👩‍🏫", kind: "词句",
        goals: ["会用 This is... 介绍人物", "正确区分 he 和 she", "会描述老师教授的学科"],
        vocabulary: [{ word: "teach", meaning: "教" }, { word: "take care of", meaning: "照顾／负责" }, { word: "Chinese", meaning: "中文／语文" }, { word: "English", meaning: "英语" }, { word: "Maths", meaning: "数学" }, { word: "man", meaning: "男人" }, { word: "woman", meaning: "女人" }],
        sentences: [{ en: "This is Mrs Lee.", zh: "这是李太太／李老师。" }, { en: "She is my class teacher.", zh: "她是我的班主任。" }, { en: "He is my Maths teacher.", zh: "他是我的数学老师。" }, { en: "I teach English.", zh: "我教英语。" }],
        knowledge: ["he 指男性，she 指女性", "Mr 用于男性，Mrs 或 Miss 用于女性称谓", "my 表示“我的”", "This is 后接姓名或身份"],
        activities: ["听人物介绍选择照片", "he / she 分类", "完成 Gary 的照片介绍", "带一张照片介绍朋友"],
        phonics: ["b / g / t 辨音"],
        expansion: { title: "称谓与礼貌介绍", knowledge: ["介绍别人时可以先说姓名，再说身份。", "Mr、Mrs、Miss 后通常接姓氏。", "在学校称呼老师时，应使用老师认可的称谓。"], challenge: "把四句打乱的介绍重新排序：This is... / He or She is... / He or She teaches... / He or She is kind。" }
      }),
      lesson({
        id: "ple1a-u2-l3", title: "We are classmates", subtitle: "我们、班级和小组", pages: "课本第22–23页", icon: "👫", kind: "听说",
        goals: ["理解 we 表示“我和其他人”", "会说共同的班级、小组、年龄和学校", "能介绍一位同班同学"],
        vocabulary: [{ word: "we", meaning: "我们" }, { word: "same", meaning: "相同的" }, { word: "class", meaning: "班级" }, { word: "group", meaning: "小组" }, { word: "together", meaning: "一起" }, { word: "both", meaning: "两者都" }],
        sentences: [{ en: "Ken and I are in Primary 1.", zh: "Ken和我读小学一年级。" }, { en: "We are friends.", zh: "我们是朋友。" }, { en: "We are in Group A.", zh: "我们在A组。" }, { en: "We are seven years old.", zh: "我们七岁。" }],
        knowledge: ["Ken and I 可以用 We 代替", "I 搭配 am，we 搭配 are", "班级写作 Class 1A，小组写作 Group A", "两个人共同的情况可以用 We are..."],
        activities: ["把两个人物合并成We句子", "听班级和小组信息填表", "介绍一位同学和自己", "找出班里的共同点"],
        phonics: ["t: ten / teacher"],
        expansion: { title: "从 I 到 We", knowledge: ["I am a pupil. 变成 We are pupils。", "主语变成复数时，名词通常也变成复数。", "They 表示不包括说话者的“他们／她们／它们”。"], challenge: "把三组 I am... 句子改写成 We are...，注意 be 动词和名词复数。" }
      }),
      lesson({
        id: "ple1a-u2-l4", title: "Writing about me and my school", subtitle: "写我的学校介绍", pages: "课本第24–25页", icon: "✍️", kind: "写作",
        goals: ["写4到6句个人与学校介绍", "正确使用大写字母", "在完整句末使用句号"],
        vocabulary: [{ word: "capital letter", meaning: "大写字母" }, { word: "full stop", meaning: "句号" }, { word: "beginning", meaning: "开头" }, { word: "sentence", meaning: "句子" }, { word: "America", meaning: "美国" }, { word: "pretty", meaning: "漂亮的" }],
        sentences: [{ en: "My name is Alan Lam.", zh: "我的名字是 Alan Lam。" }, { en: "I am in Class 1D.", zh: "我在1D班。" }, { en: "This is Mr Johnson.", zh: "这是 Johnson 先生。" }, { en: "He is from America.", zh: "他来自美国。" }],
        knowledge: ["姓名、国家和句首字母要大写", "代词 I 永远大写", "陈述句末使用句号", "一段介绍可以按“我—学校—老师”组织"],
        activities: ["找出并改正小写错误", "给漏标点的句子加句号", "按资料卡写自我介绍", "朗读并检查自己的短文"],
        phonics: ["Unit 2 拼读复习"],
        expansion: { title: "让介绍更完整", knowledge: ["可以加入喜欢的学科：My favourite subject is English。", "可以加入性格：My teacher is kind。", "每句话只表达一个主要信息，更适合一年级写作。"], challenge: "用姓名、学校、班级、年龄和一位老师写5句介绍，并检查5个大写字母。" }
      })
    ]
  },
  {
    id: "ple1a-u3", number: 3, title: "Be good in class", zh: "遵守课堂规则", theme: "课堂指令、物品和标志", icon: "🪧", color: "sunny",
    lessons: [
      lesson({
        id: "ple1a-u3-l1", title: "A morning at Animal School", subtitle: "动物学校的课堂故事", pages: "课本第26–30页", icon: "🐻", kind: "故事",
        goals: ["理解老师发出的课堂指令", "按故事顺序排列动作", "根据上下文理解 fine 等词"],
        vocabulary: [{ word: "blackboard", meaning: "黑板" }, { word: "sit down", meaning: "坐下" }, { word: "stand up", meaning: "站起来" }, { word: "open", meaning: "打开" }, { word: "turn to", meaning: "翻到" }, { word: "fine", meaning: "没事／很好" }],
        sentences: [{ en: "Look at the blackboard, please.", zh: "请看黑板。" }, { en: "Sit down, Mimi.", zh: "Mimi，请坐下。" }, { en: "Please open your books.", zh: "请打开书。" }, { en: "Turn to page six.", zh: "翻到第六页。" }],
        knowledge: ["课堂指令常以动词开头", "please 可以放句首或句末表示礼貌", "turn to page... 表示翻到第几页", "故事排序要观察动作发生的先后"],
        activities: ["给四条课堂指令排序", "听指令做动作", "判断故事中发生的是good、bad还是funny", "跟读角色对话"],
        phonics: ["s: sit", "f: fine", "-it: sit / hit", "-ix: six / mix"],
        expansion: { title: "听懂课堂里的动词", knowledge: ["look 强调看，listen 强调听。", "open 与 close 是一对反义词。", "stand up 与 sit down 是一对动作。"], challenge: "听四条指令，按正确顺序完成动作，并说出两组反义动作。" }
      }),
      lesson({
        id: "ple1a-u3-l2", title: "Things and actions in class", subtitle: "教室物品与动作口令", pages: "课本第31–33页", icon: "🖥️", kind: "听说",
        goals: ["认识教室里的常见物品", "会用 Point to... 给出指令", "能听口令快速找到正确物品"],
        vocabulary: [{ word: "door", meaning: "门" }, { word: "window", meaning: "窗户" }, { word: "desk", meaning: "书桌" }, { word: "chair", meaning: "椅子" }, { word: "computer", meaning: "电脑" }, { word: "drawer", meaning: "抽屉" }, { word: "point to", meaning: "指向" }],
        sentences: [{ en: "Come in, please.", zh: "请进。" }, { en: "Point to the computer, please.", zh: "请指向电脑。" }, { en: "Close the door, please.", zh: "请关门。" }, { en: "Clap your hands.", zh: "拍拍手。" }],
        knowledge: ["the 表示双方都知道的具体物品", "Point to 后接物品", "your 表示“你的／你们的”", "口令游戏先听完整句再行动"],
        activities: ["给教室图片贴英文标签", "两人进行Point to抢答", "替换物品创编chant", "寻找真实教室中的物品"],
        phonics: ["s / f 首音辨别"],
        expansion: { title: "教室里的位置表达", knowledge: ["on the desk 表示在桌上。", "under the chair 表示在椅子下面。", "near the window 表示靠近窗户。"], challenge: "用三条指令引导同伴找到教室里的一个物品。" }
      }),
      lesson({
        id: "ple1a-u3-l3", title: "Robot Rex", subtitle: "肯定指令与否定指令", pages: "课本第34–35页", icon: "🤖", kind: "词句",
        goals: ["理解 Don't 表示不要做", "区分正确和错误动作", "会给机器人发出清楚指令"],
        vocabulary: [{ word: "don't", meaning: "不要" }, { word: "wrong", meaning: "错误的" }, { word: "job", meaning: "工作／表现" }, { word: "robot", meaning: "机器人" }, { word: "teacher", meaning: "老师" }, { word: "listen", meaning: "听" }],
        sentences: [{ en: "Don't look at me.", zh: "不要看我。" }, { en: "Don't open the door.", zh: "不要开门。" }, { en: "Good job!", zh: "做得好！" }, { en: "Sorry. That is wrong.", zh: "对不起，那是错的。" }],
        knowledge: ["Don't 是 Do not 的缩写", "Don't 后使用动词原形", "肯定指令直接用动词开头", "同一动作可以改成肯定或否定指令"],
        activities: ["把肯定指令改成Don't句", "听口令判断机器人动作", "轮流扮演老师和Robot Rex", "为机器人编写三条安全规则"],
        phonics: ["do / don't 对比跟读"],
        expansion: { title: "规则为什么需要说清楚？", knowledge: ["清楚的规则包含动作和对象。", "礼貌提醒可使用 Please don't...。", "规则应说明可以做什么，也说明不可以做什么。"], challenge: "为图书馆写两条肯定指令和两条否定指令。" }
      }),
      lesson({
        id: "ple1a-u3-l4", title: "Signs around us", subtitle: "读懂学校内外的标志", pages: "课本第36–37页", icon: "🚸", kind: "阅读",
        goals: ["理解标志用图画或文字传递指令", "辨认学校和公园常见标志", "能为教室设计一个清楚标志"],
        vocabulary: [{ word: "sign", meaning: "标志" }, { word: "exit", meaning: "出口" }, { word: "outside", meaning: "在外面" }, { word: "inside", meaning: "在里面" }, { word: "quiet", meaning: "安静的" }, { word: "park", meaning: "公园" }],
        sentences: [{ en: "This sign tells us what to do.", zh: "这个标志告诉我们要做什么。" }, { en: "Do not run.", zh: "不要奔跑。" }, { en: "Keep quiet.", zh: "保持安静。" }, { en: "Where can you see this sign?", zh: "你在哪里能看到这个标志？" }],
        knowledge: ["有些标志只有文字，有些只有图画", "红色斜线通常表示禁止", "标志要简单、醒目、容易理解", "阅读标志要结合地点判断含义"],
        activities: ["标志与地点配对", "判断标志告诉我们do还是don't", "校园标志寻宝", "设计一张教室规则牌"],
        phonics: ["Unit 3 拼读复习"],
        expansion: { title: "公共标志也是一种语言", knowledge: ["图形标志可以跨越语言帮助人理解。", "EXIT、STOP 等词常使用大写字母。", "安全标志必须优先让人快速看懂。"], challenge: "为走廊、图书馆和操场各选择一个最重要的标志，并解释原因。" }
      })
    ]
  },
  {
    id: "ple1a-u4", number: 4, title: "Things I bring to school", zh: "我带到学校的物品", theme: "学习用品、数量与分享", icon: "🎒", color: "peach",
    lessons: [
      lesson({
        id: "ple1a-u4-l1", title: "More-more-more!", subtitle: "魔法学校漫画", pages: "课本第38–42页", icon: "🪄", kind: "故事",
        goals: ["读懂学习用品数量变化", "比较人物的行为和态度", "从漫画中概括主要内容"],
        vocabulary: [{ word: "pen", meaning: "钢笔" }, { word: "eraser", meaning: "橡皮" }, { word: "ruler", meaning: "尺子" }, { word: "book", meaning: "书" }, { word: "more", meaning: "更多" }, { word: "share", meaning: "分享" }, { word: "idea", meaning: "主意" }],
        sentences: [{ en: "I have ten pens now.", zh: "我现在有十支笔。" }, { en: "Kira has six erasers.", zh: "Kira有六块橡皮。" }, { en: "I have an idea!", zh: "我有一个主意！" }, { en: "Let me help you.", zh: "让我来帮助你。" }],
        knowledge: ["I 搭配 have，he / she 搭配 has", "阅读漫画要留意对白框和图画变化", "标题应概括故事最重要的内容", "故事主题包含关心和分享"],
        activities: ["记录每个人拥有的物品数量", "给漫画选择最佳标题", "比较Ben和Kira的行为", "按角色朗读漫画"],
        phonics: ["p: pencil", "-en: pen / ten"],
        expansion: { title: "拥有与分享", knowledge: ["have 表示拥有，borrow 表示借入，lend 表示借出。", "Here you are 用于把物品递给别人。", "分享时仍要先征得物品主人的同意。"], challenge: "设计一段借笔对话，包含请求、同意、递出和感谢。" }
      }),
      lesson({
        id: "ple1a-u4-l2", title: "My school bag", subtitle: "学习用品、a/an和数量", pages: "课本第43–44页", icon: "✏️", kind: "词句",
        goals: ["说出常见学习用品", "正确使用a和an", "读写1到10并使用名词复数"],
        vocabulary: [{ word: "school bag", meaning: "书包" }, { word: "pencil case", meaning: "笔袋" }, { word: "pencil", meaning: "铅笔" }, { word: "pen", meaning: "钢笔" }, { word: "ruler", meaning: "尺子" }, { word: "eraser", meaning: "橡皮" }, { word: "umbrella", meaning: "雨伞" }],
        sentences: [{ en: "I have a pen.", zh: "我有一支笔。" }, { en: "I have an eraser.", zh: "我有一块橡皮。" }, { en: "I have three erasers.", zh: "我有三块橡皮。" }, { en: "Ten little red pens.", zh: "十支红色的小笔。" }],
        knowledge: ["辅音音素前用a，元音音素前用an", "数量超过一时，普通名词通常加-s", "one pen / two pens", "a/an 只和单数可数名词搭配"],
        activities: ["给书包物品贴标签", "a/an快速分类", "听数量选择正确图片", "替换物品演唱数字歌"],
        phonics: ["p / -en 拼读"],
        expansion: { title: "a/an 看声音，不只看字母", knowledge: ["an apple、an eraser、an orange 都以元音音素开头。", "a pencil、a ruler 以辅音音素开头。", "判断时先慢慢读出单词的第一个声音。"], challenge: "把十个物品分入a和an两个书包，并说明第一个声音。" }
      }),
      lesson({
        id: "ple1a-u4-l3", title: "May I borrow a pen?", subtitle: "分享物品与have/has", pages: "课本第45–47页", icon: "🤲", kind: "听说",
        goals: ["礼貌借用和分享学习用品", "区分have和has", "根据人物图片描述所带物品"],
        vocabulary: [{ word: "borrow", meaning: "借用" }, { word: "sure", meaning: "当然／可以" }, { word: "here you are", meaning: "给你" }, { word: "friend", meaning: "朋友" }, { word: "bring", meaning: "带来" }, { word: "only", meaning: "只有" }],
        sentences: [{ en: "May I borrow a pen, please?", zh: "我可以借一支笔吗？" }, { en: "Sure. Here you are.", zh: "当然。给你。" }, { en: "He has a school bag.", zh: "他有一个书包。" }, { en: "She has six erasers.", zh: "她有六块橡皮。" }],
        knowledge: ["May I... 是礼貌请求", "I / you / we / they 搭配have", "he / she / it 搭配has", "回答借用请求后记得说Thank you"],
        activities: ["完成朋友物品标签", "have / has选择", "两人角色扮演借物", "看图说人物有什么"],
        phonics: ["have / has 节奏跟读"],
        expansion: { title: "礼貌请求四步法", knowledge: ["第一步说明请求：May I borrow...?", "第二步回应：Sure 或 Sorry。", "第三步递出：Here you are。", "第四步感谢：Thank you。"], challenge: "分别演练“可以借”和“暂时不能借”两种对话，语气都要友善。" }
      }),
      lesson({
        id: "ple1a-u4-l4", title: "Write a comic strip", subtitle: "漫画与标点符号", pages: "课本第48–49页", icon: "💬", kind: "写作",
        goals: ["认识对白框、想法框和说明文字", "正确使用逗号、问号和感叹号", "根据图画写简短漫画"],
        vocabulary: [{ word: "comic strip", meaning: "连环漫画" }, { word: "caption", meaning: "说明文字" }, { word: "speech bubble", meaning: "对白框" }, { word: "thought bubble", meaning: "想法框" }, { word: "question mark", meaning: "问号" }, { word: "exclamation mark", meaning: "感叹号" }],
        sentences: [{ en: "Are you OK, Harry?", zh: "Harry，你还好吗？" }, { en: "Take out your books, please.", zh: "请拿出你们的书。" }, { en: "You are great, Joyce!", zh: "Joyce，你真棒！" }, { en: "We can share!", zh: "我们可以分享！" }],
        knowledge: ["问句末使用问号", "强烈感情后使用感叹号", "称呼语前后常使用逗号", "漫画文字要与画面动作一致"],
        activities: ["为句子补标点", "区分speech/thought/shout bubble", "按图补写对白", "小组表演自编漫画"],
        phonics: ["Unit 4 拼读复习"],
        expansion: { title: "标点也会表达情绪", knowledge: ["句号语气平稳，问号表示提问，感叹号表示强烈感受。", "同一句话使用不同标点，读法和情绪会变化。", "漫画中不要连续使用太多感叹号。"], challenge: "给三句相同文字分别配句号、问号和感叹号，并用不同语气朗读。" }
      })
    ]
  },
  {
    id: "ple1a-u5", number: 5, title: "Our animal friends", zh: "我们的动物朋友", theme: "宠物、农场动物和外形", icon: "🐾", color: "leaf",
    lessons: [
      lesson({
        id: "ple1a-u5-l1", title: "Can I have a pet?", subtitle: "Alex选择宠物的故事", pages: "课本第50–54页", icon: "🐕", kind: "故事",
        goals: ["理解选择宠物时要考虑家庭条件", "从故事中比较动物大小和外形", "学习负责任地照顾动物"],
        vocabulary: [{ word: "pet", meaning: "宠物" }, { word: "leaflet", meaning: "宣传单" }, { word: "turtle", meaning: "乌龟" }, { word: "dog", meaning: "狗" }, { word: "cat", meaning: "猫" }, { word: "clever", meaning: "聪明的" }, { word: "take care of", meaning: "照顾" }],
        sentences: [{ en: "Can I have a pet too?", zh: "我也可以养一只宠物吗？" }, { en: "I like those turtles.", zh: "我喜欢那些乌龟。" }, { en: "That dog is big.", zh: "那只狗很大。" }, { en: "Can you take care of it?", zh: "你能照顾它吗？" }],
        knowledge: ["选择宠物不只看喜欢，也要考虑空间和照顾能力", "this/these 指较近，that/those 指较远", "it 指一只动物，they 指多只动物", "阅读时用原因回答why问题"],
        activities: ["按故事顺序排列选择宠物的过程", "从故事中找出动物外形", "为故事选择合理结局", "讨论养宠物需要做什么"],
        phonics: ["d: day / dog", "l: like", "-og: dog / log"],
        expansion: { title: "宠物需要什么？", knowledge: ["动物需要合适食物、清洁饮水、活动空间和照顾。", "不同动物的生活需要不同。", "养宠物是一项持续的责任。"], challenge: "从空间、食物、活动和照顾四方面，为一种宠物制作照顾清单。" }
      }),
      lesson({
        id: "ple1a-u5-l2", title: "This cat and those turtles", subtitle: "宠物与指示代词", pages: "课本第55–57页", icon: "🐈", kind: "词句",
        goals: ["认识常见宠物", "按距离和数量选择指示代词", "会说自己喜欢哪只或哪些动物"],
        vocabulary: [{ word: "cat", meaning: "猫" }, { word: "dog", meaning: "狗" }, { word: "hamster", meaning: "仓鼠" }, { word: "rabbit", meaning: "兔子" }, { word: "turtle", meaning: "乌龟" }, { word: "this", meaning: "这个" }, { word: "that", meaning: "那个" }, { word: "these", meaning: "这些" }, { word: "those", meaning: "那些" }],
        sentences: [{ en: "I like this cat.", zh: "我喜欢这只猫。" }, { en: "I like that dog.", zh: "我喜欢那只狗。" }, { en: "I like these rabbits.", zh: "我喜欢这些兔子。" }, { en: "I like those hamsters.", zh: "我喜欢那些仓鼠。" }],
        knowledge: ["this：近处单数", "that：远处单数", "these：近处复数", "those：远处复数", "these/those 后接复数名词"],
        activities: ["把宠物放在近处或远处", "按一只／多只选择代词", "跟着歌曲做指向动作", "介绍自己喜欢的宠物"],
        phonics: ["l: like"],
        expansion: { title: "四个指示代词的小地图", knowledge: ["先判断数量：一个还是多个。", "再判断距离：近处还是远处。", "回答时可用 It is... 或 They are...继续描述。"], challenge: "观察一幅宠物店场景，用this、that、these、those各说一句。" }
      }),
      lesson({
        id: "ple1a-u5-l3", title: "Animals on the farm", subtitle: "农场动物与外形描述", pages: "课本第58–59页", icon: "🐄", kind: "听说",
        goals: ["认识常见农场动物", "用big/small/fat/thin描述动物", "区分it和they"],
        vocabulary: [{ word: "cow", meaning: "奶牛" }, { word: "horse", meaning: "马" }, { word: "pig", meaning: "猪" }, { word: "hen", meaning: "母鸡" }, { word: "duck", meaning: "鸭子" }, { word: "big", meaning: "大的" }, { word: "small", meaning: "小的" }, { word: "fat", meaning: "胖的" }, { word: "thin", meaning: "瘦的" }],
        sentences: [{ en: "This hen is fat.", zh: "这只母鸡很胖。" }, { en: "These ducks are small.", zh: "这些鸭子很小。" }, { en: "It is big.", zh: "它很大。" }, { en: "They are thin.", zh: "它们很瘦。" }],
        knowledge: ["一只动物用it，多只动物用they", "it搭配is，they搭配are", "形容词放在be动词后描述外形", "描述应依据图画，不随意判断动物健康"],
        activities: ["听动物叫声猜动物", "it/they快速选择", "完成农场动物海报", "找照片并描述动物"],
        phonics: ["-og: dog / log"],
        expansion: { title: "动物分类不只有宠物和农场动物", knowledge: ["wild animals 是野生动物。", "sea animals 是海洋动物。", "分类时要先说明标准，例如生活地点或是否由人饲养。"], challenge: "把12种动物按生活地点分类，并为每类补充一种新动物。" }
      }),
      lesson({
        id: "ple1a-u5-l4", title: "Animal information boards", subtitle: "阅读农场动物信息牌", pages: "课本第60–61页", icon: "📋", kind: "阅读",
        goals: ["知道信息牌用于提供事实", "从标题、图片和短句提取动物信息", "区分宠物和农场动物"],
        vocabulary: [{ word: "information board", meaning: "信息牌" }, { word: "farm animal", meaning: "农场动物" }, { word: "mother", meaning: "妈妈／母亲" }, { word: "lamb", meaning: "小羊" }, { word: "sheep", meaning: "绵羊" }, { word: "chick", meaning: "小鸡" }],
        sentences: [{ en: "We can look at information boards.", zh: "我们可以查看信息牌。" }, { en: "A lamb is a young sheep.", zh: "小羊是年幼的绵羊。" }, { en: "These are farm animals.", zh: "这些是农场动物。" }, { en: "What does this animal eat?", zh: "这种动物吃什么？" }],
        knowledge: ["信息牌通常包含标题、图片和事实", "阅读时先看标题预测主题", "答案要来自信息牌，不只依靠常识", "young animal 表示幼小动物"],
        activities: ["根据信息牌回答问题", "配对成年动物和幼崽", "判断信息是事实还是个人喜好", "制作一种动物的信息牌"],
        phonics: ["Unit 5 拼读复习"],
        expansion: { title: "从动物名称拓展到成长", knowledge: ["cat的幼崽是kitten，dog的幼崽是puppy。", "cow的幼崽是calf，horse的幼崽是foal。", "同一种动物在不同成长阶段可能有不同名称。"], challenge: "制作四组“成年动物—幼崽”配对卡，并用This is...介绍。" }
      })
    ]
  },
  {
    id: "ple1a-u6", number: 6, title: "Who is that?", zh: "那是谁？", theme: "人物身份、身体部位和外貌", icon: "🧑‍🤝‍🧑", color: "lilac",
    lessons: [
      lesson({
        id: "ple1a-u6-l1", title: "A monster in Storyland", subtitle: "故事世界里的新朋友", pages: "课本第62–66页", icon: "🏰", kind: "故事",
        goals: ["理解人物不能只凭外表判断", "按顺序梳理故事事件", "从描述中辨认人物"],
        vocabulary: [{ word: "monster", meaning: "怪兽" }, { word: "castle", meaning: "城堡" }, { word: "wall", meaning: "墙" }, { word: "horn", meaning: "角" }, { word: "appearance", meaning: "外表" }, { word: "kind", meaning: "友善的" }, { word: "help", meaning: "帮助" }],
        sentences: [{ en: "Who is that?", zh: "那是谁？" }, { en: "She has long hair.", zh: "她有长头发。" }, { en: "He is really big.", zh: "他真的很高大。" }, { en: "I can help.", zh: "我可以帮忙。" }, { en: "Can we be friends?", zh: "我们能成为朋友吗？" }],
        knowledge: ["who 用来询问人物身份", "外貌不等于性格", "故事排序要寻找时间和行动线索", "回答人物特点时引用故事行为"],
        activities: ["按顺序排列五个故事事件", "根据外貌描述猜人物", "讨论为什么不能以貌取人", "为故事补写结尾对话"],
        phonics: ["c/k: can / kid", "-at: fat / cat / mat"],
        expansion: { title: "描述外貌，也要尊重别人", knowledge: ["描述应使用客观、友善的词。", "kind、helpful描述性格，tall、short描述外形。", "判断一个人更应关注他的行为。"], challenge: "分别用两句描述外貌、两句描述行为，介绍一个故事人物。" }
      }),
      lesson({
        id: "ple1a-u6-l2", title: "Body parts", subtitle: "身体部位与数量", pages: "课本第67–69页", icon: "👀", kind: "词句",
        goals: ["认识主要身体部位", "掌握部分不规则复数", "用has描述怪兽身体"],
        vocabulary: [{ word: "hair", meaning: "头发" }, { word: "ear", meaning: "耳朵" }, { word: "eye", meaning: "眼睛" }, { word: "nose", meaning: "鼻子" }, { word: "mouth", meaning: "嘴" }, { word: "arm", meaning: "手臂" }, { word: "hand", meaning: "手" }, { word: "leg", meaning: "腿" }, { word: "foot / feet", meaning: "脚／脚的复数" }],
        sentences: [{ en: "It has big eyes.", zh: "它有大眼睛。" }, { en: "It has small hands.", zh: "它有小手。" }, { en: "It has long legs.", zh: "它有长腿。" }, { en: "It has a big mouth.", zh: "它有一张大嘴。" }],
        knowledge: ["一个部位前可用a/an", "多个普通名词通常加-s", "foot的复数是feet", "hair通常作为不可数名词，不加a或-s"],
        activities: ["给身体图贴英文标签", "按one/more than one/cannot count分类", "听描述选择怪兽", "口头描述自创人物"],
        phonics: ["c / k 同音辨别"],
        expansion: { title: "身体部位中的特殊复数", knowledge: ["foot变feet，tooth变teeth。", "one eye / two eyes 是规则复数。", "描述数量时先判断名词是否可数。"], challenge: "找出六个身体部位的单复数，并用has写三句怪兽描述。" }
      }),
      lesson({
        id: "ple1a-u6-l3", title: "Who is this?", subtitle: "猜照片里的人", pages: "课本第70–71页", icon: "📷", kind: "听说",
        goals: ["使用Who is this/that询问人物", "使用he/she回答并描述", "根据照片细节辨认人物"],
        vocabulary: [{ word: "who", meaning: "谁" }, { word: "this", meaning: "这个／这位" }, { word: "that", meaning: "那个／那位" }, { word: "photo", meaning: "照片" }, { word: "funny", meaning: "有趣的" }, { word: "parent", meaning: "父亲或母亲" }],
        sentences: [{ en: "Who is this?", zh: "这是谁？" }, { en: "This is my mother.", zh: "这是我的妈妈。" }, { en: "Who is that?", zh: "那是谁？" }, { en: "He has a big mouth.", zh: "他有一张大嘴。" }],
        knowledge: ["this询问较近照片，that询问较远人物", "男性用he，女性用she", "回答身份后可加一句外貌描述", "Who is 可缩写为Who's"],
        activities: ["听描述给照片写姓名", "两人猜家庭照片", "this/that距离判断", "介绍一位家人或故事人物"],
        phonics: ["who / this / that 连读"],
        expansion: { title: "从身份问答拓展人物介绍", knowledge: ["可以先回答关系：He is my brother。", "再说外貌：He has short hair。", "最后说性格或能力：He is kind / He can swim。"], challenge: "选择一个人物，用身份、外貌、性格三层信息完成介绍。" }
      }),
      lesson({
        id: "ple1a-u6-l4", title: "Write about a monster", subtitle: "画怪兽并写完整句", pages: "课本第72–73页", icon: "🎨", kind: "写作",
        goals: ["理解完整句包含主语和动词", "正确搭配It is与It has", "写4到6句怪兽描述"],
        vocabulary: [{ word: "subject", meaning: "主语" }, { word: "verb", meaning: "动词" }, { word: "adjective", meaning: "形容词" }, { word: "wing", meaning: "翅膀" }, { word: "horn", meaning: "角" }, { word: "teeth", meaning: "牙齿（复数）" }],
        sentences: [{ en: "Look at this monster.", zh: "看看这只怪兽。" }, { en: "It is fat.", zh: "它很胖。" }, { en: "It has two small horns.", zh: "它有两只小角。" }, { en: "It has four long teeth.", zh: "它有四颗长牙。" }, { en: "It has two big wings.", zh: "它有两只大翅膀。" }],
        knowledge: ["It is + 形容词", "It has + 身体部位", "It are和It have是不正确搭配", "数量、大小和身体部位可以组成更具体的描述"],
        activities: ["选择正确的is/has", "把词语排列成完整句", "画一个自己的怪兽", "写句子并朗读给同学听"],
        phonics: ["c / k / -at 单元复习"],
        expansion: { title: "让描述更有层次", knowledge: ["先写整体：It is tall。", "再写局部：It has three eyes。", "最后写能力或性格：It can fly / It is friendly。"], challenge: "设计一只友善怪兽，用整体、局部和能力三个层次写6句话。" }
      })
    ]
  },
  {
    id: "ple1a-review", number: 7, title: "Revision garden", zh: "全册复习花园", theme: "课堂用语、词汇、语法和自评", icon: "🌷", color: "rose",
    lessons: [
      lesson({
        id: "ple1a-r-l1", title: "Classroom language", subtitle: "课堂里真正会用到的英语", pages: "课本第74–75页", icon: "🗣️", kind: "复习",
        goals: ["听懂教师常用课堂指令", "不会或没听清时主动求助", "在游戏和讨论中使用礼貌表达"],
        vocabulary: [{ word: "be quiet", meaning: "保持安静" }, { word: "take out", meaning: "拿出" }, { word: "put away", meaning: "收好" }, { word: "hand in", meaning: "交上" }, { word: "understand", meaning: "明白" }, { word: "say that again", meaning: "再说一遍" }, { word: "your turn", meaning: "轮到你" }],
        sentences: [{ en: "May I go to the toilet, please?", zh: "我可以去洗手间吗？" }, { en: "Sorry, I don't understand.", zh: "对不起，我不明白。" }, { en: "Can you say that again, please?", zh: "请你再说一遍，可以吗？" }, { en: "It is your turn.", zh: "轮到你了。" }],
        knowledge: ["遇到听不懂要主动求助，不要假装明白", "May I...用于请求许可", "Excuse me用于礼貌引起注意", "课堂游戏中也要使用友善语言"],
        activities: ["课堂用语听音宾果", "选择合适求助句", "模拟借笔、提问和轮流游戏", "制作个人课堂英语口袋卡"],
        expansion: { title: "让孩子真正能在课堂使用", knowledge: ["I don't know 与 I don't understand 含义不同。", "听不清使用I can't hear you。", "不懂内容使用I don't understand。"], challenge: "根据“听不清、看不懂、不会拼写、想借笔”四个场景选择求助句。" }
      }),
      lesson({
        id: "ple1a-r-l2", title: "My word bank", subtitle: "按主题整理全册词汇", pages: "课本第76–79页", icon: "🗂️", kind: "复习",
        goals: ["按学校、物品、时间、动物和身体分类词汇", "发现词汇之间的主题联系", "建立自己的补充词库"],
        vocabulary: [{ word: "people at school", meaning: "学校里的人" }, { word: "things at school", meaning: "学校里的物品" }, { word: "parts of the day", meaning: "一天中的时段" }, { word: "pets", meaning: "宠物" }, { word: "farm animals", meaning: "农场动物" }, { word: "body parts", meaning: "身体部位" }],
        sentences: [{ en: "This is my own word bank.", zh: "这是我自己的词库。" }, { en: "These words are about school.", zh: "这些词与学校有关。" }, { en: "I can put the words into groups.", zh: "我可以把单词分类。" }],
        knowledge: ["按主题分类比孤立背词更容易记忆", "一个词可以与多个知识点建立联系", "自己的词库可以加入图片、例句和发音"],
        activities: ["把全册词汇拖入主题篮子", "听词选择主题", "每个主题补充两个新词", "选择最难的十个词做复习卡"],
        expansion: { title: "用词汇网代替死记硬背", knowledge: ["school可连接teacher、class、desk和book。", "animal可连接pet、farm、big和small。", "同主题词可以放进一个句型重复使用。"], challenge: "选择一个中心词，画出至少8个相关词的词汇网。" }
      }),
      lesson({
        id: "ple1a-r-l3", title: "Grammar revision", subtitle: "be动词、have/has、代词与疑问词", pages: "课本第80–81页", icon: "🧩", kind: "复习",
        goals: ["复习am/is/are", "复习have/has", "正确选择人称代词与疑问词"],
        vocabulary: [{ word: "pronoun", meaning: "代词" }, { word: "question word", meaning: "疑问词" }, { word: "preposition", meaning: "介词" }, { word: "identity", meaning: "身份" }, { word: "age", meaning: "年龄" }],
        sentences: [{ en: "I am short.", zh: "我个子矮。" }, { en: "We are in Class 1B.", zh: "我们在1B班。" }, { en: "She has long hair.", zh: "她有长头发。" }, { en: "What is your name?", zh: "你叫什么名字？" }, { en: "Who is this?", zh: "这是谁？" }],
        knowledge: ["I-am，he/she/it-is，we/you/they-are", "I/you/we/they-have，he/she/it-has", "What问事物或姓名，Who问人物，How old问年龄", "in表示在班级／年级中，from表示来自哪里"],
        activities: ["主语与be动词配对", "have/has快速判断", "选择正确疑问词", "综合改错小测"],
        expansion: { title: "用一张表看懂全册语法", knowledge: ["先找主语，再选择be动词或have/has。", "看到问号先判断问题要找什么信息。", "检查句子时依次看：主语、动词、名词单复数、标点。"], challenge: "完成8句综合改错，并说出每句检查的是哪一条规则。" }
      }),
      lesson({
        id: "ple1a-r-l4", title: "My learning journey", subtitle: "六单元能力闯关", pages: "课本第82–84页", icon: "🏆", kind: "复习",
        goals: ["回顾六单元能做什么", "发现已经掌握和需要加强的内容", "制定下一步复习计划"],
        vocabulary: [{ word: "I can", meaning: "我会／我能" }, { word: "work harder", meaning: "更加努力" }, { word: "well done", meaning: "做得好" }, { word: "journey", meaning: "旅程" }, { word: "revision", meaning: "复习" }],
        sentences: [{ en: "I can introduce people.", zh: "我会介绍人物。" }, { en: "I can follow classroom instructions.", zh: "我能听懂课堂指令。" }, { en: "I can talk about animals.", zh: "我会谈论动物。" }, { en: "I can write about a monster.", zh: "我会描写一只怪兽。" }],
        knowledge: ["自评不是只看分数，还要看是否能独立完成", "It's OK表示还可以继续练习", "Work harder表示需要更多练习", "复习应优先处理不会和容易混淆的知识"],
        activities: ["完成六单元能力自评", "每单元选择一个代表任务", "生成个人复习清单", "完成1A结业综合挑战"],
        expansion: { title: "学会自己管理复习", knowledge: ["把知识分成“会、还不熟、不会”三类。", "先复习不会，再练容易混淆，最后巩固已经会。", "每次复习只设一个清楚的小目标。"], challenge: "根据自评结果安排三天复习计划，每天写出目标、任务和检查方式。" }
      })
    ]
  }
];

export const ple1aLessonCount = ple1aUnits.reduce((sum, unit) => sum + unit.lessons.length, 0);

export function findPle1aLesson(id: string) {
  for (const unit of ple1aUnits) {
    const found = unit.lessons.find((item) => item.id === id);
    if (found) return { unit, lesson: found };
  }
  return null;
}
