<template>
  <div class="major-main">
    <div class="major-main-list">
      <major-main-training />

      <major-main-tests />

      <major-main-create />

      <major-main-chart />
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.major-main {
  max-width: 1040px;
  margin: 0 auto;
  padding: 80px 0;

  &-list {
    display: flex;
    flex-direction: column;
    gap: 120px;
  }

  &-item {
    display: flex;
    justify-content: space-between;
    position: relative;
  }
}
</style>