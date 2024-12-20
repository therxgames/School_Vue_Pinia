<template>
  <span class="link-tag fw-normal c-white d-inline-flex align-items-center">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.link-tag {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  line-height: 160%;
  padding: 5px 20px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
}
</style>
