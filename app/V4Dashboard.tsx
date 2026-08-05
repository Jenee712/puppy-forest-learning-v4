"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getCourseQuestions, getDailyQuestion, type QuestionItem } from "../data/questionBank";

type Grade = { id: string; age: string; school: string; icon: string; color: string; focus: string };
type Course = { icon: string; name: string; description: string; units: number; progress: number; color: string };
type WrongRecord = { question: QuestionItem; selectedAnswer: string; attempts: number; mastered: boolean; lastWrongAt: string; reviewStage?: number; nextReviewAt?: string | null };

const grades: Grade[] = [
  { id: "G1", age: "3–4岁", school: "幼儿启蒙", icon: "🌱", color: "mint", focus: "表达、感知与好习惯" },
  { id: "G2", age: "5–6岁", school: "幼小衔接", icon: "🌿", color: "leaf", focus: "思维、规则与入学准备" },
  { id: "G3", age: "7岁", school: "小学一年级", icon: "🌼", color: "sun", focus: "拼音、数感与学习习惯" },
  { id: "G4", age: "8岁", school: "小学二年级", icon: "🌳", color: "sky", focus: "阅读、运算与观察" },
  { id: "G5", age: "9岁", school: "小学三年级", icon: "🦋", color: "lilac", focus: "写作、应用题与英语" },
  { id: "G6", age: "10岁", school: "小学四年级", icon: "🚂", color: "peach", focus: "理解、推理与表达" },
  { id: "G7", age: "11岁", school: "小学五年级", icon: "✈️", color: "blue", focus: "综合应用与自主学习" },
  { id: "G8", age: "12岁", school: "小学六年级", icon: "⛰️", color: "rose", focus: "归纳、衔接与能力进阶" },
];

const navGroups = [
  { label: "学习列车", items: [["🏡", "首页"], ["☀️", "今日学习"], ["🧩", "课程中心"], ["📖", "绘本馆"], ["🗺️", "学习计划"]] },
  { label: "森林乐园", items: [["🌷", "复习花园"], ["✨", "贴纸册"], ["🛡️", "家长中心"]] },
];

const taskLooks = [
  { icon: "📚", minutes: "7分钟", color: "pink" },
  { icon: "🧮", minutes: "8分钟", color: "blue" },
  { icon: "🔤", minutes: "6分钟", color: "yellow" },
];

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
  ];
}

