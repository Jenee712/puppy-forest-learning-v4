export type WordTrainCard = { id: string; word: string; meaning: string; icon: string };

type WordSeed = [word: string, meaning: string, icon: string];

const seeds: Record<string, WordSeed[]> = {
  G1: [
    ["cat","小猫","🐱"],["dog","小狗","🐶"],["sun","太阳","☀️"],["ball","球","⚽"],["fish","鱼","🐟"],["tree","树","🌳"],["book","书","📖"],["car","汽车","🚗"],
    ["apple","苹果","🍎"],["bird","小鸟","🐦"],["moon","月亮","🌙"],["star","星星","⭐"],["flower","花","🌼"],["house","房子","🏠"],["train","火车","🚂"],["rabbit","兔子","🐰"],
    ["red","红色","🔴"],["blue","蓝色","🔵"],["one","一","1️⃣"],["two","二","2️⃣"],["hand","手","✋"],["eye","眼睛","👁️"],["milk","牛奶","🥛"],["cake","蛋糕","🍰"],
  ],
  G2: [
    ["apple","苹果","🍎"],["rabbit","兔子","🐰"],["flower","花","🌼"],["train","火车","🚂"],["water","水","💧"],["house","房子","🏠"],["happy","开心的","😊"],["green","绿色","🟢"],
    ["orange","橙子","🍊"],["turtle","乌龟","🐢"],["cloud","云","☁️"],["plane","飞机","✈️"],["chair","椅子","🪑"],["pencil","铅笔","✏️"],["bread","面包","🍞"],["juice","果汁","🧃"],
    ["small","小的","🐭"],["big","大的","🐘"],["run","跑","🏃"],["jump","跳","🦘"],["smile","微笑","😄"],["family","家庭","👨‍👩‍👧"],["school","学校","🏫"],["friend","朋友","🧒"],
  ],
  G3: [
    ["family","家庭","👨‍👩‍👧"],["school","学校","🏫"],["teacher","老师","👩‍🏫"],["friend","朋友","🧒"],["morning","早晨","🌅"],["yellow","黄色","🟡"],["pencil","铅笔","✏️"],["window","窗户","🪟"],
    ["afternoon","下午","🌤️"],["classroom","教室","🧑‍🏫"],["mother","妈妈","👩"],["father","爸爸","👨"],["brother","兄弟","👦"],["sister","姐妹","👧"],["garden","花园","🌷"],["kitchen","厨房","🍳"],
    ["read","阅读","📚"],["write","书写","✍️"],["listen","听","👂"],["speak","说","🗣️"],["under","在……下面","⬇️"],["behind","在……后面","↩️"],["today","今天","📅"],["together","一起","🤝"],
  ],
  G4: [
    ["weather","天气","🌦️"],["library","图书馆","📚"],["breakfast","早餐","🥣"],["usually","通常","🔁"],["between","在……之间","↔️"],["healthy","健康的","🍎"],["answer","回答；答案","💬"],["picture","图片","🖼️"],
    ["weekend","周末","🗓️"],["dinner","晚餐","🍽️"],["exercise","锻炼","🏃"],["hospital","医院","🏥"],["market","市场","🛒"],["season","季节","🍂"],["spring","春天","🌱"],["winter","冬天","❄️"],
    ["before","在……之前","⏮️"],["after","在……之后","⏭️"],["sometimes","有时","🕰️"],["always","总是","♾️"],["invite","邀请","💌"],["arrive","到达","📍"],["borrow","借入","📖"],["return","归还；返回","↪️"],
  ],
  G5: [
    ["important","重要的","⭐"],["different","不同的","🔀"],["because","因为","💡"],["practice","练习","✍️"],["careful","小心的","🔎"],["problem","问题","❓"],["travel","旅行","✈️"],["museum","博物馆","🏛️"],
    ["future","未来","🔭"],["message","信息","💬"],["country","国家","🌏"],["language","语言","🗣️"],["festival","节日","🎉"],["delicious","美味的","😋"],["excited","兴奋的","🤩"],["friendly","友好的","🤝"],
    ["choose","选择","✅"],["explain","解释","📝"],["remember","记得","🧠"],["forget","忘记","💭"],["during","在……期间","⌛"],["without","没有；不带","🚫"],["already","已经","✔️"],["perhaps","也许","🤔"],
  ],
  G6: [
    ["environment","环境","🌍"],["protect","保护","🛡️"],["describe","描述","📝"],["possible","可能的","🌟"],["instead","代替；反而","🔄"],["collect","收集","🧺"],["decision","决定","🛤️"],["culture","文化","🏮"],
    ["natural","自然的","🌿"],["energy","能源；精力","⚡"],["recycle","回收利用","♻️"],["community","社区","🏘️"],["history","历史","📜"],["invent","发明","💡"],["discover","发现","🔭"],["research","研究","🔬"],
    ["continue","继续","▶️"],["suggest","建议","💬"],["agree","同意","👍"],["refuse","拒绝","🙅"],["unless","除非","⚠️"],["however","然而","↔️"],["therefore","因此","➡️"],["especially","尤其","✨"],
  ],
  G7: [
    ["communicate","交流","🗣️"],["experience","经历；经验","🧭"],["improve","提高","📈"],["challenge","挑战","🏔️"],["although","虽然","🌦️"],["compare","比较","⚖️"],["prepare","准备","🎒"],["responsible","负责任的","🤝"],
    ["technology","科技","💻"],["information","信息","ℹ️"],["education","教育","🎓"],["volunteer","志愿者","🙋"],["tradition","传统","🏮"],["creative","有创造力的","🎨"],["confident","自信的","💪"],["patient","有耐心的","🌱"],
    ["achieve","实现","🏆"],["consider","考虑","🤔"],["develop","发展","🌿"],["organize","组织","🗂️"],["advantage","优点","➕"],["disadvantage","缺点","➖"],["relationship","关系","🔗"],["attention","注意力","👀"],
  ],
  G8: [
    ["conclusion","结论","✅"],["evidence","证据","🔍"],["influence","影响","🌊"],["independent","独立的","🕊️"],["perspective","观点；角度","👀"],["solution","解决办法","🧩"],["achievement","成就","🏆"],["opportunity","机会","🚪"],
    ["argument","论点；争论","💬"],["resource","资源","📦"],["society","社会","🏙️"],["knowledge","知识","📚"],["behavior","行为","🚶"],["method","方法","🛠️"],["purpose","目的","🎯"],["result","结果","📊"],
    ["analyze","分析","🔬"],["evaluate","评价","📋"],["support","支持","🤝"],["represent","代表","🏳️"],["according","根据","📖"],["otherwise","否则","↪️"],["effective","有效的","⚙️"],["necessary","必要的","❗"],
  ],
};

function toCard([word, meaning, icon]: WordSeed): WordTrainCard {
  return { id: word.toLowerCase().replace(/[^a-z0-9]+/g, "-"), word, meaning, icon };
}

export function getWordTrainBank(grade: string): WordTrainCard[] {
  return (seeds[grade] ?? seeds.G3).map(toCard);
}

export function getDailyWordTrainWords(grade: string, day: number, count = 8): WordTrainCard[] {
  const bank = getWordTrainBank(grade);
  const safeDay = Math.max(1, Math.min(90, Math.round(day) || 1));
  const start = ((safeDay - 1) * 5) % bank.length;
  return Array.from({ length: Math.min(count, bank.length) }, (_, index) => bank[(start + index) % bank.length]);
}
