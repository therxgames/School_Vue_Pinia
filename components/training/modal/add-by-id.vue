<template>
  <div
    ref="modal"
    class="modal fade training-modal-add-by-id">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Добавление по ID
          </h5>
          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            <svg-icon name="cross"/>
          </div>
        </div>
        <div class="modal-body">
          <div>Номер теста (ID)</div>
          <div class="mt-2 training-modal-add-by-id-input-container">
            <input
              v-model="enteredId"
              @keyup.enter="attemptToAdd"
              class="form-control training-modal-add-by-id-input"
              type="text"
              placeholder="например 111238">
          </div>
          <div
            v-if="isNotFound"
            class="training-modal-add-by-id-not-found-message">
            Тест не найден или не может быть добавлен
            <img src="~/assets/images/emoji/3.png">
          </div>
        </div>
        <div class="modal-footer">
          <button
            :class="{'disabled': !enteredId}"
            @click="attemptToAdd()"
            type="button"
            class="btn btn-primary">
            Проверить
          </button>
        </div>
        <loader
          class="training-modal-add-by-id-loader"
          :listener="progress"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useTrainingStore from '~/stores/training';

  const trainingStore = useTrainingStore();
  const router = useRouter();
  const modal = ref(null);
  const progress = ref(false);
  const isNotFound = ref(false);
  const enteredId = ref('');
  let modalInst = null;

  onMounted(() => {
    modalInst = new window.$bootstrap.Modal(modal.value);
  });
  onUnmounted(() => {
    if (modalInst) {
      modalInst.hide();
    }
  });

  const show = () => {
    progress.value = false;
    isNotFound.value = false;
    enteredId.value = '';
    modalInst.show();
  };
  const hide = () => {
    modalInst.hide();
  };
  const attemptToAdd = async () => {
    progress.value = true;
    await sleep(150);
    let formattedTestId = enteredId.value.replace( /^\D+/g, '');
    const canBeAdded = await trainingStore.testCanBeAdded(formattedTestId);
    if (canBeAdded) {
      hide();
      await router.push(`/test/add/${formattedTestId}`);
      isNotFound.value = false;
    } else {
      isNotFound.value = true;
    }
    progress.value = false;
  };

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .training-modal-add-by-id {
    &-input-container {
      max-width: 250px;
    }

    &-input {
      padding: 0.625rem 1rem;
    }

    &-not-found-message {
      margin-top: 0.5rem;

      img {
        width: 1.12rem;
      }
    }

    &-loader {
      border-radius: 0.5rem;

      --loader-max-opacity: 0.9;
      --loader-spinner-width: 2.5rem;
      --loader-spinner-height: 2.5rem;
    }
  }
</style>
