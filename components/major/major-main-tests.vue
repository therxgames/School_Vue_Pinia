<template>
  <major-main-item class="major-main-item" :col-reverse="true">
    <div class="test-col">
      <div class="test-box-wrapper">
        <transition name="slide-in-out">
          <div class="test-box" v-if="showTest">
            <div class="test-tasks">
              <div class="test-tasks-title">
                <p>Задания</p>
              </div>
    
              <div class="test-tasks-numbers">
                <div class="test-tasks-numbers-item" v-for="{ id, checked } in tasks" :key="id">
                    <p class="test-tasks-numbers-item-checked" v-if="checked">{{ id }}</p>
                    <p class="test-tasks-numbers-item-default" v-else>{{ id }}</p>
                </div>
              </div>
            </div>
    
            <div class="test-box-time">
              <div class="test-time-title">
                <p>Время до завершения</p>
              </div>
    
              <div class="test-time-main">
                <major-circle-bar :value="chartValue" class="test-time-main-circle" />
    
                <div class="test-time-main-time">
                  {{ formatTime(timeRemaining) }}
                </div>
              </div>
            </div>
            
            <div class="test-time-end">
                <button class="test-time-end-btn" :class="{'ping-animation': btnAnimation}" @click="handleButtonClick">Завершить</button>
            </div>
          </div>
  
          <div class="passed-box" v-else>
            <div>
              <div class="passed-box-title">
                <p>Тест завершен</p>
              </div>
      
              <div class="passed-box-info">
                <p class="passed-box-info-percent">
                  <span class="passed-box-info-percent-num">80</span> 
                  <span class="passed-box-info-percent-symbol">%</span>
                </p>
      
                <p class="passed-box-info-text">Вы ответили правильно на 8 вопросов из 10</p>
              </div>
            </div>
    
            <div>
              <div class="passed-box-footer">
                <p class="passed-box-footer-date">Завершен {{ formattedDate() }}</p>
                <p class="passed-box-footer-time">Время выполнения: ⏱ {{ formatTime(timePassed) }} </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  
    <div class="test-col test-content">
      <div class="test-content-title">
        <p>Решай тесты</p>
      </div>
  
      <div class="test-content-text">
        <p>Демоверсии проверочных и экзаменационных работ прошлых лет помогут максимально воссоздать условия реального экзамена и проверить свои силы. Анализируй результаты 
          и оценивай уровень подготовки</p>
      </div>
    </div>
  </major-main-item>
</template>

<script setup>
const tasks = [
  {
    id: 1,
    checked: true,
  },
  {
    id: 2,
    checked: true,
  },
  {
    id: 3,
    checked: true,
  },
  {
    id: 4,
    checked: true,
  },
  {
    id: 5,
    checked: true,
  },
  {
    id: 6,
    checked: true,
  },
  {
    id: 7,
    checked: true,
  },
  {
    id: 8,
    checked: true,
  },
  {
    id: 9,
    checked: false,
  },
  {
    id: 10,
    checked: false,
  },
];

const TIME = 120;

const timeRemaining = ref(TIME);
const timePassed = ref(0);
const chartValue = ref(0);
const btnAnimation = ref(false);
const showTest = ref(true);
const intervalId = ref(null);
const animateIntervalId = ref(null);

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const startTimer = () => {
  intervalId.value = setInterval(() => {

    if (timeRemaining.value > 0) {
        timeRemaining.value--;
        timePassed.value++;
        chartValue.value += 100 / TIME;
    } else {
      clearInterval(intervalId.value);

      timeRemaining.value = TIME;
      timePassed.value = 0;
      chartValue.value = 0;

      startTimer();
    }
  }, 1000);
}

const formattedDate = () => {
  const currentDate = new Date();
  const options = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' };

  return currentDate.toLocaleDateString('ru-RU', options);
}

const buttonAnimateTimer = () => {
  animateIntervalId.value = setInterval(() => {
    btnAnimation.value = !btnAnimation.value;
  }, 2000);
};

