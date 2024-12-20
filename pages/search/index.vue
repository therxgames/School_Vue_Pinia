<template>
  <nuxt-layout name="default">
    <div class="library page-default content-container">
      <input-radio-group
        type="button"
        :list="contentFilterData"
        v-model:value="byTubType"
        class="mb-4"
      />
      <search-filters v-show="currentTub.status === 'new'" :filters="contentFilterData"/>
      <search-content v-show="currentTub.status === 'new'"/>
      <search-old-filters v-show="currentTub.status === 'old'" :currentTub="currentTub"/>
      <search-old-content v-show="currentTub.status === 'old'"/>
    </div>
  </nuxt-layout>
</template>

<script setup>
import useCrossCuttingSearchStore from '~/stores/cross-cutting-search';
import useSearchStore from '~/stores/search';
import useUserStore from '~/stores/user';

const searchStore = useCrossCuttingSearchStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const searchString = computed(() => useRoute().query.q);
const oldSearchStore = useSearchStore();

const contentFilterData = ref([
  {
    id: 'material_library',
    name: "Библиотека материалов",
    status: 'new',
    isActive: true,
  },
  {
    id: 'calendar',
    name: "Календарь",
    status: 'new',
    isActive: false,
  },
  {
    id: 'tests',
    name: "Тесты",
    status: 'old',
    isActive: false,
  },
  {
    id: 'tasks',
    name: "Задания",
    status: 'old',
    isActive: false,
  },
]);

const currentTub = ref(contentFilterData.value.find(element => element.id === route.query.content) || contentFilterData.value[0])

const byTubType = computed({
  get: () => currentTub.value.id,
  set: (value) => {
    currentTub.value = contentFilterData.value.find(element => element.id === value);

    if (currentTub.value.status === 'new') {
      eventBus.emit("handle-change-active-filter-new", currentTub.value.id);
    }

    if (currentTub.value.status === 'old') {
      const queryParams = {...route.query};
      queryParams.content = currentTub.value.id;
      router.push({path: '/search', query: queryParams});
      eventBus.emit("handle-change-active-filter-old", currentTub.value.id);
    }
  }
});

useHead({
  ...pageTitle('Поиск ' + (searchString.value ? searchString.value : ''))
});

onBeforeMount(() => {
  preloadComponents('HelperAlertContentTopicsChoice');
});

onMounted(async () => {
  if (route.query.content === 'calendar' || route.query.content === 'material_library') {
    const queryParams = {...route.query};
    queryParams.sort = 'viewCount'
    await searchStore.fetchData(queryParams);
  }
  if (!route.query.content) {
    await searchStore.fetchData({});
  }
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.name !== 'search') {
    searchStore.$reset();
  }
});

onUnmounted(() => {
  searchStore.reset({all: true});
});

onMounted(() => {
  invoke();
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.name !== 'search') {
    oldSearchStore.$reset();
  }
});

onUnmounted(() => {
  oldSearchStore.reset({all: true});
});

const invoke = () => {
  oldSearchStore.invoke({
    onUpdateRoute({query}) {
      let routerMethod = oldSearchStore.filtersChangesIsFechable ? 'push' : 'replace';
      return router[routerMethod]({query});
    },
    onFetch({query, user}) {
      if (!oldSearchStore.filtersChangesIsFechable
        && oldSearchStore.filtersChanges.length > 0) {
        return;
      }
      return oldSearchStore.fetch();
    }
  });
};

await useAsyncData('search', () => Promise.all([
  oldSearchStore.fetch({resetBefore: true, query: useRoute().query})
]));
</script>
