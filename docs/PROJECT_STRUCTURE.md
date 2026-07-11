# 项目结构

- `app/`：页面、布局、样式。
- `src/content/`：题目、维度、结果档案。
- `src/domain/`：内容校验与评分。
- `tests/`：业务和生成页面检查。
- `docs/`：长期有效的需求、决策和交接信息。
- `.openai/hosting.json`：托管声明；当前无数据库或对象存储。
- `worker/`、`build/`：站点运行适配，不放业务规则。

`db/`、`drizzle/`、`examples/` 来自标准模板，MVP 不调用；清理策略见 OQ-009。
