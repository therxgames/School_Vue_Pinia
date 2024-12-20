<template>
  <nuxt-layout name="default">
    <div class="page-test page-default content-container">
      <common-breadcrumbs
        :items="[{to: backLink, title: 'Подготовка'}]"/>

      <h1
        v-if="store.needScoring"
        style="margin: 2rem 0;">
        Критерии оценивания
      </h1>

      <common-columns>
        <div v-if="store.needScoring">
          <div v-if="scoringTask">
            <task-item
              ref="scoringTaskRef"
              :task="scoringTask.task"
              :mode="'single'"
              :preview="true"
              :answer="scoringTask.answer"
              :test-id="store.test.id"
              style="border: 0; padding: 0;"
              @answer-change="onAnswerChange(scoringTask.task.id, $event)"
              @toggle-favorite="toggleTaskFavorite"/>
          </div>

          <div
            v-else
            class="page-test-tasks">
            <task-item
              ref="scoringTasksRefs"
              v-for="info in store.freeAnswerTasks"
              :key="info.task.id"
              :task="info.task"
              :mode="'single'"
              :preview="true"
              :answer="info.answer"
              :test-id="store.test.id"
              @answer-change="onAnswerChange(info.task.id, $event)"
              @toggle-favorite="toggleTaskFavorite"/>
          </div>
        </div>

        <div v-else>
          <test-top
            :test="store.test"
            @toggle-favorite="toggleTestFavorite"
            @show-instruction="showInstruction"/>

          <div
            v-if="!store.test.in_archive"
            class="mt-5">
            <common-collapse
              v-if="store.test.is_finished || (store.attempt && store.attempt.is_finished)"
              :expanded="false">
              <template #control>
                <a class="page-test-answersBtn btn btn-primary"/>
              </template>

              <div class="page-test-answers">
                <common-results-filters
                  :correctness-filter="correctnessFilter"
                  :show-solutions="showSolutions"
                  @correctness-filter-change="correctnessFilter = $event"
                  @toggle-solutions="toggleSolutions"/>

                <div v-if="parts.length && parts[0].tasks.length">
                  <div
                    v-for="(part, partIndex) in parts"
                    :key="partIndex"
                    class="page-test-part">
                    <div
                      v-if="part.name"
                      class="mb-3 d-flex align-items-center">
                      {{ part.name }}
                    </div>

                    <div class="page-test-tasks">
                      <template
                        v-for="(task, taskIndex) in part.tasks"
                        :key="taskIndex">
                        <task-item-title
                          v-if="showZeroPageTitle(task, part.tasks) && !isSingleZeroPage(task, part.tasks)"
                          :tasks="getZeroPageTasks(task, part.tasks)"/>

                        <task-item
                          ref="tasksRefs"
                          :show-zero-page="showZeroPageTitle(task, part.tasks)"
                          :single-zero-page="isSingleZeroPage(task, part.tasks)"
                          :task="task"
                          :mode="'multiple'"
                          :preview="true"
                          :answer="answerById(task.id)"
                          :test-id="store.test.id"
                          :num="task.order"
                          :tag="store.test.type !== 'demovariant' ? task.part_name : null"
                          :class="{'taskItem--last': isLastZeroPageTask(task, part.tasks)}"
                          @toggle-favorite="toggleTaskFavorite"/>
                      </template>
                    </div>
                  </div>
                </div>

                <div v-else>
                  Отсутствуют
                </div>
              </div>
            </common-collapse>
          </div>

          <common-collapse
            control-label="О тесте"
            class="mt-5">
            <test-about :themes="store.themes"/>
          </common-collapse>

          <test-recommended-tests
            :test="store.test"
            :tests="store.recommendedTests"
            class="mt-4"
            @toggle-favorite="toggleRecommendedTestFavorite"/>

          <test-tools
            :test="store.test"
            @toggle-archive="toggleTestArchive"/>
        </div>

        <div>
          <common-sticky-column>
            <test-stat
              :scoring-task="scoringTask"
              @statistics="showStatistic"
              @go-start="goStart"
              @go-continue="goContinue"
              @go-retake="goRetake"
              @score-task="scoreTask"
              @return-to-tasks="returnToTasks"/>
          </common-sticky-column>
        </div>
      </common-columns>

      <common-collapse
        v-if="isUserEtd && recommendedStore.materialsRes?.content?.length && store.test.is_finished"
        control-label="Рекомендуемые материалы"
        class="mt-3">
        <test-materials
          :test="store.test"
          :materials-res="recommendedStore.materialsRes"
          :is-fetching="recommendedStore.materialsFetching"
          :show-more="recommendedStore.showMore"
          @show-more="getContentFromBibleMore"/>
      </common-collapse>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useTestViewStore from '~/stores/test-view';
  import useUserStore from '~/stores/user';
  import useRecommendedStore from '~/stores/recommended';

  const store = useTestViewStore();
  const route = useRoute();
  const userStore = useUserStore();
  const recommendedStore = useRecommendedStore();
  const router = useRouter();
  const progress = ref(false);
  const showSolutions = ref(false);
  const correctnessFilter = ref(1);
  const tasksRefs = ref([]);
  const scoringTasksRefs = ref([]);
  const scoringTaskRef = ref(null);
  const scoringTaskNum = ref(null);
  const moreCounter = ref(1);
  const isUserEtd = computed(() => {
    if (userStore.userIsStudent && userStore.authSource === 'etd') {
      return true;
    }
  });

  const filteredTasks = computed(() => {
    if (correctnessFilter.value === 1) {
      return store.test.tasks;
    } else if (correctnessFilter.value === 2) {
      return store.test.tasks.filter((task) => {
        const answer = answerById(task.id);
        return answer && answer.result === 'correct';
      });
    } else {
      return store.test.tasks.filter((task) => {
        const answer = answerById(task.id);
        return answer && answer.result === 'wrong';
      });
    }
  });

  const parts = computed(() => {
    if (filteredTasks.value) {
      if (store.test.type === 'demovariant') {
        return getParts(filteredTasks.value);
      } else {
        return [{
          name: null,
          num: null,
          tasks: filteredTasks.value
        }];
      }      
    } else {
      return null;
    }
  });

  const backLink = ref('#');
  const scoringTask = computed(() => {
    let res = store.freeAnswerTasks.find((task) => task.num === scoringTaskNum.value);

    if (res) {
      let index = store.freeAnswerTasks.indexOf(res);
      res = {...res};

      if (index < store.freeAnswerTasks.length - 1) {
        res.nextNum = store.freeAnswerTasks[index + 1].num;
      } else {
        res.nextNum = null;
      }
    }

    return res;
  });

  watch(
    () => correctnessFilter.value,
    async () => {
      await nextTick();
      tasksRefs.value.forEach((taskItem) => taskItem.setShowSolution(showSolutions.value));
    }
  );

  watch(
    () => progress.value,
    (progress) => {
      progress
        ? eventBus.emit('loader:show')
        : eventBus.emit('loader:hide');
    }
  );

  definePageMeta({
    middleware: ['test-exists']
  });

  onMounted(async () => {
    if (!userStore.logged) {
      store.fetchAttempt();
      store.fetchAnswers();
    }

    preloadComponents('helperAlertContentTestInstruction');
    eventBus.emit('loader:hide');
    generateBackLink();
    getContentFromBible();

    if (store.needScoring) {
      await nextTick();
      scoringTasksRefs.value.forEach((taskItem) => {
        taskItem.setShowSolution(true);
      });
    }
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'test-id') {
      store.reset();
    }
  });

  const scoreTask = async (num) => {
    scoringTaskNum.value = num;
    await nextTick();
    scoringTaskRef.value.setStep('scoring');
    scoringTaskRef.value.setShowSolution(true);
    window.scrollTo(0, 0);
  };

  const returnToTasks = async () => {
    scoringTaskNum.value = null;
    await nextTick();
    scoringTasksRefs.value.forEach((taskItem) => {
      taskItem.setShowSolution(true);
    });
    window.scrollTo(0, 0);
  };

  const toggleTestFavorite = async () => {
    progress.value = true;
    const res = await toggleFavorite(store.test.parent_id, 'test', !store.test.is_favorite);

    if (res) {
      store.setTestField('is_favorite', !store.test.is_favorite);
    }
    progress.value = false;
  };
  const toggleTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.task.parent_id, 'task', !context.task.is_favorite);

    if (res) {
      store.setTaskField(context.task.id, 'is_favorite', !context.task.is_favorite);
    }
    context.setProgress(false, 150);
  };
  const toggleRecommendedTestFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.data.parent_id, 'test', !context.data.is_favorite);

    if (res) {
      store.setRecommendedTestField(context.data.id, 'is_favorite', !context.data.is_favorite);
    }
    context.setProgress(false, 150);
  };

  const toggleTestArchive = async () => {
    if (store.test.in_archive) {
      progress.value = true;
      const res = await toggleArchive(store.test.parent_id, !store.test.in_archive);

      if (res) {
        store.setTestField('is_finished', store.test.in_archive);
        store.setTestField('in_archive', !store.test.in_archive);
        await store.fetch(store.test.id, {fetchRecommended: false});
      }
      progress.value = false;
    } else {
      const willFinishAfterArchive = !store.test.is_finished && store.test.attempt_started_at;
      eventBus.emit('alert:show', {
        title: 'Добавить тест в архив?',
        content: `Действие перенесет тест
                 <b>#${store.test.parent_id}</b>
                 в архив,
                 ${willFinishAfterArchive ? '<b>текущая попытка будет завершена,</b>' : ''}
                 продолжить?`,
        buttons: [
          {
            title: 'Да',
            async click(modal, context) {
              context.hide();
              progress.value = true;
              const res = await toggleArchive(store.test.parent_id, !store.test.in_archive);

              if (res) {
                store.setTestField('in_archive', !store.test.in_archive);
              }

              if (!store.test.is_finished && store.test.attempt_started_at) {
                await store.setTestStatus('finished');
              }
              progress.value = false;
            }
          },
          {
            title: 'Отмена',
            class: 'btn-outline-primary',
            click(modal, context) {
              context.hide();
            }
          }
        ]
      });
    }

    progress.value = false;
  };

  const toggleSolutions = () => {
    showSolutions.value = !showSolutions.value;
    tasksRefs.value.forEach((taskItem) => taskItem.setShowSolution(showSolutions.value));
  };
  const answerById = (id) => {
    const answer = store.answers.find((a) => a.task_id === id);

    if (answer) {
      return answer;
    } else {
      return {
        id: null,
        task_id: id,
        answer: null,
        files: null
      };
    }
  };

  const startAndRunTest = async (context) => {
    const time = context.control ? store.test.time : 0;
    await store.startTest(context.control, time);
    router.push(`/test/run/${store.test.id}`);
  };
  const goStart = async (context) => {
    showInstruction({
      ...context,
      control: context.control,
      showControl: true
    });
  };
  const goContinue = (context) => {
    router.push(`/test/run/${store.test.id}`);
  };
  const goRetake = async (context) => {
    store.resetAttempt();
  };
  const showStatistic = (context) => {
    eventBus.emit('alert:show', {
      title: 'Статистика',
      contentComponent: 'helperAlertContentTestAttempts',
      maxWidth: '795px',
      hideAllButtons: true,
      additionalData: {...store.test},

      onGoRetake(event, context) {
        goRetake();
        context.hide();
      }
    });
  };
  const showInstruction = (context) => {
    eventBus.emit('alert:show', {
      title: `Инструкция к тесту «${store.test.name}»`,
      contentComponent: 'helperAlertContentTestInstruction',
      maxWidth: '860px',
      hideAllButtons: true,
      additionalData: {
        ...store.test,
        ...context
      },
      async onStart(event, context) {
        context.hide();
        const control = event.data.control;
        startAndRunTest({control});
      }
    });
  };
  const getContentFromBible = async () => {
    if (!isUserEtd.value || !store.test.is_finished) {
      return;
    }
    recommendedStore.resetData();
    try {
      await recommendedStore.fetchMaterials({
        'page_size': 5,
        'page_number': 0,
        'test_id': store.test.id
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
        'test_id': store.test.id
      });
    } catch (e) {}
  };
  const onAnswerChange = (id, answer) => {
    store.setAnswer(id, answer);
  };
  const generateBackLink = () => {
    backLink.value = historyBackLinkIf(
      window.history?.state.back?.startsWith('/training?'),
      '/training'
    );
  };

  await useAsyncData(`test-view-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id, {
      fetchRecommended: userStore.logged
    })
  ]));

  useHead({
    ...pageTitle(store.test.name)
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-test {
    padding-top: 1.125rem;
  }

  .page-test-answersBtn::after {
    content: 'Смотреть ответы';
  }

  [aria-expanded='true'] > .page-test-answersBtn::after {
    content: 'Скрыть ответы';
  }

  .page-test-answers {
    padding: 1.5rem;
    background-color: #f2f5fa;
    border-radius: 0.5rem;
    margin-top: 1.5rem;
  }

  .page-test-part {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .page-test-tasks .taskItem:not(:last-child) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .page-test-tasks .taskItem:not(:first-child) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -1px;
  }

  .page-test-tasks .taskItem--last:not(:last-child) {
    margin-bottom: 1.25rem;
    border-bottom-left-radius: 0.8rem !important;
    border-bottom-right-radius: 0.8rem !important;
  }

  .page-test-tasks .taskItem--last + .taskItem {
    border-top-left-radius: 0.8rem !important;
    border-top-right-radius: 0.8rem !important;
  }
</style>
