<template>
  <div
    :class="{'visible': props.visibleIf}"
    class="content-result-info">
    <div
      v-if="props.count > 0"
      class="content-result-info-count">
      Всего {{ props.count }}
    </div>
    <slot name="add-content"/>
    <transition name="transition-fade">
      <div
        v-if="props.resetVisibleIf"
        @click="emit('reset')"
        class="content-result-info-reset">
        <svg-icon name="cross"/>
        <span>Сбросить все</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
const emit = defineEmits(['reset']);
const props = defineProps({
  count: {
    type: Number,
    default: 0
  },
  visibleIf: {
    type: Boolean,
    default: false
  },
  resetVisibleIf: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="scss">
@import '/assets/scss/theme';

.content-result-info {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  font-size: 0.875rem;
  opacity: 0;
  pointer-events: none;
  user-select: none;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
}

.content-result-info-reset {
  cursor: pointer;
  color: $color-dark;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .svg-icon {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    color: $color-blue-normal;
  }
}
</style>
