<template>
  <div
    class="modal fade show"
    :class="showClass"
    style="display: block;">
    <div
      class="modal-dialog modal-dialog-centered"
      style="max-width: 560px;">
      <div class="modal-content p-3">
        <div class="d-flex align-items-center justify-content-between">
          <h1 class="modal-title fs-5">
            <slot name="title"/>
          </h1>
          <button
            type="button"
            class="btn-close btn-sm btn"
            @click="closeModal"/>
        </div>
        <div class="modal-body bg-light rounded my-4 d-flex">
          <div class="px-2 lh-lg modal-body-scroll">
            <slot name="body"/>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <slot name="buttons"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['close']);

  const props = defineProps({
    isShow: {
      type: Boolean,
      required: true
    }
  });

  const body = ref(null);
  function closeModal() {
    body.value.classList.remove('body-scroll-stop');
    emit('close');
  }
  const showClass = computed(() => (props.isShow ? 'show' : 'hide'));
  onMounted(() => {
    body.value = document.body;
    body.value.classList.add('body-scroll-stop');
  });
  onBeforeUnmount(() => {
    body.value.classList.remove('body-scroll-stop');
  });
</script>

<style lang="scss" scoped>
  .modal {
    background: #00000080;
  }

  .hide {
    position: absolute;
    overflow: hidden;
    width: 0;
    height: 0;
  }

  .modal-body-scroll {
    width: 100%;
    max-height: 60vh;
    overflow-y: scroll;
  }
</style>
