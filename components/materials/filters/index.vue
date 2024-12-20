<template>
  <div class="d-flex gap-2 mb-3">
    <div class="col-search">
      <input-search
        placeholder="Поиск"
        :class="{ 'is-disabled': isDisabled }"
        class="theme-white"
        v-model:value="searchInput"
      />
    </div>
    <div class="col-class">
      <input-select-multi
        :is-only-place-holder="true"
        placeholder="Классы"
        class="theme-white size-big"
        when-select-all-placeholder="Классы"
        :disabled="isDisabled"
        :list="dictionariesStore.optionsClasses"
        v-model:value="selectClasses"
        @update:value="
          (selectState) =>
            selectAddValueToFilter(
              selectState,
              'class',
              dictionariesStore.optionsClasses,
              materialsStore.setFilterByKey
            )
        "
      />
    </div>
    <div class="col-item">
      <input-select-multi
        :is-only-place-holder="true"
        placeholder="Предмет"
        class="theme-white size-big"
        when-select-all-placeholder="Предмет"
        :disabled="isDisabled"
        :list="dictionariesStore.optionsCourses"
        v-model:value="selectCourses"
        @update:value="
          (selectState) =>
            selectAddValueToFilter(
              selectState,
              'course',
              dictionariesStore.optionsCourses,
              materialsStore.setFilterByKey
            )
        "
      />
    </div>
  </div>
  <div
    :class="{ 'pe-none opacity-50': isDisabled }"
    class="d-flex justify-content-end"
  >
    <slot name="button"/>
  </div>
</template>

<script lang="ts" setup>
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useMaterialsStore from "~/stores/materials-library";
import {TEvent} from "~/components/calendar/filters/types";
import {getIdArrayByList, selectAddValueToFilter,} from "~/components/calendar/filters/helper";

const dictionariesStore = useDictionariesCalendar();
const materialsStore = useMaterialsStore();

const searchInput = ref();
const selectClasses = ref<Array<TEvent | number>>([]);
const selectCourses = ref<Array<TEvent | number>>([]);
const isDisabled = ref(true);

watch(
  () => searchInput.value,
  () => {
    materialsStore.setFilterByKey("term", searchInput.value || null);
  }
);

const updateFieldsOnLoad = () => {
  if (materialsStore.filters.term) {
    searchInput.value = materialsStore.filters.term;
  }

  if (materialsStore.filters.class) {
    const idArray = getIdArrayByList(
      materialsStore.filters.class,
      dictionariesStore.optionsClasses,
      "code"
    );

    selectClasses.value = [...idArray];
  }

  if (materialsStore.filters.course) {
    const idArray = getIdArrayByList(
      materialsStore.filters.course,
      dictionariesStore.optionsCourses,
      "code"
    );

    selectCourses.value = [...idArray];
  }
};
const resetFiltersMaterials = () => {
  searchInput.value = "";
  selectClasses.value = [];
  selectCourses.value = [];
};

onMounted(async () => {
  eventBus.on("reset-filters-materials", resetFiltersMaterials);

  if (!dictionariesStore.optionsClasses.length) {
    await dictionariesStore.fetchClasses();
  }

  if (!dictionariesStore.optionsCourses.length) {
    await dictionariesStore.fetchCourses();
  }

  updateFieldsOnLoad();

  isDisabled.value = false;
});

onMounted(() => {
  eventBus.off("reset-filters-materials", resetFiltersMaterials);
})
</script>

<style lang="scss" scoped>
.col-class {
  width: 13.8%;
}

.col-item {
  width: 23%;
}

.col-search {
  width: 62%;
}
</style>
