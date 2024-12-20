<template>
  <nuxt-layout name="default">
    <div class="page-favorite page-default content-container">
      <favorite-filters/>
      <favorite-content/>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useFavoriteStore from '~/stores/favorite';
  import useUserStore from '~/stores/user';

  const favoriteStore = useFavoriteStore();
  const userStore = useUserStore();
  const router = useRouter();

  useHead({
    ...pageTitle('Избранное')
  });

  definePageMeta({
    middleware: ['auth', 'student']
  });

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'favorite') {
      favoriteStore.$reset();
    }
  });

  onUnmounted(() => {
    favoriteStore.reset({all: true});
  });

  const invoke = () => {
    favoriteStore.invoke({
      onUpdateRoute({query}) {
        const filterName = favoriteStore.filtersChanges[0];
        let routerMethod = favoriteStore.filterIsFetchable(filterName) ? 'push' : 'replace';
        return router[routerMethod]({query});
      },
      onFetch({query, user}) {
        const filterName = favoriteStore.filtersChanges[0];
        if (filterName && !favoriteStore.filterIsFetchable(filterName)) {
          return;
        }
        return favoriteStore.fetch();
      }
    });
  };

  await useAsyncData('favorite', () => Promise.all([
    favoriteStore.fetch({resetBefore: true, query: useRoute().query})
  ]));
</script>
