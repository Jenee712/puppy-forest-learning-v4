"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";

type Area = "indoor" | "garden";
type HomeItem = { id: string; name: string; asset: string; price: number; area: Area; note: string };
type PlacedItem = { id: string; x: number; y: number };
type PlacedState = Record<Area, PlacedItem[]>;

const INDOOR_NAMES = [
  "森林书桌", "圆圆阅读椅", "云朵沙发", "橡木书架", "拱门绘本柜", "蘑菇台灯",
  "叶子地毯", "宠物小床", "森林木床", "床边小柜", "森林衣柜", "圆圆茶桌",
  "软垫凳子", "木头玩具箱", "小画架", "儿童钢琴", "暖光落地灯", "叶子时钟",
  "森林相框", "格子窗帘", "陶盆绿植", "鲜花花瓶", "收纳藤篮", "森林小黑板",
  "阅读帐篷", "摇摇木马", "玩具火车", "绘本一摞", "圆形坐垫", "木头衣帽架",
];

const GARDEN_NAMES = [
  "雏菊花坛", "郁金花坛", "小苹果树", "樱花树", "圆圆花灌木", "修剪绿篱",
  "白色围栏", "拱形花园门", "石板小路", "花园木桥", "睡莲池塘", "小鸟浴台",
  "木头长椅", "双人秋千", "蓝色滑梯", "野餐帐篷", "彩色风车", "森林风车屋",
  "暖光路灯", "空白指示牌", "森林鸟屋", "绿色浇水壶", "木头手推车", "野餐篮和餐布",
  "蔬菜小园", "蘑菇家族", "向日葵丛", "树桩花盆", "小火车花盆", "彩虹花架",
];

function createItems(names: string[], area: Area): HomeItem[] {
  return names.map((name, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `${area}-${number}`,
      name,
      asset: `/home-assets/items/${area}-${number}.png`,
      price: 5 + (index % 6) * 2,
      area,
      note: area === "indoor" ? "装进温暖的森林小屋" : "摆进阳光下的秘密花园",
    };
  });
}

const ITEMS: HomeItem[] = [...createItems(INDOOR_NAMES, "indoor"), ...createItems(GARDEN_NAMES, "garden")];

const PETS = [
  { id: "dog", name: "小狗", icon: "🐶" },
  { id: "cat", name: "小猫", icon: "🐱" },
  { id: "rabbit", name: "小兔", icon: "🐰" },
];

const OWNED_KEY = "puppy-forest-home-owned";
const PLACED_KEY = "puppy-forest-home-placed";
const PET_KEY = "puppy-forest-home-pet";

function readList(key: string): string[] {
  try { return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[]; } catch { return []; }
}

function readPlaced(): PlacedState {
  const empty: PlacedState = { indoor: [], garden: [] };
  try {
    const saved = JSON.parse(window.localStorage.getItem(PLACED_KEY) ?? "null") as Record<Area, Array<string | null | PlacedItem>> | null;
    if (!saved?.indoor || !saved?.garden) return empty;
    const normalize = (entries: Array<string | null | PlacedItem>, area: Area) => entries.flatMap((entry, index) => {
      const id = typeof entry === "string" ? entry : entry?.id;
      if (!id || !ITEMS.some((item) => item.id === id && item.area === area)) return [];
      if (typeof entry === "object" && entry && typeof entry.x === "number" && typeof entry.y === "number") return [entry];
      return [{ id, x: 16 + (index % 3) * 25, y: 64 + Math.floor(index / 3) * 20 }];
    });
    return { indoor: normalize(saved.indoor, "indoor"), garden: normalize(saved.garden, "garden") };
  } catch { return empty; }
}

