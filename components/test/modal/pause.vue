<template>
  <div
    ref="modal"
    class="modal fade test-modal-pause">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Пауза
          </h5>

          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            <svg-icon name="cross"/>
          </div>
        </div>

        <div class="modal-body">
          <div class="test-modal-pause-info">
            <svg-icon
              name="info-square"
              class="me-2"/>

            <div v-if="uncompletedTasks > 0">
              У вас {{ uncompletedTasks }} {{ declension(uncompletedTasks, ['невыполненное задание', 'невыполненных задания', 'невыполненных заданий']) }}.
              <br>
              Вы сможете вернуться к ним в любое время.
            </div>

            <div v-else>
              Все задания выполнены.
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <a
            href="#"
            class="btn btn-simple"
            @click.prevent="onEnd">
            Завершить тест
          </a>

          <a
            href="#"
            class="btn btn-primary"
            @click.prevent="onLater">
            Продолжить позже
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    uncompletedTasks: {type: Number, required: true}
  });

  const emit = defineEmits(['hidden', 'end', 'later']);

  const modal = ref(null);
  let modalInst = null;

  onMounted(() => {
    const $bootstrap = inject('$bootstrap');
    modalInst = new $bootstrap.Modal(modal.value);
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

  const onLater = () => {
    emit('later');
    hide();
  };

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '~/assets/scss/theme';

  .test-modal-pause-info {
    display: flex;
    background-color: #f2f5fa;
    padding: 0.7rem 0.9rem;
    border-radius: 0.5rem;
  }
</style>
