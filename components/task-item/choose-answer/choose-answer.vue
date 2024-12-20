<template>
  <div class="chooseAnswer" :class="['chooseAnswer--' + step]">
    <task-item-common-question
      :content="task.question"
      :num="num"
      :tag="tag"
      :zero-page="task.zeropage_text"
      :show-zero-page="showZeroPage"
    />

    <div
      class="chooseAnswer-body"
      :class="[answerClass(), { disabled: props.preview }]"
    >
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="chooseAnswer-variant"
        :class="variant.class"
        @click="toggleVariant(variant)"
        @mouseenter="onMouseenter(index)"
        @mouseleave="onMouseleave"
      >
        <div v-if="variant.icon" class="chooseAnswer-variant-icon">
          <svg-icon :name="variant.icon" />
        </div>

        <common-content
          class="chooseAnswer-variant-content"
          :content="trimNbsp(variant.text)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: { type: Object, required: true },
  step: { type: String, required: true },
  answer: { type: Object, required: true },
  num: { type: Number, default: null },
  tag: { type: String, default: null },
  preview: { type: Boolean, default: false },
  showZeroPage: { type: Boolean, default: true },
});

const emit = defineEmits(["answer-change", "check"]);

const mode = computed(() => {
  if (props.task.variants.every((v) => v.text.includes("<img ")))
    return "selPic";
  if (props.task.variants_multiple) return "checkbox";
  return "radio";
});

const trimNbsp = (content) => {
  while (content.match(/^( )?&nbsp;/)) {
    content = content.replace(/^( )?&nbsp;/, "");
  }

  while (content.match(/&nbsp;( )?$/)) {
    content = content.replace(/&nbsp;( )?$/, "");
  }

  return content;
};

const icons = {
  checkbox: {
    default: "defaultIcon",
    hover: "selectedIconHover",
    selected: "selectedIcon",
    correct: "correctIcon",
    wrong: "wrongIcon",
  },
  radio: {
    default: "defaultIconCircle",
    hover: "selectedIconCircleHover",
    selected: "selectedIconCircle",
    correct: "correctIconCircle",
    wrong: "wrongIconCircle",
  },
  selPic: {
    default: null,
    hover: "selected-pic",
    selected: "selected-pic",
    correct: "correctIconCircle",
    wrong: "wrongIconCircle",
  },
};

const variants = computed(() =>
  props.task.variants.map((v, i) => {
    const status = getStatus(v, i);

    return {
      value: v.value,
      text: v.text,
      status,
      icon: icons[mode.value][status],
      class: `chooseAnswer-variant--${status}`,
    };
  })
);

const hover = ref(null);

const answerClass = () => {
  if (mode.value === "selPic") {
    const res = ["chooseAnswwer-pictures"];
    if (props.task.variants.length % 3 === 0) {
      res.push("chooseAnswwer-pictures-grid3");
    } else {
      res.push("chooseAnswwer-pictures-grid2");
    }
    return res;
  }
};

const getStatus = (variant, index) => {
  if (props.step === "interaction") {
    if (props.answer.answer && props.answer.answer?.includes(variant.value)) {
      return "selected";
    } else if (hover.value === index) {
      return "hover";
    }
  } else if (props.step === "result") {
    if (props.answer.answer?.includes(variant.value)) {
      if (props.task.answer?.includes(variant.value)) {
        return "correct";
      } else {
        return "wrong";
      }
    }
  }
  return "default";
};

const toggleVariant = (variant) => {
  let answer;

  if (props.task.variants_multiple) {
    answer = props.answer.answer ? props.answer.answer.slice() : [];

    if (answer.includes(variant.value)) {
      answer.splice(answer.indexOf(variant.value), 1);
    } else {
      answer.push(variant.value);
    }
  } else {
    answer = [variant.value];
  }

  const newAnswer = { ...props.answer };
  newAnswer.answer = answer;
  emit("answer-change", newAnswer);
};

const onMouseenter = (index) => {
  hover.value = index;
};

const onMouseleave = (index) => {
  hover.value = null;
};
</script>

<style lang="scss">
.chooseAnswer-variant {
  display: flex;
  cursor: pointer;
  align-items: center;
  border-bottom: 1px solid #f3f6fb;
}

.chooseAnswer-variant-icon {
  width: calc(1rem + 20px);
  padding: 0.9rem 0 0.3rem;
  color: #fff0;
}

.chooseAnswer-variant-content {
  flex: 1;
  padding: 0.9rem 0 0.3rem;
}

.chooseAnswer-variant:hover {
  color: #0576ff;
  border-bottom: 1px solid #ced6e0;
}

.chooseAnswer-variant--correct {
  color: #2a8436;
}

.chooseAnswer-variant--wrong {
  color: #f85542;
}

.chooseAnswer--result .chooseAnswer-body {
  pointer-events: none;

  &.disabled {
    user-select: none;
    pointer-events: none;
  }
}

.chooseAnswwer-pictures {
  display: grid;
  gap: 1.5rem;

  &-grid2 {
    grid-template-columns: 1fr 1fr;
  }

  &-grid3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .chooseAnswer-variant {
    position: relative;
    display: flex;
    min-width: 25%;
    width: 100%;
    padding: 1rem;
    border: none;
    border: 1px solid #ced6e0;
    border-radius: 4px;

    .svg-icon {
      width: 2rem;
      height: 2rem;
    }

    img {
      display: block;
      margin: auto;
      max-width: 100%;
      max-height: 280px;
    }

    .chooseAnswer-variant-icon {
      position: absolute;
      padding: 0;
      width: auto;
      left: 0.5rem;
      bottom: 0.5rem;
    }
  }

  .chooseAnswer-variant:hover {
    border: 1px solid #0576ff;
  }

  .chooseAnswer-variant--selected {
    border: 1px solid #0c1524;
  }

  .chooseAnswer-variant--correct {
    border: 1px solid #3db45a;
  }

  .chooseAnswer-variant--wrong {
    border: 1px solid #f85542;
  }
}
</style>