export function V4Dashboard() {
  const [activeNav, setActiveNav] = useState("首页");
  const [selectedGrade, setSelectedGrade] = useState("G3");
  const [showPlans, setShowPlans] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"correct" | "wrong" | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [wrongRecords, setWrongRecords] = useState<WrongRecord[]>([]);
  const [recordsReady, setRecordsReady] = useState(false);
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [practiceNotice, setPracticeNotice] = useState<string | null>(null);

  const currentGrade = useMemo(() => grades.find((grade) => grade.id === selectedGrade) ?? grades[2], [selectedGrade]);
  const courses = useMemo(() => getCourses(selectedGrade), [selectedGrade]);
  const dailyQuestions = useMemo(() => [0, 1, 2].map((index) => getDailyQuestion(index, selectedGrade)), [selectedGrade]);
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

  const openSmartPractice = async (record: WrongRecord) => {
    setAiLoadingId(record.question.id);
    try {
      const response = await fetch("/api/generate-question", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grade: record.question.grade, subject: record.question.subject, knowledgePoint: record.question.knowledgePoint, difficulty: record.question.difficulty, avoidTitles: [record.question.title] }) });
      const data = await response.json() as { question?: QuestionItem; fallback?: boolean; reason?: string };
      if (!response.ok || !data.question) throw new Error("generate_failed");
      setActiveQuestion(data.question);
      setPracticeNotice(data.fallback ? (data.reason ?? "已切换到本地核心题") : "已根据这个薄弱知识点生成一道新题");
    } catch {
      setActiveQuestion(record.question);
      setPracticeNotice("网络暂时不稳定，先复习原题");
    } finally {
      setActiveTaskIndex(null);
      setSelectedAnswer(null);
      setAnswerState(null);
      setAiLoadingId(null);
    }
  };

  const finishTask = () => {
    if (activeTaskIndex !== null) {
      setCompletedTasks((current) => current.includes(activeTaskIndex) ? current : [...current, activeTaskIndex]);
    }
    setActiveQuestion(null);
    setActiveTaskIndex(null);
    setPracticeNotice(null);
  };

  const goTo = (label: string) => {
    setActiveNav(label);
    if (label !== "课程中心") setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeGrade = (grade: string) => {
    setSelectedGrade(grade);
    setCompletedTasks([]);
    setSelectedCourse(null);
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
        <div className="profile-card"><span className="deer" aria-hidden="true">🦌</span><div><strong>小鹿 Leo</strong><small>{selectedGrade} · 连续6天</small></div><button aria-label="进入家长中心" onClick={() => goTo("家长中心")} type="button">›</button></div>
      </aside>

      <main>
        <header className="topbar">
          <div className="mobile-brand"><span>🐶</span>森林学堂</div>
          <div className="progress-wrap"><span>今日 {completedTasks.length * 7 + 5} / 30 分钟</span><div className="progress"><i style={{ width: `${Math.min(100, 18 + completedTasks.length * 27)}%` }} /></div></div>
          <div className="top-actions"><button className="coin" type="button">🪙 {42 + completedTasks.length * 5}</button><button className="parent-button" onClick={() => goTo("家长中心")} type="button">家长中心</button></div>
        </header>

        <div className="content">
          {activeNav === "首页" && (
            <>
              <section className="visual-hero" aria-label="小狗的森林学堂主视觉">
                <Image src="/og.png" alt="小狗、小猫和小兔在森林里一起学习，小火车从身边经过" width={1200} height={630} priority unoptimized />
                <div className="visual-hero-action"><div><span>下午好，小鹿 Leo</span><strong>今天有 {3 - completedTasks.length} 个森林任务</strong></div><button onClick={() => goTo("今日学习")} type="button">开始学习 <b>→</b></button></div>
              </section>
              <GradeRoute currentGrade={currentGrade} selectedGrade={selectedGrade} onSelect={changeGrade} />
              <section className="lower-grid">
                <TaskPanel completedTasks={completedTasks} questions={dailyQuestions} onOpen={openTask} />
                <div className="smart-panel"><span className="ai-badge">✨ 智能学习伙伴</span><h2>家长不用找题</h2><p>核心题库保证基础，DeepSeek按薄弱知识点生成练习，答错后自动进入复习计划。</p><div className="smart-flow"><span>📚<small>核心题库</small></span><i>→</i><span>🧠<small>智能出题</small></span><i>→</i><span>🌷<small>自动复习</small></span></div><button onClick={() => setShowPlans(true)} type="button">查看永久解锁方案</button></div>
              </section>
            </>
          )}

          {activeNav === "今日学习" && (
            <section className="page-surface today-page">
              <PageTitle eyebrow="系统已经为孩子准备好了" title="今日学习" subtitle={`${currentGrade.id} · ${currentGrade.school} · 预计21分钟`} icon="☀️" />
              <div className="today-summary"><div><strong>{completedTasks.length}<small>/ 3</small></strong><span>今日完成</span></div><div><strong>{42 + completedTasks.length * 5}</strong><span>森林金币</span></div><div><strong>6</strong><span>连续学习</span></div></div>
              <TaskPanel completedTasks={completedTasks} questions={dailyQuestions} onOpen={openTask} standalone />
              <div className="gentle-note"><span>🌿</span><div><strong>学完记得看远处、活动一下</strong><p>每完成一个任务，系统会根据表现调整下一次练习。</p></div></div>
            </section>
          )}

          {activeNav === "课程中心" && (
            <section className="page-surface course-page">
              {selectedCourse ? (
                <CourseDetail course={selectedCourse} grade={currentGrade} onBack={() => setSelectedCourse(null)} onStart={(lessonIndex) => openCourse(selectedCourse, lessonIndex)} />
              ) : (
                <>
                  <PageTitle eyebrow="按年龄和能力逐级成长" title="课程中心" subtitle="课程不是固定60天，可以按孩子的节奏持续学习" icon="🧩" />
                  <div className="course-grade-switcher">{grades.map((grade) => <button className={selectedGrade === grade.id ? "active" : ""} key={grade.id} onClick={() => changeGrade(grade.id)} type="button"><span>{grade.icon}</span><strong>{grade.id}</strong><small>{grade.school}</small></button>)}</div>
                  <div className="course-intro"><div><span>{currentGrade.icon}</span><div><strong>{currentGrade.id} · {currentGrade.school}</strong><p>{currentGrade.age} · {currentGrade.focus}</p></div></div><button onClick={() => setShowPlans(true)} type="button">查看解锁权益</button></div>
                  <div className="course-grid">{courses.map((course) => <article className={`course-card ${course.color}`} key={course.name}><span className="course-icon">{course.icon}</span><div className="course-card-head"><div><h3>{course.name}</h3><p>{course.description}</p></div><em>{course.units}课</em></div><div className="course-progress"><i style={{ width: `${course.progress}%` }} /></div><footer><span>已完成 {course.progress}%</span><button onClick={() => { setSelectedCourse(course); window.scrollTo({ top: 0, behavior: "smooth" }); }} type="button">进入课程 →</button></footer></article>)}</div>
                </>
              )}
            </section>
          )}

          {activeNav === "复习花园" && <ReviewGarden records={wrongRecords} loadingId={aiLoadingId} onRetry={retryWrongQuestion} onSmartPractice={openSmartPractice} onCourse={() => goTo("课程中心")} />}
          {activeNav === "家长中心" && <ParentCenter records={wrongRecords} grade={currentGrade} completedTasks={completedTasks.length} onGarden={() => goTo("复习花园")} />}

          {!["首页", "今日学习", "课程中心", "复习花园", "家长中心"].includes(activeNav) && <FeaturePage name={activeNav} onBack={() => goTo("首页")} />}

          {showPlans && <PlanModal onClose={() => setShowPlans(false)} />}
          {activeQuestion && <LessonModal question={activeQuestion} notice={practiceNotice} selectedAnswer={selectedAnswer} answerState={answerState} onSelect={(answer) => { setSelectedAnswer(answer); setAnswerState(null); }} onCheck={checkAnswer} onFinish={finishTask} onClose={() => { setActiveQuestion(null); setActiveTaskIndex(null); setPracticeNotice(null); }} />}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="手机导航">
        {[["🏡", "首页", "首页"], ["☀️", "今日", "今日学习"], ["🧩", "课程", "课程中心"], ["📖", "绘本", "绘本馆"], ["🌷", pendingWrongCount > 0 ? `复习${pendingWrongCount}` : "复习", "复习花园"], ["🛡️", "我的", "家长中心"]].map(([icon, label, target]) => <button className={activeNav === target ? "active" : ""} key={target} onClick={() => goTo(target)} type="button"><span>{icon}</span>{label}</button>)}
      </nav>
    </div>
  );
}

