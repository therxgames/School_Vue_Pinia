<template>
  <div class="calendar-list-wrapper">
    <calendar-cards-list-card
      v-for="(card) of list"
      :key="card.id"
      :card="card"
      :display-type="displayType"
    />
  </div>
</template>

<style lang="scss" scoped>
.calendar-list-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(1, 100%);
  padding: 48px;
  gap: 24px 16px;
  border-radius: 64px;
  background: linear-gradient(180deg, #E8F1FC 34.9%, #E3E9FC 100%);
}

.show-text {
  margin-top: 16px;
  color: #0C1524;
  line-height: 160%;
}

.btn-show-more {
  width: 100%;
}
</style>

<script setup lang="ts">
import {TCardEvent} from '../types';

type TCardProps = {
  list: TCardEvent[]
  displayType: 'list' | 'tile'
}
defineProps<TCardProps>()
</script>
