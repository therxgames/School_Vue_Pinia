export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:beforeMount', () => {
    window.requestIdleCallback
      = window.requestIdleCallback
      || function(handler) {
        const start = Date.now();
        return setTimeout(() => {
          handler({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
          });
        }, 1);
      };

    nuxtApp.vueApp.provide('$idle', window.requestIdleCallback);
  });
});
