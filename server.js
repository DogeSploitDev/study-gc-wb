import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Serve your OG HTML directly
app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>WidgetBot Crate via Proxy</title>
      </head>
      <body>
        <script src="/jsdelivr/npm/@widgetbot/crate@3" async defer></script>
        <script>
          new Crate({
            server: '1413202916675944531', // your server ID
            channel: '1413202917673926748', // your channel ID
            shard: '/widgetbot' // use backend proxy
          })
        </script>
      </body>
    </html>
  `);
});

// Proxy Crate library
app.use(
  "/jsdelivr",
  createProxyMiddleware({
    target: "https://cdn.jsdelivr.net",
    changeOrigin: true,
    pathRewrite: { "^/jsdelivr": "" },
  })
);

// Proxy WidgetBot shard
app.use(
  "/widgetbot",
  createProxyMiddleware({
    target: "https://e.widgetbot.io",
    changeOrigin: true,
    pathRewrite: { "^/widgetbot": "" },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
