import { createServer } from "node:http";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { ALL_GRADES, accessForAccount, normalizeGrade } from "./access-policy.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.ACCESS_SERVICE_PORT ?? 3001);
const DB_PATH = process.env.ACCESS_DB_PATH ?? "/var/lib/puppy-forest/access.db";
const ADMIN_EMAIL = normalizeEmail(process.env.PUPPY_ADMIN_EMAIL ?? "");
const SESSION_COOKIE = "puppy_forest_session";
const SESSION_DAYS = 30;

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(readFileSync(resolve(HERE, "access-schema.sql"), "utf8"));
db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
// 管理员邮箱由服务器环境变量唯一指定。即使该邮箱早于本功能注册，服务启动时也会自动校正角色。
if (ADMIN_EMAIL) db.prepare("UPDATE accounts SET role = 'admin', status = 'active', updated_at = ? WHERE email = ? COLLATE NOCASE").run(Date.now(), ADMIN_EMAIL);

const statements = {
  accountByEmail: db.prepare("SELECT * FROM accounts WHERE email = ? COLLATE NOCASE LIMIT 1"),
  accountById: db.prepare("SELECT * FROM accounts WHERE id = ? LIMIT 1"),
  sessionAccount: db.prepare(`
    SELECT accounts.* FROM sessions
    INNER JOIN accounts ON accounts.id = sessions.account_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ? AND accounts.status = 'active'
    LIMIT 1
  `),
  entitlements: db.prepare("SELECT grade FROM grade_entitlements WHERE account_id = ? ORDER BY grade"),
};

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function json(response, status = 200, headers = {}) {
  return new Response(JSON.stringify(response), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

function passwordHash(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}

function passwordMatches(password, stored) {
  const [kind, saltText, hashText] = String(stored).split(":");
  if (kind !== "scrypt" || !saltText || !hashText) return false;
  const expected = Buffer.from(hashText, "base64");
  const actual = scryptSync(password, Buffer.from(saltText, "base64"), expected.length);
  return timingSafeEqual(expected, actual);
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

function cookies(request) {
  const values = {};
  for (const chunk of (request.headers.get("cookie") ?? "").split(";")) {
    const index = chunk.indexOf("=");
    if (index < 0) continue;
    values[chunk.slice(0, index).trim()] = decodeURIComponent(chunk.slice(index + 1).trim());
  }
  return values;
}

function accountForRequest(request) {
  const token = cookies(request)[SESSION_COOKIE];
  if (!token) return null;
  return statements.sessionAccount.get(tokenHash(token), Date.now()) ?? null;
}

function publicSession(account) {
  const grades = account ? statements.entitlements.all(account.id).map((row) => row.grade) : [];
  const access = accessForAccount(account, grades);
  return {
    account: account ? {
      id: account.id,
      email: account.email,
      displayName: account.display_name,
      currentGrade: account.current_grade,
      coinBalance: account.coin_balance,
    } : null,
    access,
  };
}

function sessionCookie(token, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function startSession(accountId) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.prepare("INSERT INTO sessions (token_hash, account_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
    .run(tokenHash(token), accountId, now + SESSION_DAYS * 86400000, now);
  return token;
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > 20_000) throw new Error("body_too_large");
  return text ? JSON.parse(text) : {};
}

function validateSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

async function register(request) {
  const body = await readBody(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const displayName = String(body.displayName ?? "森林家长").trim().slice(0, 30) || "森林家长";
  const grade = normalizeGrade(body.grade);
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "请输入有效邮箱" }, 400);
  if (password.length < 8) return json({ error: "密码至少需要8位" }, 400);
  if (statements.accountByEmail.get(email)) return json({ error: "这个邮箱已经注册" }, 409);

  const now = Date.now();
  const id = randomUUID();
  const role = ADMIN_EMAIL && email === ADMIN_EMAIL ? "admin" : "user";
  db.prepare(`
    INSERT INTO accounts (id, email, password_hash, role, access_tier, current_grade, display_name, coin_balance, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'A', ?, ?, 0, 'active', ?, ?)
  `).run(id, email, passwordHash(password), role, grade, displayName, now, now);
  const token = startSession(id);
  return json(publicSession(statements.accountById.get(id)), 201, { "set-cookie": sessionCookie(token, SESSION_DAYS * 86400) });
}

async function login(request) {
  const body = await readBody(request);
  const account = statements.accountByEmail.get(normalizeEmail(body.email));
  if (!account || account.status !== "active" || !passwordMatches(String(body.password ?? ""), account.password_hash)) {
    return json({ error: "邮箱或密码不正确" }, 401);
  }
  const token = startSession(account.id);
  return json(publicSession(account), 200, { "set-cookie": sessionCookie(token, SESSION_DAYS * 86400) });
}

function logout(request) {
  const token = cookies(request)[SESSION_COOKIE];
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
  return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
}

async function grantAccess(request) {
  const operator = accountForRequest(request);
  if (!operator || operator.role !== "admin") return json({ error: "仅管理员可以开通权限" }, 403);
  const body = await readBody(request);
  const target = statements.accountByEmail.get(normalizeEmail(body.email));
  const tier = String(body.tier ?? "").toUpperCase();
  if (!target) return json({ error: "没有找到这个注册用户" }, 404);
  if (!['A', 'B', 'C'].includes(tier)) return json({ error: "权限类型必须是A、B或C" }, 400);
  const grade = normalizeGrade(body.grade ?? target.current_grade);
  const now = Date.now();
  db.prepare("UPDATE accounts SET access_tier = ?, current_grade = ?, updated_at = ? WHERE id = ?")
    .run(tier, grade, now, target.id);
  if (tier === "B") {
    db.prepare(`
      INSERT INTO grade_entitlements (account_id, grade, source, order_id, unlocked_at)
      VALUES (?, ?, 'manual', NULL, ?)
      ON CONFLICT(account_id, grade) DO UPDATE SET source = 'manual', unlocked_at = excluded.unlocked_at
    `).run(target.id, grade, now);
  }
  if (tier !== "B") db.prepare("DELETE FROM grade_entitlements WHERE account_id = ?").run(target.id);
  db.prepare("INSERT INTO access_audit_log (id, operator_account_id, target_account_id, action, detail, created_at) VALUES (?, ?, ?, 'grant_access', ?, ?)")
    .run(randomUUID(), operator.id, target.id, JSON.stringify({ tier, grade }), now);
  return json(publicSession(statements.accountById.get(target.id)));
}

function adminUsers(request) {
  const operator = accountForRequest(request);
  if (!operator || operator.role !== "admin") return json({ error: "仅管理员可以查看用户" }, 403);
  const rows = db.prepare(`
    SELECT accounts.id, accounts.email, accounts.display_name, accounts.role, accounts.access_tier,
      accounts.current_grade, accounts.coin_balance, accounts.status, accounts.created_at, accounts.updated_at,
      GROUP_CONCAT(grade_entitlements.grade, ',') AS entitled_grades
    FROM accounts
    LEFT JOIN grade_entitlements ON grade_entitlements.account_id = accounts.id
    GROUP BY accounts.id
    ORDER BY accounts.created_at DESC
  `).all();
  return json({
    users: rows.map((row) => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
      tier: row.role === "admin" ? "C" : row.access_tier,
      currentGrade: row.current_grade,
      allowedGrades: row.role === "admin" || row.access_tier === "C" ? [...ALL_GRADES] : row.access_tier === "B" ? String(row.entitled_grades ?? row.current_grade).split(",").filter(Boolean) : [row.current_grade],
      coinBalance: row.coin_balance,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  });
}

async function updateAccountStatus(request) {
  const operator = accountForRequest(request);
  if (!operator || operator.role !== "admin") return json({ error: "仅管理员可以修改账号状态" }, 403);
  const body = await readBody(request);
  const target = statements.accountByEmail.get(normalizeEmail(body.email));
  const status = body.status === "disabled" ? "disabled" : body.status === "active" ? "active" : "";
  if (!target) return json({ error: "没有找到这个注册用户" }, 404);
  if (!status) return json({ error: "账号状态无效" }, 400);
  if (target.id === operator.id && status === "disabled") return json({ error: "不能停用当前管理员账号" }, 400);
  const now = Date.now();
  db.prepare("UPDATE accounts SET status = ?, updated_at = ? WHERE id = ?").run(status, now, target.id);
  if (status === "disabled") db.prepare("DELETE FROM sessions WHERE account_id = ?").run(target.id);
  db.prepare("INSERT INTO access_audit_log (id, operator_account_id, target_account_id, action, detail, created_at) VALUES (?, ?, ?, 'account_status', ?, ?)")
    .run(randomUUID(), operator.id, target.id, JSON.stringify({ status }), now);
  return json({ ok: true, status });
}

async function updateGrade(request) {
  const account = accountForRequest(request);
  if (!account) return json({ error: "请先登录" }, 401);
  const body = await readBody(request);
  const grade = normalizeGrade(body.grade, "");
  if (!grade) return json({ error: "请选择G1到G8中的一个等级" }, 400);
  const entitlements = statements.entitlements.all(account.id).map((row) => row.grade);
  const access = accessForAccount(account, entitlements);
  if (access.role !== "admin" && access.tier === "B" && !access.allowedGrades.includes(grade)) {
    return json({ error: "当前账号尚未开通这个等级" }, 403);
  }
  db.prepare("UPDATE accounts SET current_grade = ?, updated_at = ? WHERE id = ?").run(grade, Date.now(), account.id);
  return json(publicSession(statements.accountById.get(account.id)));
}

async function route(request) {
  const url = new URL(request.url);
  if (request.method !== "GET" && !validateSameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  if (request.method === "GET" && url.pathname === "/api/account/session") return json(publicSession(accountForRequest(request)));
  if (request.method === "POST" && url.pathname === "/api/account/register") return register(request);
  if (request.method === "POST" && url.pathname === "/api/account/login") return login(request);
  if (request.method === "POST" && url.pathname === "/api/account/logout") return logout(request);
  if (request.method === "POST" && url.pathname === "/api/account/grade") return updateGrade(request);
  if (request.method === "POST" && url.pathname === "/api/account/admin/grant") return grantAccess(request);
  if (request.method === "GET" && url.pathname === "/api/account/admin/users") return adminUsers(request);
  if (request.method === "POST" && url.pathname === "/api/account/admin/status") return updateAccountStatus(request);
  if (request.method === "GET" && url.pathname === "/api/account/health") return json({ ok: true, database: "ready" });
  return json({ error: "not_found" }, 404);
}

const server = createServer(async (request, response) => {
  try {
    const result = await route(new Request(`http://${request.headers.host}${request.url}`, {
      method: request.method,
      headers: request.headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request,
      duplex: "half",
    }));
    response.writeHead(result.status, Object.fromEntries(result.headers.entries()));
    response.end(Buffer.from(await result.arrayBuffer()));
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify({ error: "服务暂时不可用" }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Puppy Forest access service listening on http://127.0.0.1:${PORT}`);
});
