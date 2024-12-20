<template>
  <div class="awards-wrapper">
    <h3 v-if="!!awards.title" class="awards__title" v-html="awards.title" />
    <div class="awards__list">
      <awards-card
        v-for="(card) in awards.awards_list"
        :key="card.title"
        :card="card"
        :withOutProgress="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CoursesAwards } from '~/types'
import AwardsCard from '~/components/results/awards-card.vue'

const props = defineProps({
  awards: {
    type: Object as () => CoursesAwards,
    required: true,
  },
})
</script>

<style scoped lang="scss">
.awards-wrapper {
  margin-top: 48px;
  padding: 32px 32px 56px;
  border-radius: 24px;
  border: 1px solid #DDDEE0;
}

.awards {
  &__title {
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    letter-spacing: -0.2px;
    margin-bottom: 24px;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
}

.awards-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 184px;
  height: 262px;
  padding: 16px 8px 24px 8px;

  &__icon-wrapper {
    position: relative;
    width: 100%;
    max-height: 144px;
    padding: 12px 18px 0;
  }

  &__icon {
    width: 100%;
    height: 100%;
  }

  &__rarity {
    position: absolute;
    top: 0;
    right: 8px;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid #FFF;
    background: #FFF;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 0.2px;
  }

  &__name {
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    margin-top: auto;
    margin-bottom: 0;
  }

  &__date {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 0.2px;
    color: #93979E;
  }
}
</style>
