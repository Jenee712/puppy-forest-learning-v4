export type TtsRequest = {
  text: string;
  language: "en" | "zh";
  segment: "word" | "sentence";
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

let tokenCache: { value: string; expiresAt: number } | null = null;

export function parseTtsRequest(value: unknown): TtsRequest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const language = input.language === "zh" ? "zh" : input.language === "en" ? "en" : null;
  const segment = input.segment === "word" ? "word" : input.segment === "sentence" ? "sentence" : null;
  if (!text || !language || !segment || new TextEncoder().encode(text).byteLength > 900) return null;
  return { text, language, segment };
}

// Baidu's Chinese voice may pronounce a standalone lowercase Latin letter as
// a Chinese syllable (for example, `a` as “鹅”). Letter case is visual only:
// both `A` and `a` should use the English letter name /eɪ/. Normalize letter
// exercises before synthesis while leaving ordinary English words untouched.
export function normalizeTtsText(input: TtsRequest) {
  const text = input.text.trim();

  if (input.segment === "word" && /^[A-Za-z](?:\s+[A-Za-z])*$/.test(text)) {
    return text
      .split(/\s+/)
      .map((letter) => `${letter.toUpperCase()}.`)
      .join(" ");
  }

  if (input.language === "zh") {
    return text.replace(/((?:大写|小写|英文字母|字母)\s*)([A-Za-z])\b/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);
  }

  return text;
}

async function getAccessToken(apiKey: string, secretKey: string) {
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.value;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: apiKey,
    client_secret: secretKey,
  });
  const response = await fetch("https://aip.baidubce.com/oauth/2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json() as TokenResponse;
  if (!response.ok || !data.access_token) throw new Error(data.error_description ?? data.error ?? "baidu_token_failed");

  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max(60, (data.expires_in ?? 2_592_000) - 300) * 1000,
  };
  return tokenCache.value;
}

export async function synthesizeWithBaidu(
  input: TtsRequest,
  apiKey: string,
  secretKey: string,
  voice = "0",
) {
  const token = await getAccessToken(apiKey, secretKey);
  const body = new URLSearchParams({
    tex: normalizeTtsText(input),
    tok: token,
    cuid: "puppy-forest-v4",
    ctp: "1",
    lan: input.language,
    spd: input.segment === "word" ? "4" : "5",
    pit: "5",
    vol: "8",
    per: voice,
    aue: "3",
  });
  const response = await fetch("https://tsn.baidu.com/text2audio", {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || contentType.includes("json")) throw new Error("baidu_tts_failed");
  return response.arrayBuffer();
}
