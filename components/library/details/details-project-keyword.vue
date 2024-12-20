<template>
  <div class="project-keyword">
    <button class="project-keyword-button">
      {{ keyword }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  keyword: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.project-keyword {
  &-button {
    border: 1px solid #93979E;
    border-radius: 10px;
    background: transparent;
    padding: 0.25rem 1rem;
    color: #1B59F5;
    font-weight: 500;

    &:hover {
      background: #C5D0FF;
    }
  }
}
</style>
