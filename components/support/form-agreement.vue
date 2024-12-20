<template>
  <div
    class="form-check"
    :class="errorClasses">
    <input
      type="checkbox"
      class="form-check-input"
      :checked="agreement"
      v-model="value"
      @change="change"
      id="agreement">
    <label
      for="agreement"
      class="form-check-label">
      Я согласен на передачу указанных сведений оператору ФГИС «Моя
      школа» и их использование в целях обработки обращения
    </label>
  </div>
</template>

<script>
  import useSupportStore from '~/stores/support';

  export default {
    setup() {
      const store = useSupportStore();
      const agreement = computed(() => store.agreement);
      const value = ref(store.agreement);
      const isValid = computed(() => store.checkFields ? store.agreement : true);
      const errorClasses = computed(() => !isValid.value ? 'agreement-err' : '');

      function change() {
        store.agreement = value.value;
      }

      return {
        agreement,
        value,
        errorClasses,
        change
      };
    }
  };
</script>

<style lang="scss" scoped>
  .agreement-err {
    -webkit-animation: blinkerr 0.4s linear 2;
    animation: blinkerr 0.6s linear 1;
  }

  @keyframes blinkerr {
    0% { opacity: 1; }
    20% { opacity: 0.6; }
    60% { opacity: 1; }
    80% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  @keyframes blinkerr {
    0% { opacity: 1; }
    20% { opacity: 0.6; }
    60% { opacity: 1; }
    80% { opacity: 0.5; }
    100% { opacity: 1; }
  }
</style>
