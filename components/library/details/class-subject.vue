<template>
  <div class="class-subject">
    <div class="d-flex gap-2" v-if="!!classes && !!classes.length">
      <span class="class-text">{{ classesRange }}</span>
    </div>

    <div class="d-flex gap-2" v-if="!!subjects && !!subjects.length">
      <span class="subject-text">{{ subjects.map(item => item.name).join(', ') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  classes: {
    type: Array,
  },
  subjects: {
    type: Array,
  },
});

const classesRange = computed(() => {
  if (props.classes.length === 1) {
    return `${props.classes[0].number} класс`;
  }

  const sortedClasses = props.classes.sort((a, b) => a.number - b.number);
  const classNumbers = sortedClasses.map(item => item.number);

  let result = '';
  let rangeStart = classNumbers[0];
  let rangeEnd = classNumbers[0];

  for (let i = 1; i < classNumbers.length; i++) {
    if (classNumbers[i] === classNumbers[i - 1] + 1) {
        rangeEnd = classNumbers[i];
    } else {
        result += (rangeStart === rangeEnd) ? `${rangeStart}, ` : `${rangeStart}-${rangeEnd}, `;

        rangeStart = classNumbers[i];
        rangeEnd = classNumbers[i];
    }
  }

  result += (rangeStart === rangeEnd) ? rangeStart : `${rangeStart}-${rangeEnd}`;

  return `${result} класс`;
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.class-subject {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 2rem 0;
}

.class-text {
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.75rem;
}
</style>
