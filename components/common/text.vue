<template>
  <div v-html="text"></div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';
</style>
