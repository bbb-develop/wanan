const session = require("express-session");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { onProxyReq, onProxyRes } = require("../server/proxy");
const { check } = require("../server/check");

const apiUrl = "https://newapi.goodnight.io";

function isAuthenticated(req, res, next) {
  console.log(req.session);
  if (req.session.user) next();
  else {
    return res.status(403).json({ message: "Auth fail." });
  }
}

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(
    session({
      secret: "s3Cur3",
      name: "b_sessionId",
    })
  );

  app.post("/api/login", (req, res) => {
    const users = [
      {
        name: "admin",
        password: "Aa@12345678",
      },
    ];
    const { name, password } = req.body;

    for (let user of users) {
      if (user.name === name && user.password === password) {
        req.session.user = user.name;
        return res.status(200).json({ name });
      }
    }
    return res.status(400).json({ error: "Login fail." });
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("b_sessionId");
    res.status(204).end();
  });

  app.use(
    "/api/rooms",
    isAuthenticated,
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: "https",
      onProxyReq,
      onProxyRes,
    })
  );
  app.use(
    "/api/rooms/:roomId/message",
    isAuthenticated,
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: "https",
      onProxyReq,
      onProxyRes,
    })
  );
  app.use(
    "/api/room/histories",
    isAuthenticated,
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        "^/api/room/histories": "/mobileapi/room/histories",
      },
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: "https",
      onProxyReq,
      onProxyRes,
    })
  );
  app.use(
    "/api",
    isAuthenticated,
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: "https",
      onProxyReq,
      onProxyRes,
    })
  );

  app.get("/rdm/check", async (req, res) => {
    const type = req.query.type;

    if (type === "on" || type === "dismiss") {
      res.setHeader("Content-Type", "image/png");
      const screenshot = await check(type);
      res.send(screenshot);
    }

    res.status(400).json({ message: "Invalid type." });
  });

  app.get("/health", (req, res) => {
    res.status(204);
  });
};
