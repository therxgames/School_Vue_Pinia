<template>
  <div
    ref="selectContainer"
    :class="[{'input-select--opened': listShow}, {'input-select--filled': !!value}, {'input-select--disabled': disabled}, sizeClasses('input-select')]"
    class="dropdown input-select border-0">
    <div
      @click="toggleList"
      ref="btnToggle"
      class="btn"
      :class="[sizeClasses('input-select-btn'), selectBtnClassNames]"
      aria-expanded="true">
      <span class="input-select-value">
        <svg-icon
          v-if="valueIcon"
          :name="valueIcon.name"
          :fill="valueIcon.fill"/>
        <span
          v-if="!editable"
          v-html="value"/>
        <slot name="edit"/>
      </span>
      <svg-icon
        name="arrow-bottom"
        class="input-select-arrow"/>
    </div>
    <div
      v-show="list.length"
      class="dropdown-menu animation slide-in shadow input-select-dropdownMenu">
      <div
        ref="scroller"
        class="input-select-scroller scroller-default">
        <div
          v-for="(item, index) in selectable"
          :key="index"
          :class="[
            {'input-select-dropdown-item--disabled': item.disabled === true},
            {'d-none': item.hidden === true},
            {'input-select-item--selected': item.id == value || item.name === value},
            ]"
          @click="listItemClick(item)"
          v-tooltip="tpOpts(item)"
          class="dropdown-item input-select-dropdown-item "
          :ref="(el) => setItemRef(el, item)"
        >
          <svg-icon
            v-if="item.icon"
            class="input-select-dropdown-itemIcon"
            :name="item.icon.name"
            :fill="item.icon.fill"/>
          <span
            class="input-select-value"
            v-html="truncateString(item[nameField], truncateFrom)"
          />
        </div>

      </div>
      <template v-if="list.length && resetBtn">
        <div class="dropdown-divider"/>
        <div
          @click="resetSelected"
          :class="{'input-select-item-reset--disabled': !value}"
          class="dropdown-item input-select-item-reset">
          Cбросить
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {onClickOutside} from '@vueuse/core';
import SmoothScrollbar from 'smooth-scrollbar';

const emit = defineEmits(['update:value']);
const props = defineProps({
  value: {
    type: [Number, String],
    validator(value) {
      return true;
    }
  },
  placeholder: {
    type: String,
    default: ''
  },
  showSelectedCount: {
    type: Boolean,
    default: true
  },
  showedZindex: {
    type: String,
    default: '200'
  },
  closedZindex: {
    type: String,
    default: '10'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array,
    default: () => ([])
  },
  nameField: {
    type: String,
    default: 'name'
  },
  nameIsHtml: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: '300px'
  },
  truncateFrom: {
    type: Number,
    default: 35
  },
  resetBtn: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: null
  },
  selectBtnClassNames: {
    type: String,
    default: ''
  },
  editable: {
    type: Boolean,
    default: false
  }
});
const listShow = ref(false);
const btnToggle = ref(null);
const scroller = ref(null);
const selectContainer = ref(null);
const valueIcon = ref(null);
const value = computed(() => {
  if (props.value) {
    let item = props.list.find((item) => item.id === props.value);
    if (item) {
      valueIcon.value = item.icon;
      return item[props.nameField];
    }
  }

  return props.placeholder;
});
const selectable = computed(() => {
  return props.list;
});
const tpOpts = computed(() => (item) => {
  if (item.tooltip && item.tooltip.title) {
    return {
      placement: 'right',
      ...item.tooltip
    };
  }

  return {title: ''};
});
let dropDownInst = ref(null);
let scrollerInst = ref(null);

const currentElement = ref(null);
const setItemRef = (el, item) => {
  if (item.id == value.value || item.name === value.value) {
    currentElement.value = el
  }
}

const onScrollTo = () => {
  if (scrollerInst.value && currentElement.value) {
    const elementRect = currentElement?.value?.getBoundingClientRect();
    const yPos = elementRect.top - 320;

    setTimeout(() => {
      scrollerInst.value.setPosition(0, yPos)
    }, 100)
  }
};

