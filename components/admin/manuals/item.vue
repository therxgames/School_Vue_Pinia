<template>
  <div class="content-container admin-manual-item">
    <common-breadcrumbs
      :items="[{to: '/admin/manuals', title: 'Управление справочниками'}]"/>
    <div v-if="manual">
      <h1 class="my-1">
        {{ manual.name }}
      </h1>
      <div class="d-flex align-items-end">
        <div
          v-if="edit || manual.version === 1"
          style="color: #ced6e0;">
          Версия {{ manual.version }}
        </div>
        <input-select-single
          v-else
          class="mt-2"
          :placeholder="'Версия ' + manual.version"
          :list="versionList"
          v-model:value="currentVersion"
          style="width: 150px;"/>
        <button
          type="button"
          class="btn btn-simple ms-2"
          v-if="currentVersion > 1"
          @click="versionDifferences">
          Отличие от версии {{ currentVersion - 1 }}
        </button>
      </div>
    </div>
    <div
      v-if="edit || add"
      class="my-5">
      <h4 class="my-4">
        Редактирование
      </h4>
      <form class="card px-4 py-2">
        <div class="my-3">
          <label
            class="form-label"
            for="title">Название</label>
          <input
            class="form-control"
            type="text"
            id="title"
            v-model="manualName">
        </div>
        <div class="my-3">
          <label
            class="form-label"
            for="table">Имя таблицы</label>
          <input
            class="form-control"
            type="text"
            id="table"
            :disabled="edit"
            v-model="manualTableName">
        </div>
        <div class="my-3 d-flex justify-content-between">
          <button
            @click="changeManual"
            :disabled="!(manualName && manualTableName)"
            type="button"
            class="btn btn-primary">
            Сохранить
          </button>
          <button
            v-if="edit && !manual.system"
            type="button"
            @click="deleteManualForm"
            class="btn border-dark d-flex align-items-center">
            <svg-icon
              name="trash"
              style="font-size: 12px;"/>
            <span class="mx-2">Удалить</span>
          </button>
        </div>
      </form>
    </div>
    <div
      v-if="!add"
      class="my-5">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h4 class="admin-manual-item-search d-flex align-items-center mb-0">
          <span class="d-flex align-items-center me-4">
            Элементы справочника
          </span>
          <input-search
            placeholder="Поиск по элементам справочника"
            style="width: 400px;"
            v-model:value="bySearchString"/>
        </h4>
        <button
          v-if="edit"
          class="btn btn-primary"
          :disabled="editingElement"
          @click="router.push(`/admin/manuals/${manual_id}/elements/add`)">
          Добавить элемент
        </button>
        <button
          v-if="!edit && manual.external"
          class="btn btn-simple"
          @click="actualize(manual_id)">
          Синхронизировать с ФГИС "Моя школа"
        </button>
      </div>
      <div class="table p-0 bg-ligh w-100 text-nowrap border rounded">
        <div
          class="table-row table-row-header"
          :class="{'border-bottom': elements.length}">
          <div
            v-for="{name, title} in fields"
            :key="name"
            class="table-cell px-3"
            :style="{flexBasis: (name === 'name' && !edit) ? '84%' : ''}">
            <common-sort-label
              :title="title"
              :dir="name === sorted.name ? sorted.asc : 0"
              @sort="sort(name)"/>
          </div>
        </div>
        <div
          v-for="item in elements"
          :key="item.id"
          class="table-row">
          <template v-if="item.id && !item.edit">
            <div class="table-cell px-3">
              {{ item.id }}
            </div>
            <div
              class="table-cell px-3 text-cut"
              :style="{flexBasis: edit ? '69%' : '84%'}">
              {{ item.name }}
            </div>
            <div class="table-cell px-3">
              {{ item.weight }}
            </div>
            <div
              v-if="edit"
              class="table-cell px-3">
              <button
                class="btn btn-sm mx-2"
                @click="editElementForm(item.id)">
                <svg-icon name="edit"/>
              </button>
              <button
                class="btn btn-sm mx-2"
                @click="deleteElement(item.id)">
                <svg-icon name="trash"/>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="table-cell px-3">
              {{ item.id }}
            </div>
            <div class="table-cell text-cut px-3">
              <input
                class="w-100"
                type="text"
                placeholder="Название элемента"
                v-model="elementName">
            </div>
            <div class="table-cell px-3">
              <input
                style="width: 128px;"
                type="number"
                min="-2147483648"
                max="2147483647"
                placeholder="Вес"
                v-model="elementWeight">
            </div>
            <div class="table-cell text-end px-3">
              <button
                class="btn btn-sm mx-2"
                @click="change(item.id)">
                <svg-icon name="check"/>
              </button>
              <button
                class="btn btn-sm mx-2"
                style="transform: scale(0.8);"
                @click="cancel(item)">
                <svg-icon name="cross"/>
              </button>
            </div>
          </template>
        </div>
        <loader
          class="admin-manual-item-loader"
          :listener="fetching"/>
      </div>
    </div>
    <common-empty
      v-if="!elements.length && bySearchString !== ''"
      btn-title="Сбросить"
      reason-text="Попробуйте изменить строку поиска"
      @click="bySearchString = ''; onSearch()"/>

    <common-pagination
      v-if="pagination"
      class="mb-4"
      :list="elements"
      :pagination="pagination"
      :per-page="PER_PAGE"
      :per-page-add="PER_PAGE"
      @page="onPage"
      @show-more="onShowMore"/>
  </div>
