<template>
  <div class="ac-task-answers-history-enter">
    <div
      :title="answer.answer[0]"
      class="ac-task-answers-history-enter-content">
      {{ answer.answer[0] }}
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    task: {
      type: Object,
      default() {
        return {};
      }
    },
    answer: {
      type: Object,
      default() {
        return {};
      }
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history-enter {
    &-content {
      max-height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
