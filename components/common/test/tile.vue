<template>
  <div
    :class="classes"
    class="test-tile">
    <div class="test-tile-content">
      <div class="test-tile-header">
        <div class="test-tile-header-top">
          <div class="test-tile-header-top-left-col">
            <div class="test-tile-header-tag test-tile-unlink">
              <svg-icon
                class="test-tile-header-tag-icon"
                name="tag"/>
              <span>{{ props.data.parent_id || props.data.id }}</span>
            </div>
          </div>
          <div class="test-tile-header-top-right-col test-tile-unlink">
            <common-test-menu
              :data="props.data"
              :context="getContext()"
              @favorite="emit('favorite', getContext())"
              @archive="emit('archive', getContext())"
              @collection="emit('collection', getContext())"
              @about="emit('about', getContext())"/>
            <div
              v-tooltip="{title: 'Мой тест'}"
              v-if="props.data.is_mine && props.options.showIsMine !== false"
              class="test-tile-header-mine-test">
              <svg-icon
                class="test-tile-header-mine-test-icon"
                name="person"/>
            </div>
            <div
              v-tooltip="{title: 'Тест находится в архиве'}"
              v-if="props.data.in_archive && props.options.showInArchive"
              class="test-tile-header-in-archive">
              <svg-icon
                class="test-tile-header-mine-test-icon"
                name="archive-tint"/>
            </div>
            <div
              @click="emit('favorite', getContext())"
              class="test-tile-header-favorite-btn">
              <svg-icon
                class="test-tile-header-favorite-btn-icon"
                name="star-filled"/>
            </div>
          </div>
        </div>
        <div class="test-tile-header-title">
          <h3
            class="test-tile-title mb-0"
            v-html="props.data.name || lexicon.common.no_title"/>
          <div
            v-if="props.data.name.length > 20"
            class="test-tile-title-shadow"/>
        </div>
        <div class="test-tile-header-bottom">
          <div
            v-if="passingStatus.isFinished"
            ref="statusFinished"
            class="test-tile-status-finished">
            <div
              :class="['test-tile-status-finished-mark--' + passingStatus.finishedMark]"
              class="test-tile-status-finished-progress">
              {{ passingStatus.finishedScore }}
            </div>
            <div class="test-tile-status-finished-count">
              {{ props.data.tasks_count }}
              {{ declension(props.data.tasks_count, lexicon.decl.tasks) }}
            </div>
          </div>
          <div
            v-else-if="passingStatus.isContinue"
            ref="statusContinue"
            class="test-tile-status-continue">
            <div
              v-tooltip="statusContinueTpOpts"
              class="test-tile-status-continue-steps">
              {{ passingStatus.answeredCount }} <span>из {{ props.data.tasks_count }}</span>
            </div>
            <div class="test-tile-status-continue-scale">
              <div class="test-tile-status-continue-scale-progress"/>
            </div>
          </div>
          <div
            v-else-if="passingStatus.isStart || passingStatus.isUnavailable"
            ref="statusStart"
            class="test-tile-status-start">
            <div class="test-tile-status-start-count">
              {{ props.data.tasks_count }}
              {{ declension(props.data.tasks_count, lexicon.decl.tasks) }}
            </div>
            <div
              v-if="props.data.is_new && !props.data.in_archive && userStore.userIsStudent"
              class="test-tile-header-feature-new">
              Новое
            </div>
          </div>
        </div>
      </div>
      <div class="test-tile-footer mt-2">
        <div class="test-tile-footer-row">
          <span>{{ props.data.parallel_id || props.data.class }} кл</span>
          <span class="test-tile-footer-row-dot"/>
          <span>{{ props.data.subject }}</span>
        </div>
        <div class="test-tile-footer-row mt-1">
          <span>{{ attestationToName(props.data.attestation) }}</span>
          <span class="test-tile-footer-row-dot"/>
          <span
            v-tooltip="viewTpOpts"
            class="test-tile-footer-row-views">
            <svg-icon name="persons"/>
            <span class="test-tile-footer-row-views-count">
              {{ props.data.solutions_count || 0 }}
            </span>
          </span>
          <div
            v-if="props.options.showContentType"
            class="test-tile-footer-row-content-type">
            Тест
          </div>
        </div>
      </div>
      <nuxt-link
        class="test-tile-link"
        v-spec-title="linkTitle"
        :to="link"/>
    </div>
    <loader
      class="test-tile-loader"
      :listener="progress"/>
  </div>
  <div
    v-if="props.data.delimiterAfter"
    :data-break-page="props.data.page"
    class="delimiter test-tile-delimiter">
    <span>{{ props.data.page }}</span>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import gsap from 'gsap';

  const userStore = useUserStore();
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
  const progress = ref(false);
  const statusFinished = ref(null);
  const statusContinue = ref(null);
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
      {'test-tile--in-favorite': props.data.is_favorite && showFavorite.value},
      {'test-tile--no-favorite': !showFavorite.value},
      `test-tile--${props.data.subject_id}`
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

    if (passingStatus.value.id === passingTestStatusId.CONTINUE && statusContinue.value) {
      const valueEl = statusContinue.value.querySelector('.test-tile-status-continue-scale-progress');
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

  .test-tile {
    position: relative;
    cursor: pointer;

    &-unlink {
      z-index: 15;
    }

    &:hover &-content {
      border-color: $color-dark-light;
    }

    &:hover &-header {
      &-favorite-btn {
        opacity: 1;
      }

      .test-dropdown {
        opacity: 1;
        pointer-events: auto;
      }
    }

    &:hover &-footer {
      color: $color-black;
    }

    &-content {
      transition: $transition;
      border-radius: 0.8rem;
      padding: 0.5rem 0.5rem 1rem;
      border: 1px solid transparent;
    }

    &-header {
      display: grid;
      grid-template-rows: max-content minmax(120px, 133px) 1fr;
      gap: 0.5rem;
      background: $color-blue-light-10;
      padding: 0.675rem 0.75rem 0.875rem;
      min-height: 14.688rem;
      border-radius: $border-radius;
      position: relative;

      &-user-menu {
        transition: $transition;
        opacity: 0;
        pointer-events: none;
        width: 1.75rem;
        height: 1.75rem;
        background: #fff;
        padding: 0.4rem;
        border-radius: 0.35rem;

        &-icon {
          width: auto;
          height: 100%;
        }
      }

      &-favorite-btn {
        opacity: 0.1;
        transition: all 150ms linear;
        justify-self: flex-end;
        padding: 0.35rem;
        border-radius: 0.35rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;

        &-icon {
          width: 1.063rem;
          height: 1.063rem;
        }
      }

      &-favorite-btn--disabled {
        opacity: 0.1 !important;
        pointer-events: none;
      }

      &-mine-test {
        width: 1.75rem;
        height: 1.75rem;
        background: #fff;
        padding: 0.4rem;
        border-radius: 0.35rem;

        &-icon {
          color: $color-dark;
          width: 100%;
          height: 100%;
        }
      }

      &-in-archive {
        width: 1.75rem;
        height: 1.75rem;
        background: #fff;
        padding: 0.35rem;
        border-radius: 0.35rem;
        display: flex;

        &-icon {
          color: $color-dark;
          width: 100%;
        }
      }
    }

    &-header-top {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;

      &-left-col {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }

      &-right-col {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.25em;
      }
    }

    &-title {
      font-size: 1rem;
      line-height: 1.5;
      font-weight: 400;
    }

    &-header-tag {
      font-size: 0.875rem;
      color: $color-dark;
      display: flex;
      align-items: center;
    }

    &-header-tag-icon {
      width: 0.7rem;
    }

    span {
      padding: 0 0.2rem;
    }

    &-header-title {
      overflow: hidden;
      position: relative;
      user-select: none;
      padding-right: 1.5rem;
    }

    &-title-shadow {
      position: absolute;
      width: 100%;
      height: 3.2rem;
      bottom: 0;
      left: 0;
      z-index: 10;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(230, 242, 255, 0.5) 0%, #e6f2ff 100%);
    }

    &-footer {
      font-size: 0.875rem;
      color: $color-dark;
    }

    &-footer-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;

      &-content-type {
        border-radius: 0.375rem;
        background: #fff;
        font-size: 0.875rem;
        border: 1px solid #e1e1e1;
        padding: 0 0.5rem;
        margin-left: 0.2rem;
      }
    }

    &-footer-row-dot {
      width: 2px;
      height: 2px;
      border-radius: 10px;
      display: inline-block;
      background: currentcolor;
    }

    &-footer-row-views {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.3em;

      &:hover .test-tile-footer-row-views-count {
        color: $color-black;
      }
    }

    &-header-bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
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

        &.test-tile-status-finished-mark--s {
          background: #b7b7b7;
        }

        &.test-tile-status-finished-mark--f {
          background: #f87342;
        }

        &.test-tile-status-finished-mark--c {
          background: $color-yellow-normal;
        }

        &.test-tile-status-finished-mark--a {
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

    &-header-tools {
      opacity: 0;
      transition: all 150ms linear;
      justify-self: flex-end;
      background: #fff;
      padding: 0.35rem 0.35rem 0.35rem 0.7rem;
      border-radius: 0.35rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    &-header-tools-menu-icon {
      width: 1rem;
      margin-bottom: -0.1rem;
    }

    &-header-feature-new {
      background: #9747ff;
      font-size: 0.875rem;
      color: #fff;
      padding: 0.45rem 0.6rem;
      border-radius: 0.375rem;
      line-height: 1;
      margin-bottom: -0.45rem;
      transform: translateY(-0.3rem);
    }

    &-loader {
      --loader-spinner-width: 2rem;
      --loader-spinner-height: 2rem;
      --loader-padding-bottom: 20%;
      --loader-max-opacity: 0.8;
    }

    &--in-favorite &-header {
      &-favorite-btn {
        opacity: 1;
        background: #fff;
        color: $color-yellow-normal;

        path {
          opacity: 1 !important;
        }
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

    &.test-tile--literature {
      .test-tile-status-continue {
        &-scale {
          background: #a9b6c5;
        }
      }
    }

    &.test-tile--no-favorite {
      .test-tile-header-favorite-btn {
        display: none;
      }
    }

    @each $id, $color in $subjects-meta {
      .test-tile--#{$id} &-header {
        background-color: $color;
      }

      .test-tile--#{$id} &-title-shadow {
        background: linear-gradient(180deg, rgba($color, 0.5) 0%, $color 100%);
      }
    }
  }
</style>
