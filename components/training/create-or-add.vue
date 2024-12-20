<template>
  <div class="training-empty">
    <div class="training-empty-title">
      У вас нет ни одного теста
    </div>
    <div class="training-empty-reason">
      Создай индивидуальный тематический тест и повышай качество <br>
      знаний в интересной тебе предметной области
    </div>
    <div class="training-empty-actions">
      <div
        v-if="userStore.userIsStudent"
        @click="emit('newTest')"
        class="btn btn-primary btn-icon training-empty-action-btn">
        <svg-icon name="plus-filled"/>
        <span>Новый тест</span>
      </div>
      <div
        v-if="userStore.userIsStudent"
        @click="emit('addById')"
        class="btn btn-simple btn-icon training-empty-action-btn training-empty-action-btn--by-id">
        <svg-icon name="plus-filled"/>
        <span>Добавить по ID</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  const userStore = useUserStore();
  const emit = defineEmits(['addById', 'newTest']);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .training-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;

    &-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    &-reason {
      text-align: center;
      color: $color-dark;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-top: 0.5rem;
    }

    &-action-btn {
      --bs-btn-padding-y: 0.62rem;
      --bs-btn-padding-x: 1.5rem;
    }
  }
</style>
