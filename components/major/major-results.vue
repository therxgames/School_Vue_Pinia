<template>
<div class="results-wrapper">
  <div class="container results">
    <div class="results-tasks">  
      <results-recommended-block content="tasks" :buttonChange="true">
        Рекомендованные задания
      </results-recommended-block>
    </div>
  
    <div class="results-tests">
      <results-recommended-block content="tests" :buttonChange="true">
        Рекомендованные тесты
      </results-recommended-block>
    </div>
  </div>
</div>
</template>

<script setup>

</script>

<style lang="scss">
@import '/assets/scss/theme';

.results {
  &-wrapper {
    margin: 80px 0;
  }
}
</style>
