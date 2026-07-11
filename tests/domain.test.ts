import { describe, expect, it } from "vitest";
import { questions, recommendations } from "../src/content/test-content";
import { calculateResult, validateContent } from "../src/domain/scoring";

describe("测试内容", () => {
  it("包含 30 道唯一且有效的题目", () =>
    expect(validateContent(questions, recommendations)).toEqual([]));
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
  it("固定高分输入得到明确结果", () => {
    const answers = Object.fromEntries(
      questions.map((question) => [question.id, 4]),
    );
    expect(calculateResult(answers, questions, recommendations).id).toBe(
      "active-dog",
    );
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
});
