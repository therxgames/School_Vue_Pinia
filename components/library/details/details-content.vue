<template>
  <div class="details-content container">
    <!-- <div class="details-content-like-buttons">
      <div class="details-content-like-buttons-btn" v-tooltip="{ title: 'Рекомендовать' }">
        <svg-icon name="thumbs-up" />
        <span>Рекомендовать</span>
      </div>

      <div class="details-content-like-buttons-btn" v-tooltip="{ title: 'Добавить в избранное' }">
        <svg-icon name="eye-open" />
        <span>В избранное</span>
      </div>
    </div> -->

    <div class="d-flex gap-2 flex-wrap" v-if="item?.keywords && item?.keywords.length > 0">
      <library-details-project-keyword v-for="keyword in item?.keywords" :keyword="keyword" />
    </div>

    <common-text v-if="item?.description" :text="item?.description" class="details-content-description" />

    <div class="d-flex flex-column gap-3">
      <library-details-author v-if="item?.supplier" :provider="item?.supplier" />

      <p class="details-content-region" v-if="item?.region">{{ item?.region }}</p>
      
      <library-details-summary :educationLevel="item?.generalEducationLevels" :minAge="item?.minAge" :keywords="item?.keywords" :date="item?.publishedAt" />
    </div>

    <div class="details-content-detail" v-if="item?.url">
      <a :href="item.url" target="_blank" class="details-content-detail-btn text-white" @click="detailButtonHandler">
        Подробнее
      </a>
    </div>

    <!-- <div class="details-content-like-buttons">
      <div class="details-content-like-buttons-btn" v-tooltip="{ title: 'Рекомендовать' }">
        <svg-icon name="thumbs-up" />
        <span>Рекомендовать</span>
      </div>

      <div class="details-content-like-buttons-btn" v-tooltip="{ title: 'Добавить в избранное' }">
        <svg-icon name="eye-open" />
        <span>В избранное</span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import useUserStore from '~/stores/user';
import useAdminAchievementsStore from '~/stores/admin-achievements';  

const adminAchievementsStore = useAdminAchievementsStore();
const userStore = useUserStore();
const studentId = userStore.studentId;

const detailButtonHandler = async () => {
  if (!!studentId) {
    await adminAchievementsStore.fetchAchievementsSetReached(studentId)
  }

  return true;
}

const props = defineProps({
  item: {
    type: Object,
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.details-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 64rem;
  padding-top: 2rem;
  padding-bottom: 5rem;

  &-detail {    
    &-btn {
      display: inline-flex;
      justify-content: center;
      border: none;
      padding: 10px 0;  
      border-radius: 12px;
      background: #0576FF;
      width: 100%;

      &:hover {
        background: #254ce8;
      }
    }
  }

  &-like-buttons {
    display: flex;
    align-items: center;
    gap: 2rem;
    cursor: pointer;

    &-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #93979e;
    }
  }

  &-description {
    font-size: 1.125rem;
    line-height: 1.6;
  }

  &-region {
    color: #93979e;
    margin-bottom: 0;
  }
}
</style>
