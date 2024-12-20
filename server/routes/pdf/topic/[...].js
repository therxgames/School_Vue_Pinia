export default defineEventHandler(async (event) => {
  const url = new URL(process.env.SITE_URL + event.node.req.url);
  const idMatch = url.pathname.match(/\/(\d+)\/?$/);

  if (!idMatch) {
    return;
  }

  const id = idMatch[1];
  const tasks = url.searchParams.get('tasks');
  const selectedTasks = tasks ? tasks.split(',') : [];

  event.node.res.setHeader('Content-Type', 'application/pdf');
  return await printTopic(id, selectedTasks);
});
