export default defineNuxtRouteMiddleware(async (to, from) => {
  const testId = to.params.id;

  try {
    const response = await useApi(`/api/test/${testId}/ownership`);

    const testCanBeAdded = response.data.done
      && response.data.test.type === 'usertest'
      && !response.data.test.is_mine
      && !response.data.test.in_collection
      && !response.data.test.in_ownership_archive;

    if (!testCanBeAdded) {
      return createError({statusCode: 403});
    }
  } catch (e) {
    return createError({statusCode: 403});
  }
});
