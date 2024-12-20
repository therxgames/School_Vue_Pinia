<template>
  <div
    :class="classes"
    class="test-row">
    <div class="test-row-content">
      <div
        @click="emit('favorite', getContext())"
        :class="[{'test-row-favorite--disabled': !userStore.logged || userStore.currentRole === 'user'}]"
        class="test-row-favorite">
        <svg-icon
          class="test-row-favorite-icon"
          name="star-filled"/>
      </div>
      <div class="test-row-tag">
        <svg-icon
          class="test-row-tag-icon"
          name="tag"/>
        <span>{{ props.data.parent_id || props.data.id }}</span>
      </div>
      <div class="test-row-title">
        <div
          v-tooltip="{title: 'Мой тест'}"
          v-if="props.data.is_mine && props.options.showIsMine !== false"
          class="test-row-title-mine-test">
          <svg-icon
            class="test-row-title-mine-test-icon"
            name="person"/>
        </div>
        <div
          v-if="props.data.is_new && !props.data.in_archive && userStore.userIsStudent"
          class="test-row-feature-new">
          Новое
        </div>
        <div
          v-tooltip="{title: 'Тест находится в архиве'}"
          v-if="props.data.in_archive && props.options.showInArchive"
          class="test-row-title-in-archive">
          <svg-icon
            class="test-row-title-in-archive-icon"
            name="archive-tint"/>
        </div>
        <h3
          class="test-row-title-name mb-0"
          v-html="props.data.name || lexicon.common.no_title"/>
      </div>
      <div class="test-row-content-type">
        тест
      </div>
      <div class="test-row-subject">
        <span>{{ props.data.parallel_id || props.data.class }} кл</span>
        <span class="test-row-subject-dot"/>
        <span class="test-row-subject-name">{{ props.data.subject }}</span>
      </div>
      <div class="test-row-views-col">
        <span
          v-tooltip="viewTpOpts"
          class="test-row-view">
          <svg-icon name="persons"/>
          <span class="test-row-view-count">
            {{ props.data.solutions_count || 0 }}
          </span>
        </span>
      </div>
      <div class="test-row-type">
        {{ attestationToName(props.data.attestation) }}
      </div>
      <div class="test-row-progress-col">
        <div
          v-if="passingStatus.isFinished"
          ref="statusFinished"
          class="test-row-status-finished">
          <div
            :class="['test-row-status-finished-mark--' + passingStatus.finishedMark]"
            class="test-row-status-finished-progress">
            {{ passingStatus.finishedScore }}
          </div>
          <div class="test-row-status-finished-count">
            {{ props.data.tasks_count }}
            {{ declension(props.data.tasks_count, lexicon.decl.tasks) }}
          </div>
        </div>
        <div
          v-else-if="passingStatus.isContinue"
          ref="statusContinue"
          class="test-row-status-continue">
          <div
            v-tooltip="statusContinueTpOpts"
            class="test-row-status-continue-steps">
            {{ passingStatus.answeredCount }} <span>из {{ props.data.tasks_count }}</span>
          </div>
          <div class="test-row-status-continue-scale">
            <div class="test-row-status-continue-scale-progress"/>
          </div>
        </div>
        <div
          v-else-if="passingStatus.isStart || passingStatus.isUnavailable"
          ref="statusStart"
          class="test-row-status-start">
          <div class="test-row-status-start-count">
            {{ props.data.tasks_count }}
            {{ declension(props.data.tasks_count, lexicon.decl.tasks) }}
          </div>
        </div>
      </div>
      <div class="test-row-actions">
        <div
          v-if="passingStatus.isContinue"
          @click="testMenu.goContinue"
          class="btn btn-primary test-row-btn-action">
          Продолжить
        </div>
        <div
          v-else-if="passingStatus.isFinished"
          @click="testMenu.goRetake"
          class="btn btn-simple test-row-btn-action">
          Пройти заново
        </div>
        <div
          v-else-if="passingStatus.isStart"
          @click="testMenu.goStart"
          class="btn btn-primary test-row-btn-action">
          Начать тест
        </div>
        <div
          v-else-if="passingStatus.isUnavailable"
          class="btn btn-simple disabled test-row-btn-action">
          Недоступно
        </div>
        <common-test-menu
          ref="testMenu"
          :data="props.data"
          :context="getContext()"/>
      </div>
    </div>
    <nuxt-link
      class="test-row-link"
      v-spec-title="linkTitle"
      :to="link"/>
    <loader
      class="test-row-loader"
      :listener="progress"/>
  </div>
  <div
    v-if="props.data.delimiterAfter"
    :data-break-page="props.data.page"
    class="delimiter test-row-delimiter">
    <span>{{ props.data.page }}</span>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import gsap from 'gsap';

  const router = useRouter();
  const emit = defineEmits(['favorite', 'archive', 'collection', 'about']);
  const props = defineProps({
    data: {
      type: Object,
      require: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  });
  const userStore = useUserStore();
  const progress = ref(false);
  const statusFinished = ref(null);
  const statusContinue = ref(null);
  const testMenu = ref(null);
  const link = computed(() => `/test/${props.data.id}`);
  const viewTpOpts = computed(() => ({
    title: () => `<span class="text-nowrap">
                    Тест
                    ${declension(props.data.solutions_count, lexicon.decl.passed)}
                    ${props.data.solutions_count} ${declension(props.data.solutions_count, lexicon.decl.peoples)}
                  </span>`
  }));
  const statusContinueTpOpts = computed(() => ({
    title: () => `Приостановлено: ${formatDate(props.data.last_action_at)}`
  }));
  const passingStatus = computed(() => passingTestStatus(props.data));
  const showFavorite = computed(() => {
    return userStore.logged && userStore.currentRole === 'student';
  });
  const classes = computed(() => {
    return [
      {'test-row--in-favorite': props.data.is_favorite && showFavorite.value},
      {'test-row--no-favorite': !showFavorite.value}
    ];
  });
  const linkTitle = computed(() => {
    return props.data.name + (props.data.year ? ' ' + props.data.year + ' г.' : '');
  });

  onMounted(() => {
    animatePassingStatus();
  });
  onUpdated(() => {
    animatePassingStatus();
  });

  const animatePassingStatus = async () => {
    await nextTick();

    if (passingStatus.value.id === passingTestStatusId.CONTINUE) {
      const valueEl = statusContinue.value.querySelector('.test-row-status-continue-scale-progress');
      gsap.to(valueEl, {
        width: `${passingStatus.value.progress}%`,
        duration: 1,
        ease: 'power2.out'
      });
    }
  };
  const setProgress = async (_progress, delay = 0) => {
    await sleep(delay);
    progress.value = _progress;
  };
  const getContext = () => {
    return {
      setProgress,
      data: props.data
    };
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .test-row {
    position: relative;
    padding: 0.75rem 1rem;
    transition: $transition;
    border-radius: 1rem;

    &:hover {
      background: $color-black-10;
      z-index: 20;
    }

    &:hover .test-dropdown {
      opacity: 1;
      pointer-events: auto;
    }

    &-content {
      display: grid;
      grid-template-columns:
        minmax(28px, 28px)
        minmax(65px, 65px)
        minmax(400px, 495px)
        minmax(150px, 155px)
        minmax(65px, 75px)
        minmax(40px, 45px)
        minmax(140px, 140px)
        auto;
      gap: 0.7rem;
      align-items: center;
    }

    &-favorite {
      position: relative;
      cursor: pointer;
      z-index: 10;

      &-icon {
        width: 1.75rem;
        height: 1.75rem;
        padding: 0.3rem;
      }
    }

    &-favorite--disabled {
      opacity: 0.2;
      pointer-events: none;
    }

    &-tag {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
    }

    &-tag-icon {
      width: 0.75rem;
      height: 0.75rem;
    }

    &-title {
      display: flex;
      align-items: center;
      gap: 0.6em;

      &-in-archive {
        width: 1.75rem;
        height: 1.75rem;
        padding: 0.25rem;
        border-radius: 0.35rem;
        display: flex;
        position: relative;
        z-index: 10;
        cursor: pointer;

        &-icon {
          color: $color-dark;
          width: 100%;
        }
      }

      &-name {
        font-size: 1rem;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 2.3rem;
      }

      &-mine-test {
        width: 1.8rem;
        height: 1.8rem;
        background: #fff;
        padding: 0.4rem;
        border-radius: 0.35rem;
        border: 1px solid #ededed;

        &-icon {
          color: $color-dark;
          width: 100%;
          height: 100%;
        }
      }
    }

    &-subject {
      font-size: 0.875rem;
      color: $color-dark;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      white-space: nowrap;

      &-name {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-subject-dot {
      width: 2px;
      height: 2px;
      border-radius: 10px;
      display: inline-block;
      background: $color-black;
    }

    &-views-col {
      position: relative;
      color: $color-dark;
      font-size: 0.875rem;
      cursor: pointer;
      z-index: 10;
    }

    &-views-col:hover &-view-count {
      color: $color-black;
    }

    &-view {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      vertical-align: middle;
    }

    &-type {
      color: $color-dark;
      font-size: 0.875rem;
    }

    &-actions {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-end;
      font-size: 0.875rem;
      z-index: 10;
    }

    &-actions-menu {
      opacity: 0;
      transition: $transition;
    }

    &-actions-btn {
      background: #fff;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid $color-dark-light;
    }

    &-actions-btn-icon {
      width: 0.813rem;
      height: 0.188rem;
      pointer-events: none;
    }

    &-progress-col {
      font-size: 0.875rem;
    }

    &-status-finished {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &-progress {
        font-weight: 500;
        padding: 0.2rem 0.6rem;
        border-radius: 0.4rem;
        font-size: 0.875rem;
        text-align: center;
        color: #fff;

        &::after {
          content: '%';
        }

        &.test-row-status-finished-mark--s {
          background: #b7b7b7;
        }

        &.test-row-status-finished-mark--f {
          background: #f87342;
        }

        &.test-row-status-finished-mark--c {
          background: $color-yellow-normal;
        }

        &.test-row-status-finished-mark--a {
          background: $color-green-normal;
        }
      }
    }

    &-status-continue {
      width: 100%;

      &-steps {
        margin-bottom: 0.5rem;
        display: inline-flex;
        position: relative;
        gap: 0.3rem;
        z-index: 10;
        cursor: pointer;

        span {
          color: $color-dark;
        }
      }

      &-scale {
        height: 4px;
        border-radius: 4px;
        background: $color-dark-light;

        div {
          border-radius: 4px;
          background: $color-green-normal;
          height: 100%;
          width: 0;
          transition: width 300ms ease-out;
        }
      }
    }

    &-status-start {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-feature-new {
      background: #9747ff;
      font-size: 0.875rem;
      color: #fff;
      padding: 0.45rem 0.6rem;
      border-radius: 0.375rem;
      line-height: 1;
      margin-bottom: -0.45rem;
      transform: translateY(-0.3rem);
    }

    &-btn-action {
      --bs-btn-padding-y: 0.48rem;

      white-space: nowrap;
      font-size: 0.875rem;
      width: 140px;
    }

    &-content-type {
      display: none;
      color: $color-dark;
      font-size: 0.875rem;
    }

    &-loader {
      --loader-spinner-width: 2rem;
      --loader-spinner-height: 2rem;
      --loader-max-opacity: 0.8;
      --loader-min-height: none;
    }

    &--in-favorite &-favorite {
      color: $color-yellow-normal;
      background: #fff;
      border-radius: 0.375rem;

      &-icon path {
        opacity: 1 !important;
      }
    }

    &-link {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 5;
    }

    &-delimiter {
      grid-column: 1/6;
      height: 1px;
      background: $color-dark-light;
      margin: 0 0.5rem;
      position: relative;
      display: none;

      span {
        color: $color-dark-light;
        background: #fff;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 0.5rem;
        font-size: 0.8rem;
      }
    }

    .test-dropdown {
      width: 2.29rem;
      height: 2.29rem;
      padding: 0.6rem;
      border: 1px solid #e7e7e7;
    }

    &.test-row--no-favorite {
      .test-row-favorite {
        display: none;
      }

      .test-row-content {
        grid-template-columns:
          minmax(55px, 55px)
          minmax(580px, 600px)
          minmax(150px, 155px)
          minmax(60px, 65px)
          minmax(40px, 40px)
          minmax(120px, 120px)
          auto;
      }
    }
  }
</style>
