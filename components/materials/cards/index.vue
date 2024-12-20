<template>
  <div
    class="list"
    :class="{
      'list-view-table': modeMaterialsLibrary === 'list',
      'list-view-cards': modeMaterialsLibrary === 'tile',
    }"
  >
    <MaterialsCardsItem
      v-for="item in materialsLibraryStore.list"
      :key="item.id"
      :item="item"
      :listMode="modeMaterialsLibrary === 'list'"
    />
  </div>

  <materials-pagination
    v-if="materialsLibraryStore.list.length > 0"
    :list="materialsLibraryStore.list"
    :total="materialsLibraryStore.total || 0"
  ></materials-pagination>

  <no-result v-if="materialsLibraryStore.listNoResult" class="mt-5 mb-5">
    <div class="btn btn-simple" @click="handleResetFilters">
      Сбросить фильтры
    </div>
  </no-result>
</template>

<script lang="ts" setup>
import useMaterialsLibraryStore from "~/stores/materials-library";
const materialsLibraryStore = useMaterialsLibraryStore();

const modeMaterialsLibrary = useModeMaterialsLibrary();

const route = useRoute();

// onMounted(() => {
//   invoke();
// });

// const invoke = () => {
//   materialsLibraryStore.invoke({
//     onUpdateRoute({ query }) {},
//     onFetch({ query }) {
//       return materialsLibraryStore.fetch();
//     },
//   });
// };

// const onShowMore = async (page) => {
//   materialsLibraryStore.page.append = true;
//   materialsLibraryStore.page.current = page;
// };

await useAsyncData("materials-library", () =>
  Promise.all([
    materialsLibraryStore.fetchMaterials({ resetBefore: true, ...route.query }),
  ])
);

const handleResetFilters = () => {
  eventBus.emit("reset-filters-materials");

  materialsLibraryStore.resetAll();
};
</script>

<style lang="scss" scoped>
.list {
  margin-bottom: 64px;
}

.list-view-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 32px 16px;
}
</style>
