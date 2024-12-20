<template>
  <div class="calendar-tile-wrapper">
    <calendar-cards-tile-card
      v-for="card of list"
      :key="card.id"
      :card="card"
      :display-type="displayType"
    />
  </div>
</template>

<script setup lang="ts">
import {TCardEvent} from "../types";

type TCardProps = {
  list: TCardEvent[];
  displayType: "list" | "tile";
};
defineProps<TCardProps>();
</script>

<style lang="scss" scoped>
.calendar-tile-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, 316px);
  padding: 48px;
  gap: 24px 16px;
  border-radius: 64px;
  background: linear-gradient(180deg, #e8f1fc 34.9%, #e3e9fc 100%);
}

.show-text {
  margin-top: 16px;
  color: #0c1524;
  line-height: 160%;
}

.btn-show-more {
  width: 100%;
}
</style>
