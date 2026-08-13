"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type DrawingSample = { id: string; title: string; category: string; level: string; icon: string; image: string; instruction: string; reward: number; opacity: number };

const samples: DrawingSample[] = [
  { id: "puppy-coloring", title: "挥手小狗", category: "森林动物", level: "萌芽填色", icon: "🐶", image: "/drawing-samples/01-puppy-coloring.png", instruction: "选一支粗画笔，给小狗涂上喜欢的颜色。", reward: 5, opacity: .9 },
  { id: "bunny-tracing", title: "萝卜小兔", category: "森林动物", level: "线条描画", icon: "🐰", image: "/drawing-samples/02-bunny-tracing.png", instruction: "沿着绿色虚线慢慢画，别着急。", reward: 8, opacity: .65 },
  { id: "kitten-steps", title: "四步画小猫", category: "分步学画", level: "分步学画", icon: "🐱", image: "/drawing-samples/03-kitten-steps.png", instruction: "从圆形开始，跟着四幅小图一步一步画。", reward: 10, opacity: .85 },
  { id: "cottage-grid", title: "森林小屋", category: "花草自然", level: "网格临摹", icon: "🏡", image: "/drawing-samples/04-cottage-grid.png", instruction: "观察每一个格子，把小屋临摹出来。", reward: 12, opacity: .55 },
  { id: "train-challenge", title: "补全小火车", category: "快乐交通", level: "创意挑战", icon: "🚂", image: "/drawing-samples/05-train-challenge.png", instruction: "发挥想象，在右边补全小火车和森林。", reward: 15, opacity: .8 },
];

const colors = ["#245b35", "#f05d74", "#f59d3d", "#f2ca4b", "#71b95a", "#52a8cf", "#8e71c7", "#6f4c3e"];
const brushSizes = [6, 14, 28];

export default function DrawingStudio({ coins, onReward }: { coins: number; onReward: (amount: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);
  const [sample, setSample] = useState(samples[0]);
  const [color, setColor] = useState(colors[0]);
  const [brushSize, setBrushSize] = useState(14);
  const [eraser, setEraser] = useState(false);
  const [templateOpacity, setTemplateOpacity] = useState(samples[0].opacity);
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

  const context = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;
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
    setSample(next); setTemplateOpacity(next.opacity); setNotice(""); setHistoryTick((value) => value + 1);
  };
  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * 1000 / rect.width, y: (event.clientY - rect.top) * 700 / rect.height };
  };
  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId); snapshot(); redoStack.current = [];
    drawingRef.current = true; setHasDrawing(true); lastPoint.current = pointFromEvent(event);
  };
  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = context(); if (!ctx) return;
    const next = pointFromEvent(event);
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.strokeStyle = color; ctx.lineWidth = eraser ? brushSize * 2.2 : brushSize;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(lastPoint.current.x, lastPoint.current.y); ctx.lineTo(next.x, next.y); ctx.stroke(); lastPoint.current = next;
  };
  const stopDrawing = () => { if (drawingRef.current) setHistoryTick((value) => value + 1); drawingRef.current = false; };
  const undo = () => { const ctx = context(); if (!ctx || undoStack.current.length === 0) return; redoStack.current.push(ctx.getImageData(0, 0, 1000, 700)); ctx.putImageData(undoStack.current.pop()!, 0, 0); setHistoryTick((value) => value + 1); };
  const redo = () => { const ctx = context(); if (!ctx || redoStack.current.length === 0) return; undoStack.current.push(ctx.getImageData(0, 0, 1000, 700)); ctx.putImageData(redoStack.current.pop()!, 0, 0); setHistoryTick((value) => value + 1); };
  const saveArtwork = async () => {
    const source = canvasRef.current; if (!source) return;
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
    <div className="drawing-levels">{samples.map((item, index) => <button className={sample.id === item.id ? "active" : ""} key={item.id} onClick={() => chooseSample(item)} type="button"><span>{item.icon}</span><b>{index + 1}</b><strong>{item.level}</strong><small>{item.title}</small>{completed.includes(item.id) && <em>✓</em>}</button>)}</div>
    <div className="drawing-layout"><section className="drawing-workspace"><header><div><small>{sample.category} · {sample.level}</small><h2>{sample.icon} {sample.title}</h2><p>{sample.instruction}</p></div><strong>首次完成 +{sample.reward} 🪙</strong></header>
      <div className="drawing-stage"><img src={sample.image} alt={`${sample.title}临摹底稿`} style={{ opacity: templateOpacity }} /><canvas ref={canvasRef} width={1000} height={700} onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} aria-label={`${sample.title}画板`} /></div>
      <div className="drawing-toolbar"><div className="color-tools" aria-label="选择画笔颜色">{colors.map((item) => <button className={color === item && !eraser ? "active" : ""} key={item} onClick={() => { setColor(item); setEraser(false); }} style={{ background: item }} aria-label={`选择颜色 ${item}`} type="button" />)}</div><div className="brush-tools">{brushSizes.map((size) => <button className={brushSize === size ? "active" : ""} key={size} onClick={() => setBrushSize(size)} type="button"><i style={{ width: size / 2 + 5, height: size / 2 + 5 }} />{size === 6 ? "细" : size === 14 ? "中" : "粗"}</button>)}</div><div className="edit-tools"><button className={eraser ? "active" : ""} onClick={() => setEraser(!eraser)} type="button">🧽 橡皮</button><button disabled={undoStack.current.length === 0} onClick={undo} type="button">↶ 撤销</button><button disabled={redoStack.current.length === 0} onClick={redo} type="button">↷ 重做</button><button onClick={() => clearDrawing()} type="button">清空</button></div></div>
      <div className="template-control"><label>底稿清晰度 <input type="range" min="0.15" max="1" step="0.05" value={templateOpacity} onChange={(event) => setTemplateOpacity(Number(event.target.value))} /></label><button disabled={!hasDrawing} onClick={() => void saveArtwork()} type="button">{hasDrawing ? "收藏到我的画册 →" : "先画几笔吧"}</button></div>{notice && <div className="drawing-notice">🌟 {notice}</div>}</section>
      <aside className="drawing-gallery"><header><div><small>本机最多保存8幅</small><h2>🖼️ 我的画册</h2></div><span>{gallery.length} 幅</span></header>{gallery.length === 0 ? <div className="empty-gallery"><span>🎨</span><strong>第一幅画在等你</strong><p>画好后点击“收藏到我的画册”。</p></div> : <div>{gallery.map((art) => <article key={art.id}><img src={art.image} alt={art.title} /><div><strong>{art.title}</strong><small>{art.date}</small></div></article>)}</div>}</aside></div>
  </section>;
}
