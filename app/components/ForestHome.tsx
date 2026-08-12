"use client";

import { useEffect, useMemo, useState } from "react";

type Area = "indoor" | "garden";
type HomeItem = { id: string; name: string; icon: string; price: number; area: Area; note: string };

const ITEMS: HomeItem[] = [
  { id: "desk", name: "森林书桌", icon: "🪵", price: 8, area: "indoor", note: "适合写字和画画" },
  { id: "bookshelf", name: "绘本书架", icon: "📚", price: 10, area: "indoor", note: "把喜欢的故事放进来" },
  { id: "sofa", name: "云朵沙发", icon: "🛋️", price: 12, area: "indoor", note: "软绵绵的休息角" },
  { id: "lamp", name: "蘑菇台灯", icon: "🍄", price: 6, area: "indoor", note: "给阅读角加一点暖光" },
  { id: "rug", name: "叶子地毯", icon: "🍃", price: 7, area: "indoor", note: "铺在小屋的木地板上" },
  { id: "bed", name: "宠物小床", icon: "🧺", price: 9, area: "indoor", note: "伙伴们喜欢的小窝" },
  { id: "flower", name: "雏菊花坛", icon: "🌼", price: 6, area: "garden", note: "让花园开满小花" },
  { id: "tree", name: "苹果树", icon: "🌳", price: 12, area: "garden", note: "春天发芽，秋天结果" },
  { id: "swing", name: "木头秋千", icon: "🛝", price: 15, area: "garden", note: "和动物伙伴一起玩" },
  { id: "pond", name: "睡莲池塘", icon: "🪷", price: 14, area: "garden", note: "小青蛙偶尔来做客" },
  { id: "fence", name: "白色围栏", icon: "🏡", price: 8, area: "garden", note: "围出温柔的小花园" },
  { id: "windmill", name: "彩色风车", icon: "🎡", price: 7, area: "garden", note: "风吹过时轻轻转动" },
];

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

export default function ForestHome({ coins, onSpend }: { coins: number; onSpend: (price: number) => void }) {
  const [area, setArea] = useState<Area>("indoor");
  const [owned, setOwned] = useState<string[]>([]);
  const [placed, setPlaced] = useState<Record<Area, Array<string | null>>>({ indoor: Array(6).fill(null), garden: Array(6).fill(null) });
  const [pet, setPet] = useState("dog");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [notice, setNotice] = useState("完成学习赚金币，把喜欢的东西带回家吧！");

  useEffect(() => {
    setOwned(readList(OWNED_KEY));
    try {
      const saved = JSON.parse(window.localStorage.getItem(PLACED_KEY) ?? "null") as Record<Area, Array<string | null>> | null;
      if (saved?.indoor && saved?.garden) setPlaced(saved);
      setPet(window.localStorage.getItem(PET_KEY) ?? "dog");
    } catch { /* 使用默认家园 */ }
  }, []);

  const areaItems = useMemo(() => ITEMS.filter((item) => item.area === area), [area]);
  const currentPet = PETS.find((item) => item.id === pet) ?? PETS[0];

  const savePlaced = (next: Record<Area, Array<string | null>>) => {
    setPlaced(next);
    try { window.localStorage.setItem(PLACED_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const buy = (item: HomeItem) => {
    if (owned.includes(item.id)) { setSelectedItem(item.id); setNotice(`已选中${item.name}，点一个空位置摆放。`); return; }
    if (coins < item.price) { setNotice(`还差 ${item.price - coins} 枚金币，完成学习就能继续积累。`); return; }
    const nextOwned = [...owned, item.id];
    setOwned(nextOwned);
    onSpend(item.price);
    setSelectedItem(item.id);
    try { window.localStorage.setItem(OWNED_KEY, JSON.stringify(nextOwned)); } catch { /* ignore */ }
    setNotice(`${item.name}已经买好啦！点一个空位置摆放。`);
  };

  const placeInSlot = (slotIndex: number, itemId = selectedItem) => {
    if (!itemId || !owned.includes(itemId)) return;
    const item = ITEMS.find((entry) => entry.id === itemId);
    if (!item || item.area !== area) return;
    const nextArea = placed[area].map((slot, index) => index === slotIndex ? itemId : slot === itemId ? null : slot);
    savePlaced({ ...placed, [area]: nextArea });
    setSelectedItem(null);
    setNotice(`${item.name}摆好啦！也可以拖到其他位置。`);
  };

  const removeFromSlot = (slotIndex: number) => {
    const itemId = placed[area][slotIndex];
    if (!itemId) return;
    const nextArea = placed[area].map((slot, index) => index === slotIndex ? null : slot);
    savePlaced({ ...placed, [area]: nextArea });
    setSelectedItem(itemId);
    setNotice("已收回装饰，点其他位置可以重新摆放。");
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
        <div className={`home-scene ${area}`}>
          <div className="home-sky" aria-hidden="true"><i /><i /><span>{area === "indoor" ? "☀️" : "☁️"}</span></div>
          <div className="home-scene-label"><strong>{area === "indoor" ? "Leo 的阳光小屋" : "Leo 的秘密花园"}</strong><small>点选装饰后，再点空位置摆放</small></div>
          <button className="home-pet" onClick={() => setNotice(`${currentPet.name}开心地向你挥挥手！`)} type="button" aria-label={`和${currentPet.name}互动`}><span>{currentPet.icon}</span><i>♥</i></button>
          <div className="home-slots">
            {placed[area].map((itemId, index) => {
              const item = ITEMS.find((entry) => entry.id === itemId);
              return (
                <button
                  className={`home-slot ${item ? "filled" : ""} ${selectedItem ? "ready" : ""}`}
                  key={`${area}-${index}`}
                  onClick={() => item ? removeFromSlot(index) : placeInSlot(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => { event.preventDefault(); placeInSlot(index, event.dataTransfer.getData("text/plain")); }}
                  type="button"
                  aria-label={item ? `${item.name}，点击收回` : `空位置${index + 1}`}
                >{item ? <><span>{item.icon}</span><small>{item.name}</small></> : <span className="slot-plus">＋</span>}</button>
              );
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
            return <button className={`${isOwned ? "owned" : ""} ${selectedItem === item.id ? "selected" : ""}`} draggable={isOwned} key={item.id} onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)} onClick={() => buy(item)} type="button"><span>{item.icon}</span><div><strong>{item.name}</strong><small>{item.note}</small></div><em>{isOwned ? "摆放" : `${item.price} 🪙`}</em></button>;
          })}
        </div>
      </section>
    </section>
  );
}
