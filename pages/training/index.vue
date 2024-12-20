<template>
  <nuxt-layout name="default">
    <div class="page-training page-default content-container">
      <training-filters
        @add-by-id="showAddByIdModal()"
        @new-test="newTest()"/>
      <training-content
        @add-by-id="showAddByIdModal()"
        @new-test="newTest()"/>
    </div>
    <training-modal-add-by-id ref="modalAddById"/>
  </nuxt-layout>
</template>

<script setup>
  import useTrainingStore from '~/stores/training';
  import useUserStore from '~/stores/user';

  const trainingStore = useTrainingStore();
  const userStore = useUserStore();
  const router = useRouter();
  const modalAddById = ref(null);

  useHead({
    ...pageTitle('Подготовка')
  });

  onMounted(() => {
    invoke();

    if (!userStore.logged) {
      watch(() => trainingStore.list, () => {
        trainingStore.list.forEach(async (test) => {
          const attempts = await localServer.getAttempts({test_id: test.id, is_active: true});

          if (attempts.length) {
            const attempt = attempts[0];

            test.attempt_started_at = attempt.started_at;
            test.attempt_time = attempt.time;
            test.correctness = attempt.correctness;
            test.is_finished = attempt.is_finished;
            test.last_action_at = attempt.last_action_at;
            test.mode = attempt.mode;
            test.uncheckedness = attempt.uncheckedness;
            test.wrongness = attempt.wrongness;
            test.score = attempt.score;
            test.max_score = attempt.max_score;
            test.score_correctness = attempt.score_correctness;
          }
        });
      }, {immediate: true});
    }
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'training') {
      trainingStore.$reset();
    }
  });

  onUnmounted(() => {
    trainingStore.reset({all: true});
  });

  const showAddByIdModal = () => {
    modalAddById.value.show();
  };

  const newTest = () => router.push('/training/create-task');

  const invoke = () => {
    trainingStore.invoke({
      onUpdateRoute({query}) {
        let routerMethod = trainingStore.filtersChangesIsFechable ? 'push' : 'replace';
        return router[routerMethod]({query});
      },
      onFetch({query, user}) {
        if (!trainingStore.filtersChangesIsFechable && trainingStore.filtersChanges.length > 0) {
          return;
        }
        return trainingStore.fetch();
      }
    });
  };

  await useAsyncData('training-content', () => Promise.all([
    trainingStore.fetchUserTests(),
    trainingStore.fetch({resetBefore: true, rememberFreeCount: true, query: useRoute().query})
  ]));
</script>
