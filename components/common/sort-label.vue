<template>
  <span
    class="sort-label admin-link p-0"
    @click="emit('sort')">
    {{ title }}
    <button
      :class="{'asc': dir === 1, 'desc': dir === 2}">
      <svg-icon name="sort"/>
    </button>
  </span>
</template>

<script setup>
  const emit = defineEmits(['sort']);
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    dir: {
      type: Number,
      default: 0
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .sort-label {
    cursor: pointer;
    color: $color-dark;
    font-size: 14px;
    user-select: none;

    button {
      border: none;
      background-color: unset;
      font-size: 11px;
      vertical-align: middle;

      .sort-arrow-bottom,
      .sort-arrow-top {
        fill: $color-normal;
        transition: 0.2s fill;
      }

      &.asc {
        .sort-arrow-bottom {
          fill: $color-black;
        }
      }

      &.desc {
        .sort-arrow-top {
          fill: $color-black;
        }
      }
    }
  }
</style>
