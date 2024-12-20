<template>
  <div
    :class="{'disabled': libraryStore.fetching}"
    class="library-subjects-filters">
    <div class="library-subjects-filters-header">
      <h1 class="library-subjects-filters-header-title">
        Задания
      </h1>
      <div class="library-subjects-filters-category-switch">
        <input-switch
          label="по темам"
          v-model:value="byContent"/>
      </div>
    </div>
    <div class="library-subjects-filters-main-set">
      <input-radio-group
        type="button"
        :list="libraryStore.getFilterData('attestation')"
        :resettable="true"
        v-model:value="byAttestationType"/>
      <input-select-multi
        placeholder="Класс"
        when-select-all-placeholder="Все классы"
        :list="libraryStore.getFilterData('classes')"
        v-model:value="byClasses"/>
      <input-select-multi
        placeholder="Предмет"
        when-select-all-placeholder="Все предметы"
        :list="libraryStore.getFilterData('subjects')"
        v-model:value="bySubjects"/>
      <input-select-multi
        placeholder="Год"
        when-select-all-placeholder="Все года"
        :list="libraryStore.getFilterData('years')"
        v-model:value="byYears"/>
      <input-search
        placeholder="Поиск"
        v-model:value="bySearchString"
        @search="onSearch"/>
    </div>
  </div>
</template>

<script setup>
  import useLibrarySubjectsStore from '~/stores/library-subjects';
  import _isEqual from 'lodash.isequal';

  const libraryStore = useLibrarySubjectsStore();
  const router = useRouter();
  const byContent = computed({
    get: () => router.currentRoute.value.name === 'library-subjects',
    set: async (checked) => {
      if (!checked) {
        await sleep(200);
        await router.push('/library/tasks');
      }
    }
  });
  const byAttestationType = computed({
    get: () => libraryStore.getFilterValue('attestation'),
    set: (value) => libraryStore.setFilterValue('attestation', value)
  });
  const byClasses = computed({
    get: () => libraryStore.getFilterValue('classes'),
    set: (value) => libraryStore.setFilterValue('classes', value)
  });
  const bySubjects = computed({
    get: () => libraryStore.getFilterValue('subjects'),
    set: (value) => libraryStore.setFilterValue('subjects', value)
  });
  const byYears = computed({
    get: () => libraryStore.getFilterValue('years'),
    set: (value) => libraryStore.setFilterValue('years', value)
  });
  const bySearchString = computed({
    get: () => libraryStore.getFilterValue('q'),
    set: (value) => libraryStore.setFilterValue('q', value)
  });

  watch(
    () => libraryStore.filtersChanges,
    (changes) => {
      if (
        _isEqual(['subjects'], changes)
        && byAttestationType.value === attestation.OGE
        && byClasses.value?.length > 0
      ) {
        libraryStore.resetFilter('classes');
      }
    }
  );

  onMounted(() => {});
  onUnmounted(() => {});

  const onSearch = () => {
    libraryStore.filters.q.accepted = libraryStore.filters.q.value;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .library-subjects-filters {
    position: relative;
    z-index: 15;

    &.disabled {
      pointer-events: none;
    }

    &-category {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }

    &-category-tasks {
      .input-checkbox-label {
        opacity: 0.5;
      }
    }

    &-category-subjects {
      .input-checkbox-label {
        opacity: 1;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      gap: 1em;
    }

    &-header-title {
      margin-bottom: 0;
    }

    &-main-set {
      display: grid;
      grid-template-columns: minmax(160px, 160px) minmax(120px, 130px) minmax(190px, 200px) minmax(120px, 130px) auto;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .disabled {
      background: #fff !important;
      opacity: 0.5 !important;
    }
  }
</style>
