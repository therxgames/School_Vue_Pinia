<template>
  <audio
    ref="audio"
    hidden
    @durationchange="dt = Math.floor(audio?.duration)"
    @timeupdate="ct = Math.floor(audio?.currentTime)"
    @ended="isPause = true">
    <source
      :src="src"
      type="audio/mpeg">
  </audio>
  <div
    v-if="audio"
    class="commonAudio d-flex align-items-center"
    @click.stop>
    <div
      class="commonAudio-btn"
      @click="play">
      <svg-icon :name="`audio-${isPause ? 'play' : 'pause'}`"/>
    </div>
    <div
      class="flex-fill commonAudio-progress">
      <div
        class="w-100 commonAudio-progress-indicator"
        :style="indicatorStyles"/>
      <input
        class="commonAudio-range"
        type="range"
        min="0"
        :max="dt"
        v-model="audio.currentTime"
        @click="setectPoint">
    </div>
    <span class="commonAudio-time">{{ getTime(ct) }} / {{ getTime(dt) }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      src: {
        type: String,
        required: true
      }
    },
    setup() {
      const audio = ref(null);
      const isPause = ref(true);
      const ct = ref(0);
      const dt = ref(0);
      watch(() => audio.value?.duration, () => dt.value = audio.value.duration);
      const indicatorStyles = computed(() => {
        return `background: linear-gradient(90deg, #7f838a ${ct.value / dt.value * 100}%, #e4e5e7 0%)`;
      });
      const play = () => {
        audio.value.volume = 1;
        audio.value.paused ? audio.value.play() : audio.value.pause();
        isPause.value = audio.value.paused;
      };
      const setectPoint = () => {
        if (audio.value.paused) play();
      };
      const getTime = (num) => {
        const min = Math.floor(num / 60);
        let sec = num % 60;
        if (sec < 10) {
          sec = `0${sec}`;
        }
        return `${min}:${sec}`;
      };

      onMounted(() => audio.value.load());
      onBeforeUnmount(() => audio.value.pause());

      return {
        audio,
        isPause,
        indicatorStyles,
        play,
        setectPoint,
        ct,
        dt,
        getTime
      };
    }
  };
</script>

<style lang="scss" scoped>
  .commonAudio {
    height: 44px;
    font-size: 14px;

    &-btn {
      width: 11px;
      cursor: pointer;

      .svg-icon {
        width: 100%;
        position: relative;
        transform: none;
        right: 0;
      }
    }

    &-range {
      position: relative !important;
      width: 100% !important;
      opacity: 0 !important;
    }

    &-progress {
      position: relative;
      height: auto;
      display: flex;
      align-items: center;
      margin: 0 1rem;

      &-indicator {
        position: absolute;
        width: 100%;
        height: 2px;
      }
    }

    &-time {
      min-width: 88px;
      text-align: end;
    }
  }
</style>
