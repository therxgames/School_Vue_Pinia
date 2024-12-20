<template>
  <div
    :class="classes"
    class="task-tile">
    <div class="task-tile-content">
      <div class="task-tile-header">
        <div class="task-tile-header-top">
          <div class="task-tile-header-top-left-col">
            <div class="task-tile-header-tag task-tile-unlink">
              <svg-icon
                class="task-tile-header-tag-icon"
                name="tag"/>
              <span>{{ props.data.parent_id }}</span>
            </div>
            <div
              v-if="solutionStatusId === 'correct'"
              class="task-tile-header-feature-icon--green">
              <svg-icon
                class="task-tile-header-feature-icon"
                name="check-circle"/>
            </div>
            <div
              v-if="solutionStatusId === 'wrong'"
              class="task-tile-header-feature-icon--red">
              <svg-icon
                class="task-tile-header-feature-icon"
                name="cross-circle"/>
            </div>
          </div>
          <div class="task-tile-header-top-right-col task-tile-unlink">
            <common-task-menu
              v-if="options.showMenu !== false"
              :data="props.data"
              :context="getContext()"/>
            <div
              @click="emit('favorite', getContext())"
              class="task-tile-header-favorite-btn">
              <svg-icon
                class="task-tile-header-favorite-btn-icon"
                name="star-filled"/>
            </div>
          </div>
        </div>
        <div class="task-tile-header-title">
          <h3
            class="task-tile-title mb-0"
            v-html="props.data.name || lexicon.common.no_title"/>
          <div
            v-if="props.data.name.length > 20"
            class="task-tile-title-shadow"/>
        </div>
        <div class="task-tile-header-bottom scoped">
          <div
            v-if="props.data.complexity"
            class="task-tile-header-part">
            <common-complexity-icon :complexity="props.data.complexity"/>
            <span v-if="props.data.part_name">
              {{ props.data.part_name }}
            </span>
          </div>
          <div
            v-if="props.data.is_new && userStore.userIsStudent"
            class="task-tile-header-feature-new">
            Новое
          </div>
        </div>
      </div>
      <div class="task-tile-footer mt-2">
        <div class="task-tile-footer-row">
          <span>{{ props.data.parallel_id || props.data.class }} кл</span>
          <span class="task-tile-footer-row-dot"/>
          <span class="text-cut">{{ props.data.subject || props.data.subject_name }}</span>
        </div>
        <div class="task-tile-footer-row mt-1">
          <span>{{ attestationToName(props.data.attestation) }}</span>
          <span class="task-tile-footer-row-dot"/>
          <span
            v-tooltip="viewTpOpts"
            class="task-tile-footer-row-views">
            <svg-icon name="persons"/>
            <span class="task-tile-footer-row-views-count">
              {{ props.data.solutions_count }}
            </span>
          </span>
          <div
            v-if="props.options.showContentType"
            class="task-tile-footer-row-content-type">
            Задание
          </div>
        </div>
      </div>
      <nuxt-link
        class="task-tile-link"
        v-spec-title="linkTitle"
        :to="link"/>
    </div>
    <loader
      class="task-tile-loader"
      :listener="progress"/>
  </div>
  <div
    v-if="props.data.delimiterAfter"
    :data-break-page="props.data.page"
    class="delimiter task-tile-delimiter">
    <span>{{ props.data.page }}</span>
  </div>
</template>

<script
  setup>
  import useUserStore from '~/stores/user';

  const emit = defineEmits(['favorite', 'archive', 'collection']);
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
  const link = computed(() => `/task/${props.data.id}`);
  const viewTpOpts = computed(() => ({
    title: () => `<span class="text-nowrap">
                    Задание
                    ${declension(props.data.solutions_count, lexicon.decl.passed)}
                    ${props.data.solutions_count} ${declension(props.data.solutions_count, lexicon.decl.peoples)}
                  </span>`
  }));
  const linkTitle = computed(() => {
    return props.data.name + (props.data.year ? ' ' + props.data.year + ' г.' : '');
  });
  const showFavorite = computed(() => {
    return userStore.logged && userStore.currentRole === 'student';
  });
  const classes = computed(() => {
    return [
      {'task-tile--in-favorite': props.data.is_favorite && showFavorite.value},
      {'task-tile--no-favorite': !showFavorite.value},
      `task-tile--${props.data.subject_id}`
    ];
  });
  const solutionStatusId = computed(() => {
    if ([solutionStatus.WRONG, solutionStatus.WRONG_AFTER_CONTROL_CORRECT].includes(props.data.solution_status)) {
      return 'wrong';
    }

    if ([solutionStatus.CONTROL_CORRECT, solutionStatus.TRAINING_CORRECT].includes(props.data.solution_status)) {
      return 'correct';
    }
  });

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

  .task-tile {
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

      .task-dropdown {
        pointer-events: auto;
      }
    }

    &:hover &-footer {
      color: $color-black;
    }

    &:hover .task-dropdown {
      opacity: 1;
    }

    &-content {
      transition: $transition;
      border-radius: 0.8rem;
      padding: 0.5rem 0.5rem 1rem;
      border: 1px solid transparent;
    }

    &-header {
      position: relative;
      display: grid;
      grid-template-rows: max-content minmax(120px, 137px) 1fr;
      gap: 0.5rem;
      background: #fff3dc;
      padding: 0.675rem 0.75rem 0.575rem;
      min-height: 14.688rem;
      border-radius: $border-radius;

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
    }

    &-header-top {
      position: relative;
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

    &-header-title {
      overflow: hidden;
      position: relative;
      user-select: none;
      padding-right: 1.5rem;
    }

    &-title-shadow {
      position: absolute;
      width: 100%;
      height: 50%;
      bottom: 0;
      left: 0;
      z-index: 10;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(255, 243, 220, 0.5) 0%, #fff3dc 100%);
    }

    &-footer {
      user-select: none;
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

      &:hover .task-tile-footer-row-views-count {
        color: $color-black;
      }
    }

    &-header-feature-icon {
      width: 1rem;
      height: 1rem;
    }

    &-header-feature-icon--green {
      color: #3db45a;
    }

    &-header-feature-icon--red {
      color: #fa4925;
    }

    &-header-tag {
      font-size: 0.875rem;
      color: $color-dark;
      display: flex;
      align-items: center;

      &-icon {
        width: 0.7rem;
      }

      span {
        padding: 0 0.2rem;
      }
    }

    &-header-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.scoped {
        position: relative;
        top: 0;
        left: 0;
      }
    }

    &-header-part {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &-header-feature-new {
      background: #9747ff;
      font-size: 0.875rem;
      color: #fff;
      padding: 0.45rem 0.6rem;
      border-radius: 0.375rem;
      line-height: 1;
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

    &.task-tile--no-favorite {
      .task-tile-header-favorite-btn {
        display: none;
      }
    }

    @each $id, $color in $subjects-meta {
      .task-tile--#{$id} &-header {
        background-color: $color;
      }

      .task-tile--#{$id} &-title-shadow {
        background: linear-gradient(180deg, rgba($color, 0.5) 0%, $color 100%);
      }
    }
  }
</style>
