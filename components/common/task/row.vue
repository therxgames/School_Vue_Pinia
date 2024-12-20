<template>
  <div
    :class="classes"
    class="task-row">
    <div class="task-row-content">
      <div
        @click="emit('favorite', getContext())"
        class="task-row-favorite">
        <svg-icon
          class="task-row-favorite-icon"
          name="star-filled"/>
      </div>
      <div class="task-row-tag">
        <svg-icon
          class="task-row-tag-icon"
          name="tag"/>
        <span>{{ props.data.parent_id }}</span>
      </div>
      <div class="task-row-title">
        <div class="task-row-title-features">
          <div v-if="solutionStatusId === 'correct'">
            <svg-icon
              class="task-row-header-feature-icon task-row-header-feature-icon--green"
              name="check-circle"/>
          </div>
          <div
            v-if="solutionStatusId === 'wrong'"
            class="">
            <svg-icon
              class="task-row-header-feature-icon task-row-header-feature-icon--red"
              name="cross-circle"/>
          </div>
          <div
            v-else-if="props.data.is_new && userStore.userIsStudent"
            class="task-row-title-is-new">
            Новое
          </div>
        </div>
        <h3
          class="task-row-title-name mb-0"
          v-html="props.data.name || lexicon.common.no_title"/>
      </div>
      <div class="task-row-content-type">
        задание
      </div>
      <div class="task-row-subject">
        <span>{{ props.data.parallel_id || props.data.class }} кл</span>
        <span class="task-row-subject-dot"/>
        <span class="task-row-subject-name">{{ props.data.subject || props.data.subject_name }}</span>
      </div>
      <div class="task-row-views">
        <span
          v-tooltip="viewTpOpts"
          class="task-row-footer-row-views">
          <svg-icon name="persons"/>
          <span class="task-row-footer-row-views-count">
            {{ props.data.solutions_count }}
          </span>
        </span>
      </div>
      <div class="task-row-type">
        {{ attestationToName(props.data.attestation) }}
      </div>
      <div class="task-row-part">
        <common-complexity-icon
          :complexity="props.data.complexity"
          class="task-row-header-complexity-icon me-2"/>
        <span v-if="props.data.part_name">
          {{ props.data.part_name }}
        </span>
      </div>
      <div class="task-row-actions">
        <common-task-menu
          :data="props.data"
          :context="getContext()"/>
      </div>
    </div>
    <nuxt-link
      class="task-row-link"
      v-spec-title="linkTitle"
      :to="link"/>
    <loader
      class="task-row-loader"
      :listener="progress"/>
  </div>
  <div
    v-if="props.data.delimiterAfter"
    :data-break-page="props.data.page"
    class="delimiter task-row-delimiter">
    <span>{{ props.data.page }}</span>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const userStore = useUserStore();
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
  const progress = ref(false);
  const router = useRouter();
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
      {'task-row--in-favorite': props.data.is_favorite && showFavorite.value},
      {'task-row--no-favorite': !showFavorite.value}
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

  .task-row {
    position: relative;
    padding: 0.75rem 1rem;
    transition: $transition;
    border-radius: 1rem;

    &:hover {
      background: $color-black-10;
      z-index: 20;
    }

    &:hover .task-dropdown {
      pointer-events: auto;
      opacity: 1;
    }

    &-content {
      display: grid;
      grid-template-columns:
        minmax(28px, 28px)
        minmax(55px, 55px)
        minmax(650px, 660px)
        minmax(150px, 155px)
        minmax(60px, 65px)
        minmax(40px, 40px)
        minmax(120px, 120px)
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
      gap: 0.3rem;
      font-size: 0.875rem;
    }

    &-tag-icon {
      width: 0.75rem;
      height: 0.75rem;
      flex-shrink: 0;
    }

    &-title {
      display: flex;
      align-items: center;
      gap: 0.6em;
    }

    &-title-name {
      font-size: 1rem;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 6rem;
    }

    &-title-is-new {
      background: #9747ff;
      font-size: 0.875rem;
      color: #fff;
      padding: 0.45rem 0.6rem;
      border-radius: 0.5rem;
      line-height: 1;
    }

    &-header-feature-icon {
      width: 1rem;
    }

    &-header-feature-icon--green {
      color: $color-green-normal;
    }

    &-header-feature-icon--red {
      color: #fa4925;
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
      flex-shrink: 0;
    }

    &-views {
      position: relative;
      color: $color-dark;
      font-size: 0.875rem;
      z-index: 10;
    }

    &-footer-row-views {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
      vertical-align: middle;
    }

    &-type {
      color: $color-dark;
      font-size: 0.875rem;
    }

    &-part {
      display: flex;
      align-items: center;
      color: $color-dark;
      font-size: 0.875rem;
      gap: 0.5em;
    }

    &-title-features:empty {
      display: none;
    }

    &-header-complexity-icon {
      width: 0.75rem;
      height: 0.75rem;
    }

    &-actions {
      display: flex;
      justify-content: flex-end;
      font-size: 0.875rem;
      transition: $transition;
      z-index: 10;
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
      margin: 1rem 0.5rem;
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

    .task-dropdown {
      border: 1px solid #e7e7e7;
    }

    &.task-row--no-favorite {
      .task-row-favorite {
        display: none;
      }

      .task-row-content {
        grid-template-columns:
          minmax(55px, 55px)
          minmax(650px, 700px)
          minmax(150px, 155px)
          minmax(60px, 65px)
          minmax(40px, 40px)
          minmax(120px, 120px)
          auto;
      }
    }
  }
</style>
