<template>
  <div
    ref="toastItem"
    class="toast helper-toast-item"
    role="alert"
    aria-live="assertive"
    aria-atomic="true">
    <div class="toast-body">
      <span
        class="helper-toast-item-message"
        v-html="props.data.text"/>
      <img
        v-if="!props.data.hideIcon"
        class="helper-toast-item-icon"
        src="~/assets/images/emoji/2.png">
    </div>
    <svg-icon
      data-bs-dismiss="toast"
      aria-label="Close"
      class="helper-toast-item-cross"
      name="cross"/>
  </div>
</template>

<script setup>
  const emit = defineEmits(['hidden']);
  const props = defineProps({
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const toastItem = ref(null);
  let toastInst = null;

  onMounted(() => {
    const $bootstrap = inject('$bootstrap');
    toastInst = new $bootstrap.Toast(toastItem.value, {
      delay: props.data.delay || 3500
    });
    toastItem.value.addEventListener('hidden.bs.toast', () => {
      toastInst.dispose();
      emit('hidden', props.data);
    });
    toastItem.value.addEventListener('shown.bs.toast', () => {});
    toastItem.value.addEventListener('show.bs.toast', () => {});
    toastInst.show();
  });
  onUnmounted(() => {

  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .helper-toast-item {
    --bs-toast-bg: #{$color-black};
    --bs-toast-color: #fff;
    --bs-toast-padding-x: 0;
    --bs-toast-padding-y: 0;
    --bs-toast-spacing: 0.7rem;
    --bs-toast-max-width: fit-content(625px);

    transition: all 250ms ease-out;
    padding: 1.063rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-icon {
      width: 0.95rem;
      margin-left: 0.3rem;
      display: inline-block;
      margin-top: -0.1rem;
    }

    &-cross {
      cursor: pointer;
      color: #7f838a;
      width: 0.7rem !important;
      display: inline-block;
      margin-left: 1.5rem;

      &:hover {
        color: #fff;
      }
    }

    &.showing {
      transform: translateX(-3rem);
    }
  }
</style>
