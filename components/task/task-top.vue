<template>
  <div>
    <div
      v-if="!versionsFeatureAllow"
      class="taskTop-header mb-4">
      <h1 class="taskTop-title">
        Задание
      </h1>

      <div
        v-if="!task.is_current"
        class="taskTop-version">
        <span>Версия {{ task.version_number }} от {{ formatDate(task.created_at) }}</span>

        <router-link
          :to="`/task/${task.current.id}`"
          class="icon-text taskTop-toCurrentVersion">
          <svg-icon name="reset"/>
          <span>Вернуться в текущую</span>
        </router-link>
      </div>
    </div>

    <div
      v-if="versionsFeatureAllow"
      class="taskTop-header taskTop-header--withVersions mb-4">
      <h1 class="taskTop-title">
        Задание #{{ task.parent_id }}
      </h1>

      <common-task-version-selector
        :current-task-id="+route.params.id"
        :task-parent-id="task.parent_id"/>
    </div>

    <task-versions-difference
      v-if="versionsFeatureAllow"
      class="mb-3"
      :task-parent-id="task.parent_id"
      :version-one="+route.params.id"/>

    <div
      v-if="tags"
      class="taskTop-tags mb-4">
      <common-tag
        v-for="(tag, index) in tags"
        :key="index"
        :data="tag"/>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const userStore = useUserStore();
  const route = useRoute();

  const props = defineProps({
    task: {type: Object, required: true}
  });

  const tags = computed(() => {
    return [...getTaskAutoTags(props.task)];
  });

  const versionsFeatureAllow = computed(() => {
    return userStore.logged && (userStore.currentRole === role.ADMIN || userStore.currentRole === role.USER);
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskTop-back {
    color: $color-dark;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.125rem;

    &-icon {
      width: 0.313rem;
      height: 0.625rem;
    }
  }

  .taskTop-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .taskTop-title {
    margin-bottom: 0;
  }

  .taskTop-version {
    display: flex;
    gap: 1.5rem;
    font-size: 0.875rem;
    color: $color-dark;
  }

  .taskTop-toCurrentVersion {
    --icon-width: 0.9rem;

    color: $color-blue-normal !important;

    svg path {
      fill: $color-blue-normal !important;
    }
  }

  .taskTop-header--withVersions {
    gap: 1.5rem;

    .taskTop-title {
      white-space: nowrap;
    }

    .input-select-dropdown-itemIcon {
      width: 0.5rem;
      height: 0.5rem;
    }

    .input-select-dropdown-item {
      gap: 0.5rem;
    }
  }

  .taskTop-tags {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.875rem;
  }
</style>
