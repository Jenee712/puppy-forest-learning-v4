"use client";

import { useMemo, useState } from "react";
import pageData from "@/data/ple1aPageText.generated.json";
import { findPle1aLessonByBookPage, type PleExpansion } from "@/data/ple1aCourse";
import { playPreferredAudio } from "@/lib/tts/playTts";
import { TtsButton } from "./TtsButton";

type PageLine = { id: string; text: string; x: number; y: number; width: number; height: number; confidence: number };
type PageRecord = { page: number; bookPage: number | null; image: string; lines: PageLine[] };
type PageHelp = { translation: string; childExplanation: string; keyPoints: string[]; exampleEn: string; exampleZh: string };

const pages = pageData as PageRecord[];

function pageLabel(page: PageRecord) {
  if (page.bookPage === null) return `封面与导读 · PDF第${page.page}页`;
  return `课本第${page.bookPage}页 · PDF第${page.page}页`;
}

function expansionEnglish(expansion: PleExpansion, lessonTitle: string) {
  return {
    title: expansion.titleEn ?? `More about ${lessonTitle}`,
    knowledge: expansion.knowledgeEn ?? expansion.knowledge.map((_, index) => `Try idea ${index + 1} with a sentence from this page.`),
    challenge: expansion.challengeEn ?? "Use one sentence from this page in a new situation.",
  };
}

