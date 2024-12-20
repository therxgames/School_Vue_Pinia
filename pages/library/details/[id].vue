<template>
  <nuxt-layout name="default" class="overflow-x-hidden">
    <main class="page-default content-container">
      <library-details :item="materialsLibraryStore.detail" />
    </main>
  </nuxt-layout>
</template>

<script setup lang="ts">
import useMaterialsLibraryStore from '~/stores/materials-library';

const route = useRoute();
const materialsLibraryStore = useMaterialsLibraryStore();

await useAsyncData("materials-library", () =>
  Promise.all([materialsLibraryStore.fetchMaterialById(route.params.id)])
);
//await materialsLibraryStore.fetchMaterialById(route.params.id);
</script>

<style lang="scss" scoped></style>
