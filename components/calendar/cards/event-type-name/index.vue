<template>
  <div
    :class="{
    ['other-color']: true,
    ['contest-color']: eventType.code === 'contest',
    ['olympiad-color']: eventType.code === 'olympiad',
    ['lesson-color']: eventType.code === 'lesson',
    }"
    class="event-type-name"
  >
    {{ eventType.name }}
  </div>
</template>

<style lang="scss" scoped>
.contest-color {
  background: linear-gradient(90deg, #BF5AE0 0%, #A811DA 100%);
}

.other-color {
  background: linear-gradient(90deg, #00C6FF 0%, #0072FF 100%);
}

.olympiad-color {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.lesson-color {
  background: linear-gradient(90deg, #00B09B 0%, #96C93D 100%);
}

.event-type-name {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.2px;
  font-size: 14px;
}
</style>

<script setup lang="ts">
const props = defineProps({
  eventType: {
    required: true
  },
})
</script>
