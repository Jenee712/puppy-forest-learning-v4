"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { getCourseQuestions, type QuestionItem } from "../data/questionBank";
import { getDailyCurriculum, STUDY_PROGRAM_DAYS } from "../data/dailyCurriculum";
import { getCourseCatalog } from "../data/courseCatalog";
import { TtsButton } from "./components/TtsButton";
import { PictureBookLibrary } from "./components/PictureBookLibrary";
import StickerShop from "./components/StickerShop";
import ForestHome from "./components/ForestHome";
import WordTrainGame from "./components/WordTrainGame";
import BackgroundMusic from "./components/BackgroundMusic";

type Grade = { id: string; age: string; school: string; icon: string; color: string; focus: string };
type Course = { icon: string; name: string; description: string; units: number; progress: number; color: string };
type WrongRecord = { question: QuestionItem; selectedAnswer: string; attempts: number; mastered: boolean; lastWrongAt: string; reviewStage?: number; nextReviewAt?: string | null };

const grades: Grade[] = [
  { id: "G1", age: "3–4岁", school: "幼儿启蒙", icon: "🌱", color: "mint", focus: "表达、感知与好习惯" },
  { id: "G2", age: "5–6岁", school: "幼小衔接", icon: "🌿", color: "leaf", focus: "思维、规则与入学准备" },
  { id: "G3", age: "7岁", school: "小学一年级", icon: "🌼", color: "sunny", focus: "拼音、数感与学习习惯" },
  { id: "G4", age: "8岁", school: "小学二年级", icon: "🌳", color: "sky", focus: "阅读、运算与观察" },
  { id: "G5", age: "9岁", school: "小学三年级", icon: "🦋", color: "lilac", focus: "写作、应用题与英语" },
  { id: "G6", age: "10岁", school: "小学四年级", icon: "🚂", color: "peach", focus: "理解、推理与表达" },
  { id: "G7", age: "11岁", school: "小学五年级", icon: "✈️", color: "blue", focus: "综合应用与自主学习" },
  { id: "G8", age: "12岁", school: "小学六年级", icon: "⛰️", color: "rose", focus: "归纳、衔接与能力进阶" },
];

const navGroups = [
  { label: "学习列车", items: [["🏡", "首页"], ["☀️", "今日学习"], ["🧩", "课程中心"], ["📖", "绘本馆"], ["🗺️", "学习计划"]] },
  { label: "森林乐园", items: [["🚂", "单词小火车"], ["🌷", "复习花园"], ["✨", "贴纸册"], ["🏡", "森林家园"], ["🛡️", "家长中心"]] },
];

function getTaskLook(question: QuestionItem) {
  const looks = {
    trace: ["✍️", "pink"], phonics: ["👂", "yellow"], cn_to_en: ["中→EN", "blue"], en_to_cn: ["EN→中", "mint"], storybook: ["📖", "lilac"], grammar: ["🧩", "peach"], reading: ["🔎", "green"], practice: [question.subject.includes("数学") || question.subject.includes("数量") ? "🧮" : "📚", "green"],
  } as const;
  const [icon, color] = looks[question.activityKind ?? "practice"];
  return { icon, color, minutes: `${question.estimatedMinutes ?? 3}分钟` };
}

const SESSION_NOW = Date.now();

