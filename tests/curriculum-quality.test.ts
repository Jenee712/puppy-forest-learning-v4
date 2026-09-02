import test from "node:test";
import assert from "node:assert/strict";
import {
  STUDY_PROGRAM_DAYS,
  auditDailyCurriculum,
  auditGradeDifficulty,
  auditMathGradeAlignment,
  auditProgramVariety,
  auditQuestionTiming,
  auditQuestionUniqueness,
  auditStudyProgram,
  estimateQuestionMinutes,
  getDailyCurriculum,
} from "../data/dailyCurriculum";

test("G1-G8 每日课程密度和英语占比达标", () => {
  auditDailyCurriculum().forEach((plan) => {
    assert.ok(plan.total >= 14, `${plan.grade} 题量不足`);
    assert.ok(plan.englishRatio >= 0.5, `${plan.grade} 英语占比不足50%`);
  });
});

test("G1-G8 的90天路线均有唯一题目ID和正确日期标记", () => {
  const invalid = auditStudyProgram().filter((plan) => plan.total !== plan.uniqueIds || !plan.taggedForDay);
  assert.deepEqual(invalid, []);
});

test("90天没有整日照搬旧题的重复路线", () => {
  auditProgramVariety().forEach((result) => {
    assert.equal(result.uniqueDailyRoutes, STUDY_PROGRAM_DAYS, `${result.grade} 存在重复日路线`);
    assert.deepEqual(result.repeatedDays, []);
  });
});

test("课程难度不回退且数学知识不超纲", () => {
  const difficultyIssues = auditGradeDifficulty().filter((item) => item.averageDifficulty < item.floor || item.regressions.length);
  const mathIssues = auditMathGradeAlignment().filter((item) => item.violations.length);
  assert.deepEqual(difficultyIssues, []);
  assert.deepEqual(mathIssues, []);
});

test("本地核心题库没有重复题干", () => {
  assert.deepEqual(auditQuestionUniqueness().duplicates, []);
});

test("基础短句排序题不虚标学习时长", () => {
  for (const grade of ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]) {
    for (const day of [1, 30, 60, 90]) {
      getDailyCurriculum(grade, day)
        .filter((question) => question.type === "ordering" && question.difficulty === 1 && question.options.length <= 4)
        .forEach((question) => assert.equal(estimateQuestionMinutes(question), 1, `${question.id} 估时过长`));
    }
  }
});

test("G1-G8 全部90天题目均使用统一估时且保持合理范围", () => {
  const timing = auditQuestionTiming();
  assert.ok(timing.length > 0);
  assert.deepEqual(timing.filter((item) => item.minutes !== item.expectedMinutes), []);
  assert.deepEqual(timing.filter((item) => item.minutes < 1 || item.minutes > 5), []);
});

test("简单交互不会再被标成3至5分钟", () => {
  const suspicious = auditQuestionTiming().filter((item) =>
    item.difficulty === 1
    && item.activityKind !== "storybook"
    && item.activityKind !== "trace"
    && item.type !== "matching"
    && item.minutes > 2,
  );
  assert.deepEqual(suspicious, []);
});
