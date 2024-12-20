export default defineEventHandler(async (event) => {
  const prefix = process.env.NODE_ENV === 'development'
    ? 'db:'
    : 'redis:';

  switch (event.node.req.method) {
    case 'GET': {
      try {
        const {key} = getQuery(event);
        const data = await useStorage().getItem(prefix + key);
        return {
          data: {
            done: true,
            data
          }
        };
      } catch (e) {
        console.error(e.message);
        break;
      }
    }
    case 'POST': {
      try {
        const {key, data} = await readBody(event);
        await useStorage().setItem(prefix + key, data);
        return {
          data: {
            done: true
          }
        };
      } catch (e) {
        console.error(e.message);
        break;
      }
    }
    default: {
      throw createError({statusCode: 405});
    }
  }
});
