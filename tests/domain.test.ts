import { describe, expect, it } from "vitest";
import { questions, recommendations } from "../src/content/test-content";
import {
  calculateBreedMatch,
  calculateResult,
  validateContent,
} from "../src/domain/scoring";

describe("测试内容", () => {
  it("包含 35 道唯一且有效的题目", () =>
    expect(validateContent(questions, recommendations)).toEqual([]));
  it("提供 90 个明确品种和 1 个安全结果", () => {
    expect(
      recommendations.filter((profile) => profile.id !== "pause"),
    ).toHaveLength(90);
    expect(
      new Set(
        recommendations
          .filter((profile) => profile.id !== "pause")
          .map((profile) => profile.example),
      ).size,
    ).toBe(90);
  });
  it("题库以性格题为主", () => {
    expect(
      questions.filter((question) => question.kind === "personality"),
    ).toHaveLength(23);
    expect(
      questions.filter((question) => question.kind === "lifestyle"),
    ).toHaveLength(12);
  });
  it("能定位重复结果和无权重题目", () => {
    const badQuestions = questions.map((question, index) =>
      index ? question : { ...question, weights: {} },
    );
    expect(
      validateContent(badQuestions, [...recommendations, recommendations[0]]),
    ).toEqual(
      expect.arrayContaining([
        "题目文本和维度权重不能为空",
        "结果 ID 必须唯一",
      ]),
    );
  });
});

describe("评分", () => {
  it("缺答时给出明确错误", () =>
    expect(() => calculateResult({}, questions, recommendations)).toThrow(
      "所有题目",
    ));
  it.each(["q04", "q05", "q06", "q21", "q22", "q26", "q27", "q28"])(
    "单个硬门槛 %s 不满足时建议先体验",
    (id) => {
      const answers = Object.fromEntries(
        questions.map((question) => [question.id, 5]),
      );
      answers[id] = 1;
      expect(calculateResult(answers, questions, recommendations).id).toBe(
        "pause",
      );
    },
  );
  it("安全门槛不足时仍能计算缩小版品种推荐", () => {
    const answers = Object.fromEntries(
      questions.map((question) => [question.id, 4]),
    );
    answers.q06 = 1;
    expect(calculateResult(answers, questions, recommendations).id).toBe(
      "pause",
    );
    expect(
      calculateBreedMatch(answers, questions, recommendations).id,
    ).not.toBe("pause");
  });
  it("固定高分输入得到明确且稳定的结果", () => {
    const answers = Object.fromEntries(
      questions.map((question) => [question.id, 4]),
    );
    const first = calculateResult(answers, questions, recommendations).id;
    expect(first).toBe(calculateResult(answers, questions, recommendations).id);
    expect(recommendations.map((profile) => profile.id)).toContain(first);
  });
  it.each([0, 6, 2.5, Number.NaN])("拒绝非法答案 %s", (value) => {
    const answers = Object.fromEntries(
      questions.map((question) => [question.id, 4]),
    );
    answers.q01 = value;
    expect(() => calculateResult(answers, questions, recommendations)).toThrow(
      "有效答案",
    );
  });
  it("每个品种画像都能成为匹配结果", () => {
    const results = recommendations
      .filter((profile) => profile.id !== "pause")
      .map((profile) => {
        const answers = Object.fromEntries(
          questions.map((question) => {
            const dimension = Object.keys(
              question.weights,
            )[0] as keyof typeof profile.ideal;
            return [question.id, Math.round(profile.ideal[dimension] * 4) + 1];
          }),
        );
        for (const id of [
          "q04",
          "q05",
          "q06",
          "q21",
          "q22",
          "q26",
          "q27",
          "q28",
        ])
          answers[id] = Math.max(3, answers[id]);
        return calculateResult(answers, questions, recommendations).id;
      });
    expect(results).toEqual(
      recommendations
        .filter((profile) => profile.id !== "pause")
        .map((profile) => profile.id),
    );
  });
});
