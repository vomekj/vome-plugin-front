# scaffold-frontend

纯前端微应用脚手架（`.vome`，含构建后的 `web/`）。

## 开发

```bash
bun install
bun run dev    # Vite 本地预览（源码在 src/）
bun run build  # → web/
bun run pack   # build 后打包 → release/scaffold-frontend.vome
```

安装后菜单 `appKey` 对应页面由宿主 wujie 加载 `/vome/apps/scaffold-frontend/`。

规范见 [规范.md](./规范.md)。
