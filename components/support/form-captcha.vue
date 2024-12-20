<template>
  <div class="card px-2 py-4 mb-3 mt-3 bg-light w-50 flex-row">
    <input
      v-model="getCaptcha"
      id="cptch"
      type="checkbox"
      class="form-check-input"
      :disabled="getCaptcha && field.isValid">
    <label
      for="cptch"
      class="form-check-label mx-2">Я человек</label>
  </div>
  <dialog-modal
    v-if="captcha.show"
    :is-show="captcha.show">
    <template #body>
      <div class="d-flex flex-column w-75 mx-auto">
        <img
          :src="captcha.src"
          class="my-4 w-100">
        <div
          class="mb-4 mt-3 position-relative"
          :class="errClass"
          data-err="Введите символы с картинки">
          <input
            type="text"
            class="form-control"
            :class="errClass"
            v-model="field.value">
        </div>
      </div>
    </template>
    <template #buttons>
      <button
        type="button"
        class="btn border-secondary"
        @click="updateCaptcha">
        <svg-icon name="reset"/>
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="submitCaptcha">
        OK
      </button>
    </template>
  </dialog-modal>
</template>

<script>
  import useSupportStore from '~/stores/support';
  import DialogModal from '~/components/dialog-modal.vue';

  export default {
    components: {
      DialogModal
    },
    setup() {
      const store = useSupportStore();
      const field = store.fields.find((f) => f.name === 'captcha');
      const isValid = computed(() => store.checkFields && store.fieldsValid ? field.isValid : true);
      const captcha = computed(() => store.captcha);
      const getCaptcha = ref(false);
      const errClass = computed(() => {
        if (!isValid.value && captcha.value.hasAttempt) {
          return 'support-error';
        }
      });

      function updateCaptcha() {
        store.getCaptcha();
      }

      function submitCaptcha() {
        field.isValid = field.value.length > 0;
        captcha.value.show = !field.isValid;
      }

      watch(() => getCaptcha.value, async () => {
        if (getCaptcha.value && !captcha.value.show) {
          await store.getCaptcha();
          captcha.value.show = true;
        }
      });
      watch(() => isValid.value, () => {
        if (!isValid.value) {
          getCaptcha.value = false;
          field.value = '';
          setTimeout(() => getCaptcha.value = true, 0);
        }
      });

      return {
        getCaptcha,
        captcha,
        field,
        isValid,
        errClass,
        updateCaptcha,
        submitCaptcha
      };
    }
  };
</script>
