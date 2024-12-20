<template>
  <div class="library-content-tasks">
    <div
      :class="{'fetching': libraryStore.fetching}"
      class="library-content-tasks-container">
      <common-result-info
        :visible-if="renderController.commonResultInfo.visibleIf"
        :reset-visible-if="renderController.commonResultInfo.resetVisibleIf"
        :count="libraryStore.filters.page.total"
        @reset="libraryStore.resetFilters"
        class="library-content-tasks-info"/>

      <div
        ref="libraryContent"
        v-if="renderController.content"
        :class="['library-content-tasks-' + libraryStore.getFilterValue('mode')]"
        class="library-content">
        <component
          v-for="(item, index) in libraryStore.list"
          :is="resolveContentComponentName(item)"
          :options="contentComponentOptions(item)"
          :key="index"
          :data="item"
          @favorite="toggleTaskFavorite"/>
      </div>

      <common-empty
        v-if="renderController.commonEmpty"
        @click="libraryStore.resetFilters()"/>

      <common-pagination
        :list="libraryStore.list"
        :pagination="libraryStore.filters.page"
        @page="onPage"
        @show-more="onShowMore"
        class="library-content-tasks-pagination"/>
    </div>
    <loader
      class="library-content-tasks-loader"
      :listener="libraryStore.fetching"/>
  </div>
</template>

<script setup>
  import useLibraryTasksStore from '~/stores/library-tasks';

  const libraryStore = useLibraryTasksStore();
  const libraryContent = ref(null);
  const renderController = computed(() => ({
    commonResultInfo: {
      visibleIf: libraryStore.list.length > 0 && !libraryStore.fetching,
      resetVisibleIf: libraryStore.filtersInvolved && !libraryStore.fetching
    },
    content: libraryStore.list.length,
    commonEmpty: !libraryStore.list.length && !libraryStore.fetching
  }));
  let sw = null;

  onMounted(() => {
    sw = scrollAfterPagination({
      store: libraryStore,
      content: libraryContent
    });
  });
  onUnmounted(() => {
    sw();
  });

  const resolveContentComponentName = (item) => {
    return `common-${item.content_type}-${libraryStore.filters.mode.value}`;
  };
  const contentComponentOptions = (item) => {
    return {};
  };

  const toggleTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.data.parent_id, 'task', !context.data.is_favorite);

    if (res) {
      libraryStore.setTaskField(context.data.id, 'is_favorite', !context.data.is_favorite);
    }
    context.setProgress(false, 150);
  };

  const onPage = (page) => {
    libraryStore.filters.page.current = page;
  };
  const onShowMore = (page) => {
    libraryStore.filters.page.append = true;
    libraryStore.filters.page.current = page;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .library-content-tasks {
    position: relative;
    margin-top: 1rem !important;
    min-height: 35vh;

    &-container {
      transition: opacity 200ms ease-out;
      position: relative;
      padding-bottom: 5rem;

      &.fetching {
        opacity: 0;
      }
    }

    &-tile {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin: 0 -0.55rem;
      align-content: flex-start;
      row-gap: 2.5rem;
    }

    &-row {
      margin: 0 -1rem;
    }

    &-info {
      margin-top: 2rem;
      margin-bottom: 1.5rem;
    }

    &-pagination {
      margin-top: 2rem;
    }

    &-loader {
      --loader-padding-top: 5rem;
      --loader-z-index: 10;
      --loader-max-opacity: 0.95;
      --loader-spinner-transition-ms: 0ms;

      align-items: flex-start;

      .loader-spinner-container {
        position: sticky;
        top: 10rem;
      }
    }
  }
</style>
