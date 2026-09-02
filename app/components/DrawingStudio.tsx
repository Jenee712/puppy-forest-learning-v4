"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type DrawingSample = { id: string; title: string; category: string; level: string; icon: string; image: string; instruction: string; reward: number; opacity: number };

const samples: DrawingSample[] = [
  { id: "puppy-coloring", title: "挥手小狗", category: "森林动物", level: "大块填色", icon: "🐶", image: "/drawing-samples/01-puppy-coloring.png", instruction: "只有几个大色块，选喜欢的颜色涂一涂。", reward: 5, opacity: .9 },
  { id: "bunny-tracing", title: "萝卜小兔", category: "森林动物", level: "简单描线", icon: "🐰", image: "/drawing-samples/02-bunny-tracing.png", instruction: "沿着宽宽的绿色虚线慢慢画。", reward: 8, opacity: .65 },
  { id: "kitten-steps", title: "三步画小猫", category: "分步学画", level: "三步学画", icon: "🐱", image: "/drawing-samples/03-kitten-steps.png", instruction: "圆形、耳朵、笑脸，三步画出小猫。", reward: 10, opacity: .85 },
  { id: "cottage-grid", title: "四格小屋", category: "花草自然", level: "四格临摹", icon: "🏡", image: "/drawing-samples/04-cottage-grid.png", instruction: "只看四个大格子，把简单小屋画出来。", reward: 12, opacity: .55 },
  { id: "train-challenge", title: "补全小火车", category: "快乐交通", level: "半边补全", icon: "🚂", image: "/drawing-samples/05-train-challenge.png", instruction: "照着左边，在右边补全半辆小火车。", reward: 15, opacity: .8 },
];

const colors = ["#245b35", "#f05d74", "#f59d3d", "#f2ca4b", "#71b95a", "#52a8cf", "#8e71c7", "#6f4c3e"];
const brushSizes = [6, 14, 28];

