---
name: scaffold-front
description: >-
  纯前端插件微应用完整用法：Vue3/Vite、module.json menus、构建 web/、wujie、打包注意点。
  Use when developing plugins/scaffold-front or a frontend-only .vome micro-app.
---

# 纯前端插件脚手架（scaffold-front）

复制本目录后，用 Vue3 写微应用，构建进 `web/`，打成 `.vome` 安装；后台菜单带 `appKey` 后由 **wujie** 打开。

## 能做什么

| 能力 | 说明 |
|------|------|
| 微应用页面 | 安装后访问 `/vome/apps/{key}/`；菜单 `appKey` = `key` 时嵌入 admin |
| Vue3 + Vite | 源码在 `src/`，本地 `bun run dev` 预览 |
| 相对资源 | `base: './'`，适配子路径托管 |
| 菜单同步 | `module.json.menus` 安装时写入宿主菜单 |

**不包含**：后端 `server/`、钩子 `hook`、`invoke`（要后端用 scaffold-service / scaffold-full）。

## 命令

```bash
cd plugins/scaffold-front
bun install
bun run dev      # Vite 开发服务器（改 src/）
bun run build    # → web/（emptyOutDir，会清空旧产物）
bun run pack     # build 后 zip → release/{key}.vome
```

改 `module.json.key` 时，同步改 `package.json` 里 `pack` 的 zip 文件名（示例 `scaffold-frontend`）。

## 目录与产物

| 路径 | 用途 |
|------|------|
| `module.json` | 清单 + `menus` |
| `index.html` | Vite HTML 入口 |
| `vite.config.ts` | `base: './'`，`outDir: 'web'` |
| `src/main.ts` / `src/App.vue` | Vue 入口与根组件 |
| `web/` | **构建产物**（进包）；勿手写业务，改完必 `build` |
| `assets/` | 插件 logo（元数据，不是 Vite public） |
| `release/*.vome` | 含 `module.json` + `README.md` + `web/` + `assets/` |

包内**不要**含 `src/`、`node_modules/`、`index.html`（根目录源入口）。

## module.json 字段

| 字段 | 必填 | 怎么用 |
|------|------|--------|
| `name` / `key` / `version` | 是 | `key` 不可为 `plugin`；与菜单 `appKey`、URL 段一致 |
| `menus` | 强烈建议 | 见下表 |
| `logo` / `readme` / `description` / `author` | 否 | 展示用 |
| `hook` / `routes` / `config` | 本脚手架通常不用 | 无 server 时不要声明 hook/routes（安装会失败） |

### menus 单项

| 字段 | 说明 |
|------|------|
| `name` | 侧栏显示名 |
| `router` | 后台路由 path，如 `/scaffold-frontend` |
| `appKey` | **必须**等于插件 `key`，宿主才走微应用页 |
| `icon` | 图标名（如 `icon-app`） |
| `orderNum` / `isShow` | 排序与是否显示 |

## 可以用什么（前端）

### Vue3 标准能力

- `<script setup lang="ts">`、SFC、`defineOptions`
- 脚手架默认依赖：`vue`；构建工具：`vite` + `@vitejs/plugin-vue`
- 可自行加 `vue-router` / UI 库等，但须打进 bundle（最终进 `web/`），**不要**假设能共用宿主 node_modules

### 入口约定

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

`index.html` 里 `#app` + `/src/main.ts`；构建后资源为相对路径。

### 与宿主的关系

- 静态资源由宿主提供：`GET /vome/apps/{key}/`
- admin 菜单配置了 `appKey` 后，用 **wujie** 加载上述 URL
- 微应用与主壳共享登录态（以宿主实现为准）；业务请求请走你们约定的 API（通常仍打宿主 `/admin` 或 `/api`，注意 CORS/凭证）

本脚手架**不**自带 `vome-core` admin CRUD；需要复杂后台组件请在微应用内自建或引依赖打包。

## Snippets（`.vscode/plugin.code-snippets`）

| 前缀 | 用途 |
|------|------|
| `plugin-menu` | `menus` 单项（json） |
| `plugin-vue` | 页面 SFC 模板 |
| `plugin-main` | `main.ts` 入口 |

## 需要注意什么

1. **先 build 再 pack**：`web/` 是产物；只改 `src` 不 build，安装包仍是旧页面。
2. **`base: './'` 不要改成绝对 `/`**：否则挂在 `/vome/apps/{key}/` 下会丢 JS/CSS。
3. **`appKey` 必须等于 `key`**：不一致则菜单打不开对应微应用。
4. **不要声明 hook/routes**：纯前端包没有 `server/index.js`，安装校验会失败。
5. **不要**把 `node_modules`、源码目录打进 `.vome`。
6. **禁止依赖宿主 `.env`**；环境差异用构建时注入或请求宿主配置接口。
7. **本地 `dev` ≠ 安装后路径**：dev 在 Vite 根路径；线上在 `/vome/apps/{key}/`，务必用相对 base 验证 `build` 产物。
8. **改 key**：同步 `module.json`、`menus.appKey`、`router`、`pack` 文件名、页面文案。
