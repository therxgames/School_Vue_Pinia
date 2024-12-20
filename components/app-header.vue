<template>
  <header
    :class="[{'app-header--search': searchToggle}]"
    class="app-header">
    <div class="content-container app-header-grid">
      <nuxt-link
        to="/"
        aria-label="Моя школа">
        <logo/>
      </nuxt-link>
      <div class="app-header-main-nav">
        <nuxt-link
          class="app-header-main-nav-link"
          to="/library/tasks">
          Банк заданий
        </nuxt-link>
        <nuxt-link
          class="app-header-main-nav-link"
          to="/library">
          Библиотека
        </nuxt-link>
        <nuxt-link
          class="app-header-main-nav-link"
          to="/training">
          Подготовка
        </nuxt-link>
        <nuxt-link
          v-if="userStore.currentRole === 'student'"
          class="app-header-main-nav-link"
          to="/results">
          Достижения
        </nuxt-link>
        <nuxt-link
          v-if="userStore.currentRole !== 'admin'"
          class="app-header-main-nav-link"
          to="/calendar">
          Календарь
        </nuxt-link>
        <nuxt-link
          v-if="userStore.logged
            && userStore.currentRole !== 'admin'
            && userStore.currentRole !== 'user'"
          class="app-header-main-nav-link"
          to="/favorite">
          Избранное
        </nuxt-link>
        <nuxt-link
          v-if="userStore.userIsAdmin || userStore.userIsCOSUser"
          to="/admin"
          class="app-header-main-nav-link">
          Администрирование
        </nuxt-link>
      </div>
      <div class="app-header-user-nav">
        <div class="app-header-user-menu">
          <div
            @click="toggleSearch"
            class="app-header-user-menu-search"
            v-if="!isSearchPath"
          >
            <svg-icon
              class="app-header-user-menu-search-btn"
              name="search"/>
          </div>
          <div
            ref="headerSearchForm"
            class="app-header-user-menu-search-form">
            <input-search
              ref="headerInputSearch"
              :min-length="2"
              v-model:value="searchString"
              @search="onSearch"/>
          </div>
        </div>
        <div class="app-header-user-profile">
          <div
            v-if="!userStore.logged"
            class="dropdown app-header-user-profile-login">
            <div
              data-bs-toggle="dropdown"
              data-bs-offset="0,2"
              class="btn btn-primary app-header-user-profile-login-btn">
              <span>Войти</span>
            </div>
            <div class="dropdown-menu dropdown-menu-end animation slide-in">
              <nuxt-link
                to="/auth/etd/login"
                @click="loginWithEtd()"
                class="dropdown-item">
                <div class="app-header-user-profile-login-mtd">
                  <svg-icon
                    class="icon"
                    name="ms"/>
                  Вход через Мою школу
                </div>
              </nuxt-link>
              <div class="app-header-user-profile-login-dlm"/>
              <nuxt-link
                to="/auth/vk/login"
                @click="loginWithVk()"
                class="dropdown-item">
                <div class="app-header-user-profile-login-mtd">
                  <svg-icon
                    class="icon"
                    name="vk-sq"/>
                  Вход через VK
                </div>
              </nuxt-link>
            </div>
          </div>
          <div
            v-if="userStore.logged"
            class="dropdown app-header-user-profile-logged">
            <div
              data-bs-toggle="dropdown"
              data-bs-offset="-10,10"
              class="app-header-user-profile-logged-container">
              <div
                :class="['app-header-user-profile-avatar-bg-' + userStore.currentRole]"
                class="app-header-user-profile-avatar">
                <svg-icon
                  v-if="userStore.authSource === 'vk_id'"
                  class="app-header-user-profile-login-method"
                  name="vk"/>
                <svg-icon
                  v-if="userStore.authSource === 'etd'"
                  class="app-header-user-profile-login-method"
                  name="etd"/>
                {{ userStore.nameInitials }}
              </div>
              <div class="app-header-user-profile-credentials">
                <div class="app-header-user-profile-credentials-name">
                  {{ userStore.maskedFullName }}
                </div>
                <div class="app-header-user-profile-credentials-role">
                  {{ roleToName(userStore.currentRole) || 'Нет роли' }}
                </div>
              </div>
            </div>
            <div
              id="profile-dropdown"
              class="dropdown-menu animation slide-in">
              <template v-if="userStore.authSource">
                <a class="dropdown-item dropdown-item-login-mtd-title">
                  Вы вошли через
                </a>
                <a
                  v-if="userStore.authSource === authSource.ETD"
                  target="_blank"
                  :href="eduProfileLink"
                  class="dropdown-item dropdown-item-etd-profile">
                  <svg-icon
                    class="dropdown-item-etd-profile-icon"
                    name="ms"/>
                  <span>Моя школа</span>
                </a>
                <a
                  v-if="userStore.authSource === authSource.VK_ID"
                  target="_blank"
                  :href="vkProfileLink"
                  class="dropdown-item dropdown-item-vk-profile">
                  <svg-icon
                    class="dropdown-item-vk-profile-icon"
                    name="vk-sq"/>
                  <span>VK ID <span class="color-dark">(профиль)</span></span>
                </a>
                <div class="dropdown-divider"/>
              </template>
              <div
                v-if="userStore.hasDifferentRoles"
                @click="modalRoleInfo.show()"
                class="dropdown-item">
                Сменить роль
              </div>
              <div
                @click="logout()"
                class="dropdown-item">
                Выйти
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import {onClickOutside} from '@vueuse/core';
import useUserStore from '~/stores/user';
import useSearchStore from '~/stores/search';

