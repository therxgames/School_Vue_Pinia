<template>
  <div class="admin-logs">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="my-4">
        Список логов
      </h4>
    </div>
    <div class="admin-logs-filters">
      <div class="admin-logs-filters-roles">
        <h5 class="m-0">
          Выбор
        </h5>
        <div class="mx-4">
          <input-select-single
            :list="adminLogsStore.filters.type.data"
            placeholder="Тип"
            v-model:value="byType"/>
        </div>
        <div class="mx-4">
          <input-select-single
            :list="adminLogsStore.filters.result.data"
            placeholder="Результат"
            v-model:value="byResult"/>
        </div>
      </div>
      <div class="admin-logs-filters-sub">
        <div>
          <svg-icon name="setting"/>
        </div>
        <h5 class="m-0">
          Фильтры
        </h5>
        <input-search
          placeholder="по ID пользователя"
          :min-length="0"
          v-model:value="byUserId"
          @search="acceptByUserId"/>
        <input-search
          placeholder="по ID события"
          :min-length="0"
          v-model:value="byEventId"
          @search="acceptByEventId"/>
      </div>
      <div class="admin-logs-filters-info">
        <common-result-info
          :visible-if="true"
          :reset-visible-if="adminLogsStore.filtersInvolved"
          :count="adminLogsStore.filters.page.total"
          @reset="adminLogsStore.resetFilters"/>
      </div>
    </div>
    <div class="admin-logs-content">
      <div v-if="adminLogsStore.list.length">
        <div class="admin-logs-table-container my-5 border rounded">
          <table class="admin-logs-table  bg-ligh w-100 text-nowrap position-relative">
            <tbody>
              <tr class="border-bottom text-muted admin-logs-table-header-row">
                <td
                  @click="setSorter('id')"
                  class="p-2 border-bottom w-10 admin-logs-table-header-row-cell">
                  <common-sort-label
                    title="ID"
                    :dir="dir('id')"/>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">Дата создания</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID</span>
                </td>
                <td
                  @click="setSorter('user_name')"
                  class="p-2 w-75 border-bottom admin-logs-table-header-row-cell">
                  <common-sort-label
                    title="Имя пользователя"
                    :dir="dir('user_name')"/>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID события</span>
                </td>
                <td
                  @click="setSorter('event_name')"
                  class="p-2 w-100 border-bottom admin-logs-table-header-row-cell">
                  <common-sort-label
                    title="Название события"
                    :dir="dir('event_name')"/>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">Ошибка</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID клиента</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID роли</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID задания</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID теста</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID темы</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID ответа</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID предмета</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">ID справочника</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">Данные</span>
                </td>
                <td class="p-2 border-bottom">
                  <span class="label">Описание</span>
                </td>
              </tr>
              <tr
                v-for="(log, index) in adminLogsStore.localList"
                :key="index"
                class="">
                <admin-log-sell :title="log.id"/>
                <admin-log-sell :title="log.created_at"/>
                <admin-log-sell :title="log.user_id "/>
                <admin-log-sell :title="log.user_name"/>
                <admin-log-sell :title="log.event_id"/>
                <admin-log-sell :title="log.event_name"/>
                <admin-log-sell :title="log.error"/>
                <admin-log-sell :title="log.client_id"/>
                <admin-log-sell :title="log.role_id"/>
                <admin-log-sell :title="log.task_id"/>
                <admin-log-sell :title="log.test_id"/>
                <admin-log-sell :title="log.theme_id"/>
                <admin-log-sell :title="log.answer_id"/>
                <admin-log-sell :title="log.subject_id"/>
                <admin-log-sell :title="log.ref_id"/>
                <admin-log-sell :title="log.jdata"/>
                <admin-log-sell :title="log.description"/>
              </tr>
            </tbody>
          </table>
        </div>
        <common-pagination
          :pagination="adminLogsStore.filters.page"
          :per-page="adminLogsStore.filters.page.per_page"
          @show-more="onShowMore"
          @page="onPage"/>
      </div>
      <div v-if="!adminLogsStore.list.length && !adminLogsStore.fetching">
        <common-empty
          @click="adminLogsStore.resetFilters"
          class="admin-logs-empty"/>
      </div>
      <loader
        class="admin-logs-content-loader"
        :listener="adminLogsStore.fetching"/>
    </div>
  </div>
