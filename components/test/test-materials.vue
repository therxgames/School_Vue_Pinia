<template>
  <div class="testMaterials">
    <loader
      :listener="isFetching"
      class="testMaterials-loader"/>

    <div v-if="materialsRes?.content">
      <recomended-materials
        :items="adaptMaterialToProps(materialsRes, test)?.map(adaptItemsForTest)"/>
      <div
        v-if="showMore"
        class="d-grid gap-2">
        <div
          class="btn btn-simple mt-4"
          @click="emit('show-more')">
          Показать еще
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    test: {type: Object, required: true},
    materialsRes: {type: Object, default: null},
    isFetching: {type: Boolean, required: true},
    showMore: {type: Boolean, required: true}
  });

  const emit = defineEmits(['show-more']);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testMaterials {
    position: relative;
  }

  .testMaterials-loader {
    left: -10px;
    width: 105%;
  }
</style>
