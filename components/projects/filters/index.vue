<template>
  <div class="d-flex gap-2 mb-3">
    <div class="col-search">
      <input-search
        placeholder="Поиск"
        class="theme-white size-big"
        v-model:value="searchInput"
      />
    </div>
    <div class="col-class">
      <input-select-multi
        placeholder="Классы"
        class="theme-white size-big"
        when-select-all-placeholder="Классы"
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
        placeholder="Предмет"
        class="theme-white size-big"
        when-select-all-placeholder="Предмет"
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
  <div class="d-flex justify-content-end">
    <slot name="button" />
  </div>
</template>

<script lang="ts" setup>
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useMaterialsStore from "~/stores/materials-library";
import { TEvent } from "~/components/calendar/filters/types";
import { selectAddValueToFilter } from "~/components/calendar/filters/helper";

const dictionariesStore = useDictionariesCalendar();
const materialsStore = useMaterialsStore();

const searchInput = ref();
const selectClasses = ref<Array<TEvent | number>>([]);
const selectCourses = ref<Array<TEvent | number>>([]);

watch(
  () => searchInput.value,
  () => {
    materialsStore.setFilterByKey("term", searchInput.value || null);
  }
);

onMounted(async () => {
  if (!dictionariesStore.optionsClasses.length) {
    await dictionariesStore.fetchClasses();
  }

  if (!dictionariesStore.optionsCourses.length) {
    await dictionariesStore.fetchCourses();
  }
});
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
