export const ALL_GRADES = Object.freeze(["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]);

export function normalizeGrade(value, fallback = "G1") {
  const grade = String(value ?? "").toUpperCase();
  return ALL_GRADES.includes(grade) ? grade : fallback;
}

export function accessForAccount(account, entitledGrades = []) {
  if (!account) {
    return {
      authenticated: false,
      role: "guest",
      tier: "A",
      allowedGrades: [],
      maxDay: 1,
      unlimitedCoins: false,
    };
  }

  if (account.role === "admin") {
    return {
      authenticated: true,
      role: "admin",
      tier: "C",
      allowedGrades: [...ALL_GRADES],
      maxDay: 90,
      unlimitedCoins: true,
    };
  }

  if (account.access_tier === "C") {
    return {
      authenticated: true,
      role: "user",
      tier: "C",
      allowedGrades: [...ALL_GRADES],
      maxDay: 90,
      unlimitedCoins: false,
    };
  }

  if (account.access_tier === "B") {
    const grades = [...new Set(entitledGrades.map((grade) => normalizeGrade(grade, "")))].filter(Boolean);
    return {
      authenticated: true,
      role: "user",
      tier: "B",
      allowedGrades: grades.length > 0 ? grades : [normalizeGrade(account.current_grade)],
      maxDay: 90,
      unlimitedCoins: false,
    };
  }

  return {
    authenticated: true,
    role: "user",
    tier: "A",
    allowedGrades: [normalizeGrade(account.current_grade)],
    maxDay: 1,
    unlimitedCoins: false,
  };
}

export function canAccessGrade(access, grade) {
  return access.role === "admin" || access.allowedGrades.includes(normalizeGrade(grade, ""));
}

export function canAccessDay(access, grade, day) {
  const normalizedDay = Math.max(1, Math.min(90, Math.round(Number(day) || 1)));
  return canAccessGrade(access, grade) && normalizedDay <= access.maxDay;
}
