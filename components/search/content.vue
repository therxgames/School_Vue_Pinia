<template>
  <div class="search-content">
    <div
      :class="{'fetching': crossCuttingSearchStore.fetching}"
      class="search-content-container">
      <div
        ref="searchContent"
        v-if="renderController.content"
        :class="['search-content-' + crossCuttingSearchStore.getFilterValue('mode')]"
      >
        <search-card v-for="item of crossCuttingSearchStore.list" :data="item" :key="item.id"/>
      </div>

      <common-empty
        v-if="renderController.commonEmpty"
        :btn-visible-if="crossCuttingSearchStore.filtersInvolved"
        @click="crossCuttingSearchStore.resetFilters()"/>

      <search-pagination
        v-if="crossCuttingSearchStore.list.length > 0"
        :list="crossCuttingSearchStore.list"
        :total="crossCuttingSearchStore.filters.page.total || 0"
        @show-more="onShowMore"
      />

    </div>
  </div>
</template>

<script setup>
import useCrossCuttingSearchStore from '~/stores/cross-cutting-search';

const router = useRouter();
const route = useRoute();

const crossCuttingSearchStore = useCrossCuttingSearchStore();
const searchContent = ref(null);
const renderController = computed(() => ({
  commonResultInfo: {
    visibleIf: true,
    resetVisibleIf: crossCuttingSearchStore.filtersInvolved
  },
  content: crossCuttingSearchStore.list.length,
  commonEmpty: !crossCuttingSearchStore.list.length && !crossCuttingSearchStore.fetching
}));
let sw = null;

onMounted(async () => {
  sw = scrollAfterPagination({
    store: crossCuttingSearchStore,
    content: searchContent
  });
});

onUnmounted(() => {
  sw();
});

const onShowMore = () => {
  crossCuttingSearchStore.filters.page.append = true;
  crossCuttingSearchStore.filters.page.current = crossCuttingSearchStore.filters.page.current + 1;
};
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.search-content {
  position: relative;
  margin-top: 1rem;

  &-container {
    display: flex;
    flex-direction: column;
    transition: opacity 200ms ease-out;
    position: relative;
    padding-bottom: 5rem;

    &.fetching {
      opacity: 0;
    }
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
