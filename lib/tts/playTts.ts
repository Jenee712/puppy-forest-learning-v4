// Client-side TTS helper that streams audio from the secure /api/tts route
// (Baidu server-side synthesis). Exposes an imperative `playTts` so callers can
// chain sentences sequentially (e.g. "play whole page"), plus `stopTts` to cut
// any in-flight playback before starting a new one.

export type TtsLanguage = "en" | "zh";
export type TtsSegment = "word" | "sentence";

type TtsOptions = {
  language?: TtsLanguage;
  segment?: TtsSegment;
  playbackRate?: number;
};

let currentAudio: HTMLAudioElement | null = null;

export function stopTts() {
  if (currentAudio) {
    currentAudio.pause();
    const src = currentAudio.src;
    if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    currentAudio = null;
  }
}

// Plays one clip and resolves when it ends. Rejects if the request fails or the
// audio cannot start, so a sequential loop can stop early on error.
export async function playTts(text: string, options: TtsOptions = {}): Promise<void> {
  const { language = "en", segment = "sentence", playbackRate = 1 } = options;
  if (!text.trim()) return;
  stopTts();

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language, segment }),
  });
  if (!response.ok) throw new Error("tts_failed");
  const url = URL.createObjectURL(await response.blob());

  const audio = new Audio(url);
  audio.defaultPlaybackRate = playbackRate;
  audio.playbackRate = playbackRate;
  try {
    (audio as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
  } catch {
    /* not all engines expose it; safe to ignore */
  }
  currentAudio = audio;

  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      if (audio.src.startsWith("blob:")) URL.revokeObjectURL(audio.src);
      if (currentAudio === audio) currentAudio = null;
    };
    audio.onended = () => {
      cleanup();
      resolve();
    };
    audio.onerror = () => {
      cleanup();
      reject(new Error("tts_error"));
    };
    audio.play().catch((err) => {
      cleanup();
      reject(err);
    });
  });
}
