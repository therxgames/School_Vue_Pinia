<template>
  <nuxt-layout name="default">
    <div class="page-testRun page-default content-container">
      <test-run-top
        :test="store.test"
        @faster="faster"/>

      <common-columns>
        <div>
          <div v-if="store.parts">
            <div
              v-for="(part, partIndex) in store.parts"
              :key="partIndex"
              class="page-testRun-part">
              <div
                v-if="part.name"
                class="mb-3 d-flex align-items-center">
                {{ part.name }}
                <svg-icon
                  v-tooltip="instructionsTooltip"
                  class="page-testRun-part-icon"
                  name="info-question"/>
              </div>

              <div class="page-testRun-tasks">
                <template
                  v-for="(task, taskIndex) in part.tasks"
                  :key="taskIndex">
                  <task-item-title
                    v-if="showZeroPageTitle(task, part.tasks) && !isSingleZeroPage(task, part.tasks)"
                    :tasks="getZeroPageTasks(task, part.tasks)"/>

                  <task-item
                    ref="taskRefs"
                    :show-zero-page="showZeroPageTitle(task, part.tasks)"
                    :single-zero-page="isSingleZeroPage(task, part.tasks)"
                    :task="task"
                    :mode="'multiple'"
                    :preview="false"
                    :answer="store.answerById(task.id)"
                    :test-id="store.test.id"
                    :control="store.attempt && store.attempt.mode === 'control'"
                    :num="task.order"
                    :tag="store.test.type !== 'demovariant' ? task.part_name : null"
                    :class="{'taskItem--last': isLastZeroPageTask(task, part.tasks)}"
                    @answer-change="onAnswerChange(task.id, $event)"
                    @toggle-favorite="toggleTaskFavorite"/>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div>
          <common-sticky-column>
            <test-run-stat
              @pause="onPause"
              @end="onEnd"
              @scroll-to="onScrollTo"/>
          </common-sticky-column>
        </div>
      </common-columns>

      <test-modal-pause
        ref="pauseModal"
        :uncompleted-tasks="uncompletedTasks"
        @hidden="onProceed"
        @later="onLater"
        @end="onEndConfirm"/>

      <test-modal-end
        ref="endModal"
        :uncompleted-tasks="uncompletedTasks"
        @hidden="onProceed"
        @end="onEndConfirm"/>

      <test-modal-end-control
        ref="endControlModal"
        :attempt="store.attempt"
        @hidden="onProceed"
        @end="onEndConfirm"/>

      <test-modal-end-block
        ref="endBlockModal"
        @end="onEndBlock"/>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useTestRunStore from '~/stores/test-run';
  import useUserStore from '~/stores/user';

  const store = useTestRunStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  let leaveConfirmed = false;
  let leaveTo = null;
  let interval;
  let unload = ref(true);
  let pause = ref(false);

  const taskRefs = ref([]);
  const endModal = ref(null);
  const endControlModal = ref(null);
  const endBlockModal = ref(null);
  const pauseModal = ref(null);

  const uncompletedTasks = computed(() => {
    if (store.test && store.test.tasks && store.answers) {
      return store.test.tasks.length - store.answers.length;
    }

    return 0;
  });

  const instructionsTooltip = computed(() => ({
    title() {
      return `Инструкция`;
    }
  }));

  onMounted(async () => {
    await store.fetchAttempt();

    if (!store.attempt) {
      leaveConfirmed = true;
      router.push('/test/' + store.test.id);
      return;
    }

    if (!userStore.logged) {
      await store.fetchAnswers();
    }

    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(onInterval, 1000);
    window.addEventListener('beforeunload', onBeforeUnload);

    if (userStore.logged) {
      store.postView();
    }

    if (store.attempt.is_finished) {
      endBlockModal.value.show();
    }
  });

  onBeforeRouteLeave((route) => {
    if (!leaveConfirmed) {
      if (store.attempt && !store.attempt.is_finished) {
        if (store.attempt.mode === 'control') {
          endControlModal.value.show();
        } else {
          pause.value = true;
          pauseModal.value.show();
        }
      }

      leaveTo = route.fullPath;
      return false;
    }
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'test-run-id') {
      store.$reset();
    } else {
      store.reset();
    }

    if (interval) {
      clearInterval(interval);
    }

    window.removeEventListener('beforeunload', onBeforeUnload);
  });

  const faster = () => {
    if (!useRuntimeConfig().public.PRODUCTION) {
      clearInterval(interval);
      interval = setInterval(onInterval, 5);
    }
  };

  const onInterval = () => {
    if (pause.value) {
      return;
    }

    store.tick();

    if (store.attempt && !store.attempt.is_finished && store.attempt.mode === 'control' && store.attempt.time === 0) {
      endControlModal.value.show();
      clearInterval(interval);
    }
  };

  const onBeforeUnload = async () => {
    if (unload.value) {
      await store.save(false, testAction.PAUSE);
    }
  };

  const onPause = () => {
    pause.value = true;
    pauseModal.value.show();
  };

  const onEnd = () => {
    if (store.attempt && !store.attempt.is_finished) {
      if (store.attempt.mode === 'control') {
        endControlModal.value.show();
      } else {
        pause.value = true;
        endModal.value.show();
      }
    }
  };

  const onProceed = () => {
    pause.value = false;
    leaveTo = null;
  };

  const onLater = async () => {
    eventBus.emit('loader:show');
    const to = leaveTo ? leaveTo : '/test/' + store.test.id;
    clearInterval(interval);
    await store.save(false, testAction.PAUSE);
    unload.value = false;
    eventBus.emit('loader:hide');
    leaveConfirmed = true;
    router.push(to);
  };

  const onEndConfirm = async () => {
    eventBus.emit('loader:show');
    const to = leaveTo ? leaveTo : '/test/' + store.test.id;
    clearInterval(interval);
    const getActionId = () => {
      if (store.attempt.mode === passingTestMode.CONTROL && store.attempt.time > 0) {
        return testAction.FORCE_COMPLETION;
      } else if (store.attempt.mode === passingTestMode.TRAINING) {
        return testAction.FORCE_COMPLETION;
      } else {
        return testAction.COMPLETION;
      }
    };
    await store.save(true, getActionId());
    await store.check();
    await store.finish();
    unload.value = false;
    eventBus.emit('loader:hide');
    leaveConfirmed = true;
    router.push(to);
  };

  const onEndBlock = () => {
    const to = leaveTo ? leaveTo : '/test/' + store.test.id;
    leaveConfirmed = true;
    router.push(to);
  };

  const onAnswerChange = (id, answer) => {
    store.setAnswer(id, answer);
  };

  const onScrollTo = (id) => {
    const task = taskRefs.value.find((taskRef) => taskRef.task.id === id);

    if (task) {
      task.$el.scrollIntoView();
    }
  };

  const toggleTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.task.parent_id, 'task', !context.task.is_favorite);

    if (res) {
      store.setTaskField(context.task.id, 'is_favorite', !context.task.is_favorite);
    }
    context.setProgress(false, 150);
  };

  await useAsyncData(`test-run-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id)
  ]));

  useHead({
    ...pageTitle(store.test.name)
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-testRun {
    padding-top: 1.125rem;
  }

  .page-testRun-part {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .page-testRun-part-icon {
    color: #7f838a;
    width: 0.938rem;
    height: 0.938rem;
    cursor: pointer;
    margin-left: 0.4rem;
  }

  .page-testRun-tasks .taskItem:not(:last-child) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .page-testRun-tasks .taskItem:not(:first-child) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -1px;
  }

  .page-testRun-tasks .taskItem--last:not(:last-child) {
    margin-bottom: 1.25rem;
    border-bottom-left-radius: 0.8rem !important;
    border-bottom-right-radius: 0.8rem !important;
  }

  .page-testRun-tasks .taskItem--last + .taskItem {
    border-top-left-radius: 0.8rem !important;
    border-top-right-radius: 0.8rem !important;
  }
</style>
