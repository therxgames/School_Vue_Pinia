<template>
  <div
    ref="modal"
    class="modal fade test-modal-end">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Завершение теста
          </h5>
        </div>

        <div class="modal-body">
          <div class="test-modal-end-info">
            <svg-icon
              name="info-square"
              class="me-2"/>

            <div v-if="uncompletedTasks > 0">
              У вас {{ uncompletedTasks }} {{ declension(uncompletedTasks, ['невыполненное задание', 'невыполненных задания', 'невыполненных заданий']) }}.
              <br>
              Задания без ответа будут оценены в 0 баллов.
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
            @click.prevent="hide">
            Вернуться к заданиям
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

  const emit = defineEmits(['hidden', 'end']);

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

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '~/assets/scss/theme';

  .test-modal-end-info {
    display: flex;
    background-color: #f2f5fa;
    padding: 0.7rem 0.9rem;
    border-radius: 0.5rem;
  }
</style>
