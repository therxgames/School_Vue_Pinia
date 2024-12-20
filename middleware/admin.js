import useUserStore from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await useUserStore().saveFetch();

  if (useUserStore().currentRole !== 'admin') {
    return createError({statusCode: 403});
  }
});
