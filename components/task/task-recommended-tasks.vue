<template>
  <div
    v-if="tasks.length"
    class="taskRecommendedTasks">
    <h5 class="mb-2">
      Похожие
    </h5>

    <div class="taskRecommendedTasks-grid">
      <common-task-row
        v-for="(task, index) in showingTasks"
        :key="index"
        :data="task"
        :options="rowOptions"
        @favorite="emit('toggle-favorite', $event)"/>
    </div>

    <common-collapse
      v-if="tasks.length > 4"
      control-position="bottom"
      :expanded="false">
      <div class="taskRecommendedTasks-grid">
        <common-task-row
          v-for="(task, index) in collapsedTasks"
          :key="index"
          :data="task"
          :options="rowOptions"
          @favorite="emit('toggle-favorite', $event)"/>
      </div>

      <template #control>
        <a
          href="#"
          class="icon-text taskRecommendedTasks-moreBtn">
          Ещё
          {{ collapsedTasks.length }}
          {{ declension(collapsedTasks.length, lexicon.decl.tasks) }}
          <svg-icon
            class="taskRecommendedTasks-moreBtn-icon"
            name="arrow-right"/>
        </a>
      </template>
    </common-collapse>
  </div>
</template>

<script setup>
  const props = defineProps({
    tasks: {type: Array, required: true}
  });

  const emit = defineEmits(['toggle-favorite']);

  const rowOptions = {
    showMenu: false,
    showFavorite: false
  };

  const showingTasks = computed(() => props.tasks.slice(0, 4));
  const collapsedTasks = computed(() => props.tasks.slice(4));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskRecommendedTasks {
    margin-top: 3rem;
  }

  .taskRecommendedTasks-grid {
    margin: 0 -1.25rem;
    align-content: flex-start;

    .task-row {
      position: relative;
      border-radius: 0.7rem;
      padding: 0.75rem 1.2rem;

      .task-row-title-name {
        padding-right: 2rem;
      }

      .task-row-content {
        grid-template-columns:
          minmax(28px, 28px)
          minmax(55px, 55px)
          minmax(230px, 520px)
          minmax(150px, 155px)
          minmax(60px, 70px)
          minmax(40px, 40px)
          auto;

        .task-row-actions {
          display: none;
        }
      }

      &.task-row--no-favorite {
        .task-row-content {
          grid-template-columns:
            minmax(55px, 55px)
            minmax(230px, 560px)
            minmax(150px, 155px)
            minmax(60px, 70px)
            minmax(40px, 40px)
            auto;
        }
      }
    }
  }

  .taskRecommendedTasks-moreBtn {
    margin-top: 1rem;
    color: $color-blue-normal;

    &-icon {
      --icon-width: 0.4rem;

      gap: 1rem;
    }

    &:hover {
      color: $color-blue-dark;
    }
  }

  .collapse.show + * > .taskRecommendedTasks-moreBtn {
    pointer-events: none;
    opacity: 0;
  }
</style>
