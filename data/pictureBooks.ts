// 绘本馆数据：G1–G8 分级原创双语绘本（英 + 中）。
// 全部为「小狗的森林学堂」原创内容，女声朗读通过 /api/tts 实时合成。
// 每本 4 页，英文句子简短清晰，适合逐句朗读与跟读。

export type PictureBookPage = {
  en: string;
  cn: string;
  scene?: string;
  // 真人女声录音；存在时绘本播放器优先使用，异常时自动回退在线语音。
  narration?: string;
};

export type PictureBook = {
  id: string;
  grade: string;
  titleEn: string;
  titleCn: string;
  coverEmoji: string;
  coverColor: string;
  ageRange: string;
  pages: PictureBookPage[];
  illustrations: string[];
  sourceNote?: string;
};

const SOURCE = "原创森林绘本 · 小狗的森林学堂";

export const pictureBooks: PictureBook[] = [
  // ===================== G1（3–4岁 幼儿启蒙） =====================
  {
    id: "pb-g1-1",
    grade: "G1",
    titleEn: "The Red Ball",
    titleCn: "红色的小球",
    coverEmoji: "🔴",
    coverColor: "rose",
    ageRange: "3–4岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g1-1/page1.png",
      "/picture-books/pb-g1-1/page2.png",
      "/picture-books/pb-g1-1/page3.png",
      "/picture-books/pb-g1-1/page4.png",
    ],
    pages: [
      { en: "Leo the puppy has a red ball.", cn: "小狗 Leo 有一个红色的小球。", scene: "小狗抱着红球" },
      { en: "The ball rolls under the leaf.", cn: "小球滚到了叶子下面。", scene: "球滚进草丛" },
      { en: "Mimi the cat finds the ball.", cn: "小猫 Mimi 找到了小球。", scene: "小猫探头" },
      { en: "They play together in the sun.", cn: "它们一起在阳光下玩耍。", scene: "阳光下一起玩" },
    ],
  },
  {
    id: "pb-g1-2",
    grade: "G1",
    titleEn: "Hello, Friends",
    titleCn: "你好，朋友们",
    coverEmoji: "🐰",
    coverColor: "mint",
    ageRange: "3–4岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g1-2/page1.png",
      "/picture-books/pb-g1-2/page2.png",
      "/picture-books/pb-g1-2/page3.png",
      "/picture-books/pb-g1-2/page4.png",
    ],
    pages: [
      { en: "Good morning, little rabbit.", cn: "早上好，小兔子。", scene: "晨光中的兔子" },
      { en: "Good morning, little bird.", cn: "早上好，小鸟。", scene: "枝头的小鸟" },
      { en: "We are good friends.", cn: "我们是好朋友。", scene: "动物围成圈" },
      { en: "Let us sing a happy song.", cn: "我们一起唱一首快乐的歌吧。", scene: "大家唱歌" },
    ],
  },

  // ===================== G2（5–6岁 幼小衔接） =====================
  {
    id: "pb-g2-1",
    grade: "G2",
    titleEn: "Count the Acorns",
    titleCn: "数数小橡果",
    coverEmoji: "🌰",
    coverColor: "leaf",
    ageRange: "5–6岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g2-1/page1.png",
      "/picture-books/pb-g2-1/page2.png",
      "/picture-books/pb-g2-1/page3.png",
      "/picture-books/pb-g2-1/page4.png",
    ],
    pages: [
      { en: "One acorn for the squirrel.", cn: "给小松鼠一颗橡果。", scene: "松鼠和橡果" },
      { en: "Two acorns by the tree.", cn: "树下有两颗橡果。", scene: "树下的橡果" },
      { en: "Three acorns in the basket.", cn: "篮子里有三颗橡果。", scene: "篮子里的橡果" },
      { en: "Count them: one, two, three!", cn: "数一数：一、二、三！", scene: "开心数数" },
    ],
  },
  {
    id: "pb-g2-2",
    grade: "G2",
    titleEn: "Please and Thank You",
    titleCn: "请和谢谢",
    coverEmoji: "🙏",
    coverColor: "sun",
    ageRange: "5–6岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g2-2/page1.png",
      "/picture-books/pb-g2-2/page2.png",
      "/picture-books/pb-g2-2/page3.png",
      "/picture-books/pb-g2-2/page4.png",
    ],
    pages: [
      { en: "May I share your apple?", cn: "我可以分你的苹果吗？", scene: "请求分享" },
      { en: "Yes, please have one.", cn: "可以，请拿一个吧。", scene: "递出苹果" },
      { en: "Thank you, kind friend.", cn: "谢谢你，善良的朋友。", scene: "道谢" },
      { en: "You are welcome, Leo.", cn: "不客气，Leo。", scene: "微笑回应" },
    ],
  },

  // ===================== G3（7岁 小学一年级） =====================
  {
    id: "pb-g3-1",
    grade: "G3",
    titleEn: "Spring Is Here",
    titleCn: "春天来了",
    coverEmoji: "🌸",
    coverColor: "lilac",
    ageRange: "7岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g3-1/p1/Childrens_picture_book_illustr_2026-08-09T05-17-42.png",
      "/picture-books/pb-g3-1/p2/Childrens_picture_book_illustr_2026-08-09T05-18-11.png",
      "/picture-books/pb-g3-1/p3/Childrens_picture_book_illustr_2026-08-09T05-18-40.png",
      "/picture-books/pb-g3-1/p4/Childrens_picture_book_illustr_2026-08-09T05-19-09.png",
    ],
    pages: [
      { en: "The snow melts in the forest.", cn: "森林里的雪融化了。", scene: "雪化溪流" },
      { en: "Green buds appear on the trees.", cn: "树上冒出了绿色的新芽。", scene: "树芽" },
      { en: "A butterfly dances in the wind.", cn: "一只蝴蝶在风里跳舞。", scene: "飞舞的蝴蝶" },
      { en: "Spring brings new life to us all.", cn: "春天给大家都带来了新生命。", scene: "生机盎然" },
    ],
  },
  {
    id: "pb-g3-2",
    grade: "G3",
    titleEn: "My Forest Family",
    titleCn: "我的森林家人",
    coverEmoji: "🦌",
    coverColor: "blue",
    ageRange: "7岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g3-2/p1/Childrens_picture_book_illustr_2026-08-09T05-19-41.png",
      "/picture-books/pb-g3-2/p2/Childrens_picture_book_illustr_2026-08-09T05-20-11.png",
      "/picture-books/pb-g3-2/p3/Childrens_picture_book_illustr_2026-08-09T05-20-42.png",
      "/picture-books/pb-g3-2/p4/Childrens_picture_book_illustr_2026-08-09T05-21-15.png",
    ],
    pages: [
      { en: "Dad deer tells a bedtime story.", cn: "鹿爸爸讲了一个睡前故事。", scene: "爸爸讲故事" },
      { en: "Mum deer sings a soft song.", cn: "鹿妈妈唱了一首温柔的歌。", scene: "妈妈唱歌" },
      { en: "My little brother laughs.", cn: "我的小弟弟笑了起来。", scene: "弟弟笑" },
      { en: "I love my warm forest home.", cn: "我爱我温暖森林的家。", scene: "温馨的家" },
    ],
  },

  // ===================== G4（8岁 小学二年级） =====================
  {
    id: "pb-g4-1",
    grade: "G4",
    titleEn: "The Friendly Owl",
    titleCn: "友好的猫头鹰",
    coverEmoji: "🦉",
    coverColor: "sky",
    ageRange: "8岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g4-1/p1/Childrens_picture_book_illustr_2026-08-09T05-21-52.png",
      "/picture-books/pb-g4-1/p2/Childrens_picture_book_illustr_2026-08-09T05-22-30.png",
      "/picture-books/pb-g4-1/p3/Childrens_picture_book_illustr_2026-08-09T05-23-18.png",
      "/picture-books/pb-g4-1/p4/Childrens_picture_book_illustr_2026-08-09T05-24-27.png",
    ],
    pages: [
      { en: "Ollie the owl lives in the old tree.", cn: "猫头鹰 Ollie 住在老树上。", scene: "树上的猫头鹰" },
      { en: "He shares his stories at night.", cn: "夜里他会分享自己的故事。", scene: "夜晚讲故事" },
      { en: "The little mice listen quietly.", cn: "小老鼠们静静地听着。", scene: "听故事的老鼠" },
      { en: "Kindness makes new friends.", cn: "善良能带来新的朋友。", scene: "成为朋友" },
    ],
  },
  {
    id: "pb-g4-2",
    grade: "G4",
    titleEn: "Rainy Day Puddles",
    titleCn: "雨天的积水",
    coverEmoji: "🌧️",
    coverColor: "peach",
    ageRange: "8岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g4-2/p1/Childrens_picture_book_illustr_2026-08-09T05-25-13.png",
      "/picture-books/pb-g4-2/p2/Childrens_picture_book_illustr_2026-08-09T05-25-45.png",
      "/picture-books/pb-g4-2/p3/Childrens_picture_book_illustr_2026-08-09T05-26-17.png",
      "/picture-books/pb-g4-2/p4/Childrens_picture_book_illustr_2026-08-09T05-26-48.png",
    ],
    pages: [
      { en: "The rain falls on the leaves.", cn: "雨点落在叶子上。", scene: "雨打树叶" },
      { en: "A small puddle glows like a mirror.", cn: "一个小水洼像镜子一样发亮。", scene: "亮晶晶的水洼" },
      { en: "A frog hops in with a splash.", cn: "一只青蛙扑通跳了进去。", scene: "青蛙跳进水洼" },
      { en: "After rain, the forest smells fresh.", cn: "雨后，森林里散发着清新的味道。", scene: "清新森林" },
    ],
  },

  // ===================== G5（9岁 小学三年级） =====================
  {
    id: "pb-g5-1",
    grade: "G5",
    titleEn: "The Little Seed",
    titleCn: "小种子",
    coverEmoji: "🌱",
    coverColor: "green",
    ageRange: "9岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g5-1/p1/Childrens_picture_book_illustr_2026-08-09T05-27-22.png",
      "/picture-books/pb-g5-1/p2/Childrens_picture_book_illustr_2026-08-09T05-27-52.png",
      "/picture-books/pb-g5-1/p3/Childrens_picture_book_illustr_2026-08-09T05-28-22.png",
      "/picture-books/pb-g5-1/p4/Childrens_picture_book_illustr_2026-08-09T05-28-51.png",
    ],
    pages: [
      { en: "A tiny seed falls on the soil.", cn: "一粒小种子落在泥土上。", scene: "落下的种子" },
      { en: "Roots drink water from the earth.", cn: "根从泥土里喝到水分。", scene: "根吸水" },
      { en: "A green sprout reaches the light.", cn: "绿色的嫩芽伸向阳光。", scene: "嫩芽向阳" },
      { en: "With care, it grows into a tree.", cn: "用心照顾，它会长成一棵树。", scene: "长成大树" },
    ],
  },
  {
    id: "pb-g5-2",
    grade: "G5",
    titleEn: "Leo Helps Clean Up",
    titleCn: "小鹿帮忙打扫",
    coverEmoji: "🧹",
    coverColor: "yellow",
    ageRange: "9岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g5-2/p1/Childrens_picture_book_illustr_2026-08-09T05-29-22.png",
      "/picture-books/pb-g5-2/p2/Childrens_picture_book_illustr_2026-08-09T05-29-53.png",
      "/picture-books/pb-g5-2/p3/Childrens_picture_book_illustr_2026-08-09T05-30-23.png",
      "/picture-books/pb-g5-2/p4/Childrens_picture_book_illustr_2026-08-09T05-30-53.png",
    ],
    pages: [
      { en: "The picnic left crumbs on the grass.", cn: "野餐后草地上留下了碎屑。", scene: "草地上的碎屑" },
      { en: "Leo picks up every piece.", cn: "Leo 把每一片都捡起来。", scene: "捡垃圾" },
      { en: "Mimi waters the small flowers.", cn: "Mimi 给小花浇了水。", scene: "浇花" },
      { en: "A clean forest is a happy home.", cn: "干净的森林才是幸福的家。", scene: "整洁的森林" },
    ],
  },

  // ===================== G6（10岁 小学四年级） =====================
  {
    id: "pb-g6-1",
    grade: "G6",
    titleEn: "The Brave Little Rabbit",
    titleCn: "勇敢的小兔",
    coverEmoji: "🐇",
    coverColor: "coral",
    ageRange: "10岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g6-1/p1/Childrens_picture_book_illustr_2026-08-09T05-31-23.png",
      "/picture-books/pb-g6-1/p2/Childrens_picture_book_illustr_2026-08-09T05-31-55.png",
      "/picture-books/pb-g6-1/p3/Childrens_picture_book_illustr_2026-08-09T05-32-27.png",
      "/picture-books/pb-g6-1/p4/Childrens_picture_book_illustr_2026-08-09T05-32-59.png",
    ],
    pages: [
      { en: "A storm shakes the tall oak.", cn: "一场暴风雨摇晃着高大的橡树。", scene: "暴风中的橡树" },
      { en: "The little rabbit feels afraid.", cn: "小兔子感到害怕。", scene: "害怕的小兔" },
      { en: "She holds her brother's paw.", cn: "她握住弟弟的爪子。", scene: "牵手" },
      { en: "Together they are not so scared.", cn: "在一起，他们就没那么害怕了。", scene: "彼此依靠" },
    ],
  },
  // ===================== G1（第3本） =====================
  {
    id: "pb-g1-3",
    grade: "G1",
    titleEn: "Puppy Eats Lunch",
    titleCn: "小狗吃午餐",
    coverEmoji: "🍎",
    coverColor: "mint",
    ageRange: "3–4岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g1-3/page1-apple.png",
      "/picture-books/pb-g1-3/page2-banana.png",
      "/picture-books/pb-g1-3/page3-milk.png",
      "/picture-books/pb-g1-3/page4-happy.png",
    ],
    pages: [
      { en: "Today I eat a red apple.", cn: "今天我吃了一个红苹果。", scene: "红苹果" },
      { en: "Mom gives me a yellow banana.", cn: "妈妈给了我一根黄香蕉。", scene: "黄香蕉" },
      { en: "I drink a cup of white milk.", cn: "我喝了一杯白牛奶。", scene: "喝牛奶" },
      { en: "Yummy! I am full and happy.", cn: "好吃！我吃饱了，很开心。", scene: "开心满足" },
    ],
  },

  // ===================== G2（第3本） =====================
  {
    id: "pb-g2-3",
    grade: "G2",
    titleEn: "The Rainy Day",
    titleCn: "下雨天",
    coverEmoji: "🌧️",
    coverColor: "leaf",
    ageRange: "5–6岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g2-3/page1.png",
      "/picture-books/pb-g2-3/page2.png",
      "/picture-books/pb-g2-3/page3.png",
      "/picture-books/pb-g2-3/page4.png",
    ],
    pages: [
      { en: "It is raining outside.", cn: "外面下着雨。", scene: "窗外下雨" },
      { en: "The cat wears a blue raincoat.", cn: "小猫穿上了蓝色雨衣。", scene: "蓝雨衣" },
      { en: "The rabbit holds a big umbrella.", cn: "小兔撑着一把大雨伞。", scene: "大雨伞" },
      { en: "We jump in puddles together!", cn: "我们一起在水坑里跳！", scene: "踩水坑" },
    ],
  },

  // ===================== G3（第3本） =====================
  {
    id: "pb-g3-3",
    grade: "G3",
    titleEn: "A New Friend",
    titleCn: "新朋友",
    coverEmoji: "🐦",
    coverColor: "sun",
    ageRange: "7岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g3-3/page1.png",
      "/picture-books/pb-g3-3/page2.png",
      "/picture-books/pb-g3-3/page3.png",
      "/picture-books/pb-g3-3/page4.png",
    ],
    pages: [
      { en: "A new bird comes to the forest today.", cn: "今天森林里来了一只新小鸟。", scene: "新小鸟" },
      { en: "She is shy and sits on a tree alone.", cn: "她很害羞，独自坐在树上。", scene: "害羞独坐" },
      { en: 'The puppy says, "Come play with us!"', cn: "小狗说：「来跟我们一起玩吧！」", scene: "小狗邀请" },
      { en: "Now we have a new best friend in the forest.", cn: "现在我们森林里又多了一个好朋友。", scene: "森林好朋友" },
    ],
  },

  // ===================== G4（第3本） =====================
  {
    id: "pb-g4-3",
    grade: "G4",
    titleEn: "The Brave Rabbit",
    titleCn: "勇敢的小兔",
    coverEmoji: "🐰",
    coverColor: "sky",
    ageRange: "8岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g4-3/page1.png",
      "/picture-books/pb-g4-3/page2.png",
      "/picture-books/pb-g4-3/page3.png",
      "/picture-books/pb-g4-3/page4.png",
    ],
    pages: [
      { en: "The rabbit is afraid of the dark forest at night.", cn: "小兔害怕夜晚的黑暗森林。", scene: "黑暗森林" },
      { en: 'Her friend the deer says, "I will walk with you."', cn: "她的朋友小鹿说：「我陪你走。」", scene: "小鹿陪伴" },
      { en: "They walk slowly under the moonlight.", cn: "她们在月光下慢慢走。", scene: "月光下散步" },
      { en: '"The night is not scary with a friend," says the rabbit.', cn: "小兔说：「有朋友陪着，黑夜也不怕了。」", scene: "不再害怕" },
    ],
  },

  // ===================== G5（第3本） =====================
  {
    id: "pb-g5-3",
    grade: "G5",
    titleEn: "The Garden Project",
    titleCn: "种植计划",
    coverEmoji: "🌱",
    coverColor: "lilac",
    ageRange: "9岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g5-3/page1.png",
      "/picture-books/pb-g5-3/page2.png",
      "/picture-books/pb-g5-3/page3.png",
      "/picture-books/pb-g5-3/page4.png",
    ],
    pages: [
      { en: "The bear wants to grow tomatoes in the garden.", cn: "小熊想在花园里种番茄。", scene: "花园种番茄" },
      { en: "He digs the soil and plants the seeds carefully.", cn: "他挖土、小心地埋下种子。", scene: "埋种子" },
      { en: "Every day he waters them and waits.", cn: "他每天浇水，耐心等待。", scene: "浇水等待" },
      { en: "After two weeks, green sprouts appear!", cn: "两周后，绿色的嫩芽冒出来了！", scene: "嫩芽冒出" },
    ],
  },

  // ===================== G6（第3本） =====================
  {
    id: "pb-g6-3",
    grade: "G6",
    titleEn: "The Lost Key",
    titleCn: "丢失的钥匙",
    coverEmoji: "🔑",
    coverColor: "peach",
    ageRange: "10岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g6-3/page1.png",
      "/picture-books/pb-g6-3/page2.png",
      "/picture-books/pb-g6-3/page3.png",
      "/picture-books/pb-g6-3/page4.png",
    ],
    pages: [
      { en: "The fox cannot find the key to the treehouse.", cn: "小狐找不到树屋的钥匙了。", scene: "找不到钥匙" },
      { en: "She looks under the rocks and behind the flowers.", cn: "她在石头下、花丛后面找。", scene: "到处寻找" },
      { en: 'The squirrel says, "I saw it near the big oak tree!"', cn: "松鼠说：「我在大橡树旁边见过！」", scene: "松鼠提醒" },
      { en: 'The fox finds the key and says, "Thank you, friend!"', cn: "小狐找到了钥匙说：「谢谢你，朋友！」", scene: "找到钥匙" },
    ],
  },

  // ===================== G7（第3本） =====================
  {
    id: "pb-g7-3",
    grade: "G7",
    titleEn: "Forest Race",
    titleCn: "森林大比赛",
    coverEmoji: "🏃",
    coverColor: "blue",
    ageRange: "11岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g7-3/page1.png",
      "/picture-books/pb-g7-3/page2.png",
      "/picture-books/pb-g7-3/page3.png",
      "/picture-books/pb-g7-3/page4.png",
    ],
    pages: [
      { en: "The animals plan a big race through the forest.", cn: "动物们策划了一场穿越森林的大比赛。", scene: "策划比赛" },
      { en: "The deer runs fast, but the turtle walks slowly.", cn: "小鹿跑得很快，小龟却走得很慢。", scene: "鹿快龟慢" },
      { en: "The turtle never stops and keeps going forward.", cn: "小龟一刻不停，一直往前走。", scene: "坚持不懈" },
      { en: "In the end, everyone cheers for each other.", cn: "最后，大家为彼此鼓掌欢呼。", scene: "鼓掌欢呼" },
    ],
  },

  // ===================== G8（第3本） =====================
  {
    id: "pb-g8-3",
    grade: "G8",
    titleEn: "The Time Capsule",
    titleCn: "时间胶囊",
    coverEmoji: "💌",
    coverColor: "rose",
    ageRange: "12岁",
    sourceNote: SOURCE,
    illustrations: [
      "/picture-books/pb-g8-3/page1.png",
      "/picture-books/pb-g8-3/page2.png",
      "/picture-books/pb-g8-3/page3.png",
      "/picture-books/pb-g8-3/page4.png",
    ],
    pages: [
      { en: "Before leaving for middle school, the puppy writes a letter.", cn: "升学前，小狗写了一封信。", scene: "写信" },
      { en: "She writes about her favorite days in the forest.", cn: "她写了在森林里最难忘的日子。", scene: "回忆美好" },
      { en: "She puts the letter in a box and buries it under the old tree.", cn: "她把信放进盒子，埋在那棵老树下。", scene: "埋下盒子" },
      { en: '"One day I will come back and open it," she says with a smile.', cn: "她笑着说：「总有一天我会回来打开它。」", scene: "微笑期许" },
    ],
  },
];

export const bookGrades = [
  { id: "G1", label: "G1", age: "3–4岁", school: "幼儿启蒙" },
  { id: "G2", label: "G2", age: "5–6岁", school: "幼小衔接" },
  { id: "G3", label: "G3", age: "7岁", school: "小学一年级" },
  { id: "G4", label: "G4", age: "8岁", school: "小学二年级" },
  { id: "G5", label: "G5", age: "9岁", school: "小学三年级" },
  { id: "G6", label: "G6", age: "10岁", school: "小学四年级" },
  { id: "G7", label: "G7", age: "11岁", school: "小学五年级" },
  { id: "G8", label: "G8", age: "12岁", school: "小学六年级" },
];

export function getBooksByGrade(grade: string): PictureBook[] {
  return pictureBooks.filter((book) => book.grade === grade);
}

export function getBookById(id: string): PictureBook | undefined {
  return pictureBooks.find((book) => book.id === id);
}
