<template>
  <div
    :class="'commonTestScore--' + mark"
    class="commonTestScore">
    {{ score }}
  </div>
</template>

<script setup>
  const props = defineProps({
    mark: {type: String, required: true},
    score: {type: Number, required: true}
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .commonTestScore {
    font-size: 5rem;
    line-height: 1;
    letter-spacing: -5px;

    &::after {
      content: '%';
      font-size: 2.5rem;
      margin-left: 0.5rem;
    }
  }

  .commonTestScore--f {
    color: #f87342;
  }

  .commonTestScore--c {
    color: $color-yellow-normal;
  }

  .commonTestScore--a {
    color: $color-green-normal;
  }
</style>
