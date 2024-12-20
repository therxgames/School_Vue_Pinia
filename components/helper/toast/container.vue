<template>
  <div class="helper-toast toast-container position-fixed p-3 bottom-0 start-0">
    <helper-toast-item
      v-for="(item, index) in toastList"
      :key="index"
      :data="item"
      @hidden="onToastHidden"/>
  </div>
</template>

<script setup>
  const toastList = ref([]);

  onMounted(() => {
    eventBus.on('toast:show', show);
  });
  onBeforeUnmount(() => {
    eventBus.off('toast:show', show);
  });

  const show = (data) => {
    toastList.value.push({
      id: 'toast-' + generateString(),
      ...data
    });
  };
  const onToastHidden = (toastItem) => {
    const index = toastList.value.findIndex((item) => toastItem.id === item.id);
    if (index > -1) {
      toastList.value.splice(index, 1);
    }
  };

  defineExpose({show});
</script>
