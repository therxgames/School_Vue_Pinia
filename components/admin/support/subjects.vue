<template>
  <div class="my-4">
    <div
      class="d-flex align-items-start justify-content-between"
      style="height: 50px;">
      <h5>Список тем</h5>
      <div class="d-flex">
        <button
          class="btn btn-primary text-nowrap"
          @click="clickAdd">
          Добавить тему
        </button>
      </div>
    </div>
    <div class="bg-ligh w-100 text-nowrap border rounded mt-3">
      <div
        v-for="item in subjects"
        :key="item.id"
        class="admin-theme-item rounded m-2 py-2 px-3">
        <div>{{ item.name }}</div>
        <button
          class="btn btn-sm p-0"
          @click="clickEdit(item)">
          <svg-icon name="edit"/>
        </button>
        <button
          v-if="item.id > 3"
          class="btn btn-sm p-0"
          @click="clickDelete(item)">
          <svg-icon name="trash"/>
        </button>
      </div>
    </div>
    <dialog-modal
      v-if="addModal"
      :is-show="addModal">
      <template #title>
        Добавить
      </template>
      <template #body>
        <input
          class="form-control mx-auto"
          v-model="newSubject">
      </template>
      <template #buttons>
        <button
          class="btn border-secondary"
          @click="clickCancel">
          Отменить
        </button>
        <button
          class="btn btn-primary"
          @click="addSubject"
          :disabled="!newSubject.length">
          Добавить
        </button>
      </template>
    </dialog-modal>
    <dialog-modal
      v-if="deleteModal"
      :is-show="deleteModal"
      @close="clickCancel">
      <template #title>
        Удалить
      </template>
      <template #body>
        <div>{{ subjectItem.name }}</div>
      </template>
      <template #buttons>
        <button
          class="btn border-secondary"
          @click="clickCancel">
          Отменить
        </button>
        <button
          class="btn btn-primary"
          @click="deleteSubject">
          Удалить
        </button>
      </template>
    </dialog-modal>
    <dialog-modal
      v-if="editModal"
      :is-show="editModal"
      @close="clickCancel">
      <template #title>
        Изменить
      </template>
      <template #body>
        <input
          class="form-control mx-auto"
          v-model="subjectItem.name">
      </template>
      <template #buttons>
        <button
          class="btn border-secondary"
          @click="clickCancel">
          Отменить
        </button>
        <button
          class="btn btn-primary"
          :disabled="!subjectItem.name.length"
          @click="editSubject">
          Сохранить
        </button>
      </template>
    </dialog-modal>
  </div>
</template>

<script>
  import useAdminSupportStore from '~/stores/admin-support';
  import DialogModal from '~/components/dialog-modal.vue';

  export default {
    components: {
      DialogModal
    },
    setup() {
      const store = useAdminSupportStore();
      const subjects = computed(() => {
        if (store.subjects.data) {
          const themes = [...store.subjects.data];
          return themes
            .filter((t) => t.is_archive === 0)
            .sort((a, b) => a.weight - b.weight);
        } else {
          return [];
        }
      });
      const newSubject = ref('');
      const addModal = ref(false);
      const deleteModal = ref(false);
      const editModal = ref(false);
      const subjectItem = ref(null);

      function addSubject() {
        if (newSubject.value.length) {
          store.newSubject = newSubject.value;
          store.addSubject();
          newSubject.value = '';
          addModal.value = false;
        }
      }

      function clickAdd() {
        addModal.value = true;
      }

      function clickCancel() {
        store.selectSubject = null;
        newSubject.value = '';
        addModal.value = false;
        deleteModal.value = false;
        editModal.value = false;
        subjectItem.value = null;
      }

      function clickEdit(item) {
        subjectItem.value = {...item};
        editModal.value = true;
      }

      function editSubject() {
        store.selectSubject = subjectItem.value;
        store.editSubject();
        editModal.value = false;
        subjectItem.value = null;
      }

      function clickDelete(item) {
        subjectItem.value = item;
        deleteModal.value = true;
      }

      function deleteSubject() {
        store.selectSubject = subjectItem.value;
        store.deleteSubject();
        deleteModal.value = false;
        subjectItem.value = null;
      }

      return {
        subjects,
        newSubject,
        addSubject,
        subjectItem,
        clickAdd,
        clickCancel,
        clickEdit,
        clickDelete,
        editSubject,
        deleteSubject,
        addModal,
        deleteModal,
        editModal
      };
    }
  };
</script>

<style lang="scss" scoped>
  .admin-theme-item {
    display: grid;
    grid-template-columns: 1fr 4rem 2rem;
    padding: 0.3rem;
    margin: 0.4rem;
    transition: all 0.3s;

    &:hover {
      background: #f2f5fa;
    }

    button {
      justify-self: center;
    }
  }
</style>
