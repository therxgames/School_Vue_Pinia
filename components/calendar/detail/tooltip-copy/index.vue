<template>
  <div class="tooltip-copy">
    <calendar-detail-tooltip-copy-item v-for="i in countItems" :show="true" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  countItems: {
    type: Number,
		required: false,
  }
});
</script>

<style lang="scss" scoped>
.tooltip-copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: fixed;
  left: 20px;
  bottom: 20px;
}
</style>
  