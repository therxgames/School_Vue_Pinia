<template>
  <div
    v-if="tableData.length"
    ref="tableScroll"
    class="w-100 table-scroll">
    <div
      v-for="row in tableData"
      :key="row.label"
      class="table-row py-2 bg-light rounded mt-1">
      <span class="px-3">{{ row.label }}</span>
      <span class="stat-ind stat-correct">Верно</span>
      <span class="text-center">{{ row.correctness }}</span>
      <span class="stat-ind stat-error">С ошибкой</span>
      <span class="text-center">{{ row.wrongness }}</span>
    </div>
  </div>
</template>

<script>
  import useResultsStore from '~/stores/results';

  export default {
    setup() {
      const store = useResultsStore();
      const tableScroll = ref(null);
      const body = ref(null);
      const labels = computed(() => store.calendar.labels || []);
      const data = computed(() => store.subjectStat?.details || []);
      const tableData = computed(() => {
        const res = [];
        if (data.value.length) {
          for (let i = 0; i < data.value.length; i++) {
            const str = labels.value[i];
            const {correctness, wrongness} = data.value[i];
            if ((correctness || wrongness) && str) {
              const label = str.charAt(0).toUpperCase() + str.slice(1);
              res.push({
                label,
                correctness,
                wrongness
              });
            }
          }
        }
        return res;
      });

      return {
        tableScroll,
        tableData
      };
    }
  };
</script>

<style lang="scss" scoped>
  .table-row {
    display: grid;
    grid-template-columns: 1fr auto 6% auto 6%;
  }

  .table-scroll {
    overflow: scroll;
    max-height: 50vh;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
