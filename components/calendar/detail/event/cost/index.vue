<template>
  <p class="cost mb-0">{{ cost.toLocaleString('ru') }} ₽</p>
</template>

<script setup lang="ts">
const props = defineProps({
  cost: {
    type: Number,
  },
});
</script>

<style lang="scss" scoped>
.cost {
  font-size: 60px;
  line-height: 60px;
}
</style>
  