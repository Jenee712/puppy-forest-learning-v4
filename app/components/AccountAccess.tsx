"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

export type AccountSession = {
  account: null | { id: string; email: string; displayName: string; currentGrade: string; coinBalance: number };
  access: { authenticated: boolean; role: "guest" | "user" | "admin"; tier: "A" | "B" | "C"; allowedGrades: string[]; maxDay: number; unlimitedCoins: boolean };
};

const GUEST_SESSION: AccountSession = { account: null, access: { authenticated: false, role: "guest", tier: "A", allowedGrades: [], maxDay: 1, unlimitedCoins: false } };

async function accountRequest<T = AccountSession>(path: string, body?: Record<string, string>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { method: body ? "POST" : "GET", credentials: "same-origin", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("账号服务暂时无法连接，请稍后重试");
  }
  const raw = await response.text();
  let data: T & { error?: string };
  try {
    data = raw ? JSON.parse(raw) as T & { error?: string } : {} as T & { error?: string };
  } catch {
    throw new Error("账号服务返回异常，请刷新页面后重试");
  }
  if (!response.ok) throw new Error(data.error ?? (response.status >= 500 ? "账号服务暂时不可用，请稍后重试" : "操作没有完成，请稍后再试"));
  if (!raw) throw new Error("账号服务没有返回数据，请稍后重试");
  return data;
}

export async function updateAccountGrade(grade: string) {
  return accountRequest("/api/account/grade", { grade });
}

export function useAccountAccess() {
  const [session, setSession] = useState<AccountSession>(GUEST_SESSION);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try { setSession(await accountRequest("/api/account/session")); }
    catch { setSession(GUEST_SESSION); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { session, loading, refresh, setSession };
}

export function AccountAccessPanel({ session, selectedGrade, onSessionChange, entry = false }: { session: AccountSession; selectedGrade: string; onSessionChange: (session: AccountSession) => void; entry?: boolean }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const next = await accountRequest(`/api/account/${mode}`, { email: String(form.get("email") ?? ""), password: String(form.get("password") ?? ""), displayName: String(form.get("displayName") ?? "森林家长"), grade: selectedGrade });
      onSessionChange(next); setMessage(mode === "register" ? "注册成功，已开通第1天免费体验。" : "登录成功。分级权限已经同步。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "操作没有完成"); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    setBusy(true);
    try { await accountRequest("/api/account/logout", {}); onSessionChange(GUEST_SESSION); setMessage("已经安全退出账号。"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "退出没有完成"); }
    finally { setBusy(false); }
  };

  if (!session.access.authenticated) return <section className={`account-access-card ${entry ? "account-entry-card" : ""}`}><header><span>🔐</span><div><small>{entry ? "先进入家庭账号" : "家庭账号"}</small><h2>{entry ? "登录或注册，开始森林闯关" : "保存孩子的学习权限"}</h2><p>{entry ? "注册后再为孩子选择G1–G8起点，免费体验所选等级第1天。" : "登录后可同步孩子的等级和已购买权限。"}</p></div></header><div className="account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }} type="button">登录</button><button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setMessage(""); }} type="button">免费注册</button></div><form className="account-form" onSubmit={submitAuth}>{mode === "register" && <label><span>家长称呼</span><input name="displayName" placeholder="例如：Leo妈妈" maxLength={30} /></label>}<label><span>邮箱</span><input name="email" type="email" autoComplete="email" placeholder="用于登录和找回权限" required /></label><label><span>密码</span><input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="至少8位" minLength={8} required /></label>{mode === "register" && <p className="account-grade-note">下一步：选择孩子的学习等级 · 免费体验第1天</p>}<button disabled={busy} type="submit">{busy ? "正在处理…" : mode === "login" ? "登录家庭账号" : "注册并选择年级"}</button></form>{message && <p className="account-message" role="status">{message}</p>}</section>;

  const tierName = session.access.role === "admin" ? "管理员" : session.access.tier === "A" ? "免费体验" : session.access.tier === "B" ? "本级永久版" : "全站永久版";
  return <section className="account-access-card signed-in"><header><span>{session.access.role === "admin" ? "🛡️" : "👨‍👩‍👧"}</span><div><small>当前家庭账号</small><h2>{session.account?.displayName}</h2><p>{session.account?.email}</p></div><em>{tierName}</em></header><div className="access-summary"><div><span>可用等级</span><strong>{session.access.role === "admin" ? "G1–G8 全部" : session.access.allowedGrades.join("、")}</strong></div><div><span>可用天数</span><strong>{session.access.maxDay === 1 ? "第1天" : "完整90天"}</strong></div><div><span>学习金币</span><strong>{session.access.unlimitedCoins ? "∞" : "按学习获得"}</strong></div></div><button className="account-logout" onClick={() => void logout()} disabled={busy} type="button">退出账号</button>{session.access.role === "admin" && <AdminAccessManager selectedGrade={selectedGrade} />}{message && <p className="account-message" role="status">{message}</p>}</section>;
}

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
  tier: "A" | "B" | "C";
  currentGrade: string;
  allowedGrades: string[];
  status: "active" | "disabled";
  createdAt: number;
};

