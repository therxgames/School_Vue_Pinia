<template>
  <div class="lvl-wrapper">
    <svg-icon class="lvl-icon" :name="lvlIconNames[props.level]" />
    <span class="lvl-title">{{ props.level }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  level: {
    type: Number,
    required: true
  }
})

const lvlIconNames = {
  1: 'lvl-icon_1',
  2: 'lvl-icon_1',
  3: 'lvl-icon_1',
  4: 'lvl-icon_1',
  5: 'lvl-icon_1',
  6: 'lvl-icon_1',
  7: 'lvl-icon_1',
  8: 'lvl-icon_8',
}
</script>

<style scoped lang="scss">
.lvl-wrapper {
  position: relative;
}

.lvl-icon {
  width: 48px;
  height: 48px;
  padding: 2px;
}

.lvl-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
  color: #fff;
}
</style>
