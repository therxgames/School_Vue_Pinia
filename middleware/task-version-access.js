import useUserStore from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const taskId = to.params.id;
  await useUserStore().saveFetch();

  if (useUserStore().userIsAdmin || useUserStore().userIsCOSUser) {
    return;
  }

  try {
    const response = await useApi(`/api/task/${taskId}/has_answers`, {...methodGet});
    const {has_answers, status_id} = response.data.data;

    if (
      (useUserStore().userIsStudent && status_id !== publishStatus.PUBLISH && !has_answers)
      || (!useUserStore().logged && status_id !== publishStatus.PUBLISH)
    ) {
      return createError({statusCode: 403});
    }
  } catch (e) {
    return createError({statusCode: 403});
  }
});
