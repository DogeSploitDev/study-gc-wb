// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Serve HTML directly
app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>WidgetBot via Proxy</title>
        <style>
          html, body { margin:0; height:100%; }
          iframe { width:100%; height:100%; border:0; }
        </style>
      </head>
      <body>
        <!-- Embed WidgetBot directly via iframe -->
        <iframe
          src="https://e.widgetbot.io/channels/1413202916675944531/1413202917673926748"
          allow="clipboard-write; fullscreen"
          title="Discord Chat">
        </iframe>
      </body>
    </html>
  `);
});

// Optional: proxy Crate JS library if needed
app.use(
  "/jsdelivr",
  createProxyMiddleware({
    target: "https://cdn.jsdelivr.net",
    changeOrigin: true,
    pathRewrite: { "^/jsdelivr": "" },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
