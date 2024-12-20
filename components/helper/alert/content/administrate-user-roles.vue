<template>
  <div class="ac-user-roles">
    <div class="ac-user-roles-list">
      <div
        v-for="(role, index) in rolesList"
        :key="index"
        class="ac-user-roles-list-item">
        <input-checkbox
          :label="role.description"
          :id="'role-' + generateString()"
          :value="role"
          :checked="roleChecked(role)"
          :disabled="!changeAllow(role)"
          v-model:checked="rolesSetter"/>
      </div>
    </div>
    <div class="ac-user-roles-footer d-none">
      <div
        :class="[{'disabled': !userRoles.length}]"
        @click="save"
        class="btn btn-primary ac-user-roles-footer-save-btn">
        Сохранить
      </div>
      <div
        @click="hide"
        class="btn btn-outline-primary">
        Отмена
      </div>
    </div>
  </div>
</template>

<script setup>
  import useAdminUsersStore from '~/stores/admin-users';
  import useUserStore from '~/stores/user';

  const props = defineProps(alertContentProps());
  const emit = defineEmits(['event']);
  const adminUsersStore = useAdminUsersStore();
  const usersStore = useUserStore();
  const userRoles = ref([]);
  const userRolesHasBeenChanged = ref(false);
  const roleChecked = computed(() => (role) => {
    return userRoles.value.find((_role) => _role.role_id === role.id) !== undefined;
  });
  const rolesSetter = computed({
    get: () => {},
    set: ({value, checked, $event}) => {
      if (checked) {
        userRoles.value.push({
          name: value.name,
          role_id: value.id,
          user_id: props.data.id,
          description: value.description
        });
        addRole(value);
      } else {
        const index = userRoles.value.findIndex((role) => role.role_id === value.id);
        index > -1 ? userRoles.value.splice(index, 1) : false;
        deleteRole(value);
      }
    }
  });

  onMounted(async () => {
    await getUserRoles();
    watch(
      () => userRoles.value,
      () => {
        emit('event', {
          type: 'onRoleChange',
          data: userRoles.value
        });
        userRolesHasBeenChanged.value = true;
      },
      {deep: true}
    );
  });

  const getUserRoles = async () => {
    props.context.setProgress(true);
    const response = await adminUsersStore.getUserRole(props.data.id);
    userRoles.value = response.user_roles;
    props.context.setProgress(false, 150);
  };
  const changeAllow = (role) => {
    return !(usersStore.entity.id === props.data.id && role.name === 'admin') && role.name !== 'student';
  };
  const addRole = (role) => {
    props.context.setProgress(true);
    const added = adminUsersStore.addRole(props.data.id, role.id);
    if (added) {
      eventBus.emit('toast:show', {text: `Роль «${role.description}» добавлена`});
    }
    props.context.setProgress(false);
  };
  const deleteRole = (role) => {
    props.context.setProgress(true);
    const deleted = adminUsersStore.deleteRole(props.data.id, role.id);
    if (deleted) {
      eventBus.emit('toast:show', {text: `Роль «${role.description}» отменена`});
    }
    props.context.setProgress(false);
  };
  const hide = () => {
    props.context.hide();
  };
  const save = async () => {
    props.context.setProgress(true);
    if (userRolesHasBeenChanged.value) {
      await usersStore.fetchUser();
    }
    props.context.setProgress(false);
    props.context.hide();
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-user-roles {
    &-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &-footer {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      margin-bottom: -1rem;

      &-save-btn {
        &.disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      }
    }
  }
</style>
