<template>
  <div class="ac-task-answers-history-free">
    <div
      v-if="answer.answer?.variant"
      class="ac-task-answers-history-free-variant mb-2">
      Вариант {{ answer.answer.variant }}
    </div>

    <div
      v-if="answer.answer?.comment"
      :title="answer.answer.comment"
      class="ac-task-answers-history-free-comment mb-2">
      <span>{{ answer.answer.comment }}</span>
    </div>

    <div
      v-if="answer.score"
      class="ac-task-answers-history-free-score mb-2">
      {{ answer.score }}<span v-if="answer.answer_expertises_point">/ {{ answer.answer_expertises_point }}</span>
      {{ declension(answer.score, lexicon.decl.points) }}
    </div>

    <div class="ac-task-answers-history-free-files mb-4">
      <a
        v-for="(fileItem, index) in files"
        :key="index"
        class="ac-task-answers-history-free-file-item"
        :href="fileItem.href"
        target="_blank">
        {{ fileItem.ext }}
      </a>
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
  const files = computed(() => {
    return props.answer.filenames?.map((filenameItem) => {
      return {
        ...filenameItem,
        href: useRuntimeConfig().public.API_URL + '/' + filenameItem.filename,
        ext: filenameItem.filename?.split('.')?.pop()?.toUpperCase()
      };
    });
  });
  const uuid = generateString();
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history-free {
    padding-right: 2rem;

    &-files {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    &-file-item {
      font-size: 0.875rem;
      border-bottom: 1px solid;
    }

    &-variant {
      font-weight: 500;
    }

    &-comment {
      display: flex;
      align-items: flex-start;
      background: $color-black-10;
      padding: 0.625rem 1rem;
      border-radius: 0.5rem;
      overflow: hidden;
      max-height: 5.5rem;

      &-icon {
        width: 2rem;
      }
    }

    &-score {
      font-weight: 500;
      font-size: 1.2rem;
    }
  }
</style>
