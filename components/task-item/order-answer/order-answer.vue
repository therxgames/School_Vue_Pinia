<template>
  <div
    class="orderAnswer"
    :class="['orderAnswer--' + step]">
    <task-item-common-question
      class="orderAnswer-header"
      :content="task.question"
      :num="num"
      :tag="tag"
      :zero-page="task.zeropage_text"
      :show-zero-page="showZeroPage"/>

    <div
      class="orderAnswer-body"
      :class="[{'disabled': props.preview}]">
      <container
        @drop="onDrop"
        lock-axis="y"
        drag-class="active-item"
        drop-class="card-ghost-drop"
        drag-handle-selector=".drag-handle"
        non-drag-area-selector=".orderAnswer-item.disabled">
        <draggable
          v-for="(variant, index) in placedVariants"
          :key="variant.value"
          class="draggable-item">
          <div
            class="drag-handle orderAnswer-item"
            :class="{disabled: step !== 'interaction'}">
            <span v-html="`${variant.value}. ${variant.text}`"/>
            <svg-icon
              v-if="step !== 'interaction'"
              :class="iconClass(variant, index)"
              :name="iconName(variant, index)"/>
          </div>
        </draggable>
      </container>
    </div>
  </div>
</template>

<script setup>
  import {Container, Draggable} from 'vue3-smooth-dnd';

  const props = defineProps({
    task: {type: Object, required: true},
    step: {type: String, required: true},
    answer: {type: Object, required: true},
    num: {type: Number, default: null},
    tag: {type: String, default: null},
    preview: {type: Boolean, default: false},
    showZeroPage: {type: Boolean, default: true}
  });

  const emit = defineEmits(['answer-change']);

  const placedVariants = computed(() => {
    if (props.answer?.answer && props.answer.answer.length === props.task.variants.length) {
      return props.answer.answer.map((id) => props.task.variants.find((item) => item.value === id));
    } else {
      return props.task.variants;
    }
  });

  const onDrop = ({addedIndex, removedIndex}) => {
    if (typeof addedIndex === 'number' && typeof removedIndex === 'number') {
      const answer = placedVariants.value.map((variant) => variant.value);
      const index = answer.splice(removedIndex, 1)[0];
      answer.splice(addedIndex, 0, index);

      const newAnswer = {...props.answer};
      newAnswer.answer = answer;
      emit('answer-change', newAnswer);
    }
  };

  const checkIndex = (item, index) => item.value === props.task.answer[index];
  const iconClass = (item, index) => checkIndex(item, index) ? 'correct' : 'error';
  const iconName = (item, index) => checkIndex(item, index) ? 'check-tint' : 'cross-tint';
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .disabled {
    user-select: none;
    pointer-events: none;
  }

  .orderAnswer {
    user-select: none;

    .draggable-item {
      position: relative;
    }

    .orderAnswer-item {
      background-color: white;
      border: 1px solid #ced6e0;
      border-radius: 8px;
      padding: 10px 16px;
      margin-top: 12px;
      margin-bottom: 12px;
      width: calc(100% - 50px);
      cursor: pointer;

      &.active-item {
        border: #0576ff solid 2px;
      }

      &.disabled {
        cursor: auto;
      }
    }

    .svg-icon-default {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) scale(0.7);
      right: 15px;

      &.correct svg {
        fill: $color-green-dark;
      }

      &.error svg {
        fill: #f85542;
      }
    }
  }
</style>
