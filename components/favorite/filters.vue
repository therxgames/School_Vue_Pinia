<template>
  <div class="favorite-filters">
    <div class="favorite-filters-header">
      <h1 class="favorite-filters-header-header">
        Избранные
      </h1>
      <input-radio-group
        type="button"
        class="favorite-filters-header-choice"
        theme="impact"
        :list="favoriteStore.getFilterData('content')"
        v-model:value="byContent"/>
    </div>
    <div class="favorite-filters-main-set">
      <input-radio-group
        type="button"
        :list="favoriteStore.getFilterData('attestation')"
        :resettable="true"
        v-model:value="byAttestationType"/>
      <input-select-multi
        placeholder="Класс"
        when-select-all-placeholder="Все классы"
        :disabled="favoriteStore.filters.classes.disabled"
        :list="favoriteStore.getFilterData('classes')"
        v-model:value="byClasses"/>
      <input-select-multi
        placeholder="Предмет"
        when-select-all-placeholder="Все предметы"
        :disabled="favoriteStore.filters.subjects.disabled"
        :list="favoriteStore.getFilterData('subjects')"
        v-model:value="bySubjects"/>
      <input-select-multi
        placeholder="Год"
        when-select-all-placeholder="Все года"
        :disabled="favoriteStore.filters.years.disabled"
        :list="favoriteStore.getFilterData('years')"
        v-model:value="byYears"/>
      <input-search
        placeholder="Поиск"
        @search="onSearch"
        v-model:value="bySearchString"/>
    </div>
    <div class="favorite-filters-sub-set">
      <input-select-single
        placeholder="Статус"
        :disabled="favoriteStore.filters.status.disabled"
        :list="statusDataList"
        v-model:value="byStatus"/>
      <div
        :class="[{'disabled': !favoriteStore.list.length}]"
        class="favorite-filters-sub-set-last-col">
        <div
          class="favorite-filters-sub-set-by-category">
          <div
            @click="setOrder('popular')"
            :class="{'active': favoriteStore.getFilterValue('order') === 'popular'}"
            class="favorite-filters-sub-set-by-category-item">
            Популярные
          </div>
          <div
            @click="setOrder('new')"
            :class="{'active': favoriteStore.getFilterValue('order') === 'new'}"
            class="favorite-filters-sub-set-by-category-item">
            Новые
          </div>
          <div
            @click="setOrder('old')"
            :class="{'active': favoriteStore.getFilterValue('order') === 'old'}"
            class="favorite-filters-sub-set-by-category-item">
            Старые
          </div>
        </div>
        <div class="favorite-filters-sub-set-view-mode">
          <div
            :class="{'active': favoriteStore.getFilterValue('mode') === 'tile'}"
            @click="setViewMode('tile')"
            class="favorite-filters-sub-set-view-mode-action">
            <svg-icon name="menu"/>
          </div>
          <div
            :class="{'active': favoriteStore.getFilterValue('mode') === 'row'}"
            @click="setViewMode('row')"
            class="favorite-filters-sub-set-view-mode-action">
            <svg-icon name="menu-list"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useFavoriteStore from '~/stores/favorite';
  import useUserStore from '~/stores/user';

  const favoriteStore = useFavoriteStore();
  const userStore = useUserStore();
  const byContent = computed({
    get: () => favoriteStore.getFilterValue('content'),
    set: (value) => {
      setUserSetting('favorite.filters.content', value);
      favoriteStore.setFilterValue('content', value);
      favoriteStore.setFilterValue('years', null);
      favoriteStore.setFilterValue('status', null);
    }
  });
  const byAttestationType = computed({
    get: () => favoriteStore.getFilterValue('attestation'),
    set: (value) => favoriteStore.setFilterValue('attestation', value)
  });
  const byClasses = computed({
    get: () => favoriteStore.getFilterValue('classes'),
    set: (value) => favoriteStore.setFilterValue('classes', value)
  });
  const bySubjects = computed({
    get: () => favoriteStore.getFilterValue('subjects'),
    set: (value) => favoriteStore.setFilterValue('subjects', value)
  });
  const bySearchString = computed({
    get: () => favoriteStore.getFilterValue('q'),
    set: (value) => favoriteStore.setFilterValue('q', value)
  });
  const byStatus = computed({
    get: () => favoriteStore.getFilterValue('status'),
    set: (value) => favoriteStore.setFilterValue('status', value)
  });
  const statusDataList = computed(() => {
    if (byContent.value === 'tasks') {
      return favoriteStore.getFilterData('status')?.filter((value) => value.id !== 'archive');
    } else {
      return favoriteStore.getFilterData('status');
    }
  });
  const byYears = computed({
    get: () => favoriteStore.getFilterValue('years'),
    set: (value) => favoriteStore.setFilterValue('years', value)
  });

  const onSearch = () => {
    favoriteStore.filters.q.accepted = favoriteStore.filters.q.value;
  };
  const setOrder = (field) => {
    setUserSetting('favorite.sort.by', field);
    favoriteStore.setFilterValue('order', field);
  };
  const setViewMode = (mode) => {
    setUserSetting('favorite.viewMode', mode);
    favoriteStore.setFilterValue('mode', mode);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .favorite-filters {
    position: relative;

    &-header {
      display: flex;
      align-items: center;
      gap: 1.875rem;

      &-header {
        margin-bottom: 0;
      }
    }

    &-main-set {
      user-select: none;
      margin-top: 2.625rem;
      display: grid;
      gap: 1rem;
      grid-template-columns:
        minmax(160px, 160px)
        minmax(130px, 130px)
        minmax(180px, 200px)
        minmax(130px, 130px)
        auto;
    }

    &-sub-set {
      display: grid;
      grid-template-columns: 200px auto;
      margin-top: 1.5rem;
      user-select: none;
      gap: 1rem;
      align-items: center;

      &-last-col {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      &-by-category {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        &-item {
          cursor: pointer;
          transition: $transition;

          &:hover,
          &.active {
            color: $color-blue-normal;
          }
        }
      }

      &-view-mode {
        display: flex;
        align-items: center;
        margin-left: 2rem;
        gap: 1rem;

        &-action {
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
      }
    }

    &-sub-set--disabled,
    &-main-set--disabled {
      pointer-events: none;
    }

    .disabled {
      background: #fff !important;
      opacity: 0.5 !important;
    }
  }
</style>