const props = defineProps({
  modalRoleInfo: {}
});

const userStore = useUserStore();
const searchStore = useSearchStore();
const router = useRouter();
const searchToggle = ref(false);
const headerSearchForm = ref(null);
const headerInputSearch = ref(null);
const searchString = ref('');
const eduProfileLink = computed(() => {
  return `https://login.myschool.edu.ru/auth/realms/etd-realm/protocol/openid-connect/auth?response_type=code&client_id=1&scope=openid&redirect_uri=https://myschool.edu.ru`;
});
const vkProfileLink = computed(() => {
  return `https://id.vk.com/account`;
});
let hideSearchFormAllow = false;

const isSearchPath = router.currentRoute.value.path === '/search'

watch(
  () => searchToggle.value,
  async (toggle) => {
    await sleep(150);
    hideSearchFormAllow = true;
    toggle && headerInputSearch.value
      ? headerInputSearch.value.focus()
      : headerInputSearch.value.blur();
  }
);

onMounted(() => {
  onClickOutside(headerSearchForm.value, headerSearchFormOnClickOutside);

  if (userStore.shouldShowRoleInfoModal()) {
    modalRoleInfo.value.show();
  }
});

const onSearch = (q) => {
  if (!q) {
    searchToggle.value = !searchToggle.value;
    return;
  }

  searchStore.setFilterValue('q', searchString.value, {withAccepted: true});
  router.push({
    name: 'search',
    query: {
      q: searchString.value,
      content: 'material_library',
      ...['training'].includes(useRoute().name) ? {content: 'tests'} : null,
      ...['library-tasks', 'library-subjects'].includes(useRoute().name) ? {content: 'tasks'} : null
    }
  }).catch(() => null);
};
const headerSearchFormOnClickOutside = () => {
  if (!hideSearchFormAllow) {
    return;
  }

  searchToggle.value = false;
  hideSearchFormAllow = false;
};
const loginWithEtd = () => router.push('/auth/etd/login');
const loginWithVk = () => router.push('/auth/vk/login');
const logout = () => router.push('/auth/logout');
const toggleSearch = () => {
  searchToggle.value = !searchToggle.value;
};
</script>

<style lang="scss">
@import '/assets/scss/theme';

