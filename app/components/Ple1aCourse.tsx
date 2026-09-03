"use client";

import { useEffect, useMemo, useState } from "react";
import { ple1aLessonCount, ple1aUnits, type PleExpansion, type PleLesson } from "@/data/ple1aCourse";
import Ple1aPageReader from "./Ple1aPageReader";
import { TtsButton } from "./TtsButton";

const PROGRESS_KEY = "puppy-forest-ple1a-progress";

function activityInstruction(lesson: PleLesson, index: number) {
  const words = lesson.vocabulary.slice(0, 3).map((item) => item.word).join(", ");
  const prompts = [
    `Look, listen and complete Task ${index + 1}.`,
    `Listen carefully and choose the correct answer about ${words}.`,
    `Work with a partner. Ask and answer about "${lesson.title}".`,
    "Finish the task and share your answer in English.",
  ];
  return prompts[index % prompts.length];
}

function expansionEnglish(lesson: PleLesson, expansion: PleExpansion) {
  return {
    title: expansion.titleEn ?? `More about ${lesson.title}`,
    knowledge: expansion.knowledgeEn ?? [
      `Use "${lesson.vocabulary[0]?.word ?? lesson.title}" in a new sentence.`,
      `Read and compare: "${lesson.sentences[0]?.en ?? lesson.title}"`,
      `Ask a friend one question about "${lesson.title}".`,
    ],
    challenge: expansion.challengeEn ?? "Use two new words to make one complete English sentence.",
  };
}

