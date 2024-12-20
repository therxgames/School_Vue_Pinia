<template>
  <div
    ref="modal"
    class="modal modal-lg fade common-modal-role-info">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Настройка ролей пользователя {{ props.user.name }}
          </h5>
          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            <svg-icon name="cross"/>
          </div>
        </div>
        <div
          class="modal-body position-relative"
          v-if="store.rolesList && store.userRoles[props.user.id]">
          <loader
            :listener="store.isLoading.roleChange"/>
          <form
            class="form-check"
            v-for="role in store.rolesList.roles"
            :key="role.id">
            <input
              :disabled="role.id === 3"
              class="form-check-input"
              type="checkbox"
              :checked="selectedRole[role.id]"
              @change="onChangeRole(role.id, $event)"
              :id="`role-change-user-${props.user.id}-role-${role.id}`">
            <label
              class="form-check-label"
              :for="`role-change-user-${props.user.id}-role-${role.id}`">
              {{ role.description }}
            </label>
          </form>
          <div
            v-if="error"
            class="common-modal-role-info-error">
            {{ error }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="changeRole">
            Ок
          </button>
        </div>
        <loader
          class="common-modal-role-info-loader"
          :listener="progress"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useAdminUserStore from '~/stores/admin-users';

  const props = defineProps({
    user: Object
  });
  const store = useAdminUserStore();
  const modal = ref(null);
  const selectedRole = ref({});
  const progress = ref(false);
  const error = ref('');
  let modalInst = null;


  onMounted(() => {
    modalInst = new window.$bootstrap.Modal(modal.value);
  });
  onUnmounted(() => {
    if (modalInst) {
      modalInst.hide();
    }
  });

  const show = async () => {
    await store.getUserRole(props.user.id);
    store.userRoles[props.user.id].user_roles.forEach((role) => {
      selectedRole.value[role.role_id] = true;
    });
    error.value = null;
    modalInst.show();
  };

  const hide = () => modalInst.hide();

  const changeRole = () => {
    modalInst.hide();
  };

  const onChangeRole = (roleId, e) => {
    const value = e.target.checked;
    selectedRole.value[roleId] = value;
    value ? store.addRole(props.user.id, roleId) : store.deleteRole(props.user.id, roleId);
  };

  defineExpose({show, hide});
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/theme';

  .common-modal-role-info {
    b {
      font-weight: 500;
    }

    &-input-select {
      max-width: 15rem;
    }

    &-error {
      color: #df7272;
      font-size: 0.85rem;
      margin-top: 0.8rem;
    }

    &-loader {
      border-radius: 0.5rem;

      --loader-max-opacity: 0.9;
      --loader-spinner-width: 2.5rem;
      --loader-spinner-height: 2.5rem;
    }
  }
</style>
