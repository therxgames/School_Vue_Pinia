<template>
  <div class="common-columns">
    <slot/>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
  .common-columns {
    display: grid;
    grid-template-columns: 1fr 295px;
    gap: 2rem;
  }

  .common-columns > *:first-child {
    max-width: calc(1280px - 295px - 2rem);
  }
</style>
