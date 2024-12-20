<template>
  <div class="container">
    <div class="major-header" :class="{'pb-0': !isStudent}">
      <h1 class="major-header-title">Самоподготовка к ОГЭ</h1>
  
      <div class="major-header-text">
        <p>«Цифровой помощник ученика» поможет эффективно устранить пробелы в знаниях и подготовиться к сдаче итоговых работ</p>
      </div>
  
      <div class="major-header-image" v-if="!isStudent">
        <svg-icon class="major-header-image-icon" name="high-school-students" />
      </div>
    </div>
  </div>
</template>

<script setup>
import useUserStore from '~/stores/user';

const store = useUserStore();
const isStudent = computed(() => store.userIsStudent);
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.major-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 920px;
  margin: 0 auto;
  padding: 48px 0;

  &-title {
    text-align: center;
    font-size: 80px;
    font-weight: 600;
    line-height: 88px;
    margin-bottom: 0;
  }

  &-text {
    padding: 0 76px; 

    p {
      font-size: 24px;
      font-weight: 400;
      line-height: 34px;
      text-align: center;   
      margin-bottom: 0; 
    }
  }

  &-image {
    width: 400px;
    height: 400px;
    position: relative;
    top: 6px;
    z-index: -1;

    &-icon {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
