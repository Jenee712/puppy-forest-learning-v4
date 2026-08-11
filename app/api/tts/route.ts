import { parseTtsRequest, synthesizeWithBaidu } from "@/lib/tts/baiduTts";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 2_000) return Response.json({ error: "朗读内容过长" }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "请求格式错误" }, { status: 400 }); }
  const input = parseTtsRequest(body);
  if (!input) return Response.json({ error: "朗读内容不符合要求" }, { status: 400 });

  const apiKey = process.env.BAIDU_TTS_API_KEY;
  const secretKey = process.env.BAIDU_TTS_SECRET_KEY;
  if (!apiKey || !secretKey) return Response.json({ error: "语音服务尚未配置" }, { status: 503 });

  try {
    const premiumVoice = process.env.BAIDU_TTS_PREMIUM_VOICE?.trim() || "5118";
    let selectedVoice = premiumVoice;
    let audio: ArrayBuffer;

    try {
      audio = await synthesizeWithBaidu(input, apiKey, secretKey, premiumVoice);
    } catch {
      // 精品音库尚未开通或临时不可用时，保证孩子仍然能听到题目。
      selectedVoice = "0";
      audio = await synthesizeWithBaidu(input, apiKey, secretKey, selectedVoice);
    }

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
        "X-TTS-Voice": `baidu-female-${selectedVoice}`,
      },
    });
  } catch {
    return Response.json({ error: "语音生成暂时失败，请稍后再试" }, { status: 502 });
  }
}
