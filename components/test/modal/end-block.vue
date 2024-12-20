<template>
  <div
    ref="modal"
    class="modal fade test-modal-end-control">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Тест завершен
          </h5>
        </div>

        <div class="modal-body">
          Тест завершен, вы можете просмотреть результаты или начать тест заново
        </div>

        <div class="modal-footer">
          <a
            href="#"
            class="btn btn-primary"
            @click.prevent="onEnd">
            Перейти к результатам
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    attempt: {type: Object, default: null}
  });

  const emit = defineEmits(['hidden', 'end']);

  const modal = ref(null);
  let modalInst = null;

  onMounted(() => {
    const $bootstrap = inject('$bootstrap');
    modalInst = new $bootstrap.Modal(modal.value, {
      backdrop: 'static',
      keyboard: false
    });
    modal.value.addEventListener('hidden.bs.modal', hidden);
  });

  onBeforeUnmount(() => {
    modal.value.removeEventListener('hidden.bs.modal', hidden);

    if (modalInst) {
      modalInst.hide();
    }
  });

  const show = () => modalInst.show();
  const hide = () => modalInst.hide();

  const hidden = () => {
    emit('hidden');
  };

  const onEnd = () => {
    emit('end');
    hide();
  };

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '~/assets/scss/theme';
</style>
