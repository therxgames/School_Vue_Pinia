<template>
  <div class="expand">
    <div ref="contentRef" :class="{ 'cropped-text': !show }">
      <slot />
    </div>

    <div v-if="!show && canExpand" class="cropped-text-shadow"></div>
  </div>

  <button type="btn" class="expand-btn mt-2" v-if="canExpand" @click="toggleContent">
    {{ show ? 'Скрыть' : 'Показать полностью' }}
  </button>
</template>

<script setup>
  const contentRef = ref(null); 
  const show = ref(false);
  const canExpand = ref(false);

  const toggleContent = () => show.value = !show.value;

  onMounted(() => {
    canExpand.value = contentRef.value.scrollHeight > contentRef.value.clientHeight;
  });
</script>

<style lang="scss" scoped>
  .expand {
    position: relative;

    &-btn {
      color: #254ce8;
      outline: none;
      background: none;
      padding: 0;
      border: none;
      border-bottom: #254ce8 1px dotted; 
      width: fit-content;
    }
  }

  .cropped-text {
    max-height: 240px;
    overflow: hidden;

    &-shadow {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50px;
      z-index: 10;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #FFF 100%);
    }
  }
</style>
