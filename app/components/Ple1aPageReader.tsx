"use client";

import { useMemo, useState } from "react";
import pageData from "@/data/ple1aPageText.generated.json";
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

export default function Ple1aPageReader({ initialPage = 9, onBack }: { initialPage?: number; onBack: () => void }) {
  const [pageNumber, setPageNumber] = useState(Math.max(1, Math.min(pages.length, initialPage)));
  const [selected, setSelected] = useState<PageLine | null>(null);
  const [help, setHelp] = useState<PageHelp | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const page = pages[pageNumber - 1] ?? pages[0];
  const context = useMemo(() => page.lines.map((item) => item.text).join(" ").slice(0, 1_200), [page]);

  const changePage = (next: number) => {
    setPageNumber(Math.max(1, Math.min(pages.length, next)));
    setSelected(null); setHelp(null); setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectLine = async (line: PageLine) => {
    setSelected(line); setHelp(null); setNotice(""); setLoading(true);
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
      if (result.needsReview) setNotice("这段扫描文字需要老师校对，暂时先提供发音和阅读方法。");
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
              <section><small>中文翻译</small><strong>{help.translation}</strong>{help.translation !== "待校对" && <TtsButton text={help.translation} segment="sentence" label="听中文" language="zh" />}</section>
              <section><small>老师这样讲</small><p>{help.childExplanation}</p></section>
              <section><small>知识拓展</small><ul>{help.keyPoints.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section className="ple-reader-example"><small>再学一句</small><strong>{help.exampleEn}</strong><p>{help.exampleZh}</p><TtsButton text={help.exampleEn} segment="sentence" label="听例句" language="en" playbackRate={0.85} /></section>
            </div> : null}
            {notice && <p className="ple-reader-notice">{notice}</p>}
          </>}
        </aside>
      </div>
    </section>
  );
}
