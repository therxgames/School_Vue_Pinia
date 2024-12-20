<template>
  <div
    :class="[{'disabled': libraryStore.fetching}]"
    class="library-tasks-filters">
    <div class="library-tasks-filters-header">
      <h1 class="library-tasks-filters-header-title">
        Задания
      </h1>
      <div class="library-tasks-filters-category-switch">
        <input-switch
          label="по темам"
          v-model:value="byContent"/>
      </div>
    </div>
    <div class="library-tasks-filters-main-set">
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
        :disabled="libraryStore.filters.subjects.disabled"
        :list="libraryStore.getFilterData('subjects')"
        v-model:value="bySubjects"/>
      <input-search
        placeholder="Поиск"
        v-model:value="bySearchString"
        :autocomplete-list="getUserSetting('library.tasks.q', [])"
        @search="onSearch"/>
      <div v-tooltip="disabledOverlayTpOpts">
        <input-button-toggle
          title="Фильтры"
          class="toggle-add-filter-btn"
          icon-name="setting"
          :is-toggle="true"
          :disabled="subsetIsDisabled"
          v-model:isToggled="additionalFiltersShow">
          <template #after>
            <div class="input-btn-count">
              {{ addFiltersSelectedCount }}
            </div>
          </template>
        </input-button-toggle>
      </div>
    </div>
    <div class="library-tasks-filters-sub-set">
      <div
        :class="[{'disabled': subsetIsDisabled}]"
        class="library-tasks-filters-sub-set-col-2">
        <input-select-single
          v-if="userStore.logged"
          :disabled="!userStore.logged || libraryStore.filters.status.disabled"
          placeholder="Статус"
          :list="byStatusDataList"
          v-model:value="byStatus"/>
      </div>
      <div
        :class="[{'library-tasks-filters-sub-set-left-col--disabled': !libraryStore.list.length}]"
        class="library-tasks-filters-sub-set-col-3">
        <div class="library-tasks-filters-sub-set-by-category">
          <div
            @click="setOrder('popular')"
            :class="{'active': libraryStore.getFilterValue('order') === 'popular'}"
            class="library-tasks-filters-sub-set-by-category-item">
            Популярные
          </div>
          <div
            @click="setOrder('new')"
            :class="{'active': libraryStore.getFilterValue('order') === 'new'}"
            class="library-tasks-filters-sub-set-by-category-item">
            Новые
          </div>
          <div
            @click="setOrder('old')"
            :class="{'active': libraryStore.getFilterValue('order') === 'old'}"
            class="library-tasks-filters-sub-set-by-category-item">
            Старые
          </div>
        </div>
        <div class="library-tasks-filters-sub-set-view-mode">
          <div
            :class="{'active': libraryStore.getFilterValue('mode') === 'tile'}"
            @click="setViewMode('tile')"
            class="library-tasks-filters-sub-set-view-mode-action">
            <svg-icon name="menu"/>
          </div>
          <div
            :class="{'active': libraryStore.getFilterValue('mode') === 'row'}"
            @click="setViewMode('row')"
            class="library-tasks-filters-sub-set-view-mode-action">
            <svg-icon name="menu-list"/>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="additionalFiltersCollapse"
      class="collapse">
      <div class="pt-3"/>
      <div
        :class="[{'disabled': subsetIsDisabled}]"
        class="library-tasks-filters-add-set">
        <div class="library-tasks-filters-add-set-col library-tasks-filters-add-set-col-1">
          <div>
            <div class="library-tasks-filters-add-set-title mb-2">
              Сложность
            </div>
            <div class="library-tasks-filters-add-set-btn-group mb-3">
              <input-checkbox-group
                type="button"
                :list="libraryStore.getFilterData('complexity')"
                v-model:value="byComplexityType"/>
            </div>
          </div>
          <div>
            <div class="library-tasks-filters-add-set-title mb-2">
              Год
            </div>
            <input-select-multi
              placeholder="Год"
              when-select-all-placeholder="Все года"
              :disabled="libraryStore.filters.years.disabled"
              :list="libraryStore.getFilterData('years')"
              v-model:value="byYears"/>
          </div>
        </div>
        <div class="library-tasks-filters-add-set-col">
          <div class="library-tasks-filters-add-set-title mb-2">
            Тип задания
          </div>
          <div class="library-tasks-filters-add-set-btn-group">
            <input-checkbox-group
              type="button"
              :list="libraryStore.getFilterData('type')"
              v-model:value="byProblemType"/>
          </div>
        </div>
        <div
          :class="{'disabled': !libraryStore.getFilterData('part').length}"
          class="library-tasks-filters-add-set-container">
          <template v-if="libraryStore.getFilterData('part').length > 0">
            <div class="library-tasks-filters-add-set-title mb-2 mt-3">
              Часть
            </div>
            <div class="library-tasks-filters-add-set-btn-group">
              <input-checkbox-group
                type="button"
                :list="libraryStore.getFilterData('part')"
                v-model:value="byPartType"/>
            </div>
          </template>
          <template v-else>
            <div class="library-tasks-filters-add-set-title mb-2 mt-3">
              Часть
            </div>
            <div class="library-tasks-filters-add-set-btn-group">
              <div class="btn btn-simple">
                Недоступно
              </div>
            </div>
          </template>
        </div>
        <div class="pt-4"/>
        <div class="library-tasks-filters-add-set-line"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useLibraryTasksStore from '~/stores/library-tasks';
  import useUserStore from '~/stores/user';

  const libraryStore = useLibraryTasksStore();
  const userStore = useUserStore();
  const router = useRouter();
  const additionalFiltersCollapse = ref(null);
  const additionalFiltersShow = computed({
    get: () => libraryStore.getFilterValue('ac'),
    set: (value) => libraryStore.setFilterValue('ac', value)
  });
  const byContent = computed({
    get: () => router.currentRoute.value.name === 'library-subjects',
    set: async (checked) => {
      if (checked) {
        await sleep(200);
        router.push('/library/subjects');
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
  const byStatus = computed({
    get: () => libraryStore.getFilterValue('status'),
    set: (value) => libraryStore.setFilterValue('status', value)
  });
  const byStatusDataList = computed(() => {
    return libraryStore.getFilterData('status').filter((dataItem) => dataItem.id !== 'archive');
  });
  const byComplexityType = computed({
    get: () => libraryStore.getFilterValue('complexity'),
    set: (value) => libraryStore.setFilterValue('complexity', value)
  });
  const byProblemType = computed({
    get: () => libraryStore.getFilterValue('type'),
    set: (value) => libraryStore.setFilterValue('type', value)
  });
  const byPartType = computed({
    get: () => libraryStore.getFilterValue('part'),
    set: (value) => libraryStore.setFilterValue('part', value)
  });
  const addFiltersSelectedCount = computed(() => {
    return [byProblemType.value, byPartType.value, byComplexityType.value]
      .reduce((acc, item) => item?.length > 0 ? ++acc : acc, 0) || undefined;
  });
  const subsetIsDisabled = computed(() => {
    if (byAttestationType.value === attestation.OGE) {
      return false;
    }

    if (byAttestationType.value === attestation.VPR && (byClasses.value?.length > 0 || bySubjects.value?.length > 0)) {
      return false;
    }

    return true;
  });
  const disabledOverlayTpOpts = computed(() => ({
    title: () => {
      if (subsetIsDisabled.value) {
        return `<b class="font-weight-500">Необходимо определить ГИА</b> <br> ОГЭ или ВПР + {класс} | {предмет}`;
      }
    }
  }));
  let additionalFiltersCollapseInst = null;

  const acw = watch(
    () => libraryStore.filters.ac.value,
    (value) => additionalFiltersCollapseInst[value ? 'show' : 'hide']()
  );

  watch(
    () => byAttestationType.value,
    () => additionalFiltersReset()
  );

  watch(
    () => subsetIsDisabled.value,
    (disabled) => {
      if (disabled) {
        additionalFiltersReset();
      }
    }
  );

  onMounted(async () => {
    await sleep(200);
    additionalFiltersCollapseInst = new window.$bootstrap.Collapse(additionalFiltersCollapse.value, {
      toggle: libraryStore.getFilterValue('ac')
    });
  });

  onUnmounted(() => {
    acw();
    if (additionalFiltersCollapseInst) {
      additionalFiltersCollapseInst.dispose();
      additionalFiltersCollapseInst = null;
    }
  });

  const onSearch = () => {
    libraryStore.filters.q.accepted = libraryStore.filters.q.value;
    if (libraryStore.filters.q.value?.length > 2) {
      setUserSetting('library.tasks.q', libraryStore.filters.q.value, {push: true, limit: 20, autoSave: true});
    }
  };
  const setViewMode = (mode) => {
    setUserSetting('library.tasks.viewMode', mode);
    libraryStore.setFilterValue('mode', mode);
  };
  const setOrder = (field) => {
    libraryStore.setFilterValue('order', field);
    setUserSetting('library.tasks.sort.by', field);
  };
  const additionalFiltersReset = () => {
    if (byYears.value !== null) {
      byYears.value = null;
    }

    if (byPartType.value !== null) {
      byPartType.value = null;
    }

    if (byProblemType.value !== null) {
      byProblemType.value = null;
    }

    if (byComplexityType.value !== null) {
      byComplexityType.value = null;
    }

    sleep(150).then(() => {
      if (libraryStore.filters.ac.value !== false) {
        libraryStore.filters.ac.value = false;
      }
    });
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .library-tasks-filters {
    position: relative;

    &.disabled {
      pointer-events: none;

      .checkbox-group-button-btn.disabled {
        background: #fff;
        border-color: #ced6e0;
        color: $color-black;
        opacity: 1;
      }
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
      grid-template-columns:
        minmax(160px, 160px)
        minmax(120px, 130px)
        minmax(190px, 250px)
        minmax(400px, 525px)
        auto;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    &-sub-set {
      user-select: none;
      transition: $transition;
      display: grid;
      grid-template-columns: minmax(200px, 200px) 1fr;
      align-items: center;
      margin-top: 1.5rem;
      gap: 1rem;

      &-col-1,
      &-col-2 {
        user-select: none;
        transition: all 200ms ease-out;

        &.hidden {
          pointer-events: none;
          opacity: 0 !important;
        }

        &.disabled {
          pointer-events: none;
          opacity: 0.3;
        }
      }

      &-col-1 {

      }

      &-col-2 {

      }

      &-col-3 {
        display: flex;
        justify-content: flex-end;
      }
    }

    &-add-set {
      &.disabled {
        pointer-events: none;
        opacity: 0.3;

        .library-tasks-filters-add-set-container.disabled {
          opacity: 1;
        }

        .checkbox-group-button-btn.disabled {
          background: #fff;
          border-color: #ced6e0;
          color: $color-black;
          opacity: 1;
        }
      }

      &-col-1 {
        display: grid;
        grid-template-columns: max-content 150px;
        gap: 1rem;
      }
    }

    &-sub-set-left-col--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &-sub-set-by-category {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    &-sub-set-view-mode {
      display: flex;
      align-items: center;
      margin-left: 2rem;
      gap: 1rem;
    }

    &-sub-set-by-category-item {
      cursor: pointer;
      transition: $transition;

      &:hover,
      &.active {
        color: $color-blue-normal;
      }
    }

    &-sub-set-view-mode-action {
      cursor: pointer;
      opacity: 0.3;
      transition: $transition;

      &.active,
      &:hover {
        opacity: 1;
      }

      .svg-icon {
        --svg-icon-width: 1rem;
        --svg-icon-height: 1rem;
      }
    }

    &-parts-loader {
      --loader-spinner-width: 2rem;
      --loader-spinner-height: 2rem;
      --loader-min-height: none;

      position: relative;
      width: auto;
      display: inline-flex;
    }

    &-add-set-container {
      position: relative;

      &.disabled {
        pointer-events: none;
        opacity: 0.3;
      }
    }

    &-add-set-title {
      color: $color-dark;
    }

    &-add-set-btn-group {
      display: flex;
      gap: 0.7em;
    }

    &-add-set-line {
      width: 100%;
      height: 1px;
      background: $color-normal;
    }

    &-disabled-overlay {
      position: absolute;
      width: 620px;
      height: calc(100% - 120px);
      top: 120px;
      z-index: 10;

      &.expanded {

      }
    }

    .disabled {
      background: #fff !important;
      opacity: 0.5 !important;
    }
  }
</style>
