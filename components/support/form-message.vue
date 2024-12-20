<template>
  <div class="pt-3 support-textarea">
    <label
      class="support-form-label"
      for="msg">Сообщение</label>
    <textarea
      ref="textarea"
      class="form-control support-textarea"
      :class="errorClasses"
      id="msg"
      v-model="field.value"
      @input="input"
      :maxlength="messageLimit"
      rows="3"/>
    <div class="support-form-text py-2">
      {{ field.value.length }}/{{ messageLimit }}
    </div>
  </div>
</template>

<script>
  import useSupportStore from '~/stores/support';

  export default {
    setup() {
      const store = useSupportStore();
      const field = store.fields.find((f) => f.name === 'message');
      const textarea = ref(null);
      const messageLimit = 1000;
      const isValid = computed(() => store.checkFields ? field.isValid : true);
      const errorClasses = computed(() => {
        if (!isValid.value) {
          textarea.value.focus();
          return 'support-error';
        } else {
          return '';
        }
      });

      function input() {
        field.isValid = field.value.length > 0;
      }

      return {
        field,
        textarea,
        errorClasses,
        messageLimit,
        input
      };
    }
  };
</script>
