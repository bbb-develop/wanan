const express = require('express');
const session = require('express-session');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');

const { onProxyReq, onProxyRes } = require('./proxy');

const apiUrl = 'https://newapi.goodnight.io';

function isAuthenticated (req, res, next) {
  if (req.session.user) next();
  else {
    return res.status(403).json({ message: 'Auth fail.'});
  }
};

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(session({
  secret : 's3Cur3',
  name : 'b_sessionId',
 })
);

const PORT = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, '../build')));

app.post('/api/login', (req, res) => {
  const users = [
    {
      name: 'admin',
      password: 'Aa@12345678'
    },
  ]
  const { name, password } = req.body;

  for (let user of users) {
    if (user.name === name && user.password === password) {
      req.session.user = user.name;
      return res.status(200).json({ name });
    }
  }
  return res.status(400).json({ error: 'Login fail.' });
 });


 app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('b_sessionId');
  res.status(204).end();
 })

app.use(
  '/api/rooms',
  isAuthenticated,
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
  isAuthenticated,
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
  isAuthenticated,
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
  isAuthenticated,
  createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    autoRewrite: true, // rewrite redirect host
    protocolRewrite: 'https',
    onProxyReq,
    onProxyRes,
  })
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
});

