<template>
  <div
    class="commonTestMode"
    :class="['commonTestMode--' + mode]">
    <div v-if="mode === passingTestMode.CONTROL">
      Контрольный режим
    </div>

    <div v-else-if="mode === passingTestMode.TRAINING">
      Тренировочный режим
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    mode: {type: String, required: true}
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .commonTestMode {
    font-size: 0.875rem;
    padding: 0.65rem 1rem;
    border-radius: 0.5rem;
    display: inline-flex;
  }

  .commonTestMode--control {
    background: $color-blue-light;
  }

  .commonTestMode--training {
    background: #e7ffe5;
  }
</style>
