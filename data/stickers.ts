// 贴纸数据模型：编号、分类、价格、稀有度
// 全部为「小狗的森林学堂」原创设计，用 emoji + CSS 呈现
// 后续可替换为透明背景真实贴纸图片

export type StickerRarity = "common" | "rare" | "legendary";
export type StickerCategory = "nature" | "animals" | "food" | "reward" | "creative" | "limited";

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  category: StickerCategory;
  rarity: StickerRarity;
  price: number;
  bgColor: string; // CSS gradient background
  description: string;
}

export const RARITY_LABELS: Record<StickerRarity, string> = {
  common: "普通",
  rare: "稀有",
  legendary: "传奇",
};

export const RARITY_COLORS: Record<StickerRarity, string> = {
  common: "#a8c97e",
  rare: "#7eb8da",
  legendary: "#e8b44f",
};

export const CATEGORY_LABELS: Record<StickerCategory, string> = {
  nature: "🌿 自然森林",
  animals: "🐾 动物朋友",
  food: "🍎 美味食物",
  reward: "⭐ 荣誉奖章",
  creative: "🎨 创意世界",
  limited: "❤️ 限定珍藏",
};

export const CATEGORY_ICONS: Record<StickerCategory, string> = {
  nature: "🌿",
  animals: "🐾",
  food: "🍎",
  reward: "⭐",
  creative: "🎨",
  limited: "❤️",
};

