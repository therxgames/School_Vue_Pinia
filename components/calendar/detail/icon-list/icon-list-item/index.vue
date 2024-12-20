<template>
  <div class="d-flex align-items-start gap-3">
    <svg-icon :name="iconName" :fill="iconFill" class="flex-shrink-0" />

    <div class="flex-grow-1">
      <slot />
    </div>
  </div>
</template>
  
<script setup>

const props = defineProps({
  iconName: {
    type: String,
  },
  iconFill: {
    type: String,
  },
});
</script>

<style lang="scss" scoped></style>
