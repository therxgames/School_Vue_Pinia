<template>
  <template v-if="!!intervals && intervals.length !== 0" v-for="interval of intervals" :key="[interval.from.code, interval.to.code].join(':')">
    <tab type="tag" @click="onClick(interval.codes)">
      {{
        interval.from.number !== interval.to.number ? `${interval.from.number}-${interval.to.number}` : interval.from.number
      }} класс
    </tab>
  </template>
</template>

<style lang="scss" scoped>

</style>

<script setup>
import Tab from '../../tab/index.vue';

const emit = defineEmits(['click']);

const props = defineProps({
  classes: {
    required: true
  },
})

const onClick = (codes) => {
  emit('click', { class: codes });
};

const intervals = props.classes?.sort((a, b) => a.number - b.number).reduce((intervals, clazz) => {
  const lastInterval = intervals[intervals.length - 1];

  if (!!lastInterval) {
    const { to } = lastInterval;

    if (clazz.number === to.number + 1) {
      lastInterval.to = clazz;
      lastInterval.codes.push(clazz.code);
    }
  } else {
    intervals.push({from: clazz, to: clazz, codes: [clazz.code]});
  }

  return intervals;
}, []);
</script>
