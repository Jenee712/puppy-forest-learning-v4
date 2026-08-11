"use client";

import { useEffect, useMemo, useState } from "react";
import { TtsButton } from "./TtsButton";
import { playTts, stopTts } from "@/lib/tts/playTts";
import { bookGrades, getBooksByGrade, pictureBooks, type PictureBook } from "@/data/pictureBooks";

function gradeRate(grade: string): number {
  const n = Number(grade.match(/G([1-8])/)?.[1] ?? 3);
  if (n <= 2) return 0.75;
  if (n <= 4) return 0.85;
  if (n <= 6) return 0.92;
  return 0.98;
}

const FAVORITES_KEY = "puppy-forest-favorite-books";

function loadFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function PictureBookLibrary({ grade = "G1" }: { grade?: string }) {
  const [activeGrade, setActiveGrade] = useState(grade);
  const [selected, setSelected] = useState<PictureBook | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pagePlaying, setPagePlaying] = useState(false);

  useEffect(() => setFavorites(loadFavorites()), []);
  useEffect(() => () => stopTts(), []);

  const books = useMemo(() => getBooksByGrade(activeGrade), [activeGrade]);
  const rate = useMemo(() => gradeRate(activeGrade), [activeGrade]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const openBook = (book: PictureBook) => {
    stopTts();
    setSelected(book);
    setPageIndex(0);
    setPagePlaying(false);
  };

  const closeBook = () => {
    stopTts();
    setSelected(null);
  };

  if (selected) {
    return (
      <Reader
        book={selected}
        pageIndex={pageIndex}
        rate={rate}
        isFavorite={favorites.includes(selected.id)}
        pagePlaying={pagePlaying}
        setPagePlaying={setPagePlaying}
        onPage={(i) => {
          stopTts();
          setPagePlaying(false);
          setPageIndex(i);
        }}
        onToggleFavorite={() => toggleFavorite(selected.id)}
        onClose={closeBook}
      />
    );
  }

  return (
    <section className="page-surface pb-library">
      <header className="page-title">
        <span className="page-title-icon">📖</span>
        <div>
          <span className="section-kicker">原创双语绘本 · 女声朗读</span>
          <h1>绘本馆</h1>
          <p>共 {pictureBooks.length} 本完整插画绘本，从 G1 到 G8 分级阅读、逐句听读。</p>
        </div>
      </header>

      <div className="pb-grade-tabs">
        {bookGrades.map((g) => (
          <button
            key={g.id}
            className={activeGrade === g.id ? "active" : ""}
            onClick={() => setActiveGrade(g.id)}
            type="button"
          >
            <strong>{g.label}</strong>
            <small>{g.age}</small>
          </button>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="pb-fav-hint">★ 已收藏 {favorites.length} 本</div>
      )}

      <div className="pb-grid">
        {books.map((book) => (
          <article key={book.id} className={`pb-card pb-cover--${book.coverColor}`}>
            <button className="pb-card-open" onClick={() => openBook(book)} type="button" aria-label={`打开 ${book.titleCn}`}>
              <span className="pb-cover-emoji" aria-hidden="true">{book.coverEmoji}</span>
              <div className="pb-card-meta">
                <strong>{book.titleCn}</strong>
                <small>{book.titleEn}</small>
                <em>{book.ageRange} · {book.pages.length}页</em>
              </div>
            </button>
            <button
              className={`pb-fav ${favorites.includes(book.id) ? "on" : ""}`}
              onClick={() => toggleFavorite(book.id)}
              type="button"
              aria-label={favorites.includes(book.id) ? "取消收藏" : "收藏"}
            >
              {favorites.includes(book.id) ? "★" : "☆"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function splitSentences(text: string): string[] {
  // lookbehind-free split (兼容 Safari <16.4 / 旧浏览器)
  return text
    .replace(/([.!?])\s+/g, "$1\u0001")
    .split("\u0001")
    .map((s) => s.trim())
    .filter(Boolean);
}

function Reader({
  book,
  pageIndex,
  rate,
  isFavorite,
  pagePlaying,
  setPagePlaying,
  onPage,
  onToggleFavorite,
  onClose,
}: {
  book: PictureBook;
  pageIndex: number;
  rate: number;
  isFavorite: boolean;
  pagePlaying: boolean;
  setPagePlaying: (v: boolean) => void;
  onPage: (i: number) => void;
  onToggleFavorite: () => void;
  onClose: () => void;
}) {
  const page = book.pages[pageIndex];
  const sentences = splitSentences(page.en);
  const total = book.pages.length;

  const playPage = async () => {
    if (pagePlaying) {
      stopTts();
      setPagePlaying(false);
      return;
    }
    setPagePlaying(true);
    try {
      for (const sentence of sentences) {
        // eslint-disable-next-line no-await-in-loop
        await playTts(sentence, { language: "en", segment: "sentence", playbackRate: rate });
      }
    } catch {
      /* 网络或语音服务异常时静默停止 */
    } finally {
      setPagePlaying(false);
    }
  };

  return (
    <section className="page-surface pb-reader">
      <button className="pb-reader-back" onClick={onClose} type="button">← 返回绘本馆</button>

      <header className={`pb-reader-hero pb-cover--${book.coverColor}`}>
        <span className="pb-reader-emoji" aria-hidden="true">{book.coverEmoji}</span>
        <div>
          <small>{book.grade} · {book.ageRange}</small>
          <h1>{book.titleCn}</h1>
          <p>{book.titleEn}</p>
        </div>
        <button
          className={`pb-fav ${isFavorite ? "on" : ""}`}
          onClick={onToggleFavorite}
          type="button"
          aria-label={isFavorite ? "取消收藏" : "收藏"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </header>

      <div className="pb-page">
        <div className="pb-page-visual" aria-hidden="true">
          {(book.illustrations && book.illustrations[pageIndex]) ? (
            <img src={book.illustrations[pageIndex]} alt="" className="pb-page-img" />
          ) : (
            page.scene ? "🌿" : "📖"
          )}
        </div>
        <div className="pb-en-block">
          {sentences.map((sentence, i) => (
            <span key={i} className="pb-sentence">
              {sentence}{" "}
              <TtsButton text={sentence} segment="sentence" language="en" playbackRate={rate} label="听" />
            </span>
          ))}
          <button className={`pb-play-page ${pagePlaying ? "playing" : ""}`} onClick={() => void playPage()} type="button">
            {pagePlaying ? "■ 停止整页朗读" : "🔊 听整页"}
          </button>
        </div>
        <p className="pb-cn">{page.cn}</p>
      </div>

      <div className="pb-page-nav">
        <button
          className="pb-nav-btn"
          disabled={pageIndex === 0}
          onClick={() => onPage(pageIndex - 1)}
          type="button"
        >
          ← 上一页
        </button>
        <span className="pb-page-count">{pageIndex + 1} / {total}</span>
        <button
          className="pb-nav-btn"
          disabled={pageIndex === total - 1}
          onClick={() => onPage(pageIndex + 1)}
          type="button"
        >
          下一页 →
        </button>
      </div>
    </section>
  );
}
