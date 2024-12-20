<template>
  <div class="commonResultsFilters">
    <input-radio-group
      type="button"
      :list="correctnessList"
      :value="correctnessFilter"
      label-class-names="commonResultsFilters-correctnessBtn"
      @update:value="emit('correctness-filter-change', $event)"/>

    <a
      href="#"
      class="commonResultsFilters-toggleSolutionsBtn"
      @click.prevent="emit('toggle-solutions')">
      <svg-icon
        v-if="showSolutions"
        name="eye-open"
        class="commonResultsFilters-toggleSolutionsBtn-icon"/>
      <svg-icon
        v-else
        name="eye-closed"
        class="commonResultsFilters-toggleSolutionsBtn-icon"/>
      <span v-if="showSolutions">Скрыть правильные ответы</span>
      <span v-else>Показать правильные ответы</span>
    </a>
  </div>
</template>

<script setup>
  const props = defineProps({
    correctnessFilter: {type: Number, required: true},
    showSolutions: {type: Boolean, required: true}
  });

  const emit = defineEmits(['toggle-solutions', 'correctness-filter-change']);

  const correctnessList = [
    {id: 1, name: 'Все'},
    {id: 2, name: 'Верно'},
    {id: 3, name: 'Неверно'}
  ];
</script>

<style lang="scss">
  .commonResultsFilters-correctnessBtn {
    background-color: #fff;
  }

  .commonResultsFilters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .commonResultsFilters-toggleSolutionsBtn {
    display: flex;
    align-items: center;
    color: #7f838a;
    font-size: 0.875rem;
  }

  .commonResultsFilters-toggleSolutionsBtn-icon {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.5rem;
  }
</style>
