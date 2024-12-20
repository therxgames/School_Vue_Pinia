<template>
  <div
    :class="[{'loader--active': listener || active}, {'loader--main': props.mainLoader}, {'theme--simple': themeSimple}]"
    class="loader">
    <div class="loader-spinner-container">
      <svg-icon
        class="loader-spinner"
        name="spinner"/>
    </div>
    <div
      v-if="props.mainLoader"
      :class="{'loader-caption--show': caption.length > 0}"
      class="loader-caption"
      v-html="caption"/>
  </div>
</template>

<script setup>
  const props = defineProps({
    listener: {
      type: Boolean,
      default: false
    },
    mainLoader: {
      type: Boolean,
      default: false
    },
    themeSimple: {
      type: Boolean,
      default: false
    },
  });
  const active = ref(false);
  const caption = ref('');

  onMounted(() => {
    if (props.mainLoader) {
      eventBus.on('loader:show', show);
      eventBus.on('loader:hide', hide);
      eventBus.on('loader:caption', setCaption);
    }
  });

  onBeforeUnmount(() => {
    if (props.mainLoader) {
      eventBus.off('loader:show', show);
      eventBus.off('loader:hide', hide);
      eventBus.off('loader:caption', setCaption);
    }
  });

  const show = () => {
    active.value = true;
    caption.value = '';
  };
  const hide = () => {
    active.value = false;
  };
  const setCaption = (_caption) => {
    caption.value = _caption;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .loader {
    --loader-max-opacity: 1;
    --loader-min-opacity: 0;
    --loader-spinner-width: 2.5rem;
    --loader-spinner-height: 2.5rem;
    --loader-padding-bottom: 0;
    --loader-padding-top: 0;
    --loader-min-height: 6rem;
    --loader-z-index: 500;
    --loader-bg: #fff;
    --loader-spinner-bg: #f2f5fa;
    --loader-spinner-indicator: #0576ff;
    --loader-spinner-transition-ms: 100ms;

    position: absolute;
    background: var(--loader-bg);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: var(--loader-z-index);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: var(--loader-min-opacity);
    min-height: var(--loader-min-height);
    transition: opacity var(--loader-spinner-transition-ms) ease-out;
    padding-bottom: var(--loader-padding-bottom);
    padding-top: var(--loader-padding-top);
    flex-direction: row;
    gap: 1rem;

    &--active {
      pointer-events: auto;
      opacity: var(--loader-max-opacity);
    }

    &--active .loader-spinner-container {
      transform-origin: center center;
      animation-play-state: running;
    }

    &--main {
      flex-direction: column;
    }

    &--main &-caption {
      display: block;
      min-height: 1.5rem;
    }

    &-spinner-container {
      animation: rotating 1.5s linear infinite;
      animation-play-state: paused;
    }

    &-spinner {
      width: var(--loader-spinner-width);
      height: var(--loader-spinner-height);

      .spinner-bg {
        fill: var(--loader-spinner-bg);
      }

      .spinner-indicator {
        fill: var(--loader-spinner-indicator);
      }
    }

    &-caption {
      transition: all 150ms ease-out;
      display: none;
      opacity: 0;
      color: $color-dark;

      &--show {
        opacity: 1;
      }
    }
  }

  .app-loader {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.75);
    z-index: 1089;
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .theme--simple {
    background-color: transparent;
    min-height: auto;

    .loader-spinner {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
