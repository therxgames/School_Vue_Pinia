import httpProxy from 'http-proxy-node16';

export default defineEventHandler(async (event) => {
  await proxyRequest(event);
});

async function proxyRequest(event, proxyName = '__task_img_prx') {
  let resolve = null;
  let promise = new Promise((_resolve) => resolve = _resolve);

  function createProxyServer() {
    const server = httpProxy.createProxyServer({
      target: process.env.API_URL,
      secure: false,
      changeOrigin: true
    });

    const onProxyRes = async (proxyRes, req, res) => {
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
        proxyRes.removeListener('end', onEnd);
        resolve();
        server.removeListener('proxyRes', onProxyRes);
        server.removeListener('error', onError);
        server.close();
      };

      proxyRes.on('end', onEnd);
    };

    const onError = (e) => {
      console.error(Date.now(), '->', proxyName, e);
      server.removeListener('proxyRes', onProxyRes);
      server.removeListener('error', onError);
      server.close();
    };

    server.once('proxyRes', onProxyRes);
    server.once('error', onError);

    return server;
  }

  const server = createProxyServer();

  server.web(event.node.req, event.node.res);
  return promise;
}
