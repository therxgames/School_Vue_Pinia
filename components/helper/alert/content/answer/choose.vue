<template>
  <div class="ac-task-answers-history-choose">
    <div
      v-for="(answerItem, index) in content"
      :key="index"
      :class="['ac-task-answers-history-choose-item--' + answerItem.result()]"
      class="ac-task-answers-history-choose-item">
      <svg-icon
        v-if="answerItem.result() === answerResult.CORRECT"
        class="ac-task-answers-history-choose-item-res-icon"
        name="check-tint"/>
      <svg-icon
        v-if="answerItem.result() === answerResult.WRONG"
        class="ac-task-answers-history-choose-item-res-icon"
        name="cross-tint"/>
      <span
        :title="answerItem.name"
        class="ac-task-answers-history-choose-item-name"
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
    } catch (e) {
      console.log(e);
    }
  });
  const content = computed(() => {
    const content = [];

    for (const id of props.answer.answer) {
      const name = props.task.variants?.find((variant) => +variant.value === +id);
      content.push({
        id,
        name: name?.text,
        result() {
          return rightTaskAnswers.value?.includes(id)
            ? answerResult.CORRECT
            : answerResult.WRONG;
        }
      });
    }

    return content;
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history-choose {
    margin-top: -0.1rem;

    &-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid #f4f4f4;
      padding: 0.3rem 0;

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
        margin-top: 0.15rem;
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
