<template>
  <div class="py-3">
    <div class="">
      <label class="support-form-label">Тема</label>
      <input-select-single
        :reset-btn="false"
        placeholder="Тема"
        :list="list"
        v-model:value="selected"/>
    </div>
    <div
      v-if="current.id === 3"
      class="mt-2"
      :class="errorClass"
      data-err="Необходимо указать тему">
      <input
        type="text"
        class="form-control"
        :class="errorClass"
        v-model="valueSubject"
        @input="input"
        placeholder="Введите тему">
    </div>
  </div>
</template>

<script>
  import useSupportStore from '~/stores/support';

  export default {
    setup() {
      const store = useSupportStore();
      const field = store.fields.find((f) => f.name === 'subject');
      const list = computed(() => store.getSubjects.sort((a, b) => a.weight - b.weight));
      const defaultTheme = () => {
        if (store.from.value === 'task') return 1;
        if (store.from.value === 'test') return 2;
        return 3;
      };
      const selected = ref(defaultTheme());
      const valueSubject = ref('');
      const current = computed(() => list.value.find((s) => s.id === selected.value) || {id: 3, name: ''});
      const subject = computed(() => current.value.id === 3
        ? valueSubject.value : current.value.name || '');
      field.value = subject.value;
      field.isValid = subject.value.length > 0;
      store.currentsubject = current.value.id;
      const isValid = computed(() => store.checkFields ? field.isValid : true);
      const errorClass = computed(() => !isValid.value ? 'support-error' : '');

      function input() {
        const str = valueSubject.value;
        const regex = /^[a-zA-Zа-яА-Я\s.,!?-]*$/;
        const value = str[str.length - 1];
        valueSubject.value = regex.test(value) ? str.replace(/\s\s+/g, ' ') : str.slice(0, -1);
        field.isValid = valueSubject.value.length > 0;
      }

      watch(() => subject.value, () => {
        field.value = subject.value;
        field.isValid = subject.value.length > 0;
        store.currentsubject = current.value.id;
      });

      return {
        selected,
        input,
        list,
        errorClass,
        valueSubject,
        current
      };
    }
  };
</script>