function GradeRoute({ currentGrade, selectedGrade, onSelect }: { currentGrade: Grade; selectedGrade: string; onSelect: (grade: string) => void }) {
  return <section className="grade-section"><div className="section-heading"><div><span className="section-kicker">为孩子选择合适的起点</span><h2>八级成长路线</h2></div><div className="current-pill">当前：{currentGrade.icon} {currentGrade.id} · {currentGrade.school}</div></div><div className="grade-grid">{grades.map((grade) => <button className={`grade-card ${grade.color} ${selectedGrade === grade.id ? "selected" : ""}`} key={grade.id} onClick={() => onSelect(grade.id)} type="button"><span className="grade-icon">{grade.icon}</span><strong>{grade.id}</strong><b>{grade.school}</b><small>{grade.age}</small><p>{grade.focus}</p>{selectedGrade === grade.id && <i>已选择</i>}</button>)}</div></section>;
}

function CourseDetail({ course, grade, onBack, onStart }: { course: Course; grade: Grade; onBack: () => void; onStart: (lessonIndex: number) => void }) {
  const lessonNames: Record<string, string[]> = {
    "语言表达": ["看图说一句完整的话", "按顺序讲清楚", "听故事回答问题", "介绍我喜欢的东西"],
    "数量与空间": ["点一点：5以内数量", "认识圆形和方形", "上下左右在哪里", "发现重复的规律"],
    "科学探索": ["什么东西会长大", "植物需要什么", "天气观察日记", "会浮还是会沉"],
    "健康习惯": ["吃东西前先洗手", "保护牙齿的方法", "安全过马路", "运动后补充水分"],
    "社会认知": ["不小心时说对不起", "轮流玩更开心", "认识自己的情绪", "一起完成小任务"],
    "艺术创造": ["黄色和蓝色的魔法", "听节奏拍一拍", "用形状拼小动物", "画出快乐的一天"],
    "英语兴趣": ["A a 和 apple", "B b 和 ball", "C c 和 cat", "唱一首字母歌"],
    "英语": ["I like... 我喜欢", "This is... 这是什么", "我的家庭成员", "读懂一段小短文"],
    "语文": ["春天里的好词语", "读懂一句完整的话", "看图写两句话", "故事人物做了什么"],
    "数学": ["积木还剩多少块", "用图画理解应用题", "认识常见图形", "发现数列规律"],
    "科学": ["植物怎样吸收水", "光和影子的变化", "声音是怎样产生的", "记录一次小实验"],
    "阅读与表达": ["从句子里找线索", "概括故事的主要内容", "说清楚自己的观点", "写一段观察记录"],
    "综合素养": ["先倾听再表达", "安排我的学习时间", "生活中的分类", "合作解决一个问题"],
  };
  let lessons = lessonNames[course.name] ?? ["第一课：认识新知识", "第二课：动手练一练", "第三课：生活中找一找", "第四课：闯关复习"];
  if (course.name === "英语兴趣" && grade.id === "G1") lessons = ["A a 和 apple", "B b 和 ball", "C c 和 cat", "D d 和 dog"];
  if (course.name === "英语兴趣" && grade.id === "G2") lessons = ["A a 和 apple", "早上好 Good morning", "礼貌表达 Thank you", "介绍自己的名字"];
  if (course.name === "英语兴趣" && grade.id === "G3") lessons = ["B b 和 ball", "生活中的颜色词", "物品在哪里", "数字和数量表达"];
  if (course.name === "英语兴趣" && grade.id === "G4") lessons = ["B b 和 ball", "用 can 表达能力", "询问和回答喜好", "介绍我的家庭"];
  if (course.name === "英语" && grade.id === "G5") lessons = ["一般现在时与日常作息", "第三人称单数变化", "读懂校园活动对话", "写出我的一天"];
  if (course.name === "英语" && grade.id === "G6") lessons = ["现在正在发生什么", "一般现在时与现在进行时", "听懂方向和地点", "阅读一封简短邮件"];
  if (course.name === "英语" && grade.id === "G7") lessons = ["用过去时讲一次旅行", "规则与不规则动词", "比较人物和事物", "从短文中提取关键信息"];
  if (course.name === "英语" && grade.id === "G8") lessons = ["整合信息并作出推断", "计划、变化与原因", "在语境中判断时态", "阅读短文并概括主旨"];
  if (course.name === "数学" && grade.id === "G8") lessons = ["百分数与折扣综合应用", "比与比例解决问题", "圆的周长和面积", "用方程表示数量关系"];
  if (course.name === "语文" && grade.id === "G8") lessons = ["判断观点与支撑依据", "概括段落和文章主旨", "品味关键语句的表达效果", "根据材料表达完整观点"];
  const availableLessons = Math.min(getCourseQuestions(course.name, grade.id).length, lessons.length);

  return <div className="course-detail">
    <button className="course-back" onClick={onBack} type="button">← 返回课程中心</button>
    <header className={`course-detail-hero ${course.color}`}><span>{course.icon}</span><div><small>{grade.id} · {grade.school}</small><h1>{course.name}</h1><p>{course.description} · 共{course.units}课</p></div><button onClick={() => onStart(0)} type="button">开始第1课 →</button></header>
    <div className="course-detail-summary"><div><strong>{course.progress}%</strong><span>当前进度</span></div><div><strong>约8分钟</strong><span>每课时长</span></div><div><strong>本地核心题库</strong><span>内容来源</span></div></div>
    <section className="unit-panel"><div className="section-heading compact"><div><span className="section-kicker">循序渐进，不用一次学完</span><h2>第一单元</h2></div><span className="task-count">{availableLessons} / {lessons.length} 开放</span></div><div className="unit-list">{lessons.map((lesson, index) => { const available = index < availableLessons; return <article className={available ? "unit-row current" : "unit-row locked"} key={lesson}><span>{available ? "🌟" : "🌱"}</span><div><small>第 {index + 1} 课</small><strong>{lesson}</strong><p>{available ? "互动练习 + AI小词典 + 句型解析" : "完成本单元题库后按顺序开放"}</p></div>{available ? <button onClick={() => onStart(index)} type="button">进入第{index + 1}课</button> : <em>即将开放</em>}</article>; })}</div></section>
    <aside className="bank-note"><span>🧠</span><div><strong>这节课已经使用统一题库格式</strong><p>题目包含等级、学科、知识点、难度、答案和解析，以后可以直接接入智能出题与错题复习。</p></div></aside>
  </div>;
}

