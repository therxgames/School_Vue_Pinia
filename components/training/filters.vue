<template>
  <div class="training-filters">
    <div class="training-filters-header">
      <h1 class="training-filters-header-header">
        Подготовка
      </h1>
      <div
        v-if="userStore.logged && userStore.userIsStudent"
        class="training-filters-header-actions">
        <div
          @click="emit('addById')"
          class="btn btn-simple btn-icon training-filters-header-actions-btn training-filters-header-actions-btn--by-id">
          <svg-icon name="plus-filled"/>
          <span>Добавить по ID</span>
        </div>
        <div
          v-if="userStore.userIsStudent"
          @click="emit('newTest')"
          class="btn btn-primary btn-icon training-filters-header-actions-btn">
          <svg-icon name="plus-filled"/>
          <span>Новый тест</span>
        </div>
      </div>
    </div>
    <div
      :class="[{'login': userStore.logged}]"
      class="training-filters-main-set">
      <input-radio-group
        v-if="userStore.logged"
        type="button"
        :disabled="trainingStore.filters.category.disabled"
        :list="byCategoryDataList"
        :resettable="true"
        v-model:value="byCategory"/>
      <input-radio-group
        type="button"
        :disabled="trainingStore.filters.attestation.disabled"
        :list="trainingStore.getFilterData('attestation')"
        :resettable="true"
        v-model:value="byAttestationType"/>
      <input-select-multi
        placeholder="Класс"
        when-select-all-placeholder="Все классы"
        :disabled="trainingStore.filters.classes.disabled"
        :list="trainingStore.getFilterData('classes')"
        v-model:value="byClasses"/>
      <input-select-multi
        placeholder="Предмет"
        when-select-all-placeholder="Все предметы"
        :disabled="trainingStore.filters.subjects.disabled"
        :list="trainingStore.getFilterData('subjects')"
        v-model:value="bySubjects"/>
      <input-search
        placeholder="Поиск"
        v-model:value="bySearchString"
        @search="onSearch"/>
    </div>
    <div class="training-filters-sub-set">
      <div class="training-filters-sub-set-col-1">
        <input-select-multi
          v-tooltip="byYearsTpOpts"
          placeholder="Год"
          when-select-all-placeholder="Все года"
          :disabled="trainingStore.filters.years.disabled"
          :list="trainingStore.getFilterData('years')"
          v-model:value="byYears"/>
      </div>
      <div class="training-filters-sub-set-col-2">
        <input-select-single
          v-if="userStore.logged"
          placeholder="Статус"
          :disabled="trainingStore.filters.status.disabled"
          :list="trainingStore.getFilterData('status')"
          v-model:value="byStatus"/>
      </div>
      <div
        :class="[{'disabled': !trainingStore.list.length}]"
        class="training-filters-sub-set-col-3">
        <div class="training-filters-sub-set-by-category">
          <div
            @click="setOrder('popular')"
            :class="{'active': trainingStore.getFilterValue('order') === 'popular'}"
            class="training-filters-sub-set-by-category-item">
            Популярные
          </div>
          <div
            @click="setOrder('new')"
            :class="{'active': trainingStore.getFilterValue('order') === 'new'}"
            class="training-filters-sub-set-by-category-item">
            Новые
          </div>
          <div
            @click="setOrder('old')"
            :class="{'active': trainingStore.getFilterValue('order') === 'old'}"
            class="training-filters-sub-set-by-category-item">
            Старые
          </div>
        </div>
        <div class="training-filters-sub-set-view-mode">
          <div
            :class="{'active': trainingStore.getFilterValue('mode') === 'tile'}"
            @click="setViewMode('tile')"
            class="training-filters-sub-set-view-mode-action">
            <svg-icon name="menu"/>
          </div>
          <div
            :class="{'active': trainingStore.getFilterValue('mode') === 'row'}"
            @click="setViewMode('row')"
            class="training-filters-sub-set-view-mode-action">
            <svg-icon name="menu-list"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useTrainingStore from '~/stores/training';
  import useUserStore from '~/stores/user';

  const emit = defineEmits(['addById', 'newTest']);
  const trainingStore = useTrainingStore();
  const userStore = useUserStore();
  const byCategory = computed({
    get: () => trainingStore.getFilterValue('category'),
    set: (value) => {
      if (!userStore.logged && value === 'usertest') {
        return;
      }
      trainingStore.setFilterValue('category', value);
    }
  });
  const byCategoryDataList = computed(() => {
    if (userStore.userIsStudent) {
      return trainingStore.getFilterData('category');
    } else {
      return trainingStore.getFilterData('category').map((dataItem) => {
        if (dataItem.id === 'usertest') {
          dataItem.disabled = true;
        }
        return dataItem;
      });
    }
  });
  const byAttestationType = computed({
    get: () => trainingStore.getFilterValue('attestation'),
    set: (value) => trainingStore.setFilterValue('attestation', value)
  });
  const byClasses = computed({
    get: () => trainingStore.getFilterValue('classes'),
    set: (value) => trainingStore.setFilterValue('classes', value)
  });
  const bySubjects = computed({
    get: () => trainingStore.getFilterValue('subjects'),
    set: (value) => trainingStore.setFilterValue('subjects', value)
  });
  const byYears = computed({
    get: () => trainingStore.getFilterValue('years'),
    set: (value) => trainingStore.setFilterValue('years', value)
  });
  const bySearchString = computed({
    get: () => trainingStore.getFilterValue('q'),
    set: (value) => trainingStore.setFilterValue('q', value)
  });
  const byStatus = computed({
    get: () => trainingStore.getFilterValue('status'),
    set: (value) => trainingStore.setFilterValue('status', value)
  });
  const byYearsTpOpts = computed(() => {
    return {
      title: () => byCategory.value === 'usertest' ? 'Включает задания демовариантов' : ''
    };
  });


  const onSearch = () => {
    trainingStore.filters.q.accepted = trainingStore.filters.q.value;
  };
  const setViewMode = (mode) => {
    setUserSetting('training.viewMode', mode);
    trainingStore.setFilterValue('mode', mode);
  };
  const setOrder = (field) => {
    setUserSetting('training.sort.by', field);
    trainingStore.setFilterValue('order', field);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .training-filters {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.313rem;

      &-header {
        margin: 0;
      }

      &-actions {
        display: flex;
        align-items: center;
        gap: 1rem;

        &-btn {
          --bs-btn-padding-x: 1.5rem;

          &--by-id {
            --bs-btn-bg: #fff;
            --bs-btn-border-color: transperent;
            --bs-btn-hover-color: #{$color-blue-normal};

            &:hover {
              background: #fff;
            }
          }
        }
      }
    }

    &-main-set {
      display: grid;
      grid-template-columns:
        minmax(160px, 160px)
        minmax(120px, 130px)
        minmax(190px, 200px)
        auto;
      gap: 1rem;

      &.login {
        grid-template-columns:
          minmax(260px, 270px)
          minmax(160px, 160px)
          minmax(120px, 130px)
          minmax(190px, 230px)
          auto;
      }
    }

    &-sub-set {
      display: grid;
      grid-template-columns: minmax(200px, 200px) minmax(200px, 200px) 1fr;
      align-items: center;
      margin-top: 1.5rem;
      gap: 1rem;

      &-col-3 {
        display: flex;
        justify-content: flex-end;
        user-select: none;

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }
    }

    &-sub-set--disabled,
    &-main-set--disabled {
      pointer-events: none;
    }

    &-sub-set-by-category {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    &-sub-set-by-category-item {
      cursor: pointer;
      transition: $transition;

      &:hover,
      &.active {
        color: $color-blue-normal;
      }
    }

    &-sub-set-view-mode {
      display: flex;
      align-items: center;
      margin-left: 2.438rem;
      gap: 1rem;
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

    .disabled {
      background: #fff !important;
      opacity: 0.5 !important;
    }
  }
</style>
