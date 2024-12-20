<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between">
      <input-select-single
        :resetBtn="false"
        :list="typeList"
        v-model:value="type"/>
      <calendar-period/>
    </div>
    <div class="card p-4 mt-3 rounded-4">
      <div class="position-relative" style="min-height: 100px;">
        <transition name="transition-fade">
          <div class="w-100 p-2">
            <table-general v-if="modeView !== 'chart' && hasData"/>
            <div v-if="modeView === 'comb'" class="py-3"></div>
            <chart-block
              v-if="modeView !== 'table'"
              :stacked="!stacked"
              :config="config"
              :height="chartHeight"
              id="chart-general"
              :resizeble="modeView === 'comb'"/>
          </div>
        </transition>
        <transition name="transition-fade">
          <div
            v-if="!hasData"
            :style="`height:${chartHeight}px`"
            class="position-absolute top-0 left-0 w-100 h-100 bg-white d-flex">
            <p class="m-auto text-muted">Статистики по данному периоду нет 😕</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import useResultsStore from '~/stores/results';
  import ChartBlock from '~/components/results/chart-block';
  import CalendarPeriod from '~/components/results/calendar-period.vue';
  import TableGeneral from '~/components/results/table-general.vue';

  export default {
    components: {
      ChartBlock,
      CalendarPeriod,
      TableGeneral
    },
    setup() {
      const store = useResultsStore();
      const showData = ref(true);
      const hasData = computed(() => store.hasGeneralData);
      const allSubjects = computed(() => store.getSubjects);
      const favSubjects = computed(() => {
        const favs = store.getFavSubjects;
        if (favs.length) type.value = 'favs';
        return favs;
      });
      const type = ref('all');
      const typeList = computed(() => {
        const arr = [{id: 'all', name: 'Все предметы'}];
        if (favSubjects.value.length) {
          arr.push({id: 'favs', name: 'Избранные предметы'});
          type.value = 'favs';
        } else {
          type.value = 'all';
        }
        const subjectsList = [...allSubjects.value].map((s) => ({
          id: s.id,
          name: s.name
        }));
        return arr.concat(subjectsList);
      });
      const subjects = computed(() => {
        if (type.value === 'all') {
          return allSubjects.value;
        }
        if (type.value === 'favs') {
          return favSubjects.value;
        }
        const arr = [];
        if (allSubjects.value.length) {
          const el = [...allSubjects.value].find((s) => s.id === type.value);
          arr.push(el);
        }
        return arr;
      });
      const trend = ref(store.generalTrend);
      const trendList = [
        {id: 'topic', name: 'Темы'},
        {id: 'task', name: 'Задания'}
      ];
      watch(() => trend.value, () => {
        store.generalTrend = trend.value;
        store.fetchGeneralStat();
      });
      const modeView = ref('chart');
      const chartHeight = computed(() =>
        modeView.value === 'chart' || !hasData.value ? '480' : '150'
      );
      const checkboxChecked = ref(true);
      const checkStacked = computed({
        get: () => checkboxChecked.value,
        set: ({ checked }) => checkboxChecked.value = checked
      });
      const maxDataValue = 9;
      const labels = computed(() => store.calendar.labels);
      const datasets = computed(() => {
        const arr = [];
        if (store.getGeneralStat.length && !store.chartFetching) {
          store.getGeneralStat.forEach((el) => {
            const color = store.subjectsColors[el.subject]?.bg[0];
            const obj = {
              backgroundColor: color,
              borderColor: color,
              label: el.subject,
              data: el.data,
              max: Math.max.apply(null, el.data)
            };
            arr.push(obj);
          });
          const max = Math.max.apply(null, [...arr].map(el => el.max));
          options.value.scales.y.suggestedMax = max + 1;
        } else {
          const emptyDS = {
            backgroundColor: '#ffffff00',
            data: [0],
            label: ' '
          };
          arr.push(emptyDS);
        }
        return arr;
      });
      const options = computed(() => {
        return {
          animation: false,
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: modeView.value === 'chart',
              align: 'end',
              maxHeight: 100,
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 8,
                boxHeight: 8,
                font: {
                  size: 16,
                  lineHeight: 32
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                drawOnChartArea: false
              },
              ticks: {
                maxRotation: 0
              }
            },
            y: {
              ticks: {
                precision: 0,
              },
              suggestedMax: maxDataValue + 1
            }
          }
        };
      });
      const config = computed(() => {
        return {
          type: modeView.value === 'chart' ? 'bar' : 'line',
          options: options.value,
          data: {
            labels: labels.value,
            datasets: datasets.value
          }
        };
      });
      watch(
        () => subjects.value,
        () => (store.generalIds = [...subjects.value].map((s) => s.id).join(','))
      );
      const stacked = computed(() =>
        modeView.value === 'chart' ? checkStacked.value : true
      );

      onMounted(() => {
        store.generalIds = [...subjects.value].map((s) => s.id).join(',');
      });

      function changeView(str) {
        showData.value = false;
        modeView.value = str;
        setTimeout(() => (showData.value = true), 0);
      }

      watch(
        () => store.generalFilters,
        () => {
          if (store.generalFilters) {
            store.fetchGeneralStat();
          }
        }
      );

      return {
        showData,
        hasData,
        chartHeight,
        checkStacked,
        subjects,
        type,
        typeList,
        trend,
        trendList,
        stacked,
        config,
        modeView,
        changeView
      };
    }
  };
</script>

<style lang="scss" scoped>
  .stat-icon {
    cursor: pointer;
    opacity: 0.3;
    font-size: 0.75rem;
    transition: all 0.15s linear;

    &:hover {
      opacity: 1;
    }

    &-active {
      opacity: 1;
    }
  }
</style>