function TaskPanel({ completedTasks, questions, onOpen, standalone = false }: { completedTasks: number[]; questions: QuestionItem[]; onOpen: (index: number) => void; standalone?: boolean }) {
  return <div className={standalone ? "task-panel standalone" : "task-panel"}><div className="section-heading compact"><div><span className="section-kicker">系统已按当前等级匹配难度</span><h2>今日学习任务</h2></div><span className="task-count">{completedTasks.length} / 3 完成</span></div><div className="task-list">{questions.map((question, index) => { const done = completedTasks.includes(index); const look = taskLooks[index] ?? taskLooks[0]; return <button className={done ? "task-row done" : "task-row"} key={question.id} onClick={() => onOpen(index)} type="button"><span className={`task-icon ${look.color}`}>{done ? "✓" : look.icon}</span><span><strong>{question.title}</strong><small>{done ? "完成得很棒，可以再次练习" : `${question.subject} · ${question.knowledgePoint}`}</small></span><em>{look.minutes}</em><b>{done ? "复习" : index === 0 ? "开始" : "›"}</b></button>; })}</div></div>;
}

function PageTitle({ eyebrow, title, subtitle, icon }: { eyebrow: string; title: string; subtitle: string; icon: string }) {
  return <header className="page-title"><span className="page-title-icon">{icon}</span><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div></header>;
}

function PlanModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" aria-label="关闭" onClick={onClose} type="button">×</button><span className="section-kicker">没有限时试用，购买后永久使用</span><h2 id="plan-title">选择适合你家的成长方案</h2><div className="plan-grid">{products.map((product) => <article className={product.accent ? "plan-card featured" : "plan-card"} key={product.name}>{product.accent && <span className="recommended">最受欢迎</span>}<h3>{product.name}</h3><strong><small>¥</small>{product.price}</strong><p>{product.note}</p><button type="button">选择此方案</button></article>)}</div><p className="upgrade-note">以后每增加一个等级仅需 ¥19.9，已支付金额可抵扣全级版。</p></section></div>;
}

function LessonModal({ question, notice, selectedAnswer, answerState, onSelect, onCheck, onFinish, onClose }: { question: QuestionItem; notice: string | null; selectedAnswer: string | null; answerState: "correct" | "wrong" | null; onSelect: (answer: string) => void; onCheck: () => void; onFinish: () => void; onClose: () => void }) {
  return <div className="modal-backdrop lesson-backdrop" role="presentation" onMouseDown={onClose}><section className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title" onMouseDown={(event) => event.stopPropagation()}><button className="lesson-close" aria-label="退出练习" onClick={onClose} type="button">×</button><div className="lesson-top"><span>🦌</span><div><small>{question.eyebrow}</small><strong id="lesson-title">{question.title}</strong></div><em>{question.source === "ai_generated" ? "AI变式题" : "1 / 1"}</em></div><div className="lesson-progress"><i /></div>{notice && <div className={question.source === "ai_generated" ? "practice-notice ai" : "practice-notice"}><span>{question.source === "ai_generated" ? "✨" : "🛟"}</span>{notice}</div>}<div className="question-card">{question.mathModel ? <MathModel question={question} /> : <span className="question-visual">{question.visual}</span>}<h2>{question.prompt}</h2><QuestionAnswer question={question} selectedAnswer={selectedAnswer} answerState={answerState} onSelect={onSelect} />{answerState && <div className={answerState === "correct" ? "answer-feedback correct" : "answer-feedback wrong"}><span>{answerState === "correct" ? "🌟" : "🌱"}</span><div><strong>{answerState === "correct" ? "答对了，真棒！" : "没关系，我们一起看看"}</strong><p>{question.explanation}</p>{answerState === "wrong" && <small>正确答案：{formatAnswer(question.answer)}</small>}</div></div>}{answerState && question.vocabulary && <DictionaryExpansion question={question} />}</div><button className="lesson-submit" disabled={!selectedAnswer} onClick={answerState ? onFinish : onCheck} type="button">{answerState ? "完成学习，收下本题词汇" : "提交答案"}</button></section></div>;
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
  return <div className={answerClass}>{question.options.map((option) => <button className={`${selectedAnswer === option ? "selected" : ""} ${answerState && option === question.answer ? "correct" : ""} ${answerState === "wrong" && selectedAnswer === option ? "wrong" : ""}`} key={option} onClick={() => onSelect(option)} disabled={answerState !== null} type="button">{question.type === "true_false" && <span>{option === "正确" ? "✓" : "×"}</span>}{option}</button>)}</div>;
}

