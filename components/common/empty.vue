<template>
  <div class="common-empty">
    <div class="common-empty-title">
      Мы ничего не нашли
      <img
        class="img-fluid common-empty-title-icon"
        src="~assets/images/emoji/1.png">
    </div>
    <div class="common-empty-reason">
      {{ props.reasonText }}
    </div>
    <div
      v-if="props.btnVisibleIf"
      class="mt-1">
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

  const onBtnClick = () => emit('click');
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .common-empty {
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
