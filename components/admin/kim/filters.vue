<template>
  <div
    :class="{'fetching': adminKimStore.fetching}"
    class="admin-kim-filters">
    <h4 class="admin-kim-filters-header">
      Контрольные измерительные материалы
    </h4>
    <div class="admin-kim-filters-content">
      <input-radio-group
        type="button"
        :list="adminKimStore.getFilterData('attestation')"
        :resettable="true"
        v-model:value="byAttestation"/>
      <input-select-single
        placeholder="Год"
        :list="adminKimStore.getFilterData('year')"
        v-model:value="byYear"/>
      <input-select-single
        placeholder="Предмет"
        :list="adminKimStore.getFilterData('subjects')"
        v-model:value="bySubject"/>
      <input-select-single
        placeholder="Класс"
        :list="adminKimStore.getFilterData('class')"
        v-model:value="byClass"/>
      <div
        @click="addPosition"
        class="btn btn-primary admin-kim-filters-content-add">
        Добавить элемент
      </div>
    </div>
    <div class="admin-kim-filters-result-info">
      <common-result-info
        :visible-if="true"
        :reset-visible-if="adminKimStore.filtersInvolved"
        :count="adminKimStore.filters.page.total"
        @reset="adminKimStore.resetFilters"/>
    </div>
  </div>
</template>

<script setup>
  import useAdminKimStore from '~/stores/admin-kim';

  const adminKimStore = useAdminKimStore();
  const byAttestation = computed({
    get: () => adminKimStore.getFilterValue('attestation'),
    set: (value) => adminKimStore.setFilterValue('attestation', value)
  });
  const byYear = computed({
    get: () => adminKimStore.getFilterValue('year'),
    set: (value) => adminKimStore.setFilterValue('year', value)
  });
  const bySubject = computed({
    get: () => adminKimStore.getFilterValue('subject'),
    set: (value) => adminKimStore.setFilterValue('subject', value)
  });
  const byClass = computed({
    get: () => adminKimStore.getFilterValue('class'),
    set: (value) => adminKimStore.setFilterValue('class', value)
  });

  const addPosition = () => {
    adminKimStore.addNewRecord();
  };
</script>

<style lang="scss">
  .admin-kim-filters {
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
        minmax(160px, 160px)
        minmax(150px, 150px)
        minmax(250px, 250px)
        minmax(150px, 150px)
        auto;
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
