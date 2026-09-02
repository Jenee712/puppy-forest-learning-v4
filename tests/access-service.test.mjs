import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const waitForHealth = async (baseUrl, child) => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`权限服务提前退出：${child.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/api/account/health`);
      if (response.ok) return;
    } catch { /* 服务仍在启动 */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("权限服务启动超时");
};

const request = async (baseUrl, path, body, cookie = "") => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { ...(body === undefined ? {} : { "content-type": "application/json" }), ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  return { response, data, cookie: response.headers.get("set-cookie")?.split(";")[0] ?? cookie };
};

test("管理员可以查看注册用户、线下开通套餐并暂停账号", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "puppy-access-"));
  const port = 33217;
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["--no-warnings=ExperimentalWarning", "server/access-service.mjs"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, ACCESS_SERVICE_PORT: String(port), ACCESS_DB_PATH: join(directory, "access.db"), PUPPY_ADMIN_EMAIL: "admin@example.com" },
    stdio: "ignore",
  });
  t.after(async () => {
    child.kill("SIGTERM");
    await rm(directory, { recursive: true, force: true });
  });
  await waitForHealth(baseUrl, child);

  const admin = await request(baseUrl, "/api/account/register", { email: "admin@example.com", password: "test-password", displayName: "管理员", grade: "G1" });
  assert.equal(admin.response.status, 201);
  assert.equal(admin.data.access.role, "admin");

  const family = await request(baseUrl, "/api/account/register", { email: "family@example.com", password: "test-password", displayName: "Leo妈妈", grade: "G4" });
  assert.equal(family.data.access.tier, "A");
  assert.equal(family.data.access.maxDay, 1);

  const listed = await request(baseUrl, "/api/account/admin/users", undefined, admin.cookie);
  assert.equal(listed.response.status, 200);
  assert.equal(listed.data.users.some((user) => user.email === "family@example.com"), true);

  const granted = await request(baseUrl, "/api/account/admin/grant", { email: "family@example.com", tier: "B", grade: "G4" }, admin.cookie);
  assert.equal(granted.data.access.maxDay, 90);
  assert.deepEqual(granted.data.access.allowedGrades, ["G4"]);

  const disabled = await request(baseUrl, "/api/account/admin/status", { email: "family@example.com", status: "disabled" }, admin.cookie);
  assert.equal(disabled.data.status, "disabled");
  const familySession = await request(baseUrl, "/api/account/session", undefined, family.cookie);
  assert.equal(familySession.data.access.authenticated, false);
});
