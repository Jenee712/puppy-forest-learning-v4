"use client";

import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { playTts, stopTts } from "@/lib/tts/playTts";

type WordCard = { id: string; word: string; meaning: string; icon: string };

const WORDS: Record<string, WordCard[]> = {
  G1: [
    { id: "cat", word: "cat", meaning: "小猫", icon: "🐱" }, { id: "dog", word: "dog", meaning: "小狗", icon: "🐶" },
    { id: "sun", word: "sun", meaning: "太阳", icon: "☀️" }, { id: "ball", word: "ball", meaning: "球", icon: "⚽" },
    { id: "fish", word: "fish", meaning: "鱼", icon: "🐟" }, { id: "tree", word: "tree", meaning: "树", icon: "🌳" },
    { id: "book", word: "book", meaning: "书", icon: "📖" }, { id: "car", word: "car", meaning: "汽车", icon: "🚗" },
  ],
  G2: [
    { id: "apple", word: "apple", meaning: "苹果", icon: "🍎" }, { id: "rabbit", word: "rabbit", meaning: "兔子", icon: "🐰" },
    { id: "flower", word: "flower", meaning: "花", icon: "🌼" }, { id: "train", word: "train", meaning: "火车", icon: "🚂" },
    { id: "water", word: "water", meaning: "水", icon: "💧" }, { id: "house", word: "house", meaning: "房子", icon: "🏠" },
    { id: "happy", word: "happy", meaning: "开心的", icon: "😊" }, { id: "green", word: "green", meaning: "绿色", icon: "🟢" },
  ],
  G3: [
    { id: "family", word: "family", meaning: "家庭", icon: "👨‍👩‍👧" }, { id: "school", word: "school", meaning: "学校", icon: "🏫" },
    { id: "teacher", word: "teacher", meaning: "老师", icon: "👩‍🏫" }, { id: "friend", word: "friend", meaning: "朋友", icon: "🧒" },
    { id: "morning", word: "morning", meaning: "早晨", icon: "🌅" }, { id: "yellow", word: "yellow", meaning: "黄色", icon: "🟡" },
    { id: "pencil", word: "pencil", meaning: "铅笔", icon: "✏️" }, { id: "window", word: "window", meaning: "窗户", icon: "🪟" },
  ],
  G4: [
    { id: "weather", word: "weather", meaning: "天气", icon: "🌦️" }, { id: "library", word: "library", meaning: "图书馆", icon: "📚" },
    { id: "breakfast", word: "breakfast", meaning: "早餐", icon: "🥣" }, { id: "usually", word: "usually", meaning: "通常", icon: "🔁" },
    { id: "between", word: "between", meaning: "在……之间", icon: "↔️" }, { id: "healthy", word: "healthy", meaning: "健康的", icon: "🍎" },
    { id: "answer", word: "answer", meaning: "回答；答案", icon: "💬" }, { id: "picture", word: "picture", meaning: "图片", icon: "🖼️" },
  ],
  G5: [
    { id: "important", word: "important", meaning: "重要的", icon: "⭐" }, { id: "different", word: "different", meaning: "不同的", icon: "🔀" },
    { id: "because", word: "because", meaning: "因为", icon: "💡" }, { id: "practice", word: "practice", meaning: "练习", icon: "✍️" },
    { id: "careful", word: "careful", meaning: "小心的", icon: "🔎" }, { id: "problem", word: "problem", meaning: "问题", icon: "❓" },
    { id: "travel", word: "travel", meaning: "旅行", icon: "✈️" }, { id: "museum", word: "museum", meaning: "博物馆", icon: "🏛️" },
  ],
  G6: [
    { id: "environment", word: "environment", meaning: "环境", icon: "🌍" }, { id: "protect", word: "protect", meaning: "保护", icon: "🛡️" },
    { id: "describe", word: "describe", meaning: "描述", icon: "📝" }, { id: "possible", word: "possible", meaning: "可能的", icon: "🌟" },
    { id: "instead", word: "instead", meaning: "代替；反而", icon: "🔄" }, { id: "collect", word: "collect", meaning: "收集", icon: "🧺" },
    { id: "decision", word: "decision", meaning: "决定", icon: "🛤️" }, { id: "culture", word: "culture", meaning: "文化", icon: "🏮" },
  ],
  G7: [
    { id: "communicate", word: "communicate", meaning: "交流", icon: "🗣️" }, { id: "experience", word: "experience", meaning: "经历；经验", icon: "🧭" },
    { id: "improve", word: "improve", meaning: "提高", icon: "📈" }, { id: "challenge", word: "challenge", meaning: "挑战", icon: "🏔️" },
    { id: "although", word: "although", meaning: "虽然", icon: "🌦️" }, { id: "compare", word: "compare", meaning: "比较", icon: "⚖️" },
    { id: "prepare", word: "prepare", meaning: "准备", icon: "🎒" }, { id: "responsible", word: "responsible", meaning: "负责任的", icon: "🤝" },
  ],
  G8: [
    { id: "conclusion", word: "conclusion", meaning: "结论", icon: "✅" }, { id: "evidence", word: "evidence", meaning: "证据", icon: "🔍" },
    { id: "influence", word: "influence", meaning: "影响", icon: "🌊" }, { id: "independent", word: "independent", meaning: "独立的", icon: "🕊️" },
    { id: "perspective", word: "perspective", meaning: "观点；角度", icon: "👀" }, { id: "solution", word: "solution", meaning: "解决办法", icon: "🧩" },
    { id: "achievement", word: "achievement", meaning: "成就", icon: "🏆" }, { id: "opportunity", word: "opportunity", meaning: "机会", icon: "🚪" },
  ],
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getRate(grade: string) {
  const number = Number(grade.slice(1));
  return number <= 2 ? .75 : number <= 4 ? .85 : number <= 6 ? .9 : .95;
}

export default function WordTrainGame({ grade, coins, onReward }: { grade: string; coins: number; onReward: (amount: number) => void }) {
  const words = WORDS[grade] ?? WORDS.G3;
  const [round, setRound] = useState(0);
  const [choices, setChoices] = useState<WordCard[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong" | "finished">("playing");
  const [mastered, setMastered] = useState<string[]>([]);
  const [trainWords, setTrainWords] = useState<WordCard[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const speechRun = useRef(0);
  const target = words[round] ?? words[0];
  const rewardKey = `puppy-word-train-mastered-${grade}`;

  useEffect(() => {
    try { setMastered(JSON.parse(window.localStorage.getItem(rewardKey) ?? "[]") as string[]); } catch { setMastered([]); }
  }, [rewardKey]);

  useEffect(() => () => { speechRun.current += 1; stopTts(); }, []);

  useEffect(() => {
    if (!target) return;
    const distractors = shuffle(words.filter((item) => item.id !== target.id)).slice(0, 2);
    setChoices(shuffle([target, ...distractors]));
    setStatus("playing");
  }, [round, grade, target, words]);

  const answer = (card: WordCard) => {
    if (status === "correct" || status === "finished") return;
    if (card.id !== target.id) { setStatus("wrong"); return; }
    const nextTrain = [...trainWords, target];
    setTrainWords(nextTrain);
    setStatus(round === words.length - 1 ? "finished" : "correct");
    if (!mastered.includes(target.id)) {
      const nextMastered = [...mastered, target.id];
      setMastered(nextMastered);
      onReward(1);
      try { window.localStorage.setItem(rewardKey, JSON.stringify(nextMastered)); } catch { /* ignore */ }
    }
  };

  const nextRound = () => setRound((current) => Math.min(words.length - 1, current + 1));
  const restart = () => { setRound(0); setTrainWords([]); setStatus("playing"); };
  const speakBilingual = async (card: WordCard) => {
    const run = speechRun.current + 1; speechRun.current = run; setSpeakingId(card.id);
    try {
      await playTts(card.word, { language: "en", segment: "word", playbackRate: getRate(grade) });
      if (speechRun.current !== run) return;
      const cleanMeaning = card.meaning.replace(/[，。！？；：、“”‘’…·—]/g, " ").replace(/\s+/g, " ").trim();
      await playTts(cleanMeaning, { language: "zh", segment: "word", playbackRate: 1 });
    } catch { /* 保留游戏操作，不让临时语音错误打断孩子 */ }
    finally { if (speechRun.current === run) setSpeakingId(null); }
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const card = choices.find((item) => item.id === event.dataTransfer.getData("text/plain"));
    if (card) answer(card);
  };

  return (
    <section className="page-surface word-train-page">
      <header className="word-train-header">
        <div><span className="section-kicker">森林游戏站 · {grade}</span><h1>单词小火车</h1><p>看提示，把正确的英文车厢送到小火车后面。</p></div>
        <div className="word-train-wallet"><span>🪙</span><strong>{coins}</strong><small>学习金币</small></div>
      </header>

      <div className="word-train-progress"><span>第 {Math.min(round + 1, words.length)} / {words.length} 站</span><div><i style={{ width: `${status === "finished" ? 100 : round / words.length * 100}%` }} /></div><strong>每个新词 +1 🪙</strong></div>

      <div className="word-train-scene" aria-label="森林单词小火车">
        <div className="train-cloud cloud-a" /><div className="train-cloud cloud-b" />
        <div className="train-hills" aria-hidden="true">🌲 🌳 🌲 🌳 🌲</div>
        <div className="word-locomotive" aria-hidden="true"><span>🚂</span><small>Leo</small></div>
        <div className="word-carriages">
          {trainWords.map((word) => <button className={speakingId === word.id ? "speaking" : ""} key={word.id} onClick={() => void speakBilingual(word)} aria-label={`朗读 ${word.word}，${word.meaning}`} type="button"><span>{word.icon}</span><strong>{word.word}</strong><small>{speakingId === word.id ? "正在读" : "🔊"}</small></button>)}
        </div>
        <div className="train-track" />
      </div>

      {status !== "finished" ? (
        <div className="word-train-challenge">
          <div className="word-clue"><span>{target.icon}</span><div><small>找到这个单词</small><strong>{target.meaning}</strong></div></div>
          <div className={`train-drop-zone ${status}`} onDragOver={(event) => event.preventDefault()} onDrop={onDrop}><span>🚃</span><strong>{status === "wrong" ? "这节车厢不对，再试一次" : status === "correct" ? "连接成功！" : "把正确车厢拖到这里"}</strong></div>
          <div className="word-choice-track">
            {choices.map((card) => <button className={speakingId === card.id ? "speaking" : ""} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", card.id)} onClick={() => { void speakBilingual(card); answer(card); }} key={card.id} aria-label={`${card.word}，点击听中英文发音并选择答案`} type="button"><span>🚃</span><strong>{card.word}</strong><small>{speakingId === card.id ? "🔊 正在读英文和中文" : "🔊 点击听中英文并答题"}</small></button>)}
          </div>
          {status === "correct" && <div className="train-result"><button className={`train-result-word ${speakingId === target.id ? "speaking" : ""}`} onClick={() => void speakBilingual(target)} type="button"><strong>{target.word}</strong><span>{target.meaning}</span><small>{speakingId === target.id ? "🔊 正在读英文和中文" : "🔊 点单词听中英文"}</small></button><button className="train-next" onClick={nextRound} type="button">下一站 →</button></div>}
        </div>
      ) : (
        <div className="train-finish"><span>🏁</span><div><small>小火车到站啦</small><h2>本局收集了 {trainWords.length} 个单词</h2><p>已经掌握的单词不会重复发金币，但可以随时回来复习。</p></div><button onClick={restart} type="button">再开一趟</button></div>
      )}
    </section>
  );
}
