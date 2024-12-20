<template>
  <div class="tags-wrapper">
    <calendar-cards-tags-classes
      v-if="classes && classes.length > 0"
      :classes="classes"
    />

    <calendar-cards-tab v-else-if="!!ageFrom && !!ageTo" type="tag">
      {{ ageFrom }}-{{ ageTo }} {{ pluralize(ageTo, ["год", "года", "лет"]) }}
    </calendar-cards-tab>

    <template v-else>
      <calendar-cards-tab v-if="ageFrom" type="tag">
        от {{ ageFrom }} {{ pluralize(ageFrom, ["года", "лет"]) }}
      </calendar-cards-tab>

      <calendar-cards-tab v-if="ageTo" type="tag">
        до {{ ageTo }} {{ pluralize(ageTo, ["года", "лет"]) }}
      </calendar-cards-tab>
    </template>

    <div
      v-if="courses && courses.length > 0"
      v-for="course of courses"
      :key="course.code"
    >
      <calendar-cards-tab type="tag">
        {{ course.name }}
      </calendar-cards-tab>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>

<script setup>
import { pluralize } from "~/components/calendar/cards/helper";

const props = defineProps({
  classes: {
    required: true,
  },
  courses: {
    required: true,
  },
  ageFrom: {
    required: true,
  },
  ageTo: {
    required: true,
  },
});
console.log(props);
</script>
