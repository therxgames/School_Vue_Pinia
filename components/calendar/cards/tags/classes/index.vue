<template>
  <template
    v-if="!!intervals && intervals.length !== 0"
    v-for="interval of intervals"
  >
    <calendar-cards-tab type="tag">
      {{ interval }}
    </calendar-cards-tab>
  </template>
</template>

<style lang="scss" scoped></style>

<script setup>
const props = defineProps({
  classes: {
    required: true,
  },
});

const intervals = computed(() => {
  if (props.classes.length === 1) {
    return [`${props.classes[0].number} класс`];
  }

  const sortedClasses = props.classes.sort((a, b) => a.number - b.number);
  const classNumbers = sortedClasses.map((item) => item.number);

  let result = "";
  let rangeStart = classNumbers[0];
  let rangeEnd = classNumbers[0];

  for (let i = 1; i < classNumbers.length; i++) {
    if (classNumbers[i] === classNumbers[i - 1] + 1) {
      rangeEnd = classNumbers[i];
    } else {
      result +=
        rangeStart === rangeEnd
          ? `${rangeStart} класс, `
          : `${rangeStart}-${rangeEnd} класс, `;

      rangeStart = classNumbers[i];
      rangeEnd = classNumbers[i];
    }
  }

  result += rangeStart === rangeEnd ? rangeStart : `${rangeStart}-${rangeEnd}`;

  return `${result} класс`.split(",");
});
</script>
