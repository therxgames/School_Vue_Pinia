<template>
  <div class="breadcrumbs">
    <nuxt-link
      v-for="(item, index) in items"
      :key="index"
      :to="item.to ? item.to : ''"
      class="breadcrumbs-item">
      <svg-icon
        v-if="displayArrow(index) && direction === 'left'"
        name="arrow-left"/>
      <svg-icon
        v-else-if="displayArrow(index) && direction === 'right'"
        name="arrow-right"/>
      {{ item.title }}
    </nuxt-link>
  </div>
</template>

<script setup>
  const props = defineProps({
    items: {type: Array, required: true},
    direction: {type: String, default: 'left'},
    firstArrow: {type: Boolean, default: true}
  });

  const displayArrow = (index) => {
    return (index === 0 && props.firstArrow) || (index > 0);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .breadcrumbs {
    display: flex;
  }

  .breadcrumbs-item {
    color: #7f838a;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.125rem;
    cursor: pointer;
    margin-right: 0.7rem;

    .svg-icon {
      width: 0.313rem;
      height: 0.625rem;
    }
  }
</style>
