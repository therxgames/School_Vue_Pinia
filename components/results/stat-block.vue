<template>
  <div
    v-if="statistics?.length"
    class="d-flex justify-content-between w-100 my-4 py-2">
    <div>
      <div>{{ title }}</div>
      <div
        style="font-size: 4rem;"
        class="lh-1 pt-4">
        {{ correctness[3] + wrongness[3] }}
      </div>
    </div>
    <div class="stat px-2">
      <svg-icon name="level-low"/>
      <svg-icon name="level-mid"/>
      <svg-icon name="level-high"/>
      <svg-icon name="summary"/>
      <span class="w-100 mx-1 stat-ind stat-correct">Верно</span>
      <span
        v-for="(item, ind) in correctness"
        :key="ind">{{ item }}</span>
      <span class="w-100 mx-1 stat-ind stat-error">С ошибкой</span>
      <span
        v-for="(item, ind) in wrongness"
        :key="ind">{{ item }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      statistics: {
        type: Array,
        default: null
      },
      title: {
        type: String,
        default: 'Выполнено'
      }
    },
    setup(props) {
      const simple = computed(() =>
        props.statistics.find((el) => el.row === 'simple')
      );
      const medium = computed(() =>
        props.statistics.find((el) => el.row === 'medium')
      );
      const complex = computed(() =>
        props.statistics.find((el) => el.row === 'complex')
      );
      const correctness = computed(() => {
        return [
          simple.value.correctness,
          medium.value.correctness,
          complex.value.correctness,
          simple.value.correctness + medium.value.correctness + complex.value.correctness
        ];
      });
      const wrongness = computed(() => {
        return [
          simple.value.wrongness,
          medium.value.wrongness,
          complex.value.wrongness,
          simple.value.wrongness + medium.value.wrongness + complex.value.wrongness
        ];
      });

      return {
        correctness,
        wrongness
      };
    }
  };
</script>

<style lang="scss">
  .stat {
    display: grid;
    grid-template-columns: repeat(5, auto);
    row-gap: 0.5rem;
    column-gap: 2rem;
    justify-items: end;
    align-items: center;

    .svg-icon {
      font-size: 0.6rem;
      margin-bottom: 1rem;
    }

    &::before {
      content: '';
      display: block;
      grid-column: 1/2;
      grid-row: 1/2;
      height: 100%;
      width: 100%;
    }

    &-ind {
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.4rem;
        border-radius: 50%;
      }
    }

    &-correct::before {
      background: #3db45a;
    }

    &-error::before {
      background: #fec84d;
    }
  }
</style>
