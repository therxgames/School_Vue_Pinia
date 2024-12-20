<template>
  <div class="my-4">
    <h5 style="height: 50px;">
      Целевой адрес эл. почты
    </h5>
    <form class="card px-4 py-2 mt-3">
      <div class="my-3">
        <label
          class="form-label"
          for="currentemail">Текущий адрес</label>
        <input
          class="form-control-plaintext"
          readonly
          type="text"
          id="currentemail"
          :value="currentValue">
      </div>
      <div class="my-3">
        <label
          class="form-label"
          for="newemail">Новый адрес</label>
        <input
          class="form-control"
          type="text"
          id="newemail"
          v-model="newValue">
      </div>
      <div class="my-3 d-flex justify-content-between">
        <button
          class="btn btn-primary"
          :disabled="!isValid"
          @click="changeEmail">
          Заменить
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import useAdminSupportStore from '~/stores/admin-support';

  export default {
    setup() {
      const store = useAdminSupportStore();
      const currentValue = computed(() => store.emailSettings.value);
      const newValue = ref('');
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      const isValid = computed(() => reg.test(newValue.value));

      function changeEmail() {
        store.newEmail = newValue.value;
        store.changeEmail();
        newValue.value = '';
      }

      return {
        currentValue,
        newValue,
        isValid,
        changeEmail
      };
    }
  };
</script>
