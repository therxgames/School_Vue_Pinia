<template>
  <div class="time">
    <h2 class="mb-0">Время и место</h2>

    <div class="d-grid gap-3">
      <icon-list class="row">
        <div class="col-6">
          <event-time :date-start="item.dateStart" :date-end="item.dateEnd" :time-start="item.timeStart" :time-end="item.timeEnd" :hours="item.hours" :event-type="item.eventType" />
          <event-translation v-if="item.onlinePlatforms.length > 0" :online-platforms="item.onlinePlatforms" class="mt-3" />
        </div>
  
        <div class="col-6">
          <event-address v-if="item.address" :text="item.address" />
        </div>
      </icon-list>

      <event-place v-if="item.coordinates?.length > 0" :coordinates="item.coordinates" :place="item.place" />
    </div>
  </div>
</template>
  
<script setup>
import IconList from "../icon-list/index.vue";
import EventTime from "./event-time/index.vue";
import EventAddress from "./event-address/index.vue";
import EventTranslation from "./event-translation/index.vue";
import EventPlace from "./event-place/index.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
  
<style lang="scss" scoped>
.time {
  display: grid;
  gap: 1.5rem;
  margin-top: 3rem;

  &-duration {
    color: rgb(147, 151, 158);
  }
}
</style>
  