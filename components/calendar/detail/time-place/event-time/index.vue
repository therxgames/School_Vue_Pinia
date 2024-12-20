<template>
  <icon-list-item icon-name="time-clock">
    <p class="mb-0">{{ formatEventDates(dateStart, dateEnd, timeStart, timeEnd) }}</p>

    <p class="time-duration mb-2" v-if="!!hours">
      {{ `Длительность: ${pluralize(hours, ['час', 'часа', 'часов'], true)}` }}
    </p>

    <h5 class="mb-0" v-if="!!toDate && isPast(toDate)">
      {{ getEventCompletedLabel(eventType.code) }}
    </h5>

    <icon-list-item  v-if="!isShowComponent && !!fromDate">
      <div class="bell-ringing">
        <div>
          <svg-icon name="bell-ringing" />
        </div>
  
        <p class="mb-0">
          {{ pluralize(diffInDays, ['остался', 'осталось']) }} {{ pluralize(diffInDays, ['день', 'дня', 'дней'], true) }}
        </p>
      </div>
    </icon-list-item>
  </icon-list-item>
</template>
  
<script setup>
import { getDateAndTime } from '@/utils/utils';
import { formatEventDates, pluralize } from '../../helpers';
import { isPast, startOfDay, differenceInDays } from 'date-fns';
import IconListItem from "../../icon-list/icon-list-item/index.vue";

const props = defineProps({
  dateStart: {
    required: true,
  },
  dateEnd: {
    required: true,
  },
  timeStart: {
    required: true,
  },
  timeEnd: {
    required: true,
  },
  hours: {
    required: true,
  },
  eventType: {
    required: true,
  },
});

const fromDate = getDateAndTime(props.dateStart);
const toDate = getDateAndTime(props.dateEnd, props.timeEnd);
const diffInDays = fromDate && differenceInDays(startOfDay(fromDate), startOfDay(Date.now()));

const isShowComponent = diffInDays <= 0 || diffInDays > 7;

const getEventCompletedLabel = (type) => {
  switch (type) {
    case 'olympiad':
      return 'Олимпиада завершена';
    case 'contest':
      return 'Конкурс завершен';
    default:
      return 'Событие завершено';
  }
};
</script>
  
<style lang="scss" scoped>
.time {
  display: grid;
  gap: 1.5rem;
  margin-top: 4rem;

  &-duration {
    color: rgb(147, 151, 158);
  }
}

.bell-ringing {
  display: flex;
  gap: 0.5rem;
  font-size: 20px;
  font-weight: 500;
  color: #E4411B;
  margin-top: 0.5rem;
}
</style>
  