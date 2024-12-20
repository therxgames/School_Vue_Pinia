<template>
  <div
    class="city-select"
    ref="selectContainer"
    :class="[{ 'input-select--opened': true }]"
  >
    <button class="city-select-button" @click="toggleList">
      <svg-icon name="location"/>
      <span class="city-select-button-text">{{ selectedRegion }}</span>
    </button>
    <div
      v-show="showMenu"
      class="city-select-dropdown dropdown-menu animation slide-in shadow"
    >
      <div class="city-select-search">
        <input-search placeholder="Поиск" v-model:value="searchInput"/>
      </div>
      <div ref="scroller" class="input-select-scroller scroller-default">
        <div
          v-for="item of regionList"
          :key="item.value"
          :class="[
            { 'input-select-dropdown-item--disabled': item.disabled === true },
            { 'is-active': item.label === selectedRegion },
          ]"
          class="dropdown-item input-select-dropdown-item"
          @click="onSelectRegion(item)"
        >
          <span class="input-select-value">{{ item.label }}</span>
        </div>
      </div>
      <template v-if="regionList.length && resetBtn">
        <div class="dropdown-divider"/>
        <div
          @click="resetSelected"
          class="dropdown-item input-select-item-reset"
        >
          Cбросить
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useCalendareStore from "~/stores/calendar";
import {onClickOutside} from "@vueuse/core";
import SmoothScrollbar from "smooth-scrollbar";

const dictionariesCalendar = useDictionariesCalendar();
const calendarStore = useCalendareStore();
const searchInput = ref();
const showMenu = ref(false);
const scroller = ref(null);
const selectContainer = ref(null);
const regionList = computed(() => {
  if (searchInput.value) {
    const filteredList = dictionariesCalendar.regionOptions.filter((item) =>
      item.label.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    return filteredList;
  } else {
    return dictionariesCalendar.regionOptions || [];
  }
});

const resetBtn = computed(() => !!calendarStore.filters.region);

const selectedRegion = computed(() => {
  if (calendarStore.filters.region) {
    return dictionariesCalendar.regionOptions.find(
      (item) => item.value === calendarStore.filters.region
    )?.label;
  }

  return "Все регионы РФ";
});

let scrollerInst = null;

const toggleList = () => (showMenu.value = !showMenu.value);

const onSelectRegion = (regionValue) => {
  calendarStore.setFilterByKey("region", regionValue.value);

  showMenu.value = false;
  searchInput.value = "";
};

onMounted(async () => {
  scrollerInst = SmoothScrollbar.init(scroller.value, {
    alwaysShowTracks: true,
  });
  onClickOutside(selectContainer.value, () => {
    showMenu.value = false;
  });
});

onUnmounted(() => {
  if (scrollerInst) {
    SmoothScrollbar.destroy(scroller.value);
  }
});

const resetSelected = () => {
  calendarStore.setFilterByKey("region", null);
};
</script>

<style lang="scss" scoped>
.city-select {
  position: relative;
}

.city-select-button {
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  color: #1b59f5;
  gap: 8px;
  font-size: 16px;
  cursor: pointer;
}

.city-select-dropdown {
  width: 22rem;
  display: block;
  top: 100%;
  right: 0;
  padding: 15px;
}

.city-select-search {
  margin-bottom: 15px;
}

.input-select-scroller {
  max-height: 400px;
}

.dropdown-item.is-active {
  background-color: #1b59f5;
  color: #fff;
}
</style>
