<template>
  <div class="chart-stats__wrapper">
    <div class="chart-stats__header">
      <h3 class="chart-stats__title">
        Выполненные задания
      </h3>
      <svg-icon
        class="chart-stats__icon-close"
        name="cross"
        @click="$emit('toggleDetails')"
      />
    </div>

    <p class="chart-stats__date">С 1 сентября по 13 ноября</p>

    <chart-stats
      :config="config"
      :stacked="true"
      :chartHeight="chartHeight"
      :resizeble="false"
      :hasData="true"
      :isFetching="false"
      expTitle="Опыт по теме за все время"
      :isTheme="true"
    />

    <div class="chart-stats__description">
      <p class="chart-stats__description-text">— Вы занимаетесь больше чем 16% пользователей</p>
      <p class="chart-stats__description-text">— В среднем, вы решаете 5 заданий в неделю</p>
      <p class="chart-stats__description-text">— Последний раз занимались 28 октября 2022 г.</p>
    </div>

    <div class="chart-stats__button">
      <button class="chart-stats__button-btn">Продолжить занятия по теме </button>
    </div>

    <!-- <div v-else class="chart-stats__nostat-wrapper">
      <svg-icon name="chart" class="nostat__icon" />

      <div class="nostat__title">
        <h4 class="mb-0">Статистики нет</h4>
      </div>

      <div class="nostat__button">
        <button class="nostat__button-btn">
          <nuxt-link>Заниматься</nuxt-link>
        </button>
      </div>
    </div> -->
  </div>
</template>

<script>
import useResultsStore from '~/stores/results'
import ChartBlock from '~/components/results/chart-block'
import StatBlock from '~/components/results/stat-block.vue'
import { externalTooltipHandler } from '~/utils/chart-subject'
import ChartStats from '~/components/results/course/chart-stats.vue'

export default {
  components: {
    ChartStats,
    ChartBlock,
    StatBlock
  },
  props: {
    theme: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    console.log(props.theme)
    const store = useResultsStore()
    const isFetching = computed(() => store.chartFetching)
    const labels = computed(() => store.calendar.labels)
    const hasData = computed(() => store.topicsData[`${props.theme.id}`]?.hasData)
    const details = computed(() =>
      store.topicsData[`${props.theme.id}`]?.details || []
    )
    const statistics = computed(() =>
      store.topicsData[`${props.theme.id}`]?.statistics || []
    )
    const titles = [
      'последнюю неделю',
      'последний месяц',
      'текущий год',
      'выбранный период'
    ]
    const statTitle = computed(() => `Выполнено за ${titles[store.calendar.select - 1]}`)
    const options = computed(() => ({
      animation: false,
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        intersect: true,
        mode: 'index'
      },
      plugins: {
        legend: false,
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || ''
              const value = context.formattedValue || ''
              return [label, value]
            }
          },
          external: externalTooltipHandler,
          enabled: false,
          position: 'nearest',
        }
      },
      scales: {
        x: {
          labels: () => (
            labels.value.map((item, index) => {
              if (index === 0 || index === labels.value.length - 1) {
                return item
              }
              return ''
            })
          ),
          grid: {
            drawOnChartArea: false,
            tickWidth: 0,
            dash: [8, 4],
            tickBorderDash: [10, 20]
          },
          border: {
            display: false
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true
          }
        },
        y: {
          grid: {
            tickWidth: 0,
            tickBorderDash: [10, 20]
          },
          border: {
            display: false,
            dash: [2, 2]
          },
          ticks: {
            precision: 0,
            stepSize: props.stepSizeMax * (20 / 100),
            callback: (value, index, values) => {
              if (index === 0 || index === values.length - 1) {
                return value
              }
              if ((index + 1) % 3 === 0 && index < values.length - 2) {
                return value
              }
              return ''
            }
          }
        }
      }
    }))

    const datasets = computed(() => {
      const res = []
      if (!store.topicsData[`${props.theme.id}`]?.chartFetching) {
        const arr = [
          { label: 'С ошибкой', data: 'wrongness', color: '#FEC84D80' },
          { label: 'Верно', data: 'correctness', color: '#21BD4FB2' }
        ]
        if (details.value.length) {
          arr.forEach((el) => {
            const obj = {
              label: el.label,
              backgroundColor: el.color,
              data: [...details.value].map((d) => +d[el.data]),
              borderColor: el.color
            }
            res.push(obj)
          })
        }
      }
      return res
    })
    const config = computed(() => {
      return {
        type: 'bar',
        options: options.value,
        data: {
          labels: labels.value,
          datasets: [
            {
                label: 'С ошибкой',
                backgroundColor: '#FEC84D80',
                data: [1, 4, 0, 0, 0, 1],
                borderColor: '#FEC84D80',
                barPercentage: 8,
                categoryPercentage: 0.1
            },
            {
                label: 'Верно',
                backgroundColor: '#21BD4FB2',
                data: [6, 4, 6, 0.5, 3.5, 2.5],
                borderColor: '#21BD4FB2',
                barPercentage: 8,
                categoryPercentage: 0.1
            },
        ]
        }
      }
    })
    const chartHeight = '200'

    return {
      hasData,
      config,
      chartHeight,
      statistics,
      statTitle,
      labels,
      isFetching
    }
  }
}
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.text-stub {
  font-size: 14px;
  color: #7f838a;
  margin: 2rem;
}

.chart-scale {
  position: absolute;
  left: 0;
  display: flex;
  justify-content: space-between;
  bottom: -1.2rem;
}

.chart-stats {
  &__wrapper {
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    background: #FFF;
    padding: 32px 32px 64px 32px;
    margin-top: 16px;
    margin-bottom: 9px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    letter-spacing: -0.2px;
    margin: 0;
  }

  &__date {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    margin: 0;
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

  &__description {
    display: flex;
    flex-direction: column;

    margin-top: 24px;
  }

  &__button {
    margin-top: 16px;
  }
}

.chart-stats__description-text {
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 160%;
}

.chart-stats__button-btn {
  display: flex;
  height: 56px;
  padding: 13px 32px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  background: #2876FB;
  color: #FFF;
  border: none;
}

.chart-stats__icon-close {
  cursor: pointer;
  width: 36px;
  height: 36px;
  opacity: 0.1;
  
  &:hover {
    svg {
      fill: #0C1524;
    }
  }

  // svg {
  //   fill: #DDDEE0;
  //   transition: $transition;
  // }
}

.nostat {
  &__icon {
    width: 48px;
    height: 48px;
  }

  &__title {
    margin-top: 14px;
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
