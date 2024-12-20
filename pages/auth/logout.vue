<template>
  <div class="auth-etd-logout">
    <loader
      :listener="true"
      class="auth-etd-logout-loader"/>
  </div>
</template>

<script setup>
  import {useSessionStorage} from '@vueuse/core';

  definePageMeta({
    middleware: ['auth']
  });

  onMounted(async () => {
    useSessionStorage('etd-token', {invoked: 0}).value.invoked = 0;
    location.href = '/api/auth/logout';
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .auth-etd-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    &-loader {
      z-index: 10;
    }
  }
</style>
