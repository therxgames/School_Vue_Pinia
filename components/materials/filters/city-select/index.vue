<template>
  <div
    class="city-select position-relative"
    ref="selectContainer"
    :class="[{ 'input-select--opened': true }]"
  >
    <button
      class="city-select-button c-white weight-500 d-flex align-items-center"
      role="button"
      @click="toggleList"
    >
      <span class="city-select-button-text">{{ selectedRegion }}</span>
      <svg-icon
        name="caret-drop-down"
        class="caret-drop-down"
        :class="{ 'caret-drop-down_isShow': showMenu }"
      />
    </button>
    <div
      v-show="showMenu"
      class="city-select-dropdown dropdown-menu animation slide-in shadow"
    >
      <div class="city-select-search">
        <input-search placeholder="Поиск" v-model:value="searchInput" />
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
        <div class="dropdown-divider" />
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
import useMaterialsLibraryStore from "~/stores/materials-library";
import { onClickOutside } from "@vueuse/core";
import SmoothScrollbar from "smooth-scrollbar";

const dictionariesCalendar = useDictionariesCalendar();
const materialsStore = useMaterialsLibraryStore();

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

const resetBtn = computed(() => !!materialsStore.filters.region);

const selectedRegion = computed(() => {
  if (materialsStore.filters.region) {
    return dictionariesCalendar.regionOptions.find(
      (item) => item.value === materialsStore.filters.region
    )?.label;
  }

  return "Все регионы РФ";
});

let scrollerInst = null;

const toggleList = () => (showMenu.value = !showMenu.value);

const onSelectRegion = (regionValue) => {
  materialsStore.setFilterByKey("region", regionValue.value);

  showMenu.value = false;
  searchInput.value = "";
};

if (!dictionariesCalendar?.regionOptions.length) {
  // @ts-ignore
  await useAsyncData("dictionaries-calendar", () =>
    Promise.all([dictionariesCalendar.fetchRegions()])
  );
}

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
  materialsStore.setFilterByKey("region", null);
};
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.caret-drop-down {
  transition: transform 0.2s;
  margin-right: -8px;

  &_isShow {
    transform: rotate(-180deg);
  }
}

.city-select-button {
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  gap: 8px;
}

.city-select-dropdown {
  width: 22rem;
  display: block;
  top: 34px;
  left: -20px;
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
