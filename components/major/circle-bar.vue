<template>
  <div class="chart-container" ref="chartСontainer">
    <svg class="chart">
        <circle class="pie"></circle>
    </svg>
  </div>
</template>

<script setup>
  const props = defineProps({
    value: {
      type: Number,
    },
  });

  const chartСontainer = ref(null);

  onMounted(() => {
    watch(() => props.value, () => {
      chartСontainer.value.style.setProperty('--value', props.value || 0);
    }, 
    {
      immediate: true
    });
  });

</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.chart-container{
  --radius: 12;
  --stroke-width: 31;
  --progress-color: #C5D0FF;
  --text-color: #FFF;

  font-weight: 600;
  font-size:.8rem;
  color: var(--text-color);
  display: inline-block;
  position:relative;
  counter-reset: my-value var(--value);
}

.chart {
  border: 1px solid #0576FF;
  width: calc(var(--radius) * 2 * 1px);
  height: calc(var(--radius) * 2 * 1px);
  transform: rotate(-90deg);
  border-radius: 50%;
  display: block;
}

.chart .pie {
  r: var(--radius);
  cx: calc(var(--radius) - 1);
  cy: calc(var(--radius) - 1);
  fill: none;
  stroke:var(--progress-color);
  stroke-width: calc(var(--stroke-width) + -6);
  stroke-dasharray:
    calc(
      (var(--radius) * 3.1416 * 2)*(var(--value)/100)
    ), calc(var(--radius) * 3.1416 * 2);
  transition: stroke-dasharray .3s ease;
}
</style>