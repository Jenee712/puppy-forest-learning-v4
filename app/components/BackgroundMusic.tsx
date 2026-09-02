"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const MUSIC_KEY = "puppy-forest-background-music";
const TRACK_KEY = "puppy-forest-background-music-track";
const POSITION_KEY = "puppy-forest-background-music-position";
const COLLAPSED_KEY = "puppy-forest-background-music-collapsed";

const TRACKS = [
  { id: "easy-lemon", title: "Easy Lemon", cn: "柠檬晴天", mood: "清新 · 轻快", duration: "2:06", isrc: "USUAN1200076", src: "/audio/easy-lemon-kevin-macleod.mp3" },
  { id: "carefree", title: "Carefree", cn: "无忧午后", mood: "明亮 · 放松", duration: "3:25", isrc: "USUAN1400037", src: "/audio/carefree-kevin-macleod.mp3" },
  { id: "life-of-riley", title: "Life of Riley", cn: "快乐小日子", mood: "温暖 · 愉快", duration: "3:55", isrc: "USUAN1400054", src: "/audio/life-of-riley-kevin-macleod.mp3" },
  { id: "wallpaper", title: "Wallpaper", cn: "森林壁纸", mood: "舒缓 · 明亮", duration: "3:35", isrc: "USUAN1100843", src: "/audio/wallpaper-kevin-macleod.mp3" },
  { id: "forest-trees", title: "The Forest and the Trees", cn: "森林与树", mood: "自然 · 宁静", duration: "1:34", isrc: "USUAN1100766", src: "/audio/the-forest-and-the-trees-kevin-macleod.mp3" },
  { id: "morning", title: "Morning", cn: "林间早晨", mood: "清晨 · 平静", duration: "2:33", isrc: "USUAN2300003", src: "/audio/morning-kevin-macleod.mp3" },
  { id: "guzheng-city", title: "Guzheng City", cn: "古筝小城", mood: "东方 · 轻柔", duration: "1:53", isrc: "USUAN2100001", src: "/audio/guzheng-city-kevin-macleod.mp3" },
  { id: "light-thought", title: "Light Thought var 2", cn: "轻轻想一想", mood: "安静 · 专注", duration: "2:13", isrc: "USUAN1200007", src: "/audio/light-thought-var-2-kevin-macleod.mp3" },
  { id: "cheery-monday", title: "Cheery Monday", cn: "快乐星期一", mood: "活泼 · 短曲", duration: "1:20", isrc: "USUAN1700065", src: "/audio/cheery-monday-kevin-macleod.mp3" },
  { id: "teddy-waltz", title: "Teddy Bear Waltz", cn: "小熊圆舞曲", mood: "童趣 · 悠扬", duration: "3:15", isrc: "USUAN1700064", src: "/audio/teddy-bear-waltz-kevin-macleod.mp3" },
] as const;

type Position = { x: number; y: number; side: "left" | "right" };