function readProgress() {
  try {
    const value = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function LessonContent({ lesson, completed, onComplete, onOpenPage }: { lesson: PleLesson; completed: boolean; onComplete: () => void; onOpenPage: () => void }) {
  const [expansion, setExpansion] = useState<PleExpansion>(lesson.expansion);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const englishExpansion = expansionEnglish(lesson, expansion);

  useEffect(() => {
    setExpansion(lesson.expansion);
    setNotice("");
  }, [lesson]);

  const refreshExpansion = async () => {
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/textbook-expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      const data = await response.json() as { expansion?: PleExpansion; fallback?: boolean };
      if (!response.ok || !data.expansion) throw new Error("expand_failed");
      setExpansion(data.expansion);
      setNotice(data.fallback ? "已为你打开本课精选拓展" : "已生成一组新的教材拓展");
    } catch {
      setExpansion(lesson.expansion);
      setNotice("网络暂时休息，已为你打开本课精选拓展");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="ple-lesson-content">
      <header className="ple-lesson-heading">
        <div><span>{lesson.icon}</span><div><small>{lesson.pages} · {lesson.kind}</small><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div></div>
        <div className="ple-lesson-heading-actions">{completed && <em>已完成 ✓</em>}<button onClick={onOpenPage} type="button">📖 打开对应原页</button></div>
      </header>

      <section className="ple-goals"><h3>🎯 Learning goals · 这节课学什么</h3><div>{lesson.goals.map((goal, index) => <span key={goal}><b>Goal {index + 1}</b>{goal}</span>)}</div></section>

      <section className="ple-content-block ple-questions">
        <div className="ple-block-title"><span>❓</span><div><small>Questions</small><h3>本课问题</h3></div></div>
        <div className="ple-question-list">{lesson.questions.map((question, index) => <article key={question.en}><span>{index + 1}</span><div><strong>{question.en}</strong><p>{question.zh}</p></div><TtsButton text={question.en} segment="sentence" label="听问题" language="en" playbackRate={0.85} /></article>)}</div>
      </section>

      <section className="ple-content-block">
        <div className="ple-block-title"><span>🧺</span><div><small>Words</small><h3>重点词汇</h3></div></div>
        <div className="ple-vocab-grid">
          {lesson.vocabulary.map((item) => <article key={item.word}><strong>{item.word}</strong><p>{item.meaning}</p><TtsButton text={item.word} segment="word" label="听单词" language="en" playbackRate={0.85} /></article>)}
        </div>
      </section>

      <section className="ple-content-block">
        <div className="ple-block-title"><span>💬</span><div><small>Listen & read</small><h3>课本重点句</h3></div></div>
        <div className="ple-sentence-list">
          {lesson.sentences.map((sentence) => <article key={sentence.en}><div><strong>{sentence.en}</strong><p>{sentence.zh}</p>{sentence.tip && <small>💡 {sentence.tip}</small>}</div><div><TtsButton text={sentence.en} segment="sentence" label="听英文" language="en" playbackRate={0.85} /><TtsButton text={sentence.zh} segment="sentence" label="听中文" language="zh" /></div></article>)}
        </div>
      </section>

      <div className="ple-two-column">
        <section className="ple-content-block ple-knowledge"><div className="ple-block-title"><span>🌱</span><div><small>Knowledge</small><h3>知识整理</h3></div></div><ol>{lesson.knowledge.map((item) => <li key={item}>{item}</li>)}</ol></section>
        <section className="ple-content-block ple-activities"><div className="ple-block-title"><span>🎲</span><div><small>Practice tasks</small><h3>回家这样练</h3></div></div><div className="ple-activity-list">{lesson.activities.map((item, index) => { const instruction = activityInstruction(lesson, index); return <article key={item}><span>{index + 1}</span><div><strong>{instruction}</strong><p>{item}</p></div><TtsButton text={instruction} segment="sentence" label="听任务" language="en" playbackRate={0.85} /></article>; })}</div></section>
      </div>

      {lesson.phonics && lesson.phonics.length > 0 && <section className="ple-phonics"><span>👂 拼读小站</span>{lesson.phonics.map((item) => <strong key={item}>{item}</strong>)}</section>}

      <section className="ple-ai-expand" aria-live="polite">
        <header><div><span>🦉</span><div><small>AI Extension · AI拓展 · 只围绕本课教材</small><h3>{englishExpansion.title}</h3><p>{expansion.title}</p></div></div><button onClick={() => void refreshExpansion()} disabled={loading} type="button">{loading ? "老师正在准备…" : "换一组拓展 ✨"}</button></header>
      <div className="ple-ai-points">{expansion.knowledge.map((item, index) => <article key={`${index}-${item}`}><span>{index + 1}</span><strong>{englishExpansion.knowledge[index] ?? englishExpansion.knowledge[0]}</strong><p>{item}</p></article>)}</div>
      <div className="ple-ai-challenge"><strong>🌟 Challenge · 复习小挑战</strong><b>{englishExpansion.challenge}</b><p>{expansion.challenge}</p><TtsButton text={englishExpansion.challenge} segment="sentence" label="听挑战" language="en" playbackRate={0.85} /></div>
        {notice && <small className="ple-ai-notice">{notice}</small>}
      </section>

      <footer className="ple-finish"><div><span>{completed ? "🏆" : "🌿"}</span><div><strong>{completed ? "这节课已经收进成长记录" : "学完后点一下，保存进度"}</strong><small>教材同步学习不会改变原来的90天闯关进度</small></div></div><button className={completed ? "done" : ""} onClick={onComplete} type="button">{completed ? "已完成 ✓" : "完成本课 +2金币"}</button></footer>
    </article>
  );
}

export default function Ple1aCourse({ onBack, onReward }: { onBack: () => void; onReward: (amount: number) => void }) {
  const [unitId, setUnitId] = useState(ple1aUnits[0].id);
  const [lessonId, setLessonId] = useState(ple1aUnits[0].lessons[0].id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [readerPage, setReaderPage] = useState<number | null>(null);

  useEffect(() => setCompletedIds(readProgress()), []);

  const unit = useMemo(() => ple1aUnits.find((item) => item.id === unitId) ?? ple1aUnits[0], [unitId]);
  const lesson = useMemo(() => unit.lessons.find((item) => item.id === lessonId) ?? unit.lessons[0], [lessonId, unit]);
  const progress = Math.round(completedIds.length / ple1aLessonCount * 100);
  const currentBookPage = Number(lesson.pages.match(/\d+/)?.[0] ?? 2);

  const selectUnit = (nextUnitId: string) => {
    const nextUnit = ple1aUnits.find((item) => item.id === nextUnitId) ?? ple1aUnits[0];
    setUnitId(nextUnit.id);
    setLessonId(nextUnit.lessons[0].id);
  };

  const completeLesson = () => {
    if (completedIds.includes(lesson.id)) return;
    const next = [...completedIds, lesson.id];
    setCompletedIds(next);
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch { /* 当前设备无法保存时，仍保留本次进度 */ }
    onReward(2);
  };

  if (readerPage !== null) return <Ple1aPageReader initialPage={readerPage} onBack={() => setReaderPage(null)} />;

  return (
    <section className="ple-course">
      <button className="ple-back" onClick={onBack} type="button">← 返回课程中心</button>
      <header className="ple-hero"><div><span className="ple-book-icon">📘</span><div><small>学校同步教材 · 香港小学一年级</small><h1>Primary Longman Express 1A</h1><p>按课本顺序整理词汇、重点句、语法、拼读和回家练习，每一句都可听中英文发音。</p><div className="ple-tags"><span>6个单元</span><span>28个课时</span><span>98页原版教材</span><span>逐页点读</span><span>双语发音</span><span>智能知识拓展</span></div><button className="ple-open-reader" onClick={() => setReaderPage(9)} type="button">📖 打开98页原版点读教材 →</button></div></div><aside><strong>{progress}%</strong><span>教材进度</span><i><b style={{ width: `${progress}%` }} /></i><small>{completedIds.length} / {ple1aLessonCount} 课</small></aside></header>

      <nav className="ple-unit-tabs" aria-label="PLE 1A单元目录">
        {ple1aUnits.map((item) => <button className={`${item.color} ${unit.id === item.id ? "active" : ""}`} key={item.id} onClick={() => selectUnit(item.id)} type="button"><span>{item.icon}</span><div><small>{item.number <= 6 ? `Unit ${item.number}` : "Review"}</small><strong>{item.title}</strong><em>{item.zh}</em></div><b>{item.lessons.filter((entry) => completedIds.includes(entry.id)).length}/4</b></button>)}
      </nav>

      <div className="ple-course-layout">
        <aside className="ple-lesson-menu"><header><small>{unit.number <= 6 ? `Unit ${unit.number}` : "Review"}</small><h2>{unit.title}</h2><strong>{unit.zh}</strong><p>{unit.theme}</p></header>{unit.lessons.map((item, index) => <button className={lesson.id === item.id ? "active" : ""} key={item.id} onClick={() => setLessonId(item.id)} type="button"><span>{completedIds.includes(item.id) ? "✅" : item.icon}</span><div><small>Lesson {index + 1} · 第{index + 1}课 · {item.kind}</small><strong>{item.title}</strong><i>{item.subtitle}</i><em>{item.pages}</em></div></button>)}</aside>
        <LessonContent lesson={lesson} completed={completedIds.includes(lesson.id)} onComplete={completeLesson} onOpenPage={() => setReaderPage(Math.min(98, currentBookPage + 7))} />
      </div>
    </section>
  );
}
