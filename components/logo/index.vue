<template>
  <div class="logo d-flex align-items-center">
    <div class="logo-bg d-flex justify-content-center align-items-center c-white">
      <svg-icon class="logo-main" name="logo" />
    </div>
    <svg-icon class="logo-text__icon" name="logo-text" />
  </div>
</template>

<style lang="scss" scoped>
.logo {
  &:hover {
    .logo-bg {
      background-image: radial-gradient(116.18% 116.18% at 19.05% 83.33%, #FF658A 0%, #6212CB 100%);
    }
  }
  &-main {
    width: 1.5rem;
    height: 1.5rem;
  }

  &-text__icon {
    width: 5.938rem;
    height: 2.875rem;
    margin-left: 0.75rem;
  }

  &-bg {
    width: 2.375rem;
    height: 2.375rem;
    background-image: linear-gradient(90deg, #232526 0%, #414345 100%);
    border-radius: 0.563rem;
  }
}
</style>
