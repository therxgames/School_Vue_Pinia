<template>
  <div
    ref="gapMatchTableAnswer"
    class="gapMatchTableAnswer"
    :class="['gapMatchTableAnswer--' + step]">
    <client-only>
      <task-item-common-question
        class="gapMatchTableAnswer-header"
        :content="task.question"
        :num="num"
        :tag="tag"
        :zero-page="task.zeropage_text"
        :show-zero-page="showZeroPage"/>

      <gap-match-table-answer-question-table
        v-if="loaded && answer"
        class="gapMatchTableAnswer-header"
        :content="task.variants_groups"
        :num="num"
        :task="task"
        :step="step"
        :answer="answer"
        @delAnswerItem="onDelAnswerItem"
        @addAnswerItem="onAddAnswerItem"
        @answer-change="emit('answer-change', $event)"/>
    </client-only>

    <div
      v-if="loaded && step === 'interaction'"
      :class="['gapMatchTableAnswer-body', {'disabled': props.preview},
               `${variantsItems.length || show?'':'gapMatchTableAnswer-body-hide'}`,
               `${!variantsItems.length && show?'gapMatchTableAnswer-body-show':''}`]">
      <span
        class="drop-field"
        v-if="!variantsItems.length&&true">Перенести сюда</span>
      <container
        @drop="onDrop"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        orientation="vertical"
        group-name="gap"
        drag-class="active-item"
        drop-class="card-ghost-drop"
        drag-handle-selector=".drag-handle"
        behaviour="copy"
        non-drag-area-selector=".gapMatchTableAnswer-item.disabled"
        :get-child-payload="getDragPayload"
        :should-accept-drop="()=>!hasCopy"
        :remove-on-drop-out="!hasCopy">
        <draggable
          v-for="(item,index) in variantsItems"
          :key="item.value">
          <div
            ref="dragEls"
            class="drag-handle gapMatchTableAnswer-item"
            :class="[{disabled: step !== 'interaction'},{shade:shadeAnswers[index]}]">
            <span v-html="`${item.text}`"/>
          </div>
        </draggable>
      </container>
    </div>
  </div>
</template>

