<template>
  <p class="show-text">Показано {{ props.list.length }} из {{ props.total }}</p>
  <button
    v-if="props.total > props.list.length"
    class="btn btn-outline-primary btn-show-more w-100 position-relative"
    @click="handleLoadMore"
    :disabled="calendarStore.eventsLoading"
  >
    <span>Показать ещё</span>
    <loader
      v-if="calendarStore.eventsLoading"
      :listener="true"
      :theme-simple="true"
    />
  </button>
</template>

<script setup lang="ts">
import {TEvent} from "../filters/types";
import useCalendareStore from "~/stores/calendar";

const router = useRouter()
const calendarStore = useCalendareStore();

type TPaginationProps = {
  total: number;
  list: TEvent[];
};

const props = defineProps<TPaginationProps>();

const handleLoadMore = async () => {
  const eventDateFromQuery = router.currentRoute.value.query.eventDateFrom;
  const eventDateToQuery = router.currentRoute.value.query.eventDateTo;

  const filters = {
    ...calendarStore.filters,
    eventDateFrom: eventDateFromQuery ?? null,
    eventDateTo: eventDateToQuery ?? null
  };

  const queryParams = {
    sort: calendarStore.sort,
    page: calendarStore.calendar.queryPageCount,
    ...filters,
  };

  await calendarStore.fetchEventsList({...queryParams});

  props.total > props.list.length
    ? (calendarStore.calendar.queryPageCount += 1)
    : (calendarStore.calendar.queryPageCount = 2);
};
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
