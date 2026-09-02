import test from "node:test";
import assert from "node:assert/strict";
import { accessForAccount, canAccessDay, canAccessGrade } from "../server/access-policy.mjs";

test("访客只能作为未登录体验入口", () => {
  const access = accessForAccount(null);
  assert.equal(access.authenticated, false);
  assert.equal(access.maxDay, 1);
  assert.deepEqual(access.allowedGrades, []);
});

test("A类用户只能进入注册时选择的等级第1天", () => {
  const access = accessForAccount({ role: "user", access_tier: "A", current_grade: "G2" });
  assert.equal(canAccessDay(access, "G2", 1), true);
  assert.equal(canAccessDay(access, "G2", 2), false);
  assert.equal(canAccessGrade(access, "G3"), false);
});

test("B类用户可以进入已购买等级的90天", () => {
  const access = accessForAccount({ role: "user", access_tier: "B", current_grade: "G4" }, ["G4"]);
  assert.equal(canAccessDay(access, "G4", 90), true);
  assert.equal(canAccessGrade(access, "G5"), false);
});

test("C类用户拥有八个等级", () => {
  const access = accessForAccount({ role: "user", access_tier: "C", current_grade: "G1" });
  assert.equal(access.allowedGrades.length, 8);
  assert.equal(canAccessDay(access, "G8", 90), true);
});

test("管理员拥有全站权限和无限金币", () => {
  const access = accessForAccount({ role: "admin", access_tier: "A", current_grade: "G1" });
  assert.equal(access.unlimitedCoins, true);
  assert.equal(canAccessDay(access, "G8", 90), true);
});
