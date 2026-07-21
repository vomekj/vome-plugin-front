---
name: vome-plugin-front
description: >-
  纯前端插件（vome-plugin-front）：menus/wujie、hostRequest 调宿主、与 core 能力边界。
  Use when developing plugins/vome-plugin-front.
---

# 纯前端插件（vome-plugin-front）

> **目录**：`plugins/vome-plugin-front` · **示例 key**：`scaffold-frontend`  
> **入口**：[AGENTS.md](../AGENTS.md)

## 与 vome-core 的能力边界

| 能力 | 状态 | 用法 |
|------|------|------|
| Vue3 + Vite 微应用 `web/` | **可用** | `base: './'`；wujie → `/vome/apps/{key}/` |
| `menus` + `appKey` | **可用** | `appKey` **必须** = `key` |
| 同域调宿主 `/admin/…` | **可用** | `src/lib/host-api.ts` → `hostRequest` |
| Bearer `vome_admin_access` | **可用** | 与 Admin 同域（经 `/dev` 代理的 wujie）时共享 localStorage |
| 自动 `/dev` `/prod` 前缀 | **可用** | 按 `location.pathname` 对齐 Admin `baseUrl` |
| 整包 `vome-core/admin` CRUD / EPS | **不推荐默认** | 体积大、与主壳重复；复杂后台写宿主 `modules/` |
| `server/` / `hook` / `invoke` | **本脚手架无** | 用 service / full |
| 声明 `hook`/`routes` 无 server | **禁止** | 安装失败 |

## IDE

见 [AGENTS.md](../AGENTS.md)。

## 命令

```bash
cd plugins/vome-plugin-front
bun run dev | build | pack
```

本地 `dev`（5173）无 Admin 代理与 token；**以安装后 wujie 为准**验证 `hostRequest`。

## 脚手架已演示

- `src/lib/host-api.ts`：`hostRequest` / `resolveHostUrl` / token
- `App.vue`：按钮请求 `GET /admin/base/auth/me`

```ts
import { hostRequest } from './lib/host-api'
const me = await hostRequest('GET', '/admin/base/auth/me')
```

## Snippets

| 前缀 | 用途 |
|------|------|
| `plugin-module` / `plugin-menu` | 清单与菜单 |
| `plugin-vue` / `plugin-main` | 页面与入口 |
| `plugin-fetch` | 调宿主 API 示意 |

## 排错

| 现象 | 排查 |
|------|------|
| 401 unauthorized | 未登录；token 键名；跨域打开入口导致无 localStorage |
| 404 / 连错端口 | 未走 `/dev` 前缀（应在 Admin 代理下的 wujie 打开） |
| JS/CSS 404 | `base` 被改成 `/` |
| 菜单空白 | `appKey` ≠ `key`；未 build |

## 相关

- VitePress：[能力边界](/plugins/#与-vome-core-的关系) · [develop](/plugins/plugin-front/develop) · [wujie](/plugins/plugin-front/wujie) · [微应用](/admin/micro-apps)
