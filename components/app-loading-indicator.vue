<template>
  <div
    class="nuxt-loading-indicator app-loading-indicator"
    :style="style"/>
</template>

<script>
  import {useNuxtApp} from '#app/nuxt';

  export default {
    props: {
      throttle: {
        type: Number,
        default: 0
      },
      duration: {
        type: Number,
        default: 2e3
      },
      height: {
        type: Number,
        default: 3
      },
      color: {
        type: [String, Boolean],
        default: 'repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)'
      }
    },

    setup(props) {
      function useLoadingIndicator(opts) {
        const progress = ref(0);
        const isLoading = ref(false);
        const step = computed(() => 1e4 / opts.duration);
        let _timer = null;
        let _throttle = null;
        function start() {
          clear();
          progress.value = 0;
          if (opts.throttle && process.client) {
            _throttle = setTimeout(() => {
              isLoading.value = true;
              _startTimer();
            }, opts.throttle);
          } else {
            isLoading.value = true;
            _startTimer();
          }
        }
        function finish() {
          progress.value = 100;
          _hide();
        }
        function clear() {
          clearInterval(_timer);
          clearTimeout(_throttle);
          _timer = null;
          _throttle = null;
        }
        function _increase(num) {
          if (progress.value + num > progress.value ) {
            progress.value = Math.min(100, progress.value + num);
          }
        }
        function _hide() {
          clear();
          if (process.client) {
            setTimeout(() => {
              isLoading.value = false;
              setTimeout(() => {
                progress.value = 0;
              }, 400);
            }, 500);
          }
        }
        function _startTimer() {
          if (process.client) {
            _timer = setInterval(() => {
              _increase(step.value);
            }, 100);
          }
        }
        return {
          progress,
          isLoading,
          start,
          finish,
          clear
        };
      }
      const indicator = useLoadingIndicator({
        duration: props.duration,
        throttle: props.throttle
      });
      const nuxtApp = useNuxtApp();
      nuxtApp.hook('page:start', indicator.start);
      nuxtApp.hook('page:finish', indicator.finish);
      onBeforeUnmount(indicator.clear);
      const style = computed(() => {
        return {
          width: `${indicator.progress.value}%`,
          height: `${indicator.isLoading.value ? props.height : 0}px`,
          opacity: indicator.isLoading.value ? 1 : 0,
          background: props.color || void 0
        };
      });
      return {
        style
      };
    }
  };
</script>

<style lang="scss" scoped>
  .app-loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    transition: width 0.2s, height 0.4s, opacity 0.4s;
    z-index: 999999;
  }
</style>