.app-header {
  background: #fff;
  min-height: 4.188rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  border-bottom: 1px solid rgb(243 243 241/1);
  z-index: 502;

  &-grid {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
  }

  &-main-nav {
    display: flex;
    justify-content: center;

    &-link {
      color: $color-black;
      cursor: pointer;
      transition: all 150ms linear;
      font-size: 0.938rem;
      padding: 0.675rem 1rem;
      border-radius: $border-radius;

      &:hover {
        color: $color-black;
        background: $color-black-10;
      }
    }
  }

  &-user-nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &-user-menu {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding-right: 1rem;

    &-search {
      transition: $transition;
      position: relative;
      width: 3rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;
      cursor: pointer;

      &:hover {
        background: $color-blue-light-10;
      }

      &-btn {
        width: 32px;
        height: 32px;
        color: #0D0C0C;
      }
    }

    &-search-form {
      opacity: 0;
      pointer-events: none;
      position: absolute;
      width: 480px;
    }
  }

  &-user-profile {
    position: relative;

    &-login {
      .dropdown-menu {
        box-shadow: 0 0.3rem 2rem rgb(12 21 36 / 0.1);
        width: 350px;
        padding: 1.5rem;
        gap: 0.65rem;
      }

      .dropdown-item {
        display: flex;
        gap: 0.7rem;
        align-items: center;
        padding: 0;
        margin: 0;
        background: #fff !important;
      }

      &-mtd {
        border: 1px solid $color-normal;
        padding: 0.95rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-radius: 1rem;
        width: 100%;
        transition: $transition;

        .icon {
          width: 2rem;
          height: 2rem;
          margin: 0;
        }

        &:hover {
          background: #f1f1f1;
        }
      }

      &-dlm {
        width: 100%;
        height: 0.65rem;
      }
    }

    &-logged {
      .dropdown-menu {
        box-shadow: 0 0.3rem 2rem rgb(12 21 36 / 0.1);
      }

      .dropdown-item-etd-profile,
      .dropdown-item-vk-profile {
        display: flex;
        gap: 0.3rem;
        align-items: center;

        .dropdown-item-etd-profile-icon,
        .dropdown-item-vk-profile-icon {
          width: 1.25rem;
          height: 1.25rem;
        }
      }

      .dropdown-item {
        --bs-dropdown-item-padding-x: 1.5rem;
        --bs-dropdown-item-padding-y: 1rem;
      }

      .dropdown-item-login-mtd-title {
        --bs-dropdown-item-padding-x: 1.5rem;
        --bs-dropdown-item-padding-y: 0.3rem;

        font-size: 0.875rem;
        color: $color-dark;
        margin-top: 0.3rem;
        pointer-events: none;
        user-select: none;
      }

      &-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        cursor: pointer;
        user-select: none;
      }
    }

    &-avatar {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 100%;
      overflow: hidden;
      background: #ececec;
      background-size: 100% 100%;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 1rem;
      color: #fff;
    }

    &-avatar-bg-student {
      background: linear-gradient(180deg, #0576ff 0%, #059fff 100%);
    }

    &-avatar-bg-user {
      background: linear-gradient(180deg, #2bb437 0%, #67cc45 100%);
    }

    &-avatar-bg-admin {
      background: linear-gradient(180deg, #f8402a 0%, #f86c5c 100%);
    }

    &-credentials {
      line-height: 1.25rem;

      &-name {
        white-space: nowrap;
        max-width: 10rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &-role {
        white-space: nowrap;
        color: $color-dark;
        user-select: none;

        &::first-letter {
          text-transform: uppercase;
        }
      }
    }

    &-login-method {
      height: 1.3rem;
      position: absolute;
      width: 1.3rem;
      z-index: 5;
      border-radius: 100%;
      border: 2px solid #fff;
      left: -5px;
      top: -3px;
    }
  }

  &--search &-user-menu-search {
    opacity: 0;
  }

  &--search &-user-menu-search-form {
    z-index: 10;
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
