<template>
  <div class="auth-etd-login">
    <loader
      :listener="!error.code"
      class="auth-etd-login-loader"/>
    <div
      v-if="error.code"
      class="auth-etd-login-error-panel">
      <div class="auth-etd-login-error-panel-header">
        Произошла ошибка авторизации
      </div>
      <div
        class="auth-etd-login-error-panel-desc"
        v-if="error.text">
        {{ error.text }}
      </div>
      <div class="auth-etd-login-error-panel-actions">
        <nuxt-link
          to="/"
          class="btn btn-primary auth-etd-login-error-panel-btn">
          <span>Вернуться на главную</span>
        </nuxt-link>
        <nuxt-link
          to="/support/login"
          class="btn btn-primary btn-simple auth-etd-login-error-panel-btn">
          <span>Обращение в поддержку</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const error = ref({code: 0, text: ''});

  onMounted(async () => {
    if (useUserStore().logged) {
      return useRouter().replace('/');
    }

    const authLink = await useUserStore().fetchAuthLink();

    if (authLink) {
      localStorage.setItem('etd-auth-attempt', new Date().getTime().toString());
      location.href = authLink;
    } else {
      error.value.code = 100;
      error.value.text = 'Сервер вернул пустой ответ';
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .auth-etd-login {
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
