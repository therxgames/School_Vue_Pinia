<template>
  <div class="ac-login-attempt">
    <div class="ac-login-attempt-desc">
      Для перехода в раздел пожалуйста войдите в свою <b>учетную запись</b>
    </div>
    <nuxt-link
      to="/auth/etd/login"
      @click="loginWithEtd()"
      class="dropdown-item mt-4">
      <div class="app-header-user-profile-login-mtd">
        <svg-icon
          class="icon"
          name="ms"/>
        Вход через Мою школу
      </div>
    </nuxt-link>
    <nuxt-link
      to="/auth/vk/login"
      @click="loginWithVk()"
      class="dropdown-item mt-2">
      <div class="app-header-user-profile-login-mtd">
        <svg-icon
          class="icon"
          name="vk-sq"/>
        Вход через VK
      </div>
    </nuxt-link>
  </div>
</template>

<script setup>
  const props = defineProps(alertContentProps());
  const router = useRouter();

  const loginWithEtd = () => {
    props.context.hide();
    router.push('/auth/etd/login');
  };
  const loginWithVk = () => {
    props.context.hide();
    router.push('/auth/vk/login');
  };
</script>

<style lang="scss">
  .ac-login-attempt {
    &-desc {
      b {
        font-weight: 500;
      }
    }
  }
</style>
