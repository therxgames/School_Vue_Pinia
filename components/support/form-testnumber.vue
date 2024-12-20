<template>
  <div class="py-3">
    <label
      class="support-form-label"
      for="num">Номер {{ labelValue() }}</label>
    <div
      class="testnumber"
      data-err="Необходимо указать номер"
      :class="[
        readonlyInput ? 'form-control-plaintext' : 'form-control',
        {'support-error': !isValid}
      ]">
      <span>#</span>
      <input
        type="text"
        :readonly="readonlyInput"
        class="form-control"
        @input="input"
        placeholder=" Введите число"
        v-model="field.value">
    </div>
  </div>
</template>

<script setup>
  import useSupportStore from '~/stores/support';

  const store = useSupportStore();
  const field = store.fields.find((f) => f.name === 'test_number');
  const from = store.from;
  field.value = from.id || '';
  const labelValue = () => {
    if (from.value === 'task') {
      return 'задания';
    } else if (from.value === 'test') {
      return 'теста';
    } else {
      if (store.currentsubject === 1) {
        return 'задания';
      }
      if (store.currentsubject === 2) {
        return 'теста';
      }
      return 'задания или теста';
    }
  };
  const readonlyInput = computed(() => {
    return from.value === 'task' || from.value === 'test';
  });
  field.isValid = readonlyInput.value || store.currentsubject > 2;
  const isValid = computed(() => store.checkFields ? field.isValid : true);
  function input() {
    const regex = /^[0-9]*$/;
    field.value = +field.value.replace(/\D/g, '') || '';
    field.isValid = store.currentsubject < 3
      ? +field.value && regex.test(field.value)
      : regex.test(field.value);
  };
  watch(
    () => store.currentsubject,
    () => field.isValid = readonlyInput.value || store.currentsubject > 2
  );

</script>

<style lang="scss" scoped>
  .testnumber {
    display: flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;

    input {
      padding-left: 0;
      border: none;
      outline: none;
      flex: 1;
    }
  }
</style>
