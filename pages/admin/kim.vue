<template>
  <div class="admin-kim">
    <admin-kim-filters/>
    <admin-kim-content/>
  </div>
</template>

<script setup>
  import useAdminKimStore from '~/stores/admin-kim';

  const adminKimStore = useAdminKimStore();

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    adminKimStore.reset();
  });

  const invoke = () => {
    adminKimStore.invoke({
      onUpdateRoute({query}) {},
      onFetch({query, user}) {
        return adminKimStore.fetch();
      }
    });
  };

  await useAsyncData('admin-kim', () => Promise.all([
    adminKimStore.fetch({resetBefore: true, query: useRoute().query})
  ]));
</script>

<style lang="scss">
  .admin-kim {

  }
</style>