const readStoredPosition = (): Position | null => {
  try {
    const value = JSON.parse(window.localStorage.getItem(POSITION_KEY) || "null") as Position | null;
    if (value && Number.isFinite(value.x) && Number.isFinite(value.y)) return value;
  } catch { /* 使用默认位置 */ }
  return null;
};

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("点击开启");
  const [trackIndex, setTrackIndex] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const track = TRACKS[trackIndex];

  const clampPosition = useCallback((x: number, y: number, side?: Position["side"]): Position => {
    const width = rootRef.current?.offsetWidth || 224;
    const height = rootRef.current?.offsetHeight || 72;
    const safeBottom = window.innerWidth <= 820 ? 78 : 10;
    return {
      x: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - height - safeBottom)),
      side: side || (x + width / 2 < window.innerWidth / 2 ? "left" : "right"),
    };
  }, []);

  useEffect(() => {
    const savedPosition = readStoredPosition();
    if (savedPosition) setPosition(clampPosition(savedPosition.x, savedPosition.y, savedPosition.side));
    try {
      const storedTrack = window.localStorage.getItem(TRACK_KEY);
      const savedIndex = TRACKS.findIndex((item) => item.id === storedTrack);
      if (savedIndex >= 0) setTrackIndex(savedIndex);
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "yes");
      if (window.localStorage.getItem(MUSIC_KEY) === "on") setNotice("点击继续播放");
    } catch { /* 使用默认状态 */ }
  }, [clampPosition]);

  useEffect(() => {
    const onResize = () => setPosition((current) => current ? clampPosition(current.x, current.y, current.side) : null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampPosition]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = .16;
    audio.loop = true;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    try { window.localStorage.setItem(TRACK_KEY, track.id); } catch { /* ignore */ }
    if (!playing) return;
    void audio.play().catch(() => {
      setPlaying(false);
      setNotice("点一下继续");
    });
  }, [track.id]);

  useEffect(() => {
    if (!position) return;
    const frame = window.requestAnimationFrame(() => {
      const width = rootRef.current?.offsetWidth || 44;
      const snapped = clampPosition(position.side === "left" ? 8 : window.innerWidth - width - 8, position.y, position.side);
      setPosition(snapped);
      try { window.localStorage.setItem(POSITION_KEY, JSON.stringify(snapped)); } catch { /* ignore */ }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [collapsed]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setNotice("点击开启");
      try { window.localStorage.setItem(MUSIC_KEY, "off"); } catch { /* ignore */ }
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setNotice("轻柔播放中");
      window.localStorage.setItem(MUSIC_KEY, "on");
    } catch {
      setNotice("请再点一次");
    }
  };

  const chooseTrack = (index: number) => {
    setTrackIndex(index);
    setNotice(playing ? "轻柔播放中" : "已选好，点击播放");
  };

  const moveTrack = (direction: -1 | 1) => {
    chooseTrack((trackIndex + direction + TRACKS.length) % TRACKS.length);
  };

  const onDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false };
  };

  const onDragMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag.moved = true;
    setPosition(clampPosition(event.clientX - drag.offsetX, event.clientY - drag.offsetY));
  };

  const onDragEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = rootRef.current?.getBoundingClientRect();
    const side: Position["side"] = event.clientX < window.innerWidth / 2 ? "left" : "right";
    const width = rect?.width || 224;
    const snapped = clampPosition(side === "left" ? 8 : window.innerWidth - width - 8, rect?.top || 8, side);
    setPosition(snapped);
    try { window.localStorage.setItem(POSITION_KEY, JSON.stringify(snapped)); } catch { /* ignore */ }
    dragRef.current = null;
  };

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    setLibraryOpen(false);
    try { window.localStorage.setItem(COLLAPSED_KEY, next ? "yes" : "no"); } catch { /* ignore */ }
  };

  const style = position ? { left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" } : undefined;
  const side = position?.side || "right";

  return (
    <aside ref={rootRef} className={`background-music music-side-${side} ${position && position.y < 430 ? "music-panel-below" : ""} ${playing ? "playing" : ""} ${collapsed ? "collapsed" : ""}`} style={style} aria-label="森林音乐控制">
      <audio ref={audioRef} preload="none" src={track.src} />

      {collapsed ? (
        <button className="music-restore" onClick={toggleCollapsed} type="button" aria-label="展开森林音乐">
          <span aria-hidden="true">♫</span><small>音乐</small>
        </button>
      ) : (
        <div className="music-controller">
          <button className="music-toggle" onClick={() => void toggle()} type="button" aria-pressed={playing}>
            <span aria-hidden="true">{playing ? "♫" : "♪"}</span>
            <span><strong>{track.cn}</strong><small>{notice} · {trackIndex + 1}/10</small></span>
          </button>
          <button className="music-library-toggle" onClick={() => setLibraryOpen((open) => !open)} type="button" aria-expanded={libraryOpen} aria-label="打开音乐库">🎵<small>曲库</small></button>
          <button className="music-drag" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd} type="button" aria-label="拖动音乐按钮">⠿<small>拖动</small></button>
          <button className="music-collapse" onClick={toggleCollapsed} type="button" aria-label="把音乐按钮收在屏幕边缘">{side === "right" ? "›" : "‹"}</button>
        </div>
      )}

      {libraryOpen && !collapsed && (
        <section className="music-library" aria-label="森林音乐库">
          <header>
            <div><small>10首自然愉快轻音乐</small><strong>森林音乐库</strong></div>
            <div>
              <button onClick={() => moveTrack(-1)} type="button" aria-label="上一首">‹</button>
              <button onClick={() => moveTrack(1)} type="button" aria-label="下一首">›</button>
            </div>
          </header>
          <div className="music-track-list">
            {TRACKS.map((item, index) => (
              <button className={index === trackIndex ? "active" : ""} onClick={() => chooseTrack(index)} type="button" key={item.id}>
                <span aria-hidden="true">{index === trackIndex && playing ? "♫" : `${index + 1}`}</span>
                <span><strong>{item.cn}</strong><small>{item.mood}</small></span>
                <time>{item.duration}</time>
              </button>
            ))}
          </div>
          <footer>
            <span>{track.title} · Kevin MacLeod</span>
            <a href={`https://incompetech.com/music/royalty-free/index.html?isrc=${track.isrc}`} target="_blank" rel="noreferrer">来源</a>
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
          </footer>
        </section>
      )}
    </aside>
  );
}
