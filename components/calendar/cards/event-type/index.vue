<template>
  <div class="card-event-type">
    <calendar-cards-event-type-name :eventType="eventType"/>

    <div v-if="olympiadLevel" class="olympiad-level">{{ toRoman(olympiadLevel) }} уровень • перечень
      Минобрнауки
    </div>
  </div>
</template>

<script setup lang="ts">
import {toRoman} from "~/components/calendar/cards/helper";

const props = defineProps({
  eventType: {
    required: true
  },
  olympiadLevel: {
    required: true
  }
})
</script>

<style lang="scss" scoped>
.card-event-type {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.olympiad-level {
  color: #93979E;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.2px;
}
</style>