</template>

<script setup>
  import useAdminLogsStore from '~/stores/admin-logs';

  const adminLogsStore = useAdminLogsStore();
  const router = useRouter();

  const byType = computed({
    get: () => {
      return adminLogsStore.filters.type.value;
    },
    set: (value) => {
      adminLogsStore.filters.type.value = value;
      adminLogsStore.filters.page.current = 1;
    }
  });

  const byResult = computed({
    get: () => {
      return adminLogsStore.filters.result.value;
    },
    set: (value) => {
      adminLogsStore.filters.result.value = value;
      adminLogsStore.filters.page.current = 1;
    }
  });

  const byId = computed({
    get: () => {
      return adminLogsStore.filters.id.value;
    },
    set: (value) => {
      adminLogsStore.filters.id.value = value;
      adminLogsStore.filters.page.current = 1;
    }
  });

  const byEventId = computed({
    get: () => {
      return adminLogsStore.filters.event_id.value;
    },
    set: (value) => {
      adminLogsStore.filters.event_id.value = value;
      adminLogsStore.filters.page.current = 1;
    }
  });

  const byUserId = computed({
    get: () => {
      return adminLogsStore.filters.user_id.value;
    },
    set: (value) => {
      adminLogsStore.filters.user_id.value = value;
      adminLogsStore.filters.page.current = 1;
    }
  });

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'admin-logs') {
      adminLogsStore.$reset();
    }
  });

  onUnmounted(() => {
    adminLogsStore.reset();
  });

  const invoke = () => {
    adminLogsStore.invoke({
      onUpdateRoute({query}) {
      },
      onFetch({query, user}) {
        return adminLogsStore.fetch();
      }
    });
  };

  const dir = (name) => {
    const {by, dir} = adminLogsStore.filters.order;
    if (by === name) {
      return dir === 'desc' ? 2 : 1;
    }
    return 0;
  };

  const onPage = (page) => {
    adminLogsStore.filters.page.current = page;
  };

  const onShowMore = (page) => {
    adminLogsStore.filters.page.append = true;
    adminLogsStore.filters.page.current = page;
  };

  const acceptById = () => {
    adminLogsStore.filters.id.accepted = adminLogsStore.filters.id.value;
  };

  const acceptByUserId = () => {
    adminLogsStore.filters.user_id.accepted = adminLogsStore.filters.user_id.value;
  };

  const acceptByEventId = () => {
    adminLogsStore.filters.event_id.accepted = adminLogsStore.filters.event_id.value;
  };

  const setSorter = (name) => {
    if (adminLogsStore.filters.order.by === name) {
      adminLogsStore.filters.order.dir = adminLogsStore.filters.order.dir === 'desc'
        ? 'asc'
        : 'desc';
    } else {
      adminLogsStore.filters.order.by = name;
      adminLogsStore.filters.order.dir = 'asc';
    }
  };

  await useAsyncData('admin-logs', () => Promise.all([
    adminLogsStore.fetch({resetBefore: true})
  ]));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-logs {
    &-filters {
      position: relative;

      &-roles {
        display: grid;
        grid-template-columns: max-content 30% 30%;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      &-info {
        margin-top: 1.5rem;
      }

      &-sub {
        display: grid;
        grid-template-columns: max-content max-content minmax(200px, 300px) minmax(200px, 300px);
        gap: 2rem;
        align-items: center;
      }
    }

    &-table {
      position: relative;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 0.5rem !important;

      &-container {
        overflow-x: scroll;
        border-right: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
      }

      &-edit-btn {
        border: none !important;

        &:hover {
          color: $color-blue-normal;
        }
      }

      &-row-is-me {
        background: #f9f9f9;
      }

      &-header-row {
        user-select: none;
        position: sticky;
        top: 0;
        background: #fff;

        &-cell {
          cursor: pointer;

          &:hover {
            color: $color-blue-normal;
          }
        }
      }
    }

    &-empty {
      padding: 5rem;
    }

    &-content {
      position: relative;

      &-loader {
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        margin-left: -2px;
        margin-top: -2px;

        --loader-padding-bottom: 30%;
      }
    }
  }

  .label {
    color: $color-dark;
    font-size: 14px;
  }

  .admin-link:hover {
    cursor: pointer;
    color: #0576ff;
  }
</style>
