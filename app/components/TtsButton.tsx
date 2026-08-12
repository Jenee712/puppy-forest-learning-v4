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
  audioSrc?: string;
  className?: string;
};

type Status = "idle" | "loading" | "playing" | "error";

export function TtsButton({
  text,
  segment,
  label,
  language = "en",
  playbackRate = 1,
  autoPlay = false,
  audioSrc,
  className = "",
}: TtsButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const autoPlayStarted = useRef(false);

  useEffect(() => () => stopTts(), []);

  useEffect(() => {
    if (!autoPlay || autoPlayStarted.current) return;
    autoPlayStarted.current = true;
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
