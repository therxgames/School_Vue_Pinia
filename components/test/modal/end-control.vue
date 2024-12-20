<template>
  <div
    ref="modal"
    class="modal fade test-modal-end-control">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Завершение теста
          </h5>
        </div>

        <div class="modal-body">
          <div class="modal-body-timer">
            <svg-icon name="timer"/>
          </div>

          <div v-if="attempt && attempt.time > 0">
            <h3 :class="timeClass">
              Осталось {{ timeText }}
            </h3>

            У вас еще осталось время перепроверить себя 🙂
            <br>
            Если уверены — завершаем тест.

            <div
              style="color: #7f838a; font-size: 0.875rem;"
              class="my-2">
              По окончанию времени тест завершится автоматически.
            </div>
          </div>

          <div v-else>
            <h3>Время вышло. Тест завершен</h3>
          </div>
        </div>

        <div class="modal-footer">
          <a
            v-if="attempt && attempt.time > 0"
            href="#"
            class="btn btn-simple"
            @click.prevent="hide">
            Вернуться к заданиям
          </a>

          <a
            href="#"
            class="btn btn-primary"
            @click.prevent="onEnd">
            <span v-if="attempt && attempt.time > 0">
              Завершить тест
            </span>

            <span v-else>
              Перейти к результатам
            </span>
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

  const emit = defineEmits(['hidden', 'end', 'later']);

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

  const timeText = computed(() => {
    if (!props.attempt) {
      return '';
    }

    if (props.attempt.time < 60) {
      return props.attempt.time.toString() + ' ' + declension(props.attempt.time, ['секунда', 'секунды', 'секунд']);
    } else {
      const minutes = Math.floor(props.attempt.time / 60);
      return minutes.toString() + ' ' + declension(minutes, ['минута', 'минуты', 'минут']);
    }
  });

  const timeClass = computed(() => {
    if (props.attempt && props.attempt.time < 60) {
      return ['text-danger'];
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

  .modal-body-timer {
    padding-bottom: 0.75rem;

    .svg-icon {
      width: 6rem;
      height: 6rem;
    }
  }
</style>
