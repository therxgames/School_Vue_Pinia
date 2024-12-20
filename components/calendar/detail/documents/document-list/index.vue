<template>
  <div class="d-grid gap-1">
    <document-list-item v-for="item in items" :item="item" />
  </div>
</template>
  
<script setup>
import DocumentListItem from "./document-list-item/index.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
});
</script>

<style lang="scss" scoped></style>
