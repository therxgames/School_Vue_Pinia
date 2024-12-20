<template>
  <div class="record-book__wrapper">
    <div class="record-book__header d-flex align-items-center">
      <h4 class="record-book__title">
        Зачетная книжка
      </h4>
      <div class="mx-2"
            v-tooltip="{title: 'Зачетная книжка - это удобный инструмент анализа успеваемости и достижений в рамках изучения предмета'}">
        <svg-icon name="info"/>
      </div>
    </div>
    <div>
      <calendar-period :disabled="isFetching" />
    </div>
    <div class="chart-subject card">
      <div class="d-flex">
        <input-radio-group
            type="button-swap"
            labelClassNames="px-4"
            :disabled="isFetching"
            :list="typesList"
            v-model:value="type" />
      </div>

      <chart-stats
          :config="config"
          :stacked="mode === 'chart'"
          :chartHeight="chartHeight"
          :resizeble="true"
          :hasData="true"
          :isFetching="false"
      />
    </div>
  </div>
</template>

<script>
import useResultsStore from '~/stores/results'
import ChartBlock from '~/components/results/chart-block'
import TableSubject from '~/components/results/table-subject.vue'
import CalendarPeriod from '~/components/results/calendar-period.vue'
import StatBlock from '~/components/results/stat-block.vue'
import Radio from '~/components/input/radio.vue'
import { externalTooltipHandler } from '~/utils/chart-subject'
import ChartStats from '~/components/results/course/chart-stats.vue'
import { formatDateByMask } from '~/utils/format-date'

export default {
  components: {
    Radio,
    ChartBlock,
    TableSubject,
    CalendarPeriod,
    StatBlock,
    ChartStats
  },
  props: {
    stepSizeMax: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    const store = useResultsStore()
    const isFetching = computed(() => store.chartFetching)

    const typesList = [
      {
        id: 'test',
        name: 'Демоварианты'
      },
      {
        id: 'task',
        name: 'Задания'
      }
    ]
    const type = ref('task')
    const mode = ref('chart')
    const chartHeight = computed(() => (mode.value === 'comb' ? '150' : '220'))
    const labels = computed(() => store.calendar.labels)
    const dates = computed(() => store.calendar.date)
    const details = computed(() =>
        store.subjectStat ? store.subjectStat.details : []
    )
    const statistics = computed(() =>
        store.subjectStat ? store.subjectStat.statistics : []
    )

    function getTotal (str) {
      const detailsArr = [].concat(details.value)
      const arr = detailsArr.map((d) => d[str])
      return arr.length ? arr.reduce((el, acc) => el + acc) : 0
    }

    const total = computed(() => ({
      correctness: getTotal('correctness'),
      wrongness: getTotal('wrongness')
    }))
    const showData = ref(true)
    const hasData = computed(() => store.hasSubjectData)

    const options = computed(() => ({
      animation: false,
      maintainAspectRatio: false,
      responsive: false,
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
            },
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
                if (index === 0) {
                  return formatDateByMask(dates.value[0], "EEEEEE, d MMMM").replace(/^./, match => match.toUpperCase())
                }

                if (index === labels.value.length - 1) {
                  return formatDateByMask(dates.value[1], "EEEEEE, d MMMM").replace(/^./, match => match.toUpperCase())
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
          // offset: false
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
      if (!store.chartFetching) {
        // #21BD4F, #21BD4FB2 green TODO сделать градиент
        // #FEC84D80, #FEC84D orange
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
                data: [0.5, 4, 0, 0, 0, 1],
                borderColor: '#FEC84D80',
                barPercentage: 6,
                categoryPercentage: 0.1
            },
            {
                label: 'Верно',
                backgroundColor: '#21BD4FB2',
                data: [0, 4, 6, 0.5, 3.5, 2.5],
                borderColor: '#21BD4FB2',
                barPercentage: 6,
                categoryPercentage: 0.1
            },
        ]
        }
      }
    })

    function changeView (str) {
      showData.value = false
      mode.value = str
      setTimeout(() => (showData.value = true), 0)
    }

    watch(
        () => store.subjectFilters,
        () => {
          if (store.subjectFilters) {
            store.fetchSubjectStat(type.value)
          }
        }
    )

    watch(
        () => type.value,
        () => store.fetchSubjectStat(type.value)
    )

    return {
      isFetching,
      hasData,
      typesList,
      type,
      statistics,
      config,
      chartHeight,
      mode,
      changeView,
      total
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-subject {
  margin-top: 24px;
  padding: 32px 48px;
  border-radius: 32px;
}

.record-book {
  &__wrapper {
    margin-top: 52px;
  }

  &__header {
    margin-bottom: 24px;
  }

  &__title {
    margin-bottom: 0;
  }
}
</style>
