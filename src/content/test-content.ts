import { buildRecommendations } from "./breed-catalog";

export type Dimension =
  | "commitment"
  | "activity"
  | "social"
  | "patience"
  | "care"
  | "resources"
  | "specialist"
  | "safety"
  | "independence"
  | "adaptability"
  | "trainability"
  | "sensitivity";
export type Question = {
  id: string;
  text: string;
  weights: Partial<Record<Dimension, number>>;
  kind: "lifestyle" | "personality";
};
export type Recommendation = {
  id: string;
  title: string;
  petType: string;
  emoji: string;
  example: string;
  ideal: Record<Dimension, number>;
  reason: string;
  checks: string[];
};
const q = (
  id: string,
  text: string,
  dimension: Dimension,
  kind: Question["kind"],
): Question => ({ id, text, weights: { [dimension]: 1 }, kind });

export const questions: Question[] = [
  q("q01", "我每天都能稳定安排时间照顾宠物。", "commitment", "lifestyle"),
  q("q04", "家中成年人或共同居住者支持饲养宠物。", "safety", "lifestyle"),
  q(
    "q05",
    "如果我是未成年人，监护人愿意承担最终照护和费用责任。",
    "safety",
    "lifestyle",
  ),
  q("q06", "我的住所明确允许饲养我考虑的宠物。", "safety", "lifestyle"),
  q(
    "q07",
    "我能提供与宠物体型和活动需求相符的安全空间。",
    "activity",
    "lifestyle",
  ),
  q("q18", "我能接受毛发、垫料、气味或少量环境杂乱。", "care", "lifestyle"),
  q("q21", "我有稳定预算支付食物、用品和常规医疗。", "resources", "lifestyle"),
  q(
    "q22",
    "我能为突发医疗费用预留资金或制定可靠方案。",
    "resources",
    "lifestyle",
  ),
  q("q23", "我愿意寻找具备相应物种经验的兽医服务。", "specialist", "lifestyle"),
  q("q26", "家中没有尚未解决的严重动物过敏风险。", "safety", "lifestyle"),
  q("q27", "家中成员和现有宠物能与新宠安全共处。", "safety", "lifestyle"),
  q("q28", "旅行或假期时，我有可靠的代养安排。", "commitment", "lifestyle"),
  q("p01", "在热闹聚会中，我通常会主动认识新朋友。", "social", "personality"),
  q(
    "p02",
    "独处一段时间会让我感到放松，而不是无聊。",
    "independence",
    "personality",
  ),
  q(
    "p03",
    "计划临时变化时，我通常能很快调整状态。",
    "adaptability",
    "personality",
  ),
  q("p04", "我喜欢固定、可预期的日常节奏。", "sensitivity", "personality"),
  q(
    "p05",
    "遇到新技能时，我愿意反复练习直到掌握。",
    "trainability",
    "personality",
  ),
  q(
    "p06",
    "我容易注意到声音、气味或环境中的细小变化。",
    "sensitivity",
    "personality",
  ),
  q(
    "p07",
    "周末我更想户外探索，而不是一直待在家里。",
    "activity",
    "personality",
  ),
  q("p08", "朋友情绪低落时，我会主动靠近并陪伴。", "social", "personality"),
  q(
    "p09",
    "面对慢热的人或动物，我愿意等对方主动靠近。",
    "patience",
    "personality",
  ),
  q(
    "p10",
    "我喜欢尝试新路线、新餐厅或陌生体验。",
    "adaptability",
    "personality",
  ),
  q(
    "p11",
    "我享受安静观察，而不一定要参与其中。",
    "independence",
    "personality",
  ),
  q("p12", "我喜欢需要动脑和解决问题的游戏。", "trainability", "personality"),
  q("p13", "连续几天没有运动会让我觉得难受。", "activity", "personality"),
  q(
    "p14",
    "比起很多泛泛之交，我更偏爱少数亲密关系。",
    "independence",
    "personality",
  ),
  q("p15", "面对重复的小麻烦，我通常能保持耐心。", "patience", "personality"),
  q("p16", "我喜欢整理、清洁并维持舒适的生活环境。", "care", "personality"),
  q(
    "p17",
    "我会提前规划长期目标，而不只看眼前兴趣。",
    "commitment",
    "personality",
  ),
  q(
    "p18",
    "进入陌生环境时，我通常很快就能自在起来。",
    "adaptability",
    "personality",
  ),
  q("p19", "我喜欢通过规则和训练建立默契。", "trainability", "personality"),
  q(
    "p20",
    "我更喜欢温和安静，而不是吵闹刺激的环境。",
    "sensitivity",
    "personality",
  ),
  q("p21", "我愿意为喜欢的事物持续学习专业知识。", "specialist", "personality"),
  q("p22", "我常主动发起聊天、活动或共同计划。", "social", "personality"),
  q("p23", "事情进展缓慢时，我仍能按步骤坚持完成。", "patience", "personality"),
];

const checks = [
  "确认住房许可、家庭支持与当地法规",
  "核算长期食物、用品及医疗预算",
  "先接触具体个体，并咨询兽医或正规救助机构",
];
export const safetyRecommendation: Recommendation = {
  id: "pause",
  title: "当前更适合先体验",
  petType: "养宠准备",
  emoji: "🌱",
  example: "先体验，再决定",
  ideal: {
    commitment: 1,
    activity: 0.5,
    social: 0.5,
    patience: 0.7,
    care: 0.7,
    resources: 1,
    specialist: 0.5,
    safety: 1,
    independence: 0.5,
    adaptability: 0.5,
    trainability: 0.5,
    sensitivity: 0.5,
  },
  reason:
    "养宠的现实条件比人格匹配更重要。先补齐许可、预算、时间或照护支持，是对你和动物都负责的选择。",
  checks,
};
export const recommendations = [
  ...buildRecommendations(checks),
  safetyRecommendation,
];
