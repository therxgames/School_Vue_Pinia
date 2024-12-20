<template>
  <div class="ac-test-about">
    <div
      ref="scroller"
      class="ac-test-about-content scroller-default">
      <div v-html="props.data.description_text || 'Описание отсутствует'"/>
    </div>
    <div class="ac-test-about-footer">
      <div
        @click="props.context.hide"
        class="btn btn-primary">
        Закрыть
      </div>
    </div>
  </div>
</template>

<script setup>
  import SmoothScrollbar from 'smooth-scrollbar';

  const props = defineProps(alertContentProps());
  const emit = defineEmits(['event']);
  const scroller = ref(null);
  const scrollerStatus = ref({offset: {x: 0, y: 0}, limit: {x: 0, y: 0}});
  let scrollerInst = null;

  onMounted(() => {
    createScroll();
  });
  onUnmounted(() => {
    destroyScroll();
  });

  const createScroll = () => {
    scrollerInst = SmoothScrollbar.init(scroller.value, {alwaysShowTracks: true});
    scrollerInst.addListener((status) => Object.assign(scrollerStatus.value, status));
  };
  const destroyScroll = () => {
    if (scrollerInst) {
      SmoothScrollbar.destroy(scroller.value);
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-test-about {
    &-content {
      max-height: 40vh;
      margin-right: -1rem;
      padding-right: 2rem;
    }

    &-footer {
      margin-top: 1rem;
      margin-bottom: -1rem;
    }

    &-control-about {
      &-ul {
        padding-left: 1.7rem;
      }
    }
  }
</style>
