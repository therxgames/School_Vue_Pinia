export default defineEventHandler(async (event) => {
  const url = new URL(process.env.SITE_URL + event.node.req.url);
  const idMatch = url.pathname.match(/\/(\d+)\/?$/);

  if (!idMatch) {
    return;
  }

  const id = idMatch[1];
  const withCorrectAnswer = url.searchParams.get('with-correct-answer') === 'true';

  event.node.res.setHeader('Content-Type', 'application/pdf');
  return await printTask(id, withCorrectAnswer);
});
