<template>
  <div
    :class="{ 'fetching': store.fetching }"
    class="admin-cce-filters">
    <h4 class="admin-cce-filters-header">
      Связи КЭС с ГИА
    </h4>
    <div class="admin-cce-filters-content">
      <input-radio-group
        type="button"
        :list="store.getFilterData('attestation')"
        :resettable="true"
        v-model:value="byAttestation"/>
      <input-select-single
        placeholder="Год"
        :list="store.getFilterData('year')"
        v-model:value="byYear"/>
      <input-select-single
        placeholder="Предмет"
        :list="store.getFilterData('subjects')"
        v-model:value="bySubject"/>
      <input-select-single
        placeholder="Класс"
        :list="store.getFilterData('class')"
        v-model:value="byClass"/>
      <div
        @click="addPosition"
        class="btn btn-primary admin-cce-filters-content-add">
        Добавить элемент
      </div>
    </div>
    <div class="admin-cce-filters-result-info">
      <common-result-info
        :visible-if="true"
        :reset-visible-if="store.filtersInvolved"
        :count="store.filters.page.total"
        @reset="store.resetFilters"/>
    </div>
  </div>
</template>

<script setup>
  import useAdminCceStore from '~/stores/admin-cce';

  const store = useAdminCceStore();
  const byAttestation = computed({
    get: () => store.getFilterValue('attestation'),
    set: (value) => store.setFilterValue('attestation', value)
  });
  const byYear = computed({
    get: () => store.getFilterValue('year'),
    set: (value) => store.setFilterValue('year', value)
  });
  const bySubject = computed({
    get: () => store.getFilterValue('subject'),
    set: (value) => store.setFilterValue('subject', value)
  });
  const byClass = computed({
    get: () => store.getFilterValue('class'),
    set: (value) => store.setFilterValue('class', value)
  });

  const addPosition = () => {
    store.addNewRecord();
  };
</script>

<style lang="scss">
  .admin-cce-filters {
    margin-bottom: 1.5rem;
    position: relative;

    &.fetching {
      z-index: 501;
    }

    &-header {
      margin-bottom: 2rem;
    }

    &-content {
      display: grid;
      grid-template-columns:
        minmax(160px, 160px) minmax(150px, 150px) minmax(250px, 250px) minmax(150px, 150px) 
      auto        ;
      gap: 1rem;

      &-add {
        justify-self: end;
      }
    }

    &-result-info {
      margin-top: 1rem;
      min-height: 1.313rem;
    }
  }
</style>
