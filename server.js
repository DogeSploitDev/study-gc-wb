// widgetbot-proxy-fixed.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
const WIDGETBOT_URL = "https://e.widgetbot.io/channels/1413202916675944531/1413202917673926748";

// Utility to rewrite links in HTML
function rewriteLinks(html, proxyBase) {
  return html
    .replace(/(src|href)=["'](https?:\/\/[^"']+)["']/g, `$1="${proxyBase}?url=$2"`)
    .replace(/(url\(["']?)(https?:\/\/[^"')]+)(["']?\))/g, `$1${proxyBase}?url=$2$3`);
}

// Generic proxy
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing URL parameter");

  try {
    const response = await fetch(target, { headers: { "User-Agent": "Mozilla/5.0" } });
    const contentType = response.headers.get("content-type") || "text/html";
    let body = await response.text();

    if (contentType.includes("text/html")) {
      const proxyBase = `${req.protocol}://${req.get("host")}/proxy`;
      body = rewriteLinks(body, proxyBase);
    }

    res.set("Content-Type", contentType).send(body);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching URL");
  }
});

// Shortcut route for WidgetBot
app.get("/widgetbot", async (req, res) => {
  res.redirect(`/proxy?url=${encodeURIComponent(WIDGETBOT_URL)}`);
});

app.listen(PORT, () => console.log(`WidgetBot proxy running at http://localhost:${PORT}/proxy?url=`));
