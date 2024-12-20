<template>
  <div :class="styles[type?.code] || 'course-color'" class="event-type">
    {{ type?.name }}
  </div>
</template>
  
<script setup>
const props = defineProps({
  type: {
    type: Object,
    required: false
  },
});

const styles = {
  'contest': 'contest-color',
  'course': 'course-color',
  'olympiad': 'olympiad-color',
  'public-lesson': 'lesson-colorn'
};
</script>
  
<style lang="scss" scoped>
.contest-color {
  background: linear-gradient(90deg, #BF5AE0 0%, #A811DA 100%);
}

.course-color {
  background: linear-gradient(90deg, #00C6FF 0%, #0072FF 100%);
}

.olympiad-color {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.lesson-color {
  background: linear-gradient(90deg, #00B09B 0%, #96C93D 100%);
}

.event-type {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.2px;
  font-size: 14px;
  width: fit-content;
}

</style>
  