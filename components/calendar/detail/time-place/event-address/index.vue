<template>
  <icon-list-item icon-name="map">
    {{ text }}
  </icon-list-item>
</template>
  
<script setup>
import IconListItem from "../../icon-list/icon-list-item/index.vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

</script>
  
<style lang="scss" scoped>
</style>
  