<template>
  <div class="details-breadcrumps d-flex align-items-start">
    <a
      class="d-inline-flex link-back align-items-center gap-2"
      href="#"
      @click.prevent="$router.back()"
    >
      <svg-icon name="arrow-left" />
      <span>Назад</span>
    </a>
    <p class="details-breadcrumps-title">Статья</p>
  </div>
</template>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.details-breadcrumps {
  gap: 1.5rem;

  &-title {
    margin-bottom: 0;
    font-size: 0.875rem;
    gap: 0.5rem;
    margin-bottom: 1.125rem;
    color: #7f838a;
  }
}
</style>
