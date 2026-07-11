"use client";

import { useState } from "react";
import {
  questions,
  recommendations,
  type Dimension,
} from "../src/content/test-content";
import { calculateResult } from "../src/domain/scoring";

const labels = ["很不符合", "不太符合", "一般", "比较符合", "非常符合"];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const question = questions[index];
  const result = finished
    ? calculateResult(answers, questions, recommendations)
    : null;

  function choose(value: number) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setStarted(false);
    setShareStatus("");
  }

  async function shareResult() {
    if (!result) return;
    const text = `我在 Pet Match 测出的适配伙伴是：${result.title}（${result.example}）。你也来试试吧！`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "我的 Pet Match 结果",
          text,
          url: window.location.href,
        });
        setShareStatus("分享成功");
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setShareStatus("结果和链接已复制");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("暂时无法分享，请稍后再试");
    }
  }

  if (!started)
    return (
      <main className="shell hero">
        <span className="eyebrow">Pet Match · 内容草案 v0.1</span>
        <h1>
          哪位毛茸茸的伙伴，
          <br />
          更适合你的生活？
        </h1>
        <p>为每一个想养宠物的年轻人，快速找到更适合他们的宠物。</p>
        <div className="facts" aria-label="测试说明">
          <span>30 道生活场景</span>
          <span>约 5 分钟</span>
          <span>不保存答案</span>
        </div>
        <button className="primary" onClick={() => setStarted(true)}>
          开始测试
        </button>
        <p className="notice">
          娱乐与初步生活方式匹配，不是心理测评，也不能替代真实的养宠评估。
        </p>
      </main>
    );

  if (result)
    return (
      <main className="shell result">
        <span className="eyebrow">你的匹配方向</span>
        <div className="resultIcon" aria-hidden="true">
          {result.emoji}
        </div>
        <h1>{result.title}</h1>
        <h2>{result.example}</h2>
        <p>{result.reason}</p>
        <section>
          <h3>决定前请确认</h3>
          <ul>
            {result.checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <p className="notice">
          同一品种的个体也会因年龄、健康、经历和性格而不同。未成年人需由监护人同意并承担最终责任；请优先咨询兽医或正规救助机构。
        </p>
        <div className="actions">
          <button className="primary" onClick={shareResult}>
            分享我的结果
          </button>
          <button className="secondary" onClick={restart}>
            重新测试
          </button>
        </div>
        <p className="shareStatus" role="status" aria-live="polite">
          {shareStatus}
        </p>
      </main>
    );

  return (
    <main className="shell quiz">
      <header>
        <button
          className="textButton"
          onClick={() => (index ? setIndex(index - 1) : setStarted(false))}
        >
          ← 返回
        </button>
        <span>
          {index + 1} / {questions.length}
        </span>
      </header>
      <div
        className="progress"
        aria-label={`进度 ${index + 1}/${questions.length}`}
      >
        <i style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <fieldset>
        <legend>{question.text}</legend>
        <div className="choices">
          {labels.map((label, i) => (
            <button
              key={label}
              className={answers[question.id] === i + 1 ? "selected" : ""}
              onClick={() => choose(i + 1)}
              aria-pressed={answers[question.id] === i + 1}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        className="primary"
        disabled={!answers[question.id]}
        onClick={() =>
          index === questions.length - 1
            ? setFinished(true)
            : setIndex(index + 1)
        }
      >
        {index === questions.length - 1 ? "查看结果" : "下一题"}
      </button>
    </main>
  );
}

export type { Dimension };
