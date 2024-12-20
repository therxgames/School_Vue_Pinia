<template>
  <div
    ref="modal"
    class="modal fade common-modal-role-info">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Подтверждение входа
          </h5>
          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            <svg-icon name="cross"/>
          </div>
        </div>
        <div class="modal-body">
          <div class="common-modal-role-info-intro">
            Вы вошли под профилем <b>«{{ roleToName(userStore.currentRole) }}»</b>
          </div>
          <template v-if="userStore.hasDifferentRoles">
            <div class="mt-3 mb-2 icon-text">
              <svg-icon name="person"/>
              Выбрать другую роль
            </div>
            <div class="common-modal-role-info-input-select">
              <input-select-single
                placeholder="Роль"
                :list="rolesForSelect(userStore.allowedRoles)"
                v-model:value="selectedRole"/>
            </div>
          </template>
          <div
            v-if="error"
            class="common-modal-role-info-error">
            {{ error }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="selectedRole"
            @click="switchRole()"
            type="button"
            class="btn btn-primary">
            Войти как <b>{{ roleToName(selectedRole) }}</b>
          </button>
          <button
            v-if="!selectedRole"
            data-bs-dismiss="modal"
            type="button"
            class="btn btn-primary">
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
  import useUserStore from '~/stores/user';

  const userStore = useUserStore();
  const modal = ref(null);
  const selectedRole = ref(null);
  const progress = ref(false);
  const error = ref('');
  let modalInst = null;

  const rolesForSelect = computed(() => (roles) => {
    if (!Array.isArray(roles)) {
      return [];
    }
    return [...roles].map((roleItem) => ({
      name: roleToName(roleItem),
      id: roleItem
    }));
  });

  onMounted(() => {
    const $bootstrap = inject('$bootstrap');
    modalInst = new $bootstrap.Modal(modal.value);
  });
  onUnmounted(() => {
    if (modalInst) {
      modalInst.hide();
    }
  });

  const show = () => {
    error.value = null;
    selectedRole.value = null;
    modalInst.show();
  };
  const hide = () => modalInst.hide();
  const switchRole = async () => {
    if (!selectedRole.value) {
      return;
    }

    progress.value = true;

    const response = await userStore.switchRole(selectedRole.value);

    if (response.status > 200) {
      error.value = response._data?.error || 'Неизвестная ошибка';
    } else {
      hide();
    }

    progress.value = false;
  };

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '/assets/scss/theme';

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
