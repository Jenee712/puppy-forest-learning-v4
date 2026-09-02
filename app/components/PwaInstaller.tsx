"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "puppy-forest-pwa-dismissed";

export default function PwaInstaller() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const register = () => navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      window.addEventListener("load", register, { once: true });
      if (document.readyState === "complete") register();
    }

    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    if (standalone || localStorage.getItem(DISMISS_KEY) === "1") return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(ios);
    if (ios) setHidden(false);

    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onInstallPrompt);
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  };

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setHidden(true);
      setInstallPrompt(null);
      return;
    }
    if (isIos) setShowIosHelp(true);
  };

  return (
    <aside className="pwa-install" aria-label="安装森林学堂">
      <button className="pwa-install-main" type="button" onClick={install}>
        <span aria-hidden="true">🌿</span>
        <span><strong>放到主屏幕</strong><small>像应用一样打开</small></span>
      </button>
      <button className="pwa-install-close" type="button" onClick={dismiss} aria-label="暂不安装">×</button>
      {showIosHelp && (
        <div className="pwa-ios-help" role="status">
          <strong>iPad / iPhone 安装方法</strong>
          <p>点浏览器的“分享”按钮，再选“添加到主屏幕”。</p>
          <button type="button" onClick={() => setShowIosHelp(false)}>知道了</button>
        </div>
      )}
    </aside>
  );
}