const handleButtonClick = () => {
  clearInterval(intervalId.value);
  showTest.value = false;
}

onMounted(() => {
  startTimer();
  buttonAnimateTimer();
});

onUnmounted(() => {
  clearInterval(intervalId.value);
  clearInterval(animateIntervalId.value);
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.slide-in-out-enter-active {
  animation: slideInFromRight 1s;
}
.slide-in-out-leave-active {
  animation: slideOutToLeft 1s;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(50%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutToLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes ping {
  0% {
    box-shadow: 0 0 0 0 rgba(240, 242, 252, 1);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(240, 242, 252, 0.5)
  }
  100% {
    box-shadow: 0 0 0 10px rgba(240, 242, 252, 0);
  }
}
.ping-animation {
  animation: ping 1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.major-main-item {
  &::before {
    content: url('~/assets/icons/line_2.svg');
    position: absolute;
    bottom: -135px;
    left: 230px;
  }
}

.test {
  display: flex;
  justify-content: space-between;
  position: relative;

  &-col {
    width: 49%;
  }

  &-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding-left: 48px;
    padding-right: 24px;

    &-title {
      p {
        font-size: 32px;
        font-weight: 500;
        line-height: 38px;
        margin-bottom: 0;
      }
    }

    &-text {
      p {
        font-size: 18px;
        font-weight: 400;
        line-height: 26px;
        margin-bottom: 0;
      }
    }
  }

  &-box {
    display: flex;
    flex-direction: column;
    gap: 32px;
    background: #FFF;
    border-radius: 16px;
    padding: 32px 24px 32px 24px;
    height: 354px;
    min-width: 280px;
    max-width: 280px;

    &-wrapper {
      display: flex;
      justify-content: center;
      overflow: hidden;
      width: 504px;
      background: #1F9B51;
      border-radius: 24px;
      padding: 24px 32px 24px 32px;
    }
  }

  &-tasks {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-title {
      p {
        color: #93979E;
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        margin-bottom: 0;
      }
    }

    &-numbers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 23px;

      &-item {
        &-default {
          color: #0C1524;
          margin-bottom: 0;
        }

        &-checked {
          color: #E4E5E7;
          margin-bottom: 0;
          position: relative;

          &::before {
            content: "";
            border-bottom: 1px solid #0C1524;
            position: absolute;
            width: 20px;
            height: 12px;
            right: -5px;
            transform: rotate(-12deg);
          }
        }
      }
    }
  }

  &-time {
    &-title {
      p {
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        color: #93979E;
        margin-bottom: 0;
      }
    }

    &-main {
      display: flex;
      align-items: center;

      &-circle {
        margin-right: 8px;
      }

      &-time {
        color: #0C1524;
        font-size: 38px;
        font-weight: 500;
        line-height: 54px;
      }
    }

    &-end {
      &-btn {
        width: 100%;
        border: 0;
        background:#FFF;
        border: 1px solid #C5D0FF; 
        color: #1B59F5;
        padding: 12px 67.5px;
        border-radius: 10px;

        &:hover {
          background:#0576FF;
          color: #FFF;
        }
      }
    }
  }
}

.passed {
  &-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 280px;
    max-width: 280px;
    height: 354px;
    background: #FFF;
    padding: 24px;
    border-radius: 24px;

    &-title {
      p {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 0;
      }
    }

    &-info {
      p {
        margin-bottom: 0;
      }

      &-percent {
        color: #1F9B51;

        &-num {
          font-size: 80px;
          font-weight: 400;
          line-height: 88px;
        }

        &-symbol {
          font-size: 38px;
          font-weight: 500;
          line-height: 54px;
        }
      }

      &-text {
        color: #0C1524;
        font-size: 18px;
        font-weight: 400;
        line-height: 26px;
      }
    }

    &-footer {
      p {
        margin-bottom: 0;
        color:#93979E;
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
      }
    }
  }
}
</style>