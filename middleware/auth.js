import useUserStore from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await useUserStore().saveFetch();

  if (!useUserStore().logged) {
    return createError({statusCode: 403});
  }
});
