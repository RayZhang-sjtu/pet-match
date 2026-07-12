"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import {
  questions,
  recommendations,
  type Dimension,
} from "../src/content/test-content";
import {
  calculateBreedMatch,
  calculateMatchPercentage,
  calculatePersonalityInsights,
  calculateResult,
  describePersonalityMatch,
} from "../src/domain/scoring";
import { createResultCard, downloadResultCard } from "../src/ui/result-card";

const labels = ["很不符合", "不太符合", "一般", "比较符合", "非常符合"];
const publicUrl = "https://rayzhang-sjtu.github.io/pet-match/";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const question = questions[index];
  const result = finished
    ? calculateResult(answers, questions, recommendations)
    : null;
  const matchedBreed = finished
    ? calculateBreedMatch(answers, questions, recommendations)
    : null;
  const safetyLimited = result?.id === "pause";
  const personalityInsights = finished
    ? calculatePersonalityInsights(answers, questions)
    : [];
  const personalityBreed = safetyLimited ? matchedBreed : result;
  const matchPercentage =
    finished && personalityBreed
      ? calculateMatchPercentage(answers, questions, personalityBreed)
      : null;

  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 220,
      margin: 1,
      color: { dark: "#284238", light: "#fffaf3" },
    })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(""));
  }, []);

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
    try {
      const blob = await createResultCard(
        result,
        safetyLimited ? matchedBreed : null,
      );
      const file = new File([blob], "pet-match-result.png", {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "我的 Pet Match 结果", files: [file] });
        setShareStatus("分享成功");
      } else {
        downloadResultCard(blob, "pet-match-result.png");
        setShareStatus("当前浏览器不支持图片分享，已为你保存图片");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("暂时无法分享，请稍后再试");
    }
  }

  async function saveResult() {
    if (!result) return;
    try {
      downloadResultCard(
        await createResultCard(result, safetyLimited ? matchedBreed : null),
        "pet-match-result.png",
      );
      setShareStatus("结果图片已保存");
    } catch {
      setShareStatus("图片生成失败，请稍后再试");
    }
  }

  if (!started)
    return (
      <main className="shell hero">
        <h1 className="brandTitle">Pet Match</h1>
        <h2 className="heroQuestion">哪位小伙伴会更喜欢你呢？</h2>
        <p>为每一个想养宠物的年轻人，快速找到更适合他们的宠物。</p>
        <div className="facts" aria-label="测试说明">
          <span>30 道生活与性格场景</span>
          <span>约 6 分钟</span>
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
        <div className="resultBrand">Pet Match</div>
        <span className="eyebrow resultEyebrow">
          你的匹配方向 · {result.petType}
        </span>
        <div className="resultIcon" aria-hidden="true">
          {result.emoji}
        </div>
        <h1>{result.title}</h1>
        <h2 className="breedName">{result.example}</h2>
        <p>{result.reason}</p>
        {personalityBreed && matchPercentage !== null && (
          <section className="personalityResult">
            <div
              className="matchScore"
              aria-label={`宠物匹配度 ${matchPercentage}%`}
            >
              <strong>{matchPercentage}%</strong>
              <span>宠物匹配度</span>
            </div>
            <div className="personalityCopy">
              <p className="secondaryLabel">你的主人性格画像</p>
              <h3>
                {personalityInsights.map((item) => item.label).join(" · ")}
              </h3>
              <p>
                {personalityInsights.map((item) => item.description).join("")}
              </p>
              <h4>你和主宠为什么合拍</h4>
              <p>
                {describePersonalityMatch(
                  personalityInsights,
                  personalityBreed,
                )}
              </p>
              <small>
                匹配度表示本次答案与品种画像的接近程度，不是统计概率或心理诊断。
              </small>
            </div>
          </section>
        )}
        <section className="resultNotes">
          <h3>决定前的小注释</h3>
          <ul>
            {result.checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <p className="notice">
          同一品种的个体也会因年龄、健康、经历和性格而不同。未成年人需由监护人同意并承担最终责任；请优先咨询兽医或正规救助机构。
        </p>
        {safetyLimited && matchedBreed && (
          <section className="secondaryMatch" aria-label="性格匹配宠物参考">
            <p className="secondaryLabel">如果只看性格与相处偏好</p>
            <div className="secondaryIcon" aria-hidden="true">
              {matchedBreed.emoji}
            </div>
            <h3>{matchedBreed.example}</h3>
            <p>{matchedBreed.reason}</p>
          </section>
        )}
        {qrCodeUrl && (
          <section className="resultQr">
            <Image
              src={qrCodeUrl}
              alt="扫描二维码打开 Pet Match 公开网站"
              width={132}
              height={132}
              unoptimized
            />
            <p>扫码邀请朋友来测一测</p>
          </section>
        )}
        <div className="actions">
          <button className="primary" onClick={shareResult}>
            分享结果图片
          </button>
          <button className="secondary" onClick={saveResult}>
            保存结果图片
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