export default function Ple1aPageReader({ initialPage = 9, onBack }: { initialPage?: number; onBack: () => void }) {
  const [pageNumber, setPageNumber] = useState(Math.max(1, Math.min(pages.length, initialPage)));
  const [selected, setSelected] = useState<PageLine | null>(null);
  const [help, setHelp] = useState<PageHelp | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [translationPending, setTranslationPending] = useState(false);
  const [pageExpansion, setPageExpansion] = useState<PleExpansion | null>(null);
  const [expansionLoading, setExpansionLoading] = useState(false);
  const [expansionNotice, setExpansionNotice] = useState("");
  const page = pages[pageNumber - 1] ?? pages[0];
  const context = useMemo(() => page.lines.map((item) => item.text).join("\n").slice(0, 1_600), [page]);
  const pageLesson = useMemo(() => page.bookPage === null ? null : findPle1aLessonByBookPage(page.bookPage), [page.bookPage]);
  const englishExpansion = pageExpansion && pageLesson ? expansionEnglish(pageExpansion, pageLesson.lesson.title) : null;

  const changePage = (next: number) => {
    setPageNumber(Math.max(1, Math.min(pages.length, next)));
    setSelected(null); setHelp(null); setNotice(""); setTranslationPending(false);
    setPageExpansion(null); setExpansionNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const expandPage = async () => {
    if (!pageLesson) return;
    setExpansionLoading(true); setExpansionNotice("");
    try {
      const response = await fetch("/api/textbook-expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: page.page, context }),
      });
      const result = await response.json() as { expansion?: PleExpansion; fallback?: boolean; error?: string };
      if (!response.ok || !result.expansion) throw new Error(result.error ?? "AI拓展暂时不可用");
      setPageExpansion(result.expansion);
      setExpansionNotice(result.fallback ? "已根据当前教材页打开预习与复习练习" : "DeepSeek已结合本页内容生成新的预习与复习练习");
    } catch (error) {
      setExpansionNotice(error instanceof Error ? error.message : "AI拓展暂时不可用");
    } finally {
      setExpansionLoading(false);
    }
  };

  const selectLine = async (line: PageLine) => {
    setSelected(line); setHelp(null); setNotice(""); setTranslationPending(false); setLoading(true);
    void playPreferredAudio(line.text, undefined, { language: "en", segment: "sentence", playbackRate: 0.85 }).catch(() => undefined);
    try {
      const response = await fetch("/api/textbook-page-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: line.text, page: page.page, context }),
      });
      const result = await response.json() as { help?: PageHelp; fallback?: boolean; needsReview?: boolean; error?: string };
      if (!response.ok || !result.help) throw new Error(result.error ?? "讲解暂时不可用");
      setHelp(result.help);
      setTranslationPending(Boolean(result.needsReview));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "讲解暂时不可用");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ple-page-reader">
      <header className="ple-reader-topbar">
        <button onClick={onBack} type="button">← 返回教材课程</button>
        <div><small>Original textbook · 原版教材</small><h1>PLE 1A 逐页点读</h1><p>点击页面上浅绿色的英文区域，即可听发音、看中文翻译和拓展知识。</p></div>
        <span><b>{page.page}</b> / {pages.length}</span>
      </header>

      <nav className="ple-reader-controls" aria-label="教材翻页">
        <button disabled={pageNumber === 1} onClick={() => changePage(pageNumber - 1)} type="button">← 上一页</button>
        <label><span>{pageLabel(page)}</span><input aria-label="输入PDF页码" min={1} max={pages.length} type="number" value={pageNumber} onChange={(event) => changePage(Number(event.target.value) || 1)} /></label>
        <input aria-label="拖动选择教材页码" min={1} max={pages.length} type="range" value={pageNumber} onChange={(event) => changePage(Number(event.target.value))} />
        <button disabled={pageNumber === pages.length} onClick={() => changePage(pageNumber + 1)} type="button">下一页 →</button>
      </nav>

      <div className="ple-reader-layout">
        <div className="ple-page-stage">
          <div className="ple-page-canvas">
            <img src={page.image} alt={`Primary Longman Express 1A ${pageLabel(page)}`} />
            {page.lines.map((line) => <button
              aria-label={`点读：${line.text}`}
              className={selected?.id === line.id ? "active" : ""}
              key={line.id}
              onClick={() => void selectLine(line)}
              style={{ left: `${line.x}%`, top: `${line.y}%`, width: `${line.width}%`, height: `${Math.max(line.height, 1.5)}%` }}
              title={line.text}
              type="button"
            />)}
          </div>
          <p><span>👆</span>本页识别到 <b>{page.lines.length}</b> 处英文点读区域；扫描识别可能有少量误差，后续会逐页人工校对。</p>
        </div>

        <aside className={`ple-reader-help ${selected ? "has-selection" : ""}`}>
          {!selected ? <div className="ple-reader-empty"><span>🦉</span><h2>点一下课本里的英文</h2><p>小猫头鹰会读给你听，并把这句话讲清楚。</p><ol><li>先听英文发音</li><li>再看中文意思</li><li>最后学一个新用法</li></ol></div> : <>
            <header><small>你点到的英文</small><h2>{selected.text}</h2><TtsButton text={selected.text} segment="sentence" label="再听英文" language="en" playbackRate={0.85} /></header>
            {loading ? <div className="ple-reader-loading"><span>🌱</span><p>正在整理这句话…</p></div> : help ? <div className="ple-reader-explanation">
              {translationPending ? <section className="ple-reader-picture-tip"><small>看图理解</small><strong>先听英文，再从图片里找线索</strong><p>看看这句话说的是谁、什么物品或哪个动作。</p></section> : <section><small>中文翻译</small><strong>{help.translation}</strong><TtsButton text={help.translation} segment="sentence" label="听中文" language="zh" /></section>}
              <section><small>老师这样讲</small><p>{help.childExplanation}</p></section>
              <section><small>知识拓展</small><ul>{help.keyPoints.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section className="ple-reader-example"><small>再学一句</small><strong>{help.exampleEn}</strong><p>{help.exampleZh}</p><footer><TtsButton text={help.exampleEn} segment="sentence" label="听英文" language="en" playbackRate={0.85} /><TtsButton text={help.exampleZh} segment="sentence" label="听中文" language="zh" /></footer></section>
            </div> : null}
            {notice && <p className="ple-reader-notice">{notice}</p>}
          </>}
        </aside>
      </div>

      {pageLesson && <section className="ple-page-ai-expand" aria-live="polite">
        <header>
          <div><span>🦉</span><div><small>DeepSeek · 课本预习与复习</small><h2>先听懂，再跟读，最后自己说</h2><p>围绕课本第{page.bookPage}页选出3个重点句，再完成一个复习小挑战。</p></div></div>
          <button disabled={expansionLoading} onClick={() => void expandPage()} type="button">{expansionLoading ? "正在整理练习…" : pageExpansion ? "换一组本页练习 ✨" : "生成本页练习 ✨"}</button>
        </header>
        {!pageExpansion ? <div className="ple-page-ai-empty"><span>🔊</span><p>适合上课前预习和放学后复习：每句话都能听英文、听中文并跟读。</p></div> : englishExpansion && <div className="ple-page-ai-content">
          <div className="ple-page-ai-title"><div><small>第一步 · 听一听</small><strong>{englishExpansion.title}</strong><p>{pageExpansion.title}</p></div><div><TtsButton text={englishExpansion.title} segment="sentence" label="听英文" language="en" playbackRate={0.85} /><TtsButton text={pageExpansion.title} segment="sentence" label="听中文" language="zh" /></div></div>
          <div className="ple-page-ai-points">{pageExpansion.knowledge.map((item, index) => { const english = englishExpansion.knowledge[index] ?? englishExpansion.knowledge[0]; const focus = pageExpansion.focus?.[index] ?? []; return <article key={`${index}-${item}`}><span>{index + 1}</span><div><small>重点句 {index + 1} · 听完跟读</small><strong>{english}</strong><p className="ple-page-ai-translation"><b>中文：</b>{item}</p>{focus.length > 0 && <div className="ple-page-ai-focus"><small>重点词语 / 词组</small>{focus.map((entry) => <div key={`${entry.term}-${entry.meaning}`}><span><b>{entry.term}</b><em>{entry.meaning}</em></span><TtsButton text={entry.term} segment="word" label="听发音" language="en" playbackRate={0.85} /></div>)}</div>}<footer><TtsButton text={english} segment="sentence" label="听英文" language="en" playbackRate={0.85} /><TtsButton text={item} segment="sentence" label="听中文" language="zh" /></footer></div></article>; })}</div>
          <article className="ple-page-ai-challenge"><span>🌟</span><div><small>第二步 · 复习小挑战</small><strong>{englishExpansion.challenge}</strong><p>{pageExpansion.challenge}</p><footer><TtsButton text={englishExpansion.challenge} segment="sentence" label="听英文" language="en" playbackRate={0.85} /><TtsButton text={pageExpansion.challenge} segment="sentence" label="听中文" language="zh" /></footer></div></article>
        </div>}
        {expansionNotice && <p className="ple-page-ai-notice">{expansionNotice}</p>}
      </section>}
    </section>
  );
}
