<template>
  <div class="common-filters-invalid">
    <div class="common-filters-invalid-title">
      {{ props.reasonTitle }}
      <img
        class="common-filters-invalid-title-icon"
        src="~assets/images/emoji/1.png">
    </div>
    <div class="common-filters-invalid-reason">
      {{ props.reasonText }}
    </div>
    <div class="mt-1">
      <div
        class="btn btn-simple"
        @click="onBtnClick">
        {{ props.btnTitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['click']);
  const props = defineProps({
    reasonTitle: {
      type: String,
      required: true
    },
    reasonText: {
      type: String,
      default: lexicon.common.try_changing_search_criteria
    },
    btnTitle: {
      type: String,
      default: 'Сбросить фильтры'
    }
  });

  const onBtnClick = () => emit('click');
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .common-filters-invalid {
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
    }
  }
</style>
