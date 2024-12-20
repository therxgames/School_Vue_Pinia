<template>
  <div class="gapMatchTableAnswer-content">
    <div
      v-if="props.description && props.options?.showDescription !== false"
      class="gapMatchTableAnswer-content-description-text"
      v-html="props.description"/>

    <div
      class="gapMatchTableAnswer-content-description-text">
      <span>Перетащите элементы в соответствующую область</span>
    </div>
    <div class="gapMatchTableAnswer-table-container">
      <div class="gapMatchTableAnswer-table position-relative">
        <gap-match-table-answer-question-content
          v-for="(variant, index) in props.content"
          :key="index"
          class="gapMatchTableAnswer-content-table"
          @answer-change="onAnswerChange"
          @delAnswerItem="onDelAnswerItem"
          @addAnswerItem="onAddAnswerItem"
          :task="task"
          :step="step"
          :answer="answer"
          :variant="variant"/>
      </div>
    </div>

    <div
      v-if="props.num !== null"
      style="clear: both;"/>
  </div>
</template>

<script setup>
  import GapMatchTableAnswerQuestionContent from './gap-match-table-answer-question-content.vue';

  const props = defineProps({
    description: {
      type: String,
      default: ''
    },
    content: {type: Object, required: true},
    num: {
      type: Number,
      default: null
    },
    options: {
      type: Object,
      default() {
        return {
          showDescription: true
        };
      }
    },
    task: {type: Object, required: true},
    step: {type: String, required: true},
    answer: {type: Object, required: true}
  });
  const emit = defineEmits(['answer-change', 'delAnswerItem', 'addAnswerItem']);

  const onAnswerChange = (newAnswer) => {
    emit('answer-change', newAnswer);
  };

  const onDelAnswerItem = (sourceValue, targetValue) => {
    const newAnswer = {...props.answer};
    let answer = props.answer.answer ? props.answer.answer.slice() : [];

    if (answer.find((item) => item[0] === sourceValue && item[1] === targetValue)) {
      answer = answer.filter((item) => !(item[0] === sourceValue && item[1] === targetValue));
      props.answer.answer = answer;
    };
    emit('answer-change', newAnswer);
    emit('delAnswerItem', sourceValue, targetValue);
  };

  const onAddAnswerItem = (sourceValue, targetValue) => {
    const newAnswer = {...props.answer};
    let answer = props.answer.answer ? props.answer.answer.slice() : [];

    if (!answer.find((item) => item[0] === sourceValue && item[1] === targetValue)) {
      answer.push([sourceValue, targetValue]);
      props.answer.answer = answer;
    };
    emit('answer-change', newAnswer);
    emit('addAnswerItem', sourceValue, targetValue);
  };

</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .active-item {
    width: 200px;
    background: #fff;
    border: 2px solid #2876fb;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #93979e;
  }

  .gapMatchTableAnswer-content {
    position: relative;

    &-description-text {
      color: #93979e;
      margin-top: -1.2rem;
      font-size: 14px;
    }

    &-table {
      margin-top: 13px;
    }
  }
</style>
