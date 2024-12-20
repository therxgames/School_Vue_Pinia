<template>
  <div>
    <admin-cce-filters/>
    <admin-cce-content/>
  </div>
</template>

<script setup>
  import useAdminCceStore from '~/stores/admin-cce';

  const store = useAdminCceStore();

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    store.reset();
  });

  const invoke = () => {
    store.invoke({
      onUpdateRoute({query}) { },
      onFetch({query, user}) {
        return store.fetch();
      }
    });
  };

  await useAsyncData('admin-cce', () => Promise.all([
    store.fetch({resetBefore: true, query: useRoute().query})
  ]));
</script>
