<template>
  <div class="search-content">
    <div
      :class="{'fetching': searchStore.fetching}"
      class="search-content-container">
      <div
        ref="searchContent"
        v-if="renderController.content"
        :class="['search-content-' + searchStore.getFilterValue('mode')]">
        <component
          v-for="(item, index) in searchStore.list"
          :is="resolveContentComponentName(item)"
          :options="contentComponentOptions(item)"
          :key="index"
          :data="item"
          @favorite="onFavorite"
          @archive="onArchive"
          @collection="onCollection"/>
      </div>

      <common-empty
        v-if="renderController.commonEmpty"
        :btn-visible-if="searchStore.filtersInvolved"
        @click="searchStore.resetFilters()"/>

      <common-pagination
        :list="searchStore.list"
        :pagination="searchStore.filters.page"
        @page="onPage"
        @show-more="onShowMore"
        class="search-content-pagination"/>
    </div>
    <loader
      class="search-content-loader"
      :listener="searchStore.fetching"/>
  </div>
</template>

<script setup>
import useSearchStore from '~/stores/search';

const searchStore = useSearchStore();
const searchContent = ref(null);
const renderController = computed(() => ({
  commonResultInfo: {
    visibleIf: true,
    resetVisibleIf: searchStore.filtersInvolved
  },
  content: searchStore.list.length,
  commonEmpty: !searchStore.list.length && !searchStore.fetching
}));
let sw = null;

onMounted(() => {
  sw = scrollAfterPagination({
    store: searchStore,
    content: searchContent
  });
});
onUnmounted(() => {
  sw();
});

const resolveContentComponentName = (item) => {
  return `common-${item.content_type}-${searchStore.filters.mode.value}`;
};
const contentComponentOptions = (item) => {
  const options = {
    showIsMine: true,
    showInArchive: true
  };

  if (searchStore.filters.content.value === 'all') {
    options.showContentType = true;
  }

  return options;
};
const onFavorite = async (context) => {
  context.setProgress(true);
  const contentId = context.data.parent_id || context.data.id
  if (context.data.is_favorite) {
    await searchStore.removeFromFavorite(contentId);
  } else {
    await searchStore.addToFavorite(contentId);
    eventBus.emit('toast:show', {
      text: context.data.content_type === 'task'
        ? lexicon.tpl.task_favorite_hab_been_added(contentId)
        : lexicon.tpl.test_favorite_hab_been_added(contentId)
    });
  }
  context.setProgress(false, 100);
};
const onArchive = async (context) => {
  context.setProgress(true);
  if (context.data.in_archive) {
    await searchStore.removeFromArchive(context.data.id);
    eventBus.emit('toast:show', {text: lexicon.tpl.test_archive_has_been_removed(context.data.id)});
    searchStore.fetch();
  }
  context.setProgress(false, 100);
};
const onCollection = async (context) => {
  if (context.data.is_mine) {
    return;
  }
  context.setProgress(true);
  const removed = await searchStore.removeFromCollection(context.data.id);
  if (removed) {
    eventBus.emit('toast:show', {text: lexicon.tpl.test_collection_has_been_removed(context.data.id)});
    searchStore.fetch();
  }
  context.setProgress(false);
};
const onPage = (page) => searchStore.filters.page.current = page;
const onShowMore = (page) => {
  searchStore.filters.page.append = true;
  searchStore.filters.page.current = page;
};
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.search-content {
  position: relative;
  margin-top: 1rem;

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

  .task-row,
  .test-row {
    .test-row-content,
    .task-row-content {
      grid-template-columns:
          minmax(27px, 27px)
          minmax(55px, 55px)
          minmax(600px, 600px)
          minmax(80px, 80px)
          minmax(140px, 65px)
          minmax(50px, 40px)
          minmax(40px, 40px)
          minmax(90px, 140px)
          auto
    }
  }

  .task-row {
    .task-row-content-type {
      display: block;
    }
  }

  .test-row {
    .test-row-btn-action {
      display: none;
    }

    .test-row-content-type {
      display: block;
    }
  }
}
</style>
