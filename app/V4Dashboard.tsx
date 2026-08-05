"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getCourseQuestions, getDailyQuestion, type QuestionItem } from "../data/questionBank";

type Grade = { id: string; age: string; school: string; icon: string; color: string; focus: string };
type Course = { icon: string; name: string; description: string; units: number; progress: number; color: string };

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
  { label: "森林乐园", items: [["🌷", "复习花园"], ["🎒", "错题本"], ["✨", "贴纸册"], ["🛡️", "家长中心"]] },
];

const tasks = [
  { icon: "🔤", title: "字母探险", detail: "认识 M · 找到 moon", minutes: "6分钟", color: "yellow" },
  { icon: "🧮", title: "数学小站", detail: "图形规律 · 接着排", minutes: "8分钟", color: "blue" },
  { icon: "📚", title: "故事树屋", detail: "《会飞的小种子》", minutes: "7分钟", color: "pink" },
];


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

  const currentGrade = useMemo(() => grades.find((grade) => grade.id === selectedGrade) ?? grades[2], [selectedGrade]);
  const courses = useMemo(() => getCourses(selectedGrade), [selectedGrade]);

  const openTask = (index: number) => {
    setActiveQuestion(getDailyQuestion(index));
    setActiveTaskIndex(index);
    setSelectedAnswer(null);
    setAnswerState(null);
  };

  const openCourse = (course: Course, lessonIndex = 0) => {
    const courseQuestions = getCourseQuestions(course.name, selectedGrade);
    setActiveQuestion(courseQuestions[lessonIndex] ?? courseQuestions[0]);
    setActiveTaskIndex(null);
    setSelectedAnswer(null);
    setAnswerState(null);
  };

  const checkAnswer = () => {
    if (!activeQuestion || !selectedAnswer) return;
    setAnswerState(selectedAnswer === activeQuestion.answer ? "correct" : "wrong");
  };

  const finishTask = () => {
    if (activeTaskIndex !== null) {
      setCompletedTasks((current) => current.includes(activeTaskIndex) ? current : [...current, activeTaskIndex]);
    }
    setActiveQuestion(null);
    setActiveTaskIndex(null);
  };

  const goTo = (label: string) => {
    setActiveNav(label);
    if (label !== "课程中心") setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  <span aria-hidden="true">{icon}</span>{label}{label === "错题本" && <em>3</em>}
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
              <GradeRoute currentGrade={currentGrade} selectedGrade={selectedGrade} onSelect={setSelectedGrade} />
              <section className="lower-grid">
                <TaskPanel completedTasks={completedTasks} onOpen={openTask} />
                <div className="smart-panel"><span className="ai-badge">✨ 智能学习伙伴</span><h2>家长不用找题</h2><p>核心题库保证基础，DeepSeek按薄弱知识点生成练习，答错后自动进入复习计划。</p><div className="smart-flow"><span>📚<small>核心题库</small></span><i>→</i><span>🧠<small>智能出题</small></span><i>→</i><span>🌷<small>自动复习</small></span></div><button onClick={() => setShowPlans(true)} type="button">查看永久解锁方案</button></div>
              </section>
            </>
          )}

          {activeNav === "今日学习" && (
            <section className="page-surface today-page">
              <PageTitle eyebrow="系统已经为孩子准备好了" title="今日学习" subtitle={`${currentGrade.id} · ${currentGrade.school} · 预计21分钟`} icon="☀️" />
              <div className="today-summary"><div><strong>{completedTasks.length}<small>/ 3</small></strong><span>今日完成</span></div><div><strong>{42 + completedTasks.length * 5}</strong><span>森林金币</span></div><div><strong>6</strong><span>连续学习</span></div></div>
              <TaskPanel completedTasks={completedTasks} onOpen={openTask} standalone />
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
                  <div className="course-grade-switcher">{grades.map((grade) => <button className={selectedGrade === grade.id ? "active" : ""} key={grade.id} onClick={() => { setSelectedGrade(grade.id); setSelectedCourse(null); }} type="button"><span>{grade.icon}</span><strong>{grade.id}</strong><small>{grade.school}</small></button>)}</div>
                  <div className="course-intro"><div><span>{currentGrade.icon}</span><div><strong>{currentGrade.id} · {currentGrade.school}</strong><p>{currentGrade.age} · {currentGrade.focus}</p></div></div><button onClick={() => setShowPlans(true)} type="button">查看解锁权益</button></div>
                  <div className="course-grid">{courses.map((course) => <article className={`course-card ${course.color}`} key={course.name}><span className="course-icon">{course.icon}</span><div className="course-card-head"><div><h3>{course.name}</h3><p>{course.description}</p></div><em>{course.units}课</em></div><div className="course-progress"><i style={{ width: `${course.progress}%` }} /></div><footer><span>已完成 {course.progress}%</span><button onClick={() => { setSelectedCourse(course); window.scrollTo({ top: 0, behavior: "smooth" }); }} type="button">进入课程 →</button></footer></article>)}</div>
                </>
              )}
            </section>
          )}

          {!["首页", "今日学习", "课程中心"].includes(activeNav) && <FeaturePage name={activeNav} onBack={() => goTo("首页")} />}

          {showPlans && <PlanModal onClose={() => setShowPlans(false)} />}
          {activeQuestion && <LessonModal question={activeQuestion} selectedAnswer={selectedAnswer} answerState={answerState} onSelect={(answer) => { setSelectedAnswer(answer); setAnswerState(null); }} onCheck={checkAnswer} onFinish={finishTask} onClose={() => { setActiveQuestion(null); setActiveTaskIndex(null); }} />}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="手机导航">
        {[["🏡", "首页", "首页"], ["☀️", "今日", "今日学习"], ["🧩", "课程", "课程中心"], ["📖", "绘本馆", "绘本馆"], ["🛡️", "我的", "家长中心"]].map(([icon, label, target]) => <button className={activeNav === target ? "active" : ""} key={label} onClick={() => goTo(target)} type="button"><span>{icon}</span>{label}</button>)}
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
  const availableLessons = course.name.includes("英语") ? Math.min(getCourseQuestions(course.name, grade.id).length, lessons.length) : 1;

  return <div className="course-detail">
    <button className="course-back" onClick={onBack} type="button">← 返回课程中心</button>
    <header className={`course-detail-hero ${course.color}`}><span>{course.icon}</span><div><small>{grade.id} · {grade.school}</small><h1>{course.name}</h1><p>{course.description} · 共{course.units}课</p></div><button onClick={() => onStart(0)} type="button">开始第1课 →</button></header>
    <div className="course-detail-summary"><div><strong>{course.progress}%</strong><span>当前进度</span></div><div><strong>约8分钟</strong><span>每课时长</span></div><div><strong>本地核心题库</strong><span>内容来源</span></div></div>
    <section className="unit-panel"><div className="section-heading compact"><div><span className="section-kicker">循序渐进，不用一次学完</span><h2>第一单元</h2></div><span className="task-count">{availableLessons} / {lessons.length} 开放</span></div><div className="unit-list">{lessons.map((lesson, index) => { const available = index < availableLessons; return <article className={available ? "unit-row current" : "unit-row locked"} key={lesson}><span>{available ? "🌟" : "🌱"}</span><div><small>第 {index + 1} 课</small><strong>{lesson}</strong><p>{available ? "互动练习 + AI小词典 + 句型解析" : "完成本单元题库后按顺序开放"}</p></div>{available ? <button onClick={() => onStart(index)} type="button">进入第{index + 1}课</button> : <em>即将开放</em>}</article>; })}</div></section>
    <aside className="bank-note"><span>🧠</span><div><strong>这节课已经使用统一题库格式</strong><p>题目包含等级、学科、知识点、难度、答案和解析，以后可以直接接入智能出题与错题复习。</p></div></aside>
  </div>;
}

