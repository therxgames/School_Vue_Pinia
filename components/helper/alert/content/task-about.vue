<template>
  <div class="ac-task-about">
    <div v-if="!progress">
      <div
        v-if="tags.length"
        class="ac-task-about-tags mb-4">
        <common-tag
          v-for="(tag, index) in tags"
          :key="index"
          :data="tag"
          @click="onLinkClick"/>
      </div>

      <task-props
        :task="store.task"
        :in-tests="store.containingTests"
        @link-click="onLinkClick"/>
    </div>

    <loader
      v-if="progress"
      :listener="progress"
      class="ac-task-about-loader"/>
  </div>
</template>

<script setup>
  import useTaskStore from '~/stores/task';
  import useLibraryStore from '~/stores/library-tasks';

  const props = defineProps(alertContentProps());
  const store = useTaskStore();
  const libraryStore = useLibraryStore();
  const route = useRoute();
  const progress = ref(true);
  const tags = computed(() => {
    return [...getTaskAutoTags(store.task)];
  });

  const onLinkClick = () => {
    props.context.hide();
  };

  onMounted(async () => {
    progress.value = true;
    await store.fetch(props.data.id, {
      answers: false,
      recommendedTasks: false,
      containingTests: true,
      nextTaskId: false
    });
    progress.value = false;
  });

  onBeforeUnmount(() => {
    store.$reset();
    progress.value = false;
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-about {
    &-tags {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    &-loader {
      --loader-spinner-width: 2rem;
      --loader-spinner-height: 2rem;
      --loader-min-height: none;

      display: inline-flex;
      width: auto;
      position: relative;
    }
  }
</style>
