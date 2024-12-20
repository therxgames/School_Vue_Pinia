<template>
  <div class="enterAnswer">
    <task-item-common-question
      class="enterAnswer-header"
      :content="task.question"
      :num="num"
      :tag="tag"
      :zero-page="task.zeropage_text"
      :show-zero-page="showZeroPage"/>

    <div
      class="enterAnswer-body"
      :class="[{'disabled': props.preview}]">
      <div class="enterAnswer-body-title">
        Напишите ваш ответ
      </div>

      <input
        :value="input"
        @input="onInput"
        @keydown.enter="onEnter"
        :disabled="step === 'result'"
        autocomplete="off"
        class="enterAnswer-input form-control">
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    task: {type: Object, required: true},
    step: {type: String, required: true},
    answer: {type: Object, required: true},
    num: {type: Number, default: null},
    tag: {type: String, default: null},
    mode: {type: String, default: 'multiple'},
    preview: {type: Boolean, default: false},
    showZeroPage: {type: Boolean, default: true}
  });

  const emit = defineEmits(['answer-change', 'check']);

  let input = ref('');

  onBeforeUnmount(() => {
    input.value = '';
  });

  watch(() => props.answer, () => {
    if (props.answer.answer && props.answer.answer.length) {
      input.value = props.answer.answer[0];
    } else {
      input.value = '';
    }
  }, {immediate: true});

  const onInput = (e) => {
    const newAnswer = {...props.answer};

    if (e.target.value) {
      newAnswer.answer = [e.target.value];
    } else {
      newAnswer.answer = [];
    }

    emit('answer-change', newAnswer);
  };

  const onEnter = () => {
    if (props.mode === 'single') {
      emit('check');
    }
  };
</script>

<style lang="scss">
  .enterAnswer-body {
    margin-top: 1rem;

    &.disabled {
      user-select: none;
      pointer-events: none;
    }
  }

  .enterAnswer-body-title {
    color: #7f838a;
    font-size: 0.875rem;
    margin-bottom: 0.4rem;
  }
</style>
