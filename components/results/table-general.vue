<template>
  <div
    class="general-table-scroll"
    ref="scrollContainer">
    <div
      class="general-table w-100"
      ref="tableBlock">
      <div
        class="general-table-row"
        ref="tableBlock">
        <div
          v-for="(item, ind) in heading"
          :key="ind"
          class="general-table-cell px-4">
          <div
            v-if="ind > 0"
            class="d-flex justify-content-center"
            v-tooltip="{ title: item }">
            <div
              class="p-3 rounded"
              :style="`background:${getBg(item)};`">
              <svg-icon
                :name="`subject-${subjectsNames[item]}`"
                fill="#fff"/>
            </div>
            <div
              v-if="!tableOverflow"
              class="mx-3 my-auto text-nowrap">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="general-table-rows">
        <div
          v-for="(row, key) in rows.data"
          :key="key"
          class="general-table-row">
          <div class="general-table-cell">
            <div class="text-start text-nowrap bg-light px-3 py-1 mt-1">
              <div style="margin-right: 6rem;">
                {{ rows.labels[key] }}
              </div>
            </div>
          </div>
          <div
            v-for="(cell, index) in row"
            :key="index"
            class="general-table-cell">
            <div
              class="d-flex align-items-center justify-content-center bg-light px-3 py-1 mt-1">
              <div
                class="p-1 m-2 rounded"
                :style="`background:${getBg(heading[index + 1])};`"/>
              <div>{{ cell }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import useResultsStore from '~/stores/results';
  export default {
    setup() {
      const scrollContainer = ref(null);
      const tableBlock = ref(null);
      const store = useResultsStore();
      const labels = computed(() => store.calendar.labels);
      const data = computed(() => store.getGeneralStat);
      const heading = computed(() => ['', ...data.value.map((el) => el.subject)]);
      const rows = computed(() => {
        const res = {labels: [], data: []};
        if (data.value.length) {
          for (let i = 0; i < labels.value.length; i++) {
            const arr = [];
            data.value.forEach((el) => {
              arr.push(el.data[i]);
            });
            if (arr.some((el) => el > 0)) {
              res.labels.push(labels.value[i]);
              res.data.push(arr);
            }
          }
        }
        return res;
      });

      const tableOverflow = ref(false);

      watch(
        () => heading.value,
        () => {
          if (scrollContainer.value?.scrollWidth) {
            tableOverflow.value = false;
            setTimeout(() => {
              tableOverflow.value
                = scrollContainer.value?.scrollWidth - scrollContainer.value?.offsetWidth > 0;
            }, 0);
          }
        }
      );

      function getBg(str) {
        return store.subjectsColors[str]?.bg[0];
      }

      onMounted(() => {
        setTimeout(() => {
          tableOverflow.value = scrollContainer.value?.scrollWidth - scrollContainer.value?.offsetWidth > 0;
        }, 0);
      });

      return {
        scrollContainer,
        tableBlock,
        heading,
        rows,
        getBg,
        tableOverflow
      };
    }
  };
</script>

<style lang="scss" scoped>
  .general-table {
    display: table;

    &-scroll {
      overflow: scroll;
      max-height: 50vh;
      max-width: 100%;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &-rows {
      display: table-row-group;
    }

    &-row {
      display: table-row;
    }

    &-cell {
      display: table-cell;
      text-align: center;
    }
  }
</style>
