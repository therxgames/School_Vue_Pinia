<template>
  <div class="testStat">
    <div
      v-if="passingStatus.isStart || passingStatus.isUnavailable"
      class="testStat-start">
      <div class="testStat-title">
        Всего заданий
      </div>

      <div class="testStat-start-tasksCount">
        {{ store.tasksCount }}
      </div>

      <div class="testStat-start-controls">
        <input-checkbox
          v-if="passingStatus.isStart"
          value="on"
          label="Контрольный режим"
          v-model:checked="controlSetter">
          <template #labelAfter>
            <div
              v-tooltip="controlInfoTpOpts"
              class="testStat-start-controlInfo">
              <svg-icon
                class="testStat-start-controlInfo-icon"
                name="info"/>
            </div>
          </template>
        </input-checkbox>

        <a
          v-if="passingStatus.isStart"
          @click="emit('go-start', getContext())"
          class="testStat-start-btn btn btn-primary">
          Начать тест
        </a>

        <div class="mt-2">
          Примерное время выполнения
          <br>
          {{ passingTestDuration(store.test).distance }}
          <img
            class="testStat-timeImg"
            src="~/assets/images/emoji/4.png">
        </div>
      </div>
    </div>

    <div
      v-if="passingStatus.isContinue"
      class="testStat-continue">
      <div class="testStat-title">
        Приостановлено
      </div>

      <common-counter
        :num="store.answeredCount"
        :total="store.test.tasks_count"/>

      <div class="testStat-continue-progress">
        <div
          class="testStat-continue-progress-bar"
          :style="{width: `${passingStatus.progress}%`}"/>
      </div>

      <div class="testStat-continue-details">
        Приостановлено {{ formatDate(store.test.last_action_at, 'd MMM yyyy г.') }}
        <br>
        Время выполнения: <img
          src="~/assets/images/emoji/4.png"
          class="testStat-timeImg"> {{ passingStatus.duration }}
      </div>

      <div class="testStat-continue-controls">
        <div
          @click="emit('go-continue', getContext())"
          class="testStat-continue-btn btn btn-primary w-100">
          Продолжить
        </div>

        <div class="mt-3">
          <a
            class="testStat-continue-reset icon-text"
            href="#"
            @click="emit('go-retake', getContext())">
            <svg-icon name="reset"/>
            <span>Заново</span>
          </a>
        </div>
      </div>
    </div>

    <common-stat-scoring-task
      v-if="scoringTask"
      :scoring-task="scoringTask"
      :answer="scoringTask.answer"
      @score-task="emit('score-task', $event)"
      @return-to-tasks="emit('return-to-tasks')"/>

    <div
      v-else-if="passingStatus.isFinished"
      class="testStat-finished">
      <div class="testStat-title">
        Тест завершен
      </div>

      <div v-if="store.needScoring">
        Для подведения итогов осталось оценить задания с развернутым ответом.
      </div>

      <common-test-score
        v-else
        :mark="passingStatus.finishedMark"
        :score="passingStatus.finishedScore"/>

      <div class="testStat-finished-details mt-5">
        <div v-if="!store.needScoring">
          Вы ответили правильно<br>
          на {{ passingStatus.correctness }}
          {{ declension(passingStatus.correctness, lexicon.decl.answers) }}
          из {{ store.test.tasks_count }}
        </div>

        <div class="testStat-finished-details-pass">
          Завершен {{ formatDate(passingStatus.lastActionAt, 'd MMM yyyy г.') }} <br>
          Время выполнения: <img
            src="~/assets/images/emoji/4.png"
            class="testStat-timeImg"> {{ passingStatus.duration }}
        </div>

        <common-test-mode
          :mode="store.test.mode || store.attempt.mode"
          class="mt-3"/>
      </div>

      <common-stat-scoring
        v-if="store.needScoring"
        :free-answer-tasks="store.freeAnswerTasks"
        :show-save-and-send-btn="userStore.logged"
        @score-task="emit('score-task', $event)"
        @save="saveScore"
        @save-and-send="saveAndSendScore"/>

      <div
        v-else
        class="testStat-finished-controls">
        <div
          class="testStat-finished-btn btn btn-simple btn-icon"
          @click="emit('go-retake', getContext())">
          <svg-icon name="reset"/>
          <span v-if="passingStatus.finishedMark === 'f'">
            Пересдать
          </span>
          <span v-else>
            Пройти заново
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="attemptsExists && !store.needScoring"
      class="mt-3">
      <a
        @click="emit('statistics', getContext())"
        class="testStat-statistics icon-text"
        href="#">
        <span>Статистика</span>
        <svg-icon name="arrow-right"/>
      </a>
    </div>
  </div>
</template>

