# Agent 工作约定

开始前先读 `README.md`、`docs/PRODUCT_REQUIREMENTS.md`、`docs/ARCHITECTURE.md`、`docs/TASKS.md` 和 `docs/OPEN_QUESTIONS.md`。

1. 先确认需求编号和验收条件；会改变产品行为的不明确事项写入开放问题。
2. 保持依赖方向：`app` 负责界面，`src/domain` 负责纯业务规则，`src/content` 负责内容。
3. 不复制评分规则，不让业务模块访问 DOM、网络或隐藏全局状态。
4. 不提交密钥、个人数据、真实答案或本地 `.env`。
5. 新生产依赖、外部服务、追踪、持久化、账户与付费能力必须先获确认。
6. 修改时更新测试和任务；必要时更新需求、决策与开放问题。
7. 完成前运行 `npm run check`；失败时记录原因、替代验证和剩余风险。

多 Agent 只并行互不重叠的任务。任务需含目标、范围、禁止修改范围、约束、验收标准和报告格式；主 Agent 负责整合、最终验证与文档一致性。
