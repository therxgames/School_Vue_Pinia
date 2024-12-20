<template>
  <div
    class="taskItemTitle">
    <b>Ознакомьтесь с представленной информацией и выполните задания {{ numsText }}</b>
  </div>
</template>

<script setup>
  const props = defineProps({
    tasks: {type: Array, default: null}
  });

  const numsText = computed(() => {
    if (props.tasks) {
      return getNumsText(props.tasks.map((task) => task.order));
    } else {
      return '';
    }
  });
</script>

<style lang="scss">
  .taskItemTitle {
    padding: 1.5rem 2rem;
    margin-top: 1.25rem;
    border: 1px solid #ced6e0;
    border-radius: 16px 16px 0 0;
    background-color: #e6f3ff;
  }

  .taskItemTitle:first-child {
    margin-top: 0;
  }
</style>
