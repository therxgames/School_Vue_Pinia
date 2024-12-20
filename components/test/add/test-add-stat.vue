<template>
  <div class="testAddStat">
    <div class="testAddStat-title">
      Всего заданий
    </div>

    <div class="testAddStat-tasksCount">
      {{ tasksCount }}
    </div>

    <div class="testAddStat-footer">
      <div>
        Примерное время выполнения<br> 60 минут <img src="~/assets/images/emoji/4.png">
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    tasksCount: {type: Number, required: true}
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testAddStat {
    border-radius: 1rem;
    border: 1px solid $color-normal;
    padding: 1.5rem;
    width: 295px;
  }

  .testAddStat-title {
    color: $color-dark;
  }

  .testAddStat-tasksCount {
    font-size: 5rem;
    line-height: 1;
  }

  .testAddStat-footer {
    color: $color-dark;
    margin-top: 3.5rem;
    font-size: 0.875rem;

    img {
      width: 1rem;
    }
  }
</style>
