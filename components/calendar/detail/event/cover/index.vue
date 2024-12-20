<template>
  <div class="cover position-relative overflow-hidden">
    <img v-if="imgSrc && !showLapTop" :src="imgSrc" class="cover-img" @error="showLapTop = true" />
    
    <div v-else class="cover-laptop">
      <svg-icon class="w-50 h-50" name="laptop" />
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  src: {
    required: false
  },
});

const imgSrc = !!props.src && ['http://', 'https://', '/'].some((prefix) => props.src.startsWith(prefix)) ? props.src : undefined;
const showLapTop = ref(false);
</script>

<style lang="scss" scoped>
  .cover {
    border-radius: 0.5rem;
    aspect-ratio: 4/3;
    background-color: rgb(240 242 252);

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-laptop {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
</style>
  