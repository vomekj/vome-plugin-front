---
name: vome-plugin-front
description: >-
  纯前端插件脚手架：menus/wujie、Hash 路由、Pinia、主题/语种同步、
  hostRequest、可选 EPS service。Use when developing plugins/vome-plugin-front.
---

# 纯前端插件（vome-plugin-front）

> **目录**：`plugins/vome-plugin-front` · **示例 key**：`scaffold-frontend`  
> **规范（边界/强制）**：[规范.md](../../规范.md)

## 命令

```bash
cd plugins/vome-plugin-front
bun run dev | build | pack
# 建议：cp release/*.vome ~/Downloads/vome-plugins/
```

本地 `dev` 通常无 Admin token / 主题语种 bus；**联调在 Admin wujie 内**。

微应用 `menus`：`appKey` = `key`，页面**无 icon**；安装后挂侧栏 **「无界渲染」**（宿主写入父菜单 `ri-artboard-fill`）。

## 开放封装用法

### 调宿主

```ts
import { hostRequest } from '@/lib/host-api'
await hostRequest('GET', '/admin/base/auth/me')
await hostRequest('POST', '/admin/…/…', { /* body */ })
// 鉴权失败会用 vome_admin_refresh → /admin/base/auth/refresh 无感换票后重试
```

| 方法 | 作用 |
|------|------|
| `PLUGIN_KEY` | 须与 `module.json.key` 一致 |
| `hostRequest(method, path, body?)` | Bearer + `/dev`\|`/prod`；`code===1000` → `data`；无感 refresh |
| `hostClientRequest(path, init?)` | 同上；供 EPS `configureClient` |
| `resolveHostUrl` / `getHostAccessToken` | 前缀与 token |

### 可选 EPS

```ts
import { bootHostEps, service } from '@/lib/eps-client'
await bootHostEps()
// service.<module>… 按宿主 EPS 挂载结果调用
```

| 方法 | 作用 |
|------|------|
| `bootHostEps(force?)` | 拉 `GET /admin/base/open/eps` 并挂载 |
| `service` | `getService('admin')`；须先 boot |

底层只用 `vome-core/client` 公开导出：`configureClient` / `createEps` / `getService` / `clearEpsCache`。  
宿主须开 `vome.eps`；失败用 `hostRequest` 兜底。勿打入整包 Admin CRUD UI。

### 主题 / 语种

```ts
// App.vue
import { watchHostTheme } from '@/sync-host-theme'
import { watchHostLocale } from '@/sync-host-locale'
onMounted(() => {
  stopTheme = watchHostTheme()
  stopLocale = watchHostLocale()
})
```

```ts
import { usePluginLocale } from '@/lib/locale'
const { t } = usePluginLocale()
t('app.name')
```

| 方法 | 作用 |
|------|------|
| `watchHostTheme` / `watchHostLocale` | App 挂载；返回取消函数 |
| `usePluginLocale` → `t` | 页面文案 |
| `setLocale` | **仅** sync-host-locale 跟宿主，勿做插件内语言菜单 |

### 新页面

加 `src/pages/<path>/index.vue` → `/#/<path>`。

## 排错

| 现象 | 排查 |
|------|------|
| 401 | 未登录；跨域打开无 token |
| 404 / 连错端口 | 未走 `/dev` 前缀（应在 Admin wujie 打开） |
| JS/CSS 404 | `base` 被改成 `/` |
| 主题花屏 / 双层白卡片 | 未 `watchHostTheme`；又铺了白底 |
| 语种不跟 | 未 `watchHostLocale`；或自做了切语言 UI |
| EPS 空 | 宿主未开 `vome.eps`；改用 `hostRequest` |
| 菜单空白 | `appKey` ≠ `key`；未 build |

## IDE

Snippets：`.vscode/plugin.code-snippets`（`plugin-fetch` / `plugin-eps` / `plugin-t`）。
