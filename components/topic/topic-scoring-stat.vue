<template>
  <div class="topic-scoring-stat">
    <div v-if="!scoringTask">
      <div class="topic-scoring-stat-title">
        Прохождение завершено
      </div>
      <div>Для подведения итогов осталось оценить задания с развернутым ответом.</div>

      <common-stat-scoring
        :free-answer-tasks="freeAnswerTasks"
        :show-save-and-send-btn="false"
        @score-task="emit('score-task', $event)"
        @save="emit('save')"/>
    </div>

    <common-stat-scoring-task
      v-else
      :scoring-task="scoringTask"
      :answer="scoringTask.answer"
      @score-task="emit('score-task', $event)"
      @return-to-tasks="emit('return-to-tasks')"/>
  </div>
</template>

<script setup>
  const props = defineProps({
    freeAnswerTasks: {type: Array, required: true},
    scoringTask: {type: Object, default: null}
  });

  const emit = defineEmits(['score-task', 'return-to-tasks', 'save']);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .topic-scoring-stat {
    border-radius: 1rem;
    border: 1px solid $color-normal;
    padding: 1.5rem;
    width: 295px;
    margin-bottom: 2rem;
  }

  .topic-scoring-stat-title {
    color: $color-dark;
  }
</style>
