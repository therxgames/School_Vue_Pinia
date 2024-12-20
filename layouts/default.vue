<template>
  <app-header :modalRoleInfo="modalRoleInfo"/>
  <common-modal-role-info ref="modalRoleInfo"/>
  <div :class="{'layout-default': useContainer}">
    <slot/>
    <up-button/>
    <app-footer/>
  </div>
</template>

<script setup>
const props = defineProps({
  useContainer: {
    type: Boolean,
    default: true,
  }
});

const modalRoleInfo = ref(null);
</script>

<style lang="scss">
.layout-default {
  position: relative;
  min-height: calc(100vh + 1px);
  min-width: 1280px;
  padding: 0 40px;
  display: grid;
  grid-template-rows: 1fr max-content;
}
</style>
