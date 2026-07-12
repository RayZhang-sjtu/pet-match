import type {
  Dimension,
  Question,
  Recommendation,
} from "../content/test-content";

const hardConstraintIds = ["q04", "q06", "q21", "q26", "q01"];

export type PersonalityInsight = {
  dimension: Dimension;
  label: string;
  description: string;
  score: number;
};

const traitCopy: Record<
  Dimension,
  { label: string; high: string; low: string }
> = {
  commitment: {
    label: "长期投入",
    high: "看重承诺，愿意把喜欢变成稳定的日常。",
    low: "更重视当下弹性，适合先从低承诺体验开始。",
  },
  activity: {
    label: "行动能量",
    high: "从活动和探索中获得能量，喜欢一起行动的陪伴。",
    low: "偏爱舒缓节奏，更享受安静而稳定的相处。",
  },
  social: {
    label: "关系主动",
    high: "会主动建立连接，也容易回应伙伴的互动信号。",
    low: "重视边界和熟悉感，通常在信任形成后逐渐靠近。",
  },
  patience: {
    label: "耐心陪伴",
    high: "能容纳慢热和反复，用持续回应建立安全感。",
    low: "期待清晰及时的反馈，更适合互动规则明确的伙伴。",
  },
  care: {
    label: "照护秩序",
    high: "愿意维持环境与照护细节，让日常保持可预测。",
    low: "更喜欢简洁省心的安排，需要控制照护复杂度。",
  },
  resources: {
    label: "资源准备",
    high: "会提前考虑预算与保障，让决定更有持续性。",
    low: "当前资源弹性有限，适合先确认长期成本。",
  },
  specialist: {
    label: "学习投入",
    high: "面对陌生知识愿意深入学习，并寻找专业支持。",
    low: "偏好容易理解和上手的照护方式。",
  },
  safety: {
    label: "风险意识",
    high: "做决定时会先确认边界与安全条件。",
    low: "更容易被兴趣推动，需要补做现实风险核对。",
  },
  independence: {
    label: "独处充电",
    high: "能从独处中恢复精力，尊重彼此各自安静的时间。",
    low: "更需要持续陪伴与回应，喜欢关系中的在场感。",
  },
  adaptability: {
    label: "开放适应",
    high: "面对变化和新环境较灵活，愿意边体验边调整。",
    low: "偏爱熟悉和可预测的节奏，稳定感对你很重要。",
  },
  trainability: {
    label: "规则共建",
    high: "享受学习、反馈和训练形成的共同语言。",
    low: "更喜欢自然相处，不希望关系依赖大量训练任务。",
  },
  sensitivity: {
    label: "感受细腻",
    high: "容易捕捉环境和情绪细节，对氛围变化较敏锐。",
    low: "不易被细小刺激打断，在热闹环境中也较放松。",
  },
};

function dimensionScores(
  answers: Record<string, number>,
  questions: Question[],
) {
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
  return Object.fromEntries(
    (Object.keys(traitCopy) as Dimension[]).map((dimension) => {
      if (!counts[dimension]) throw new Error(`评分维度 ${dimension} 没有题目`);
      return [dimension, totals[dimension] / counts[dimension]];
    }),
  ) as Record<Dimension, number>;
}

export function calculatePersonalityInsights(
  answers: Record<string, number>,
  questions: Question[],
): PersonalityInsight[] {
  const scores = dimensionScores(answers, questions);
  return (Object.keys(scores) as Dimension[])
    .filter((dimension) => !["resources", "safety"].includes(dimension))
    .map((dimension) => ({
      dimension,
      label: traitCopy[dimension].label,
      description:
        scores[dimension] >= 0.5
          ? traitCopy[dimension].high
          : traitCopy[dimension].low,
      score: scores[dimension],
    }))
    .sort(
      (a, b) =>
        Math.abs(b.score - 0.5) - Math.abs(a.score - 0.5) ||
        a.dimension.localeCompare(b.dimension),
    )
    .slice(0, 3);
}

export function calculateMatchPercentage(
  answers: Record<string, number>,
  questions: Question[],
  profile: Recommendation,
): number {
  const scores = dimensionScores(answers, questions);
  const dimensions = Object.keys(profile.ideal) as Dimension[];
  const meanSquaredDistance =
    dimensions.reduce(
      (sum, dimension) =>
        sum + (scores[dimension] - profile.ideal[dimension]) ** 2,
      0,
    ) / dimensions.length;
  return Math.round(Math.max(0, Math.min(1, 1 - meanSquaredDistance)) * 100);
}

export function describePersonalityMatch(
  insights: PersonalityInsight[],
  profile: Recommendation,
): string {
  const names = insights
    .slice(0, 2)
    .map((item) => item.label)
    .join("与");
  return `你的${names}特征，与${profile.example.replace("推荐品种：", "")}偏好的互动节奏较接近。你们更可能在陪伴边界、活动强度和建立信任的方式上形成自然默契。`;
}

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

  return calculateBreedMatch(answers, questions, profiles);
}

export function calculateBreedMatch(
  answers: Record<string, number>,
  questions: Question[],
  profiles: Recommendation[],
): Recommendation {
  const scores = dimensionScores(answers, questions);
  const candidates = profiles
    .filter((profile) => profile.id !== "pause")
    .map((profile) => ({
      profile,
      score: (Object.keys(profile.ideal) as Dimension[]).reduce(
        (sum, dimension) => {
          const difference = scores[dimension] - profile.ideal[dimension];
          return sum - difference * difference;
        },
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
  if (questions.length > 30 || questions.length < 24)
    errors.push("题目总量必须为 24 至 30 道");
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
        !profile.petType ||
        !profile.example ||
        Object.values(profile.ideal).some(
          (value) => !Number.isFinite(value) || value < 0 || value > 1,
        ) ||
        profile.checks.length < 3,
    )
  )
    errors.push("结果档案不完整");
  return errors;
}
