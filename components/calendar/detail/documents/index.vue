<template>
    <div class="format">
      <h2 class="mb-4">Документы</h2>
  
      <div class="d-flex align-items-center gap-4">
        <document-list :items="items" />
      </div>
    </div>
  </template>
  
<script setup>
  import DocumentList from "./document-list/index.vue";

  const props = defineProps({
    items: {
      type: Array,
      required: true
    },
  });
</script>
  
<style lang="scss" scoped>
</style>
  