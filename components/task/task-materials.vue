<template>
  <div class="taskMaterials">
    <loader
      :listener="isFetching"
      class="taskMaterials-loader"/>

    <div v-if="materialsRes?.content">
      <recomended-materials
        :items="adaptMaterialToProps(materialsRes)?.map(adaptItemsForTask)"
        @select-item="emit('select-item', $event)"/>
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
    materialsRes: {type: Object, default: null},
    isFetching: {type: Boolean, required: true},
    showMore: {type: Boolean, required: true}
  });

  const emit = defineEmits(['select-item', 'show-more']);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskMaterials {
    position: relative;
  }

  .taskMaterials-loader {
    left: -10px;
    width: 105%;
  }
</style>
