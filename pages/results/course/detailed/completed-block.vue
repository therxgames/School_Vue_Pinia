<template>
  <div class="main-info__completed">
    <h3 class="completed__title" v-html="completed.title" />
    <div class="circle-progress">
      <svg :viewBox="viewBox" height="130px" :width="2 * r + strokeWidth">
        <path
          :fill="bgColor"
          :stroke-width="6"
          :stroke-linecap="strokeLinecap"
          :stroke="strokeBgColor"
          :d="pathD"
        />
        <path
          class="circle-progress"
          fill-opacity="0"
          :style="aboveCircleStyle"
          :stroke-width="strokeWidth"
          :stroke-linecap="strokeLinecap"
          :stroke="strokeColor"
          :stroke-dasharray="dasharray"
          :stroke-dashoffset="dashoffset"
          :d="pathD"
        />
      </svg>
      <span class="circle-progress__count" v-html="completed.count" />
    </div>
    <p class="completed__text" v-html="`из ${completed.count_total}`" />
  </div>
</template>

<script setup lang="ts">
import { SubjectMainInfoCompleted } from '~/types'

const props = defineProps({
  completed: {
    type: Object as () => SubjectMainInfoCompleted,
    required: true
  },
  r: {
    type: Number,
    default: 100
  },
  strokeWidth: {
    type: Number,
    default: 6
  },
  bgColor: {
    type: String,
    default: '#ffffff'
  },
  strokeBgColor: {
    type: String,
    default: '#F3F3F1'
  },
  strokeColor: {
    type: String,
    default: '#00B09B'
  },
  strokeLinecap: {
    type: String,
    default: 'round'
  },
  duration: {
    type: Number,
    default: 0.3
  }
})

const pathD = computed(() => {
  let radius = props.r
  let d = `M${radius * 2} ${radius} A${radius} ${radius} 0 0 0 0 ${radius}`
  return d
})

const viewBox = computed(() => {
  let cx = props.strokeWidth / 2
  let cy = props.strokeWidth / 2
  let w = 2 * props.r + props.strokeWidth
  let h = props.r + props.strokeWidth
  return `-${cx} -${cy} ${w} ${h}`
})

const percents = computed(() => Math.floor((props.completed?.count / props.completed?.count_total) * 100))

const dasharray = computed(() => String((3.14 * 2 * props.r) / 2))

const dashoffset = computed(() => {
  let offset =
    dasharray.value *
    ((percents.value > 100 ? 100 : percents.value) / 100) +
    (3.14 * 2 * props.r) / 2
  return `${offset}`
})

const aboveCircleStyle = computed(() => ({ transition: `all ${props.duration}s ease-in-out` }))
</script>

<style scoped lang="scss">
.main-info__completed {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.completed {
  &__title {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
  }

  &__text {
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    letter-spacing: 0.2px;
    color: #93979E;
    margin-top: 16px;
    margin-bottom: 0;
  }
}

.circle-progress {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: auto;

  .progress-content {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);

    .inner-default-percentage {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }

  &__count {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    font-size: 38px;
    font-style: normal;
    font-weight: 500;
    line-height: 142%;
    letter-spacing: -0.4px;
  }
}
</style>
