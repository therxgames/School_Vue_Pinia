<template>
  <div
    v-if="data"
    class="diff-grid mt-4">
    <div
      v-for="block in blocks"
      :key="block.name"
      class="card rounded-4">
      <div class="p-4 m-2">
        <h5 class="pb-2">{{ block.title }}</h5>
        <div class="text-muted mt-4">
          Выполнено
        </div>
        <div class="fs-5 d-flex">
          <div>{{ block.curCount }}</div>
          <div
            v-if="block.diffCount !== 0"
            class="d-flex align-items-center"
            :style="diffStyles(block.diffCount)">
            <div
              class="diff-icon"
              :style="iconStyles(block.diffCount)">
              <svg-icon name="trend"/>
            </div>
            <div>{{ Math.abs(block.diffCount) }}</div>
          </div>
        </div>
        <div class="text-muted mt-4">
          Процент правильных ответов
        </div>
        <div class="fs-5 d-flex">
          <div>{{ block.curRatio }}%</div>
          <div
            v-if="block.diffRatio !== 0"
            class="d-flex align-items-center"
            :style="diffStyles(block.diffRatio)">
            <div
              class="diff-icon"
              :style="iconStyles(block.diffRatio)">
              <svg-icon name="trend"/>
            </div>
            <div>{{ Math.abs(block.diffRatio) }}%</div>
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
      const store = useResultsStore();
      const data = computed(() => store.generalDiff);
      function getData(str) {
        const obj = data.value[str];
        const curCount = obj.current.count || obj.current.correctness + obj.current.wrongness;
        const prevCount = obj.previous.count || obj.previous.correctness + obj.previous.wrongness;
        const diffCount = curCount - prevCount;
        const curRatio = Math.round(
          (obj.current.correctness / (obj.current.wrongness + obj.current.correctness)) * 100 || 0
        );
        const prevRatio = Math.round(
          (obj.previous.correctness / (obj.previous.wrongness + obj.previous.correctness)) * 100 || 0
        );
        const diffRatio = curRatio - prevRatio;
        return {
          curCount,
          prevCount,
          diffCount,
          curRatio,
          prevRatio,
          diffRatio
        };
      }
      const blocks = computed(() => {
        const arr = [
          {title: 'Задания', name: 'tasks'},
          {title: 'Демоварианты', name: 'demovariants'},
          {title: 'Тесты', name: 'usertests'}
        ].map((b) => {
          const bd = getData(b.name);
          return {
          ...b,
          ...bd
          };
        });
        return arr;
      });
      const tasks = computed(() => getData('tasks'));
      const diffStyles = (num) => {
        if (num === 0) return 'display:none;';
        if (num > 0) return 'color:#3db45a;';
        if (num < 0) return 'color:#f85542;';
      };
      const iconStyles = (num) => {
        if (num < 0) return 'transform:rotate(180deg);';
      };

      return {
        data,
        tasks,
        blocks,
        diffStyles,
        iconStyles
      };
    }
  };
</script>

<style lang="scss" scoped>
.diff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem
}
.diff-icon {
  font-size: 0.65rem;
  padding: 0 0.25rem 0 0.5rem;
}
</style>
