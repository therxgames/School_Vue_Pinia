<template>
  <div
      ref="selectContainer"
      :class="[
      { 'input-select--opened': listShow },
      { 'input-select--filled': props.value.length > 0 },
      { 'input-select--disabled': props.disabled },
    ]"
      class="dropdown input-select"
  >
    <div
        v-if="!hasSearchInput"
        @click="toggleList"
        ref="btnToggle"
        class="btn"
        aria-expanded="true"
    >
      <span class="input-select-value">{{ isOnlyPlaceHolder ? placeholder : value }}</span>
      <svg-icon name="arrow-bottom" class="input-select-arrow"/>
    </div>
    <template v-else>
      <div ref="btnToggle">
        <input
            ref="searchInputRef"
            class="input-select-search w-100"
            type="text"
            placeholder="Поиск"
            v-model="searchInputModel"
            @input="changeSearchInput"
        />
      </div>
      <div
          @click="toggleList"
          class="toggle-icon position-absolute d-inline-flex"
      >
        <svg-icon name="arrow-bottom" class="input-select-arrow"/>
      </div>
    </template>
    <div
        v-show="list.length"
        class="dropdown-menu animation slide-in shadow input-select-dropdownMenu"
    >
      <template v-if="selected.length">
        <div
            v-if="!hasSearchInput"
            class="input-select-dropdownTitle dropdown-item"
        >
          {{ props.placeholder }}
        </div>
        <div
            v-for="(item, index) in selected"
            :key="index"
            @click="listItemClick(item, true)"
            class="dropdown-item input-select-dropdown-item input-select-item--selected mb-1"
        >
          <svg-icon class="input-select-item-selectedIcon" name="check"/>
          <span :title="item[props.nameField]">{{
              truncateString(item[props.nameField], props.truncateFrom)
            }}</span>
        </div>
        <div v-if="selected.length < list.length" class="dropdown-divider"/>
      </template>

      <div ref="scroller" class="input-select-scroller scroller-default">
        <div
            v-for="(item, index) in selectable"
            :key="index"
            @click="listItemClick(item)"
            :class="[
            { 'input-select-dropdown-item--disabled': item.disabled === true },
            { 'd-none': item.hidden === true },
          ]"
            class="dropdown-item input-select-dropdown-item"
        >
          <svg-icon
              v-if="item.icon"
              class="input-select-dropdown-itemIcon"
              :name="item.icon.name"
              :fill="item.icon.fill"
          />
          <span :title="item.name">{{
              truncateString(item[props.nameField], props.truncateFrom)
            }}</span>
        </div>
      </div>

      <template
          v-if="(list.length && !selected.length < 1) || !selectable.length < 1"
      >
        <div class="dropdown-divider"/>
        <div
            @click="resetSelected"
            :class="{ 'input-select-item-reset--disabled': !props.value.length }"
            class="dropdown-item input-select-item-reset"
        >
          Сбросить
        </div>
      </template>
      <div
          v-if="selected.length < 1 && selectable.length < 1"
          class="no-result-item"
      >
        Нет вариантов для выбора
      </div>
    </div>

    <transition name="transition-fade">
      <div
          v-if="props.value.length && props.showSelectedCount"
          class="input-select-selectedCount"
      >
        {{ props.value.length }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import {onClickOutside} from "@vueuse/core";
import SmoothScrollbar from "smooth-scrollbar";

const emit = defineEmits(["update:value"]);
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "",
  },
  whenSelectAllPlaceholder: {
    type: String,
    default: "",
  },
  showSelectedCount: {
    type: Boolean,
    default: true,
  },
  showedZindex: {
    type: String,
    default: "200",
  },
  closedZindex: {
    type: String,
    default: "10",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => [],
  },
  nameField: {
    type: String,
    default: "name",
  },
  maxHeight: {
    type: String,
    default: "300px",
  },
  truncateFrom: {
    type: Number,
    default: 35,
  },
  hasSearchInput: {
    type: Boolean,
    default: false,
  },
  noHideWhenClicked: {
    type: Boolean,
    default: false,
  },
  isOnlyPlaceHolder: {
    type: Boolean,
    default: false
  }
});
const listShow = ref(false);
const btnToggle = ref(null);
const scroller = ref(null);
const selectContainer = ref(null);
const value = computed(() => {
  if (props.value.length) {
    if (
        props.value.length > 0 &&
        props.value.length === props.list.length &&
        props.whenSelectAllPlaceholder
    ) {
      return props.whenSelectAllPlaceholder;
    }

    let value = getItemsByIds(props.value)
    .reduce((acc, item) => {
      acc.push(item.short || item[props.nameField]);
      return acc;
    }, [])
    .join(", ");

    return value.trim() ? value : "***";
  }

  return props.placeholder;
});