</template>

<script setup>
  import useAdminManualsStore from '~/stores/admin-manuals';
  import _debounce from 'lodash.debounce';

  const props = defineProps({
    edit: {
      type: Boolean,
      required: false
    },
    add: {
      type: Boolean,
      required: false
    }
  });

  const loaded = ref(false);
  const bySearchString = ref('');
  const currentVersion = ref(null);
  const loading = ref(false);

  const onSearch = async () => {
    if (!loaded.value) {
      loaded.value = true;
      await fetchItem();
      elements.value = item.value.data;
      loaded.value = false;
    }
  };

  watch(bySearchString, _debounce(onSearch, 1000));

  const store = useAdminManualsStore();
  const router = useRouter();
  const {manual_id} = useRoute().params;
  const elementName = ref('');
  const elementWeight = ref(0);
  const editingElement = ref(null);
  const fetching = ref(false);

  const manualName = ref('');
  const manualTableName = ref('');

  const item = ref(null);
  const currentPage = ref(1);
  const PER_PAGE = 20;

  const fields = [
    {
      title: 'ID',
      name: 'id'
    },
    {
      title: 'Название элемента',
      name: 'name'
    },
    {
      title: 'Вес',
      name: 'weight'
    }
  ];
  const sorted = reactive({
    name: fields[0].name,
    asc: 0
  });

  function sort(name) {
    if (sorted.name !== name) {
      sorted.name = name;
      sorted.asc = 1;
    } else {
      sorted.asc = sorted.asc === 2 ? 0 : sorted.asc + 1;
    }
  }

  const versionDifferences = async () => {
    try {
      const response = await useApi(`/api/references/version_differences`, {
        ...methodGet,
        query: {
          id: manual_id,
          version: currentVersion.value
        }
      });
      if (response?.data?.done) {
        showDifferences(response.data.data);
      }
    } catch (e) {
      console.log('Ошибка получения отличия версий справочника', e);
    }
  };

  const showDifferences = (data) => {
    eventBus.emit('alert:show', {
      title: `Отличие версии ${currentVersion.value} от ${currentVersion.value - 1}`,
      contentComponent: 'helperAlertContentManualDifferences',
      additionalData: {data, currentVersion: currentVersion.value},
      buttons: [
        {
          title: 'Закрыть',
          class: 'btn-outline-primary',
          click(modal, context) {
            context.hide();
          }
        }
      ]
    });
  };

  const manual = ref(null);
  if (manual_id) {
    manual.value = await store.manual(manual_id);
    currentVersion.value = manual.value.version;
  }

  watch(() => store.manuals[manual_id]?.version, async () => {
    await getItem();
    manual.value = await store.manual(manual_id);
    currentVersion.value = manual.value.version;
  });

  const versionList = computed(() => {
    const res = [];
    if (manual.value?.version) {
      for (let i = manual.value.version; i > 0; i--) {
        res.push({
          id: i,
          name: 'Версия '+i
        });
      }
    }

    return res;
  });

  watch(currentVersion, (val) => {
    if (val === null) {
      currentVersion.value = manual.value.version;
      return;
    }
    if (!props.edit) {
      fetchItem();
    }
  });

  const fetchItem = async (page = 1, isShowMore = false) => {
    fetching.value = true;

    try {
      const query = {
        table_name: manual.value.table_name,
        page,
        per_page: PER_PAGE,
        name: bySearchString.value
      };

      currentPage.value = page;

      if (currentVersion.value !== manual.value.version) {
        query.version = currentVersion.value;
      }

      if (!sorted.asc) {
        query.sort_by = 'none';
      } else {
        query.sort_by = sorted.name;
        query.sort_dir = sorted.asc === 1 ? 'asc' : 'desc';
      }

      const response = await useApi('/api/references', {
        ...methodGet,
        query
      });

      if (response.data.done) {
        if (isShowMore) {
          elements.value = [...elements.value, ...response.data.data.data];
        } else {
          elements.value = response.data.data.data;
        }

        item.value = response.data.data;
      }
    } catch (e) {
      console.log('Ошибка получения словаря', e);
    }

    fetching.value = false;
  };

  const getItem = async (page = 1) => {
    await fetchItem(page);
    if (item.value.data) {
      elements.value = item.value.data;
    }
  };

  watch(sorted, () => getItem(currentPage.value));

  const pagination = computed(() => {
    if (item.value) {
      return {
        total: item.value.total,
        current: item.value.current_page,
        last_page: item.value.last_page,
        per_page: item.value.per_page
      };
    }

    return null;
  });

  watch(
    () => pagination.value?.current,
    async () => {
      await nextTick();
      window?.scrollTo({top: 100, behavior: 'smooth'});
    }
  );


  const onPage = (n) => getItem(n);

  const onShowMore = async (page = 1) => {
    await fetchItem(page, true);
  };

  const elements = ref([]);
  if (manual.value) {
    getItem();
    manualName.value = manual.value.name;
    manualTableName.value = manual.value.table_name;
  }

  const change = (id) => {
    const el = elements.value.find((item) => item.id === id);
    if (el.name !== elementName.value || elementWeight.value !== el.weight) {
      editElement(id);
    } else {
      cancel(el);
    }
  };

  const inputReset = () => {
    editingElement.value = null;
  };

  const cancel = (element) => {
    if (element && element.id) {
      element.edit = false;
    } else {
      elements.value = elements.value.filter((item) => !item.edit);
    }
    inputReset();
  };

  const deleteElement = async (id) => {
    if (loading.value) return;
    loading.value = true;
    try {
      const response = await useApi(`/api/references/${id}`, {
        method: 'DELETE',
        body: {
          table_name: manual.value.table_name,
          id: +id
        }
      });
      if (response.data.done) {
        manual.value = await store.manual(manual_id, true);
      };
    } catch (e) {
      console.log('Ошибка удаления элемента справочника');
    }
    loading.value = false;
  };

  const editElementForm = (id) => {
    inputReset();
    const el = elements.value.find((item) => item.id === id);
    el.edit = true;
    elementName.value = el.name;
    elementWeight.value = el.weight;
    editingElement.value = el;
  };

  const editElement = async (id) => {
    if (loading.value) return;

    loading.value = true;
    try {
      const response = await useApi(`/api/references/${id}`, {
        method: 'PUT',
        body: {
          id: +id,
          table_name: manual.value.table_name,
          name: elementName.value,
          weight: elementWeight.value
        }
      });
      if (response.data.done) {
        manual.value = await store.manual(manual_id, true);
        inputReset();
      };
    } catch (e) {
      let error = e.response?.data?.error;
      if (error) {
        try {
          error = JSON.parse(error);
          if (typeof error === 'object') {
            error = error.name;
          }
        } catch (e) {}
        eventBus.emit('toast:show', {text: error});
      }
    }
    loading.value = false;
  };

  const changeManual = () => {
    if (props.add) addManual();
    if (props.edit) editManual();
  };

  const addManual = async () => {
    if (loading.value) return;
    loading.value = true;
    let tableName = manualTableName.value;
    if (!tableName.startsWith('ref_')) tableName = 'ref_' + tableName;
    try {
      const response = await useApi(`/api/registry_references`, {
        method: 'POST',
        body: {
          name: manualName.value,
          table_name: tableName
        }
      });
      if (response.data.done) {
        router.push('/admin/manuals/edit/'+response.data.id);
        manualName.value='';
        manualTableName.value='';
        eventBus.emit('manuals:list-update');
      }
    } catch (e) {
      console.log('Ошибка добавления справочника', e);
    }
    loading.value = false;
  };

  const editManual = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      const response = await useApi(`/api/registry_references/${manual_id}`, {
        method: 'PUT',
        body: {
          name: manualName.value,
          id: manual_id
        }
      });
      if (response.data.done) {
        const res = await useApi(`/api/registry_references/${manual_id}`, {
          method: 'GET'
        });
        if (res.data.done) {
          manual.value = res.data.data;
          eventBus.emit('manuals:list-update');
        }
      }
    } catch (e) {
      console.log('Ошибка редактирования справочника', e);
    }
    loading.value = false;
  };

  const deleteManualForm = () => {
    eventBus.emit('alert:show', {
      title: 'Удаление справочника',
      content: `Вы действительно хотите удалить справочник?`,
      buttons: [
        {
          title: 'Да',
          async click(modal, context) {
            context.hide();
            deleteManual();
          }
        },
        {
          title: 'Отмена',
          class: 'btn-outline-primary',
          click(modal, context) {
            context.hide();
          }
        }
      ]
    });
  };

  const deleteManual = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      const response = await useApi(`/api/registry_references/${manual_id}`, {
        method: 'DELETE'
      });
      if (response.data.done) {
        router.push('/admin/manuals/');
        eventBus.emit('manuals:list-update');
      };
    } catch (e) {
      console.log('Ошибка удаления справочника', e);
    }
    loading.value = false;
  };

  const actualize = async (id) => {
    if (loading.value) return;
    loading.value = true;
    try {
      const response = await useApi(`/api/registry_references/actualize/${id}`, {
        method: 'GET'
      });
      if (response.data.done) {
        const res = await useApi(`/api/registry_references/${id}`, {
          method: 'GET'
        });
        if (res.data.done) {
          manual.value = await store.manual(manual_id);
          await getItem();
          eventBus.emit('toast:show', {
            text: 'Актуализация прошла успешно'
          });
        }
      }
    } catch (e) {
      console.log('Ошибка актуализации справочника', e);
    }
    loading.value = false;
  };

</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-manual-item {
    .table {
      .table-row {
        height: 64px;
        display: flex;
        align-items: center;

        &:not(:last-child) {
          border-bottom: 1px solid $color-black-10;
        }

        .table-cell {
          vertical-align: middle;

          &:nth-child(1) {
            flex-basis: 6%;
            font-size: 14px;
          }

          &:nth-child(2) {
            flex-basis: 69%;
          }

          &:nth-child(3) {
            flex-grow: 1;
          }
        }
      }
    }

    input {
      border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
      border-radius: var(--bs-border-radius);
      outline: none;
      padding: 0.3em;
    }

    .admin-manual-item-search {
      input {
        border: none;
        padding: 0.5rem 1rem;
      }
    }

    &-loader {
      --loader-spinner-width: 3.5rem;
      --loader-spinner-height: 3.5rem;
      --loader-max-opacity: 0.9;

      .loader-spinner-container {
        position: sticky;
        top: 20px;
        bottom: 20px;
      }
    }
  }

</style>
