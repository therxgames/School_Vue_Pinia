<template>
  <nuxt-layout name="default">
    <main class="page-default content-container">
      <calendar-detail :item="calendarItemStore.data" moduleUrl="/calendar" />
    </main>
  </nuxt-layout>
</template>

<script setup lang="ts">
import useCalendarItemStore from '~/stores/calendar-item';

const route = useRoute();
const calendarItemStore = useCalendarItemStore();

await calendarItemStore.fetchCalendarItem(route.params.id);
</script>

<style lang="scss" scoped></style>
