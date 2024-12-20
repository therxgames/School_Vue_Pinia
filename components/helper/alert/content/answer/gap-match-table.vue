<template>
  <div class="ac-task-answers-history-gap-match-table">
    <span
      v-for="(answerItem, index) in historyContent"
      :key="index"
      :class="`ac-task-answers-history-gap-match-table-item--${answerItem.correct?'correct':'wrong'}`"
      class="ac-task-answers-history-gap-match-table-item"
      v-html="answerItem.text"/>
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

  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const rightTaskAnswers = computed(() => {
    try {
      return JSON.parse(props.task.answer);
    } catch (e) {}
  });

  const validate = (text) => {
    const REG = /\sMathType@MTEF.*@\s/g;
    const regImg = /<img/gi;
    while (REG.test(text)) {
      text = text.replace(REG, '');
    }
    if (regImg.test(text)) {
      text = '';
    }
    return text;
  };

  const historyContent = computed(() => {
    const content = props.answer.answer?.map(([val, target], idx) => {
      return {
        text: validate(props.task.variants_items?.find((variant) => variant.value == val)?.text),
        index: cols.indexOf(target),
        indexText: validate(props.task.variants_groups?.find((variant) => variant.value == target)?.text),
        val,
        target
      };
    }).sort((a, b) => a.index - b.index);

    return content.map((variant) => {
      return {
        text: `<div class="d-flex">
                    <span title="${variant.indexText}" class="taskItem-answer-table-index">${variant.index + 1}</span>
                    <span title="${variant.text}" class="taskItem-answer-table-variant">${variant.text}</span>
                  </div>`,
        correct: rightTaskAnswers.value.find((answer) => answer[0] == variant.val && answer[1] == variant.target)
      };
    });
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history-gap-match-table {
    margin-top: -1.4rem;

    &-item {
      padding: 0.5rem;
    }

    &-item--correct {
      color: $color-green-dark;
    }

    &-item--wrong {
      color: $color-red-dark;
    }
  }

  .taskItem-answer-table-index {
    background: #bcdbfd;
    min-width: 25px;
    display: inline-flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    margin-right: 0.3rem;
  }

  .taskItem-answer-table-variant {
    max-width: 41rem;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
