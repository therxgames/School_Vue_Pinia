export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:beforeMount', async () => {
    await preloadComponents([
      'CommonTaskTile',
      'CommonTestTile',
      'CommonTaskRow',
      'CommonTestRow',
      'InputCheckbox',
      'InputRadio'
    ]);
  });
});
