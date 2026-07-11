import type {
  Dimension,
  Question,
  Recommendation,
} from "../content/test-content";

const hardConstraintIds = [
  "q04",
  "q05",
  "q06",
  "q21",
  "q22",
  "q26",
  "q27",
  "q28",
];

export function calculateResult(
  answers: Record<string, number>,
  questions: Question[],
  profiles: Recommendation[],
): Recommendation {
  if (
    questions.some(
      (q) =>
        !Number.isInteger(answers[q.id]) ||
        answers[q.id] < 1 ||
        answers[q.id] > 5,
    )
  )
    throw new Error("所有题目都需要有效答案");
  const pause = profiles.find((profile) => profile.id === "pause");
  if (!pause) throw new Error("结果资料缺少 pause 安全结果");
  if (hardConstraintIds.some((id) => answers[id] <= 2)) return pause;

  const totals = {} as Record<Dimension, number>;
  const counts = {} as Record<Dimension, number>;
  for (const question of questions)
    for (const [dimension, weight] of Object.entries(question.weights) as [
      Dimension,
      number,
    ][]) {
      totals[dimension] =
        (totals[dimension] ?? 0) + (answers[question.id] - 1) * weight;
      counts[dimension] = (counts[dimension] ?? 0) + 4 * weight;
    }
  const score = (dimension: Dimension) => {
    if (!counts[dimension]) throw new Error(`评分维度 ${dimension} 没有题目`);
    return totals[dimension] / counts[dimension];
  };
  if (
    score("safety") < 0.5 ||
    score("resources") < 0.5 ||
    score("commitment") < 0.5
  )
    return pause;
  const candidates = profiles
    .filter((profile) => profile.id !== "pause")
    .map((profile) => ({
      profile,
      score: Object.entries(profile.weights).reduce(
        (sum, [dimension, weight]) =>
          sum + score(dimension as Dimension) * (weight ?? 0),
        0,
      ),
    }))
    .sort(
      (a, b) => b.score - a.score || a.profile.id.localeCompare(b.profile.id),
    );
  if (!candidates.length) throw new Error("结果资料没有可匹配的宠物结果");
  return candidates[0].profile;
}

export function validateContent(
  questions: Question[],
  profiles: Recommendation[],
): string[] {
  const errors: string[] = [];
  if (questions.length !== 30) errors.push("题目必须恰好为 30 道");
  if (
    new Set(questions.map((question) => question.id)).size !== questions.length
  )
    errors.push("题目 ID 必须唯一");
  if (
    questions.some(
      (question) =>
        !question.text.trim() || !Object.keys(question.weights).length,
    )
  )
    errors.push("题目文本和维度权重不能为空");
  if (
    questions.some((question) =>
      Object.values(question.weights).some(
        (weight) => !Number.isFinite(weight) || weight! <= 0,
      ),
    )
  )
    errors.push("题目权重必须是正数");
  if (new Set(profiles.map((profile) => profile.id)).size !== profiles.length)
    errors.push("结果 ID 必须唯一");
  if (!profiles.some((profile) => profile.id === "pause"))
    errors.push("必须包含 pause 安全结果");
  if (
    profiles.length < 2 ||
    profiles.some(
      (profile) =>
        !profile.title ||
        !profile.reason ||
        !profile.example ||
        profile.checks.length < 3,
    )
  )
    errors.push("结果档案不完整");
  return errors;
}
