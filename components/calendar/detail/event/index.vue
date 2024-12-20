<template>
  <div class="w-auto d-flex flex-column gap-3">
    <cover :src="cover" />
    <olympiad-level v-if="olympiadLevel" :level="olympiadLevel" />
    <event-buttons :is-passed="isPassed" />
    <div>
      <cost v-if="cost && cost > 0" :cost="cost" />
      <button-url v-if="partyUrl" :url="partyUrl">Страница мероприятия</button-url>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUrl from "@/components/input/button-url.vue";
import Cover from "./cover/index.vue";
import OlympiadLevel from "./olympiad-level/index.vue";
import EventButtons from "./event-buttons/index.vue";
import Cost from "./cost/index.vue";

const props = defineProps({
  cover: {
    type: String,
  },
  olympiadLevel: {
    type: Number,
  },
  partyUrl: {
    type: String,
  },
  cost: {
    type: Number,
  },
  isPassed: {
    type: Function,
    required: true,
  }
});
</script>

<style lang="scss" scoped></style>
  