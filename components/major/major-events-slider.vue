<template>
  <major-selections-slider :selections="eventsSelections" title="Календарь мероприятий" v-slot="slotProps" :row-reverse="true">
    <calendar-cards-tile-card
      class="events-slide"
      v-for="item in chunkmaterials[slotProps.slideIndex]"
      :card="item"
      :listMode="false"
      display-type="tile"
    />
  </major-selections-slider>
</template>

<script setup>
import { chunkArray } from '~/utils/utils';
import useCalendareStore from "~/stores/calendar";
import useSelectionsStore from '~/stores/selections';

const calendarStore = useCalendareStore();
const selectionsStore = useSelectionsStore();

const events = computed(() => calendarStore.eventsList);
const eventsSelections = computed(() => selectionsStore.selections.events);
const chunkmaterials =  computed(() => chunkArray(events.value, 2));

onMounted(async () => {
  await calendarStore.fetchEventsList();

  await selectionsStore.fetch({
    role: 'student',
    selectionType: 'events',
  });
});

const props = defineProps({
  slideIndex: {
    type: Number,
  }
});
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.events-slide {
  border: 1px solid #DDDEE0;
}
</style>
