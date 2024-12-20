export default defineNuxtRouteMiddleware(async (to, from) => {
  const taskId = to.params.id;
  try {
    await useApi(`/api/task/${taskId}/name`, {...methodGet});
  } catch (e) {
    return createError({statusCode: 404});
  }
});
