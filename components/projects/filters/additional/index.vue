<template>
  <div class="d-flex mt-4">
    <div class="col-filter col-provider">
      <p class="label-text weight-500 mb-1 lh-160">Поставщик</p>
      <input-select-multi
        placeholder="Поставщик"
        name-field="title"
        when-select-all-placeholder="Поставщик"
        :list="dictionariesStore.optionsSuppliers"
        v-model:value="selectEducation"
      />
    </div>
    <div class="col-filter col-date">
      <p class="label-text weight-500 mb-1 lh-160">Дата публикации</p>
      <materials-filters-datepicker></materials-filters-datepicker>
    </div>
    <div class="col-filter col-education">
      <p class="label-text weight-500 mb-1 lh-160">Образование</p>
      <input-select-single
        placeholder="Образование"
        name-field="title"
        :list="dictionariesStore.optionsGeneralEducationLevels"
        v-model:value="selectGeneralEducationLevels"
        @update:value="
          (selectState) => materialsStore.setFilterByKey('generalEducationLevel', selectState)
        "
      />
    </div>
    <div class="col-filter col-year">
      <p class="label-text weight-500 mb-1 lh-160">Возраст</p>
      <input-radio-group
        type="button"
        name-field="age"
        theme="gaped"
        class="theme-small theme-list"
        :list="optionsMinAgesCorrect"
        v-model:value="isYearRadio"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useMaterialsStore from "~/stores/materials-library";

const dictionariesStore = useDictionariesCalendar();
const materialsStore = useMaterialsStore();

const selectEducation = ref<Array<number | string>>();
const selectGeneralEducationLevels = ref();
const isYearRadio = ref<number>();

type TMinAges = {
  id: string | number,
  age: string | number
}

const optionsMinAgesCorrect = computed(() => {
  if (!!dictionariesStore.optionsMinAges.length) {
    const newOptionsMinAges = dictionariesStore.optionsMinAges.map((item: TMinAges) => ({
      ...item,
      age: item.age + '+'
    }))

    return newOptionsMinAges
  }

  return []
})

onMounted(async () => {
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
});
</script>
<style lang="scss" scoped>
.col {
  &-filter {
    &:not(:last-child) {
      margin-right: 32px;
    }
  }

  &-provider {
    width: 38.4%;
  }

  &-date {
    width: 18.3%;
  }

  &-education {
    width: 16.8%;
  }

  &-year {
    width: 18.8%;
  }
}
</style>