export default function DrawingStudio({ coins, onReward }: { coins: number; onReward: (amount: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastPoint = useRef({ x: 0, y: 0 });
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);
  const [sample, setSample] = useState<DrawingSample | null>(null);
  const [color, setColor] = useState(colors[0]);
  const [brushSize, setBrushSize] = useState(14);
  const [eraser, setEraser] = useState(false);
  const [templateOpacity, setTemplateOpacity] = useState(samples[0].opacity);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [, setHistoryTick] = useState(0);
  const [notice, setNotice] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [gallery, setGallery] = useState<{ id: string; title: string; image: string; date: string }[]>([]);

  useEffect(() => {
    try {
      setCompleted(JSON.parse(window.localStorage.getItem("puppy-forest-drawing-completed") ?? "[]"));
      setGallery(JSON.parse(window.localStorage.getItem("puppy-forest-drawing-gallery") ?? "[]"));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  useEffect(() => {
    const onFullscreenChange = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", onFullscreenChange); document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("fullscreenchange", onFullscreenChange); document.removeEventListener("keydown", onKeyDown); };
  }, []);

  const context = () => {
    if (!contextRef.current && canvasRef.current) contextRef.current = canvasRef.current.getContext("2d");
    return contextRef.current;
  };
  const snapshot = () => {
    const ctx = context(); if (!ctx) return;
    if (undoStack.current.length >= 12) undoStack.current.shift();
    undoStack.current.push(ctx.getImageData(0, 0, 1000, 700));
  };
  const clearDrawing = (record = true) => {
    const ctx = context(); if (!ctx) return;
    if (record) snapshot();
    ctx.clearRect(0, 0, 1000, 700); redoStack.current = []; setHasDrawing(false); setHistoryTick((value) => value + 1);
  };
  const chooseSample = (next: DrawingSample) => {
    clearDrawing(false); undoStack.current = []; redoStack.current = [];
    contextRef.current = null;
    setSample(next); setTemplateOpacity(next.opacity); setNotice(""); setHistoryTick((value) => value + 1);
  };
  const returnToChoices = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    setIsFullscreen(false); clearDrawing(false); undoStack.current = []; redoStack.current = [];
    setSample(null); setNotice("");
  };
  const toggleFullscreen = async () => {
    if (isFullscreen) {
      if (document.fullscreenElement) await document.exitFullscreen();
      setIsFullscreen(false); return;
    }
    setIsFullscreen(true);
    try { await layoutRef.current?.requestFullscreen?.(); } catch { /* CSS fullscreen remains available */ }
  };
  const pointFromClient = (clientX: number, clientY: number, rect: DOMRect) => {
    return { x: (clientX - rect.left) * 1000 / rect.width, y: (clientY - rect.top) * 700 / rect.height };
  };
  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (drawingRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId); snapshot(); redoStack.current = [];
    const rect = event.currentTarget.getBoundingClientRect();
    drawingRef.current = true; pointerIdRef.current = event.pointerId; setHasDrawing(true);
    lastPoint.current = pointFromClient(event.clientX, event.clientY, rect);
  };
  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || pointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    const ctx = context(); if (!ctx) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nativeEvent = event.nativeEvent;
    const points = typeof nativeEvent.getCoalescedEvents === "function" ? nativeEvent.getCoalescedEvents() : [nativeEvent];
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.strokeStyle = color; ctx.lineWidth = eraser ? brushSize * 2.2 : brushSize;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    points.forEach((point) => {
      const next = pointFromClient(point.clientX, point.clientY, rect);
      ctx.lineTo(next.x, next.y); lastPoint.current = next;
    });
    ctx.stroke();
  };
  const stopDrawing = (event?: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || (event && pointerIdRef.current !== event.pointerId)) return;
    if (event?.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setHistoryTick((value) => value + 1); drawingRef.current = false; pointerIdRef.current = null;
    const ctx = context(); if (ctx) ctx.globalCompositeOperation = "source-over";
  };
  const undo = () => { const ctx = context(); if (!ctx || undoStack.current.length === 0) return; redoStack.current.push(ctx.getImageData(0, 0, 1000, 700)); ctx.putImageData(undoStack.current.pop()!, 0, 0); setHistoryTick((value) => value + 1); };
  const redo = () => { const ctx = context(); if (!ctx || redoStack.current.length === 0) return; undoStack.current.push(ctx.getImageData(0, 0, 1000, 700)); ctx.putImageData(redoStack.current.pop()!, 0, 0); setHistoryTick((value) => value + 1); };
  const saveArtwork = async () => {
    const source = canvasRef.current; if (!source || !sample) return;
    const output = document.createElement("canvas"); output.width = 800; output.height = 560;
    const ctx = output.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#fffdf7"; ctx.fillRect(0, 0, 800, 560);
    const image = new Image(); image.src = sample.image;
    await new Promise<void>((resolve) => { image.onload = () => resolve(); image.onerror = () => resolve(); });
    const scale = Math.min(800 / image.width, 560 / image.height), width = image.width * scale, height = image.height * scale;
    ctx.globalAlpha = templateOpacity; ctx.drawImage(image, (800 - width) / 2, (560 - height) / 2, width, height);
    ctx.globalAlpha = 1; ctx.drawImage(source, 0, 0, 800, 560);
    const data = output.toDataURL("image/jpeg", .72);
    const nextGallery = [{ id: `${sample.id}-${Date.now()}`, title: sample.title, image: data, date: new Date().toLocaleDateString("zh-CN") }, ...gallery].slice(0, 8);
    setGallery(nextGallery);
    try { window.localStorage.setItem("puppy-forest-drawing-gallery", JSON.stringify(nextGallery)); } catch { /* storage full */ }
    if (!completed.includes(sample.id)) {
      const nextCompleted = [...completed, sample.id]; setCompleted(nextCompleted); onReward(sample.reward);
      try { window.localStorage.setItem("puppy-forest-drawing-completed", JSON.stringify(nextCompleted)); } catch { /* ignore */ }
      setNotice(`作品已收藏！首次完成获得 ${sample.reward} 枚金币 🪙`);
    } else setNotice("作品已经收藏进我的画册啦！");
  };

  return <section className="drawing-page page-surface">
    <header className="drawing-header"><div><span>🎨 森林小画室</span><h1>照着画，也可以画得不一样</h1><p>从简单填色到创意挑战，慢慢练习小手控制和观察力。</p></div><div className="drawing-wallet"><span>🪙</span><strong>{coins}</strong><small>学习金币</small></div></header>
    {!sample ? <section className="drawing-picker"><header><span>第一步</span><div><small>今天想画什么？</small><h2>选一张喜欢的画</h2></div><strong>共 {samples.length} 张</strong></header><div>{samples.map((item, index) => <button key={item.id} onClick={() => chooseSample(item)} type="button"><figure><img src={item.image} alt={`${item.title}画画底稿`} /><i>{item.icon}</i>{completed.includes(item.id) && <em>画过啦 ✓</em>}</figure><div><small>第 {index + 1} 关 · {item.level}</small><strong>{item.title}</strong><p>{item.instruction}</p><span>选这张画 →</span></div></button>)}</div></section> : <div ref={layoutRef} className={`drawing-layout${isFullscreen ? " drawing-is-fullscreen" : ""}`}><section className="drawing-workspace"><header><div><small>{sample.category} · {sample.level}</small><h2>{sample.icon} {sample.title}</h2><p>{sample.instruction}</p></div><div className="drawing-workspace-actions"><strong>首次完成 +{sample.reward} 🪙</strong><button onClick={() => void toggleFullscreen()} type="button">{isFullscreen ? "↙ 退出全屏" : "⛶ 全屏画画"}</button><button className="drawing-change" onClick={returnToChoices} type="button">换一张</button></div></header>
      <div className="drawing-stage"><img src={sample.image} alt={`${sample.title}临摹底稿`} style={{ opacity: templateOpacity }} /><canvas className={eraser ? "is-erasing" : "is-drawing"} ref={canvasRef} width={1000} height={700} onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} onLostPointerCapture={stopDrawing} aria-label={`${sample.title}画板，当前使用${eraser ? "橡皮" : "画笔"}`} /></div>
      <div className="drawing-toolbar">
        <div className="drawing-primary-tools" aria-label="选择画画工具"><button className={!eraser ? "active" : ""} onClick={() => setEraser(false)} type="button"><span aria-hidden="true">✏️</span><b>画笔</b></button><button className={eraser ? "active" : ""} onClick={() => setEraser(true)} type="button"><span className="eraser-symbol" aria-hidden="true" /><b>橡皮</b></button></div>
        <div className="color-tools" aria-label="选择画笔颜色">{colors.map((item) => <button className={color === item && !eraser ? "active" : ""} key={item} onClick={() => { setColor(item); setEraser(false); }} style={{ background: item }} aria-label={`选择颜色 ${item}`} type="button" />)}</div>
        <div className="brush-tools" aria-label="选择笔触粗细">{brushSizes.map((size) => <button className={brushSize === size ? "active" : ""} key={size} onClick={() => setBrushSize(size)} type="button"><i style={{ width: size / 2 + 5, height: size / 2 + 5 }} />{size === 6 ? "细" : size === 14 ? "中" : "粗"}</button>)}</div>
        <div className="edit-tools"><button disabled={undoStack.current.length === 0} onClick={undo} type="button"><span aria-hidden="true">↶</span>撤销</button><button disabled={redoStack.current.length === 0} onClick={redo} type="button"><span aria-hidden="true">↷</span>重做</button><button onClick={() => clearDrawing()} type="button"><span aria-hidden="true">🗑️</span>清空</button></div>
      </div>
      <div className="template-control"><label>底稿清晰度 <input type="range" min="0.15" max="1" step="0.05" value={templateOpacity} onChange={(event) => setTemplateOpacity(Number(event.target.value))} /></label><button disabled={!hasDrawing} onClick={() => void saveArtwork()} type="button">{hasDrawing ? "收藏到我的画册 →" : "先画几笔吧"}</button></div>{notice && <div className="drawing-notice">🌟 {notice}</div>}</section>
      {!isFullscreen && <aside className="drawing-gallery"><header><div><small>本机最多保存8幅</small><h2>🖼️ 我的画册</h2></div><span>{gallery.length} 幅</span></header>{gallery.length === 0 ? <div className="empty-gallery"><span>🎨</span><strong>第一幅画在等你</strong><p>画好后点击“收藏到我的画册”。</p></div> : <div>{gallery.map((art) => <article key={art.id}><img src={art.image} alt={art.title} /><div><strong>{art.title}</strong><small>{art.date}</small></div></article>)}</div>}</aside>}</div>}
  </section>;
}
