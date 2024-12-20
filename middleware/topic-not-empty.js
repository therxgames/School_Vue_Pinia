export default defineNuxtRouteMiddleware(async (to, from) => {
  const topicId = to.params.id;
  try {
    const response = await useApi(`/api/topics/${topicId}/tasks_count`, {...methodGet});
    if (response.data.done && response.data.tasks_count === 0) {
      return createError({statusCode: 404});
    }
  } catch (e) {
    return createError({statusCode: 404});
  }
});
