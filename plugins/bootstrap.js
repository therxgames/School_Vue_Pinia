export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:beforeMount', async () => {
    window.$bootstrap = await import('bootstrap/dist/js/bootstrap.esm.min');
    nuxtApp.vueApp.provide('$bootstrap', window.$bootstrap);
  });
});
