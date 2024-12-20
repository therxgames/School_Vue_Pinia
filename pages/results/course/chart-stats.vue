<template>
  <div class="chart-subject__wrapper">
    <div class="chart-subject__info-wrapper">
      <div class="chart-subject__stat-wrapper">
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
      <div class="position-relative">
        <div class="chart-block__wrapper">
          <chart-block
            id="chart-subject"
            :config="config"
            :stacked="stacked"
            :height="chartHeight"
            :resizeble="resizeble"
          />
        </div>
        <transition name="transition-fade">
          <div
            v-if="!hasData || isFetching"
            class="position-absolute top-0 left-0 w-100 h-100 bg-white d-flex">
            <Loader :listener="isFetching" />
            <p v-if="!hasData" class="m-auto text-muted">Статистики по
              данному
              периоду нет 😕</p>
          </div>
        </transition>
      </div>
    </div>
    <div class="stat__exp" :class="{'stat__exp_isTheme': isTheme}">
      <span class="exp__title" v-html="expTitle" />
      <div class="star-four">
        <svg-icon class="star-four-icon" name="star-four" />
        <span class="exp__count">108</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChartBlock from '~/components/results/chart-block'

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

<style lang="scss" scoped>
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
  }

  &__info-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__stat-wrapper {
    display: flex;
    font-family: 'Golos Text';
    margin-top: 24px;

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
    margin-top: 24px;
    font-size: 60px;
    font-style: normal;
    font-weight: 500;
    line-height: 110%;
    letter-spacing: -1.8px;
    margin-left: 8px;
  }
}

</style>
<style lang="scss">
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

