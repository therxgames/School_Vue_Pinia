<template>
  <div
    ref="root"
    :class="{'taskItem--progress': progress}"
    class="taskItem">
    <common-content
      v-if="task.zeropage_text && showZeroPage && !singleZeroPage"
      class="taskItem-zeroPage"
      :content="task.zeropage_text"/>

    <div class="taskItem-header">
      <div
        v-if="false"
        class="taskItem-new">
        Новое
      </div>

      <div class="taskItem-id">
        # {{ task.parent_id }}
      </div>

      <common-task-buttons
        :task="task"
        :get-context="getContext"
        :show-history="showHistory"
        :control="control"
        :toggle-solution="toggleSolution"
        :show-solution="showSolution"
        @toggle-favorite="$emit('toggle-favorite', $event)"/>
    </div>

    <div
      class="taskItem-body">
      <component
        ref="app"
        :is="component"
        :task="task"
        :answer="answer"
        :step="step"
        :show-zero-page="showZeroPage && singleZeroPage"
        :show-solution="showSolution"
        :preview="preview"
        :num="props.num"
        :tag="props.tag"
        :mode="props.mode"
        @answer-change="onAnswerChange"
        @check="check"/>
    </div>

    <div
      v-if="showSolution && task.answer"
      class="taskItem-solution">
      <div class="taskItem-solution-title">
        Правильный ответ
      </div>

      <div
        v-if="task.answer"
        v-html="solutionContent"
        class="taskItem-solution-body"/>
    </div>

    <div v-if="step === 'scoring'">
      <div
        v-if="typeof task.criteria === 'string'"
        v-html="task.criteria"/>

      <task-item-free-answer-criteria
        v-else
        :content="task.criteria"
        :scoring="true"
        :answer="answer"
        @scores-change="onScoresChange"/>
    </div>

    <div class="taskItem-footer">
      <div
        v-if="step === steps.INTERACTION && mode === 'single'"
        class="taskItem-footer--interaction">
        <div
          class="btn btn-primary"
          @click.prevent="check()">
          <span v-if="task.type === 'FREE_ANSWER'">
            Отправить
          </span>

          <span v-else>
            Проверить
          </span>
        </div>
        <div
          v-if="info"
          class="taskItem-footer-info"
          v-html="info"/>
      </div>

      <div
        v-if="step === steps.RESULT"
        class="taskItem-footer--result">
        <div
          v-if="task.type === 'FREE_ANSWER' && answer.result === 'scoring' && mode === 'single'"
          class="btn btn-primary"
          @click.prevent="score()">
          Проверить
        </div>

        <div v-if="task.type === taskType.FREE_ANSWER && answer.answer_expertises_id">
          <div
            v-if="answer.answer_expertises_comment === null && answer.answer_expertises_point === null"
            class="taskItem-answer-status-on-expertise">
            <svg-icon
              class="taskItem-answer-status-on-expertise-icon"
              name="info-filled"/>
            <span>Ожидается оценка учителем</span>
          </div>
          <div
            v-else
            class="taskItem-answer-status-expertise-finished">
            <svg-icon
              class="taskItem-answer-status-expertise-finished-icon"
              name="check-circle"/>
            <span>Оценка эксперта получена!</span>
          </div>
        </div>

        <div
          v-else-if="answer.result === 'correct' || (answer.result === 'wrong' && partialAnswer)"
          class="taskItem-footer-result taskItem-footer-result--correct">
          <svg-icon
            class="taskItem-footer-result-icon"
            name="check-circle"/>
          <span v-if="answer.result === 'correct'">Верно!</span>
          <span v-if="answer.result === 'wrong' && partialAnswer">Верно! Но есть еще</span>
        </div>

        <div
          v-else-if="answer.result === 'wrong'"
          class="taskItem-footer-result taskItem-footer-result--wrong">
          Вы ответили неверно <img src="~/assets/images/emoji/1.png">
        </div>

        <a
          v-if="mode === 'single' && !preview"
          href="#"
          class="taskItem-footer-resetBtn"
          @click.prevent="reset()">
          <svg-icon
            class="taskItem-footer-resetBtn-icon"
            name="reset"/>
          Сбросить ответ
        </a>
        <a
          v-if="mode === 'single' && answer.result !== 'scoring' && !preview"
          href="#"
          class="taskItem-footer-solutionBtn"
          @click.prevent="toggleSolution()">
          <span v-if="showSolution">Скрыть ответ</span>
          <span v-else>Показать ответ</span>
        </a>
        <a
          href="#"
          class="taskItem-footer-historyBtn"
          @click.prevent="showHistory">
          История ответов
        </a>
      </div>

      <div
        v-if="task.type === taskType.FREE_ANSWER
          && answer.answer_expertises_id
          && (answer.answer_expertises_comment
            || answer.answer_expertises_point)"
        class="taskItem-answer-expertise-details">
        <div class="taskItem-answer-expertise-details-point">
          <div class="taskItem-answer-expertise-details-point-value">
            {{ answer.answer_expertises_point }}
            <span>
              / {{ declension(answer.answer_expertises_point, lexicon.decl.points) }}
            </span>
          </div>
        </div>
        <div
          v-if="answer.answer_expertises_comment"
          class="taskItem-answer-expertise-details-border"/>
        <div
          v-if="answer.answer_expertises_comment"
          class="taskItem-answer-expertise-details-comment">
          <div class="taskItem-answer-expertise-details-comment-header">
            <svg-icon
              class="taskItem-answer-expertise-details-comment-header-icon"
              name="feather"/>
            <span>Комментарий эксперта</span>
          </div>
          <div v-html="answer.answer_expertises_comment"/>
        </div>
      </div>

      <div
        v-if="showNoAnswer && preview && (!answer || !answer.id)"
        style="color: #ffb40a; font-size: 0.875rem; display: flex; align-items: center; min-height: 44.39px;">
        Ответа нет <img
          :src="emoji7"
          style="width: 1.15rem; vertical-align: -4px; margin-right: 0.1rem; margin-left: 0.2rem;">
      </div>
    </div>

    <loader
      class="taskItem-loader"
      :listener="progress"/>
  </div>
