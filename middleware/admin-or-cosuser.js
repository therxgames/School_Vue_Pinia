import useUserStore from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  await useUserStore().saveFetch();

  if (!(useUserStore().userIsAdmin || useUserStore().userIsCOSUser)) {
    return createError({statusCode: 403});
  }
});
