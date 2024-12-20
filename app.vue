<template>
  <coming-soon v-if="useRuntimeConfig().public.COMING_SOON"/>
  <div
    v-else
    :class="[`app-section-${route.name}`]">
    <app-loading-indicator/>
    <helper-dev-panel v-if="!useRuntimeConfig().public.PRODUCTION"/>
    <helper-toast-container ref="toastHelper"/>
    <helper-alert-container ref="alertHelper"/>
    <nuxt-page/>
    <loader
      :main-loader="true"
      :listener="loaderListener"
      class="app-loader"/>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const route = useRoute();
  const toastHelper = ref(null);
  const alertHelper = ref(null);
  const loaderListener = ref(false);
  let blured = false;

  const onWindowFocus = () => {
    if (blured) {
      localServer.load();
    }

    blured = false;
  };

  const onWindowBlur = () => {
    blured = true;
  };

  onMounted(() => {
    useUserStore().refreshEtdTokenWorker();
    localServer.load();
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('blur', onWindowBlur);
    registerServiceWorker();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('focus', onWindowFocus);
    window.removeEventListener('blur', onWindowBlur);
  });

  const registerServiceWorker = () => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  await useAsyncData('user', () => Promise.all([
    useUserStore().saveFetch()
  ]));
</script>
