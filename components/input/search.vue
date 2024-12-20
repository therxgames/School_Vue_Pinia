<template>
  <div
    :class="[{'input-search--focus': isFocused}]"
    class="dropdown input-search">
    <input
      ref="inputEl"
      :placeholder="placeholder"
      :value="props.value"
      :id="uuid"
      @input="onInput"
      @keyup.enter="onSearchClick"
      @blur="onBlur"
      @focus="onFocus"
      autocomplete="off"
      type="text"
      class="form-control input-search-input"
      aria-label="search"
      data-bs-toggle="dropdown"
      data-bs-offset="0,10">
    <div class="input-search-controls">
      <transition name="transition-fade">
        <svg-icon
          @click="resetInputValue"
          v-if="props.value.length"
          class="input-search-reset-icon"
          name="cross"/>
      </transition>
      <div class="input-search-find">
        <svg-icon
          v-if="props.findTpl === 'icon-default'"
          class="input-search-icon input-search-find-action"
          :class="[{'disabled': trimmedValue.length < props.minLength}]"
          @click="onSearchClick"
          name="search"/>
        <div
          v-if="props.findTpl === 'btn-default'"
          class="btn btn-primary input-search-btn input-search-find-action"
          :class="[{'disabled': trimmedValue.length < props.minLength}]"
          @click="onSearchClick">
          Поиск
        </div>
      </div>
    </div>
    <div
      v-if="autocompleteOptions.filter"
      ref="dropdown"
      v-show="value.length > 2"
      :aria-labelledby="uuid"
      class="dropdown-menu input-search-dropdown-menu-filter animation slide-in shadow"
      :class="{'visible-dropdown': isShowDropdown}"
    >
      <div
        v-for="(item, index) in autocompleteList"
        :key="index"
        class="dropdown-item dropdown-item-text-filter"
        @click="onClickItem(item)"
        v-tooltip="{title: item.name}"
      >
        {{ item.name }}
      </div>
      <div v-if="value.length > 2 && !autoListFilters.length" class="dropdown-item dropdown-item-none">
        Результатов нет
      </div>
    </div>

    <div
      v-else
      ref="dropdown"
      v-show="autoList.length === -1"
      :aria-labelledby="uuid"
      class="dropdown-menu input-search-dropdown-menu animation slide-in shadow">
      <div
        v-for="(item, index) in autoList"
        :key="index"
        class="dropdown-item"
        @click="onAutoItemClick(item)">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:value', 'search']);

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Поиск'
  },
  autocompleteList: {
    type: Array,
    default() {
      return [];
    }
  },
  autocompleteOptions: {
    type: Object,
    default() {
      return {};
    }
  },
  findTpl: {
    type: String,
    default: 'icon-default'
  },
  minLength: {
    type: Number,
    default: 0
  }
});

const inputEl = ref(null);
const dropdown = ref(null);
const uuid = 'search-' + generateString();
const isShowDropdown = ref(false)

const autoListFilters = computed(() => {
  return props.autocompleteList.map(item => item)
});

const autoList = computed(() => {
  let list = [];

  const filterToLowerCase = (item) => {
    return item.toLowerCase().includes((props.value.trim().toLowerCase()))
  };

  if (props.value.trim().length > 2) {
    list = props.autocompleteList.filter(
      (item) => filterToLowerCase(item)
    );
  }

  return list;
});

const trimmedValue = computed(() => {
  return props.value.trim();
});

const isFocused = ref(false);
let dropDownInst = null;

onMounted(() => {
  dropDownInst = window.$bootstrap.Dropdown.getInstance(dropdown.value);
});

const onAutoItemClick = (item) => {
  emit('update:value', item);
  onSearchClick();
};

const resetInputValue = () => {
  inputEl.value.value = '';
  emit('update:value', '');
  emit('search', '');
};

const onSearchClick = () => {
  if (trimmedValue.value.length < props.minLength) {
    return;
  }
  emit('search', trimmedValue.value);
};

const isOpenDropDown = ref(false)
const onClickItem = (item) => {
  emit('clickItem', item);
  isShowDropdown.value = false;
  isOpenDropDown.value = true
}

const onInput = ($event) => {
  emit('update:value', $event.currentTarget.value?.trim());
};

const onBlur = () => {
  isFocused.value = false;
};

const onFocus = () => {
  isFocused.value = true;
};

const focus = () => {
  inputEl.value?.focus();
};

const blur = () => {
  inputEl.value?.blur();
};

watch(
  () => props.value,
  (newValue) => {
    if (isOpenDropDown.value) {
      isOpenDropDown.value = false
      return;
    }

    isShowDropdown.value = newValue.length > 2
  }
);

defineExpose({focus, blur});
</script>

<style lang="scss">
@import '/assets/scss/theme';

.dropdown-item-text-filter {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visible-dropdown {
  position: absolute !important;
  inset: 0px auto auto 0px !important;
  margin: 0px !important;
  transform: translate(0px, 50px) !important;
  display: block !important;
  max-height: 350px;
  overflow-y: auto;
}

.dropdown-item-none {
  pointer-events: none !important;
}

.input-search {
  padding: 10px 16px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  transition: $transition;
  background: #fff;
  gap: 8px;
  height: 100%;
  
  &:hover {
    border-color: $color-dark;
  }

  &-icon:hover {
    color: $color-blue-normal;
  }

  &-input {
    padding: 0;
    border: none;
  }

  &-controls {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-find {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-icon {
    width: 24px;
    height: 24px;
    display: flex;
    cursor: pointer;
    color: #0D0C0C;

    &:hover {
      color: $color-blue-normal;
    }
  }

  &-btn {
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 0.4rem;
    margin-right: 2px;
    transition: $transition;
  }

  &-find-action {
    &.disabled {
      opacity: 0.2;
      filter: grayscale(1);
    }
  }

  &-reset-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: #0D0C0C;

    &:hover {
      color: $color-blue-normal;
    }
  }

  &-dropdown-menu {
    width: 100%;
    min-width: fit-content;
  }

  &-dropdown-menu-filter {
    width: 100%;
  }

  &--focus {
    border-color: $color-dark;
  }
}

.is-disabled {
  pointer-events: none;
  opacity: .5;
}

.input-search.theme-white {
  background-color: #fff;
}

.input-search.size-big {
  border-radius: 12px;

  .input-search-input {
    height: 50px;
    font-size: 18px;
    line-height: 165%;
    letter-spacing: -0.2px;
  }

  .input-search-icon {
    margin-right: 1rem;
    width: 24px;
    height: 24px;
  }

  .input-search-reset-icon {
    width: 1rem;
    height: 1rem;
    padding: 0;
  }
}
</style>
