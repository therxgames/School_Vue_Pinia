<template>
  <p class="show-text">Показано {{ props.list.length }} из {{ props.total }}</p>
  <button
    v-if="props.total > props.list.length"
    class="btn btn-outline-primary btn-show-more w-100 position-relative"
    @click="showMore()"
    :disabled="store.fetching"
  >
    <span>Показать ещё</span>
    <loader
      v-if="store.fetching"
      :listener="true"
      :theme-simple="true"
    />
  </button>
</template>

<script setup lang="ts">
import useCrossCuttingSearchStore from '~/stores/cross-cutting-search';

const router = useRouter()
const store = useCrossCuttingSearchStore();
const emit = defineEmits(['showMore']);
type TPaginationProps = {
  total: number;
  list: [];
};

const props = defineProps<TPaginationProps>();

const showMore = () => emit('showMore');

// const handleLoadMore = async () => {
//   const formattedStart = store.calendar.date[0] && format(new Date(store.calendar.date[0]), 'yyyy-MM-dd');
//   const formattedEnd = store.calendar.date[1] && format(new Date(store.calendar.date[1]), 'yyyy-MM-dd');
//
//   const filters = {
//     eventDateFrom: formattedStart ?? null,
//     eventDateTo: formattedEnd ?? null
//   };
//
//   const queryParams = {
//     page: store.calendar.queryPageCount,
//     ...filters,
//   };
//
//   await store.fetchData({...queryParams});
//
//   props.total > props.list.length
//     ? (store.calendar.queryPageCount += 1)
//     : (store.calendar.queryPageCount = 2);
// };
</script>

<style lang="scss" scoped>
.show-text {
  margin-top: 16px;
  color: #0c1524;
  line-height: 160%;
}

.btn-show-more {
  &:disabled > span {
    opacity: 0;
  }
}
</style>
