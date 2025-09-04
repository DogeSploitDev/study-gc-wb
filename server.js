// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files (your site)
app.use(express.static(path.join(__dirname, "public")));

// Proxy WidgetBot JS (cdn.jsdelivr.net) through your server
app.use(
  "/jsdelivr",
  createProxyMiddleware({
    target: "https://cdn.jsdelivr.net",
    changeOrigin: true,
    pathRewrite: { "^/jsdelivr": "" },
  })
);

// Proxy WidgetBot shard (chat iframe API)
app.use(
  "/widgetbot",
  createProxyMiddleware({
    target: "https://e.widgetbot.io",
    changeOrigin: true,
    pathRewrite: { "^/widgetbot": "" },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
