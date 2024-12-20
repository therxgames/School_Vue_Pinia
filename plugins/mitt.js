export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide('$mitt', eventBus);
});