</template>

<script setup>
  import ChooseAnswer from './choose-answer/choose-answer.vue';
  import OrderAnswer from './order-answer/order-answer.vue';
  import GapMatchTextAnswer from './gap-match-text-answer/gap-match-text-answer.vue';
  import GapMatchTableAnswer from './gap-match-table-answer/gap-match-table-answer.vue';
  import EnterAnswer from './enter-answer/enter-answer.vue';
  import FreeAnswer from './free-answer/free-answer.vue';
  import createTaskItemStore from '~/stores/task-item';
  import emoji7 from '~/assets/images/emoji/7.png';
  import useUserStore from '~/stores/user';
  import shuffle from 'lodash.shuffle';

  const router = useRouter();

  const steps = {
    INTERACTION: 'interaction',
    RESULT: 'result',
    SCORING: 'scoring'
  };

  const props = defineProps({
    task: {type: Object, required: true},
    mode: {type: String, default: 'single'},
    preview: {type: Boolean, default: false},
    showNoAnswer: {type: Boolean, default: true},
    answer: {type: Object, default: () => {
      return {id: null, answer: null, files: null};
    }},
    testId: {type: Number, default: null},
    control: {type: Boolean, default: false},
    num: {type: Number, default: null},
    tag: {type: String, default: null},
    showZeroPage: {type: Boolean, default: true},
    singleZeroPage: {type: Boolean, default: true}
  });

  const emit = defineEmits(['answer-change', 'check', 'reset', 'score', 'toggle-favorite']);

  const userStore = useUserStore();
  const store = createTaskItemStore(props.task.id)();
  const step = ref(steps.INTERACTION);
  const info = ref(null);
  const showSolution = ref(false);
  const progress = ref(false);
  const root = ref(null);

  watch([() => props.answer.id, () => props.answer.result], () => {
    if (props.answer) {
      if (props.answer.result) {
        if (props.answer.result === 'unchecked') {
          step.value = steps.INTERACTION;
        } else {
          step.value = steps.RESULT;
        }
      } else {
        step.value = steps.INTERACTION;
      }
    }
  }, {immediate: true});

  const component = computed(() => {
    switch (props.task.type) {
      case taskType.CHOOSE_ANSWER:
        return ChooseAnswer;
      case taskType.ENTER_ANSWER:
        return EnterAnswer;
      case taskType.FREE_ANSWER:
        return FreeAnswer;
      case taskType.ORDER_ANSWER:
        return OrderAnswer;
      case taskType.GAP_MATCH_TEXT_ANSWER:
        return GapMatchTextAnswer;
      case taskType.GAP_MATCH_TABLE_ANSWER:
        return GapMatchTableAnswer;
    }
  });

  const solutionContent = computed(() => {
    switch (props.task.type) {
      case taskType.ENTER_ANSWER: {
        return props.task.answer.join(', ');
      }

      case taskType.CHOOSE_ANSWER: {
        const content = props.task?.answer?.map((correctValue) => {
          return {
            text: props.task.variants?.find((variant) => variant.value === correctValue).text,
            index: props.task.variants?.findIndex((variant) => variant.value === correctValue)
          };
        }).sort((a, b) => a.index - b.index);

        return content?.map((variant) => {
          return `<div title="${variant.text}" class="d-flex">
            <span class="taskItem-answer-choose-index">${variant.index + 1}</span>
            <span class="taskItem-answer-choose-variant">${variant.text}</span>
          </div>`;
        }).join(`<div class="pt-3"></div>`);
      }

      case taskType.ORDER_ANSWER: {
        return props.task.answer.reduce((acc, id) => {
          acc += `<span class="taskItem-answer-choose-index">${id}</span>`;
          return acc;
        }, '<div class="">') + '</div>';
      }

      case taskType.GAP_MATCH_TEXT_ANSWER: {
        const content = props.task?.answer?.map((id) => {
          if (id === '0') return '[ ]';
          const res = props.task.variants.find((item) => item.value === id);
          return res.text;
        });

        return content.reduce((acc, text, idx) => {
          acc+= `<span class="taskItem-answer-gap-match-text">${text}</span>`;
          if (idx === content.length-1) acc+='</div>';
          return acc;
        }, '<div class="">');
      }

      case taskType.GAP_MATCH_TABLE_ANSWER: {
        const validate = (text) => {
          const REG = /\sMathType@MTEF.*@\s/g;
          const regImg = /<img/gi;
          while (REG.test(text)) {
            text = text.replace(REG, '');
          }
          if (regImg.test(text)) {
            text = '';
          }
          return text;
        };
        const content = props.task.answer?.map(([correctValue, col]) => {
          const cols = ['A', 'B', 'C', 'D', 'I', 'F', 'G'];
          return {
            text: validate(props.task.variants_items?.find((variant) => variant.value == correctValue)?.text),
            index: cols.indexOf(col),
            indexText: validate(props.task.variants_groups?.find((variant) => variant.value == col)?.text)
          };
        }).sort((a, b) => a.index - b.index);

        return content?.map((variant) => {
          return `<div class="d-flex">
            <span title="${variant.indexText}" class="taskItem-answer-choose-index">${variant.index + 1}</span>
            <span title="${variant.text}" class="taskItem-answer-choose-variant">${variant.text}</span>
          </div>`;
        }).join(`<div class="pt-3"></div>`);
      }
      default: {
        return props.task.answer;
      }
    }
  });

  let observer;

  onMounted(() => {
    if (userStore.logged) {
      observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!props.preview) {
            store.postView(props.task.parent_id);
            observer.disconnect();
            observer = null;
          }
        }
      }, {
        root: null,
        threshold: 0
      });

      observer.observe(root.value);
    }
  });

  onBeforeUnmount(() => {
    store.reset();

    if (observer) {
      observer.disconnect();
    }
  });

  const partialAnswer = computed(() => {
    return props.task.variants_multiple
      && props.answer.answer?.every((value) => props.task.answer.includes(value))
      && props.answer.answer?.length < props.task.answer?.length;
  });

  const check = async () => {
    if (!answerIsFilled(props.task, props.answer)) {
      if (props.task.type === 'FREE_ANSWER' && props.task.variants.length && (!props.answer.answer || !props.answer.answer.variant)) {
        info.value = `<img src="${emoji7}"> Выберите вариант`;
      } else {
        info.value = `<img src="${emoji7}"> Укажите ответ`;
      }
      
      return;
    }

    await setProgress(true);
    emit('check', () => {
      step.value = steps.RESULT;
      setProgress(false, 150);
    });
  };

  const score = () => {
    step.value = steps.SCORING;
    showSolution.value = true;
    emit('score');
  };

  const reset = () => {
    if (!props.task.is_current) {
      return;
    }

    step.value = steps.INTERACTION;
    showSolution.value = false;

    const newAnswer = {...props.answer};
    newAnswer.answer = null;
    onAnswerChange(newAnswer);

    props.task.variants = shuffleTaskVariants(props.task);

    emit('reset');
  };

  const toggleSolution = () => {
    showSolution.value = !showSolution.value;
  };

  const showHistory = async () => {
    eventBus.emit('alert:show', {
      title: 'История ответов',
      contentComponent: 'helperAlertContentTaskAnswersHistory',
      maxWidth: '800px',
      hideAllButtons: true,
      additionalData: {...props.task, testId: props.testId}
    });
  };

  const onAnswerChange = (answer) => {
    emit('answer-change', answer);
    info.value = null;
  };

  const onScoresChange = (scores) => {
    const newAnswer = {...props.answer};
    newAnswer.answer = {...newAnswer.answer};
    newAnswer.answer.score = Object.values(scores).reduce((a, b) => a + b, 0);
    newAnswer.answer.scores = scores;

    const groups = getCriteriaGroups(props.task, props.answer?.answer?.variant);

    if (groups) {
      newAnswer.answer.maxScore = groups.reduce((acc, group) => acc + group.maxScore, 0);
    }

    emit('answer-change', newAnswer);
  };

  const setStep = (value) => {
    step.value = value;
  };

  const setShowSolution = (value) => {
    showSolution.value = value;
  };

  const setProgress = async (_progress, delay = 0) => {
    await sleep(delay);
    progress.value = _progress;
  };

  const getContext = () => {
    return {
      task: props.task,
      store,
      setShowSolution,
      setStep,
      setProgress
    };
  };

  defineExpose({
    ...getContext()
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskItem {
    width: 100%;
    border: 1px solid #ced6e0;
    border-radius: 0.8rem;
    padding: 1.5rem 2rem;
    background-color: #fff;
    position: relative;
    transition: $transition;
  }

  .taskItem-zeroPage {
    width: 80%;
    border-bottom: 1px solid $color-dark-light;
    margin-bottom: 1.5rem;
  }

  .taskItem-header {
    display: flex;
    align-items: center;
  }

  .taskItem-new {
    background: #9747ff;
    font-size: 0.875rem;
    color: #fff;
    padding: 0.45rem 0.6rem;
    border-radius: 0.5rem;
    line-height: 1;
    margin-right: 1rem;
  }

  .taskItem-id {
    font-size: 0.875rem;
    color: #7f838a;
  }

  .taskItem-buttons {
    margin-left: auto;
    display: flex;
  }

  .taskItem-body {
    width: 80%;
    margin: 1rem 0;

    &.disabled {
      user-select: none;
      pointer-events: none;
    }
  }

  .taskItem-footer--interaction,
  .taskItem-footer--solution,
  .taskItem-footer--result {
    display: flex;
    align-items: center;
  }

  .taskItem-footer--result {
    font-size: 0.875rem;
    min-height: 44.39px;
  }

  .taskItem-footer-result {
    display: flex;
    align-items: center;
  }

  .taskItem-footer-result-icon {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.4rem;
  }

  .taskItem-footer-result--correct {
    color: #2a8436;

    .taskItem-footer-result-icon {
      color: $color-green-normal;
    }
  }

  .taskItem-footer-result--wrong {
    color: #f85542;

    img {
      width: 1.15rem;
      margin-left: 0.2rem;
    }
  }

  .taskItem-footer-resetBtn,
  .taskItem-footer-solutionBtn,
  .taskItem-footer-historyBtn {
    color: #7f838a;
    cursor: pointer;

    &:hover {
      color: #000;
    }
  }

  .taskItem-footer-resetBtn {
    margin-left: 1.5rem;
    display: flex;
    align-items: center;
  }

  .taskItem-footer-resetBtn-icon {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.5rem;
  }

  .taskItem-footer-solutionBtn {
    margin-left: 1.5rem;
  }

  .taskItem-footer-historyBtn {
    margin-left: auto;
  }

  .taskItem-footer-info {
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    background-color: #fec;
    margin-left: 1rem;
    font-size: 0.875rem;
    position: relative;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-width: 5px 5px 5px 0;
      border-color: transparent #fec transparent transparent;
      border-style: solid;
      position: absolute;
      right: 100%;
      top: 50%;
      margin-top: -5px;
    }

    img {
      width: 1.15rem;
      vertical-align: -4px;
      margin-right: 0.1rem;
    }
  }

  .taskItem-solution {
    margin-bottom: 1rem;
  }

  .taskItem-solution-title {
    color: #7f838a;
    font-size: 0.875rem;
    margin-bottom: 0.4rem;
  }

  .taskItem-solution-body {
    display: inline-block;
    background-color: #e6f2ff;
    padding: 0.6rem 0.8rem;
    border-radius: 0.5rem;

    p:last-child {
      margin-bottom: 0;
    }
  }

  .taskItem-answer-choose-index {
    background: #bcdbfd;
    width: 1.5rem;
    display: inline-flex;
    height: 1.5rem;
    border-radius: 5rem;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    margin-right: 0.3rem;
  }

  .taskItem-answer-choose-variant {
    max-width: 41rem;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .taskItem-favBtn--inFav {
    color: #fec84d;

    path {
      opacity: 1 !important;
    }

    &:hover {
      color: #fec84d;
    }
  }

  .taskItem.taskItem--progress {
    border: 1px solid #eee;
  }

  .taskItem-loader {
    --loader-max-opacity: 0.9;

    border-radius: $border-radius;
  }

  .taskItem-answer-status-on-expertise,
  .taskItem-answer-status-expertise-finished {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .taskItem-answer-status-expertise-finished {
    color: $color-green-normal;
  }

  .taskItem-answer-status-on-expertise-icon {
    width: 1.2rem;
    color: $color-red-normal;
  }

  .taskItem-answer-expertise-details {
    padding: 1rem 2rem;
    display: inline-flex;
    background: $color-blue-light-10;
    align-items: baseline;
    margin-top: 1rem;
    border-radius: 1rem;
    max-width: 25rem;
    flex-direction: column;
    position: relative;
  }

  .taskItem-answer-expertise-details-point {
    font-size: 5rem;
    position: relative;
  }

  .taskItem-answer-expertise-details-point-value {
    display: flex;
    align-items: flex-start;
    line-height: 1;

    span {
      font-size: 1rem;
      margin-left: 0.5rem;
      margin-top: 0.55rem;
    }
  }

  .taskItem-answer-expertise-details-comment {
    position: relative;
    margin-top: 1rem;
  }

  .taskItem-answer-expertise-details-border {
    height: 1px;
    background: #fff;
    width: 100%;
    margin: 1rem 0;
    position: relative;
    display: none;
  }

  .taskItem-answer-expertise-details-comment-header {
    padding: 0.7rem 2.3rem 0.7rem 1rem;
    display: inline-flex;
    background: #fff;
    border-radius: 0.5rem 0.5rem 1.5rem;
    margin-bottom: 0.5rem;
    color: #6d849a;
    gap: 0.5rem;
  }

  .taskItem-answer-expertise-details-comment-header-icon {
    width: 1.7rem;
    color: #3a5976;
  }

  .taskItem-answer-gap-match-text {
    background: #bcdbfd;
    display: inline-flex;
    border-radius: 5rem;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    padding: 5px 10px;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
</style>
