<template>
  <div class="details-image">
    <img :src="url" class="details-image-img" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.details-image {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  border-radius: 1rem;

  &-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
