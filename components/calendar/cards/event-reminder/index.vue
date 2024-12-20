<template>
  <div
    class="reminder-wrapper"
    :class="{ displayType }"
    v-if="!isShowComponent && !!fromDate"
  >
    <svg-icon name="bell-ringing" class="reminder-icon" />

    <span class="reminder-text">
      {{ pluralize(diffInDays, ["остался", "осталось"]) }}
      {{ pluralize(diffInDays, ["день", "дня", "дней"], true) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { getDateAndTime, pluralize } from "~/components/calendar/cards/helper";
import { differenceInDays, startOfDay } from "date-fns";

const props = defineProps({
  dateStart: {
    required: true,
  },
  displayType: {
    required: true,
  },
});

const fromDate = getDateAndTime(props.dateStart);
const diffInDays =
  fromDate && differenceInDays(startOfDay(fromDate), startOfDay(Date.now()));
const isShowComponent = diffInDays <= 0 || diffInDays > 7;
</script>

<style lang="scss" scoped>
.reminder-wrapper {
  position: relative;
  z-index: 2;
}
.list {
  position: relative;
  display: flex;
  margin-top: 4px;
  z-index: 2;
}

.tile {
  display: flex;
  margin-top: 4px;
}

.reminder-icon {
  margin-right: 2px;
}

.reminder-text {
  color: #e4411b;
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.2px;
}
</style>
