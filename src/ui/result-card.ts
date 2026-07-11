import type { Recommendation } from "../content/test-content";

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fillStyle = color;
  context.fill();
}
function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 5,
) {
  const characters = [...text];
  let line = "";
  let lineNumber = 0;
  for (const character of characters) {
    const test = line + character;
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line, x, y + lineNumber * lineHeight);
      line = character;
      lineNumber++;
      if (lineNumber === maxLines - 1) break;
    } else line = test;
  }
  if (lineNumber < maxLines)
    context.fillText(line, x, y + lineNumber * lineHeight);
}

export async function createResultCard(result: Recommendation): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("当前浏览器无法生成图片");
  context.fillStyle = "#fffaf3";
  context.fillRect(0, 0, 1080, 1350);
  context.fillStyle = "#dcebd2";
  context.beginPath();
  context.arc(120, 90, 260, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#f8d8d8";
  context.beginPath();
  context.arc(1010, 1180, 330, 0, Math.PI * 2);
  context.fill();
  context.textAlign = "center";
  context.fillStyle = "#386650";
  context.font = "800 54px system-ui, sans-serif";
  context.fillText("Pet Match", 540, 100);
  roundedRect(context, 130, 160, 820, 1030, 72, "rgba(255,255,255,.92)");
  context.font = "150px system-ui, sans-serif";
  context.fillText(result.emoji, 540, 390);
  context.fillStyle = "#68796f";
  context.font = "700 34px system-ui, sans-serif";
  context.fillText(`我的适配伙伴 · ${result.petType}`, 540, 485);
  context.fillStyle = "#284238";
  context.font = "800 66px system-ui, sans-serif";
  context.fillText(result.title, 540, 580);
  context.fillStyle = "#386650";
  context.font = "800 52px system-ui, sans-serif";
  context.fillText(result.example.replace("推荐品种：", ""), 540, 665);
  context.textAlign = "left";
  context.fillStyle = "#68796f";
  context.font = "400 34px system-ui, sans-serif";
  wrapText(context, result.reason, 200, 770, 680, 56, 6);
  context.textAlign = "center";
  context.fillStyle = "#386650";
  context.font = "700 30px system-ui, sans-serif";
  context.fillText("哪位小伙伴会更喜欢你呢？", 540, 1110);
  context.fillStyle = "#7b897f";
  context.font = "400 24px system-ui, sans-serif";
  context.fillText("娱乐与初步生活方式匹配 · 具体个体会有差异", 540, 1255);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("图片生成失败"))),
      "image/png",
    ),
  );
}

export function downloadResultCard(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
