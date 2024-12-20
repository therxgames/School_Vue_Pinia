<template>
  <div class="content-container">
    <div>
      <h4 class="my-4">
        Добавить элемент
      </h4>
    </div>
    <form
      class="card px-4 py-2 mx-auto mt-5"
      style="max-width: 654px;">
      <div class="my-3">
        <label
          class="form-label"
          for="title">Название</label>
        <input-simple
          ref="nameEl"
          placeholder="Название элемента"
          v-model:value="name"
          :error="nameError"/>
      </div>
      <div class="my-3">
        <label
          class="form-label"
          for="table">Вес элемента</label>
        <input
          type="number"
          class="form-control"
          min="-2147483648"
          max="2147483647"
          placeholder="Вес"
          v-model="weight">
        <div class="form-text">
          Нужен для возможности сортировки пунктов по порядку.
        </div>
      </div>
      <div class="my-3 d-flex justify-content-between">
        <button
          @click="addElement"
          type="button"
          class="btn btn-primary"
          :disabled="!(name.trim() && weight !== '')">
          Сохранить
        </button>
        <button
          type="button"
          class="btn border-dark"
          @click="goBack">
          Вернуться назад
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import useAdminManualsStore from '~/stores/admin-manuals';

  const store = useAdminManualsStore();
  const router = useRouter();
  const {manual_id} = useRoute().params;
  const sending = ref(false);
  const nameError = ref('');
  const name = ref('');
  const weight = ref(0);

  const manual = ref(null);
  if (manual_id) {
    manual.value = await store.manual(manual_id);
  }

  const addElement = async () => {
    if (sending.value) return;
    sending.value = true;

    try {
      const response = await useApi(`/api/references`, {
        method: 'POST',
        body: {
          table_name: manual.value.table_name,
          name: name.value,
          weight: weight.value
        }
      });
      if (response.data.done) {
        goBack();
        manual.value = await store.manual(manual_id, true);
      };
    } catch (e) {
      nameError.value = 'Название элемента должно быть уникальным';
    }
    sending.value = false;
  };
  const nameEl = ref(null);
  const focus = () => {
    const input = nameEl.value?.$el.querySelector('input');
    if (input) input.focus();
  };

  watch(() => name.value, () => {
    nameError.value = '';
  });

  onMounted(() => {
    nextTick(focus);
  });

  watch(() => useRouter().currentRoute.value.name, (val) => {
    if (val === 'admin-manuals-manual_id-elements-add') {
      nextTick(focus);
    }
  });

  function goBack() {
    router.push(`/admin/manuals/edit/${manual_id}`);
    name.value = '';
    weight.value = 0;
  }
</script>
