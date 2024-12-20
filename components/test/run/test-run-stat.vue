<template>
  <div class="testRunStat">
    <div class="testRunStat-timer">
      <svg-icon
        v-if="attempt && attempt.mode === 'control'"
        name="timer"/>
      <svg-icon
        v-else
        name="time"/>
    </div>

    <div class="testRunStat-time">
      <span class="testRunStat-time-value">
        {{ timeText }}
      </span>

      <div
        v-if="attempt && attempt.mode === 'control'"
        class="testRunStat-controlLabel">
        Контрольный
      </div>

      <a
        v-else
        href="#"
        class="testRunStat-pauseBtn"
        @click.prevent="onPause">
        <svg-icon name="pause"/>
      </a>
    </div>

    <div
      v-if="store.test.tasks"
      class="testRunStat-count">
      {{ store.test.tasks.length }} {{ declension(store.test.tasks.length, ['задание', 'задания', 'заданий']) }}
    </div>

    <div v-if="store.parts">
      <div
        v-for="(part, partIndex) in store.parts"
        :key="partIndex">
        <div
          v-if="part.name"
          class="px-2">
          {{ part.name }}
        </div>

        <ul
          class="testRunStat-list list-unstyled mb-0"
          :style="listStyle(part)">
          <li
            v-for="(task, taskIndex) in part.tasks"
            :key="taskIndex"
            class="testRunStat-list-item"
            :class="itemClass(task.id)"
            @click="onItemClick(task.id)">
            <span class="testRunStat-list-item-num">
              {{ task.order }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="store.test.instruction_wtext"
      class="mb-4">
      <a
        @click.prevent="showTestInstruction"
        href="#">
        Инструкция
      </a>
    </div>

    <a
      class="testRunStat-endBtn btn btn-primary w-100"
      @click.prevent="onEnd">
      Завершить
    </a>
  </div>
</template>

<script setup>
  import useTestRunStore from '~/stores/test-run';
  import {intervalToDuration} from 'date-fns';

  const emit = defineEmits(['scroll-to', 'pause', 'end']);
  const store = useTestRunStore();

  const attempt = computed(() => store.attempt);
  const time = computed(() => store.attempt ? store.attempt.time : null);
  const timeText = computed(() => {
    const timerValue = time.value || 0;
    const interval = intervalToDuration({start: 0, end: timerValue * 1000});

    return interval.hours.toString().padStart(2, '0') + ':'
      + interval.minutes.toString().padStart(2, '0') + ':'
      + interval.seconds.toString().padStart(2, '0');
  });

  const itemClass = (id) => {
    const res = [];

    if (store.test.tasks) {
      const task = store.taskById(id);
      const answer = store.answers.find((answer) => answer.task_id === task.id);

      if (answerIsFilled(task, answer)) {
        res.push('testRunStat-list-item--done');
      }
    }

    return res;
  };

  const showTestInstruction = (context) => {
    eventBus.emit('alert:show', {
      title: `Инструкция к тесту «${store.test.name}»`,
      contentComponent: 'helperAlertContentTestInstruction',
      maxWidth: '860px',
      hideAllButtons: true,
      additionalData: {
        ...store.test,
        ...context
      }
    });
  };

  const listStyle = (part) => {
    let maxHeight = 300;

    if (part.tasks.length > 60) {
      const diff = part.tasks.length - 60;
      const rows = Math.ceil(diff / 6);
      maxHeight = 300 + rows * 30;
    }

    return {
      maxHeight: maxHeight + 'px'
    };
  };

  const onItemClick = (id) => emit('scroll-to', id);
  const onPause = () => emit('pause');
  const onEnd = () => emit('end');
</script>

<style lang="scss">
  .testRunStat {
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 16px 32px 0 rgb(125, 148, 193, 0.24);
  }

  .testRunStat-timer {
    display: flex;
    padding: 1rem 0;
    justify-content: center;

    .svg-icon {
      width: 6rem;
      height: 6rem;
    }
  }

  .testRunStat-time {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ced6e0;
    font-size: 1.5rem;
    padding-bottom: 1.5rem;
    align-items: center;
  }

  .testRunStat-time-value {
    width: 105px;
  }

  .testRunStat-pauseBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0576ff;
    padding: 0.625rem;
    border-radius: 10rem;
    margin-left: 0.5rem;

    .svg-icon {
      width: 0.75rem;
      height: 0.75rem;
    }
  }

  .testRunStat-count {
    padding: 0.75rem 0 0.5rem 0.5rem;
    color: #7f838a;
    font-size: 0.875rem;
  }

  .testRunStat-list {
    display: flex;
    padding: 0.5rem;
    flex-wrap: wrap;
    flex-direction: column;
    max-height: 300px;
  }

  .testRunStat-list-item {
    margin-bottom: 0.25rem;
    cursor: pointer;
  }

  .testRunStat-list-item-num {
    display: flex;
    width: 30px;
    justify-content: center;
  }

  .testRunStat-list-item--done .testRunStat-list-item-num {
    color: #7f838a;
    position: relative;
  }

  .testRunStat-list-item--done .testRunStat-list-item-num::after {
    content: '';
    display: block;
    width: 30px;
    height: 1px;
    background-color: #7f838a;
    position: absolute;
    transform: rotate(-20deg);
    top: 11px;
    left: 0;
  }

  .testRunStat-endBtn {
    --bs-btn-padding-y: 0.938rem;
  }

  .testRunStat-controlLabel {
    background-color: #e6f3ff;
    font-size: 0.875rem;
    padding: 0.5rem 0.6rem;
    border-radius: 0.5rem;
    margin-left: 0.5rem;
  }
</style>
