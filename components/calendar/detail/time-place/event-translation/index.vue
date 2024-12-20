<template>
  <icon-list-item icon-name="video">
    Онлайн трансляция

    <button-url v-for="{ platform, link } in onlinePlatforms" :url="link" v-if="link">
      {{ platform }}
    </button-url>
  </icon-list-item>
</template>
  
<script setup>
import IconListItem from "../../icon-list/icon-list-item/index.vue";
import ButtonUrl from "@/components/input/button-url.vue";

const props = defineProps({
  onlinePlatforms: {
    type: Array,
    required: true,
  },
});
</script>
  
<style lang="scss" scoped>
</style>
  