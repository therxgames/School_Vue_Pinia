<template>
  <div class="content-container admin-manual-list">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h4 class="d-flex align-items-center mb-0">
        <span class="d-flex align-items-center me-4">Справочники</span>
        <input-search
          placeholder="Поиск по названию справочника"
          style="width: 400px;"
          v-model:value="bySearchString"/>
      </h4>
      <button
        @click="router.push(`/admin/manuals/add`)"
        class="btn btn-primary">
        Добавить справочник
      </button>
    </div>
    <div class="table text-nowrap border rounded mb-5">
      <div
        class="table-row table-row-header"
        :class="{'border-bottom': list.length}">
        <div
          v-for="{name, title} in fields"
          :key="name"
          class="table-cell p-3">
          <common-sort-label
            :title="title"
            :dir="name === sorted.name ? sorted.asc : 0"
            @sort="sort(name)"/>
        </div>
      </div>
      <div
        v-for="item in list"
        :key="item.id"
        class="table-row">
        <div class="table-cell p-3">
          {{ item.id }}
        </div>
        <div
          class="table-cell p-3 text-cut admin-link"
          @click="router.push(`/admin/manuals/${item.id}`)">
          {{ item.name }}
        </div>
        <div class="table-cell text-cut px-3">
          {{ item.external ? 'внешний' : 'внутренний' }}
        </div>
        <div
          v-show="item.actualized_at"
          class="table-cell text-cut px-3">
          {{ formatDate(item.actualized_at, 'd MMMM yyyy') }}
        </div>
        <div class="table-cell px-3">
          <button
            v-if="item.external"
            class="btn text-primary mx-2"
            @click="actualize(item.id)">
            Актуализировать
          </button>
          <button
            v-show="!item.external"
            class="btn btn-sm mx-2"
            @click="router.push(`/admin/manuals/edit/${item.id}`)">
            <svg-icon name="edit"/>
          </button>
        </div>
        <loader
          class="admin-manual-item-loader"
          :listener="fetching"/>
      </div>
    </div>
    <common-empty
      v-if="!list.length"
      btn-title="Сбросить"
      reason-text="Попробуйте изменить строку поиска"
      @click="bySearchString = ''; onSearch()"/>

    <common-pagination
      v-if="pagination"
      class="mb-4"
      :list="list"
      :pagination="pagination"
      :per-page="PER_PAGE"
      :per-page-add="PER_PAGE"
      @page="onPage"
      @show-more="onShowMore"/>
  </div>
</template>

<script setup>
import _debounce from 'lodash.debounce';

const router = useRouter();
const PER_PAGE = 8;
const loadad = ref(false);
const fetching = ref(false);

const bySearchString = ref('');
const onSearch = async () => {
  if (!loadad.value) {
    loadad.value = true;
    await fetchManuals();
    list.value = items.value.data;
    loadad.value = false;
  }
};

watch(bySearchString, _debounce(onSearch, 1000));

const fields = [
  {
    title: 'ID',
    name: 'id'
  },
  {
    title: 'Название справочника',
    name: 'name'
  },
  {
    title: 'Статус',
    name: 'external'
  },
  {
    title: 'Дата актуализации',
    name: 'actualized_at'
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

const items = ref(null);

const fetchManuals = async (page = 1) => {
  fetching.value = true;
  try {
    const query = {
      page,
      per_page: PER_PAGE,
      name: bySearchString.value
    };

    if (!sorted.asc) {
      query.sort_by = 'none';
    } else {
      query.sort_by = sorted.name,
        query.sort_dir = sorted.asc === 1 ? 'asc' : 'desc';
    }

    const response = await useApi('/api/registry_references', {
      method: 'GET',
      query
    });

    if (response.data.done) {
      items.value = response.data.data;
    }
  } catch (e) {
    console.log('Ошибка загрузки списка справочников', e);
  }
  fetching.value = false;
};

watch(sorted, async () => {
  await fetchManuals();
  list.value = items.value.data;
});

const list = ref(null);
if (!items.value) {
  await fetchManuals();
  list.value = items.value.data;
}

const updateManualsList = async () => {
  await fetchManuals();
  list.value = items.value.data;
};

onMounted(() => {
  eventBus.on('manuals:list-update', updateManualsList);
});

onUnmounted(() => {
  eventBus.off('manuals:list-update', updateManualsList);
});

const pagination = computed(() => {
  if (items.value) {
    return {
      total: items.value.total,
      current: items.value.current_page,
      last_page: items.value.last_page,
      per_page: items.value.per_page
    };
  }

  return null;
});

const onPage = async (n) => {
  await fetchManuals(n);
  list.value = items.value.data;
};

const onShowMore = async (page) => {
  await fetchManuals(page);
  list.value = [...list.value, ...items.value.data];
};

const actualize = async (id) => {
  try {
    const response = await useApi(`/api/registry_references/actualize/${id}`, {
      method: 'GET'
    });
    if (response.data.done) {
      const res = await useApi(`/api/registry_references/${id}`, {
        method: 'GET'
      });
      if (res.data.done) {
        const manual = list.value.find((item) => item.id === id);
        if (manual) {
          manual.actualized_at = res.data.data.actualized_at;
          eventBus.emit('toast:show', {
            text: 'Актуализация прошла успешно'
          });
        }
      }
    }
    ;
  } catch (e) {
    console.log('Ошибка актуализации справочника', e);
  }
};
</script>

<style lang="scss">
@import '/assets/scss/theme';

.admin-manual-list {
  .table {
    font-size: 14px;
    color: $color-dark;

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
          flex-basis: 50%;
          font-size: 16px;
          color: $color-black;
        }

        &:nth-child(3) {
          flex-basis: 10%;
        }

        &:nth-child(4) {
          flex-basis: 15%;
        }

        &:nth-child(5) {
          text-align: end;
          flex-grow: 1;
        }
      }
    }
  }
}
</style>
