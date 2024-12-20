<template>
  <div class="calendar-detail">
    <NuxtLink :to="moduleUrl">
      <div class="calendar-detail-link">Календарь</div>
    </NuxtLink>

    <section
      class="calendar-section row d-flex justify-content-between pb-5 mt-3 position-relative"
    >
      <header class="col-8">
        <event-type :type="item?.eventType" />

        <h1 class="h1">{{ item?.name }}</h1>

        <tags
          :moduleUrl="moduleUrl"
          :online="item.online"
          :courses="item?.courses"
          :classes="item?.classes"
          :age-from="item?.ageFrom"
          :age-to="item?.ageTo"
          :date-end="item?.dateEnd"
          :time-end="item?.timeEnd"
          :is-passed="isPassed"
        />

        <about
          v-if="item?.description"
          :eventType="item.eventType"
          :text="item?.description"
        />

        <div class="d-grid" style="gap: 4rem">
          <time-place :item="item" />

          <div v-if="item?.eventSchedules?.length">
            <schedule :eventSchedules="item?.eventSchedules" />
          </div>

          <div
            class="d-grid gap-4"
            v-if="
              item?.holdForms.length > 0 ||
              item?.participationTypes.length > 0 ||
              item?.rules
            "
          >
            <h2 class="mb-0">Формат и порядок участия</h2>

            <format
              v-if="
                item?.holdForms.length > 0 ||
                item?.participationTypes.length > 0
              "
              :hold-forms="item?.holdForms"
              :participation-types="item?.participationTypes"
            />

            <rules v-if="item?.rules" :text="item?.rules" />
          </div>

          <documents
            v-if="item?.files && item?.files.length > 0"
            :items="item?.files"
          />

          <contacts
            v-if="item?.organizer || item?.url"
            :organizer="item?.organizer"
            :url="item?.url"
          />

          <summar
            v-if="item?.fields.length > 0 || item?.eventLevel || item?.region"
            :fields="item?.fields"
            :event-level="item?.eventLevel"
            :region="item?.region"
          />
        </div>
      </header>

      <div class="col-3 sticky-top calendar-event">
        <event
          :party-url="item?.url"
          :cover="item?.cover"
          :olympiad-level="item?.olympiadLevel"
          :cost="item?.cost"
          :is-passed="isPassed"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { isPast } from "date-fns";
import EventType from "./event-type/index.vue";
import Tags from "./tags/index.vue";
import About from "./about/index.vue";
import TimePlace from "./time-place/index.vue";
import Format from "./format/index.vue";
import Rules from "./rules/index.vue";
import Documents from "./documents/index.vue";
import Contacts from "./contacts/index.vue";
import Summar from "./summar/index.vue";
import Event from "./event/index.vue";
import Schedule from "./schedule/index.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  moduleUrl: {
    type: String,
    required: true,
  },
});

const isPassed = () => {
  const endDate = getDateAndTime(props.item.dateEnd, props.item.timeEnd);

  return endDate ? isPast(endDate) : false;
};
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.calendar {
  &-event {
    height: fit-content;
    z-index: 1;
  }

  &-detail-link {
    color: #909090;
  }
}
</style>
