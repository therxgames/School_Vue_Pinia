<template>
  <div
    class="date-cell"
    :class="{
      is_weekend: isWeekend,
      'bg-blue-light': item.inSelection,
      'rounded-lg': item.inSelection === 'both',
      'rounded-s-lg': item.inSelection === 'start',
      'rounded-e-lg': item.inSelection === 'end',
    }"
  >
    <div class="date-cell__number">
      {{ formatDateByMask(item.date, "d") }}
    </div>
    <div class="date-cell__day">
      {{ formatDateByMask(item.date, "EEEEEE") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDay } from "date-fns";
import { formatDateByMask } from '~/utils/format-date'
import type { СalendarItem } from "./types";
const { item } = defineProps<{ item: СalendarItem }>();
const isWeekend = ref([0, 6].includes(getDay(item.date)));
</script>

<style lang="scss" scoped>
.date-cell {
  cursor: pointer;
  width: 36px;
  text-align: center;
  padding: 0.5rem;
  outline: 2px solid transparent;
  outline-offset: 2px;

  &.is_weekend,
  &.is_weekend .date-cell__day {
    color: #e4411b;
  }

  &__number {
    font-size: 1.125rem;
    line-height: 1.25rem;
  }

  &__day {
    font-size: 0.625rem;
    line-height: 1rem;
    text-transform: uppercase;
    color: #93979e;
  }
}

.bg-blue-light {
  --tw-bg-opacity: 1;
  background-color: rgb(240 242 252 / var(--tw-bg-opacity));

  .date-cell__day,
  .date-cell__number {
    --tw-text-opacity: 1;
    color: rgb(37 76 232 / var(--tw-text-opacity)) !important;
  }
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-s-lg {
  border-start-start-radius: 0.5rem;
  border-end-start-radius: 0.5rem;
}

.rounded-e-lg {
  border-start-end-radius: 0.5rem;
  border-end-end-radius: 0.5rem;
}
</style>
