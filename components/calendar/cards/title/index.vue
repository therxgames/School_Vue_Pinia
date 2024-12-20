<template>
  <div class="card-title">{{ name }}</div>
</template>

<style lang="scss" scoped>
.card-title {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  z-index: 2;
  color: #0C1524;
  font-size: 20px;
  font-weight: 500;
  line-height: 140%;
}
</style>

<script setup>
const props = defineProps({
  name: {
    required: true
  },
})

</script>
