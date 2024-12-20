<template>
  <div class="admin-metadata">
    <admin-metadata-filters/>
    <admin-metadata-content/>
  </div>
</template>

<script setup>
  import useAdminMetadataStore from '~/stores/admin-metadata';

  const adminMetadataStore = useAdminMetadataStore();

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    adminMetadataStore.reset();
  });

  const invoke = () => {
    adminMetadataStore.invoke({
      onUpdateRoute({query}) {},
      onFetch({query, user}) {
        return adminMetadataStore.fetch();
      }
    });
  };

  await useAsyncData('admin-metadata', () => Promise.all([
    adminMetadataStore.fetch({resetBefore: true, query: useRoute().query})
  ]));
</script>

<style lang="scss">
  .admin-metadata {

  }
</style>
