<template>
  <div v-html="text">
  </div>
</template>
  
<script setup>

const props = defineProps({
  text: {
    type: String,
    required: true
  },
});
</script>

<style lang="scss" scoped></style>
