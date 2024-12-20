<template>
  <div
    class="list"
    :class="{
      'list-view-table': modeProjects === 'list',
      'list-view-cards': modeProjects === 'tile',
    }"
  >
    <ProjectsCardsItem
      v-for="item in materialsLibraryStore.list"
      :key="item.id"
      :item="item"
      :listMode="modeProjects === 'list'"
    />
  </div>

  <common-pagination
    :list="materialsLibraryStore.list"
    :pagination="materialsLibraryStore.page"
    :per-page="materialsLibraryStore.page.per_page"
    @show-more="onShowMore"
    @page="onPage"
  />
</template>

<script lang="ts" setup>
import useMaterialsLibraryStore from "~/stores/materials-library";
const materialsLibraryStore = useMaterialsLibraryStore();

const modeProjects = useModeProjects();

onMounted(() => {
  invoke();
});

const invoke = () => {
  materialsLibraryStore.invoke({
    onUpdateRoute({ query }) {},
    onFetch({ query }) {
      return materialsLibraryStore.fetch();
    },
  });
};

const onPage = async (page) => {
  materialsLibraryStore.page.current = page;
};

const onShowMore = async (page) => {
  materialsLibraryStore.page.append = true;
  materialsLibraryStore.page.current = page;
};

await useAsyncData("materials-library", () =>
  Promise.all([materialsLibraryStore.fetch({ resetBefore: true })])
);
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
