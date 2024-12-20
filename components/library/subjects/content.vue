<template>
  <div class="library-content-themes">
    <div
      :class="{'fetching': libraryStore.fetching}"
      class="library-content-themes-container">
      <common-result-info
        :visible-if="renderController.commonResultInfo.visibleIf"
        :reset-visible-if="renderController.commonResultInfo.resetVisibleIf"
        :count="libraryStore.list.length"
        @reset="libraryStore.resetFilters"
        class="library-content-themes-content-info"/>

      <div v-if="renderController.content">
        <template v-if="libraryStore.content === 'subjects'">
          <library-subjects-content-list/>
        </template>
        <template v-if="libraryStore.content === 'themes'">
          <library-subjects-content-theme/>
        </template>
      </div>

      <common-empty
        v-if="renderController.commonEmpty"
        @click="libraryStore.resetFilters()"/>
    </div>
    <loader
      class="library-content-themes-loader"
      :listener="libraryStore.fetching"/>
  </div>
</template>

<script setup>
  import useLibrarySubjectsStore from '~/stores/library-subjects';

  const libraryStore = useLibrarySubjectsStore();

  const renderController = computed(() => ({
    commonResultInfo: {
      visibleIf: libraryStore.list.length > 0,
      resetVisibleIf: libraryStore.filtersInvolved
    },
    content: libraryStore.list.length,
    commonEmpty: !libraryStore.list.length && !libraryStore.fetching
  }));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .library-content-themes {
    position: relative;
    margin-bottom: 7rem;

    &-container {
      transition: opacity 200ms;
    }

    &-container.fetching {
      opacity: 0;
    }

    &-content-info {
      margin-top: 1.3rem;
      margin-bottom: 1.5rem;
    }

    &-loader {
      --loader-padding-top: 5rem;
      --loader-z-index: 10;
      --loader-max-opacity: 0.95;
      --loader-spinner-transition-ms: 0ms;

      .loader-spinner-container {
        position: sticky;
        top: 10rem;
      }
    }
  }
</style>
