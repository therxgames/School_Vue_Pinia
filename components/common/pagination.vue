<template>
  <div
    v-if="props.pagination && props.pagination.total && props.pagination.last_page > 1"
    class="content-pagination">
    <div
      class="content-pagination-count"
      v-if="props.list && props.list.length">
      Показано {{ props.list.length }} из {{ props.pagination.total }}
    </div>

    <div
      v-if="props.enableMore && availableSize !== 0"
      @click="showMore()"
      class="btn btn-simple w-100 content-pagination-show-more-btn">
      Показать еще <span v-if="availableSize">{{ availableSize }}</span>
    </div>

    <div class="content-pagination-pages">
      <div
        v-for="page in paginationInfo.pages"
        :key="page"
        :class="[{'btn-primary': page === props.pagination.current},{'btn-disabled': page === '...'}]"
        @click="emit('page', page)"
        class="btn">
        {{ page }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {paginationCalculator} from 'pagination-calculator';

const emit = defineEmits(['page', 'showMore', 'next', 'prev']);
const props = defineProps({
  enableMore: {
    type: Boolean,
    default: true
  },
  list: {
    type: Array,
    default() {
      return [];
    }
  },
  pagination: {
    type: Object,
    default() {
      return {};
    }
  },
  perPage: {
    type: Number,
    default: 20
  },
  perPageAdd: {
    type: Number,
    default: 20
  }
});

const paginationInfo = computed(() => paginationCalculator({
  total: props.pagination.total,
  current: props.pagination.current,
  pageSize: props.perPage,
  pageLimit: 10
}));
const availableSize = computed(() => {
  let size = paginationInfo.value.total - paginationInfo.value.showingEnd;
  return size >= props.perPageAdd
    ? props.perPageAdd
    : size;
});

const showMore = () => availableSize.value > 0 && emit('showMore', paginationInfo.value.current + 1);
</script>

<style lang="scss">
@import '/assets/scss/theme';

.content-pagination {
  position: relative;

  &-count {
    margin-bottom: 1rem;
    user-select: none;
  }

  &-pages {
    display: flex;
    justify-content: center;
    gap: 1rem;

    .btn {
      --bs-btn-hover-bg: #{$color-blue-normal};
      --bs-btn-hover-color: #fff;
      --bs-btn-active-bg: #{$color-blue-dark};
      --bs-btn-active-color: #fff;
      --bs-btn-active-border-color: #{$color-blue-dark};
      --bs-btn-padding-x: 1.155rem;
      --bs-btn-padding-y: 0.46rem;

      font-size: 0.875rem;

      &:hover {
        border-color: $color-dark;
        background-color: #fff;
        color: $color-black;
      }

      &.btn-primary {
        pointer-events: none;
      }

      &.btn-disabled {
        pointer-events: none;
      }
    }
  }

  &-show-more-btn {
    --bs-btn-disabled-opacity: 0.15;

    margin-bottom: 1.5rem;
  }
}
</style>
