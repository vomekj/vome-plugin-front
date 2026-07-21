# Vome Plugin Front (frontend-only plugin scaffold)

[简体中文](./README.md) | English

A plugin scaffold with **Admin micro-app UI only (`web/`)**. Pack it as a `.vome`, install it in [vome-admin](https://gitee.com/vomekj/vome-admin), and let [vome-service](https://gitee.com/vomekj/vome-service) host the static files. Ideal for extra admin / settings pages that **do not** need host `invoke` backend hooks.

> Open-sourced by Vome / 威迈科技. Pairs with Service (static hosting) + Admin (menus + wujie).

## When to use

| Need | Choose |
| --- | --- |
| **Admin UI only (wujie)** | **This repo (scaffold-front)** |
| Backend hooks / invoke only | [vome-plugin-service](https://gitee.com/vomeshop/vome-plugin-service) |
| Hooks + Admin UI | [vome-plugin-full](https://gitee.com/vomekj/vome-plugin-full) |

## Features

| Capability | Description |
| --- | --- |
| **Frontend-only `.vome`** | Package has `module.json` + `web/` + `assets/` (no `server/`) |
| **Admin menus** | `menus[].appKey` matches plugin `key`; sidebar entry after enable |
| **wujie micro-app** | Admin loads `/vome/apps/{key}/` from `web/` |
| **Vite + Vue 3** | Sources in `src/`, build to `web/`, `base: './'` |
| **Same-origin embed** | Shares domain / auth strategy with the host shell |

## Identity (sample)

| Item | Value |
| --- | --- |
| `key` | `scaffold-frontend` |
| Menu `appKey` | `scaffold-frontend` |
| Menu route | `/scaffold-frontend` |
| Artifact | `release/scaffold-frontend.vome` |

After copying, change `key` / `menus` and the zip name in the `pack` script.

## Requirements

| Dependency | Notes |
| --- | --- |
| **Bun / Node** | Install & Vite build |
| **Vome Service** | Hosts installed `web/` at `/vome/apps/{key}/` |
| **Vome Admin** | Plugin manager + wujie shell |

## Quick start

```bash
git clone https://gitee.com/vomeshop/vome-plugin-front.git
cd vome-plugin-front
bun install
```

### 1. Local development

```bash
bun run dev    # Vite preview (src/; paths differ slightly from wujie)
# Edit module.json, src/App.vue
bun run build  # → web/
bun run pack   # build + zip → release/*.vome
```

### 2. Install into Admin

1. Start [vome-service](https://gitee.com/vomekj/vome-service) and [vome-admin](https://gitee.com/vomekj/vome-admin)  
2. Admin → **Plugins** → upload `release/scaffold-frontend.vome` → **install & enable**  
3. Sidebar shows the menu → open the **wujie** micro-app  
4. Use “Open entry” in the micro-app chrome to verify `/vome/apps/{key}/` returns 200  

API: `POST /admin/base/module/install`. The host syncs `base_menu` by `appKey` idempotently.

> With no `server/` / `hook`, you **cannot** `invoke` this plugin — UI only. Marketplace upload is not ready yet; distribute `.vome` files locally or on your intranet.

## How it fits Admin / Service

| Side | Role |
| --- | --- |
| **Service** | Unpack plugin, sync menus, serve `GET /vome/apps/{key}/` → package `web/` |
| **Admin** | Install / enable; `pages/micro` embeds the app with **wujie** (`alive: true`) |

In dev, Admin Vite proxies `/vome/` to Service (see Admin `src/config/proxy.ts`).

## Menu convention

```json
{
  "menus": [
    {
      "name": "Frontend scaffold",
      "router": "/scaffold-frontend",
      "appKey": "scaffold-frontend",
      "icon": "icon-app",
      "orderNum": 99,
      "isShow": true
    }
  ]
}
```

| Rule | Notes |
| --- | --- |
| `appKey` ≈ `key` | Loads `/vome/apps/{appKey}/` |
| With `appKey` | Micro-app page, not a local `modules/*/views` Vue |
| `perms` | Optional; still subject to RBAC |

Prefer shipping menus via `module.json`; you can also add an `appKey` menu manually in Admin.

## Project layout

```text
vome-plugin-front/
├── module.json              # key + menus (usually no hook)
├── README.md
├── 规范.md
├── package.json
├── vite.config.ts           # base: './', outDir: web
├── index.html
├── src/                     # frontend sources (Vue 3)
│   ├── main.ts
│   └── App.vue
├── web/                     # build output (inside .vome)
├── assets/
└── release/
    └── scaffold-frontend.vome
```

Unlike the fullstack scaffold: frontend-only uses **`src/`** for UI. Fullstack reserves `src/` for the backend and uses `web-src/` for UI — don’t mix them.

## `module.json` essentials

| Field | Notes |
| --- | --- |
| `key` | `[a-zA-Z0-9_-]+`, cannot be `plugin` |
| `menus[]` | Recommended; include `router` + `appKey` |
| `hook` / `routes` / `config` | Usually unused here |

See [规范.md](./规范.md) for the full convention.

## Frontend rules

- Vite **`base: './'`**, output in `web/`, entry `web/index.html`  
- Relative asset URLs only — no hard-coded host origin  
- Prefer **hash** or strict relative sub-routes so you don’t fight the host history  
- Do not zip `node_modules` into the `.vome`  

## Do not

- Use `key: "plugin"`  
- Install without `web/index.html`  

## Related projects

| Project | Role |
| --- | --- |
| [vome-service](https://gitee.com/vomekj/vome-service) | Static hosting + menu sync (required) |
| [vome-admin](https://gitee.com/vomekj/vome-admin) | Install UI + wujie shell (required) |
| [vome-plugin-service](https://gitee.com/vomeshop/vome-plugin-service) | Backend-only scaffold |
| [vome-plugin-full](https://gitee.com/vomekj/vome-plugin-full) | Fullstack scaffold |

## Contributing

1. Fork this repo  
2. Create `feat/xxx`  
3. Commit and push  
4. Open a Pull / Merge Request  

## License

[MIT](./LICENSE) © VomeShop / 威迈科技

---

If this project helps you, a Star ⭐ is appreciated.
