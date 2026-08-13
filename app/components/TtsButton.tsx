"use client";

import { useEffect, useRef, useState } from "react";
import { playPreferredAudio, stopTts, type TtsLanguage, type TtsSegment } from "@/lib/tts/playTts";

type TtsButtonProps = {
  text: string;
  segment: TtsSegment;
  label: string;
  language?: TtsLanguage;
  playbackRate?: number;
  autoPlay?: boolean;
  autoPlayKey?: string;
  audioSrc?: string;
  className?: string;
};

type Status = "idle" | "loading" | "playing" | "error";

// React development checks and a few embedded browsers can mount the same
// control twice in quick succession. Keep this guard outside the component so
// a remount cannot start a second copy of the same automatic narration.
const recentAutoPlays = new Map<string, number>();
const AUTO_PLAY_DEDUP_MS = 2500;

export function TtsButton({
  text,
  segment,
  label,
  language = "en",
  playbackRate = 1,
  autoPlay = false,
  autoPlayKey,
  audioSrc,
  className = "",
}: TtsButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const autoPlayStarted = useRef(false);

  useEffect(() => () => stopTts(), []);

  useEffect(() => {
    if (!autoPlay || autoPlayStarted.current) return;
    autoPlayStarted.current = true;
    const key = autoPlayKey ?? `${language}:${segment}:${text}`;
    const now = Date.now();
    const lastStartedAt = recentAutoPlays.get(key) ?? 0;
    if (now - lastStartedAt < AUTO_PLAY_DEDUP_MS) return;
    recentAutoPlays.set(key, now);
    for (const [storedKey, startedAt] of recentAutoPlays) {
      if (now - startedAt > 60_000) recentAutoPlays.delete(storedKey);
    }
    playPreferredAudio(text, audioSrc, { language, segment, playbackRate })
      .then(() => setStatus("idle"))
      .catch(() => setStatus("idle"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const toggle = async () => {
    if (status === "playing") {
      stopTts();
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const promise = playPreferredAudio(text, audioSrc, { language, segment, playbackRate });
    setStatus("playing");
    try {
      await promise;
      setStatus("idle");
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1800);
    }
  };

  const textLabel =
    status === "loading" ? "生成中" : status === "playing" ? "停止" : status === "error" ? "稍后再试" : label;
  const rateLabel = language === "en" && playbackRate < 1 ? `${playbackRate.toFixed(2)}×` : null;

  return (
    <button
      type="button"
      className={`tts-button ${status} ${className}`}
      onClick={() => void toggle()}
      disabled={status === "loading"}
      aria-label={`${label}：${text}${rateLabel ? `，${rateLabel}慢速` : ""}`}
    >
      <span aria-hidden="true">{status === "playing" ? "■" : "🔊"}</span>
      {textLabel}
      {rateLabel && <em className="tts-rate">{rateLabel}</em>}
    </button>
  );
}
