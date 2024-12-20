<template>
  <major-main-item class="major-main-item" :col-reverse="true">
    <div class="chart-col">
      <div class="chart-main">
        <div class="chart-toggle">
          <div class="chart-toggle-item">
            <button class="chart-toggle-item-button" :class="{'chart-toggle-item-active': activeType === 'maths'}" @click="handleChartToggle('maths')">
              Математика
            </button>
          </div>
          <div class="chart-toggle-item">
            <button class="chart-toggle-item-button" :class="{'chart-toggle-item-active': activeType === 'russian'}" @click="handleChartToggle('russian')">
              Русский язык
            </button>
          </div>
        </div>
  
        <div class="chart-box">
          <div class="chart-box-wrapper">
            <div class="chart-subject__wrapper">
              <div class="chart-subject__info-wrapper">
                <div class="chart-subject__info-title">
                  <p>Выполнено заданий за неделю</p>
                </div>
      
                <div class="chart-subject__stat-wrapper" v-if="activeType === 'maths'">
                  <div class="stat__col">
                    <p class="stat__name">Верно</p>
                    <h1 class="stat__count color-green">34</h1>
                  </div>
                  <div class="stat__col">
                    <p class="stat__name">С ошибкой</p>
                    <h1 class="stat__count color-orange">8</h1>
                  </div>
                  <div class="stat__col">
                    <p class="stat__name">Всего</p>
                    <h1 class="stat__count">42</h1>
                  </div>
      
                  <div class="stat__col stat__col-exp">
                    <p class="stat__name">Опыт</p>
                    <div class="stat__col-star">
                      <h1 class="stat__count">108</h1>
                      <svg-icon name="star-green" />
                    </div>
                  </div>
                </div>
  
                <div class="chart-subject__stat-wrapper" v-if="activeType === 'russian'">
                  <div class="stat__col">
                    <p class="stat__name">Верно</p>
                    <h1 class="stat__count color-green">48</h1>
                  </div>
                  <div class="stat__col">
                    <p class="stat__name">С ошибкой</p>
                    <h1 class="stat__count color-orange">3</h1>
                  </div>
                  <div class="stat__col">
                    <p class="stat__name">Всего</p>
                    <h1 class="stat__count">51</h1>
                  </div>
      
                  <div class="stat__col stat__col-exp">
                    <p class="stat__name">Опыт</p>
                    <div class="stat__col-star">
                      <h1 class="stat__count">97</h1>
                      <svg-icon name="star-green" />
                    </div>
                  </div>
                </div>
  
                <div class="position-relative">
                  <div class="chart-block__wrapper">
                    <chart-block
                      id="chart-subject"
                      :config="charConfig"
                      :stacked="true"
                      height="130"
                      :resizeble="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="chart-content chart-col">
      <div class="chart-content-title">
        <p>Следи за прогрессом</p>
      </div>
  
      <div class="chart-content-text">
        <p>Выбирай интересующие темы из банка заданий и проверяй себя. Это поможет фокусироваться на слабых местах</p>
      </div>
    </div>
  </major-main-item>
</template>

<script setup>
import ChartBlock from './chart-block.vue';
import { chart, mathData, russianData } from './mockData';

const activeType = ref('maths');
const charConfig = reactive(chart);

const handleChartToggle = (type) => {
  if (type === 'maths') {
    activeType.value = type;
    charConfig.data.datasets = mathData;
  } else if (type === 'russian') {
    activeType.value = type;
    charConfig.data.datasets = russianData;
  }
}
</script>

<style lang="scss" scoped>
.chart {
  display: flex;
  justify-content: space-between;
  position: relative;

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

  &-col {
    width: 49%;
  }

  &-main {
    padding: 32px;
    border-radius: 16px;
    background: #68C3F4;
  }

  &-box {
    background: #FFF;
    border-radius: 16px;
    margin-top: 24px;
  }

  &-toggle {
    display: flex;
    margin: auto;
    background: #49AEE3;
    width: fit-content;
    border-radius: 12px;

    &-item {
      &-button {
        border: 0;
        border-radius: 10px;
        padding: 8px 20px;
        background: transparent;
        color: #FFF;
      }

      &-active {
        background: #FFF;
        color: #0C1524; 
      }
    }
  }
}

.chart-block__wrapper {
  margin-top: 5px;
}

.chart-subject {
  margin-top: 24px;
  padding: 32px 48px;
  border-radius: 32px;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
  }

  &__info-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__info-title {
    p {
      color: #0C1524;
      font-size: 16px;
      font-weight: 500;
      line-height: 26px;
      margin-bottom: 0;
    }
  }

  &__stat-wrapper {
    display: flex;
    justify-content: space-between;
    font-family: 'Golos Text';
    margin-top: 24px;

    p {
      margin-bottom: 0;
    }

    .stat {
      &__col {
        display: flex;
        flex-direction: column;
        width: fit-content;
        gap: 0 48px;
        padding: 8px;

        h1 {
          margin-bottom: 0;
        }

        &-exp {
          background: #F5F2ED;
          border-radius: 16px;
        }

        &-star {
          display: flex;
          align-items: center;
          gap: 0 8px;
        }
      }

      &__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &__name {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        white-space: nowrap;
      }

      &__count {
        font-size: 38px;
        font-style: normal;
        font-weight: 500;
        line-height: 110%;
        letter-spacing: -1.8px;

        &.color-green {
          color: #21BD4F;
        }

        &.color-orange {
          color: #FFB40A;
        }
      }

      &__value {
        margin-left: 8px;
      }
    }
  }
}

.stat__exp {
  display: flex;
  flex-direction: column;
  min-width: 264px;
  padding: 0 32px;
  margin-top: 24px;

  &_isTheme {
    margin: 0 32px 0 24px;
    padding: 0 24px;
  }

  .star-four {
    display: flex;
    align-items: center;

    &-icon {
      width: 32px;
      height: 32px;
    }
  }

  .exp__title {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    white-space: nowrap;
  }

  .exp__count {
    font-size: 60px;
    font-style: normal;
    font-weight: 500;
    line-height: 110%;
    letter-spacing: -1.8px;
    margin-left: 8px;
  }
}
.tooltip-chart {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 160px;
  border-radius: 8px;
  background: #424955;
  padding: 12px 16px 16px 16px !important;
  color: #fff;
  margin-top: -6px;
  transform: translate(-50%, -100%);
  font-family: 'Golos Text', serif;

  &:after {
    position: absolute;
    bottom: -4px;
    left: 50%;
    content: '';
    width: 10px;
    height: 5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='5' viewBox='0 0 10 5' fill='none'%3E%3Cpath d='M5 5L0 0H10L5 5Z' fill='%233D4450'/%3E%3C/svg%3E");
    z-index: -1;
    transform: translate(-50%, 0);
  }

  .tooltip {
    &__title {
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 160%;
      margin: 0 0 4px;
      white-space: nowrap;
    }

    &__circle {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;
    }

    &__value-wrapper {
      display: flex;
      align-items: center;
      margin: 0;
    }

    &__label {
      white-space: nowrap;
    }

    &__value {
      margin-left: auto;
      padding-left: 24px;
    }
  }
}
</style>

