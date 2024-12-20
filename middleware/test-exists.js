export default defineNuxtRouteMiddleware(async (to, from) => {
  const testId = to.params.id;
  try {
    await useApi(`/api/test/${testId}/name`, {...methodGet});
  } catch (e) {
    return createError({statusCode: 404});
  }
});