function AdminAccessManager({ selectedGrade }: { selectedGrade: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [tier, setTier] = useState<"A" | "B" | "C">("B");
  const [grade, setGrade] = useState(selectedGrade);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const data = await accountRequest<{ users: AdminUser[] }>("/api/account/admin/users");
      setUsers(data.users);
      if (!selectedEmail) setSelectedEmail(data.users.find((user) => user.role === "user")?.email ?? "");
    } catch (error) { setMessage(error instanceof Error ? error.message : "用户列表加载失败"); }
  }, [selectedEmail]);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const selected = users.find((user) => user.email === selectedEmail);
  const visibleUsers = users.filter((user) => user.role === "user" && `${user.displayName} ${user.email}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  const grant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedEmail) return;
    setBusy(true); setMessage("");
    try {
      await accountRequest("/api/account/admin/grant", { email: selectedEmail, tier, grade });
      setMessage(`已为 ${selectedEmail} 开通${tier === "A" ? "免费体验" : tier === "B" ? `${grade}本级永久版` : "全站永久版"}。`);
      await loadUsers();
    } catch (error) { setMessage(error instanceof Error ? error.message : "开通没有完成"); }
    finally { setBusy(false); }
  };

  const changeStatus = async (user: AdminUser) => {
    setBusy(true); setMessage("");
    const status = user.status === "active" ? "disabled" : "active";
    try {
      await accountRequest("/api/account/admin/status", { email: user.email, status });
      setMessage(`${user.email} 已${status === "active" ? "恢复使用" : "暂停使用"}。`);
      await loadUsers();
    } catch (error) { setMessage(error instanceof Error ? error.message : "账号状态修改失败"); }
    finally { setBusy(false); }
  };

  return <section className="admin-access-manager"><header><span>🔑</span><div><strong>管理员线下开通中心</strong><small>家长付款后，在这里选择注册账号并开通套餐</small></div><em>{users.filter((user) => user.role === "user").length}位用户</em></header><div className="admin-user-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索家长称呼或邮箱" aria-label="搜索注册用户" /><button onClick={() => void loadUsers()} type="button">刷新列表</button></div><div className="admin-user-list" role="list" aria-label="注册用户列表">{visibleUsers.length === 0 ? <p>还没有找到注册用户。</p> : visibleUsers.map((user) => <button className={`${selectedEmail === user.email ? "selected " : ""}${user.status === "disabled" ? "disabled" : ""}`} key={user.id} onClick={() => { setSelectedEmail(user.email); setTier(user.tier); setGrade(user.currentGrade); }} type="button"><span>{user.status === "active" ? "👨‍👩‍👧" : "⏸️"}</span><div><strong>{user.displayName}</strong><small>{user.email}</small></div><em>{user.tier}类 · {user.tier === "C" ? "G1–G8" : user.allowedGrades.join("、")}</em></button>)}</div>{selected && <form className="admin-grant-form" onSubmit={grant}><header><span>🎫</span><div><strong>为 {selected.displayName} 开通套餐</strong><small>{selected.email} · 当前{selected.tier}类</small></div></header><div className="grant-row"><label><span>权限套餐</span><select value={tier} onChange={(event) => setTier(event.target.value as "A" | "B" | "C")}><option value="A">A类 · 免费体验第1天</option><option value="B">B类 · 19.9元本级90天</option><option value="C">C类 · 59.9元全站G1–G8</option></select></label><label><span>{tier === "B" ? "本次开通等级" : "孩子当前等级"}</span><select value={grade} onChange={(event) => setGrade(event.target.value)}>{["G1","G2","G3","G4","G5","G6","G7","G8"].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="admin-grant-actions"><button disabled={busy || selected.status === "disabled"} type="submit">{busy ? "正在处理…" : "确认线下开通"}</button><button className="status-button" disabled={busy} onClick={() => void changeStatus(selected)} type="button">{selected.status === "active" ? "暂停此账号" : "恢复此账号"}</button></div></form>}{message && <p className="account-message" role="status">{message}</p>}</section>;
}
