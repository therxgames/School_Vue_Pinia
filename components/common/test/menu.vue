<template>
  <div
    class="test-dropdown"
    data-bs-toggle="dropdown"
    data-bs-offset="0,5">
    <svg-icon
      class="test-tile-header-user-menu-icon"
      name="menu-dotted"/>
    <div class="dropdown-menu animation slide-in shadow">
      <div
        v-if="props.data.description_text"
        @click="about"
        class="dropdown-item">
        О тесте
      </div>
      <div
        v-if="props.data.in_archive"
        @click="emit('archive')"
        class="dropdown-item">
        Убрать из архива
      </div>
      <div
        v-if="!props.data.is_mine && props.data.type !== 'demovariant'"
        @click="emit('collection')"
        class="dropdown-item">
        Убрать из коллекции
      </div>
      <div
        class="dropdown-divider"
        v-if="!passingStatus.isUnavailable"/>
      <div
        v-if="passingStatus.isStart"
        @click="goStart"
        class="dropdown-item">
        Начать тест
      </div>
      <div
        v-if="passingStatus.isFinished"
        @click="goRetake"
        class="dropdown-item">
        Пройти заново
      </div>
      <div
        v-if="passingStatus.isContinue"
        @click="goContinue"
        class="dropdown-item">
        Продолжить
      </div>
      <div
        class="dropdown-divider"
        v-if="userStore.logged"/>
      <div
        v-if="attemptsExists"
        @click="showStatistic"
        class="dropdown-item">
        Статистика
      </div>
      <div
        class="dropdown-item"
        @click="print">
        Распечатать тест
      </div>
      <nuxt-link
        :to="supportLink"
        @click="toSupport()"
        class="dropdown-item">
        Сообщить о проблеме
      </nuxt-link>
      <nuxt-link
        v-if="props.data.type === 'demovariant' && (userStore.userIsAdmin || userStore.userIsCOSUser)"
        :to="settingsLink"
        @click="toSettings()"
        class="dropdown-item">
        Свойства
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import useCommonStore from '~/stores/common';

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
  const emit = defineEmits(['favorite', 'archive', 'collection', 'about']);
  const userStore = useUserStore();
  const router = useRouter();
  const localAttemptsExists = ref(false);
  const supportLink = computed(() => `/support/test-${props.data.id}`);
  const settingsLink = computed(() => `/test-settings/${props.data.id}`);
  const passingStatus = computed(() => passingTestStatus(props.data));
  const attemptsExists = computed(() => {
    return props.data.versions_has_attempts || localAttemptsExists;
  });

  onMounted(() => {
    localAttemptsExists.value = localServer.getAttempts({
      test_id: props.data.id
    })?.length > 0;
  });

  const toSupport = () => router.push(supportLink.value);
  const toSettings = () => router.push(settingsLink.value);
  const goContinue = () => {
    router.push(`/test/run/${props.data.id}`);
  };
  const goRetake = () => {
    showTestInstruction({
      control: false,
      showControl: true
    });
  };
  const goStart = async () => {
    showTestInstruction({
      control: false,
      showControl: true
    });
  };
  const startAndRunTest = async ({control}) => {
    const time = control ? passingTestDuration(props.data).seconds : 0;
    await useCommonStore().startTest({
      id: props.data.id,
      parent_id: props.data.parent_id,
      version: props.data.version,
      mode: control ? passingTestMode.CONTROL : passingTestMode.TRAINING,
      time
    });
    router.push(`/test/run/${props.data.id}`);
  };
  const showTestInstruction = ({control, showControl}) => {
    eventBus.emit('alert:show', {
      title: `Инструкция к тесту «${props.data.name}»`,
      contentComponent: 'helperAlertContentTestInstruction',
      maxWidth: '860px',
      hideAllButtons: true,
      additionalData: {
        ...props.data,
        ...{control, showControl}
      },
      onStart(event, context) {
        context.hide();
        startAndRunTest({control: event.data.control});
      }
    });
  };
  const print = () => {
    printTest(props.data.id);
  };
  const about = () => {
    eventBus.emit('alert:show', {
      title: `О тесте «${props.data.name}»`,
      contentComponent: 'helperAlertContentTestAbout',
      maxWidth: '660px',
      hideAllButtons: true,
      additionalData: {...props.data}
    });

    emit('about');
  };
  const getContext = () => {
    return {
      goContinue,
      goRetake,
      goStart
    };
  };
  const showStatistic = (context) => {
    eventBus.emit('alert:show', {
      title: 'Статистика',
      contentComponent: 'helperAlertContentTestAttempts',
      maxWidth: '795px',
      hideAllButtons: true,
      additionalData: {...props.data},

      onGoRetake(event, context) {
        goRetake();
        context.hide();
      }
    });
  };
  defineExpose(getContext());
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .test-dropdown {
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
