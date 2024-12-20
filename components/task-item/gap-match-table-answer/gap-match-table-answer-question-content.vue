<template>
  <div
    class="gapMatchTableAnswer-row"
    :class="{withImg:addedImg}"
    ref="gapMatchTableAnswerBody"
    v-if="loaded">
    <div class="gapMatchTableAnswer-row-title text-nowrap">
      <div v-html="`${variant.text}`"/>
    </div>
    <div
      :class="[`${step === 'interaction' ? 'gapMatchTableAnswer-row-target' :
        !placedSources.length? 'gapMatchTableAnswer-row-target-hide' :
        'gapMatchTableAnswer-row-target-showAnswer'}`,{hover:hover},{withImg:addedImg}]"
      :style="`${!placedSources.length?'padding: 0px 16px;':''}`">
      <container
        class="gapMatchTableAnswer-row-target-sell"
        @drop="onDrop"
        @drag-enter="onDragEnter"
        @drag-leave="onDragLeave"
        orientation="vertical"
        behavior="move"
        group-name="gap"
        drag-class="active-item"
        drop-class="card-ghost-drop"
        drag-handle-selector=".drag-handle"
        non-drag-area-selector=".gapMatchTableAnswerBody-item.disabled"
        :get-child-payload="getDragPayload"
        :should-accept-drop="shouldAcceptDrop"
        :remove-on-drop-out="true">
        <draggable
          v-for="(item) in placedSources"
          :key="item.value">
          <div
            ref="dragEls"
            class="drag-handle gapMatchTableAnswerBody-item"
            :class="[`${step === 'interaction' ? '' : ' disabled showAnswer'}`,
                     `${checkResult(variant.value,item.value)}`,
                     {withImg:addedImg}]">
            <div
              v-if="step === 'interaction'"
              class="gapMatchTableAnswerBody-item-gap"/>
            <span v-html="`${item.text}`"/>
          </div>
        </draggable>
      </container>
    </div>
  </div>
</template>


<script setup>
  import {Container, Draggable} from 'vue3-smooth-dnd';

  const regImg = /<img/gi;

  const props = defineProps({
    task: {type: Object, required: true},
    step: {type: String, required: true},
    answer: {type: Object, required: true},
    variant: {type: Object, required: true}
  });

  const emit = defineEmits(['answer-change', 'delAnswerItem', 'addAnswerItem']);

  const loaded = ref(false);
  const dragEls = ref(null);
  const gapMatchTableAnswerBody = ref(null);
  const hover = ref(false);
  const addedImg = ref(null);


  const placedSources = computed(() => {
    if (props.answer.answer) {
      return props.answer.answer
        .filter((pair) => props.variant.value == pair[1])
        .map((pair) => {
          return props.task.variants_items.find((item) => item.value == pair[0]);
        });
    }

    return [];
  });

  onMounted(() => {
    setTimeout(() => {
      if (dragEls.value) {
        const maxWidth = Array.from(dragEls.value).reduce((acc, item) => {
          if (item.offsetWidth > acc) acc = item.offsetWidth;
          return acc;
        }, 0);
        gapMatchTableAnswerBody.value.style.setProperty('--max-width', `${maxWidth}px`);
      }
    }, 0);

    props.task.variants_groups.forEach((item) => {
      if (regImg.test(item.text)) addedImg.value = true;
    });
    loaded.value = true;
  });

  const onDragEnter = () => {
    hover.value = true;
  };

  const onDragLeave = () => {
    hover.value = false;
  };

  const checkResult = (variant, value) => {
    if (props.step !== 'interaction') {
      if (props.task.answer.find((item) => item[0] === +value && item[1] === variant)) {
        return 'correct';
      }
      return 'error';
    }
    return '';
  };

  const onDrop = (e) => {
    hover.value = false;
    const newAnswer = {...props.answer};
    const sourceValue = +e.payload.value;
    const targetValue = props.variant.value;
    let answer = props.answer.answer ? props.answer.answer.slice() : [];

    if (typeof e.addedIndex === 'number') {
      emit('addAnswerItem', sourceValue, targetValue);
      if (!answer.find((item) => item[0] === sourceValue && item[1] === targetValue)) {
        answer.push([sourceValue, targetValue]);
      }
    }
    if (typeof e.removedIndex === 'number'&& typeof e.addedIndex !== 'number') {
      emit('delAnswerItem', sourceValue, targetValue);
      if (answer.find((item) => item[0] === sourceValue && item[1] === targetValue)) {
        answer = answer.filter((item) => !(item[0] === sourceValue && item[1] === targetValue));
      };
    }

    newAnswer.answer = answer;
    if (typeof e.addedIndex === 'number' || typeof e.removedIndex === 'number') {
      emit('answer-change', newAnswer);
    }
  };

  const shouldAcceptDrop = () =>{
    return true;
  };

  const getDragPayload = (index) => {
    return placedSources.value[index];
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .card-ghost-drop {
    width: 200px !important;
    background: #fff;
    border: 2px solid #2876fb !important;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #93979e;
  }

  .gapMatchTableAnswerBody {
    user-select: none;

    * {
      box-sizing: border-box !important;
    }

    &-item {
      background: #fff;
      margin: 8px 13px;
      padding: 12px 16px;
      line-height: 150%;
      width: 636px;
      border: 1px solid #dddee0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      cursor: pointer;

      &.withImg {
        width: 425px !important;
      }

      &.disabled {
        cursor: auto;
      }

      &.showAnswer {
        margin-left: 0;
        width: 680px;
      }

      .svg-icon-default {
        margin-right: 3px;
        transform: scale(0.5);
      }

      &-gap {
        margin-right: 25px;
      }
    }
  }

  .drag-handle svg {
    min-width: 25px;
  }

  .gapMatchTableAnswer-row {
    width: 871px;

    &.withImg {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 50px;
      width: 700px;
      padding: 5px;
    }

    &.withImg .active-item {
      width: 200px !important;
      background: #fff;
      border: 2px solid #2876fb !important;
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #93979e;
      transform: rotate(-3deg);
    }
  }

  .gapMatchTableAnswer-row-title {
    font-weight: 500;

    & div {
      white-space: normal;
    }
  }

  .gapMatchTableAnswer-row-target {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 44px;
    margin: 5px 0 25px;
    padding: 16px;
    width: 700px;
    border: 1px dashed #93979e;
    border-radius: 8px;

    &.withImg {
      max-width: 500px;
      padding: 0 !important;
      margin-top: 20px;
    }

    &.hover {
      background: #f0f2fc;
      border: 1px dashed #2876fb;
    }

    &-hide {
      display: hide;
      margin-bottom: -20px;
    }

    &-showAnswer {
      display: hide;
    }

    &-sell {
      flex: 1;
    }
  }
</style>
