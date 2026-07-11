export type Dimension =
  | "commitment"
  | "activity"
  | "social"
  | "patience"
  | "care"
  | "resources"
  | "specialist"
  | "safety";
export type Question = {
  id: string;
  text: string;
  weights: Partial<Record<Dimension, number>>;
};
export type Recommendation = {
  id: string;
  title: string;
  emoji: string;
  example: string;
  weights: Partial<Record<Dimension, number>>;
  reason: string;
  checks: string[];
};
const q = (id: string, text: string, dimension: Dimension): Question => ({
  id,
  text,
  weights: { [dimension]: 1 },
});
export const questions: Question[] = [
  q("q01", "我每天都能稳定安排时间照顾宠物，而不只是周末有空。", "commitment"),
  q(
    "q02",
    "即使学习或工作变忙，我也愿意保持固定的喂食和清洁安排。",
    "commitment",
  ),
  q("q03", "我能接受连续多年承担同一只宠物的照护责任。", "commitment"),
  q("q04", "家中成年人或共同居住者支持饲养宠物。", "safety"),
  q("q05", "如果我是未成年人，监护人愿意承担最终照护和费用责任。", "safety"),
  q("q06", "我的住所明确允许饲养我考虑的宠物。", "safety"),
  q("q07", "我能提供与宠物体型和活动需求相符的安全空间。", "activity"),
  q("q08", "我能提供每天户外活动或足够的室内活动环境。", "activity"),
  q("q09", "我喜欢每天散步、跑动或参与户外活动。", "activity"),
  q("q10", "即使天气不好，我也愿意完成必要的遛宠任务。", "activity"),
  q("q11", "我希望宠物经常主动与我互动和陪伴。", "social"),
  q("q12", "我能接受宠物有时不想被抱或抚摸。", "social"),
  q("q13", "我享受通过重复练习帮助宠物学习规则。", "patience"),
  q("q14", "面对叫声、抓挠或意外排泄时，我能耐心处理。", "patience"),
  q("q15", "我愿意花时间了解动物行为，而不是简单归为“不听话”。", "patience"),
  q("q16", "我更喜欢安静、独立、相处有边界感的宠物。", "social"),
  q("q17", "我能接受宠物在清晨、夜间或特定时段较活跃。", "specialist"),
  q("q18", "我能接受毛发、垫料、气味或少量环境杂乱。", "care"),
  q("q19", "我愿意定期清洁猫砂盆、水族箱或饲养箱。", "care"),
  q("q20", "我愿意定期梳毛、剪甲或安排专业护理。", "care"),
  q("q21", "我有稳定预算支付食物、用品和常规医疗。", "resources"),
  q("q22", "我能为突发医疗费用预留资金或制定可靠方案。", "resources"),
  q("q23", "我愿意寻找具备相应物种经验的兽医服务。", "resources"),
  q("q24", "我能接受某些宠物需要成对饲养或与同类共同生活。", "specialist"),
  q("q25", "我愿意为特殊温湿度、照明或饮食持续投入。", "specialist"),
  q("q26", "家中没有尚未解决的严重动物过敏风险。", "safety"),
  q("q27", "家中成员和现有宠物能与新宠安全共处。", "safety"),
  q("q28", "旅行或假期时，我有可靠的代养安排。", "commitment"),
  q("q29", "选择宠物时，我会把健康和福利放在外形或网络热度之前。", "safety"),
  q("q30", "决定饲养前，我愿意咨询专业人士并做好长期计划。", "commitment"),
];
const checks = [
  "确认住房许可、家庭支持与当地法规",
  "核算长期食物、用品及医疗预算",
  "先接触具体个体，并咨询兽医或正规救助机构",
];
export const recommendations: Recommendation[] = [
  {
    id: "active-dog",
    title: "活力协作型犬",
    emoji: "🐕",
    example: "推荐品种：金毛寻回犬",
    weights: { activity: 1, social: 0.8, patience: 0.8, commitment: 1 },
    reason:
      "你更能接受稳定运动、训练与高频互动。金毛通常亲人、乐于协作，但仍需充足运动、训练、毛发护理和健康筛查。",
    checks,
  },
  {
    id: "companion-cat",
    title: "独立互动型猫",
    emoji: "🐈",
    example: "推荐品种：中国狸花猫",
    weights: { social: 0.6, care: 0.8, commitment: 0.8, resources: 0.7 },
    reason:
      "你重视陪伴，也能尊重动物的边界。中国狸花猫通常活泼、适应力较强，但具体亲人程度仍取决于个体经历与社会化。",
    checks,
  },
  {
    id: "small-pet",
    title: "细致照护型小宠",
    emoji: "🐹",
    example: "推荐品种：阿比西尼亚豚鼠",
    weights: { care: 1, specialist: 0.8, resources: 0.7, patience: 0.6 },
    reason:
      "你对细致、规律的环境维护更有耐心。阿比西尼亚豚鼠外向可爱，但通常需要同类陪伴、充足空间、维生素 C 和异宠兽医支持。",
    checks,
  },
  {
    id: "aquatic",
    title: "专注环境型水族伙伴",
    emoji: "🐠",
    example: "推荐品种：暹罗斗鱼",
    weights: { care: 0.9, specialist: 1, resources: 0.6 },
    reason:
      "你可能享受安静观察，也愿意维护稳定环境。暹罗斗鱼色彩鲜明，但仍需要合适缸体、加热、过滤和稳定水质，不能放在小杯中饲养。",
    checks,
  },
  {
    id: "pause",
    title: "当前更适合先体验",
    emoji: "🌱",
    example: "可尝试：云养宠、志愿服务或照顾熟人宠物",
    weights: { safety: 1, resources: 1, commitment: 1 },
    reason:
      "养宠的现实条件比“人格匹配”更重要。先补齐许可、预算、时间或照护支持，是对你和动物都负责的选择。",
    checks,
  },
];
