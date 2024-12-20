<template>
  <div class="testTools">
    <div
      v-if="test.is_mine && !test.in_archive"
      class="testTools-tool icon-text"
      @click="emit('toggle-archive')">
      <svg-icon name="archive-tint"/>
      <span>Перенести в архив</span>
    </div>

    <div
      v-if="test.is_mine && test.in_archive"
      class="testTools-tool icon-text"
      @click="emit('toggle-archive')">
      <svg-icon name="archive-tint"/>
      <span>Вернуть из архива</span>
    </div>

    <div
      class="testTools-tool icon-text"
      @click="print">
      <svg-icon name="print"/>
      <span>Распечатать тест</span>
    </div>

    <div
      class="testTools-tool icon-text"
      @click="toSupport">
      <svg-icon name="chat"/>
      <span>Сообщить о проблеме</span>
    </div>

    <div
      v-if="test.type === 'demovariant' && (userStore.userIsAdmin || userStore.userIsCOSUser)"
      class="testTools-tool icon-text"
      @click="toSettings">
      <svg-icon name="setting"/>
      <span>Свойства</span>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const props = defineProps({
    test: {type: Object, required: true}
  });

  const emit = defineEmits(['toggle-archive']);

  const print = () => printTest(props.test.id);
  const toSupport = () => router.push(`/support/test-${route.params.id}`);
  const toSettings = () => router.push(`/test-settings/${route.params.id}`);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testTools {
    font-size: 0.875rem;
    color: $color-dark;
    margin-top: 3rem;
    margin-bottom: 3rem;
    display: flex;
    gap: 2.063rem;
  }

  .testTools-tool {
    --icon-width: 0.938rem;
    --icon-height: 0.938rem;
    --icon-hover-color: #{$color-black};
  }
</style>
