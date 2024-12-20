<template>
  <div class="py-3">
    <label
      class="support-form-label"
      for="sendname">Как к вам обращаться</label>
    <div
      :class="errorClass"
      data-err="Необходимо указать имя">
      <input
        type="text"
        class="form-control"
        :class="errorClass"
        id="sendname"
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
      const field = store.fields.find((f) => f.name === 'call_you');
      const isValid = computed(() => store.checkFields ? field.isValid : true);
      const errorClass = computed(() => !isValid.value ? 'support-error' : '');

      function input() {
        const str = field.value;
        const regex = /^[a-zA-Zа-яА-Я\s]*$/;
        const value = str[str.length - 1];
        field.value = regex.test(value) ? str.replace(/\s\s+/g, ' ') : str.slice(0, -1);
        field.isValid = field.value.length > 0;
      }

      return {
        field,
        errorClass,
        input
      };
    }
  };
</script>
