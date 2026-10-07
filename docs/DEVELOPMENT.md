# 本地开发指南

## 环境与启动

使用 Node.js 24 LTS；仓库提供 `.nvmrc`。进入仓库后执行：

```bash
npm ci
npm run db:init
npm run dev
```

打开 http://localhost:5173。游戏不需要 API Key。开发服务器通过 Cloudflare Vite 插件提供本地 Worker、D1 和热更新。

## 数据库与会话

`npm run db:init` 使用 Wrangler 的迁移记录应用尚未执行的 SQL。首次运行和新增迁移后执行即可，可重复执行。

| 文件／目录 | 用途 |
| --- | --- |
| `db/schema.ts` | rooms、sessions 的结构 |
| `drizzle/*.sql` | 数据库迁移 |
| `.wrangler/state/` | 本机对局与会话数据，已加入忽略列表 |
| `wrangler.local.jsonc` | 本地迁移配置，数据库 ID 为占位值 |
| `.openai/hosting.json` | 构建需要的绑定声明，公开版不含站点项目身份 |

`wrangler.local.jsonc` 与 `vite.config.ts` 使用相同的 DB 绑定、占位 ID 和本地存储目录。修改结构时使用 `npm run db:generate` 生成新迁移，再执行 `npm run db:init`。保留旧迁移，避免修改已应用文件。

游戏使用 HttpOnly 会话 Cookie。同一浏览器刷新可以恢复当前房间；切换浏览器、清除 Cookie 或使用不同主机名会获得不同会话。测试两名真人可使用两个浏览器或独立浏览器配置。

## 检查与构建

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm start` 运行构建后的 Worker，默认访问 http://127.0.0.1:8787，以控制台显示的地址为准。它与开发模式共用 `.wrangler/state`，请先初始化数据库。

引擎测试覆盖资源、三合一、训练成长、拍卖、状态脱敏及完整 12 回合模拟。API 测试使用内存 SQLite 适配 D1，覆盖加入房间、持久化、重复动作、并发更新、阶段校验及跨站写入检查。

手动检查建议：

- 鼠标与触屏从商店、备战区拖动上场，换位及撤回。
- 凑齐三张同名同星触发合成；成长与站位保持符合规则。
- 羁绊从灰色变为专属颜色；撤回成员后计数回退；顶部标识随滚动常驻。
- 进入拍卖、完成评测，并在刷新后恢复对局。

## 常见问题

**提示数据库表不存在**：先执行 `npm run db:init`，并从仓库根目录运行启动命令。

**Node 版本过旧**：运行 `node --version`，使用 `.nvmrc` 指定的版本后重新安装依赖。

**5173 端口已占用**：关闭原开发服务器，或执行 `npm run dev -- --port 5174`，使用控制台中的实际地址。

**房间码无法在另一台电脑使用**：对方需要访问同一台服务器。分别运行的两个本地实例拥有独立数据库。

**移动端跨设备调试**：拖动可在浏览器的触屏模拟模式检查；实体设备联网调试需要能够访问同一服务，并使用 HTTPS 等安全上下文，保证浏览器的 UUID、剪贴板等 API 可用。

## 部署说明

这是有服务端状态的应用，运行时需要 Cloudflare Workers 兼容环境和 D1 的 `DB` 绑定。GitHub 仅用于托管源码。

公开版保留了 Sites / Vinext 的构建工具。若使用 Sites，请为自己的站点配置新的项目身份与数据库；若自行部署到 Cloudflare，请为自己的账号创建 D1 数据库、配置真实数据库 ID、应用迁移并完成 Worker 绑定。仓库中的全零数据库 ID 仅用于本地开发。

当前启动和检查命令用于本地运行；仓库不包含一键部署到他人账号的凭据或现成线上数据库。对外开放多人服务时，可按需要补充账号系统、限流与房间清理策略。
