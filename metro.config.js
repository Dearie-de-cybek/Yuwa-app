// Web preview only: forward /api and /ref to the website so the browser has no cross-origin calls.
// Phones talk to the website directly (see src/lib/api.ts).
const http = require("node:http");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const target = new URL(process.env.YUWA_PROXY ?? "http://localhost:3000");

config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  if (!/^\/(api|ref)\//.test(req.url)) return middleware(req, res, next);
  const headers = { ...req.headers, host: target.host };
  delete headers.origin;
  delete headers.referer;
  const upstream = http.request(
    { hostname: target.hostname, port: target.port, path: req.url, method: req.method, headers },
    (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); },
  );
  upstream.on("error", () => { res.writeHead(502, { "Content-Type": "application/json" }); res.end(JSON.stringify({ message: "Yuwa website is not running." })); });
  req.pipe(upstream);
};

module.exports = config;
