<template>
  <div class="auth-etd-return">
    <loader
      :listener="!error.code"
      class="auth-etd-return-loader"/>
    <div
      v-if="error.code"
      class="auth-etd-return-error-panel">
      <div class="auth-etd-return-error-panel-header">
        Произошла ошибка авторизации
      </div>
      <div
        class="auth-etd-return-error-panel-desc"
        v-if="error.text">
        {{ error.text }}
      </div>
      <div class="auth-etd-return-error-panel-actions">
        <nuxt-link
          to="/"
          class="btn btn-primary auth-etd-return-error-panel-btn">
          <span>Вернуться на главную</span>
        </nuxt-link>
        <nuxt-link
          to="/support/login"
          class="btn btn-primary btn-simple auth-etd-return-error-panel-btn">
          <span>Обращение в поддержку</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const userStore = useUserStore();
  const route = useRoute();
  const error = ref({code: 0, text: ''});

  onMounted(async () => {
    try {
      const response = await userStore.loginWithEtd(route.query.code, route.query.state);

      if (response?.data?.done) {
        location.href = '/';
      } else {
        error.value.code = 110;
        error.value.text = response?.data?.error || 'Внутренняя ошибка';
      }
    } catch (e) {
      error.value.code = 100;
      error.value.text = '';
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .auth-etd-return {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    &-loader {
      z-index: 10;
    }

    &-error-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;

      &-header {
        font-weight: 500;
      }

      &-desc {
        color: $color-dark;
      }

      &-actions {
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
    }
  }
</style>
