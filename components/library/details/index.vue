<template>
  <div class="library-details">
    <template v-if="item?.project">
      <library-details-project-header :item="item" />
      <library-details-project-content :item="item" />
    </template>

    <!-- <library-details-breadcrumbs /> -->

    <template v-else>
      <library-details-header :item="item" />
      <library-details-content :item="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';
.library-details {
  display: flex;
  flex-direction: column;
}
</style>
