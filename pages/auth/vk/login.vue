<template>
  <div class="auth-vk-login">
    <loader
      :listener="!error.code"
      class="auth-etd-login-loader"/>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import {Config, Connect} from '@vkontakte/superappkit';

  const error = ref({code: 0, text: ''});

  onMounted(async () => {
    if (useUserStore().logged) {
      return useRouter().replace('/');
    }

    Config.init({
      appId: +useRuntimeConfig().public.VK_APP_ID,
      appSettings: {
        agreements: '',
        promo: '',
        vkc_behavior: '',
        vkc_auth_action: '',
        vkc_brand: '',
        vkc_display_mode: ''
      }
    });

    localStorage.setItem('vk-auth-attempt', new Date().getTime().toString());
    await sleep(500);

    Connect.redirectAuth({
      url: `${useRuntimeConfig().public.SITE_URL}/auth/vk/return`,
      state: '',
      source: '',
      action: undefined,
      screen: undefined
    });
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .auth-vk-login {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    &-loader {
      z-index: 10;
    }
  }
</style>
