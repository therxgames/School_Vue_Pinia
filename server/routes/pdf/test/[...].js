export default defineEventHandler(async (event) => {
  const url = new URL(process.env.SITE_URL + event.node.req.url);
  const idMatch = url.pathname.match(/\/(\d+)\/?$/);

  if (!idMatch) {
    return;
  }

  const id = idMatch[1];
  const body = await readBody(event);

  event.node.res.setHeader('Content-Type', 'application/pdf');
  return await printTest(id, body);
});
