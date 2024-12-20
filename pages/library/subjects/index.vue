<template>
  <nuxt-layout name="default">
    <div class="page-subjects page-default content-container">
      <library-subjects-filters/>
      <library-subjects-content/>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useLibrarySubjectsStore from '~/stores/library-subjects';
  import useUserStore from '~/stores/user';

  const libraryStore = useLibrarySubjectsStore();
  const userStore = useUserStore();
  const router = useRouter();

  useHead({
    ...pageTitle('Банк заданий по темам')
  });

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'library-subjects') {
      libraryStore.$reset();
    }
  });

  onUnmounted(() => {
    libraryStore.reset({all: true});
  });

  const invoke = () => {
    libraryStore.invoke({
      onUpdateRoute({query}) {
        const filterName = libraryStore.filtersChanges[0];
        let routerMethod = libraryStore.filterIsFetchable(filterName) ? 'push' : 'replace';
        return router[routerMethod]({query});
      },
      onFetch({query, user}) {
        const filterName = libraryStore.filtersChanges[0];
        if (filterName && !libraryStore.filterIsFetchable(filterName)) {
          return;
        }
        return libraryStore.fetch();
      }
    });
  };

  await useAsyncData('library-tasks', () => Promise.all([
    libraryStore.fetch({resetBefore: true, query: useRoute().query})
  ]));
</script>