<script setup>
  import useTestViewStore from '~/stores/test-view';
  import useUserStore from '~/stores/user';

  const props = defineProps({
    scoringTask: {type: Object, default: null}
  });
  const emit = defineEmits(['statistics', 'go-retake', 'go-continue', 'go-start', 'score-task', 'return-to-tasks']);
  const store = useTestViewStore();
  const userStore = useUserStore();
  const control = ref(false);
  const reset = ref(false);
  const localAttemptsExists = ref(false);
  const controlSetter = computed( {
    get: () => control.value,
    set: ({value, checked, $event}) => control.value = checked
  });
  const controlInfoTpOpts = computed(() => ({
    title() {
      return `
        <div class="testStat-start-controlTooltip-content">
          <span>${passingTestDuration(store.test).distance} на выполнение</span>
          <br>
          <span>Поставить на паузу нельзя</span>
          <br>
          <span>По истечении времени тест завершится автоматически</span>
        </div>
      `;
    },
    offset: [-165, 10],
    customClass: 'testStat-start-controlTooltip'
  }));
  const passingStatus = computed(() => {
    if (!userStore.logged && store.attempt) {
      return passingTestStatus({
        ...store.attempt,
        tasks_count: store.test.tasks_count
      });
    }

    return passingTestStatus(store.test);
  });

  const attemptsExists = computed(() => {
    return store.test.versions_has_attempts || localAttemptsExists.value;
  });

  const saveScore = async () => {
    let notScoredTasks = 0;

    store.freeAnswerTasks.forEach((task) => {
      if (!task.answer.answer.scores) {
        notScoredTasks++;
      }
    });

    let content = '';

    if (notScoredTasks > 0) {
      content += `У вас не проставлены баллы у ${notScoredTasks} ${declension(notScoredTasks, ['задания', 'заданий', 'заданий'])}. Задания без проверки будут оценены в 0 баллов.<br><br>`;
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
            await store.saveScore();
            await store.fetch(store.test.id);
            window.scrollTo(0, 0);
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

  const saveAndSendScore = async () => {
    let notScoredTasks = 0;

    store.freeAnswerTasks.forEach((task) => {
      if (!task.answer.answer.scores) {
        notScoredTasks++;
      }
    });

    let content = '';

    if (notScoredTasks > 0) {
      content += `У вас не проставлены баллы у ${notScoredTasks} ${declension(notScoredTasks, ['задания', 'заданий', 'заданий'])}. Задания без проверки будут оценены в 0 баллов.<br><br>`;
    }

    content += `Результаты будут отправлены на оценку эксперту.<br><br>После сохранения невозможно будет изменить результаты проверки.`;

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
            await store.saveScore();
            await store.sendScore();
            await store.fetch(store.test.id);
            window.scrollTo(0, 0);
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

  onMounted(() => {
    localAttemptsExists.value = localServer.getAttempts({
      test_id: store.test.id
    })?.length > 0;
  });

  const getContext = () => {
    return {
      ...store.test,
      control: control.value
    };
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testStat {
    border-radius: 1rem;
    border: 1px solid $color-normal;
    padding: 1.5rem;
    width: 295px;
  }

  .testStat-title {
    color: $color-dark;
  }

  .testStat-timeImg {
    width: 1rem;
    vertical-align: -0.15rem;
  }

  .testStat-statistics {
    margin-top: 1rem;

    .svg-icon {
      width: 0.413rem;
      height: 0.725rem;
      transition: $transition;
    }

    &:hover .svg-icon {
      transform: translateX(0.2rem);
    }
  }

  .testStat-start-tasksCount {
    font-size: 5rem;
    line-height: 1;
  }

  .testStat-start-controls {
    color: $color-dark;
    margin-top: 3.5rem;
    font-size: 0.875rem;
  }

  .testStat-start-controlInfo {
    margin-left: 0.5rem;
    margin-top: 0.15rem;
  }

  .testStat-start-controlInfo-icon {
    width: 0.938rem;
    height: 0.938rem;
    cursor: pointer;

    &:hover {
      color: $color-blue-normal;
    }
  }

  .testStat-start-controlTooltip {
    --bs-tooltip-max-width: 26.25rem;
  }

  .testStat-start-controlTooltip-content {
    font-size: 0.875rem;
    text-align: left;
    line-height: 1.5rem;
  }

  .testStat-start-btn {
    --bs-btn-padding-y: 0.938rem;

    width: 100%;
    margin-top: 1rem;
  }

  .testStat-continue-progress {
    margin-top: 1rem;
    height: 8px;
    border-radius: 8px;
    background: $color-dark-light;
  }

  .testStat-continue-progress-bar {
    border-radius: 8px;
    background: $color-green-normal;
    height: 100%;
    width: 0;
    transition: width 300ms ease-out;
  }

  .testStat-continue-details {
    margin-top: 3rem;
    color: #7f838a;
    font-size: 0.875rem;
  }

  .testStat-continue-controls {
    margin-top: 1rem;
  }

  .testStat-continue-btn {
    --bs-btn-padding-y: 0.938rem;
  }

  .testStat-continue-reset {
    color: $color-black;

    .svg-icon {
      width: 0.8rem;
      height: 0.8rem;

      path {
        fill: $color-black !important;
      }
    }

    &:hover {
      color: $color-blue-normal;

      .svg-icon path {
        fill: $color-blue-normal !important;
      }
    }
  }

  .testStat-finished-details {
    margin-top: 3rem;
  }

  .testStat-finished-details-pass {
    margin-top: 0.5rem;
    color: $color-dark;
    font-size: 0.875rem;
  }

  .testStat-finished-controls {
    color: $color-dark;
    margin-top: 3rem;
  }

  .testStat-finished-btn {
    justify-content: center;

    .svg-icon {
      width: 1.094rem;
      height: 1.031rem;

      path {
        fill: $color-black !important;
      }
    }
  }
</style>