<script setup>
  import {Container, Draggable} from 'vue3-smooth-dnd';
  import GapMatchTableAnswerQuestionTable from './gap-match-table-answer-question-table.vue';

  const REG = /\sMathType@MTEF.*@\s/g;

  const props = defineProps({
    task: {type: Object, required: true},
    step: {type: String, required: true},
    answer: {type: Object, required: true},
    num: {type: Number, default: null},
    tag: {type: String, default: null},
    preview: {type: Boolean, default: false},
    showZeroPage: {type: Boolean, default: true}
  });

  onBeforeMount(()=>{
    let templateItems = props.task.variants_items;
    templateItems.forEach((item) => {
      while (REG.test(item.text)) {
        item.text = item.text.replace(REG, '');
      }
    });
    props.task.variants_items = templateItems;
  });

  const variantsItems = ref(props.task.variants_items);

  watch(()=>props.step, ()=> {
    if (props.step !== 'interaction') variantsItems.value = props.task.variants_items;
  }, {immediate: true});

  const loaded = ref(false);
  const gapMatchTableAnswer = ref(null);
  const shadeAnswers = ref([]);
  const dragPayload = ref(null);

  const getDragPayload = (index) => {
    dragPayload.value = index;
    shadeAnswers.value[index] = true;
    return variantsItems.value[index];
  };

  const dragEls = ref(null);
  const hasCopy = computed( ()=>{
    return props.task.answer.length !== new Set(props.task.answer.map(([variant, target])=>variant)).size;
  });

  onMounted(() => {
    setTimeout(() => {
      if (dragEls.value) {
        const maxWidth = Array.from(dragEls.value).reduce((acc, item) => {
          if (item.offsetWidth > acc) acc = item.offsetWidth;
          return acc;
        }, 0);

        gapMatchTableAnswer.value.style.setProperty('--max-width', `${maxWidth-300}px`);
      }
    }, 0);

    window.addEventListener('mousemove', onMouseMove);

    loaded.value = true;
  });

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMouseMove);
  });

  const addedAnwer = ref(null);
  const deletedAnswer = ref(null);

  const onDelAnswerItem = (sourceValue, targetValue) => {
    deletedAnswer.value = targetValue;
  };
  const onAddAnswerItem = (sourceValue, targetValue) => {
    addedAnwer.value = targetValue;
  };

  const onDrop = (e) => {
    if (!hasCopy.value) {
      setTimeout(()=>{
        if (deletedAnswer.value && !addedAnwer.value ) {
          variantsItems.value.push(e.payload);
        }

        if (addedAnwer.value && typeof dragPayload.value === 'number' ) {
          variantsItems.value = variantsItems.value.filter((item) => item.text !== e.payload.text);
        }
        addedAnwer.value = null;
        deletedAnswer.value = null;
        dragPayload.value = null;
      }, 50);
    }
  };

  const show = ref(false);

  let dragging = false;

  const onMouseMove = (e) => {
    if (dragging) {
      const targetEls = document.querySelectorAll('.gapMatchTableAnswer-row-target>.smooth-dnd-container');
      const x = e.clientX + document.body.scrollLeft;
      const el = document.querySelector('.smooth-dnd-ghost');
      const item1 = el.querySelector('.gapMatchTableAnswer-item');
      const item2 = el.querySelector('.gapMatchTableAnswerBody-item');
      const rect = el.getBoundingClientRect();
      if (rect.top < 0) window.scrollBy(0, -50);
      if (rect.bottom > window.innerHeight) window.scrollBy(0, 50);
      if (item1) {
        targetEls.forEach((item)=>{
          if (!item.children[0]) {
            item.style.right = (x - rect.x - item1.clientWidth / 2)-320 + 'px';
          } else {
            item.style.right = (x - rect.x - item1.clientWidth / 2)-320 + 'px';
            [...item.children].forEach((itemEl)=>{
              itemEl.style.marginLeft = (x - rect.x - item1.clientWidth / 2)-320 + 'px';
            });
          }
        });
        el.style.paddingLeft = (x - rect.x - item1.clientWidth / 2)/1.3+70 + 'px';
      }
      if (item2) {
        targetEls.forEach((item)=>{
          if (!item.children[0]) {
            item.style.right = (x - rect.x - item2.clientWidth / 2)-320 + 'px';
          } else {
            item.style.right = (x - rect.x - item2.clientWidth / 2)-320 + 'px';
            [...item.children].forEach((itemEl)=>{
              if (!itemEl.contains(document.querySelector('.smooth-dnd-ghost'))) {
                itemEl.style.marginLeft = (x - rect.x - item2.clientWidth / 2)-320 + 'px';
              }
            });
          }
        });
        el.style.paddingLeft = (x - rect.x - item2.clientWidth / 2)/1.3+70 + 'px';
      }
    }
  };

  const onDragStart = (e) => {
    dragging = true;
    if (!variantsItems.length) show.value = true;
  };

  const onDragEnd = (e) => {
    dragging = false;
    show.value = false;
    shadeAnswers.value = [];
    const targetEls = document.querySelectorAll('.gapMatchTableAnswer-row-target>.smooth-dnd-container');
    targetEls.forEach((item)=>{
      item.style.right = '0px';
      if (item.children[0]) [...item.children].forEach((itemEl)=>itemEl.style.marginLeft = '0px');
    });
  };

  const emit = defineEmits(['answer-change']);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .disabled {
    user-select: none;
    pointer-events: none;
  }

  .gapMatchTableAnswer-row-target {
    position: relative;
  }

  .smooth-dnd-draggable-wrapper {
    overflow: visible !important;
  }

  .active-item {
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

  .gapMatchTableAnswer {
    user-select: none;

    * {
      box-sizing: border-box !important;
    }

    margin-bottom: 32px;

    &.disabled {
      user-select: none;
      pointer-events: none;
    }

    &-header {
      line-height: 27px;
    }

    &-body {
      margin-top: 32px;
      background: #f0f2fc;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 20px 24px;
      gap: 16px;
      width: 123%;

      &-hide {
        display: none;
      }

      &-show {
        background: #f0f2fc;
        border: 1px dashed #2876fb;
      }

      & > .drop-field {
        display: flex;
        margin: 15px 0 -30px;
        justify-content: center;
        color: #93979e;
      }
    }

    &-item {
      margin: 8px 0;
      padding: 12px 40px 12px 16px;
      width: 100%;
      background: #fff;
      border: 1px solid #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      cursor: pointer;

      &.disabled {
        cursor: auto;
      }

      &.shade {
        border: 1px solid #dddee0;
        box-shadow: none;
        background: #f0f2fc;
        color: #93979e;
      }
    }
  }
</style>
