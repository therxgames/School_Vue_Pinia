<template>
  <div class="group-buttons" v-if="isPassed">
    <button v-if="isPassed" @click.stop.prevent="exportClick" class="custom-btn" type="button">
      <svg-icon name="calendar-add" class="button-icon"/>
    </button>

    <!-- <button class="custom-btn" type="button">
      <svg-icon name="calendar-star" class="button-icon"/>
    </button> -->
  </div>
</template>

<script setup lang="ts">
import { exportEventIsc } from '../../detail/helpers'
import useCalendarItemStore from '~/stores/calendar-item';

const calendarItemStore = useCalendarItemStore();

const props = defineProps({
  isPassed: {
    required: true
  },
  cardData: {
    required: true
  }
})

const exportClick = () => {
  calendarItemStore.setCalendarItem(props.cardData)
  exportEventIsc()
}

</script>

<style lang="scss" scoped>
.group-buttons {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  padding: 10px;
  border-radius: 40px;
  background: #FFF;
  z-index: 2;

  .custom-btn {
    background-color: transparent;
    border: none;
    height: 24px;
    width: 24px;
    padding: 4px;
    color: rgb(37, 76, 232);
    box-sizing: content-box;

    .button-icon {
      height: 24px;
      width: 24px;
    }
  }
}
</style>