watch(
  () => listShow.value,
  (show) => {
    if (show) {
      dropDownInst.value.show();
      selectContainer.value.style.setProperty('--z-index', props.showedZindex);
      onScrollTo()
    } else {
      dropDownInst.value.hide();
      selectContainer.value.style.setProperty('--z-index', props.closedZindex);
    }

    selectContainer.value.style.setProperty('--max-height', props.maxHeight);
  }
);

onMounted(() => {
  dropDownInst.value = new window.$bootstrap.Dropdown(btnToggle.value, {
    offset: [0, 5]
  });
  scrollerInst.value = SmoothScrollbar.init(scroller.value, {alwaysShowTracks: true});
  onClickOutside(selectContainer.value, hideList);
});
onUnmounted(() => {
  if (dropDownInst.value) {
    dropDownInst.value.dispose();
    dropDownInst.value = null;
  }
  if (scrollerInst.value) {
    SmoothScrollbar.destroy(scroller.value);
  }
});

const toggleList = () => {
  listShow.value = !listShow.value;
};
const hideList = async () => {
  [...selectContainer.value.querySelectorAll('.input-select-dropdown-item')]
  .map((item) => item._tooltip?.hide());

  listShow.value = false;
};
const resetSelected = () => {
  emit('update:value', null);
  hideList();
};
const listItemClick = (item) => {
  emit('update:value', item.id);
  hideList();
};
const sizeClasses = (str) => {
  return props.size ? `${str}-${props.size}` : '';
};
</script>

<style lang="scss">
@import '/assets/scss/theme';

.input-select {
  --z-index: 10;
  --input-select-disabled-opacity: 0.5;
  --max-height: 300px;

  z-index: var(--z-index);
  position: relative;
  cursor: pointer;

  .btn {
    --bs-btn-bg: #fff;
    --bs-btn-padding-x: 1rem;
    --bs-btn-color: #{$color-dark};
    --bs-btn-active-color: #{$color-dark};
    --bs-btn-active-border-color: #{$color-dark};
    --bs-btn-border-color: #{$color-normal};
    --bs-btn-hover-color: #{$color-dark};
    --bs-btn-hover-border-color: #{$color-dark};

    cursor: pointer;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.input-select-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding-right: 1.5rem;
}

.input-select-arrow {
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  line-height: 0;
  position: absolute;
  display: flex;
  right: 1em;
  color: currentcolor;
  transition: all 350ms ease-out;
  transform-origin: center center;
}

.input-select-dropdownMenu {
  width: 100%;
}

.input-select-dropdownTitle {
  color: $color-dark-light;
  pointer-events: none;
}

.input-select-item-selectedIcon {
  width: 0.75rem;
  height: 0.5rem;
}

.input-select-item-reset {
  background: #fff !important;
  color: $color-blue-normal !important;
}

.dropdown-item {
  cursor: pointer;
}

.input-select-dropdown-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  user-select: none;
}

.input-select-dropdown-itemIcon {
  width: 1rem;
  height: 1rem;
}

.input-select--filled {
  .btn {
    color: $color-black;
  }
}

.input-select--opened .input-select-arrow {
  transform: rotate(-180deg);
  color: $color-black;
}

.input-select-dropdown-item--disabled {
  opacity: 0.15;
  pointer-events: none;
}

.input-select-item--selected {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background-color: #f2f5fa;
}

.input-select-item-reset--disabled {
  color: $color-dark !important;
  pointer-events: none;
  opacity: 0.5;
}

.input-select--disabled {
  opacity: var(--input-select-disabled-opacity);
  pointer-events: none;
}

.input-select-scroller {
  max-height: var(--max-height);
  overflow: hidden;

  .scrollbar-track-y {
    right: 0.2rem;
  }
}

.input-select-lg {
  height: 56px;
  display: flex;
}

.input-select-btn-lg {
  border-radius: 12px !important;
}
</style>
