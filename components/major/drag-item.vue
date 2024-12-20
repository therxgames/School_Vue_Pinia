<template>
  <div class="drag-item" @mousemove="emit('mousemove', $event.target)" ref="dragItemRef">
    <div class="drag-item-circles">
      <span v-for="i in 8" class="drag-item-circles-item" :style="{background: color}" />
    </div>

    <div class="drag-item-title">
      <p :style="{color}">{{ title }}</p>
    </div>
  </div>
</template>

<script setup>
const dragItemRef = ref(null);
const emit = defineEmits(['mousemove']);

const props = defineProps({
  countCircles: {
    type: Number,
  },
  title: {
    type: String,
  },
  color: {
    type: String,
    default: "#000",
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.drag-item {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #FFF;
  padding: 12px 24px 12px 20px;
  border-radius: 16px;
  transition: all 0.2s linear 0s;
  position: absolute;
  width: fit-content;
  height: fit-content;

  &-circles {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 4px;
    width: 8px;

    &-item {
      display: block;
      width: 2px;
      height: 2px;
      border-radius: 50%;
    }
  }

  &-title {
    p {
      font-size: 18px;
      font-weight: 500;
      line-height: 30px;
      margin-bottom: 0;
    }
  } 
}
</style>