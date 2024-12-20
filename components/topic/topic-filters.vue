<template>
  <div class="topic-filters">
    <h5 class="mb-3">
      Выбирай и решай
    </h5>

    <label class="topic-filters-label">Год задания</label>

    <input-select-multi
      placeholder="Все"
      when-select-all-placeholder="Все года"
      :list="years"
      v-model:value="year"
      class="mb-3 mt-2"/>

    <label class="topic-filters-label">Сложность</label>

    <input-select-multi
      placeholder="Любая"
      when-select-all-placeholder="Все сложности"
      :list="complexityTypes"
      v-model:value="complexity"
      class="mb-3 mt-2"/>

    <label class="topic-filters-label">Тип задания</label>

    <input-select-multi
      placeholder="Все"
      when-select-all-placeholder="Все типы"
      :list="taskTypes"
      v-model:value="taskType"
      class="mb-4 mt-2"/>

    <div v-if="selected > 0">
      <div class="topic-filters-label mb-2">
        Выбрано заданий
      </div>

      <common-counter
        :num="selected"
        :total="total"/>

      <a
        href="#"
        class="btn btn-primary w-100 mt-4"
        @click.prevent="start">
        Решать
      </a>
    </div>

    <div v-else>
      <div
        class="mt-4"
        style="color: #7f838a;">
        Мы ничего не нашли
      </div>

      <div class="mt-3">
        <a
          href="#"
          class="d-flex align-items-center"
          @click.prevent="reset">
          <svg-icon
            name="cross"
            style="width: 0.5rem; height: 0.5rem; margin-right: 0.5rem; margin-top: 0.2rem;"/>
          Сбросить фильтры
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
  const YEARS = [
    {id: 2, name: '2023', value: 2023},
    {id: 3, name: '2022', value: 2022},
    {id: 4, name: '2021', value: 2021},
    {id: 5, name: '2020', value: 2020},
    {id: 6, name: '2019', value: 2019},
    {id: 7, name: '2018', value: 2018},
    {id: 8, name: '2017', value: 2017},
    {id: 9, name: '2016', value: 2016},
    {id: 10, name: '2015', value: 2015},
    {id: 11, name: '2014', value: 2014},
    {id: 12, name: '2013', value: 2013},
    {id: 13, name: '2012', value: 2012},
    {id: 14, name: '2011', value: 2011},
    {id: 15, name: '2010', value: 2010},
    {id: 16, name: '2009', value: 2009},
    {id: 17, name: '2008', value: 2008},
    {id: 18, name: '2007', value: 2007}
  ];

  const COMPLEXITY_TYPES = [
    {id: 2, name: 'Базовая', value: 'simple'},
    {id: 3, name: 'Средняя', value: 'medium'},
    {id: 4, name: 'Углубленная', value: 'complex'}
  ];

  const TASK_TYPES = [
    {id: 2, name: 'Выбрать ответ', value: 'CHOOSE_ANSWER'},
    {id: 3, name: 'Ввести ответ', value: 'ENTER_ANSWER'},
    {id: 4, name: 'Свободный ответ', value: 'FREE_ANSWER'},
    {id: 5, name: 'Таблица', value: 'TABLE_ANSWER'},
    {id: 6, name: 'Расположить по порядку', value: 'ORDER_ANSWER'},
    {id: 7, name: 'Вставить пропущенное', value: 'GAP_MATCH_TEXT_ANSWER'},
    {id: 7, name: 'Установить соответствие', value: 'GAP_MATCH_TABLE_ANSWER'}
  ];

  const props = defineProps({
    allFilters: {type: Object, required: true},
    selected: {type: Number, required: true},
    total: {type: Number, required: true},
    step: {type: String, required: true}
  });

  const years = computed(() => {
    return YEARS.filter((year) => props.allFilters.years.includes(year.value) || year.value === null);
  });

  const complexityTypes = computed(() => {
    return COMPLEXITY_TYPES.filter((type) => props.allFilters.complexityTypes.includes(type.value) || type.value === null);
  });

  const taskTypes = computed(() => {
    return TASK_TYPES.filter((type) => props.allFilters.taskTypes.includes(type.value) || type.value === null);
  });

  const emit = defineEmits(['start', 'change']);

  let year = ref([]);
  let complexity = ref([]);
  let taskType = ref([]);

  const start = () => {
    emit('start');
  };

  const reset = () => {
    year.value = [];
    complexity.value = [];
    taskType.value = [];
  };

  const change = () => {
    emit('change', {
      year: YEARS.filter((y) => year.value.includes(y.id)).map((y) => y.value),
      complexity: COMPLEXITY_TYPES.filter((t) => complexity.value.includes(t.id)).map((t) => t.value),
      taskType: TASK_TYPES.filter((t) => taskType.value.includes(t.id)).map((t) => t.value)
    });
  };

  watch(year, change);
  watch(complexity, change);
  watch(taskType, change);
</script>

<style lang="scss">
  .topic-filters {
    border-radius: 1rem;
    border: 1px solid #ced6e0;
    padding: 1.5rem 1rem 1rem;
  }

  .topic-filters-label {
    color: #7f838a;
    font-size: 0.875rem;
  }
</style>