function TaskPanel({ completedTasks, onOpen, standalone = false }: { completedTasks: number[]; onOpen: (index: number) => void; standalone?: boolean }) {
  return <div className={standalone ? "task-panel standalone" : "task-panel"}><div className="section-heading compact"><div><span className="section-kicker">系统已经准备好了</span><h2>今日学习任务</h2></div><span className="task-count">{completedTasks.length} / 3 完成</span></div><div className="task-list">{tasks.map((task, index) => { const done = completedTasks.includes(index); return <button className={done ? "task-row done" : "task-row"} key={task.title} onClick={() => onOpen(index)} type="button"><span className={`task-icon ${task.color}`}>{done ? "✓" : task.icon}</span><span><strong>{task.title}</strong><small>{done ? "完成得很棒，可以再次练习" : task.detail}</small></span><em>{task.minutes}</em><b>{done ? "复习" : index === 0 ? "开始" : "›"}</b></button>; })}</div></div>;
}

function PageTitle({ eyebrow, title, subtitle, icon }: { eyebrow: string; title: string; subtitle: string; icon: string }) {
  return <header className="page-title"><span className="page-title-icon">{icon}</span><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div></header>;
}

function PlanModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" aria-label="关闭" onClick={onClose} type="button">×</button><span className="section-kicker">没有限时试用，购买后永久使用</span><h2 id="plan-title">选择适合你家的成长方案</h2><div className="plan-grid">{products.map((product) => <article className={product.accent ? "plan-card featured" : "plan-card"} key={product.name}>{product.accent && <span className="recommended">最受欢迎</span>}<h3>{product.name}</h3><strong><small>¥</small>{product.price}</strong><p>{product.note}</p><button type="button">选择此方案</button></article>)}</div><p className="upgrade-note">以后每增加一个等级仅需 ¥19.9，已支付金额可抵扣全级版。</p></section></div>;
}

