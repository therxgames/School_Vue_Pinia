<template>
  <div className="details-summary">
    <p v-if="!!educationLevel && !!educationLevel.length">
      <span class="details-summary-text">Уровень основного общего образования:</span> {{ educationLevel.map(item => item.title).join(', ') }}
    </p>

    <p v-if="!!minAge || minAge === 0">
      <span class="details-summary-text">Минимальный возраст:</span> {{ minAge }}+
    </p>

    <p v-if="!!keywords && keywords.length > 0">
      <span class="details-summary-text">Ключевые слова:</span> {{ keywords.join(', ') }}
    </p>

    <p v-if="!!date">
      <span class="details-summary-text">Добавлено:</span> {{ formatDateByMask(date, "dd.MM.yyyy") }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  educationLevel: {
    type: Array,
  },
  minAge: {
    type: Number,
  },
  keywords: {
    type: Array,
  },
  date: {
    type: String,
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.details-summary {
  font-size: 1.125rem;

  p {
    margin-bottom: 0;
  }

  &-text {
    color: #93979e;
  }
}
 
</style>
