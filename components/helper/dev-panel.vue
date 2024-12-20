<template>
  <div
    ref="devPanel"
    class="dev-panel">
    <div
      ref="dropdownBtn"
      class="dropdown dev-panel-dropdown">
      <svg-icon
        data-bs-toggle="dropdown"
        data-bs-offset="0,5"
        data-bs-auto-close="false"
        name="menu-dotted"
        class="dev-panel-dropdown-icon"/>
      <div class="dropdown-menu animation slide-in shadow">
        <div
          v-if="!userStore.logged"
          class="dropdown-item dev-panel-login-dropdown-item">
          <svg-icon name="persons"/>
          <div>Dev вход</div>
          <div
            @click="login"
            class="dev-panel-login-click-zone"/>
          <input
            @keyup.enter="login"
            ref="inputId"
            class="form-control"
            type="text"
            value="2"
            placeholder="ID">
          <input-select-single
            placeholder="Выбрать роль"
            :list="rolesList"
            v-model:value="selectedRole"/>
        </div>
        <div
          v-if="userStore.logged"
          @click="userStore.logoutWithId()"
          class="dropdown-item">
          Dev выход
        </div>
        <div
          v-if="userStore.currentRole === 'admin'"
          class="dropdown-divider"/>
        <div
          v-if="userStore.currentRole === 'admin'"
          @click="contentImport"
          class="dropdown-item d-flex">
          Импорт контента
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useCommonStore from '~/stores/common';
  import useUserStore from '~/stores/user';
  import {onClickOutside} from '@vueuse/core';

  const userStore = useUserStore();
  const inputId = ref(null);
  const dropdownBtn = ref(null);
  const devPanel = ref(null);
  const selectedRole = ref('student');
  const rolesList = [
    {
      name: 'Администратор',
      id: 'admin'
    },
    {
      name: 'Методист',
      id: 'user'
    },
    {
      name: 'Обучающийся',
      id: 'student'
    }
  ];
  let dropDownInst = null;

  onMounted(() => {
    dropDownInst = window.$bootstrap.Dropdown.getOrCreateInstance(dropdownBtn.value);
    onClickOutside(devPanel.value, () => dropDownInst.hide());
    defineConsoleCommands();
  });

  const login = async () => {
    dropDownInst.hide();
    await userStore.loginWithId(inputId.value?.value || 2, selectedRole.value || 'student');
  };
  const contentImport = async () => {
    dropDownInst.hide();
    eventBus.emit('loader:show');
    const response = await useApi('/api/content/reimport', {...methodPost});
    if (response.data.done) {
      document.location.reload();
    }
  };
  const defineConsoleCommands = () => {
    if (!userStore.userIsAdmin) {
      return;
    }

    window.admin = {
      createTaskVersion(id) {
        useCommonStore().createTaskVersion(id).then((response) => {
          if (response.data.done) {
            const {done, ...versionData} = response.data;
            console.log(`%c Версия создана`, 'color:#FFE84FFF;', versionData);
          }
        });
        return 'Ждите';
      },
      createTestVersion(id) {
        useCommonStore().createTestVersion(id).then((response) => {
          if (response.data.done) {
            const {done, ...versionData} = response.data;
            console.log(`%c Версия создана`, 'color:#FFE84FFF;', versionData);
          }
        });
        return 'Ждите';
      },
      importContent() {
        contentImport();
        return 'Ждите';
      }
    };
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .dev-panel {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 30;
    opacity: 0;
    transition: $transition;

    &:hover {
      opacity: 1;
    }

    &-dropdown-icon {
      color: $color-dark;
      cursor: pointer;
      margin: 0;
      width: 1.7rem;
      height: 1.7rem;
      background: #fff;
      padding: 0.3rem;
      border-radius: 0.3rem;
      border: 1px solid $color-black-10;
    }

    &-login-dropdown-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 1rem;

      input {
        position: relative;
        width: 5rem;
        z-index: 5;
      }

      &-input-role {
        width: 8rem !important;
      }
    }

    &-login-click-zone {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
</style>
