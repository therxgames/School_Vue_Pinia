<template>
  <div class="d-inline-flex align-items-center gap-1">
    <button class="button-online" @click="emit('click')">Онлайн</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['click']);

const props = defineProps({
  item: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.button-online {
  outline: none;
  background: #21BD4F;
  color: #FFF;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
