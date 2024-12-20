<template>
  <div class="schedule">
    <h2 class="mb-0">Расписание</h2>

    <div class="schedule-box mt-3">
      <div class="box">
        <div class="box-header">
          <div class="box-header__cell">Что</div>
          <div class="box-header__cell">Когда</div>
        </div>
        <div
          class="box-row"
          v-for="item of eventSchedules"
          :class="{ 'is-past': checkIsPast(item) }"
        >
          <div class="box-row__cell">{{ item.name }}</div>
          <div class="box-row__cell">
            <span class="box-row__date">{{ getDate(item) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDateByMask } from "~/utils/format-date";

const props = defineProps({
  eventSchedules: {
    required: true,
  },
});

const currentDate = new Date();

const checkIsPast = (item) => {
  if (item.dateEnd) {
    return currentDate > new Date(item.dateEnd);
  }

  if (item.dateStart) {
    return currentDate > new Date(item.dateStart);
  }

  return false;
};

const getDate = (item) => {
  if (item.dateStart && item.dateEnd) {
    return `${formatDateByMask(item.dateStart, "dd MMMM")} – ${formatDateByMask(
      item.dateEnd,
      "dd MMMM yyyy"
    )}`;
  }

  if (item.dateStart && !item.dateEnd) {
    return formatDateByMask(item.dateStart, "dd MMMM yyyy");
  }

  if (!item.dateStart && item.dateEnd) {
    formatDateByMask(item.dateEnd, "dd MMMM yyyy");
  }
};
</script>

<style lang="scss" scoped>
.schedule {
}

.schedule-box {
  padding: 2rem;
  border-radius: 1.5rem;
  background-color: rgb(240, 242, 252);
}

.box {
  border-radius: 1.5rem;
  background-color: rgb(255, 255, 255);
  --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
    0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.box-header {
  display: flex;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 500;

  &__cell {
    width: 50%;
    padding: 30px 30px 0;
  }
}

.box-row {
  display: flex;

  &__cell {
    width: 50%;
    padding: 24px 30px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgb(221, 222, 224);
  }
}

.is-past {
  color: rgb(147, 151, 158);

  .box-row__date {
    color: rgb(221, 222, 224);
    position: relative;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -0.5rem;
      right: -0.5rem;
      margin: auto;
      height: 1px;
      background-color: rgb(244, 99, 34);
    }
  }
}
</style>
