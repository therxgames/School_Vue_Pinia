<template>
  <div class="ac-task-answers-history-gap-match-text">
    <span
      v-for="(answerItem, index) in content"
      :key="index"
      :class="`ac-task-answers-history-gap-match-text-item--${answerItem.correct?'correct':'wrong'}`"
      class="ac-task-answers-history-gap-match-text-item"
      v-html="answerItem.name"/>
  </div>
</template>

<script setup>
  const props = defineProps({
    task: {
      type: Object,
      default() {
        return {};
      }
    },
    answer: {
      type: Object,
      default() {
        return {};
      }
    }
  });

  const rightTaskAnswers = computed(() => {
    try {
      return JSON.parse(props.task.answer);
    } catch (e) {}
  });

  const content = computed(() => props.answer.answer.map((id, idx) => {
    if (id === '0') {
      return {
        name: ' [&nbsp;] ',
        correct: rightTaskAnswers.value[idx] === '0'
      };
    }

    const variant = props.task.variants?.find((variant) => variant.value === id);

    return {
      name: variant?.text ? variant?.text+' ' : ' [&nbsp;] ',
      correct: rightTaskAnswers.value[idx] === variant?.value
    };
  }));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history-gap-match-text {
    margin-top: -0.1rem;

    &-item {
      padding: 0.3rem;
    }

    &-item--correct {
      color: $color-green-dark;
    }

    &-item--wrong {
      color: $color-red-dark;
    }
  }
</style>
