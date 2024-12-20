<template>
  <div
    :class="[{'subjects-content-list--single': isSingleClass}]"
    class="subjects-content-list">
    <h4 class="subjects-content-list-subjects-header">
      Выберите предмет
    </h4>
    <div
      v-for="(classItem, index) in libraryStore.getTasksListByClasses"
      :key="index"
      class="subjects-content-list-classItems">
      <h5 class="subjects-content-list-class-header">
        {{ classItem.class }} класс
      </h5>
      <div class="subjects-content-list-subjects-list">
        <div
          v-for="(subjectItem, subjectIndex) in classItem.subjects"
          :key="subjectIndex"
          @click="onSubjectClick(subjectItem)"
          class="subjects-content-list-subjects-item">
          <span>{{ subjectItem.name }}</span>
          <span class="subjects-content-list-subjects-count">
            {{ subjectItem.tasks_count }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useLibrarySubjectsStore from '~/stores/library-subjects';

  const libraryStore = useLibrarySubjectsStore();
  const isSingleClass = computed(() => libraryStore.getTasksListByClasses.length === 1);

  const onSubjectClick = (subjectItem) => {
    libraryStore.setFilterValue('subjects', [subjectItem.id]);
    libraryStore.setFilterValue('classes', [subjectItem.parallel_id]);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .subjects-content-list {
    &-subjects-header {
      margin-bottom: 1.375rem;
    }

    &-subjects-list {
      column-count: 2;
      column-width: 1rem;
      max-width: 40rem;
    }

    &-subjects-item {
      cursor: pointer;
      transition: $transition;
      margin-bottom: 0.5rem;
      display: flex;
      gap: 0.25rem;

      &:hover {
        color: $color-blue-normal;
      }
    }

    &-subjects-count {
      color: $color-blue-normal;
    }

    &-classItems {
      margin-bottom: 3.25rem;
    }

    &-class-header {
      margin-bottom: 0.75rem;
    }

    &--single &-class-header {
      display: none;
    }
  }
</style>
