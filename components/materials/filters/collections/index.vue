<template>
  <div class="mt-4">
    <input-checkbox-group
      type="button"
      name-field="title"
      class="size-big theme-base"
      :class="{ 'pe-none opacity-50': isDisabled }"
      :list="dictionariesStore.optionsCollections"
      v-model:value="checkboxCollections"
      @update:value="
        (id) =>
          selectAddValueToFilter(
            id,
            'collection',
            dictionariesStore.optionsCollections,
            materialsStore.setFilterByKey,
            'id'
          )
      "
    />
  </div>
</template>

<script lang="ts" setup>
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useMaterialsStore from "~/stores/materials-library";
import {selectAddValueToFilter,} from "@/components/calendar/filters/helper";

const dictionariesStore = useDictionariesCalendar();
const materialsStore = useMaterialsStore();
const isDisabled = ref(true);

const checkboxCollections = ref<number[]>([]);

const updateFieldsOnLoad = () => {
  if (materialsStore.filters.collection) {
    const newCollectionArray = String(materialsStore.filters.collection).split(',')

    checkboxCollections.value = newCollectionArray.map((item) => Number(item));
  }
};

if (!dictionariesStore?.optionsCollections.length) {
  // @ts-ignore
  await useAsyncData("dictionaries-calendar", () =>
    Promise.all([dictionariesStore.fetchCollections()])
  );
}

const resetFiltersMaterials = () => checkboxCollections.value = [];

onMounted(async () => {
  eventBus.on('reset-filters-materials', resetFiltersMaterials);
  updateFieldsOnLoad();

  isDisabled.value = false;
});

onUnmounted(() => {
  eventBus.off('reset-filters-materials', resetFiltersMaterials);
})
</script>
