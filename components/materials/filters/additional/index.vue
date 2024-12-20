<template>
  <div class="d-flex mt-4 grid-filter">
    <div class="col-filter">
      <p class="label-text weight-500 mb-1 lh-160">Поставщик</p>
      <input-select-multi
        placeholder="Поставщик"
        name-field="title"
        when-select-all-placeholder="Поставщик"
        has-search-input
        no-hide-when-clicked
        :list="dictionariesStore.optionsSuppliers"
        v-model:value="selectSupplier"
        @update:value="
          (selectState) =>
            selectAddValueToFilter(
              selectState,
              'supplier',
              dictionariesStore.optionsSuppliers,
              materialsStore.setFilterByKey,
              'id'
            )
        "
      />
    </div>
    <div class="col-filter">
      <p class="label-text weight-500 mb-1 lh-160">Дата публикации</p>
      <materials-filters-datepicker></materials-filters-datepicker>
    </div>
    <div class="col-filter">
      <p class="label-text weight-500 mb-1 lh-160">Образование</p>
      <input-select-single
        placeholder="Образование"
        name-field="title"
        :list="dictionariesStore.optionsGeneralEducationLevels"
        v-model:value="selectGeneralEducationLevels"
        @update:value="
          (selectState) =>
            materialsStore.setFilterByKey('generalEducationLevel', selectState)
        "
      />
    </div>
    <div class="col-filter">
      <p class="label-text weight-500 mb-1 lh-160">Возраст</p>
      <input-radio-group
        type="button"
        name-field="age"
        theme="gaped"
        resettable
        no-last-value
        class="theme-small theme-list theme-base"
        :list="optionsMinAgesCorrect"
        v-model:value="isYearRadio"
        @update:value="(id: number) => {isYearRadio = id, onChangeFindValue(id, dictionariesStore.optionsMinAges, 'age', 'minAgeFrom')}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {getIdArrayByList, selectAddValueToFilter, stringToArrayNumber,} from "@/components/calendar/filters/helper";
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useMaterialsStore from "~/stores/materials-library";

const dictionariesStore = useDictionariesCalendar();
const materialsStore = useMaterialsStore();

const selectSupplier = ref<Array<number | string>>();
const selectGeneralEducationLevels = ref();
const isYearRadio = ref<number>();

type TMinAges = {
  id: string | number;
  age: string | number;
};

const optionsMinAgesCorrect = computed(() => {
  if (!!dictionariesStore.optionsMinAges.length) {
    const newOptionsMinAges = dictionariesStore.optionsMinAges.map(
      (item: TMinAges) => ({
        ...item,
        age: item.age + "+",
      })
    );

    return newOptionsMinAges;
  }

  return [];
});

const onChangeFindValue = (
  id: number | null,
  list: TMinAges[],
  key: string,
  filterKey: string
) => {
  const valueFilter = id ? getKeyFromAnArray(id, list, key) : null;

  materialsStore.setFilterByKey(filterKey, valueFilter ? valueFilter : null);
};

const updateFieldsOnLoad = () => {
  if (materialsStore.filters.supplier) {
    selectSupplier.value = stringToArrayNumber(materialsStore.filters.supplier);
  }

  if (materialsStore.filters.generalEducationLevel) {
    selectGeneralEducationLevels.value = Number(
      materialsStore.filters.generalEducationLevel
    );
  }

  if (materialsStore.filters.minAgeFrom) {
    const idArray = getIdArrayByList(
      materialsStore.filters.minAgeFrom,
      dictionariesStore.optionsMinAges,
      "age",
      true
    );

    isYearRadio.value = idArray[0];
  }
};

const handleResetFiltersMaterials = () => {
  selectSupplier.value = [];
  selectGeneralEducationLevels.value = null;
  isYearRadio.value = -1;
};

onMounted(async () => {
  eventBus.on("reset-filters-materials", handleResetFiltersMaterials);


  if (!dictionariesStore.optionsSuppliers.length) {
    // @ts-ignore
    await dictionariesStore.fetchSuppliers();
  }

  if (!dictionariesStore.optionsGeneralEducationLevels.length) {
    // @ts-ignore
    await dictionariesStore.fetchGeneralEducationLevels();
  }

  if (!dictionariesStore.optionsMinAges.length) {
    // @ts-ignore
    await dictionariesStore.fetchMinAges();
  }

  updateFieldsOnLoad();
});

onUnmounted(() => {
  eventBus.off("reset-filters-materials", handleResetFiltersMaterials);
});

</script>

<style lang="scss" scoped>
.grid-filter {
  gap: 0 2rem;
}

.col-filter {
  width: calc(25% - 24px);
}
</style>
