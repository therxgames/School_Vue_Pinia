<template>
  <div
    class="task-dropdown"
    data-bs-toggle="dropdown"
    data-bs-offset="0,5">
    <svg-icon
      class="task-dropdown-icon"
      name="menu-dotted"/>
    <div class="dropdown-menu animation slide-in shadow">
      <div
        @click="showTaskAbout"
        class="dropdown-item">
        О задании
      </div>
      <div
        @click="showAnswersHistory"
        v-if="props.data.versions_has_answers && userStore.logged"
        class="dropdown-item">
        История ответов
      </div>
      <div class="dropdown-divider"/>
      <div
        class="dropdown-item"
        @click="print">
        Распечатать задание
      </div>
      <nuxt-link
        :to="supportLink"
        @click="toSupport()"
        class="dropdown-item">
        Сообщить о проблеме
      </nuxt-link>
      <nuxt-link
        v-if="userStore.userIsAdmin || userStore.userIsCOSUser"
        :to="settingsLink"
        @click="toSettings"
        class="dropdown-item">
        Свойства
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const props = defineProps({
    data: {
      type: Object,
      required: true
    },
    context: {
      type: Object,
      required: true
    }
  });
  const userStore = useUserStore();
  const router = useRouter();
  const supportLink = computed(() => `/support/task-${props.data.id}`);
  const settingsLink = computed(() => `/task-settings/${props.data.id}`);

  const toSupport = () => router.push(supportLink.value);
  const toSettings = () => router.push(settingsLink.value);
  const showAnswersHistory = () => {
    eventBus.emit('alert:show', {
      title: 'История ответов',
      contentComponent: 'helperAlertContentTaskAnswersHistory',
      maxWidth: '800px',
      hideAllButtons: true,
      additionalData: {...props.data}
    });
  };
  const showTaskAbout = () => {
    eventBus.emit('alert:show', {
      title: 'О задании',
      contentComponent: 'helperAlertContentTaskAbout',
      maxWidth: '530px',
      hideAllButtons: true,
      additionalData: {...props.data}
    });
  };
  const print = () => {
    printTask(props.data.parent_id);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .task-dropdown {
    transition: $transition;
    opacity: 0;
    pointer-events: none;
    width: 1.75rem;
    height: 1.75rem;
    background: #fff;
    padding: 0.4rem;
    border-radius: 0.35rem;
    z-index: 10;
    cursor: pointer;

    &-icon {
      cursor: pointer;
      width: auto;
      height: 100%;
    }
  }
</style>
