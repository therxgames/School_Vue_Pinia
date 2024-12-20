<template>
  <div class="auth-vk-return">
    <loader
      :listener="!error.code"
      class="auth-vk-return-loader"/>
    <div
      v-if="error.code"
      class="auth-vk-return-error-panel">
      <div class="auth-vk-return-error-panel-header">
        Произошла ошибка авторизации
      </div>
      <div
        class="auth-vk-return-error-panel-desc"
        v-if="error.text">
        {{ error.text }}
      </div>
      <div class="auth-vk-return-error-panel-actions">
        <nuxt-link
          to="/"
          class="btn btn-primary auth-vk-return-error-panel-btn">
          <span>Вернуться на главную</span>
        </nuxt-link>
        <nuxt-link
          to="/support/login"
          class="btn btn-primary btn-simple auth-vk-return-error-panel-btn">
          <span>Обращение в поддержку</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const error = ref({code: 0, text: ''});
  const payload = computed(() => {
    try {
      return JSON.parse(useRoute().query.payload.toString());
    } catch (e) {
      return null;
    }
  });

  onMounted(async () => {
    if (!payload.value || !payload.value?.uuid || !payload.value?.token) {
      error.value.code = 100;
      error.value.text = 'Сервер вернул пустой ответ';
      return;
    }

    const response = await useUserStore().loginWithVk({
      silentToken: payload.value.token,
      uuid: payload.value.uuid
    });

    if (response?.data?.done) {
      await useUserStore().fetch();
      await setUserSetting('user.login.credentials', {
        first_name: payload.value.user.first_name,
        last_name: payload.value.user.last_name
      });
      location.href = '/';
    } else {
      error.value.code = 200;
      error.value.text = response?.data?.error || 'Неизвестная ошибка';
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .auth-vk-return {
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
