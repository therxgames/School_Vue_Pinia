<template>
  <div class="admin-cce-empty">
    <div class="admin-cce-empty-title">
      Мы ничего не нашли
      <img
        class="img-fluid admin-cce-empty-title-icon"
        src="~assets/images/emoji/1.png">
    </div>
    <div
      class="admin-cce-empty-reason"
      v-html="props.reasonText"/>
    <div class="mt-1 admin-cce-empty-actions ">
      <div
        v-if="props.btnVisibleIf"
        class="btn btn-simple"
        @click="emit('reset')">
        {{ props.btnTitle }}
      </div>
      <div
        class="btn btn-simple"
        @click="emit('add')">
        Добавить элемент
      </div>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['reset', 'add']);
  const props = defineProps({
    reasonText: {
      type: String,
      default: lexicon.common.try_changing_search_criteria
    },
    btnTitle: {
      type: String,
      default: lexicon.common.reset_filters
    },
    btnVisibleIf: {
      type: Boolean,
      default: true
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-cce-empty {
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;

    &-title {
      font-weight: 500;
      display: flex;
      gap: 0.2em;
      align-items: center;
    }

    &-title-icon {
      width: 1rem;
      height: 1rem;
    }

    &-reason {
      color: $color-dark;
      text-align: center;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
</style>
