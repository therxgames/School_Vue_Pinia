<template>
  <div class="topic-results-summary">
    <div class="topic-results-summary-correct">
      {{ correctAnswers.length }} верно
    </div>

    <div class="topic-results-summary-errors">
      {{ wrongAnswers.length }} {{ declension(wrongAnswers.length, ['ошибка', 'ошибки', 'ошибок']) }}
    </div>

    <div class="topic-results-summary-total">
      Вы ответили на {{ answers.length }} из {{ tasks.length }} {{ answersText }}
      <br>
      Время выполнения: {{ timeText }}
    </div>

    <a
      href="#"
      class="topic-results-summary-backBtn btn btn-simple"
      @click.prevent="emit('back')">
      Вернуться к заданиям
    </a>
  </div>
</template>

<script setup>
  const props = defineProps({
    tasks: {type: Array, required: true},
    answers: {type: Array, required: true},
    time: {type: Number, required: true}
  });

  const emit = defineEmits(['back']);

  const correctAnswers = computed(() => {
    return props.answers.filter((answer) => answer.result === 'correct');
  });

  const wrongAnswers = computed(() => {
    return props.answers.filter((answer) => answer.result === 'wrong');
  });

  const timeText = computed(() => {
    if (props.time) {
      const seconds = Math.round(props.time / 1000);

      return Math.floor(seconds / 60).toString().padStart(2, '0')
        + ':'
        + (seconds % 60).toString().padStart(2, '0');
    } else {
      return '00:00';
    }
  });

  const answersText = computed(() => {
    const num = props.tasks.length.toString();

    if (num[num.length - 1] === '1') {
      return 'вопроса';
    } else {
      return 'вопросов';
    }
  });
</script>

<style lang="scss">
  .topic-results-summary {
    position: relative;
    background-color: #e6f2ff;
    padding: 2.5rem;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
  }

  .topic-results-summary-correct {
    font-size: 64px;
    line-height: 1;
  }

  .topic-results-summary-errors {
    font-size: 22px;
    margin-top: 0.5rem;
  }

  .topic-results-summary-total {
    color: #3d4450;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .topic-results-summary-backBtn {
    --bs-btn-padding-x: 1.5rem;

    position: absolute;
    top: 2.5rem;
    right: 2.5rem;
  }
</style>
