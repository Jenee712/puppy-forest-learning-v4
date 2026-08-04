"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Grade = {
  id: string;
  age: string;
  school: string;
  icon: string;
  color: string;
  focus: string;
};

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
  {
    label: "学习列车",
    items: [
      ["🏡", "首页"],
      ["☀️", "今日学习"],
      ["🧩", "课程中心"],
      ["📖", "绘本馆"],
      ["🗺️", "学习计划"],
    ],
  },
  {
    label: "森林乐园",
    items: [
      ["🌷", "复习花园"],
      ["🎒", "错题本"],
      ["✨", "贴纸册"],
      ["🛡️", "家长中心"],
    ],
  },
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

export function V4Dashboard() {
  const [activeNav, setActiveNav] = useState("首页");
  const [selectedGrade, setSelectedGrade] = useState("G3");
  const [showPlans, setShowPlans] = useState(false);

  const currentGrade = useMemo(
    () => grades.find((grade) => grade.id === selectedGrade) ?? grades[2],
    [selectedGrade],
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">🐶</div>
          <div>
            <strong>小狗的森林学堂</strong>
            <span>V4 · 简体字智能版</span>
          </div>
        </div>

        <nav aria-label="主导航">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(([icon, label]) => (
                <button
                  className={activeNav === label ? "nav-item active" : "nav-item"}
                  key={label}
                  onClick={() => setActiveNav(label)}
                  type="button"
                >
                  <span aria-hidden="true">{icon}</span>{label}
                  {label === "错题本" && <em>3</em>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="profile-card">
          <span className="deer" aria-hidden="true">🦌</span>
          <div><strong>小鹿 Leo</strong><small>{selectedGrade} · 连续6天</small></div>
          <button aria-label="进入家长中心" type="button">›</button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="mobile-brand"><span>🐶</span>森林学堂</div>
          <div className="progress-wrap">
            <span>今日 12 / 30 分钟</span>
            <div className="progress"><i /></div>
          </div>
          <div className="top-actions">
            <button className="coin" type="button">🪙 42</button>
            <button className="parent-button" type="button">家长中心</button>
          </div>
        </header>

        <div className="content">
          <section className="visual-hero" aria-label="小狗的森林学堂主视觉">
            <Image
              src="/og.png"
              alt="小狗、小猫和小兔在森林里一起学习，小火车从身边经过"
              width={1200}
              height={630}
              priority
            />
            <div className="visual-hero-action">
              <div>
                <span>下午好，小鹿 Leo</span>
                <strong>今天有 3 个森林任务</strong>
              </div>
              <button type="button">开始学习 <b>→</b></button>
            </div>
          </section>

          <section className="grade-section">
            <div className="section-heading">
              <div><span className="section-kicker">为孩子选择合适的起点</span><h2>八级成长路线</h2></div>
              <div className="current-pill">当前：{currentGrade.icon} {currentGrade.id} · {currentGrade.school}</div>
            </div>
            <div className="grade-grid">
              {grades.map((grade) => (
                <button
                  className={`grade-card ${grade.color} ${selectedGrade === grade.id ? "selected" : ""}`}
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  type="button"
                >
                  <span className="grade-icon">{grade.icon}</span>
                  <strong>{grade.id}</strong>
                  <b>{grade.school}</b>
                  <small>{grade.age}</small>
                  <p>{grade.focus}</p>
                  {selectedGrade === grade.id && <i>已选择</i>}
                </button>
              ))}
            </div>
          </section>

          <section className="lower-grid">
            <div className="task-panel">
              <div className="section-heading compact">
                <div><span className="section-kicker">系统已经准备好了</span><h2>今日学习任务</h2></div>
                <span className="task-count">0 / 3 完成</span>
              </div>
              <div className="task-list">
                {tasks.map((task, index) => (
                  <button className="task-row" key={task.title} type="button">
                    <span className={`task-icon ${task.color}`}>{task.icon}</span>
                    <span><strong>{task.title}</strong><small>{task.detail}</small></span>
                    <em>{task.minutes}</em><b>{index === 0 ? "开始" : "›"}</b>
                  </button>
                ))}
              </div>
            </div>

            <div className="smart-panel">
              <span className="ai-badge">✨ 智能学习伙伴</span>
              <h2>家长不用找题</h2>
              <p>核心题库保证基础，DeepSeek按薄弱知识点生成练习，答错后自动进入复习计划。</p>
              <div className="smart-flow">
                <span>📚<small>核心题库</small></span><i>→</i>
                <span>🧠<small>智能出题</small></span><i>→</i>
                <span>🌷<small>自动复习</small></span>
              </div>
              <button onClick={() => setShowPlans(true)} type="button">查看永久解锁方案</button>
            </div>
          </section>

          {showPlans && (
            <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowPlans(false)}>
              <section className="plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-title" onMouseDown={(event) => event.stopPropagation()}>
                <button className="close" aria-label="关闭" onClick={() => setShowPlans(false)} type="button">×</button>
                <span className="section-kicker">没有限时试用，购买后永久使用</span>
                <h2 id="plan-title">选择适合你家的成长方案</h2>
                <div className="plan-grid">
                  {products.map((product) => (
                    <article className={product.accent ? "plan-card featured" : "plan-card"} key={product.name}>
                      {product.accent && <span className="recommended">最受欢迎</span>}
                      <h3>{product.name}</h3>
                      <strong><small>¥</small>{product.price}</strong>
                      <p>{product.note}</p>
                      <button type="button">选择此方案</button>
                    </article>
                  ))}
                </div>
                <p className="upgrade-note">以后每增加一个等级仅需 ¥19.9，已支付金额可抵扣全级版。</p>
              </section>
            </div>
          )}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="手机导航">
        {[['🏡','首页'],['☀️','今日'],['🧩','课程'],['📖','绘本馆'],['🛡️','我的']].map(([icon,label]) => (
          <button className={label === "首页" ? "active" : ""} key={label} type="button"><span>{icon}</span>{label}</button>
        ))}
      </nav>
    </div>
  );
}
