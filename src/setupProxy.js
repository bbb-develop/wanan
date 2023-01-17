const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { onProxyReq, onProxyRes } = require('../server/proxy');

const apiUrl = 'https://newapi.goodnight.io';

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(
    '/api/rooms',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: 'https',
      onProxyReq,
      onProxyRes,
    })
  );
  app.use(
    '/api/rooms/:roomId/message',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: 'https',
      onProxyReq,
      onProxyRes,
    })
  );
  app.use(
    '/api/room/histories',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/room/histories': '/mobileapi/room/histories',
      },
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: 'https',
      onProxyReq,
      onProxyRes,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      autoRewrite: true, // rewrite redirect host
      protocolRewrite: 'https',
      onProxyReq,
      onProxyRes,
    })
  );
};
