<template>
  <div class="admin-users">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="my-4">
        Список пользователей
      </h4>
    </div>
    <div class="admin-users-filters">
      <div class="admin-users-filters-roles">
        <h5 class="m-0">
          Выбор роли пользователя
        </h5>
        <div class="mx-4">
          <input-select-single
            :list="adminUsersStore.filters.role.data"
            name-field="description"
            placeholder="Роль"
            v-model:value="byRole"/>
        </div>
      </div>
      <div class="admin-users-filters-sub">
        <div>
          <svg-icon name="setting"/>
        </div>
        <h5 class="m-0">
          Фильтры
        </h5>
        <input-search
          placeholder="по ID"
          :min-length="0"
          v-model:value="byId"
          @search="acceptById"/>
        <input-search
          placeholder="по имени"
          :min-length="0"
          v-model:value="byName"
          @search="acceptByName"/>
      </div>
      <div class="admin-users-filters-info">
        <common-result-info
          :visible-if="true"
          :reset-visible-if="adminUsersStore.filtersInvolved"
          :count="adminUsersStore.filters.page.total"
          @reset="adminUsersStore.resetFilters"/>
      </div>
    </div>
    <div class="admin-users-content">
      <div v-if="adminUsersStore.list.length">
        <div class="admin-users-table d-table bg-ligh w-100 text-nowrap border rounded my-5 position-relative">
          <div class="d-table-row text-muted admin-users-table-header-row">
            <div
              @click="setSorter('id')"
              class="d-table-cell p-3 w-10 border-bottom admin-users-table-header-row-cell">
              <common-sort-label
                title="ID"
                :dir="dir('id')"/>
            </div>
            <div
              @click="setSorter('family_name')"
              class="d-table-cell p-3 w-75 border-bottom admin-users-table-header-row-cell">
              <common-sort-label
                title="Имя пользователя"
                :dir="dir('family_name')"/>
            </div>
            <div
              @click="setSorter('reg_source')"
              class="d-table-cell p-3 w-100 border-bottom admin-users-table-header-row-cell">
              <common-sort-label
                title="Регистрация"
                :dir="dir('reg_source')"/>
            </div>
            <div
              @click="setSorter('created_at')"
              class="d-table-cell p-3 w-100 border-bottom admin-users-table-header-row-cell">
              <common-sort-label
                title="Дата создания"
                :dir="dir('created_at')"/>
            </div>
            <div class="d-table-cell p-3 border-bottom"/>
          </div>
          <div
            v-for="(user, index) in adminUsersStore.list"
            :key="index"
            :class="[{'admin-users-table-row-is-me': user.id === usersStore.entity?.id}]"
            class="d-table-row">
            <div class="d-table-cell p-3 text-muted">
              {{ user.id }}
            </div>
            <div class="d-table-cell p-3 text-muted">
              {{ user.family_name + ' ' + user.given_name }}
            </div>
            <div class="d-table-cell p-3 text-muted">
              {{ registerSourceToName(user.reg_source) }}
            </div>
            <div class="d-table-cell p-3 text-muted">
              {{ user.created_at }}
            </div>
            <div class="d-table-cell p-3 text-end">
              <button
                class="btn btn-sm p-0 mx-3 admin-users-table-edit-btn"
                @click="showRolesModal(user)">
                <svg-icon name="edit"/>
              </button>
            </div>
          </div>
        </div>
        <common-pagination
          :pagination="adminUsersStore.filters.page"
          :per-page="adminUsersStore.filters.page.per_page"
          @show-more="onShowMore"
          @page="onPage"/>
      </div>
      <div v-if="!adminUsersStore.list.length && !adminUsersStore.fetching">
        <common-empty
          @click="adminUsersStore.resetFilters"
          class="admin-users-empty"/>
      </div>
      <loader
        class="admin-users-content-loader"
        :listener="adminUsersStore.fetching"/>
    </div>
  </div>
</template>

<script setup>
  import useAdminUsersStore from '~/stores/admin-users';
  import useUserStore from '~/stores/user';

  const adminUsersStore = useAdminUsersStore();
  const usersStore = useUserStore();
  const router = useRouter();

  const byId = computed({
    get: () => {
      return adminUsersStore.filters.id.value;
    },
    set: (value) => {
      adminUsersStore.filters.id.value = value;
      adminUsersStore.filters.page.current = 1;
    }
  });

  const byName = computed({
    get: () => {
      return adminUsersStore.filters.name.value;
    },
    set: (value) => {
      adminUsersStore.filters.name.value = value;
      adminUsersStore.filters.page.current = 1;
    }
  });

  const byRole = computed({
    get: () => {
      return adminUsersStore.filters.role.value;
    },
    set: (value) => {
      adminUsersStore.filters.role.value = value;
      adminUsersStore.filters.page.current = 1;
    }
  });

  onMounted(() => {
    invoke();
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'admin-users') {
      adminUsersStore.$reset();
    }
  });

  onUnmounted(() => {
    adminUsersStore.reset();
  });

  const invoke = () => {
    adminUsersStore.invoke({
      onUpdateRoute({query}) {
      },
      onFetch({query, user}) {
        return adminUsersStore.fetch();
      }
    });
  };

  const dir = (name) => {
    const {by, dir} = adminUsersStore.filters.order;
    if (by === name) {
      return dir === 'desc' ? 2 : 1;
    }
    return 0;
  };

  const onPage = (page) => {
    adminUsersStore.filters.page.current = page;
  };

  const onShowMore = (page) => {
    adminUsersStore.filters.page.append = true;
    adminUsersStore.filters.page.current = page;
  };

  const acceptById = () => {
    adminUsersStore.filters.id.accepted = adminUsersStore.filters.id.value;
  };

  const acceptByName = () => {
    adminUsersStore.filters.name.accepted = adminUsersStore.filters.name.value;
  };

  const setSorter = (name) => {
    if (adminUsersStore.filters.order.by === name) {
      adminUsersStore.filters.order.dir = adminUsersStore.filters.order.dir === 'desc'
        ? 'asc'
        : 'desc';
    } else {
      adminUsersStore.filters.order.by = name;
      adminUsersStore.filters.order.dir = 'asc';
    }
  };

  const showRolesModal = (user) => {
    let rolesForUserIsChange = false;

    eventBus.emit('alert:show', {
      title: user.name,
      contentComponent: 'helperAlertContentAdministrateUserRoles',
      maxWidth: '560px',
      hideAllButtons: true,
      additionalData: user,
      onHidden() {
        if (rolesForUserIsChange) {
          adminUsersStore.fetch();

          if (usersStore.entity.id === user.id) {
            usersStore.fetchUser();
          }
        }
      },
      onRoleChange() {
        rolesForUserIsChange = true;
      }
    });
  };

  await useAsyncData('admin-users', () => Promise.all([
    adminUsersStore.fetch({resetBefore: true})
  ]));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-users {
    &-filters {
      position: relative;

      &-roles {
        display: grid;
        grid-template-columns: max-content 30%;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      &-info {
        margin-top: 1.5rem;
      }

      &-sub {
        display: grid;
        grid-template-columns: max-content max-content minmax(150px, 150px) minmax(200px, 300px);
        gap: 2rem;
        align-items: center;
      }
    }

    &-table {
      position: relative;

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

        &-cell {
          cursor: pointer;
          transition: $transition;

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
      min-height: 10rem;

      &-loader {
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        margin-left: -2px;
        margin-top: -2px;

        --loader-padding-bottom: 30%;
      }
    }
  }

  .admin-link:hover {
    cursor: pointer;
    color: #0576ff;
  }
</style>
