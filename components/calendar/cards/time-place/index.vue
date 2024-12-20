<template>
  <p v-if="!!eventDates" class="text-event-date mb-0 z-2">{{ eventDates }}</p>

  <p v-else class="text-event-date mb-0 z-2">Дату уточняйте у организатора</p>

  <p v-if="!!hours" class="text-event-other mb-0 z-2">
    Длительность: {{ pluralize(hours, ['час', 'часа', 'часов'], true) }}
  </p>

  <p v-if="!!region" class="text-event-other mb-0 z-2">{{ region.name }}</p>
</template>

<script setup lang="ts">
import {formatEventDates, pluralize} from "~/components/calendar/cards/helper";

const props = defineProps({
  dateStart: {
    required: true
  },
  dateEnd: {
    required: true
  },
  timeStart: {
    required: true
  },
  timeEnd: {
    required: true
  },
  hours: {
    required: true
  },
  region: {
    required: true
  },
})

const eventDates = formatEventDates(props.dateStart, props.dateEnd, props.timeStart, props.timeEnd);
</script>

<style lang="scss" scoped>
.text-event-date {
  color: #0C1524;
  line-height: 160%;
}

.text-event-other {
  color: #93979E;
  line-height: 160%;
}
</style>
