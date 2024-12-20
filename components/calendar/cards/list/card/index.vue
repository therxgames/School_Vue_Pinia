<template>
  <nuxt-link class="card-wrapper" :to="pathCardDetail">
    <calendar-cards-actions :cardData="props.card" :isPassed="!isPassed()"/>

    <calendar-cards-cover
      :path="props.card.cover"
      :status="props.card.online"
      :is-passed="isPassed()"
      :display-type="props.displayType"
    />

    <div class="card-content">
      <calendar-cards-event-type
        :event-type="props.card.eventType"
        :olympiad-level="props.card.olympiadLevel"
      />

      <calendar-cards-title :name="props.card.name"/>

      <div class="card-info">
        <calendar-cards-tags
          :classes="props.card.classes"
          :courses="props.card.courses"
          :age-from="props.card.ageFrom"
          :age-to="props.card.ageTo"
        />

        <span v-if="isPassed()" class="finalized-mark py-2 px-4">
          Завершено
        </span>
      </div>
    </div>
    <div class="card-reminder">
      <calendar-cards-time-place
        :date-start="props.card.dateStart"
        :date-end="props.card.dateEnd"
        :time-start="props.card.timeStart"
        :time-end="props.card.timeEnd"
        :hours="props.card.hours"
        :region="props.card.region"
        :display-type="props.displayType"
      />

      <calendar-cards-event-reminder
        v-if="!isPassed()"
        :date-start="props.card.dateStart"
        :type="props.card?.eventType?.code"
        :display-type="props.displayType"
      />

      <svg-icon
        v-if="!!props.card.olympiadLevel"
        name="federal"
        class="federal-icon"
      />
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import {getDateAndTime} from "~/components/calendar/cards/helper";
import {isPast} from "date-fns";
import {TCardEvent} from "../../types";

type TCardProps = {
  card: TCardEvent;
  displayType: "list" | "tile";
};

const props = defineProps<TCardProps>();

const isPassed = () => {
  const endDate = getDateAndTime(
    props.card.dateEnd,
    props.card.timeEnd ? props.card.timeEnd : undefined
  );
  return endDate ? isPast(endDate) : false;
};

const pathCardDetail = `/calendar/details/${props.card.id}`;
</script>

<style lang="scss" scoped>
.card-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 960px;
  padding: 32px 20px;
  border-radius: 24px;
  border: none;
  background: #fff;
  margin: 0 auto;
}

.card-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  overflow: hidden;
  max-width: 500px;
  margin-right: 32px;
}

.federal-icon {
  position: absolute;
  height: 100%;
  width: 100%;
}

.card-info {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  margin-top: 24px;
}

.finalized-mark {
  color: rgb(147 151 158/1);
  background-color: rgb(243 243 241/1);
  width: max-content;
  border-radius: 12px;
  margin-top: 8px;
}

.card-reminder {
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
  height: 100%;
}
</style>
