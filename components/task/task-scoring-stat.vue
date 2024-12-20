<template>
  <div class="taskScoringStat">
    <div class="taskScoringStat-title">
      Всего баллов
    </div>

    <common-counter
      v-if="typeof maxScore === 'number'"
      :num="answer.answer.score"
      :total="maxScore"/>

    <div
      v-if="typeof task.criteria === 'object'"
      class="mt-5">
      Выбрано {{ criteriaSelected }} критериев из {{ criteriaCount }}
    </div>

    <div
      class="btn btn-primary mt-3"
      @click="emit('save-score')">
      Сохранить
    </div>
<!--Это -- кнопка отправки задания на проверку. Раскомментировать для отображения кнопки.
    <div
      v-if="logged"
      class="btn btn-simple w-100 mt-2"
      @click="emit('save-and-send-score')">
      Сохранить и отправить
    </div>
-->
  </div>
</template>

<script setup>
  const props = defineProps({
    task: {type: Object, required: true},
    answer: {type: Object, required: true},
    logged: {type: Boolean, required: true}
  });

  const emit = defineEmits(['save-score', 'save-and-send-score']);

  const groups = getCriteriaGroups(props.task, props.answer?.answer?.variant);
  const maxScore = groups ? groups.reduce((acc, group) => acc + group.maxScore, 0) : 0;
  const criteriaCount = groups ? groups.reduce((acc, group) => acc + group.list.length, 0) : 0;

  const criteriaSelected = computed(() => {
    return props.answer.answer.scores ? Object.keys(props.answer.answer.scores).length : 0;
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskScoringStat {
    border-radius: 1rem;
    border: 1px solid $color-normal;
    padding: 1.5rem;
    width: 295px;
  }

  .taskScoringStat-title {
    color: $color-dark;
  }
</style>
