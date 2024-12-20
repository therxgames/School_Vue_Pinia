<template>
  <div class="banner p-5 pb-4">
    <slot />
  </div>
</template>

<style lang="scss">
  .banner {
    background: linear-gradient(99deg, #6A534C 10.75%, #AA9081 95.34%);
    border-radius: 2rem;

    &-title {
      font-size: 60px;
      line-height: 110%;
      letter-spacing: -1.8px;
    }

    &-content {
      max-width: 768px;

      &:not(:last-child) {
        margin-bottom: 4rem;
      }
    }

    &-text {
      font-size: 18px;
      line-height: 165%;
      letter-spacing: -0.2px;
    }
  }
</style>
