<template>
  <div class="chart-subject__wrapper">
    <div class="chart-subject__info-wrapper">
      <div class="chart-subject__stat-wrapper" v-if="hasData && !isFetching">
        <div class="stat__col">
          <p class="stat__name">Верно</p>
          <h1 class="stat__count color-green">34</h1>
          <div class="stat__row">
            <p class="stat__name">базовые</p>
            <p class="stat__value">34</p>
          </div>
          <div class="stat__row">
            <p class="stat__name">средние</p>
            <p class="stat__value">0</p>
          </div>
          <div class="stat__row">
            <p class="stat__name">углубленные</p>
            <p class="stat__value">0</p>
          </div>
        </div>
        <div class="stat__col">
          <p class="stat__name">С ошибкой</p>
          <h1 class="stat__count color-orange">8</h1>
          <div class="stat__row">
            <p class="stat__name">базовые</p>
            <p class="stat__value">2</p>
          </div>
          <div class="stat__row">
            <p class="stat__name">средние</p>
            <p class="stat__value">0</p>
          </div>
          <div class="stat__row">
            <p class="stat__name">углубленные</p>
            <p class="stat__value">6</p>
          </div>
        </div>
        <div class="stat__col">
          <p class="stat__name">Всего выполнено</p>
          <h1 class="stat__count">42</h1>
        </div>
      </div>
      <div class="position-relative"  v-if="hasData && !isFetching">
        <div class="chart-block__wrapper">
          <chart-block
            id="chart-subject"
            :config="config"
            :stacked="stacked"
            :height="chartHeight"
            :resizeble="resizeble"
          />
        </div>
      </div>

      <transition name="transition-fade" v-if="!hasData || isFetching">
        <div class="chart-subject__nostat-wrapper">

          <Loader :listener="isFetching" />

          <svg-icon name="chart" class="nostat__icon" />

          <div class="nostat__title">
            <h4 v-if="!hasData" class="mb-0">Статистики нет</h4>
          </div>

          <div class="nostat__date">
            <p class="nostat__date-title">Ближайшая активная неделя</p>
            <p class="nostat__date-text">19 октября</p>
          </div>

          <div class="nostat__button">
            <nuxt-link to="/library/tasks">
              <button class="nostat__button-btn">Решать новые задания</button>
            </nuxt-link>
          </div>
        </div>
      </transition>
    </div>
    <div class="stat__exp" :class="{'stat__exp_isTheme': isTheme}" v-if="hasData && !isFetching">
      <span class="exp__title" v-html="expTitle" />
      <div class="star-four">
        <svg-icon class="star-four-icon" name="star-four" />
        <span class="exp__count">108</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChartBlock from '../chart-block.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  chartHeight: {
    type: String,
    required: true
  },
  resizeble: {
    type: Boolean,
    required: true
  },
  stacked: {
    type: Boolean,
    required: true
  },
  hasData: {
    type: Boolean,
    required: true
  },
  isFetching: {
    type: Boolean,
    required: true
  },
  expTitle: {
    type: String,
    required: false,
    default: 'Полученный опыт'
  },
  isTheme: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<style lang="scss">
.chart-block__wrapper {
  margin-top: 40px;
  margin-bottom: 8px;
}

.chart-subject {
  margin-top: 24px;
  padding: 32px 48px;
  border-radius: 32px;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
  }

  &__info-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__stat-wrapper {
    display: flex;
    font-family: 'Golos Text';

    p {
      margin-bottom: 0;
    }

    .stat {
      &__col {
        display: flex;
        flex-direction: column;
        min-width: 136px;

        &:not(:last-child) {
          margin-right: 48px;
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
        font-size: 60px;
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

  &__nostat-wrapper {
    margin-top: 64px;
    margin-bottom: 40px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.stat__exp {
  display: flex;
  flex-direction: column;
  min-width: 264px;
  padding: 0 32px;

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

.nostat {
  &__icon {
    width: 48px;
    height: 48px;
  }

  &__title {
    margin: 14px 0;
  }

  &__date {
    text-align: center;
  }

  &__date-title {
    margin-bottom: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 160%;
  }

  &__date-text {
    color: #1B59F5;
    margin-bottom: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 160%;
  }

  &__button {
    margin-top: 32px;
  }

  &__button-btn {
    background: #FFF;
    border-radius: 8px;
    border: 1px solid #C5D0FF;
    padding: 9px 24px;
    color: #1B59F5;
    font-size: 18px;
    font-weight: 400;
    line-height: 145%; /* 26.1px */
  }
}
</style>

