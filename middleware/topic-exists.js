export default defineNuxtRouteMiddleware(async (to, from) => {
  const topicId = to.params.id;
  try {
    await useApi(`/api/topics/${topicId}/name`, {...methodGet});
  } catch (e) {
    return createError({statusCode: 404});
  }
});
