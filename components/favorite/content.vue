<template>
  <div class="favorite-content">
    <div
      :class="{'fetching': favoriteStore.fetching}"
      class="favorite-content-container">
      <common-result-info
        :visible-if="renderController.commonResultInfo.visibleIf"
        :reset-visible-if="renderController.commonResultInfo.resetVisibleIf"
        :count="favoriteStore.filters.page.total"
        @reset="favoriteStore.resetFilters"
        class="favorite-content-info"/>

      <div
        ref="favoriteContent"
        class="favorite-content-items"
        :class="['favorite-content-view-' + favoriteStore.getFilterValue('mode')]">
        <component
          v-for="(item, index) in favoriteStore.list"
          :is="resolveContentComponentName(item)"
          :options="contentComponentOptions(item)"
          :key="index"
          :data="item"
          @favorite="toggleItemFavorite"
          @archive="toggleTestArchive"
          @collection="removeTestFromCollection"/>
      </div>

      <common-empty
        v-if="renderController.commonEmpty"
        @click="favoriteStore.resetFilters()"/>

      <common-pagination
        :list="favoriteStore.list"
        :pagination="favoriteStore.filters.page"
        @page="onPage"
        @show-more="onShowMore"
        class="favorite-content-pagination"/>
    </div>
    <loader
      class="favorite-content-loader"
      :listener="favoriteStore.fetching"/>
  </div>
</template>

<script setup>
  import useFavoriteStore from '~/stores/favorite';

  const favoriteStore = useFavoriteStore();
  const favoriteContent = ref(null);
  const renderController = computed(() => ({
    commonResultInfo: {
      visibleIf: favoriteStore.list.length > 0 && !favoriteStore.fetching,
      resetVisibleIf: favoriteStore.filtersInvolved && !favoriteStore.fetching
    },
    content: favoriteStore.list.length,
    commonEmpty: !favoriteStore.list.length && !favoriteStore.fetching
  }));
  let sw = null;

  onMounted(() => {
    sw = scrollAfterPagination({
      store: favoriteStore,
      content: favoriteContent
    });
  });

  onUnmounted(() => {
    sw();
  });

  const resolveContentComponentName = (item) => {
    return `common-${item.content_type}-${favoriteStore.filters.mode.value}`;
  };
  const contentComponentOptions = (item) => {
    return {
      showIsMine: true,
      showInArchive: true
    };
  };

  const toggleItemFavorite = async (context) => {
    const askForRemoveSetting = getUserSetting('favorite.actions.remove.ask');

    const remove = async () => {
      context.setProgress(true);
      const res = await toggleFavorite(context.data.parent_id, context.data.content_type, !context.data.is_favorite);

      if (res) {
        favoriteStore.fetch();
      }
      context.setProgress(false, 150);
    };

    const askForRemove = () => {
      eventBus.emit('alert:show', {
        title: 'Удалить из избранного?',
        contentComponent: 'helperAlertContentFavoriteRemove',
        additionalData: context.data,
        buttons: [
          {
            title: 'Да',
            click(modal, context) {
              remove();
              context.hide();
            }
          },
          {
            title: 'Отмена',
            class: 'btn-outline-primary',
            click(modal, context) {
              context.hide();
            }
          }
        ]
      });
    };

    askForRemoveSetting === null || askForRemoveSetting === true
      ? askForRemove()
      : await remove();
  };

  const toggleTestArchive = async (context) => {
    context.setProgress(true);
    const res = await toggleArchive(context.data.parent_id, !context.data.in_archive);

    if (res) {
      favoriteStore.setTestField(context.data.id, 'in_archive', !context.data.in_archive);
    }
    context.setProgress(false, 150);
  };

  const removeTestFromCollection = async (context) => {
    if (context.data.is_mine) {
      return;
    }
    context.setProgress(true);
    const res = await toggleCollection(context.data.id, false);

    if (res) {
      favoriteStore.fetch();
    }
    context.setProgress(false, 150);
  };

  const onPage = (page) => favoriteStore.filters.page.current = page;
  const onShowMore = (page) => {
    favoriteStore.filters.page.append = true;
    favoriteStore.filters.page.current = page;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .favorite-content {
    position: relative;
    margin-bottom: 5rem;

    &-container {
      transition: opacity 200ms ease-out;
      position: relative;

      &.fetching {
        opacity: 0;
      }
    }

    &-container.fetching &-pagination {
      opacity: 0;
    }

    &-info {
      margin-top: 2rem;
      margin-bottom: 1.5rem;
    }

    &-view-tile {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin: 0 -0.55rem;
      align-content: flex-start;
      row-gap: 2.5rem;
    }

    &-view-row {
      margin: 0 -1rem;
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
