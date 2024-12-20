<template>
  <div 
    class="main-item" 
    :class="{'flex-row-reverse': colReverse}">
    <slot/>
  </div>
</template>

<script setup>
const props = defineProps({
  colReverse: {
    type: Boolean,
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.main-item {
  display: flex;
  justify-content: space-between;
  position: relative;
}
</style>