<template>
  <div class="tooltip-copy-item" v-if="showTooltip">
    <div class="tooltip-copy-item-check">
      <svg-icon name="check" class="tooltip-copy-item-check-svg" />
    </div>
    
    <span class="tooltip-copy-item-content">Ссылка скопирована</span>

    <div class="cursor-pointer" @click="showTooltip = false">
      <svg-icon name="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
		required: true,
  }
});

const showTooltip = ref(props.show);

onMounted(() => {
  setTimeout(() => showTooltip.value = false, 4000);
});
</script>

<style lang="scss" scoped>
.tooltip-copy-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFF;
  padding: 0.75rem 1.5rem;
  background: rgb(12, 21, 36);
  border-radius: 0.5rem;

  &-check {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    background: rgb(32, 204, 95);
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 100%;

    &-svg {
      width: 10px;
      height: 10px;
    }
  }

  &-content {
    padding-right: 1rem;
  }
}
</style>
  