# Vome Plugin Front（纯前端插件脚手架）

[English](./README.en.md) | 简体中文

只含 **Admin 微应用页面（`web/`）** 的插件脚手架，打包为 `.vome` 后，在 [vome-admin](https://gitee.com/vomekj/vome-admin) 安装启用，由 [vome-service](https://gitee.com/vomekj/vome-service) 托管静态资源。适合在后台扩展管理页 / 配置页，**无需**宿主 `invoke` 后端钩子的场景。

> 微茫科技开源项目。配套 Service（静态资源）+ Admin（菜单 + wujie）。

## 何时选用

| 需求 | 选用 |
| --- | --- |
| **只要 Admin 页面（wujie）** | **本仓库（scaffold-front）** |
| 只要后端钩子 / invoke | [vome-plugin-service](https://gitee.com/vomeshop/vome-plugin-service) |
| 钩子 + Admin 页面 | [vome-plugin-full](https://gitee.com/vomekj/vome-plugin-full) |

## 特性

| 能力 | 说明 |
| --- | --- |
| **纯前端 `.vome`** | 包内含 `module.json` + `web/` + `assets/`（无 `server/`） |
| **Admin 菜单** | `menus[].appKey` 对应插件 `key`，启用后侧栏出现入口 |
| **wujie 微应用** | Admin 打开 `/vome/apps/{key}/` 加载 `web/` |
| **Vite + Vue3** | 源码在 `src/`，构建到 `web/`，`base: './'` |
| **同域嵌入** | 与主壳同域，可共享登录态策略 |

## 标识（示例）

| 项 | 值 |
| --- | --- |
| `key` | `scaffold-frontend` |
| 菜单 `appKey` | `scaffold-frontend` |
| 菜单路由 | `/scaffold-frontend` |
| 产物 | `release/scaffold-frontend.vome` |

复制后请改掉 `key` / `menus`，并同步 `pack` 脚本中的 zip 文件名。

## 环境要求

| 依赖 | 说明 |
| --- | --- |
| **Bun / Node** | 安装与 Vite 构建 |
| **Vome Service** | 托管已安装模块的 `web/`（`/vome/apps/{key}/`） |
| **Vome Admin** | 插件管理 + 侧栏 wujie 打开微应用 |

## 快速开始

```bash
git clone https://gitee.com/vomeshop/vome-plugin-front.git
cd vome-plugin-front
bun install
```

### 1. 本地开发

```bash
bun run dev    # Vite 预览（源码 src/；路径与 wujie 略有差异）
# 改 module.json、src/App.vue
bun run build  # → web/
bun run pack   # build + zip → release/*.vome
```

### 2. 安装到 Admin（配套框架）

1. 启动 [vome-service](https://gitee.com/vomekj/vome-service) 与 [vome-admin](https://gitee.com/vomekj/vome-admin)  
2. Admin → **插件管理** → 上传 `release/scaffold-frontend.vome` → **安装并启用**  
3. 侧栏出现「脚手架前端」（或你改过的菜单名）→ 进入 **wujie** 微应用页  
4. 可点微应用顶栏「打开入口」单独检查 `/vome/apps/{key}/` 静态资源是否 200  

安装 API：`POST /admin/base/module/install`。宿主会按 `appKey` 幂等同步 `base_menu`。

> 无 `server/` / `hook`，启用后**不能**用 `invoke` 调本插件；仅提供前端页。市场在线发布尚在规划，请本地或内网分发 `.vome`。

## 与 Admin / Service 的关系

| 端 | 作用 |
| --- | --- |
| **Service** | 解压插件、同步菜单、托管 `GET /vome/apps/{key}/` → 包内 `web/` |
| **Admin** | 安装 / 启用；`pages/micro` 用 **wujie** 嵌入微应用（`alive: true`） |

开发时 Admin Vite 会把 `/vome/` 代理到 Service（见 Admin `src/config/proxy.ts`）。

## 菜单约定

```json
{
  "menus": [
    {
      "name": "脚手架前端",
      "router": "/scaffold-frontend",
      "appKey": "scaffold-frontend",
      "icon": "icon-app",
      "orderNum": 99,
      "isShow": true
    }
  ]
}
```

| 规则 | 说明 |
| --- | --- |
| `appKey` ≈ `key` | 加载 `/vome/apps/{appKey}/` |
| 有 `appKey` | 走微应用页，不是 `modules/*/views` 本地 Vue |
| `perms` | 可选；菜单可见仍受 RBAC 约束 |

推荐以 `module.json.menus` 为准随包分发；也可在「菜单管理」手工填 `appKey`。

## 目录结构

```text
vome-plugin-front/
├── module.json              # key + menus（通常无 hook）
├── README.md
├── 规范.md
├── package.json
├── vite.config.ts           # base: './'，outDir: web
├── index.html
├── src/                     # 前端源码（Vue3）
│   ├── main.ts
│   └── App.vue
├── web/                     # 构建产物（打进 .vome）
├── assets/
└── release/
    └── scaffold-frontend.vome
```

与全栈脚手架区别：纯前端用 **`src/`** 放页面；全栈把 `src/` 留给后端，前端用 `web-src/`——不要混抄。

## `module.json` 要点

| 字段 | 说明 |
| --- | --- |
| `key` | `[a-zA-Z0-9_-]+`，不可为 `plugin` |
| `menus[]` | 建议必填；含 `router` + `appKey` |
| `hook` / `routes` / `config` | 本脚手架通常不用 |

规范详见 [规范.md](./规范.md)。

## 前端约定

- `vite` **`base: './'`**，产物在 `web/`，入口 `web/index.html`  
- 资源用相对路径，勿写死主域绝对 URL  
- 子路由推荐 **hash** 或严格相对路径，避免与主壳抢 history  
- 不要把 `node_modules` 打进 `.vome`  

## 禁止

- 依赖宿主 `.env`  
- `key` 取名为 `plugin`  
- 缺少 `web/index.html` 仍去安装  

## 相关项目

| 项目 | 说明 |
| --- | --- |
| [vome-service](https://gitee.com/vomekj/vome-service) | 静态资源与菜单同步（必配） |
| [vome-admin](https://gitee.com/vomekj/vome-admin) | 安装页 + wujie 壳（必配） |
| [vome-plugin-service](https://gitee.com/vomeshop/vome-plugin-service) | 纯后端脚手架 |
| [vome-plugin-full](https://gitee.com/vomekj/vome-plugin-full) | 全栈脚手架 |

## 贡献

1. Fork 本仓库  
2. 新建分支 `feat/xxx`  
3. 提交并推送  
4. 发起 Pull Request / Merge Request  

## 许可证

[MIT](./LICENSE) © VomeShop / 微茫科技

---

若本仓库对你有帮助，欢迎 Star ⭐