function normalizeAnswer(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function formatAnswer(value: string) {
  return value.replaceAll(" || ", "；").replaceAll("=", " → ").replaceAll(" | ", " → ");
}


const products = [
  { name: "首级永久版", price: "29.9", note: "任选1个等级 · 1个孩子", accent: false },
  { name: "个人全级版", price: "139", note: "G1–G8全部等级 · 1个孩子", accent: true },
  { name: "家庭全级版", price: "159", note: "G1–G8全部等级 · 2个孩子", accent: false },
];

function getGreeting(hour: number): string {
  if (hour < 6) return "凌晨好";
  if (hour < 12) return "早上好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function saveStreak(data: { count: number; lastDate: string }) {
  try { window.localStorage.setItem("puppy-forest-streak", JSON.stringify(data)); } catch { /* ignore */ }
}

function loadStreak(): number {
  try {
    const raw = window.localStorage.getItem("puppy-forest-streak");
    const today = todayStr();
    if (!raw) { saveStreak({ count: 1, lastDate: today }); return 1; }
    const data = JSON.parse(raw) as { count: number; lastDate: string };
    if (data.lastDate === today) return data.count;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const count = data.lastDate === yesterday ? data.count + 1 : 1;
    saveStreak({ count, lastDate: today });
    return count;
  } catch { return 1; }
}

function getCourses(grade: string): Course[] {
  if (grade === "G1" || grade === "G2") {
    return [
      { icon: "💬", name: "语言表达", description: "听故事、说完整的话", units: 28, progress: 42, color: "coral" },
      { icon: "🔢", name: "数量与空间", description: "数量、形状和位置", units: 26, progress: 30, color: "blue" },
      { icon: "🔍", name: "科学探索", description: "观察自然与生活", units: 24, progress: 18, color: "green" },
      { icon: "🍎", name: "健康习惯", description: "运动、卫生与安全", units: 20, progress: 55, color: "yellow" },
      { icon: "🤝", name: "社会认知", description: "合作、规则和情绪", units: 20, progress: 25, color: "lilac" },
      { icon: "🎨", name: "艺术创造", description: "音乐、绘画和手工", units: 22, progress: 12, color: "pink" },
      { icon: "🔤", name: "英语兴趣", description: "字母、儿歌和日常词汇", units: 26, progress: 35, color: "mint" },
    ];
  }

  const formalEnglish = ["G5", "G6", "G7", "G8"].includes(grade);
  return [
    { icon: "📚", name: "语文", description: "识字、阅读与表达", units: 36, progress: 38, color: "coral" },
    { icon: "🧮", name: "数学", description: "运算、应用与思维", units: 40, progress: 31, color: "blue" },
    { icon: "🔤", name: formalEnglish ? "英语" : "英语兴趣", description: formalEnglish ? "词汇、句型与阅读" : "自然拼读与日常表达", units: 32, progress: 24, color: "mint" },
    { icon: "🔬", name: "科学", description: "观察、实验与发现", units: 24, progress: 15, color: "green" },
    { icon: "✍️", name: "阅读与表达", description: "绘本、写作和分享", units: 26, progress: 20, color: "pink" },
    { icon: "🧠", name: "综合素养", description: "逻辑、生活与创造", units: 20, progress: 10, color: "lilac" },
    { icon: "🍎", name: "健康习惯", description: "运动、卫生与安全", units: 20, progress: 8, color: "yellow" },
  ];
}

export function V4Dashboard() {
  const [activeNav, setActiveNav] = useState("首页");
  const [selectedGrade, setSelectedGrade] = useState("G3");
  const [selectedDay, setSelectedDay] = useState(1);
  const [showPlans, setShowPlans] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"correct" | "wrong" | null>(null);
  const [dailyProgress, setDailyProgress] = useState<Record<string, number[]>>(() => {
    try { return JSON.parse(window.localStorage.getItem("puppy-forest-90-day-progress") ?? "{}"); } catch { return {}; }
  });
  const [wrongRecords, setWrongRecords] = useState<WrongRecord[]>([]);
  const [recordsReady, setRecordsReady] = useState(false);
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [practiceNotice, setPracticeNotice] = useState<string | null>(null);
  const [coinBalance, setCoinBalance] = useState(() => {
    try { const raw = window.localStorage.getItem("puppy-forest-coins"); return raw ? Math.max(0, Number(raw)) : 50; } catch { return 50; }
  });
  const [greeting, setGreeting] = useState("你好");
  const [streak, setStreak] = useState(1);

  // 页面切换时同步金币余额（贴纸商店可能消费了金币）
  useEffect(() => {
    try { const raw = window.localStorage.getItem("puppy-forest-coins"); if (raw) setCoinBalance(Math.max(0, Number(raw))); } catch { /* ignore */ }
  }, [activeNav]);

  // 挂载后计算动态问候语与连续学习天数（避免 SSR hydration 不一致）
  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
    setStreak(loadStreak());
    try {
      const savedGrade = window.localStorage.getItem("puppy-forest-grade");
      if (grades.some((grade) => grade.id === savedGrade)) setSelectedGrade(savedGrade as string);
      const savedDay = Number(window.localStorage.getItem("puppy-forest-study-day") ?? 1);
      if (Number.isFinite(savedDay)) setSelectedDay(Math.min(STUDY_PROGRAM_DAYS, Math.max(1, Math.round(savedDay))));
    } catch { /* 当前设备无法读取时使用默认等级 */ }
  }, []);

  const currentGrade = useMemo(() => grades.find((grade) => grade.id === selectedGrade) ?? grades[2], [selectedGrade]);
  const courses = useMemo(() => getCourses(selectedGrade), [selectedGrade]);
  const progressKey = `${selectedGrade}-day-${selectedDay}`;
  const completedTasks = dailyProgress[progressKey] ?? [];
  const updateCompletedTasks = (updater: number[] | ((current: number[]) => number[])) => {
    setDailyProgress((progress) => {
      const current = progress[progressKey] ?? [];
      const next = typeof updater === "function" ? updater(current) : updater;
      const updated = { ...progress, [progressKey]: next };
      try { window.localStorage.setItem("puppy-forest-90-day-progress", JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };
  const dailyQuestions = useMemo(() => getDailyCurriculum(selectedGrade, selectedDay), [selectedDay, selectedGrade]);
  const dailyMinutes = useMemo(() => dailyQuestions.reduce((sum, question) => sum + (question.estimatedMinutes ?? 3), 0), [dailyQuestions]);
  const dailyCountByCourse = useMemo(() => {
    const counts: Record<string, number> = {};
    dailyQuestions.forEach((question) => { counts[question.subject] = (counts[question.subject] ?? 0) + 1; });
    return counts;
  }, [dailyQuestions]);
  const completedMinutes = useMemo(() => completedTasks.reduce((sum, index) => sum + (dailyQuestions[index]?.estimatedMinutes ?? 0), 0), [completedTasks, dailyQuestions]);
  const englishTaskCount = dailyQuestions.filter((question) => question.subject.includes("英语")).length;
  const pendingWrongCount = wrongRecords.filter((record) => !record.mastered).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("puppy-forest-wrong-records");
        if (stored) setWrongRecords(JSON.parse(stored) as WrongRecord[]);
      } catch { /* 当前设备无法读取时，仍可在本次使用中记录 */ }
      setRecordsReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!recordsReady) return;
    try { window.localStorage.setItem("puppy-forest-wrong-records", JSON.stringify(wrongRecords)); } catch { /* 当前设备不支持持久保存时忽略 */ }
  }, [recordsReady, wrongRecords]);

  const openTask = (index: number) => {
    setActiveQuestion(dailyQuestions[index] ?? dailyQuestions[0]);
    setActiveTaskIndex(index);
    setSelectedAnswer(null);
    setAnswerState(null);
    setPracticeNotice(null);
  };

  const openCourse = (course: Course, lessonIndex = 0) => {
    const courseQuestions = getCourseQuestions(course.name, selectedGrade);
    setActiveQuestion(courseQuestions[lessonIndex] ?? courseQuestions[0]);
    setActiveTaskIndex(null);
    setSelectedAnswer(null);
    setAnswerState(null);
    setPracticeNotice(null);
  };

  const goToCourse = (courseName: string) => {
    const course = courses.find((item) => item.name === courseName);
    if (!course) return;
    setSelectedCourse(course);
    setActiveNav("课程中心");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkAnswer = () => {
    if (!activeQuestion || !selectedAnswer) return;
    const correct = normalizeAnswer(selectedAnswer) === normalizeAnswer(activeQuestion.answer);
    setAnswerState(correct ? "correct" : "wrong");
    setWrongRecords((records) => {
      const existing = records.find((record) => record.question.id === activeQuestion.id);
      if (correct) return existing ? records.map((record) => {
        if (record.question.id !== activeQuestion.id) return record;
        const reviewStage = Math.min((record.reviewStage ?? 0) + 1, 3);
        const delayDays = reviewStage === 1 ? 1 : reviewStage === 2 ? 3 : 7;
        return { ...record, mastered: true, reviewStage, nextReviewAt: reviewStage >= 3 ? null : new Date(Date.now() + delayDays * 86400000).toISOString() };
      }) : records;
      if (existing) return records.map((record) => record.question.id === activeQuestion.id ? { ...record, selectedAnswer, attempts: record.attempts + 1, mastered: false, reviewStage: 0, nextReviewAt: new Date().toISOString(), lastWrongAt: new Date().toISOString() } : record);
      return [{ question: activeQuestion, selectedAnswer, attempts: 1, mastered: false, reviewStage: 0, nextReviewAt: new Date().toISOString(), lastWrongAt: new Date().toISOString() }, ...records];
    });
  };

  const retryWrongQuestion = (record: WrongRecord) => {
    setActiveQuestion(record.question);
    setActiveTaskIndex(null);
    setSelectedAnswer(null);
    setAnswerState(null);
    setPracticeNotice(null);
  };

  const generateSmartQuestion = async (question: QuestionItem, successMessage: string) => {
    setAiLoadingId(question.id);
    try {
      const response = await fetch("/api/generate-question", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grade: question.grade, subject: question.subject, knowledgePoint: question.knowledgePoint, difficulty: question.difficulty, avoidTitles: [question.title] }) });
      const data = await response.json() as { question?: QuestionItem; fallback?: boolean; reason?: string };
      if (!response.ok || !data.question) throw new Error("generate_failed");
      setActiveQuestion(data.question);
      setPracticeNotice(data.fallback ? (data.reason ?? "已切换到本地核心题") : successMessage);
    } catch {
      setActiveQuestion(question);
      setPracticeNotice("智能出题暂时不可用，已切换到本地核心题");
    } finally {
      setActiveTaskIndex(null);
      setSelectedAnswer(null);
      setAnswerState(null);
      setAiLoadingId(null);
    }
  };

  const openSmartPractice = (record: WrongRecord) => generateSmartQuestion(record.question, "已根据这个薄弱知识点生成一道新题");

  const continueWithSmartPractice = () => {
    if (!activeQuestion) return;
    if (activeTaskIndex !== null) updateCompletedTasks((current) => current.includes(activeTaskIndex) ? current : [...current, activeTaskIndex]);
    void generateSmartQuestion(activeQuestion, "AI已生成一道同知识点进阶题");
  };

  const finishTask = () => {
    if (activeTaskIndex !== null) {
      updateCompletedTasks((current) => current.includes(activeTaskIndex) ? current : [...current, activeTaskIndex]);
    }
    // 完成一题 +2 金币
    const newCoins = coinBalance + 2;
    setCoinBalance(newCoins);
    try { window.localStorage.setItem("puppy-forest-coins", String(newCoins)); } catch { /* ignore */ }

    // 查找下一道未完成的题目，自动跳转
    const nextIndex = dailyQuestions.findIndex((_, idx) => {
      const alreadyDone = activeTaskIndex !== null ? [...completedTasks, activeTaskIndex] : completedTasks;
      return !alreadyDone.includes(idx);
    });

    if (nextIndex >= 0) {
      // 还有未完成的题，直接打开下一题
      openTask(nextIndex);
    } else {
      // 全部完成
      setActiveQuestion(null);
      setActiveTaskIndex(null);
      setPracticeNotice(null);
    }
  };

  // 贴纸商店消费金币（与顶栏 coinBalance 共用同一状态与 localStorage）
  const spendCoins = (price: number) => {
    const newCoins = Math.max(0, coinBalance - price);
    setCoinBalance(newCoins);
    try { window.localStorage.setItem("puppy-forest-coins", String(newCoins)); } catch { /* ignore */ }
  };

  const rewardCoins = (amount: number) => {
    const newCoins = coinBalance + Math.max(0, amount);
    setCoinBalance(newCoins);
    try { window.localStorage.setItem("puppy-forest-coins", String(newCoins)); } catch { /* ignore */ }
  };

  const goTo = (label: string) => {
    setActiveNav(label);
    if (label !== "课程中心") setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeGrade = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedCourse(null);
    try { window.localStorage.setItem("puppy-forest-grade", grade); } catch { /* ignore */ }
  };

  const changeStudyDay = (day: number) => {
    const nextDay = Math.min(STUDY_PROGRAM_DAYS, Math.max(1, Math.round(day)));
    setSelectedDay(nextDay);
    setActiveQuestion(null);
    setActiveTaskIndex(null);
    try { window.localStorage.setItem("puppy-forest-study-day", String(nextDay)); } catch { /* ignore */ }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark" aria-hidden="true">🐶</div><div><strong>小狗的森林学堂</strong><span>V4 · 简体字智能版</span></div></div>
        <nav aria-label="主导航">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(([icon, label]) => (
                <button className={activeNav === label ? "nav-item active" : "nav-item"} key={label} onClick={() => goTo(label)} type="button">
                  <span aria-hidden="true">{icon}</span>{label}{label === "复习花园" && pendingWrongCount > 0 && <em>{pendingWrongCount}</em>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="profile-card"><span className="deer" aria-hidden="true">🦌</span><div><strong>小鹿 Leo</strong><small>{selectedGrade} · 连续{streak}天</small></div><button aria-label="进入家长中心" onClick={() => goTo("家长中心")} type="button">›</button></div>
      </aside>

      <main id="main-content">
        <header className="topbar">
          <div className="mobile-brand"><span>🐶</span>森林学堂</div>
          <div className="progress-wrap"><span>今日 {completedMinutes} / {dailyMinutes} 分钟</span><div className="progress" role="progressbar" aria-label="今日学习进度" aria-valuemin={0} aria-valuemax={dailyMinutes} aria-valuenow={completedMinutes}><i style={{ width: `${Math.round(completedMinutes / dailyMinutes * 100)}%` }} /></div></div>
          <div className="top-actions"><button className="ai-quick-button" onClick={() => void generateSmartQuestion(dailyQuestions[0], "AI已按当前等级生成一道新题")} disabled={aiLoadingId !== null || dailyQuestions.length === 0} type="button">{aiLoadingId !== null ? "出题中…" : "✨ AI出题"}</button><div className="coin" aria-label={`森林金币 ${coinBalance} 枚`}>🪙 {coinBalance}</div><button className="parent-button" onClick={() => goTo("家长中心")} type="button">家长中心</button></div>
        </header>

        <div className="content">
          {activeNav === "首页" && (
            <>
              <section className="visual-hero" aria-label="小狗的森林学堂主视觉">
                <Image src="/og.png" alt="小狗、小猫和小兔在森林里一起学习，小火车从身边经过" width={1200} height={630} priority unoptimized />
                <div className="visual-hero-action"><div><span>{greeting}，小鹿 Leo</span><strong>今天还有 {dailyQuestions.length - completedTasks.length} 个学习站</strong></div><button onClick={() => goTo("今日学习")} type="button">开始学习 <b>→</b></button></div>
              </section>
              <GradeRoute currentGrade={currentGrade} selectedGrade={selectedGrade} stationCount={dailyQuestions.length} minutes={dailyMinutes} onSelect={changeGrade} />
              <section className="lower-grid grade-content-enter" key={selectedGrade}>
                <TaskPanel completedTasks={completedTasks} questions={dailyQuestions} courses={courses} onOpen={openTask} onGoCourse={goToCourse} previewCount={3} onViewAll={() => goTo("今日学习")} />
                <div className="smart-panel"><div className="smart-panel-header"><span className="ai-badge">✨ 智能学习伙伴</span><h2>家长不用找题</h2></div><div className="smart-flow">📚<small>核心题库</small><i>→</i>🧠<small>智能出题</small><i>→</i>🌷<small>自动复习</small></div><div className="smart-panel-actions"><button onClick={() => void generateSmartQuestion(dailyQuestions[0], "AI已按今天的学习等级生成一道新题")} disabled={aiLoadingId !== null || dailyQuestions.length === 0} type="button">{aiLoadingId === dailyQuestions[0]?.id ? "出题中…" : "✨ AI出题"}</button><button className="outline" onClick={() => setShowPlans(true)} type="button">永久解锁 ›</button></div></div>
              </section>
            </>
          )}

          {activeNav === "今日学习" && (
            <section className="page-surface today-page">
              <PageTitle eyebrow={`90天成长计划 · 第${selectedDay}天`} title="今日学习路线" subtitle={`${currentGrade.id} · ${currentGrade.school} · ${dailyQuestions.length}站 · 预计${dailyMinutes}分钟`} icon="☀️" />
              <div className="learning-density"><span>🇬🇧 英语 {englishTaskCount} 站</span><strong>{Math.round(englishTaskCount / dailyQuestions.length * 100)}%</strong><p>英语为主线，包含听读、双向翻译、词句训练与分级阅读。</p></div>
              <div className="today-summary"><div><strong>{completedTasks.length}<small>/ {dailyQuestions.length}</small></strong><span>今日完成</span></div><div><strong>{coinBalance}</strong><span>森林金币</span></div><div><strong>{dailyMinutes}</strong><span>预计分钟</span></div></div>
              <TaskPanel completedTasks={completedTasks} questions={dailyQuestions} courses={courses} onOpen={openTask} onGoCourse={goToCourse} standalone />
              <div className="gentle-note"><span>🌿</span><div><strong>学完记得看远处、活动一下</strong><p>每完成一个任务，系统会根据表现调整下一次练习。</p></div></div>
            </section>
          )}

          {activeNav === "课程中心" && (
            <section className="page-surface course-page">
              {selectedCourse ? (
                <CourseDetail course={selectedCourse} grade={currentGrade} aiLoading={aiLoadingId !== null} onBack={() => setSelectedCourse(null)} onStart={(lessonIndex) => openCourse(selectedCourse, lessonIndex)} onSmartStart={() => { const question = getCourseQuestions(selectedCourse.name, selectedGrade)[0]; if (question) void generateSmartQuestion(question, `AI已生成一道${selectedCourse.name}新题`); }} />
              ) : (
                <>
                  <PageTitle eyebrow="按年龄和能力逐级成长" title="课程中心" subtitle="课程不是固定60天，可以按孩子的节奏持续学习" icon="🧩" />
                  <div className="course-grade-switcher">{grades.map((grade) => <button className={selectedGrade === grade.id ? "active" : ""} key={grade.id} onClick={() => changeGrade(grade.id)} type="button"><span>{grade.icon}</span><strong>{grade.id}</strong><small>{grade.school}</small></button>)}</div>
                  <div className="course-intro"><div><span>{currentGrade.icon}</span><div><strong>{currentGrade.id} · {currentGrade.school}</strong><p>{currentGrade.age} · {currentGrade.focus}</p></div></div><button onClick={() => setShowPlans(true)} type="button">查看解锁权益</button></div>
                  <div className="course-grid">{courses.map((course) => { const dailyCount = dailyCountByCourse[course.name] ?? 0; return <article className={`course-card ${course.color}`} key={course.name}><span className="course-icon">{course.icon}</span><div className="course-card-head"><div><h3>{course.name}</h3><p>{course.description}</p></div><em>{course.units}课</em></div><div className="course-progress"><i style={{ width: `${course.progress}%` }} /></div><footer><span className="course-foot">{dailyCount > 0 && <button className="course-daily" onClick={() => goTo("今日学习")} type="button">☀️ 今日学习 {dailyCount} 站</button>}<i>已完成 {course.progress}%</i></span><button onClick={() => { setSelectedCourse(course); window.scrollTo({ top: 0, behavior: "smooth" }); }} type="button">进入课程 →</button></footer></article>; })}</div>
                </>
              )}
            </section>
          )}

          {activeNav === "复习花园" && <ReviewGarden records={wrongRecords} loadingId={aiLoadingId} onRetry={retryWrongQuestion} onSmartPractice={openSmartPractice} onCourse={() => goTo("课程中心")} />}
          {activeNav === "家长中心" && <ParentCenter records={wrongRecords} grade={currentGrade} completedTasks={completedTasks.length} totalTasks={dailyQuestions.length} onGarden={() => goTo("复习花园")} />}
          {activeNav === "绘本馆" && <PictureBookLibrary grade={selectedGrade} />}
          {activeNav === "贴纸册" && <StickerShop coins={coinBalance} onSpend={spendCoins} />}
          {activeNav === "森林家园" && <ForestHome coins={coinBalance} onSpend={spendCoins} />}
          {activeNav === "单词小火车" && <WordTrainGame grade={selectedGrade} coins={coinBalance} onReward={rewardCoins} />}

          {activeNav === "学习计划" && <StudyPlan day={selectedDay} questions={dailyQuestions} completed={completedTasks} progress={dailyProgress} grade={selectedGrade} onDayChange={changeStudyDay} onOpenTask={openTask} onGoToday={() => goTo("今日学习")} />}

          {!["首页", "今日学习", "课程中心", "复习花园", "家长中心", "绘本馆", "贴纸册", "森林家园", "单词小火车", "学习计划"].includes(activeNav) && <FeaturePage name={activeNav} onBack={() => goTo("首页")} />}

          {showPlans && <PlanModal onClose={() => setShowPlans(false)} />}
          {activeQuestion && <LessonModal question={activeQuestion} notice={practiceNotice} selectedAnswer={selectedAnswer} answerState={answerState} aiLoading={aiLoadingId !== null} onSelect={(answer) => { setSelectedAnswer(answer); setAnswerState(null); }} onCheck={checkAnswer} onSmartNext={continueWithSmartPractice} onFinish={finishTask} onClose={() => { setActiveQuestion(null); setActiveTaskIndex(null); setPracticeNotice(null); }} />}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="手机导航">
        {[["🏡", "首页", "首页"], ["☀️", "今日", "今日学习"], ["🧩", "课程", "课程中心"], ["📖", "绘本", "绘本馆"], ["🚂", "单词", "单词小火车"], ["✨", "贴纸", "贴纸册"], ["🏠", "家园", "森林家园"], ["🌷", pendingWrongCount > 0 ? `复习${pendingWrongCount}` : "复习", "复习花园"], ["🛡️", "我的", "家长中心"]].map(([icon, label, target]) => <button className={activeNav === target ? "active" : ""} key={target} onClick={() => goTo(target)} type="button"><span>{icon}</span>{label}</button>)}
      </nav>
      <BackgroundMusic />
    </div>
  );
}

function StudyPlan({ day, questions, completed, progress, grade, onDayChange, onOpenTask, onGoToday }: { day: number; questions: QuestionItem[]; completed: number[]; progress: Record<string, number[]>; grade: string; onDayChange: (day: number) => void; onOpenTask: (index: number) => void; onGoToday: () => void }) {
  const groups = useMemo(() => {
    const map = new Map<string, { q: QuestionItem; idx: number }[]>();
    questions.forEach((q, idx) => {
      const arr = map.get(q.subject) ?? [];
      arr.push({ q, idx });
      map.set(q.subject, arr);
    });
    return [...map.entries()];
  }, [questions]);
  const totalMinutes = questions.reduce((sum, q) => sum + (q.estimatedMinutes ?? 3), 0);
  const phase = day <= 30 ? "基础扎根" : day <= 60 ? "能力生长" : "综合进阶";
  const startedDays = Array.from({ length: STUDY_PROGRAM_DAYS }, (_, index) => index + 1).filter((studyDay) => (progress[`${grade}-day-${studyDay}`]?.length ?? 0) > 0).length;

  return (
    <section className="page-surface study-plan-page">
      <PageTitle eyebrow="每天独立进度 · 学完自动保存" title="90天学习计划" subtitle={`当前第${day}天 · ${phase} · ${questions.length}站 · 预计${totalMinutes}分钟`} icon="🗺️" />
      <div className="today-summary">
        <div><strong>{day}<small>/ {STUDY_PROGRAM_DAYS}</small></strong><span>当前学习日</span></div>
        <div><strong>{startedDays}</strong><span>已有学习记录</span></div>
        <div><strong>{completed.length}<small>/ {questions.length}</small></strong><span>本日完成</span></div>
      </div>
      <section className="study-calendar" aria-labelledby="study-calendar-title">
        <header><div><small>三阶段螺旋学习</small><h2 id="study-calendar-title">选择第几天</h2></div><div className="calendar-legend"><span><i className="current" />当前</span><span><i className="started" />有记录</span></div></header>
        <div className="phase-strip"><span className={day <= 30 ? "active" : ""}>🌱 1–30天 基础扎根</span><span className={day > 30 && day <= 60 ? "active" : ""}>🌿 31–60天 能力生长</span><span className={day > 60 ? "active" : ""}>🌳 61–90天 综合进阶</span></div>
        <div className="calendar-days" role="list" aria-label="90天学习日历">
          {Array.from({ length: STUDY_PROGRAM_DAYS }, (_, index) => index + 1).map((studyDay) => {
            const done = progress[`${grade}-day-${studyDay}`]?.length ?? 0;
            const selected = studyDay === day;
            return <button className={`${selected ? "selected " : ""}${done > 0 ? "started" : ""}`} key={studyDay} onClick={() => onDayChange(studyDay)} aria-pressed={selected} type="button"><strong>{studyDay}</strong>{done > 0 && <small>{done}站</small>}</button>;
          })}
        </div>
      </section>
      <div className="plan-subject-list">
        {groups.map(([subject, items]) => {
          const doneCount = items.filter(({ idx }) => completed.includes(idx)).length;
          return (
            <article className="plan-subject" key={subject}>
              <header><strong>{subject}</strong><span>{doneCount}/{items.length} 已完成</span></header>
              <div className="plan-task-chips">
                {items.map(({ q, idx }) => (
                  <button className={completed.includes(idx) ? "plan-chip done" : "plan-chip"} key={idx} onClick={() => onOpenTask(idx)} type="button" title={q.title}>
                    {completed.includes(idx) ? "✅ " : ""}{q.knowledgePoint}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <div className="gentle-note"><span>🌿</span><div><strong>正在查看第{day}天</strong><p>每一天的完成记录分别保存。知识点会循环出现，但练习顺序会变化，帮助孩子间隔复习。</p></div><button className="plan-go-today" onClick={onGoToday} type="button">学习第{day}天 →</button></div>
    </section>
  );
}

function GradeRoute({ currentGrade, selectedGrade, stationCount, minutes, onSelect }: { currentGrade: Grade; selectedGrade: string; stationCount: number; minutes: number; onSelect: (grade: string) => void }) {
  return <section className="grade-section"><div className="section-heading"><div><span className="section-kicker">为孩子选择合适的起点</span><h2>八级成长路线</h2></div><div className="current-pill">当前：{currentGrade.icon} {currentGrade.id} · {currentGrade.school}</div></div><div className="grade-grid" aria-label="选择学习等级">{grades.map((grade) => { const selected = selectedGrade === grade.id; return <button className={`grade-card ${grade.color} ${selected ? "selected" : ""}`} key={grade.id} onClick={() => onSelect(grade.id)} aria-pressed={selected} aria-label={`切换到 ${grade.id} ${grade.school}`} type="button"><span className="grade-icon" aria-hidden="true">{grade.icon}</span><span className="grade-name"><strong>{grade.id}</strong><b>{grade.school}</b></span><small>{grade.age}</small><p>{grade.focus}</p>{selected && <i>当前</i>}</button>; })}</div><div className={`grade-choice-summary ${currentGrade.color}`} key={currentGrade.id} aria-live="polite"><span className="grade-choice-icon" aria-hidden="true">{currentGrade.icon}</span><div><small>已切换到</small><strong>{currentGrade.id} · {currentGrade.school}</strong><p>{currentGrade.age} · {currentGrade.focus}</p></div><dl><div><dt>今日路线</dt><dd>{stationCount}站</dd></div><div><dt>预计时长</dt><dd>{minutes}分钟</dd></div></dl></div></section>;
}

function CourseDetail({ course, grade, aiLoading, onBack, onStart, onSmartStart }: { course: Course; grade: Grade; aiLoading: boolean; onBack: () => void; onStart: (lessonIndex: number) => void; onSmartStart: () => void }) {
  const units = useMemo(() => getCourseCatalog(grade.id, course.name), [course.name, grade.id]);
  const availableUnits = Math.min(getCourseQuestions(course.name, grade.id).length, units.length);

  return <div className="course-detail">
    <button className="course-back" onClick={onBack} type="button">← 返回课程中心</button>
    <header className={`course-detail-hero ${course.color}`}><span>{course.icon}</span><div><small>{grade.id} · {grade.school}</small><h1>{course.name}</h1><p>{course.description} · 规划{course.units}课</p></div><div className="course-hero-actions"><button onClick={() => onStart(0)} type="button">开始第1单元 →</button><button className="ai-course-button" onClick={onSmartStart} disabled={aiLoading} type="button">{aiLoading ? "正在出题…" : "✨ AI智能出题"}</button></div></header>
    <div className="course-detail-summary"><div><strong>{units.length}个</strong><span>本级核心单元</span></div><div><strong>{units.reduce((sum, unit) => sum + unit.knowledgePoints.length, 0)}个</strong><span>核心知识点</span></div><div><strong>核心题库 + 智能生成</strong><span>练习内容来源</span></div></div>
    <section className="unit-panel knowledge-map-panel"><div className="section-heading compact"><div><span className="section-kicker">从知识点出发，看清每一步学什么</span><h2>本级课程地图</h2></div><span className="task-count">{availableUnits} / {units.length} 单元可练</span></div><div className="knowledge-map" role="list" aria-label={`${grade.id}${course.name}知识点地图`}>{units.map((unit, index) => { const available = index < availableUnits; return <article className={available ? "knowledge-unit available" : "knowledge-unit preparing"} key={unit.id} role="listitem"><div className="map-node" aria-hidden="true"><span>{unit.icon}</span><i>{index + 1}</i></div><div className="knowledge-unit-card"><header><div><small>第 {index + 1} 单元</small><h3>{unit.title}</h3></div><em>{available ? "可以练习" : "内容准备中"}</em></header><p>{unit.description}</p><div className="knowledge-points" aria-label="核心知识点">{unit.knowledgePoints.map((point, pointIndex) => <span key={point}><i>{pointIndex + 1}</i>{point}</span>)}</div>{available ? <button onClick={() => onStart(index)} type="button">开始本单元 →</button> : <button disabled type="button">题库持续补充</button>}</div></article>; })}</div></section>
    <aside className="bank-note"><span>🧠</span><div><strong>这节课已经使用统一题库格式</strong><p>题目包含等级、学科、知识点、难度、答案和解析，以后可以直接接入智能出题与错题复习。</p></div></aside>
  </div>;
}

function TaskPanel({ completedTasks, questions, courses, onOpen, onGoCourse, standalone = false, previewCount, onViewAll }: { completedTasks: number[]; questions: QuestionItem[]; courses: Course[]; onOpen: (index: number) => void; onGoCourse?: (courseName: string) => void; standalone?: boolean; previewCount?: number; onViewAll?: () => void }) {
  const visibleQuestions = previewCount ? questions.slice(0, previewCount) : questions;
  const groups = useMemo(() => {
    const order: string[] = [];
    const bySubject: Record<string, number[]> = {};
    visibleQuestions.forEach((question, index) => {
      if (!bySubject[question.subject]) { bySubject[question.subject] = []; order.push(question.subject); }
      bySubject[question.subject].push(index);
    });
    return order.map((subject) => ({ subject, indices: bySubject[subject] }));
  }, [visibleQuestions]);
  return <div className={`${standalone ? "task-panel standalone" : "task-panel"}${previewCount ? " task-panel-preview" : ""}`}><div className="section-heading compact"><div><span className="section-kicker">{previewCount ? "先从眼前的三小步开始" : "为你精心准备的今日挑战"}</span><h2>{previewCount ? "接下来学什么" : "今日学习路线"}</h2></div><span className="task-count">{completedTasks.length} / {questions.length} 完成</span></div>{groups.map((group) => { const course = courses.find((item) => item.name === group.subject); return <section className="task-group" key={group.subject}><header><strong><span className="group-course-icon" aria-hidden="true">{course?.icon ?? "📘"}</span>{group.subject}</strong><span>{course?.description ?? "今日学习内容"}</span><em>{group.indices.length}站</em>{onGoCourse && <button className="group-go-course" onClick={() => onGoCourse(group.subject)} type="button">进入课程 →</button>}</header><div className="task-list">{group.indices.map((index) => { const question = questions[index]; const done = completedTasks.includes(index); const look = getTaskLook(question); return <button className={done ? "task-row done" : "task-row"} key={question.id} onClick={() => onOpen(index)} type="button"><span className={`task-icon ${look.color}`}>{done ? "✓" : look.icon}</span><span><strong>{question.title}</strong><small>{done ? "完成得很棒，可以再次练习" : `${question.knowledgePoint}`}</small></span><em>{look.minutes}</em><b>{done ? "复习" : index === 0 ? "开始" : "›"}</b></button>; })}</div></section>; })}{previewCount && onViewAll && <footer className="task-preview-footer"><div><span aria-hidden="true">🚂</span><p><strong>完整路线共有 {questions.length} 站</strong><small>学习内容没有减少，按自己的节奏慢慢完成。</small></p></div><button onClick={onViewAll} type="button">查看完整路线 →</button></footer>}</div>;
}

function PageTitle({ eyebrow, title, subtitle, icon }: { eyebrow: string; title: string; subtitle: string; icon: string }) {
  return <header className="page-title"><span className="page-title-icon">{icon}</span><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div></header>;
}

function PlanModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" aria-label="关闭" onClick={onClose} type="button">×</button><span className="section-kicker">没有限时试用，购买后永久使用</span><h2 id="plan-title">选择适合你家的成长方案</h2><div className="plan-grid">{products.map((product) => <article className={product.accent ? "plan-card featured" : "plan-card"} key={product.name}>{product.accent && <span className="recommended">最受欢迎</span>}<h3>{product.name}</h3><strong><small>¥</small>{product.price}</strong><p>{product.note}</p><button type="button">选择此方案</button></article>)}</div><p className="upgrade-note">以后每增加一个等级仅需 ¥19.9，已支付金额可抵扣全级版。</p></section></div>;
}

function LessonModal({ question, notice, selectedAnswer, answerState, aiLoading, onSelect, onCheck, onSmartNext, onFinish, onClose }: { question: QuestionItem; notice: string | null; selectedAnswer: string | null; answerState: "correct" | "wrong" | null; aiLoading: boolean; onSelect: (answer: string) => void; onCheck: () => void; onSmartNext: () => void; onFinish: () => void; onClose: () => void }) {
  const isEarlyLearner = /^(G1|G2|G3)(?:$|-)/.test(question.grade);
  const englishPlaybackRate = getEnglishPlaybackRate(question.grade);
  const promptLanguage = getTtsLanguage(question.prompt);
  const previewVocabulary = question.subject.includes("英语") ? question.vocabulary?.slice(0, 3) ?? [] : [];
  return <div className="modal-backdrop lesson-backdrop" role="presentation" onMouseDown={onClose}><section className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title" onMouseDown={(event) => event.stopPropagation()}><button className="lesson-close" aria-label="退出练习" onClick={onClose} type="button">×</button><div className="lesson-top"><span>🦌</span><div><small>{question.eyebrow}</small><strong id="lesson-title">{question.title}</strong></div><em>{question.source === "ai_generated" ? "智能变式题" : `${question.estimatedMinutes ?? 3}分钟`}</em></div><div className="lesson-progress"><i /></div>{notice && <div className={question.source === "ai_generated" ? "practice-notice ai" : "practice-notice"}><span>{question.source === "ai_generated" ? "✨" : "🛟"}</span>{notice}</div>}<div className={`question-card ${question.activityKind === "storybook" ? "storybook-question" : ""}`}>{question.mathModel ? <MathModel question={question} /> : <LearningVisual visual={question.visual} />}<div className="question-prompt"><h2>{question.prompt}</h2><TtsButton text={question.prompt} language={promptLanguage} playbackRate={promptLanguage === "en" ? englishPlaybackRate : 1} segment="sentence" label="听题目" autoPlay={isEarlyLearner} /></div>{previewVocabulary.length > 0 && <div className="preanswer-audio"><span>先听重点词</span>{previewVocabulary.map((item) => <TtsButton key={item.term} text={cleanEnglishSpeech(item.term)} playbackRate={englishPlaybackRate} segment="word" label={`听 ${item.term}`} />)}</div>}{question.activityKind === "trace" ? <TracePractice letters={question.traceLetter ?? question.visual} done={selectedAnswer === "done"} onDone={() => onSelect("done")} /> : <QuestionAnswer question={question} selectedAnswer={selectedAnswer} answerState={answerState} onSelect={onSelect} />}{answerState && <><FeedbackTone state={answerState} /><div className={answerState === "correct" ? "answer-feedback correct" : "answer-feedback wrong"}><span>{answerState === "correct" ? "🌟" : "🌱"}</span><div><p>{question.explanation}</p>{answerState === "wrong" && <small>正确答案：{formatAnswer(question.answer)}</small>}</div></div><OptionAnalysis question={question} selectedAnswer={selectedAnswer} /></>}{answerState && question.vocabulary && <DictionaryExpansion question={question} />}</div>{answerState ? <div className="lesson-actions"><button className="lesson-submit" onClick={onFinish} type="button">完成本题</button><button className="lesson-smart-next" onClick={onSmartNext} disabled={aiLoading} type="button">{aiLoading ? "智能出题中…" : "✨ 再来一道智能题"}</button></div> : <button className="lesson-submit" disabled={!selectedAnswer} onClick={onCheck} type="button">{question.activityKind === "trace" ? "完成描写" : "提交答案"}</button>}</section></div>;
}

function LearningVisual({ visual }: { visual: string }) {
  if (!visual.startsWith("LETTER_ART:")) return <span className="question-visual">{visual}</span>;
  const [, upper, lower, icon, word] = visual.split(":");
  const hue = ((upper.charCodeAt(0) - 65) * 23 + 92) % 360;
  return <div className="question-visual letter-art" style={{ "--letter-hue": hue } as React.CSSProperties} aria-label={`卡通字母 ${upper} ${lower}`}><span className="letter-spark one">★</span><span className="letter-spark two">✦</span><strong>{upper}</strong><strong>{lower}</strong><span className="letter-friend">{icon}<small>{word}</small></span></div>;
}

function OptionAnalysis({ question, selectedAnswer }: { question: QuestionItem; selectedAnswer: string | null }) {
  if (question.options.length < 2) return null;
  const fallback = (option: string) => option === question.answer
    ? question.explanation
    : question.subject.includes("英语")
      ? `“${cleanEnglishSpeech(option)}”没有表达本题要求的“${question.knowledgePoint}”，与题目情境不匹配。`
      : `这个选项与题干中的关键条件不一致，因此可以排除。`;

  return <section className="option-analysis" aria-label="逐项选项解析"><header><span>🔎</span><div><small>不只记住答案</small><strong>逐项选项解析</strong></div></header><div>{question.options.map((option, index) => { const correct = option === question.answer; const chosen = option === selectedAnswer; return <article className={correct ? "correct" : "wrong"} key={option}><span>{correct ? "✓" : "×"}</span><div><strong>{String.fromCharCode(65 + index)}．{option}{chosen && <em>你的选择</em>}</strong><p>{question.optionExplanations?.[option] ?? fallback(option)}</p></div></article>; })}</div></section>;
}

function TracePractice({ letters, done, onDone }: { letters: string; done: boolean; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current; if (!canvas) return [0, 0] as const; const rect = canvas.getBoundingClientRect(); return [(event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height] as const; };
  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => { const context = canvasRef.current?.getContext("2d"); if (!context) return; drawingRef.current = true; const [x, y] = point(event); context.beginPath(); context.moveTo(x, y); event.currentTarget.setPointerCapture(event.pointerId); };
  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => { if (!drawingRef.current) return; const context = canvasRef.current?.getContext("2d"); if (!context) return; const [x, y] = point(event); context.lineWidth = 14; context.lineCap = "round"; context.strokeStyle = "#ef8aa8"; context.lineTo(x, y); context.stroke(); onDone(); };
  const stop = () => { drawingRef.current = false; };
  const clear = () => { const canvas = canvasRef.current; if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height); };
  return <section className="trace-practice"><div className="trace-board"><span>{letters}</span><canvas ref={canvasRef} width={900} height={320} onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} aria-label={`描写字母 ${letters}`} /></div><div><small>{done ? "已经留下笔迹，可以提交啦！" : "用手指或鼠标沿着浅色字母描一描"}</small><button onClick={clear} type="button">清除重写</button></div></section>;
}

function MathModel({ question }: { question: QuestionItem }) {
  const model = question.mathModel;
  if (!model) return null;
  return <section className={`math-model ${model.kind}`}><header><span>🧩</span><div><small>数量关系图</small><strong>{model.title}</strong></div></header>{model.kind === "circle" ? <div className="circle-diagram" aria-label="圆形半径示意图"><div className="circle-shape"><i /><b>r＝{model.values[0]?.value}</b></div><div className="circle-facts">{model.values.map((item) => <span key={item.label}><small>{item.label}</small><strong>{item.value}</strong></span>)}</div></div> : <div className="math-steps">{model.values.map((item, index) => <div key={item.label}><small>{item.label}</small><strong>{item.value}</strong>{index < model.values.length - 1 && <i>→</i>}</div>)}</div>}<footer><small>关系式</small><strong>{model.relation}</strong></footer></section>;
}

function QuestionAnswer({ question, selectedAnswer, answerState, onSelect }: { question: QuestionItem; selectedAnswer: string | null; answerState: "correct" | "wrong" | null; onSelect: (answer: string) => void }) {
  if (question.type === "fill_blank") return <div className="fill-answer"><label htmlFor={`answer-${question.id}`}>填写答案</label><input id={`answer-${question.id}`} value={selectedAnswer ?? ""} onChange={(event) => onSelect(event.target.value)} disabled={answerState !== null} placeholder="在这里输入英文答案" autoComplete="off" /></div>;
  if (question.type === "ordering") {
    const picked = selectedAnswer ? selectedAnswer.split(" | ") : [];
    const available = question.options.filter((option) => !picked.includes(option));
    return <div className="ordering-answer"><div className={picked.length ? "order-slot has-answer" : "order-slot"}>{picked.length ? picked.map((word, index) => <button onClick={() => onSelect(picked.filter((_, itemIndex) => itemIndex !== index).join(" | "))} disabled={answerState !== null} type="button" key={`${word}-${index}`}>{word}<span>×</span></button>) : <span>按顺序点击下方词语</span>}</div><div className="word-bank">{available.map((word) => <button onClick={() => onSelect([...picked, word].join(" | "))} disabled={answerState !== null} type="button" key={word}>{word}</button>)}</div></div>;
  }
  if (question.type === "matching" && question.matchingPairs) {
    const selections = Object.fromEntries((selectedAnswer ?? "").split(" || ").filter(Boolean).map((pair) => pair.split("=")));
    const choices = [...question.matchingPairs.map((pair) => pair.right)].reverse();
    const updateMatch = (left: string, right: string) => {
      const next = { ...selections, [left]: right };
      onSelect(question.matchingPairs?.map((pair) => `${pair.left.split(" ")[0]}=${next[pair.left.split(" ")[0]] ?? ""}`).filter((pair) => !pair.endsWith("=")).join(" || ") ?? "");
    };
    return <div className="matching-answer">{question.matchingPairs.map((pair) => { const key = pair.left.split(" ")[0]; return <label key={pair.left}><strong>{pair.left}</strong><span>配对</span><select value={selections[key] ?? ""} onChange={(event) => updateMatch(key, event.target.value)} disabled={answerState !== null}><option value="">请选择</option>{choices.map((choice) => <option value={choice} key={choice}>{choice}</option>)}</select></label>; })}</div>;
  }
  const answerClass = question.type === "true_false" ? "answer-grid true-false" : "answer-grid";
  const isEarlyLearner = /^(G1|G2|G3)(?:$|-)/.test(question.grade);
  const englishPlaybackRate = getEnglishPlaybackRate(question.grade);
  const canReadOptions = question.type !== "true_false" && (question.subject.includes("英语") || isEarlyLearner);
  const optionLabels = ["A", "B", "C", "D"];
  return <div className={`${answerClass} ${canReadOptions ? "with-audio" : ""}`}>{question.options.map((option, index) => {
    const speechText = cleanEnglishSpeech(option);
    const answerButton = <button className={`answer-choice ${selectedAnswer === option ? "selected" : ""} ${answerState && option === question.answer ? "correct" : ""} ${answerState === "wrong" && selectedAnswer === option ? "wrong" : ""}`} onClick={() => onSelect(option)} disabled={answerState !== null} type="button">{question.type === "true_false" && <span>{option === "正确" ? "✓" : "×"}</span>}{option}</button>;
    if (!canReadOptions || !/[A-Za-z\u3400-\u9FFF]/.test(speechText)) return <div className="answer-option" key={option}>{answerButton}</div>;
    const optionLanguage = getTtsLanguage(speechText);
    return <div className="answer-option" key={option}>{answerButton}<TtsButton text={speechText} language={optionLanguage} playbackRate={optionLanguage === "en" ? englishPlaybackRate : 1} segment={speechText.includes(" ") ? "sentence" : "word"} label={`听选项${optionLabels[index] ?? index + 1}`} /></div>;
  })}</div>;
}

function cleanEnglishSpeech(text: string) {
  return text.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, " ").replace(/\s+/g, " ").trim();
}

function getTtsLanguage(text: string): "en" | "zh" {
  return /[\u3400-\u9FFF]/.test(text) ? "zh" : "en";
}

function getEnglishPlaybackRate(grade: string) {
  const gradeNumber = Number(grade.match(/G([1-8])/)?.[1] ?? 3);
  if (gradeNumber <= 2) return .75;
  if (gradeNumber <= 4) return .85;
  if (gradeNumber <= 6) return .9;
  return .95;
}

function DictionaryExpansion({ question }: { question: QuestionItem }) {
  const englishPlaybackRate = getEnglishPlaybackRate(question.grade);
  return <section className="dictionary-panel"><header><span>📖</span><div><small>本题词汇扩展</small><strong>AI 小词典</strong></div><em>{question.vocabulary?.length ?? 0} 个重点</em></header><div className="dictionary-grid">{question.vocabulary?.map((item) => <article className="dictionary-card" key={item.term}><div className="dictionary-term"><div><strong>{item.term}</strong>{item.phonetic && <span>{item.phonetic}</span>}</div><em>{item.tag}</em></div><p className="dictionary-meaning">{item.meaning}</p><div className="dictionary-audio-actions"><TtsButton text={item.term.replaceAll("...", "")} playbackRate={englishPlaybackRate} segment="word" label="听单词" /><TtsButton text={item.example} playbackRate={englishPlaybackRate} segment="sentence" label="听例句" /></div><p className="dictionary-expansion">💡 {item.expansion}</p><div className="dictionary-example"><strong>{item.example}</strong><span>{item.exampleMeaning}</span></div></article>)}</div>{question.grammarTip && <aside className="grammar-tip"><span>🧩</span><div><small>{question.grammarTip.title}</small><strong>{question.grammarTip.pattern}</strong><p>{question.grammarTip.explanation}</p></div></aside>}</section>;
}

function FeedbackTone({ state }: { state: "correct" | "wrong" }) {
  useEffect(() => {
    playFeedbackTone(state);
  }, [state]);

  return null;
}

function playFeedbackTone(state: "correct" | "wrong") {
  try {
    const AudioContextConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const notes = state === "correct"
      ? [{ frequency: 523.25, delay: 0, duration: .16 }, { frequency: 659.25, delay: .13, duration: .17 }, { frequency: 783.99, delay: .27, duration: .25 }]
      : [{ frequency: 493.88, delay: 0, duration: .2 }, { frequency: 392, delay: .17, duration: .3 }];

    notes.forEach(({ frequency, delay, duration }) => {
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = state === "correct" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(state === "correct" ? .055 : .035, start + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + .02);
    });

    window.setTimeout(() => void context.close(), 900);
  } catch {
    // Some browsers may block generated audio if the submit tap did not activate audio playback.
  }
}

function ParentCenter({ records, grade, completedTasks, totalTasks, onGarden }: { records: WrongRecord[]; grade: Grade; completedTasks: number; totalTasks: number; onGarden: () => void }) {
  const pending = records.filter((record) => !record.mastered).length;
  const mastered = records.filter((record) => record.mastered).length;
  const subjectStats = Object.entries(records.reduce<Record<string, number>>((stats, record) => {
    stats[record.question.subject] = (stats[record.question.subject] ?? 0) + record.attempts;
    return stats;
  }, {})).sort((a, b) => b[1] - a[1]);
  const knowledgeStats = Object.entries(records.reduce<Record<string, number>>((stats, record) => {
    stats[record.question.knowledgePoint] = (stats[record.question.knowledgePoint] ?? 0) + record.attempts;
    return stats;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const maxSubjectCount = Math.max(1, ...subjectStats.map(([, count]) => count));
  const focusSubject = subjectStats[0]?.[0];

  return <section className="page-surface parent-center-page">
    <PageTitle eyebrow="家长只看结果，不需要手动整理题目" title="家长中心" subtitle={`${grade.id} · ${grade.school} · 小鹿 Leo 的学习概览`} icon="🛡️" />
    <div className="parent-hero"><div><span>🦌</span><div><small>孩子档案</small><strong>小鹿 Leo</strong><p>{grade.age} · 当前学习等级 {grade.id}</p></div></div><button onClick={onGarden} type="button">查看孩子今天的复习 →</button></div>
    <div className="parent-metrics"><div><strong>{completedTasks}<small>/{totalTasks}</small></strong><span>今日任务</span></div><div><strong>{records.length}</strong><span>累计错题</span></div><div><strong>{pending}</strong><span>需要关注</span></div><div><strong>{mastered}</strong><span>已完成订正</span></div></div>
    <div className="parent-insight"><span>💡</span><div><strong>本周学习建议</strong><p>{pending > 0 ? `孩子目前有${pending}个知识点需要复习${focusSubject ? `，优先关注${focusSubject}` : ""}。系统已经放入复习花园，家长无需另外出题。` : "目前没有待订正题目，保持每天20～30分钟的轻量学习即可。"}</p></div></div>
    <section className="learning-report">
      <div className="section-heading compact"><div><span className="section-kicker">把错题翻译成家长能看懂的结论</span><h2>学习诊断</h2></div><span className="task-count">自动分析</span></div>
      {records.length === 0 ? <div className="report-empty"><span>🌱</span><div><strong>完成几道练习后，这里会出现学习诊断</strong><p>系统会按学科和知识点归纳薄弱项，不需要家长统计。</p></div></div> : <div className="report-grid">
        <div className="subject-report"><h3>需要关注的学科</h3>{subjectStats.map(([subject, count], index) => <div className="subject-bar" key={subject}><div><strong>{subject}</strong><span>{index === 0 ? "优先关注" : `${count}次错答`}</span></div><i><b style={{ width: `${Math.max(18, Math.round(count / maxSubjectCount * 100))}%` }} /></i></div>)}</div>
        <div className="knowledge-report"><h3>薄弱知识点</h3>{knowledgeStats.map(([point, count], index) => <article key={point}><span>{index + 1}</span><div><strong>{point}</strong><small>累计错答 {count} 次</small></div><em>{index === 0 ? "本周重点" : "持续观察"}</em></article>)}</div>
      </div>}
    </section>
    <section className="archive-panel"><div className="section-heading compact"><div><span className="section-kicker">仅供家长查看，不在这里做题</span><h2>错题档案</h2></div><span className="task-count">{records.length} 条记录</span></div>{records.length === 0 ? <p className="archive-empty">孩子答错后，题目、错误答案、知识点和订正状态会自动归档到这里。</p> : <div className="archive-list">{records.map((record) => <article className="archive-card" key={record.question.id}><div><span>{record.mastered ? "✅" : "⚠️"}</span><div><small>{record.question.grade} · {record.question.subject}</small><strong>{record.question.knowledgePoint}</strong><p>{record.question.title}</p></div></div><dl><div><dt>错误答案</dt><dd>{record.selectedAnswer}</dd></div><div><dt>正确答案</dt><dd>{record.question.answer}</dd></div><div><dt>错误次数</dt><dd>{record.attempts}次</dd></div><div><dt>当前状态</dt><dd>{record.mastered ? "已订正，等待巩固" : "待复习"}</dd></div></dl></article>)}</div>}<p className="device-note">🔒 试用版档案保存在当前设备；正式账号版将支持家庭多设备同步。</p></section>
  </section>;
}

function ReviewGarden({ records, loadingId, onRetry, onSmartPractice, onCourse }: { records: WrongRecord[]; loadingId: string | null; onRetry: (record: WrongRecord) => void; onSmartPractice: (record: WrongRecord) => void; onCourse: () => void }) {
  const now = SESSION_NOW;
  const due = records.filter((record) => !record.mastered || (record.nextReviewAt ? new Date(record.nextReviewAt).getTime() <= now : false));
  const upcoming = records.filter((record) => record.mastered && record.nextReviewAt && new Date(record.nextReviewAt).getTime() > now);
  const completed = records.filter((record) => record.mastered && !record.nextReviewAt);
  const relativeDay = (date: string | null | undefined) => {
    if (!date) return "复习完成";
    const days = Math.max(1, Math.ceil((new Date(date).getTime() - now) / 86400000));
    return `${days}天后`;
  };
  return <section className="page-surface review-garden-page"><PageTitle eyebrow="系统替家长记住什么时候复习" title="复习花园" subtitle="答错当天订正，答对后在1天、3天、7天再次巩固" icon="🌷" /><div className="garden-summary"><div><span>🌱</span><strong>{due.length}</strong><small>今天待复习</small></div><div><span>🌿</span><strong>{upcoming.length}</strong><small>后续已安排</small></div><div><span>🌳</span><strong>{completed.length}</strong><small>完成复习周期</small></div></div><div className="review-timeline"><div className="active"><span>今天</span><strong>发现错误并订正</strong></div><i>→</i><div><span>1天后</span><strong>第一次巩固</strong></div><i>→</i><div><span>3天后</span><strong>第二次巩固</strong></div><i>→</i><div><span>7天后</span><strong>长期记忆检查</strong></div></div>{records.length === 0 ? <div className="wrong-empty"><span>🌼</span><h2>花园还没有复习任务</h2><p>孩子答错题目后，系统会自动在这里种下一株“复习小苗”。</p><button onClick={onCourse} type="button">去完成一节课程</button></div> : <><section className="garden-section"><div className="garden-heading"><div><span>☀️</span><div><small>今日任务</small><h2>现在可以复习</h2></div></div><em>{due.length}题</em></div>{due.length === 0 ? <p className="garden-clear">今天的复习已经完成，可以休息一下啦。</p> : <div className="garden-cards">{due.map((record) => <article key={record.question.id}><span>📝</span><div><small>{record.question.grade} · {record.question.subject}</small><strong>{record.question.knowledgePoint}</strong><p>{record.question.title}</p></div><div className="garden-actions"><button onClick={() => onRetry(record)} type="button">复习原题</button><button className="smart-practice" onClick={() => onSmartPractice(record)} disabled={loadingId !== null} type="button">{loadingId === record.question.id ? "正在出题…" : "✨ 智能加练"}</button></div></article>)}</div>}</section><section className="garden-section"><div className="garden-heading"><div><span>🗓️</span><div><small>自动安排</small><h2>接下来的复习</h2></div></div><em>{upcoming.length}题</em></div>{upcoming.length === 0 ? <p className="garden-clear">暂无等待中的任务。</p> : <div className="garden-cards upcoming">{upcoming.map((record) => <article key={record.question.id}><span>🌿</span><div><small>{relativeDay(record.nextReviewAt)} · 第{(record.reviewStage ?? 0) + 1}次巩固</small><strong>{record.question.knowledgePoint}</strong><p>{record.question.title}</p></div><em>等待开放</em></article>)}</div>}</section></>}
  </section>;
}

function FeaturePage({ name, onBack }: { name: string; onBack: () => void }) {
  const details: Record<string, [string, string, string]> = {
    "绘本馆": ["📖", "绘本馆正在搬进新森林", "下一阶段将接入分级绘本、女声朗读和阅读理解。"],
    "学习计划": ["🗺️", "学习计划正在升级", "不再局限60天，可以按孩子的等级和节奏自动安排。"],
    "复习花园": ["🌷", "复习花园正在播种", "G1、G2用温和的成长观察安排重复练习。"],
    "错题本": ["🎒", "智能错题本正在整理", "G3至G8会自动分析知识点并安排1天、3天、7天复习。"],
    "贴纸册": ["✨", "贴纸册正在布置", "完成学习后可以获得并单独收藏每一张贴纸。"],
    "家长中心": ["🛡️", "家长中心正在建设", "将包含孩子档案、已购等级、学习报告和家庭版权益。"],
  };
  const detail = details[name] ?? ["🌳", name, "这个森林车站正在建设。"];
  return <section className="page-surface feature-page"><span>{detail[0]}</span><h1>{detail[1]}</h1><p>{detail[2]}</p><button onClick={onBack} type="button">返回首页</button></section>;
}