export const allStickers: Sticker[] = [
  // ===== 🌿 自然森林 =====
  { id: "st-nat-01", emoji: "🌸", name: "樱花", category: "nature", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #fce4ec, #f48fb1)", description: "春天的第一朵樱花，带来温暖的讯息。" },
  { id: "st-nat-02", emoji: "🍀", name: "四叶草", category: "nature", rarity: "rare", price: 60, bgColor: "linear-gradient(135deg, #e8f5e9, #81c784)", description: "幸运的四叶草，据说能找到它的人会有好运。" },
  { id: "st-nat-03", emoji: "🌻", name: "向日葵", category: "nature", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #fff9c4, #ffd54f)", description: "永远朝着太阳的向日葵，充满正能量。" },
  { id: "st-nat-04", emoji: "🍂", name: "秋叶", category: "nature", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #fff3e0, #ffb74d)", description: "秋天飘落的一片红叶，记录着季节的故事。" },
  { id: "st-nat-05", emoji: "🌙", name: "月亮", category: "nature", rarity: "rare", price: 50, bgColor: "linear-gradient(135deg, #e8eaf6, #7986cb)", description: "夜空中安静的月亮，守护着每一个梦。" },
  { id: "st-nat-06", emoji: "🌈", name: "彩虹", category: "nature", rarity: "legendary", price: 300, bgColor: "linear-gradient(135deg, #ffcdd2, #b3e5fc, #c8e6c9, #fff9c4, #e1bee7)", description: "雨后天晴的彩虹，是大自然最美的画。" },
  { id: "st-nat-07", emoji: "🌲", name: "森林大树", category: "nature", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #e8f5e9, #66bb6a)", description: "森林里的大树，是动物们的家。" },
  { id: "st-nat-08", emoji: "⭐", name: "闪亮星星", category: "nature", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #fff8e1, #ffd54f)", description: "夜空中闪闪发亮的星星。" },

  // ===== 🐾 动物朋友 =====
  { id: "st-ani-01", emoji: "🐶", name: "小狗 Leo", category: "animals", rarity: "common", price: 20, bgColor: "linear-gradient(135deg, #fff3e0, #ffcc80)", description: "森林学堂最可爱的小狗 Leo，勇敢又善良。" },
  { id: "st-ani-02", emoji: "🐱", name: "小猫 Mimi", category: "animals", rarity: "common", price: 20, bgColor: "linear-gradient(135deg, #f3e5f5, #ce93d8)", description: "聪明的 Mimi，总能用爪子解决难题。" },
  { id: "st-ani-03", emoji: "🐰", name: "小兔白白", category: "animals", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #fce4ec, #f8bbd0)", description: "温柔的小兔子，最爱胡萝卜和花朵。" },
  { id: "st-ani-04", emoji: "🦊", name: "狐狸奶奶", category: "animals", rarity: "rare", price: 70, bgColor: "linear-gradient(135deg, #fff3e0, #ff8a65)", description: "聪明的狐狸奶奶，会讲最动听的故事。" },
  { id: "st-ani-05", emoji: "🐿️", name: "小松鼠", category: "animals", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #efebe9, #a1887f)", description: "爱吃橡果的小松鼠，动作敏捷又可爱。" },
  { id: "st-ani-06", emoji: "🦉", name: "猫头鹰 Ollie", category: "animals", rarity: "rare", price: 60, bgColor: "linear-gradient(135deg, #e8eaf6, #9fa8da)", description: "住在老树上的猫头鹰老师，夜里分享智慧。" },
  { id: "st-ani-07", emoji: "🦋", name: "蓝蝴蝶", category: "animals", rarity: "rare", price: 55, bgColor: "linear-gradient(135deg, #e3f2fd, #64b5f6)", description: "在花丛间翩翩起舞的蓝蝴蝶。" },
  { id: "st-ani-08", emoji: "🐸", name: "小青蛙", category: "animals", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #e8f5e9, #81c784)", description: "雨后喜欢在水洼里蹦跳的小青蛙。" },

  // ===== 🍎 美味食物 =====
  { id: "st-fod-01", emoji: "🍎", name: "红苹果", category: "food", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #ffebee, #ef5350)", description: "树上摘下的新鲜红苹果，又脆又甜。" },
  { id: "st-fod-02", emoji: "🍰", name: "草莓蛋糕", category: "food", rarity: "rare", price: 80, bgColor: "linear-gradient(135deg, #fce4ec, #f06292)", description: "奶油草莓蛋糕，是生日时才有的惊喜。" },
  { id: "st-fod-03", emoji: "🍦", name: "冰淇淋", category: "food", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #e3f2fd, #90caf9)", description: "夏天的冰淇淋，融化在舌尖的快乐。" },
  { id: "st-fod-04", emoji: "🍯", name: "蜂蜜罐", category: "food", rarity: "rare", price: 50, bgColor: "linear-gradient(135deg, #fff8e1, #ffb300)", description: "小熊最爱的蜂蜜，金灿灿甜滋滋。" },
  { id: "st-fod-05", emoji: "🍇", name: "紫葡萄", category: "food", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #f3e5f5, #ab47bc)", description: "一串串紫色的葡萄，晶莹剔透。" },
  { id: "st-fod-06", emoji: "🎂", name: "生日蛋糕", category: "food", rarity: "legendary", price: 250, bgColor: "linear-gradient(135deg, #fce4ec, #f48fb1, #fff9c4)", description: "插满蜡烛的生日蛋糕，许个愿望吧！" },

  // ===== ⭐ 荣誉奖章 =====
  { id: "st-rew-01", emoji: "🏆", name: "冠军奖杯", category: "reward", rarity: "legendary", price: 400, bgColor: "linear-gradient(135deg, #fff8e1, #ffd700)", description: "努力学习才能得到的冠军奖杯！" },
  { id: "st-rew-02", emoji: "🎖️", name: "荣誉勋章", category: "reward", rarity: "rare", price: 100, bgColor: "linear-gradient(135deg, #fff3e0, #ffa726)", description: "表现优秀的同学可以获得这枚勋章。" },
  { id: "st-rew-03", emoji: "📜", name: "学习证书", category: "reward", rarity: "rare", price: 80, bgColor: "linear-gradient(135deg, #f3e5f5, #ba68c8)", description: "完成了整个单元的学习，值得纪念！" },
  { id: "st-rew-04", emoji: "👑", name: "皇冠", category: "reward", rarity: "legendary", price: 500, bgColor: "linear-gradient(135deg, #fff8e1, #ffd700, #ff8f00)", description: "只有最努力的孩子才能戴上这顶皇冠。" },
  { id: "st-rew-05", emoji: "💎", name: "钻石", category: "reward", rarity: "legendary", price: 350, bgColor: "linear-gradient(135deg, #e3f2fd, #42a5f5, #90caf9)", description: "闪闪发光的钻石，代表着永恒的坚持。" },
  { id: "st-rew-06", emoji: "🌟", name: "闪耀之星", category: "reward", rarity: "common", price: 30, bgColor: "linear-gradient(135deg, #fff8e1, #ffee58)", description: "完成每日学习获得的闪耀之星。" },

  // ===== 🎨 创意世界 =====
  { id: "st-cre-01", emoji: "🎨", name: "调色板", category: "creative", rarity: "common", price: 10, bgColor: "linear-gradient(135deg, #ffcdd2, #c8e6c9, #bbdefb)", description: "五颜六色的调色板，画出心中的世界。" },
  { id: "st-cre-02", emoji: "🎵", name: "音符", category: "creative", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #f3e5f5, #9fa8da)", description: "跳动的音符，谱写出动听的旋律。" },
  { id: "st-cre-03", emoji: "📚", name: "魔法书", category: "creative", rarity: "rare", price: 65, bgColor: "linear-gradient(135deg, #e8eaf6, #5c6bc0)", description: "一本蕴含无穷知识的魔法书。" },
  { id: "st-cre-04", emoji: "🚀", name: "火箭", category: "creative", rarity: "rare", price: 90, bgColor: "linear-gradient(135deg, #e3f2fd, #1e88e5)", description: "飞向太空的火箭，探索未知的世界！" },
  { id: "st-cre-05", emoji: "🎭", name: "戏剧面具", category: "creative", rarity: "common", price: 15, bgColor: "linear-gradient(135deg, #fce4ec, #9575cd)", description: "一面是笑一面是泪的戏剧面具。" },
  { id: "st-cre-06", emoji: "🏰", name: "童话城堡", category: "creative", rarity: "legendary", price: 280, bgColor: "linear-gradient(135deg, #f3e5f5, #ce93d8, #81d4fa)", description: "云朵上的童话城堡，每一个孩子都想去看看。" },

  // ===== ❤️ 限定珍藏 =====
  { id: "st-ltd-01", emoji: "🎃", name: "万圣南瓜", category: "limited", rarity: "rare", price: 120, bgColor: "linear-gradient(135deg, #fff3e0, #ff7043)", description: "万圣节限定的南瓜灯，一年只有一次机会！" },
  { id: "st-ltd-02", emoji: "🎄", name: "圣诞树", category: "limited", rarity: "legendary", price: 350, bgColor: "linear-gradient(135deg, #e8f5e9, #ef5350, #ffb300)", description: "圣诞节限定的圣诞树，挂满了彩灯和礼物。" },
  { id: "st-ltd-03", emoji: "🧧", name: "红包", category: "limited", rarity: "rare", price: 100, bgColor: "linear-gradient(135deg, #ffebee, #e53935)", description: "春节限定红包，装着满满的祝福！" },
  { id: "st-ltd-04", emoji: "🐉", name: "小龙", category: "limited", rarity: "legendary", price: 380, bgColor: "linear-gradient(135deg, #fce4ec, #e53935, #ffb300)", description: "龙年限定的金色小龙，带来一整年的好运。" },
];

export function getStickersByCategory(category: StickerCategory | "all"): Sticker[] {
  if (category === "all") return allStickers;
  return allStickers.filter((s) => s.category === category);
}

export function getStickersByRarity(rarity: StickerRarity | "all"): Sticker[] {
  if (rarity === "all") return allStickers;
  return allStickers.filter((s) => s.rarity === rarity);
}
