<template>
  <div class="ac-task-answers-history-order">
    <div
      v-for="(answerItem, index) in content"
      :key="index"
      :class="`ac-task-answers-history-order-item--${answerItem.correct?'correct':'wrong'}`"
      class="ac-task-answers-history-order-item">
      <svg-icon
        :class="iconClass(answerItem.correct)"
        :name="iconName(answerItem.correct)"/>
      <span
        class="ac-task-answers-history-order-item-name"
        v-html="answerItem.name"/>
    </div>
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
    const variant = props.task.variants?.find((variant) => variant.value === id);

    return {
      name: variant.text,
      correct: rightTaskAnswers.value[idx] === variant.value
    };
  }));

  const iconClass = (correct) => correct ? 'correct' : 'error';

  const iconName = (correct) => correct ? 'check-tint' : 'cross-tint';
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history-order {
    margin-top: -0.1rem;

    &-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.3rem 0;

      svg {
        transform: scale(0.6);
      }

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        border: none;
        margin-bottom: 1rem;
      }

      &-id {
        color: $color-dark;
      }

      &-res-icon {
        width: 0.6rem;
      }

      &-name {
        max-width: calc(100% - 2rem);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-item--correct {
      color: $color-green-dark;
    }

    &-item--wrong {
      color: $color-red-dark;
    }
  }
</style>
