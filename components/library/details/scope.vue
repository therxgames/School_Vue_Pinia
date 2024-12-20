<template>
  <div class="scope">
    <span>{{ scope }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  scope: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.scope {
  display: flex;
  gap: 0.75rem;
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.75rem;
}
</style>
