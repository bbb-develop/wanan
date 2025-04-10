const zlib = require('zlib');

const transformBufferToUtf8 = (dataBuffer) => {
  const data = dataBuffer.toString('utf8').replace(/\\/g, '%');
  return data;
};

const onProxyReq = (proxyReq, req) => {
  const data = JSON.stringify(req.body);
  console.log(`[HPM] onProxyReq - ${req.method} ${req.url}, body: ${JSON.stringify(req.body)}`);
  proxyReq.write(data);
};

const onProxyRes = (proxyRes, req) => {
  proxyRes.on('data', (dataBuffer) => {
    if (proxyRes.headers['content-encoding'] === 'gzip') {
      zlib.unzip(dataBuffer, (error, dataBuffer) => {
        if (dataBuffer) {
          console.log(`[HPM] onProxyRes - ${req.method} ${req.url}, body: ${dataBuffer}`);
        }
      })
    } else {
      const data = transformBufferToUtf8(dataBuffer);
      console.log(`[HPM] onProxyRes - ${req.method} ${req.url}, body: ${data}`);
    }
  });
};

module.exports = {
  onProxyReq,
  onProxyRes,
};
