---
name: vome-plugin-front
description: >-
  纯前端插件（vome-plugin-front）：Vue3/Vite、module.json menus、web/、wujie、
  打包 .vome。Use when developing plugins/vome-plugin-front or a frontend-only micro-app.
---

# 纯前端插件（vome-plugin-front）

> **目录**：`plugins/vome-plugin-front`  
> **示例 key**：`scaffold-frontend`  
> **入口**：[AGENTS.md](../AGENTS.md)

用 Vue3 写微应用，构建进 `web/`，打成 `.vome`；菜单 `appKey` 后由 **wujie** 打开。

## IDE

| 项 | 说明 |
|----|------|
| Snippets | `.vscode/plugin.code-snippets`；工作区根须能加载本 `.vscode` |
| Skills | 建议 `.cursor/skills/vome-plugin-front/` |
| 规范 | [规范.md](../../规范.md) |

## 能做什么

| 能力 | 说明 |
|------|------|
| 微应用 | `/vome/apps/{key}/`；`appKey` = `key` 时嵌入 Admin |
| Vue3 + Vite | 源码 `src/`，`bun run dev` |
| 相对资源 | `base: './'`，适配子路径 |
| 菜单同步 | `module.json.menus` 安装时写入 |

**不含** `server/`、`hook`、`invoke`（要后端用 service / full）。

## 命令

```bash
cd plugins/vome-plugin-front
bun install
bun run dev      # Vite（根路径预览 ≠ 线上子路径）
bun run build    # → web/（emptyOutDir）
bun run pack     # → release/scaffold-frontend.vome
```

改 `module.json.key` 时同步：`menus.appKey`、`router`、`pack` zip 名、页面文案。

## 目录与产物

| 路径 | 用途 |
|------|------|
| `module.json` | 清单 + `menus` |
| `index.html` / `vite.config.ts` | Vite 入口；`outDir: web`，`base: './'` |
| `src/main.ts` / `App.vue` | 源码 |
| `web/` | **构建产物**（进包）；改完必 build |
| `assets/` | logo（元数据，非 Vite public） |
| `release/*.vome` | `module.json` + README + `web/` + `assets/` |

包内不要：`src/`、`node_modules/`、根 `index.html`。

## module.json

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` / `key` / `version` | 是 | `key` 不可为 `plugin` |
| `menus` | 强烈建议 | 见下 |
| `hook` / `routes` / `config` | **不要声明** | 无 server 时安装会失败 |

### menus

| 字段 | 说明 |
|------|------|
| `name` | 侧栏名 |
| `router` | 如 `/scaffold-frontend` |
| `appKey` | **必须** = `key` |
| `icon` / `orderNum` / `isShow` | 展示 |

## 前端约定

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

- 可加 `vue-router` / UI 库，须打进 `web/`，**勿假设**共用宿主 node_modules  
- wujie 内路由优先 **hash** 或相对 base，避免与宿主 history 冲突  
- 同域共享登录态；业务请求走宿主 `/admin`、`/app`（`credentials: 'include'`，成功码 `1000`）  
- **不**自带 `vome-core` admin CRUD  

## Snippets

| 前缀 | 用途 |
|------|------|
| `plugin-module` | module.json 骨架 |
| `plugin-menu` | menus 单项 |
| `plugin-vue` | 页面 SFC |
| `plugin-main` | `main.ts` |
| `plugin-fetch` | 调宿主 `/admin/…` |

## 排错

| 现象 | 排查 |
|------|------|
| 安装失败 | 误加了 `hook`/`routes` 却无 server |
| 菜单点开空白 | `appKey` ≠ `key`；未 build 或 `web/` 旧 |
| JS/CSS 404 | `base` 被改成绝对 `/` |
| 本地正常线上挂 | 只用过 `dev`，未用 `build` 产物验子路径 |
| 登录态丢失 | fetch 未 `credentials: 'include'`；跨域 |
| 样式污染 | 少写 `html/body` 全局选择器；依赖 wujie 沙箱 |

## 相关

- VitePress：[plugin-front 开发](/plugins/plugin-front/develop) · [menus](/plugins/plugin-front/menus) · [wujie](/plugins/plugin-front/wujie) · [打包](/plugins/plugin-front/pack)
- Admin：[微应用](/admin/micro-apps)
