<template>
  <div
    ref="gapMatchTextAnswer"
    class="gapMatchTextAnswer"
    :class="['gapMatchTextAnswer--' + step]">
    <task-item-common-question
      v-if="loaded"
      :content="question"
      :content-components="contentComponents"
      :num="num"
      :tag="tag"
      :zero-page="task.zeropage_text"
      :show-zero-page="showZeroPage"/>

    <div
      class="gapMatchTextAnswer-body"
      :class="[{'disabled': props.preview}]"
      v-if="loaded">
      <container
        orientation="horizontal"
        group-name="gap"
        drag-class="active-item"
        drop-class="card-ghost-drop"
        drag-handle-selector=".drag-handle"
        behaviour="copy"
        non-drag-area-selector=".gapMatchTextAnswer-item.disabled"
        :get-child-payload="getDragPayload()">
        <draggable
          v-for="item in task.variants"
          :key="item.value">
          <div
            ref="dragEls"
            class="drag-handle gapMatchTextAnswer-item"
            :class="{disabled: step !== 'interaction'}">
            {{ item.text }}
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

  const loaded = ref(false);
  const gapMatchTextAnswer = ref(null);

  const getDragPayload = () => {
    return (index) => {
      return props.task.variants[index];
    };
  };
  const dragEls = ref(null);
  const show = ref(false);

  const REG = /_+ \([^)]\)/i;

  let containersCount;

  const question = computed(() => {
    let res = props.task.question;
    let idx = 0;

    while (REG.test(res)) {
      res = res.replace(REG, `<container data-id="${idx}" class="gap" groupName="gap"></container>`);
      idx++;
    }

    containersCount = idx ;
    return res;
  });

  const onDrop = (id, {removedIndex, addedIndex, payload}) => {
    if (removedIndex === null && addedIndex === null) return;
    if (removedIndex === addedIndex) return;

    const newAnswer = {...props.answer};

    if (!newAnswer.answer) {
      newAnswer.answer = Array(containersCount).fill('0');
    }

    newAnswer.answer[id] = payload.value;

    if (removedIndex !== null) {
      newAnswer.answer[id] = null;
    }

    emit('answer-change', newAnswer);
  };

  const getContainerPayload = (id) => {
    return () => {
      return props.answer.answer && props.answer.answer[id];
    };
  };

  const checkResult = (id) => {
    if (props.answer.answer && props.step !== 'interaction') {
      return props.task.answer[id] === props.answer.answer[id] ? ' correct' : ' error';
    }

    return '';
  }

  const contentComponents = {
    'container': (el) => {
      const id = +el.attribs['data-id'];
      const variantId = props.answer.answer && props.answer.answer[id];
      const variant = props.task.variants.find((v) => v.value === variantId);

      return h(Container, {
        'onDrop': (e) => onDrop(id, e),
        'className': `smooth-dnd-container vertical gap${variant ? ' fill' : ''}${checkResult(id)}`,
        'group-name': 'gap',
        'dragClass': 'active-item',
        'getChildPayload': getContainerPayload(id),
        'removeOnDropOut': true,
        'non-drag-area-selector': '.gapMatchTextAnswer-item.disabled',
        'shouldAcceptDrop': () => true
      }, {
        default: () => variant
          ? h(Draggable, {}, {default: () => h('span', {class: `gapMatchTextAnswer-item${props.step === 'interaction' ? '' : ' disabled'}`}, variant.text)})
          : ''
      });
    }
  };

  onMounted(() => {
    const elem = gapMatchTextAnswer.value.closest('.collapse');
    if (elem) {
      const observer = new MutationObserver((mutations) => {
        show.value = mutations.some((mutation) => mutation.target.classList.contains('show'));
      });
      observer.observe(elem, {
        childList: false,
        subtree: false,
        attributes: true,
        attributeFilter: ['class']
      });
    } else {
      setTimeout(manageMaxWidth, 0);
    }

    loaded.value = true;
  });

  watch(show, (val) => {
    if (val) manageMaxWidth();
  });

  const manageMaxWidth = () => {
    if (dragEls.value) {
      const maxWidth = Array.from(dragEls.value).reduce((acc, item) => {
        if (item.offsetWidth > acc) acc = item.offsetWidth;
        return acc;
      }, 0);

      gapMatchTextAnswer.value.style.setProperty('--max-width', `${maxWidth}px`);
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .disabled {
    user-select: none;
    pointer-events: none;
  }

  .gapMatchTextAnswer {
    user-select: none;

    .gapMatchTextAnswer-header {
      line-height: 30px;
    }

    .smooth-dnd-container.horizontal {
      display: flex !important;
      flex-wrap: wrap;
    }

    .gap {
      border: 1px solid #ffb40a;
      border-radius: 8px;
      width: var(--max-width);
      height: 27px;
      display: inline-block;
      vertical-align: middle;
      min-height: 27px;
      overflow: hidden;
      background-color: white;
      position: relative;
      top: -1px;

      .smooth-dnd-ghost {
        .gapMatchTextAnswer-item {
          border: 1px solid #ced6e0;
          height: 27px;
        }
      }

      .gapMatchTextAnswer-item {
        margin: 0;
        border: none;
        height: 25px;

        &.active-item {
          border-color: #ced6e0;
        }
      }

      &.fill {
        border-color: #ced6e0;
      }

      &.correct {
        border-color: $color-green-dark;
      }

      &.error {
        border-color: #f85542;
      }
    }

    .gapMatchTextAnswer-item {
      background-color: white;
      padding: 0 8px 1px;
      width: var(--max-width);
      margin-right: 12px;
      margin-bottom: 12px;
      border: 1px solid #ced6e0;
      border-radius: 8px;
      height: 27px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.disabled {
        cursor: auto;
      }
    }
  }
</style>
