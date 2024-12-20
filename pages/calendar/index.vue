<template>
  <nuxt-layout name="default">
    <main class="page-default content-container">
      <h1 class="h1" style="margin-bottom: 2rem;">Календарь</h1>
      <calendar-filters :total="calendarStore.eventsListTotal"/>
      <calendar-cards-conditional
        v-if="calendarStore.eventsList.length > 0"
        :display-type="modeCalendar"
        :list="calendarStore.eventsList"
      />
      <calendar-pagination
        v-if="calendarStore.eventsList.length > 0"
        :list="calendarStore.eventsList"
        :total="calendarStore.eventsListTotal || 0"
      />

      <selections type="events"/>
    </main>
  </nuxt-layout>
</template>

<script setup lang="ts">
import {TMode} from "~/components/calendar/filters/types";
import useCalendareStore from "~/stores/calendar";

useHead({
  ...pageTitle("Календарь"),
});

const calendarStore = useCalendareStore();

const modeCookie = useCookie<TMode>("calendarMode");
const modeCalendar = useModeCalendar();

modeCalendar.value = modeCookie.value || "list";
</script>