function DictionaryExpansion({ question }: { question: QuestionItem }) {
  return <section className="dictionary-panel"><header><span>📖</span><div><small>本题词汇扩展</small><strong>AI 小词典</strong></div><em>{question.vocabulary?.length ?? 0} 个重点</em></header><div className="dictionary-grid">{question.vocabulary?.map((item) => <article className="dictionary-card" key={item.term}><div className="dictionary-term"><div><strong>{item.term}</strong>{item.phonetic && <span>{item.phonetic}</span>}</div><em>{item.tag}</em></div><p className="dictionary-meaning">{item.meaning}</p><p className="dictionary-expansion">💡 {item.expansion}</p><div className="dictionary-example"><strong>{item.example}</strong><span>{item.exampleMeaning}</span></div></article>)}</div>{question.grammarTip && <aside className="grammar-tip"><span>🧩</span><div><small>{question.grammarTip.title}</small><strong>{question.grammarTip.pattern}</strong><p>{question.grammarTip.explanation}</p></div></aside>}</section>;
}

function ParentCenter({ records, grade, completedTasks, onGarden }: { records: WrongRecord[]; grade: Grade; completedTasks: number; onGarden: () => void }) {
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
    <div className="parent-metrics"><div><strong>{completedTasks}<small>/3</small></strong><span>今日任务</span></div><div><strong>{records.length}</strong><span>累计错题</span></div><div><strong>{pending}</strong><span>需要关注</span></div><div><strong>{mastered}</strong><span>已完成订正</span></div></div>
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
