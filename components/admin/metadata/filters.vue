<template>
  <div
    :class="{'fetching': adminMetadataStore.fetching}"
    class="admin-metadata-filters">
    <h4 class="admin-metadata-filters-header">
      Редактирование инструкций и описаний
    </h4>
    <div class="admin-metadata-filters-content">
      <input-radio-group
        type="button"
        :list="adminMetadataStore.getFilterData('category')"
        v-model:value="byCategory"/>
      <template v-if="byCategory === 'demovariant'">
        <input-select-single
          placeholder="Год"
          :list="adminMetadataStore.getFilterData('year')"
          v-model:value="byYear"/>
        <input-select-single
          placeholder="Предмет"
          :list="adminMetadataStore.getFilterData('subjects')"
          v-model:value="bySubject"/>
        <input-select-single
          placeholder="Класс"
          :list="adminMetadataStore.getFilterData('class')"
          v-model:value="byClass"/>
      </template>
    </div>
  </div>
</template>

<script setup>
  import useAdminMetadataStore from '~/stores/admin-metadata';

  const adminMetadataStore = useAdminMetadataStore();
  const byCategory = computed({
    get: () => adminMetadataStore.getFilterValue('category'),
    set: (value) => {
      adminMetadataStore.resetFilters();
      adminMetadataStore.setFilterValue('category', value);
    }
  });
  const byYear = computed({
    get: () => adminMetadataStore.getFilterValue('year'),
    set: (value) => adminMetadataStore.setFilterValue('year', value)
  });
  const bySubject = computed({
    get: () => adminMetadataStore.getFilterValue('subject'),
    set: (value) => adminMetadataStore.setFilterValue('subject', value)
  });
  const byClass = computed({
    get: () => adminMetadataStore.getFilterValue('class'),
    set: (value) => adminMetadataStore.setFilterValue('class', value)
  });
</script>

<style lang="scss">
  .admin-metadata-filters {
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
        minmax(266px, 266px)
        minmax(140px, 140px)
        minmax(250px, 250px)
        minmax(200px, 200px)
        auto;
      gap: 1rem;
    }
  }
</style>
