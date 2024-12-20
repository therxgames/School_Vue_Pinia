<template>
  <admin-manuals-list/>
</template>

<script setup>
  import useAdminManualsStore from '~/stores/admin-manuals';

  const store = useAdminManualsStore();
  const router = useRouter();

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'admin-manuals') {
      store.$reset();
    }
  });

</script>

