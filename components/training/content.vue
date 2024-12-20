<template>
  <div class="training-content">
    <div
      :class="{'fetching': trainingStore.fetching}"
      class="training-content-container">
      <common-result-info
        :visible-if="renderController.commonResultInfo.visibleIf"
        :reset-visible-if="renderController.commonResultInfo.resetVisibleIf"
        :count="trainingStore.filters.page.total"
        @reset="trainingStore.resetFilters"
        class="training-content-result-info"/>

      <div
        ref="trainingContent"
        v-if="renderController.content"
        :class="['training-content-view-' + trainingStore.getFilterValue('mode')]">
        <component
          v-for="(item, index) in trainingStore.list"
          :is="resolveContentComponentName(item)"
          :options="contentComponentOptions(item)"
          :key="index"
          :data="item"
          @favorite="toggleTestFavorite"
          @archive="toggleTestArchive"
          @collection="removeTestFromCollection"/>
      </div>

      <training-create-or-add
        v-if="renderController.trainingCreateOrAdd"
        @add-by-id="emit('addById')"
        @new-test="emit('newTest')"/>

      <common-empty
        v-if="renderController.commonEmpty()"
        @click="trainingStore.resetFilters()"/>

      <common-filters-invalid
        v-if="renderController.commonFiltersInvalid"
        :reason-title="trainingStore.filtersError"
        @click="trainingStore.resetFilters()"/>

      <common-pagination
        :list="trainingStore.list"
        :pagination="trainingStore.filters.page"
        @page="onPage"
        @show-more="onShowMore"
        class="training-content-pagination"/>
    </div>
    <loader
      :listener="trainingStore.fetching"
      class="training-content-loader"/>
  </div>
</template>

<script setup>
  import useTrainingStore from '~/stores/training';
  import useUserStore from '~/stores/user';

  const emit = defineEmits(['addById', 'newTest']);
  const userStore = useUserStore();
  const trainingStore = useTrainingStore();
  const trainingContent = ref(null);
  const renderController = computed(() => ({
    commonResultInfo: {
      visibleIf: trainingStore.list.length > 0,
      resetVisibleIf: trainingStore.filtersInvolved
    },
    content: trainingStore.list.length > 0,

    trainingCreateOrAdd: !trainingStore.list.length
      && !trainingStore.fetching
      && trainingStore.filtersIsValid
      && trainingStore.filters.category.value === 'usertest'
      && !trainingStore.hasCollection,

    commonEmpty() {
      if (!trainingStore.filters.category.value) {
        if (!trainingStore.list.length && trainingStore.filtersIsValid && !trainingStore.fetching) {
          return true;
        }
      }

      if (trainingStore.filters.category.value === 'demovariant') {
        if (!trainingStore.list.length && trainingStore.filtersIsValid && !trainingStore.fetching) {
          return true;
        }
      }

      if (trainingStore.filters.category.value === 'usertest') {
        if (!trainingStore.list.length && trainingStore.filtersIsValid && !trainingStore.fetching && trainingStore.hasCollection) {
          return true;
        }
      }

      return false;
    },

    commonFiltersInvalid: !trainingStore.filtersIsValid && !trainingStore.fetching
  }));
  let sw = null;

  onMounted(() => {
    sw = scrollAfterPagination({
      store: trainingStore,
      content: trainingContent
    });
  });
  onUnmounted(() => {
    sw();
  });

  const resolveContentComponentName = (item) => {
    return `common-${item.content_type}-${trainingStore.filters.mode.value}`;
  };
  const contentComponentOptions = (item) => {
    return {showInArchive: true};
  };

  const toggleTestFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.data.parent_id, 'test', !context.data.is_favorite);

    if (res) {
      trainingStore.setTestField(context.data.id, 'is_favorite', !context.data.is_favorite);
    }
    context.setProgress(false, 150);
  };

  const toggleTestArchive = async (context) => {
    context.setProgress(true);
    const res = await toggleArchive(context.data.parent_id, !context.data.in_archive);

    if (res) {
      trainingStore.setTestField(context.data.id, 'in_archive', !context.data.in_archive);
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
      trainingStore.fetch();
    }
    context.setProgress(false, 150);
  };

  const onPage = (page) => {
    trainingStore.filters.page.current = page;
  };
  const onShowMore = (page) => {
    trainingStore.filters.page.append = true;
    trainingStore.filters.page.current = page;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .training-content {
    position: relative;
    padding-bottom: 5rem;

    &-container {
      transition: opacity 200ms ease-out;
      position: relative;

      &.fetching {
        opacity: 0;
      }
    }

    &-result-info {
      margin-top: 2rem;
      margin-bottom: 1.5rem;
    }

    &-pagination {
      margin-top: 2rem;
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
