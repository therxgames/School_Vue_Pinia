<template>
  <div
    v-if="
      badgeEventTypeList.length ||
      badgeCourseList.length ||
      badgeClassesList.length ||
      badgeEventLevelList.length ||
      badgeOlympiadLevelList.length ||
      badgeAll ||
      badgeOnline ||
      badgeDates.length
    "
    class="mt-3 d-flex gap-2 flex-wrap"
  >
    <calendar-badge
      v-for="{ id, name } of badgeEventTypeList"
      :key="'event' + id"
      :id="id"
      :name="name"
      @on-delete="handleDeleteFilterList(id)"
    />
    <calendar-badge
      v-for="{ id, name } of badgeCourseList"
      :key="'course' + id"
      :id="id"
      :name="name"
      @on-delete="handleDeleteCourseList(id)"
    />
    <calendar-badge
      v-if="!!badgeDates"
      key="date-badge"
      id="date-badge"
      :name="badgeDates"
      @on-delete="handleDeleteDate"
    />
    <calendar-badge
      v-for="{ id, name } of badgeClassesList"
      :key="'class' + id"
      :id="id"
      :name="name"
      @on-delete="handleDeleteClassList(id)"
    />
    <calendar-badge
      v-for="{ id, name } of badgeEventLevelList"
      :key="'eventLevel' + id"
      :id="id"
      :name="name + 'уровень'"
      @on-delete="handleDeleteEventLevel"
    />
    <calendar-badge
      v-for="{ id, name } of badgeOlympiadLevelList"
      :key="'olympiadLevel' + id"
      :id="id"
      :name="name"
      @on-delete="handleDeleteOlympiadLevel"
    />
    <calendar-badge
      v-if="badgeAll"
      key="badgeAll"
      id="badgeAll"
      name="Включая прошедшие"
      @on-delete="handleDeleteAll"
    />
    <calendar-badge
      v-if="badgeOnline"
      key="badgeOnline"
      id="badgeOnline"
      name="Онлайн"
      @on-delete="handleDeleteOnline"
    />
  </div>
</template>

<script setup lang="ts">
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useCalendareStore from "~/stores/calendar";
import { olympiadLevel } from "../helper";

const calendarStore = useCalendareStore();
const dictionariesStore = useDictionariesCalendar();

const badgeEventTypeList: any = computed(() => {
  if (
    calendarStore.filters.eventType &&
    !!dictionariesStore.optionsTypes.length
  ) {
    const eventTypeQueryToArray = String(calendarStore.filters.eventType).split(
      ","
    );

    const convertEventTypeArray = eventTypeQueryToArray.map((idEvent) => {
      const dictionariesOptions = [...dictionariesStore.optionsTypes];

      const currentElem = dictionariesOptions.find(
        (optionType: any) => optionType.id === Number(idEvent)
      );

      return currentElem;
    });

    return convertEventTypeArray;
  } else {
    return [];
  }
});

const badgeCourseList: any = computed(() => {
  if (
    calendarStore.filters.course &&
    !!dictionariesStore.optionsCourses.length
  ) {
    const courseQueryToArray = String(calendarStore.filters.course).split(",");

    const convertCourseArray = courseQueryToArray.map((idCourse) => {
      const dictionariesOptions = [...dictionariesStore.optionsCourses];

      const currentElem = dictionariesOptions.find(
        (optionType: any) => optionType.code === idCourse
      );

      return currentElem;
    });

    return convertCourseArray;
  } else {
    return [];
  }
});

const badgeClassesList: any = computed(() => {
  if (
    calendarStore.filters.class &&
    !!dictionariesStore.optionsClasses.length
  ) {
    const classQueryToArray = String(calendarStore.filters.class).split(",");

    const convertClassArray = classQueryToArray.map((idClass) => {
      const dictionariesOptions = [...dictionariesStore.optionsClasses];

      const currentElem = dictionariesOptions.find(
        (optionType: any) => optionType.code === idClass
      );

      return currentElem;
    });

    return convertClassArray;
  } else {
    return [];
  }
});

const badgeEventLevelList: any = computed(() => {
  if (
    calendarStore.filters.eventLevel &&
    !!dictionariesStore.eventLevels.length
  ) {
    const eventLevelQueryToArray = String(
      calendarStore.filters.eventLevel
    ).split(",");

    const convertEventLevelsArray = eventLevelQueryToArray.map((idEvent) => {
      const dictionariesOptions = [...dictionariesStore.eventLevels];

      const currentElem = dictionariesOptions.find(
        (optionType: any) => optionType.code === idEvent
      );

      return currentElem;
    });

    return convertEventLevelsArray;
  } else {
    return [];
  }
});

const badgeOlympiadLevelList: any = computed(() => {
  if (calendarStore.filters.olympiadLevel && !!olympiadLevel.length) {
    const eventOlympiadLevelToArray = String(
      calendarStore.filters.olympiadLevel
    ).split(",");

    const convertOlympiadLevelArray = eventOlympiadLevelToArray.map(
      (idOlympiad) => {
        const dictionariesOptions = [...olympiadLevel];

        const currentElem = dictionariesOptions.find(
          (optionType: any) => optionType.id === Number(idOlympiad)
        );

        return currentElem;
      }
    );

    return convertOlympiadLevelArray;
  } else {
    return [];
  }
});

const badgeAll: any = computed(() => !!calendarStore.filters.all);
const badgeOnline: any = computed(() => !!calendarStore.filters.online);
const badgeDates: any = computed(() => {
  const dateFrom = calendarStore.calendar.date[0];
  const dateTo = calendarStore.calendar.date[1];

  const dateFormating = formatDateRange([dateFrom, dateTo]);

  if (dateFrom && dateTo) {
    return dateFormating;
  }

  return "";
});

const handleDeleteFilterList = (id: string | number) => {
  eventBus.emit("badge-delete-event-type", id);
};

const handleDeleteCourseList = (id: string | number) => {
  eventBus.emit("badge-delete-course", id);
};

const handleDeleteClassList = (id: string | number) => {
  eventBus.emit("badge-delete-class", id);
};

const handleDeleteEventLevel = () => {
  eventBus.emit("badge-delete-event-level");
};

const handleDeleteOlympiadLevel = () => {
  eventBus.emit("badge-delete-olympiad-level");
};

const handleDeleteAll = () => {
  eventBus.emit("badge-delete-all");
};

const handleDeleteOnline = () => {
  eventBus.emit("badge-delete-online");
};

const handleDeleteDate = () => {
  eventBus.emit("badge-delete-date");
};
</script>
