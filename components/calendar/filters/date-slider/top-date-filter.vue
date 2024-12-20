<template>
  <div class="top-date-filter mb-3">
    <button
      v-for="(preset, index) in presets"
      :key="preset.id"
      class="filter-button"
      :class="{ 'is-active': store.calendar.activeButtonFilter === index }"
      @click="handleClick(index, preset.handler)"
    >
      {{ preset.title }}
    </button>

    <div class="calendar">
      <CalendarPeriod/>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarPeriod from "./calendar-period.vue";
import {addWeeks, endOfISOWeek, endOfMonth, startOfISOWeek, startOfMonth} from "date-fns";
import useCalendarStore from "~/stores/calendar";

const store = useCalendarStore();

const handleClick = (index: number, handler) => {
  store.calendar.activeButtonFilter = index
  handler()
}

const setDateStore = (a, b) => {
  if (a) {
    store.calendar.date[0] = a;
  }
  if (b) {
    store.calendar.date[1] = b;
  }
};

const updateQueryString = (eventDateFrom, eventDateTo) => {
  if (!!eventDateFrom && !!eventDateTo) {
    setDateStore(eventDateFrom, eventDateTo)
  } else {
    store.resetDate()
  }
};

// Обработчик для сброса значений даты
const handleResetDateValues = () => {
  const eventDateFrom = undefined;
  const eventDateTo = undefined;
  updateQueryString(eventDateFrom, eventDateTo)
}

// Обработчик для установки значений текущей недели
const handleSetCurrentWeekDateValues = () => {
  const now = new Date();
  const eventDateFrom = startOfISOWeek(now);
  const eventDateTo = endOfISOWeek(now);
  updateQueryString(eventDateFrom, eventDateTo)
}

// Обработчик для установки значений следующей недели
const handleSetNextWeekDateValues = () => {
  const now = new Date();
  const nextWeek = addWeeks(now, 1);
  const eventDateFrom = startOfISOWeek(nextWeek);
  const eventDateTo = endOfISOWeek(nextWeek);
  updateQueryString(eventDateFrom, eventDateTo)
}

// Обработчик для установки значений текущего месяца
const handleSetCurrentMonthDateValues = () => {
  const now = new Date();
  const eventDateFrom = startOfMonth(now);
  const eventDateTo = endOfMonth(now);
  updateQueryString(eventDateFrom, eventDateTo)
}

const presets = [
  {id: 'all-time', title: 'За все время', handler: handleResetDateValues},
  {id: 'current-week', title: 'Эта неделя', handler: handleSetCurrentWeekDateValues},
  {id: 'next-week', title: 'Следующая неделя', handler: handleSetNextWeekDateValues},
  {id: 'current-month', title: 'Весь месяц', handler: handleSetCurrentMonthDateValues}
];

onMounted(() => {
  eventBus.on("badge-delete-date", store.resetDate);
});

onUnmounted(() => {
  eventBus.off("badge-delete-date", store.resetDate);
});
</script>

<style lang="scss" scoped>
.top-date-filter {
  gap: 1.5rem;
  display: flex;
}

.filter-button {
  font-size: 16px;
  color: #1b59f5;
  background: transparent;
  border: none;
  padding: 0;
  text-decoration-line: underline;
  text-underline-offset: 6px;
  text-decoration-style: dotted;
  text-decoration-color: #c5d0ff;

  &.is-active {
    color: #0c1524;
    font-weight: 500;
    text-decoration: none;
  }
}

.calendar {
  margin-left: 24px;
}
</style>
