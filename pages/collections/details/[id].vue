<template>
  <nuxt-layout name="default" class="overflow-x-hidden">
    <main class="page-default content-container">
      <a
        class="d-inline-flex link-back align-items-center gap-2 mb-3"
        href="#"
        @click.prevent="$router.back()"
      >
        <svg-icon name="arrow-left" />
        <span>Назад</span>
      </a>
      <h1
        v-if="collectionsDetailStore.collectionsTitle"
        class="title-3-75 fw-normal text-center mb-4"
      >
        {{ collectionsDetailStore.collectionsTitle }}
      </h1>
      <collections-detail />
    </main>
  </nuxt-layout>
</template>

<script setup lang="ts">
import useCollectionsDetailStore from "~/stores/collections-detail";

definePageMeta({
  middleware: ["auth"],
});

const collectionsDetailStore = useCollectionsDetailStore();

const route = useRoute();

onMounted(async () => {
  await collectionsDetailStore.fetchExternalToken();
  await collectionsDetailStore.fetchCollectionsList(route.params.id);
});
</script>
