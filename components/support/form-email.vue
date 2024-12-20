<template>
  <div class="py-3">
    <label
      class="support-form-label"
      for="answermail">Эл. почта для ответа</label>
    <div
      :class="errorClass"
      data-err="Необходимо указать корректный email">
      <input
        type="text"
        class="form-control"
        :class="errorClass"
        id="answermail"
        v-model="field.value"
        @input="input">
    </div>
  </div>
</template>

<script>
  import useSupportStore from '~/stores/support';

  export default {
    setup() {
      const store = useSupportStore();
      const field = store.fields.find((f) => f.name === 'email');
      const isValid = computed(() => store.checkFields ? field.isValid : true);
      const errorClass = computed(() => !isValid.value ? 'support-error' : '');

      function emailValid(str) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(str);
      }

      function input() {
        field.value = field.value.replace(/\s/g, '');
        field.isValid = emailValid(field.value);
      }

      return {
        field,
        errorClass,
        input
      };
    }
  };
</script>
