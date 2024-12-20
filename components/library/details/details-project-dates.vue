<template>
  <div class="project-dates">
    <div v-if="registrationStart">
      <p class="project-dates-title">Регистрация</p>
      <p class="project-dates-content">{{ registrationDates }}</p>
    </div>

    <div v-if="eventDate">
      <p class="project-dates-title">Дата проведения</p>
      <p class="project-dates-content">{{ eventDateTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  registrationStart: {
    type: String,
  },
  registrationEnd: {
    type: String,
  },
  eventDate: {
    type: String,
  },
  eventTimeStart: {
    type: String,
  },
  eventTimeEnd: {
    type: String,
  },
});

const registrationDates = computed(() => {
  const startDate = new Date(props.registrationStart);
  const endDate = new Date(props.registrationEnd);

  const options = {
    day: 'numeric',
    month: 'long',
  };

  const dateFormatter = new Intl.DateTimeFormat('ru-RU', options);

  const formattedStartDate = dateFormatter.format(startDate);
  const formattedEndDate = dateFormatter.format(endDate);

  if (!formattedEndDate) {
    return formattedStartDate;
  }

  return `${formattedStartDate} - ${formattedEndDate}`;
}); 

const eventDateTime = computed(() => {
  const startDateString = props.eventDate;
  const startTimeString = props.eventTimeStart;
  const endTimeString = props.eventTimeEnd;

  const startDate = new Date(startDateString + " " + startTimeString);
  const endDate = new Date(startDateString + " " + endTimeString);

  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  };

  const dateFormatter = new Intl.DateTimeFormat('ru-RU', options);

  const formattedDate = dateFormatter.format(startDate);
  const formattedStartTime = startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return `${formattedDate}, с ${formattedStartTime} - ${formattedEndTime}`;
});
</script>

<style lang="scss" scoped>
.project-dates {
  display: flex;
  gap: 2rem;

  &-title {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 0;
  }

  &-content {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0;
  }
}
</style>