const listConvertBySearch = computed(() => {
  if (searchInputModel.value) {
    const filteredList = props.list.filter((item) =>
        item.title.toLowerCase().includes(searchInputModel.value.toLowerCase())
    );
    return filteredList;
  } else {
    return [...props.list];
  }
});

const selectable = computed(() => {
  if (props.hasSearchInput) {
    return listConvertBySearch.value.filter(
        (_item) =>
            !props.value.some((_selectedItem) => _selectedItem === _item.id)
    );
  }

  return props.list.filter(
      (_item) => !props.value.some((_selectedItem) => _selectedItem === _item.id)
  );
});
const selected = computed(() => {
  return getItemsByIds(props.value);
});
const searchInputRef = ref();
const searchInputModel = ref();
let selectedItems = ref(props.value);
let dropDownInst = null;
let scrollerInst = null;

watch(
    () => listShow.value,
    (show) => {
      if (show) {
        dropDownInst.show();
        selectContainer.value.style.setProperty("--z-index", props.showedZindex);
      } else {
        dropDownInst.hide();
        selectContainer.value.style.setProperty("--z-index", props.closedZindex);
      }

      selectContainer.value.style.setProperty("--max-height", props.maxHeight);
    }
);

watch(
    () => props.value,
    (value) => (selectedItems.value = value)
);

onMounted(() => {
  dropDownInst = new window.$bootstrap.Dropdown(btnToggle.value, {
    offset: [0, 5],
  });
  scrollerInst = SmoothScrollbar.init(scroller.value, {
    alwaysShowTracks: true,
  });
  onClickOutside(selectContainer.value, hideList);
});
onUnmounted(() => {
  if (dropDownInst) {
    dropDownInst.dispose();
    dropDownInst = null;
  }
  if (scrollerInst) {
    SmoothScrollbar.destroy(scroller.value);
  }
});

const toggleList = () => {
  listShow.value = !listShow.value;

  if (props.hasSearchInput) {
    searchInputModel.value = "";
    searchInputRef.value.focus();
  }
};
const hideList = () => {
  listShow.value = false;

  if (props.hasSearchInput && searchInputModel.value) {
    searchInputModel.value = "";
  }
};
const listItemClick = (item) => {
  let index = selectedItems.value.findIndex((_item) => _item === item.id);
  index > -1
      ? selectedItems.value.splice(index, 1)
      : selectedItems.value.push(item.id);

  emit("update:value", [...selectedItems.value]);

  if (props.hasSearchInput) {
    searchInputRef.value.focus();
  }
};
const resetSelected = () => {
  emit("update:value", []);

  if (!props.noHideWhenClicked) {
    hideList();
  }
};
const getItemsByIds = (ids) => {
  if (props.hasSearchInput) {
    return listConvertBySearch.value.filter((item) => ids.includes(item.id));
  }

  return props.list.filter((item) => ids.includes(item.id));
};

const changeSearchInput = () => {
  if (searchInputModel.value.length > 0) {
    listShow.value = true;
  }
};
</script>

<style lang="scss">
@import "/assets/scss/theme";

.input-select {
  --z-index: 10;
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
  min-width: fit-content;
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

.input-select-selectedCount {
  width: 1.5rem;
  height: 1.5rem;
  background: #f2f5fa;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 10rem;
  top: 50%;
  right: 2.3rem;
  transform: translateY(-50%);
  pointer-events: none;
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

.input-select.theme-white {
  .btn {
    background-color: #fff;
  }
}

.input-select.size-big {
  .btn {
    min-height: 56px;
    border-radius: 12px;
  }

  .input-select-value {
    font-size: 18px;
    line-height: 165%;
    letter-spacing: -0.2px;
  }
}

.input-select-search {
  background-color: #fff;
  padding: 10px 16px;
  font-size: 16px;
  gap: 8px;
  border-radius: 0.5rem;
  border: 1px solid #ced6e0;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: #7f838a;
    outline: none;
  }
}

.toggle-icon {
  top: calc(50% - 7px);
  right: 0;
}

.no-result-item {
  margin: 0 0.26rem;
  padding: 10.4px 20px;
  color: rgb(147, 151, 158);
  cursor: default;
}
</style>
