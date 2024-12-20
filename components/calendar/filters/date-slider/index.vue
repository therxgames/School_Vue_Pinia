<template>
  <div class="date-slider-wrapper">
    <div class="d-flex justify-content-between">
      <TopDateFilter/>
      <CitySelect/>
    </div>
    <div class="title">
      {{
        formatDateByMask(
          monthDate,
          isSameYear(monthDate, Date.now()) ? "LLLL" : "LLLL yyyy"
        )
      }}
    </div>
    <div class="date-slider">
      <div class="button button_prev" @click="handlePrevMonthClick">
        <svg-icon name="huge-arrow-right"/>
      </div>
      <div class="date-slider-scroll">
        <div v-for="(item, index) of dates" @click="handleDayClick(item)">
          <DateCell :key="formatDateByMask(item.date, 'yyyy-MM-dd')" :item="item"/>
        </div>
      </div>
      <div class="button" @click="handleNextMonthClick">
        <svg-icon name="huge-arrow-right"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {addMonths, format, isSameYear, startOfMonth, subMonths,} from "date-fns";
import {getCalendar} from "./utils";
import type {СalendarItem} from './types'
import DateCell from "./date-cell.vue";
import CitySelect from '../city-select/index.vue'
import TopDateFilter from "./top-date-filter.vue";
import useCalendarStore from "~/stores/calendar";
import { formatDateByMask } from '~/utils/format-date'

const store = useCalendarStore();
const router = useRouter();
const route = useRoute();
const monthDate = computed(() => store.calendar.monthDate);

onMounted(() => {
  const routeQuery = {...route.query};

  if (routeQuery?.eventDateFrom) {
    store.calendar.monthDate = startOfMonth(new Date(routeQuery?.eventDateFrom))
  } else {
    store.calendar.monthDate = startOfMonth(new Date())
  }
});

const getSelectionMounted = () => {
  const currentQueryParams = {...router.currentRoute.value.query};

  let date = null;
  if (currentQueryParams.eventDateFrom && currentQueryParams.eventDateTo) {
    date = [
      new Date(currentQueryParams.eventDateFrom),
      new Date(currentQueryParams.eventDateTo)
    ];
  }
  return date ?? [];
};

const selection = ref(getSelectionMounted());

const dates = ref(
  getCalendar({
    view: "days",
    date: monthDate.value,
    fillEmpty: false,
    selection: selection.value,
  })
);

const handlePrevMonthClick = () =>
  (store.calendar.monthDate = subMonths(monthDate.value, 1));
const handleNextMonthClick = () =>
  (store.calendar.monthDate = addMonths(monthDate.value, 1));

const updateQueryString = (eventDateFrom, eventDateTo) => {
  const currentQueryParams = {...router.currentRoute.value.query};

  if (!!eventDateFrom) {
    currentQueryParams.eventDateFrom = format(eventDateFrom, "yyyy-MM-dd");
  }

  if (!!eventDateTo) {
    currentQueryParams.eventDateTo = format(eventDateTo, "yyyy-MM-dd");
  }

  router.push({query: currentQueryParams});
};


const handleDayClick = (day: СalendarItem) => {
  const newSelection: [Date] | [Date, Date] =
    selection.value && selection.value.length === 1 ? [selection.value[0], day.date] : [day.date];
  console.log('--newSelection:', newSelection)
  selection.value = newSelection;
  if (newSelection.length !== 2) return;

  const [dateFrom, dateTo] = newSelection.sort(
    (a, b) => a.getTime() - b.getTime()
  );
  store.calendar.date[0] = dateFrom;
  store.calendar.date[1] = dateTo;
  store.calendar.activeButtonFilter = null;
  updateQueryString(dateFrom, dateTo)
};

watch(
  () => [store.calendar.date[0], store.calendar.date[1], selection.value, monthDate.value],
  (newDate) => {
    let date;
    if (selection.value.length === 1) {
      date = selection.value;
    } else if (store.calendar.date[0] && store.calendar.date[1]) {
      date = [store.calendar.date[0], store.calendar.date[1]];
    } else {
      date = undefined
      store.calendar.activeButtonFilter = 0;
    }

    dates.value = getCalendar({
      view: "days",
      date: monthDate.value,
      fillEmpty: false,
      selection: date,
    });
  });
</script>

<style lang="scss" scoped>
.date-slider-wrapper {
  margin-bottom: 20px;
}

.title {
  margin-bottom: 7px;
  color: #0c1524;
  padding-left: 60px;
  text-transform: capitalize;
  font-size: .875rem;
  line-height: 1.25rem;
}

.date-slider {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.date-slider-scroll {
  width: calc(100% - 104px);
  display: flex;
  overflow: auto;
}

.button {
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1b59f5;
  border: 1px solid #c5d0ff;
  border-radius: 16px;
  user-select: none;
  transition: 0.3s ease-out;

  &:hover {
    color: #fff;
    background-color: #1b59f5;
    border-color: #1b59f5;
  }
}

.button_prev {
  .svg-icon {
    transform: scale(-1);
  }
}
</style>
