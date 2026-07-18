---
type: raw
domain: [shared]
tags: [shared]
---

# PVSize — Free Solar Calculator Suite

PVSize is a free solar sizing toolkit for homeowners, DIY solar researchers, and energy writers who need quick, transparent estimates before talking to installers.

## Public Calculator Entrances

- [Start with PVSize](https://pvsize.com/?utm_source=github&utm_medium=repository&utm_campaign=public_readme)
- [Solar Panel Count Calculator](https://pvsize.com/calculators/panel-count/?utm_source=github&utm_medium=repository&utm_campaign=panel_count)
- [Home Battery Sizing Calculator](https://pvsize.com/calculators/battery-sizing/?utm_source=github&utm_medium=repository&utm_campaign=battery_sizing)
- [Technical Feedback Request: Solar Sizing Scenarios](docs/solar-sizing-feedback-request.md)
- [PVSize Technical Feedback Hub](https://pvsize.com/technical-feedback/?utm_source=github&utm_medium=repository&utm_campaign=technical_feedback_hub)
- AI/LLM index summary: https://pvsize.com/llms.txt

## What PVSize Helps Estimate

- How many solar panels a home may need from monthly electricity use.
- What battery size may cover an overnight outage or off-grid scenario.
- Basic savings, payback, carbon, and practical assumptions for early solar planning.
- Shareable result summaries for discussion with installers, homeowners, or technical reviewers.

## 代码与部署规则

- GitHub 仓库是 PVSize 的唯一正式源码。
- 日常发布流程固定为：本地修改 -> 自查 -> `git commit` -> `git push` -> 等待 Vercel 基于 GitHub 自动部署。
- 本地直连 Vercel 发布不再作为常规方式，只允许用于 P0 故障抢修。
- 如果发生本地应急发布，必须在 24 小时内把同一批改动补提交回 GitHub，恢复“仓库即线上真相源”。
- 给云端模型、外部审查或协作者检查代码时，应优先提供 GitHub 仓库，不再依赖本地路径快照。

## 当前部署口径

- 生产站点：`https://pvsize.com`
- 正式发布来源：`main` 分支推送触发的 Vercel 自动部署
- 本地 `deploy.sh` 默认只做提交和推送；只有显式使用应急参数时才允许本地直推 Vercel

## SEO 配置

### Bing Webmaster
- 验证状态：已配置（meta 标签注入 36 个 HTML 页面）
- 验证码：`C6723C6C8D6D6808B860E39114AF8D8D`
- 管理入口：https://www.bing.com/webmasters

### 技术实现
- 验证标签 `<meta name="msvalidate.01" content="C6723C6C8D6D6808B860E39114AF8D8D" />` 已注入 `src/` 下全部 HTML 页面的 `<meta charset>` 行之后
- 配置日期：2026-07-04
