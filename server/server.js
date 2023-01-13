const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');

const { onProxyReq, onProxyRes } = require('./proxy');

const apiUrl = 'https://newapi.goodnight.io';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(cookieParser());

const PORT = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, '../build')));

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT);
