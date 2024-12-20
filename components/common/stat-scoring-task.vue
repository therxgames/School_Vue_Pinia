<template>
  <div class="commonStatScoringTask">
    <div class="commonStatScoringTask-title">
      Всего баллов
    </div>

    <common-counter
      v-if="typeof maxScore === 'number'"
      :num="scoringTask.score"
      :total="maxScore"/>

    <div
      v-if="isParsed"
      class="commonStatScoringTask-details mt-5">
      Выбрано {{ selectedCriterias }} критериев из {{ criteriasCount }}
    </div>

    <div class="commonStatScoringTask-controls">
      <div
        v-if="typeof scoringTask.nextNum === 'number'"
        class="commonStatScoringTask-nextBtn btn btn-primary"
        @click="emit('score-task', scoringTask.nextNum)">
        К следующему заданию
      </div>

      <div
        class="commonStatScoringTask-returnBtn btn btn-primary"
        @click="emit('return-to-tasks')">
        Ко всем заданиям
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    scoringTask: {type: Object, required: true},
    answer: {type: Object, required: true}
  });

  const emit = defineEmits(['score-task', 'return-to-tasks']);

  const groups = computed(() => {
    return getCriteriaGroups(props.scoringTask.task, props.answer?.answer?.variant);
  });

  const maxScore = computed(() => {
    return groups.value ? groups.value.reduce((acc, group) => acc + group.maxScore, 0) : 0;
  });

  const isParsed = computed(() => {
    return Array.isArray(props.scoringTask.task.criteria);
  });

  const selectedCriterias = computed(() => {
    return props.scoringTask.answer.answer.scores
      ? Object.keys(props.scoringTask.answer.answer.scores).length
      : 0;
  });

  const criteriasCount = computed(() => {
    return groups.value ? groups.value.reduce((acc, group) => acc + group.list.length, 0) : 0;
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .commonStatScoringTask-title {
    color: $color-dark;
  }

  .commonStatScoringTask-details {
    margin-top: 3rem;
  }

  .commonStatScoringTask-controls {
    color: $color-dark;
    margin-top: 1rem;
  }

  .commonStatScoringTask-nextBtn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .commonStatScoringTask-returnBtn {
    width: 100%;
  }
</style>
