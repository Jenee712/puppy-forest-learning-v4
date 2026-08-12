"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_KEY = "puppy-forest-background-music";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("点击开启");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = .16;
    audio.loop = true;
    try {
      if (window.localStorage.getItem(MUSIC_KEY) === "on") setNotice("点击继续播放");
    } catch { /* 使用默认状态 */ }
  }, []);

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

  return (
    <aside className={`background-music ${playing ? "playing" : ""}`} aria-label="背景音乐控制">
      <audio ref={audioRef} preload="none" src="/audio/easy-lemon-kevin-macleod.mp3" />
      <button onClick={() => void toggle()} type="button" aria-pressed={playing}>
        <span aria-hidden="true">{playing ? "♫" : "♪"}</span>
        <span><strong>{playing ? "关闭森林音乐" : "开启森林音乐"}</strong><small>{notice}</small></span>
      </button>
      <a href="https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1200076" target="_blank" rel="noreferrer">Easy Lemon · Kevin MacLeod · CC BY 4.0</a>
    </aside>
  );
}
