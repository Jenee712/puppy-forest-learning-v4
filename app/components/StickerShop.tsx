"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Sticker,
  type StickerCategory,
  allStickers,
  getStickersByCategory,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  RARITY_LABELS,
  RARITY_COLORS,
} from "@/data/stickers";

// ===================== localStorage keys =====================
const OWNED_KEY = "puppy-forest-owned-stickers";

function loadOwned(): string[] {
  try {
    const raw = window.localStorage.getItem(OWNED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveOwned(ids: string[]) {
  try { window.localStorage.setItem(OWNED_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

// ===================== helpers =====================
function rarityBadge(rarity: Sticker["rarity"]) {
  const color = RARITY_COLORS[rarity];
  const label = RARITY_LABELS[rarity];
  const stars = rarity === "legendary" ? "⭐⭐⭐" : rarity === "rare" ? "⭐⭐" : "⭐";
  return { color, label, stars };
}

// ===================== component =====================
export default function StickerShop({ coins, onSpend }: { coins: number; onSpend: (price: number) => void }) {
  const [owned, setOwned] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<StickerCategory | "all">("all");
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [showBuyConfirm, setShowBuyConfirm] = useState<Sticker | null>(null);
  const [viewMode, setViewMode] = useState<"shop" | "collection">("shop");
  const [buyAnim, setBuyAnim] = useState<string | null>(null);

  useEffect(() => {
    setOwned(loadOwned());
  }, []);

  const stickers = useMemo(
    () => (viewMode === "collection" ? allStickers.filter((s) => owned.includes(s.id)) : getStickersByCategory(activeCategory)),
    [activeCategory, viewMode, owned],
  );

  const categories = useMemo(() => {
    const cats = Object.keys(CATEGORY_LABELS) as StickerCategory[];
    return [("all" as const), ...cats];
  }, []);

  const handleBuy = (sticker: Sticker) => {
    if (coins < sticker.price) return;
    const newOwned = [...owned, sticker.id];
    onSpend(sticker.price);
    setOwned(newOwned);
    saveOwned(newOwned);
    setShowBuyConfirm(null);
    setBuyAnim(sticker.id);
    setTimeout(() => setBuyAnim(null), 1200);
  };

  const stickerCard = (sticker: Sticker) => {
    const isOwned = owned.includes(sticker.id);
    const badge = rarityBadge(sticker.rarity);
    const isAnimating = buyAnim === sticker.id;

    return (
      <article
        key={sticker.id}
        className={`st-card ${isOwned ? "owned" : ""} ${isAnimating ? "st-buy-pop" : ""}`}
        onClick={() => setSelectedSticker(sticker)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") setSelectedSticker(sticker); }}
      >
        <div className="st-emoji" style={{ background: sticker.bgColor }}>
          <span>{sticker.emoji}</span>
        </div>
        <div className="st-info">
          <span className="st-name">{sticker.name}</span>
          <span className="st-rarity" style={{ color: badge.color }}>{badge.stars}</span>
          {isOwned ? (
            <span className="st-owned-badge">✅ 已拥有</span>
          ) : (
            <span className="st-price">{sticker.price} 🪙</span>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="page-surface st-shop">
      {/* ===== 顶部状态栏 ===== */}
      <header className="page-title">
        <span className="page-title-icon">✨</span>
        <div>
          <span className="section-kicker">学习奖励 · 贴纸收藏</span>
          <h1>贴纸册</h1>
          <p>完成学习赚金币，用金币解锁可爱的贴纸！</p>
        </div>
        <div className="st-coin-bar">
          <span className="st-coin-icon">🪙</span>
          <strong>{coins}</strong>
          <small>金币</small>
        </div>
      </header>

      {/* ===== 商店/收藏切换 ===== */}
      <div className="st-view-tabs">
        <button className={viewMode === "shop" ? "active" : ""} onClick={() => setViewMode("shop")} type="button">
          🛒 贴纸商店
        </button>
        <button className={viewMode === "collection" ? "active" : ""} onClick={() => setViewMode("collection")} type="button">
          📒 我的贴纸册 <small>({owned.length}/{allStickers.length})</small>
        </button>
      </div>

      {/* ===== 商店模式：分类标签 ===== */}
      {viewMode === "shop" && (
        <div className="st-cat-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
              type="button"
            >
              {cat === "all" ? "🌟 全部" : CATEGORY_LABELS[cat as StickerCategory]}
            </button>
          ))}
        </div>
      )}

      {/* ===== 贴纸网格 ===== */}
      {stickers.length === 0 ? (
        <div className="st-empty">
          <span>📭</span>
          <p>{viewMode === "collection" ? "还没有收藏贴纸哦，去商店逛逛吧！" : "这个分类还没有贴纸。"}</p>
        </div>
      ) : (
        <div className="st-grid">
          {stickers.map(stickerCard)}
        </div>
      )}

      {/* ===== 贴纸详情弹窗 ===== */}
      {selectedSticker && (
        <div className="st-modal-overlay" onClick={() => { setSelectedSticker(null); setShowBuyConfirm(null); }} role="dialog" aria-modal="true">
          <div className="st-modal" onClick={(e) => e.stopPropagation()}>
            <button className="st-modal-close" onClick={() => { setSelectedSticker(null); setShowBuyConfirm(null); }} type="button">✕</button>
            <div className="st-modal-emoji" style={{ background: selectedSticker.bgColor }}>
              <span>{selectedSticker.emoji}</span>
            </div>
            <h2>{selectedSticker.name}</h2>
            <span className="st-modal-rarity" style={{ color: rarityBadge(selectedSticker.rarity).color }}>
              {rarityBadge(selectedSticker.rarity).stars} {RARITY_LABELS[selectedSticker.rarity]}
            </span>
            <p className="st-modal-desc">{selectedSticker.description}</p>

            {owned.includes(selectedSticker.id) ? (
              <span className="st-owned-badge large">✅ 已拥有</span>
            ) : showBuyConfirm?.id === selectedSticker.id ? (
              <div className="st-buy-confirm">
                <p>确认用 <strong>{selectedSticker.price} 🪙</strong> 购买这张贴纸吗？</p>
                <div className="st-buy-btns">
                  <button className="st-btn-cancel" onClick={() => setShowBuyConfirm(null)} type="button">取消</button>
                  <button className="st-btn-buy" onClick={() => handleBuy(selectedSticker)} type="button">确认购买</button>
                </div>
              </div>
            ) : (
              <button
                className="st-btn-buy large"
                disabled={coins < selectedSticker.price}
                onClick={() => setShowBuyConfirm(selectedSticker)}
                type="button"
              >
                {coins < selectedSticker.price ? `金币不足（缺 ${selectedSticker.price - coins} 🪙）` : `${selectedSticker.price} 🪙 购买`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== 购买成功动画 ===== */}
      <style jsx>{`
        @keyframes stPopIn {
          0% { transform: scale(1); }
          30% { transform: scale(1.25); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .st-buy-pop { animation: stPopIn 0.6s ease; }
      `}</style>
    </section>
  );
}