function LessonModal({ question, selectedAnswer, answerState, onSelect, onCheck, onFinish, onClose }: { question: QuestionItem; selectedAnswer: string | null; answerState: "correct" | "wrong" | null; onSelect: (answer: string) => void; onCheck: () => void; onFinish: () => void; onClose: () => void }) {
  return <div className="modal-backdrop lesson-backdrop" role="presentation" onMouseDown={onClose}><section className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title" onMouseDown={(event) => event.stopPropagation()}><button className="lesson-close" aria-label="退出练习" onClick={onClose} type="button">×</button><div className="lesson-top"><span>🦌</span><div><small>{question.eyebrow}</small><strong id="lesson-title">{question.title}</strong></div><em>1 / 1</em></div><div className="lesson-progress"><i /></div><div className="question-card"><span className="question-visual">{question.visual}</span><h2>{question.prompt}</h2><div className="answer-grid">{question.options.map((option) => <button className={`${selectedAnswer === option ? "selected" : ""} ${answerState && option === question.answer ? "correct" : ""} ${answerState === "wrong" && selectedAnswer === option ? "wrong" : ""}`} key={option} onClick={() => onSelect(option)} disabled={answerState !== null} type="button">{option}</button>)}</div>{answerState && <div className={answerState === "correct" ? "answer-feedback correct" : "answer-feedback wrong"}><span>{answerState === "correct" ? "🌟" : "🌱"}</span><div><strong>{answerState === "correct" ? "答对了，真棒！" : "没关系，我们一起看看"}</strong><p>{question.explanation}</p></div></div>}{answerState && question.vocabulary && <DictionaryExpansion question={question} />}</div><button className="lesson-submit" disabled={!selectedAnswer} onClick={answerState ? onFinish : onCheck} type="button">{answerState ? "完成学习，收下本题词汇" : "提交答案"}</button></section></div>;
}

function DictionaryExpansion({ question }: { question: QuestionItem }) {
  return <section className="dictionary-panel"><header><span>📖</span><div><small>本题词汇扩展</small><strong>AI 小词典</strong></div><em>{question.vocabulary?.length ?? 0} 个重点</em></header><div className="dictionary-grid">{question.vocabulary?.map((item) => <article className="dictionary-card" key={item.term}><div className="dictionary-term"><div><strong>{item.term}</strong>{item.phonetic && <span>{item.phonetic}</span>}</div><em>{item.tag}</em></div><p className="dictionary-meaning">{item.meaning}</p><p className="dictionary-expansion">💡 {item.expansion}</p><div className="dictionary-example"><strong>{item.example}</strong><span>{item.exampleMeaning}</span></div></article>)}</div>{question.grammarTip && <aside className="grammar-tip"><span>🧩</span><div><small>{question.grammarTip.title}</small><strong>{question.grammarTip.pattern}</strong><p>{question.grammarTip.explanation}</p></div></aside>}</section>;
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