export default function ForestHome({ coins, onSpend }: { coins: number; onSpend: (price: number) => void }) {
  const [area, setArea] = useState<Area>("indoor");
  const [owned, setOwned] = useState<string[]>([]);
  const [placed, setPlaced] = useState<PlacedState>({ indoor: [], garden: [] });
  const [pet, setPet] = useState("dog");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [notice, setNotice] = useState("完成学习赚金币，把喜欢的东西带回家吧！");
  const sceneRef = useRef<HTMLDivElement>(null);
  const placedRef = useRef<PlacedState>({ indoor: [], garden: [] });
  const dragRef = useRef<string | null>(null);

  useEffect(() => {
    setOwned(readList(OWNED_KEY));
    const saved = readPlaced();
    placedRef.current = saved;
    setPlaced(saved);
    try { setPet(window.localStorage.getItem(PET_KEY) ?? "dog"); } catch { /* 使用默认伙伴 */ }
  }, []);

  const areaItems = useMemo(() => ITEMS.filter((item) => item.area === area), [area]);
  const currentPet = PETS.find((item) => item.id === pet) ?? PETS[0];

  const savePlaced = (next: PlacedState, persist = true) => {
    placedRef.current = next;
    setPlaced(next);
    if (persist) try { window.localStorage.setItem(PLACED_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const buy = (item: HomeItem) => {
    if (owned.includes(item.id)) { setSelectedItem(item.id); setNotice(`已选中${item.name}，点画面任意位置摆放。`); return; }
    if (coins < item.price) { setNotice(`还差 ${item.price - coins} 枚金币，完成学习就能继续积累。`); return; }
    const nextOwned = [...owned, item.id];
    setOwned(nextOwned);
    onSpend(item.price);
    setSelectedItem(item.id);
    try { window.localStorage.setItem(OWNED_KEY, JSON.stringify(nextOwned)); } catch { /* ignore */ }
    setNotice(`${item.name}已经买好啦！点画面任意位置摆放。`);
  };

  const positionFromPointer = (event: ReactPointerEvent) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.min(94, Math.max(6, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(92, Math.max(12, ((event.clientY - rect.top) / rect.height) * 100)),
    };
  };

  const placeSelected = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!selectedItem || event.target !== event.currentTarget) return;
    const position = positionFromPointer(event);
    const item = ITEMS.find((entry) => entry.id === selectedItem);
    if (!position || !item || item.area !== area || !owned.includes(item.id)) return;
    const nextArea = [...placedRef.current[area].filter((entry) => entry.id !== item.id), { id: item.id, ...position }];
    savePlaced({ ...placedRef.current, [area]: nextArea });
    setSelectedItem(null);
    setNotice(`${item.name}摆好啦！按住它就能随意移动。`);
  };

  const startDragging = (event: ReactPointerEvent<HTMLButtonElement>, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = itemId;
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = placedRef.current[area];
    savePlaced({ ...placedRef.current, [area]: [...current.filter((entry) => entry.id !== itemId), ...current.filter((entry) => entry.id === itemId)] }, false);
  };

  const movePlaced = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const itemId = dragRef.current;
    if (!itemId) return;
    event.preventDefault();
    const position = positionFromPointer(event);
    if (!position) return;
    const nextArea = placedRef.current[area].map((entry) => entry.id === itemId ? { ...entry, ...position } : entry);
    savePlaced({ ...placedRef.current, [area]: nextArea }, false);
  };

  const finishDragging = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* pointer already released */ }
    try { window.localStorage.setItem(PLACED_KEY, JSON.stringify(placedRef.current)); } catch { /* ignore */ }
    setNotice("位置保存好啦！下次打开还会在这里。");
  };

  const removePlaced = (event: ReactPointerEvent, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();
    const nextArea = placedRef.current[area].filter((entry) => entry.id !== itemId);
    savePlaced({ ...placedRef.current, [area]: nextArea });
    setSelectedItem(itemId);
    setNotice("已经收回商店，点画面任意位置可以重新摆放。");
  };

  const choosePet = (id: string) => {
    setPet(id);
    try { window.localStorage.setItem(PET_KEY, id); } catch { /* ignore */ }
    const chosen = PETS.find((item) => item.id === id);
    setNotice(`${chosen?.name ?? "动物伙伴"}会陪你一起照顾家园。`);
  };

  return (
    <section className="page-surface forest-home">
      <header className="home-header">
        <div className="home-title-mark" aria-hidden="true">🏡</div>
        <div><span className="section-kicker">学习奖励 · 我的空间</span><h1>森林家园</h1><p>用学习金币装扮室内和花园，选择一位动物伙伴陪你生活。</p></div>
        <div className="home-wallet"><span>🪙</span><strong>{coins}</strong><small>学习金币</small></div>
      </header>

      <div className="home-area-tabs" aria-label="选择家园区域">
        <button className={area === "indoor" ? "active" : ""} onClick={() => { setArea("indoor"); setSelectedItem(null); }} type="button"><span>🛋️</span><strong>室内小屋</strong><small>阅读、休息和陪伴</small></button>
        <button className={area === "garden" ? "active" : ""} onClick={() => { setArea("garden"); setSelectedItem(null); }} type="button"><span>🌷</span><strong>室外花园</strong><small>花草、树木和游乐</small></button>
      </div>

      <div className="home-workbench">
        <div className={`home-scene ${area}`} ref={sceneRef}>
          <div className="home-scene-label"><strong>{area === "indoor" ? "Leo 的阳光小屋" : "Leo 的秘密花园"}</strong><small>{selectedItem ? "现在点画面任意位置摆放" : "按住家具，拖到喜欢的位置"}</small></div>
          <button className="home-pet" onClick={() => setNotice(`${currentPet.name}开心地向你挥挥手！`)} type="button" aria-label={`和${currentPet.name}互动`}><span>{currentPet.icon}</span><i>♥</i></button>
          <div className={`home-placement-layer ${selectedItem ? "ready" : ""}`} onPointerDown={placeSelected}>
            {placed[area].map((placement) => {
              const item = ITEMS.find((entry) => entry.id === placement.id);
              if (!item) return null;
              return <button className="home-placed-item" key={placement.id} style={{ left: `${placement.x}%`, top: `${placement.y}%` }} onPointerDown={(event) => startDragging(event, item.id)} onPointerMove={movePlaced} onPointerUp={finishDragging} onPointerCancel={finishDragging} type="button" aria-label={`${item.name}，按住拖动`}><img src={item.asset} alt="" /><small>{item.name}</small><i onPointerDown={(event) => removePlaced(event, item.id)} aria-label={`收回${item.name}`}>×</i></button>;
            })}
          </div>
        </div>

        <aside className="home-pet-panel">
          <span className="section-kicker">免费动物伙伴</span><h2>今天和谁一起玩？</h2>
          <div>{PETS.map((item) => <button className={pet === item.id ? "active" : ""} key={item.id} onClick={() => choosePet(item.id)} type="button"><span>{item.icon}</span><strong>{item.name}</strong></button>)}</div>
          <p>{notice}</p>
        </aside>
      </div>

      <section className="home-shop">
        <header><div><span className="section-kicker">家园小商店</span><h2>{area === "indoor" ? "挑一件室内家具" : "挑一件花园装饰"}</h2></div><p>已拥有 {areaItems.filter((item) => owned.includes(item.id)).length} / {areaItems.length}</p></header>
        <div className="home-shop-grid">
          {areaItems.map((item) => {
            const isOwned = owned.includes(item.id);
            return <button className={`${isOwned ? "owned" : ""} ${selectedItem === item.id ? "selected" : ""}`} draggable={isOwned} key={item.id} onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)} onClick={() => buy(item)} type="button"><span><img src={item.asset} alt="" /></span><div><strong>{item.name}</strong><small>{item.note}</small></div><em>{isOwned ? "摆放" : `${item.price} 🪙`}</em></button>;
          })}
        </div>
      </section>
    </section>
  );
}
