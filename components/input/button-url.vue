<template>
  <div class="flex items-center gap-2">
    <a target="_blank" :href="url" class="d-flex align-items-center gap-2">
      <slot />

      <svg-icon name="link" class="btn-url" />
    </a>
  </div>
</template>
  
<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
  },
});
</script>
  
<style lang="scss">
@import '/assets/scss/theme';

.btn-url {
  width: 16px;
  height: 16px;
}
</style>
  