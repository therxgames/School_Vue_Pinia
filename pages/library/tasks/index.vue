<template>
  <nuxt-layout name="default">
    <div class="library page-default content-container">
      <library-tasks-filters/>
      <library-tasks-content/>
      <common-collapse
        v-if="isUserEtd && toWatchFilters.subjects.length && toWatchFilters.classes.length && recommendedStore.materialsRes?.content?.length"
        control-label="Рекомендуемые материалы"
        class="mt-5">
        <task-materials
          :materials-res="recommendedStore.materialsRes"
          :is-fetching="recommendedStore.materialsFetching"
          :show-more="recommendedStore.showMore"
          @show-more="getContentFromBibleMore"/>
      </common-collapse>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useLibraryTasksStore from '~/stores/library-tasks';
  import useUserStore from '~/stores/user';
  import useRecommendedStore from '~/stores/recommended';

  const libraryStore = useLibraryTasksStore();
  const userStore = useUserStore();
  const recommendedStore = useRecommendedStore();
  const router = useRouter();
  const moreCounter = ref(1);
  const isUserEtd = computed(() => {
    if (userStore.userIsStudent && userStore.authSource === 'etd') {
      return true;
    }
  });
  const toWatchFilters = computed(() => ({
    classes: libraryStore.getFilterValue('classes'),
    subjects: libraryStore.getFilterValue('subjects')
  }));

  useHead({
    ...pageTitle('Банк заданий')
  });

  watch(
    () => toWatchFilters,
    async () => {
      await sleep(10);
      await getContentFromBible();
    },
    {
      deep: true,
      immediate: true
    }
  );

  onMounted(() => {
    invoke();

    if (!userStore.logged) {
      watch(() => libraryStore.list, () => {
        libraryStore.list.forEach(async (task) => {
          const answers = await localServer.getAnswers({task_id: task.id, is_active: true});

          if (answers.length) {
            const answer = answers[0];

            if (answer.result === 'correct') {
              task.solution_status = 'training_correct';
            } else if (answer.result === 'wrong') {
              task.solution_status = 'wrong';
            }
          }
        });
      }, {immediate: true});
    }
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'library-tasks') {
      libraryStore.$reset();
    }
  });

  onUnmounted(() => {
    libraryStore.reset({all: true});
  });

  const invoke = () => {
    libraryStore.invoke({
      onUpdateRoute({query}) {
        let routerMethod = libraryStore.filtersChangesIsFechable ? 'push' : 'replace';
        return router[routerMethod]({query});
      },
      onFetch({query, user}) {
        if (!libraryStore.filtersChangesIsFechable
          && libraryStore.filtersChanges.length > 0) {
          return;
        }
        return libraryStore.fetch();
      }
    });
  };

  const getContentFromBible = async () => {
    recommendedStore.resetData();
    let subjectsFilters = [...toWatchFilters.value.subjects];
    let classesFilters = [...toWatchFilters.value.classes];
    if (!isUserEtd.value || !classesFilters.length || !subjectsFilters.length) {
      return;
    }
    if (subjectsFilters.includes(2) && (!classesFilters.includes(5) || !classesFilters.includes(6))) {
      subjectsFilters = [...subjectsFilters, 1, 8, 46];
    }
    try {
      await recommendedStore.fetchMaterials({
        'page_size': 5,
        'page_number': 0,
        'schoolClassIds': classesFilters,
        'subjectIds': subjectsFilters,
        'querySource': 'library'
      });
    } catch (e) {} finally {
      moreCounter.value = 1;
    }
  };

  const getContentFromBibleMore = async () => {
    let subjectsFilters = [...toWatchFilters.value.subjects];
    let classesFilters = [...toWatchFilters.value.classes];
    if (subjectsFilters.includes(2) && (!classesFilters.includes(5) || !classesFilters.includes(6))) {
      subjectsFilters = [...subjectsFilters, 1, 8, 46];
    }
    await recommendedStore.fetchMaterials({
      'page_size': 5,
      'page_number': moreCounter.value === undefined ? 1 : moreCounter.value += 1,
      'schoolClassIds': classesFilters,
      'subjectIds': subjectsFilters,
      'querySource': 'library'
    });
  };

  await useAsyncData('library-subjects', () => Promise.all([
    libraryStore.fetch({resetBefore: true, query: useRoute().query})
  ]));

  watch(() => useRoute().query, (value, prev) => {
    const cur = JSON.stringify(value);
    if (libraryStore.queriesTimeline[1] !== cur) {
      if (JSON.stringify(prev) === '{}') {
        libraryStore.queriesTimeline[0] = '{"attestation":"oge","order":"new "}';
      }
      libraryStore.queriesTimeline[1] = cur;
      libraryStore.fetch({resetBefore: true, query: value});
    }
  });
</script>
