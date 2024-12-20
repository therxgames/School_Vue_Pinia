<template>
  <p class="show-text">Показано {{ props.list.length }} из {{ props.total }}</p>
  <button
    v-if="props.total > props.list.length"
    class="btn btn-outline-primary btn-show-more w-100 position-relative"
    :disabled="materialsStore.listIsLoading"
    @click="handleLoadMore"
  >
    <span>Показать ещё</span>
    <loader
      v-if="materialsStore.listIsLoading"
      :listener="true"
      :theme-simple="true"
    />
  </button>
</template>

<script setup lang="ts">
import useMaterialsLibraryStore from "~/stores/materials-library";
const materialsStore = useMaterialsLibraryStore();

const route = useRoute();

type TPaginationProps = {
  total: number;
  list: any[];
};

const props = defineProps<TPaginationProps>();

const handleLoadMore = async () => {
  const queryParams = {
    ...route.query,
    page: materialsStore.queryPageCount,
  };

  materialsStore.queryPageCount += 1;

  await materialsStore.fetchMaterials({ ...queryParams });
};
</script>

<style lang="scss" scoped>
.show-text {
  margin-top: 16px;
  color: #0c1524;
  line-height: 160%;
}

.btn-show-more {
  &:disabled > span {
    opacity: 0;
  }
}
</style>
