<template>
  <div
      :class="{ 'chart-resize': resizeble }"
      :style="`max-height:60vh;min-height:${height}px`">
    <canvas
        v-if="isShow"
        ref="chartjs"
        :id="id" />
  </div>
</template>

<script setup>
import { Chart } from 'chart.js/auto'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  stacked: {
    type: Boolean,
    default: false
  },
  colors: {
    type: Array,
    default: []
  },
  gradientBar: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    required: true
  },
  height: {
    type: String,
    default: ''
  },
  resizeble: {
    type: Boolean,
    default: false
  }
})

const isShow = ref(true)
const chartjs = ref(null)
watch(
    () => chartjs.value,
    () => {
      if (chartjs.value) {
        chartjs.value.height = props.height
        initChart()
        if (props.stacked) {
          updateStack()
        }
        setTimeout(() => newChart.update(), 100)
      }
    }
)
watch(
    () => props.height,
    () => {
      isShow.value = false
      setTimeout(() => (isShow.value = true), 0)
    }
)
const stacked = computed(() => props.stacked)

function getGradient (context, color) {
  const { chart, element } = context
  const { ctx, chartArea } = chart
  const fade = '88'
  const opacity = '0.1'
  const secondColor = color.startsWith('rgb')
      ? getRGBA(color, opacity)
      : color + fade
  if (!chartArea) {
    return null
  }
  if (element.y && element.base) {
    const gradientBg = ctx.createLinearGradient(
        element.x,
        element.y,
        element.x + element.width,
        element.base
    )
    gradientBg.addColorStop(1, secondColor)
    gradientBg.addColorStop(0, color)
    return gradientBg
  }
}

function getRGBA (color, opacity = '0.5') {
  color = color.slice(color.indexOf('(') + 1, -1).split(',')
  color.length = 3
  color = color.join(',')
  color = `rgba(${color}, ${opacity})`
  return color
}

let newChart = null

function updateDs () {
  if (newChart) {
    newChart.config.data.datasets = props?.config.data.datasets
    newChart.config.data.labels = props?.config.data.labels
    newChart.update()
  }
}


watch(
    () => props.config.data.datasets,
    () => updateDs()
)

function updateStack () {
  newChart.config.options.scales.x.stacked = stacked.value
  newChart.config.options.scales.y.stacked = stacked.value
  newChart.update()
}

watch(
    () => props.stacked,
    () => updateStack()
)

function initChart () {
  newChart = new Chart(chartjs.value, props.config)

  if (props.colors.length) {
    newChart.data.datasets = newChart.data.datasets.map((el, ind) => {
      const data = el

      const color = props.colors[ind] || data.backgroundColor
      data.backgroundColor = props.gradientBar
          ? (context) => getGradient(context, color)
          : color
      return data
    })
  }
  else {
    if (props.gradientBar) {
      newChart.data.datasets = [...newChart.data.datasets].map((el) => {
        const data = el
        const color = data.backgroundColor
        data.backgroundColor = (context) => getGradient(context, color)
      })
    }
  }
  newChart.update()
  if (props.stacked) {
    newChart.config.options.scales.y.stacked = true
    newChart.config.options.scales.x.stacked = true
    newChart.update()
  }
}
</script>

<style lang="scss" scoped>
canvas {
  min-width: 100%;
  max-height: 60vh;
}

.chart-resize {
  overflow: auto;
  resize: vertical;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
