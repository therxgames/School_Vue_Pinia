<template>
  <div class="topic-stat">
    <div class="topic-stat-label">
      Ответы
    </div>

    <common-counter
      :num="notEmptyCount"
      :total="tasks.length"/>

    <a
      href="#"
      class="btn btn-primary w-100 mt-4"
      @click.prevent="$emit('end')">
      Завершить
    </a>
  </div>
</template>

<script setup>
  const props = defineProps({
    answers: {type: Array, required: true},
    tasks: {type: Array, required: true}
  });

  const notEmptyCount = computed(() => {
    return props.answers.filter((answer) => {
      const task = props.tasks.find((task) => task.id === answer.task_id);
      return answerIsFilled(task, answer);
    }).length;
  });

  const emit = defineEmits(['end']);
</script>

<style lang="scss">
  .topic-stat {
    border-radius: 1rem;
    border: 1px solid #ced6e0;
    padding: 1.5rem;
  }

  .topic-stat-label {
    color: #7f838a;
    font-size: 0.875rem;
  }
</style>
