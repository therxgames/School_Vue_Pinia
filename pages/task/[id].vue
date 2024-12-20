<template>
  <nuxt-layout name="default">
    <div
      v-if="store.task"
      :class="classes"
      class="page-task page-default content-container">
      <common-breadcrumbs
        :items="[{to: backLink, title: 'Банк заданий'}]"/>

      <task-top :task="store.task"/>

      <common-columns>
        <div>
          <task-item
            ref="taskRef"
            :task="store.task"
            :answer="store.answer"
            @check="onCheck"
            @score="onScore"
            @reset="onReset"
            @toggle-favorite="toggleTaskFavorite"
            @answer-change="onAnswerChange"/>

          <nuxt-link
            v-if="store.nextTaskId > 0"
            class="btn btn-simple page-task-nextTask mt-4"
            :to="`/task/${store.nextTaskId}`">
            Следующее задание
          </nuxt-link>

          <task-recommended-tasks
            v-if="store.task.is_current"
            :tasks="store.recommendedTasks"
            @toggle-favorite="toggleRecommendedTaskFavorite"/>
        </div>

        <div>
          <common-sticky-column v-if="scoring">
            <task-scoring-stat
              :task="store.task"
              :answer="store.answer"
              :logged="userStore.logged"
              @save-score="saveScore"
              @save-and-send-score="saveScore(true)"/>
          </common-sticky-column>

          <task-props
            v-else
            :task="store.task"
            :in-tests="store.containingTests"/>
        </div>
      </common-columns>

      <common-collapse
        v-if="isUserEtd && recommendedStore.materialsRes?.content?.length"
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
  import useTaskStore from '~/stores/task';
  import useUserStore from '~/stores/user';
  import useRecommendedStore from '~/stores/recommended';

  const store = useTaskStore();
  const userStore = useUserStore();
  const recommendedStore = useRecommendedStore();
  const router = useRouter();
  const route = useRoute();
  const scoring = ref(false);
  const moreCounter = ref(1);
  const backLink = ref('#');
  const taskRef = ref(null);

  const classes = computed(() => {
    const res = [
      'page-task--viewAs-' + userStore.currentRole
    ];

    if (!store.task.is_current) {
      res.push('page-task--notCurrentVersion');
    }

    return res;
  });

  const generateBackLink = () => {
    backLink.value = historyBackLinkIf(
      window.history?.state.back?.startsWith('/library/tasks?'),
      '/library/tasks'
    );
  };

  const isUserEtd = computed(() => {
    if (userStore.userIsStudent && userStore.authSource === 'etd') {
      return true;
    }
  });

  const onCheck = async (callback) => {
    await store.addAnswer();
    callback();
  };

  const onReset = () => {
    store.resetAnswer();
  };

  const onScore = () => {
    scoring.value = true;
  };

  const saveScore = async (send = false) => {
    let criteriaCount = 0;
    let criteriaSelected = 0;

    if (Array.isArray(store.task.criteria)) {
      criteriaCount = store.task.criteria.length;
    }

    if (store.answer.answer.scores) {
      criteriaSelected = Object.keys(store.answer.answer.scores).length;
    }

    let content = '';

    if (criteriaSelected < criteriaCount) {
      const notSelected = criteriaCount - criteriaSelected;
      content += `У вас не ${declension(notSelected, ['выбран', 'выбрано', 'выбрано'])} ${notSelected} ${declension(notSelected, ['критерий', 'критерия', 'критериев'])}. Критерии без выбора будут оценены в 0 баллов.<br><br>`;
    }

    if (send) {
      content += `Результаты будут отправлены на оценку эксперту.<br><br>`;
    }

    content += `После сохранения невозможно будет изменить результаты проверки.`;

    eventBus.emit('alert:show', {
      title: 'Завершение оценки',
      content,
      buttons: [
        {
          title: 'Подтвердить',
          class: 'btn-simple',
          async click(modal, context) {
            await context.hide();
            eventBus.emit('loader:show');
            await store.patchAnswer();
            if (send) {
              await store.sendToExpertise();
            }
            scoring.value = false;
            taskRef.value.setShowSolution(false);
            eventBus.emit('loader:hide');
          }
        },
        {
          title: 'Отмена',
          click(modal, context) {
            context.hide();
          }
        }
      ]
    });
  };

  const onAnswerChange = (answer) => {
    store.setAnswer(answer);
  };

  const nextTask = async () => {
    location.href = `/task/${store.nextTaskId}`;
  };

  const toggleTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.task.parent_id, 'task', !context.task.is_favorite);

    if (res) {
      store.setTaskField('is_favorite', !context.task.is_favorite);
    }
    context.setProgress(false, 150);
  };

  const getContentFromBible = async () => {
    recommendedStore.resetData();
    try {
      await recommendedStore.fetchMaterials({
        'page_size': 5,
        'page_number': 0,
        'topicIds': [store.task.topic_id]
      });
    } catch (e) {} finally {
      moreCounter.value = 1;
    }
  };

  const getContentFromBibleMore = async () => {
    try {
      await recommendedStore.fetchMaterials({
        'page_size': 5,
        'page_number': moreCounter.value === undefined ? 1 : moreCounter.value += 1,
        'topicIds': [store.task.topic_id]
      });
    } catch (e) {}
  };

  const toggleRecommendedTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.data.parent_id, 'task', !context.data.is_favorite);

    if (res) {
      store.setRecommendedTaskField(context.data.id, 'is_favorite', !context.data.is_favorite);
    }
    context.setProgress(false, 150);
  };

  onMounted(async () => {
    blockFilesDrop();
    generateBackLink();
    eventBus.emit('loader:hide');

    if (!userStore.logged) {
      store.setAnswer(await store.getAnswer(store.task.parent_id, store.task.version_number));
    }

    if (userStore.userIsStudent && userStore.authSource === authSource.ETD) {
      getContentFromBible();
    }
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'task-id') {
      store.$reset();
    }
  });

  watch(() => userStore.logged, async () => {
    eventBus.emit('loader:show');
    await store.fetch(route.params.id, {
      recommendedTasks: userStore.logged
    });
    eventBus.emit('loader:hide');
  });

  definePageMeta({
    middleware: ['task-exists', 'task-version-access']
  });

  await useAsyncData(`task-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id, {
      recommendedTasks: userStore.logged,
      answer: userStore.logged
    })
  ]));

  useHead({
    ...pageTitle(store.task.name)
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-task {
    padding-top: 1.125rem;

    .taskItem {
      border-radius: 0.8rem;
    }
  }

  .page-task--notCurrentVersion.page-task--viewAs-student {
    .taskItem-footer-resetBtn,
    .page-task-nextTask {
      display: none;
    }

    .taskTop-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
  }
</style>
