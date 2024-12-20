import httpProxy from 'http-proxy-node16';

export default defineEventHandler(async (event) => {
  await proxyRequest(event);
});

async function proxyRequest(event) {
  return new Promise((resolve, reject) => {
    const server = httpProxy.createProxyServer({
      target: process.env.API_URL,
      secure: false,
      changeOrigin: true
    });

    const onProxyRes = (proxyRes, req, res) => {
      const cleanup = (err) => {
        proxyRes.removeListener('error', cleanup);
        proxyRes.removeListener('close', cleanup);
        res.removeListener('error', cleanup);
        res.removeListener('close', cleanup);

        req.destroy(err);
        proxyRes.destroy(err);
      };

      proxyRes.once('error', cleanup);
      proxyRes.once('close', cleanup);
      res.once('error', cleanup);
      res.once('close', cleanup);

      const onEnd = () => {
        res.end();
        proxyRes.removeListener('end', onEnd);
        server.removeListener('proxyRes', onProxyRes);
        server.removeListener('error', onError);
        server.close();
        resolve();
      };

      proxyRes.on('end', onEnd);
    };

    const onError = () => {
      res.end();
      server.removeListener('proxyRes', onProxyRes);
      server.removeListener('error', onError);
      server.close();
      reject();
    };

    server.once('proxyRes', onProxyRes);
    server.once('error', onError);
    server.web(event.node.req, event.node.res);
  });
}
