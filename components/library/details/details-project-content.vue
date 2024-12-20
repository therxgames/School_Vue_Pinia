<template>
  <div class="row py-5">
    <div class="col-9">
      <div class="project-content-detail row">
        <div class="col-4" v-if="item?.generalEducationLevels && !!item?.generalEducationLevels.length">
          <div class="d-flex flex-column gap-2">
            <p class="project-content-detail-title">Уровень образования</p>
            <!-- <p class="project-content-detail-text" v-for="{ id, title } in item.generalEducationLevels" :key="id">{{ title }}</p> -->
            <p class="project-content-detail-text">{{ item.generalEducationLevels.map(item => item.title).join(', ') }}</p>
          </div>
        </div>
  
        <div class="col-4" v-if="!!item?.courses && !!item?.courses.length">
          <div class="d-flex flex-column gap-2">
            <p class="project-content-detail-title">Предмет</p>
            <!-- <p class="project-content-detail-text" v-for="{ code, name } in item.courses" :key="code">{{ name }}</p> -->
            <p class="project-content-detail-text">{{ item.courses.map(item => item.name).join(', ') }}</p>
          </div>
        </div>

        <div class="col-4" v-if="!!item?.classes && !!item?.classes.length">
          <div class="d-flex flex-column gap-2">
            <p class="project-content-detail-title">Класс</p>
            <p class="project-content-detail-text">{{ item.classes.map(item => item.name).join(', ') }}</p>
          </div>
        </div>

        <div class="col-4" v-if="item?.minAge || item?.minAge === 0">
          <div class="d-flex flex-column gap-2">
            <p class="project-content-detail-title">Минимальный возраст</p>
            <p class="project-content-detail-text">{{ item?.minAge }}+</p>
          </div>
        </div>
  
        <div class="col-4" v-if="item?.project?.region?.name">
          <div class="d-flex flex-column gap-2">
            <p class="project-content-detail-title">Регион</p>
            <p class="project-content-detail-text">{{ item?.project?.region?.name }}</p>
          </div>
        </div>
  
        <div class="col-4" v-if="item?.publishedAt">
          <div class="d-flex flex-column gap-2">
            <p class="project-content-detail-title">Добавлено</p>
            <p class="project-content-detail-text">{{ formatDateByMask(item?.publishedAt, "dd.MM.yyyy") }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-3" v-if="item?.keywords && item?.keywords.length > 0">
      <div class="d-flex flex-column gap-2">
        <p class="project-content-detail-title">Ключевые слова</p>

        <div class="d-flex gap-2 flex-wrap">
          <library-details-project-keyword v-for="keyword in item?.keywords" :keyword="keyword" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
  },
});

</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.project-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &-detail {
    display: flex;
    gap: 1.5rem 0;

    &-title {
      color: #93979E;
      margin-bottom: 0;
    }

    &-text {
      padding-right: 1.5rem;
      margin-bottom: 0;
    }
  }
}
</style>
