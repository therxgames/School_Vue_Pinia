<template>
  <div class="commonCounter">
    <span class="commonCounter-num">{{ num }}</span>
    <span class="commonCounter-slash">/</span>
    <span class="commonCounter-total">{{ total }}</span>
  </div>
</template>

<script setup>
  const props = defineProps({
    num: {type: Number, required: true},
    total: {type: Number, required: true}
  });
</script>

<style lang="scss">
  .commonCounter {
    display: flex;
    align-items: center;
  }

  .commonCounter-num {
    font-size: 80px;
    margin-right: 4px;
    line-height: 1;
  }

  .commonCounter-slash {
    font-size: 24px;
    margin-top: -34px;
  }

  .commonCounter-total {
    font-size: 24px;
    margin-left: 4px;
    margin-top: -29px;
  }
</style>
