export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:beforeMount', async () => {
    nuxtApp.vueApp.provide('$popper', await import('@popperjs/core'));
  });
});
