<template>
  <div
    ref="container"
    :class="`ac-task-answers-history--${watchGroupAccept}`"
    class="ac-task-answers-history">
    <loader
      v-if="fetching"
      :listener="fetching"
      class="ac-task-answers-history-loader"/>
    <div
      ref="scroller"
      class="ac-task-answers-history-scroller scroller-default">
      <div
        v-if="answersGroupJoined.length && !fetching"
        class="ac-task-answers-history-content">
        <div
          v-for="(answer, index) in answersGroupJoined"
          :key="index"
          :class="[
            {'d-none': answer.task_version_number === currentTask.version_number && watchGroupAccept === group.OUTDATED},
            {'d-none': answer.task_version_number !== currentTask.version_number && watchGroupAccept === group.ACTUAL}
          ]"
          class="ac-task-answers-history-grid">
          <div class="ac-task-answers-history-date">
            {{ formatDate(answer.created_at, 'd MMM yyyy, HH:mm') }}
          </div>
          <div>
            <component
              :is="contentComponent"
              :task="resolvedAnswerTask(answer.task_id)"
              :answer="answer"/>
          </div>
          <div
            v-if="watchGroupAccept === group.OUTDATED"
            class="ac-task-answers-history-version">
            <router-link
              @click="props.context.hide"
              :to="`/task/${answer.task_id}`">
              Версия {{ answer.task_version_number }}
            </router-link>
          </div>
          <div>
            <svg-icon
              v-if="answer.result === 'unchecked'"
              v-tooltip="{title: 'Ответ принят, ожидается проверка'}"
              :class="[answer.result]"
              name="check-circle"
              class="ac-task-answers-history-answer-status-icon"/>
            <svg-icon
              v-if="answer.result === 'scoring'"
              v-tooltip="{title: 'Ответ принят, ожидается проверка'}"
              :class="[answer.result]"
              name="check-circle"
              class="ac-task-answers-history-answer-status-icon"/>
            <svg-icon
              v-if="answer.result === 'correct'"
              v-tooltip="{title: 'Ответ верный'}"
              :class="[answer.result]"
              name="check-circle"
              class="ac-task-answers-history-answer-status-icon"/>
            <svg-icon
              v-if="answer.result === 'wrong'"
              v-tooltip="{title: 'Ответ неверный'}"
              :class="[answer.result]"
              name="cross-circle"
              class="ac-task-answers-history-answer-status-icon"/>
          </div>
        </div>
      </div>
      <div
        v-else-if="!fetching"
        class="ac-task-answers-history-parse-error">
        Ошибка разбора ответов
      </div>
    </div>
    <div
      v-if="outdatedAnswersExists && !fetching"
      class="ac-task-answers-history-nav">
      <div
        @click="watchGroup = group.ACTUAL"
        :class="[{'disabled': !actualAnswersExists}, {'current': watchGroup === group.ACTUAL}]"
        class="icon-text ac-task-answers-history-nav-item">
        <svg-icon
          v-if="watchGroup === group.OUTDATED"
          name="arrow-left"/>
        Активные прохождения
      </div>
      <div
        @click="watchGroup = group.OUTDATED"
        :class="[{'disabled': !outdatedAnswersExists}, {'current': watchGroup === group.OUTDATED}]"
        class="icon-text ac-task-answers-history-nav-item">
        Неактивные прохождения
        <svg-icon
          v-if="watchGroup === group.ACTUAL"
          name="arrow-right"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import useCommonStore from '~/stores/common';
  import SmoothScrollbar from 'smooth-scrollbar';

  const userStore = useUserStore();
  const props = defineProps(alertContentProps());
  const group = {
    ACTUAL: 'actual',
    OUTDATED: 'outdated'
  };
  const isInitialized = ref(false);
  const fetching = ref(false);
  const currentTask = ref({});
  const answers = ref([]);
  const container = ref(null);
  const scroller = ref(null);
  const scrollerStatus = ref({offset: {x: 0, y: 0}, limit: {x: 0, y: 0}});
  const watchGroup = ref(group.ACTUAL);
  const watchGroupAccept = ref(watchGroup.value);
  const contentComponent = computed(() => {
    switch (currentTask.value.type) {
      case taskType.CHOOSE_ANSWER:
        return resolveComponent('HelperAlertContentAnswerChoose');
      case taskType.ENTER_ANSWER:
        return resolveComponent('HelperAlertContentAnswerEnter');
      case taskType.FREE_ANSWER:
        return resolveComponent('HelperAlertContentAnswerFree');
      case taskType.ORDER_ANSWER:
        return resolveComponent('HelperAlertContentAnswerOrder');
      case taskType.GAP_MATCH_TEXT_ANSWER:
        return resolveComponent('HelperAlertContentAnswerGapMatchText');
      case taskType.GAP_MATCH_TABLE_ANSWER:
        return resolveComponent('HelperAlertContentAnswerGapMatchTable');
      default:
        return null;
    }
  });
  const sortedAnswers = computed(() => {
    return answers.value.sort((a, b) => b.id - a.id);
  });
  const answersGroup = computed(() => {
    const actual = sortedAnswers.value.filter((answerItem) => answerItem.task_version_number === currentTask.value.version_number);
    const outdated = sortedAnswers.value.filter((answerItem) => answerItem.task_version_number !== currentTask.value.version_number);
    return {
      actual,
      outdated
    };
  });
  const answersGroupJoined = computed(() => {
    return [...answersGroup.value.actual, ...answersGroup.value.outdated];
  });
  const outdatedAnswersExists = computed(() => {
    return answersGroup.value.outdated.length > 0;
  });
  const actualAnswersExists = computed(() => {
    return answersGroup.value.actual.length > 0;
  });

  let scrollerInst = null;

  watch(
    () => [isInitialized.value, fetching.value],
    async () => {
      if (isInitialized.value && !fetching.value) {
        await nextTick();

        if (!actualAnswersExists.value) {
          watchGroupAccept.value = watchGroup.value = group.OUTDATED;
        }

        if (!outdatedAnswersExists.value) {
          watchGroupAccept.value = watchGroup.value = group.ACTUAL;
        }

        createScroll();
      }
    }
  );

  watch(
    () => watchGroup.value,
    () => switchGroup()
  );

  onMounted(async () => {
    fetching.value = true;
    await fetch();
    fetching.value = false;
    await nextTick();
    isInitialized.value = true;
  });

  onUnmounted(() => {
    currentTask.value = {};
    answers.value = [];
    fetching.value = false;
    destroyScroll();
  });

  const fetch = async () => {
    await fetchAnswers(props.data.parent_id);
    await fetchTasks();
  };
  const fetchTasks = async () => {
    const taskIds = [
      ...answers.value.map((answer) => {
        return answer.task_id;
      }),
      props.data.current?.id || props.data.id
    ];

    for (const id of [...new Set(taskIds)] ) {
      await useCommonStore().resolveTask(id);
    }

    currentTask.value = resolvedAnswerTask(props.data.current?.id || props.data.id);
  };
  const fetchAnswers = async (id) => {
    if (userStore.logged) {
      try {
        const response = await useApi(`/api/task/${id}/answers`, {
          ...methodGet,
          query: {
            show_all: true,
            is_viewing_history: true
          }
        });
        if (response.data.done) {
          answers.value = response.data.answers;
        }
      } catch (e) {
        console.error(e.message);
      }
    } else {
      answers.value = await localServer.getAnswers({task_parent_id: id});
    }
  };
  const resolvedAnswerTask = (id) => {
    return useCommonStore().resolvedTasks[id];
  };
  const switchGroup = async () => {
    props.context.setProgress(true);
    await sleep(500);
    watchGroupAccept.value = watchGroup.value;
    props.context.setProgress(false);
  };
  const createScroll = () => {
    if (!scroller.value) {
      return;
    }
    scrollerInst = SmoothScrollbar.init(scroller.value, {alwaysShowTracks: true});
    scrollerInst.addListener((status) => Object.assign(scrollerStatus.value, status));
  };
  const destroyScroll = () => {
    if (scrollerInst) {
      SmoothScrollbar.destroy(scroller.value);
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-task-answers-history {
    margin-top: 0.5rem;

    &-content {

    }

    &-actual-content {
      &-empty {
        background: $color-black-10;
        padding: 0.8rem 1rem;
        border-radius: 0.5rem;
      }
    }

    &-grid {
      display: grid;
      grid-template-columns: minmax(180px, 180px) minmax(370px, 500px) auto;
      align-items: flex-start;
      grid-row-gap: 0.5rem;
      grid-column-gap: 1rem;
      margin-bottom: 0.5rem;
    }

    &-outdated-content {

    }

    &-outdated-collapse-toggle {
      display: flex;
      gap: 0.5rem;
      color: $color-black;
      margin-top: 1rem;
      border-top: 1px solid #cfcfcf73;
      padding-top: 0.7rem;
      padding-bottom: 0.5rem;
      cursor: pointer;

      &-header {
        font-weight: 500;
        margin-bottom: 0;
      }

      &-icon {
        width: 0.8rem;
        transition: all 350ms ease-out;
      }

      &.expanded &-icon {
        transform: rotate(-180deg);
      }
    }

    &-outdated-collapse {
      &-grid {
        display: grid;
        grid-template-columns: minmax(180px, 180px) minmax(380px, 410px) minmax(60px, 70px) auto;
        align-items: flex-start;
        grid-row-gap: 0.5rem;
        grid-column-gap: 1rem;
        margin-bottom: 0.5rem;
      }
    }

    &-date {
      color: $color-dark;
    }

    &-caption {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 2rem;
    }

    &-version {
      color: $color-dark;
      font-size: 0.9rem;
    }

    &-loader {
      --loader-spinner-width: 2rem;
      --loader-spinner-height: 2rem;
      --loader-min-height: none;

      display: inline-flex;
      width: auto;
      position: relative;
    }

    &-parse-error {
      padding: 1rem;
      background: #fff1f1;
      border-radius: 0.7rem;
      color: #ff7878;
      margin-bottom: -1rem;
    }

    &-answer-status-icon {
      width: 1em;
      height: 1em;
      margin-top: 0.18rem;
    }

    &-answer-status-icon.correct {
      color: $color-green-normal;
    }

    &-answer-status-icon.wrong {
      color: $color-red-normal;
    }

    &-answer-status-icon.unchecked,
    &-answer-status-icon.scoring {
      color: $color-blue-normal;
    }

    &-scroller {
      max-height: 50vh;
      min-height: 4rem;
    }

    &-nav {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.5rem;
      border-top: 1px solid $color-black-10;
      padding-top: 1rem;
      margin-right: 1.5rem;
      margin-bottom: -1rem;

      &-item {
        --icon-width: 0.75rem;
        --icon-height: 0.75rem;

        user-select: none;
        font-size: 0.875rem;
        color: $color-dark;

        &:hover {
          color: $color-blue-normal;
        }

        &.disabled {
          opacity: 0.2;
          pointer-events: none;
        }

        &.current {
          color: $color-blue-normal;
        }
      }
    }

    &.ac-task-answers-history--outdated &-grid {
      grid-template-columns: minmax(180px, 180px) minmax(370px, 390px) auto auto;
    }
  }
</style>
