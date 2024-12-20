<template>
  <div class="tags">
    <tab v-if="isPassed()" type="status-online-passed" :cursor-pointer="false">
      Завершено
    </tab>

    <tab v-if="!!online" type="status-online" @click="handleTagClick({ online: true })">
      онлайн
    </tab>

    <classes v-if="classes && classes.length > 0" :classes="classes" @click="handleTagClick" />

    <tab v-else-if="!!ageFrom && !!ageTo" type="tag">
      {{ ageFrom }}-{{ ageTo }} {{ pluralize(ageTo, ['год', 'года', 'лет']) }}
    </tab>

    <template v-else>
      <tab v-if="ageFrom" type="tag">
        от {{ ageFrom }} {{ pluralize(ageFrom, ['года', 'лет']) }}
      </tab>

      <tab v-if="ageTo" type="tag">
        до {{ ageTo }} {{ pluralize(ageTo, ['года', 'лет']) }}
      </tab>
    </template>

    <div v-if="courses && courses.length > 0" v-for="course of courses" :key="course.code">
      <tab type="tag" v-if="course.name" @click="handleTagClick({ course: course.code })">
        {{ course.name }}
      </tab>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 1.5rem;
}
</style>

<script setup>
import { buildUrl } from '@/utils/utils';
import { pluralize } from "@/components/calendar/cards/helper";
import Tab from '../tab/index.vue';
import Classes from './classes/index.vue';

const props = defineProps({
  online: {
    required: true,
  },
  classes: {
    required: true
  },
  courses: {
    required: true
  },
  ageFrom: {
    required: true
  },
  ageTo: {
    required: true
  },
  dateEnd: {
    required: true
  },
  timeEnd: {
    required: true
  },
  moduleUrl: {
    required: true
  },
  isPassed: {
    required: true
  }
});

const router = useRouter();

const handleTagClick = (query) => {     
    return router.push(buildUrl(props.moduleUrl, query, { arrayFormat: 'comma' }));
};
</script>
