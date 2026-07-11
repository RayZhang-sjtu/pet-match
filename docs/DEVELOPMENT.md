# 开发

使用 Node.js 22.13+。首次运行 `npm ci`，预览运行 `npm run dev`。

修改流程：先在任务表定位验收项；内容改 `src/content`，评分改 `src/domain`，交互改 `app`；补测试并同步文档；最后运行 `npm run check` 并检查没有密钥或无关文件。

生产依赖、外部 API、账户、持久化、追踪或付费服务必须先获项目所有者确认。

## GitHub Pages

`npm run build:pages` 会在 `out/` 生成纯静态网站。推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会先执行质量检查，再构建并发布。GitHub 仓库的 Pages 来源必须设置为 “GitHub Actions”。
