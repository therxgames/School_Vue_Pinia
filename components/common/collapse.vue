<template>
  <div class="commonCollapse">
    <a
      v-if="!$slots.control"
      :href="'#collapse-' + id"
      class="commonCollapse-defaultControl"
      data-bs-toggle="collapse"
      :aria-expanded="expanded"
      :aria-controls="'collapse-' + id">
      <h5 class="commonCollapse-defaultControl-label">{{ controlLabel }}</h5>
      <svg-icon
        class="commonCollapse-defaultControl-icon"
        name="arrow-bottom"/>
    </a>

    <div
      v-else-if="controlPosition === 'top'"
      :href="'#collapse-' + id"
      class="commonCollapse-control"
      data-bs-toggle="collapse"
      :aria-expanded="expanded"
      :aria-controls="'collapse-' + id">
      <slot
        v-if="$slots.control"
        name="control"/>
    </div>

    <div
      :id="'collapse-' + id"
      class="collapse"
      :class="{show: expanded}">
      <slot/>
    </div>

    <div
      v-if="controlPosition === 'bottom'"
      :href="'#collapse-' + id"
      class="commonCollapse-control"
      data-bs-toggle="collapse"
      :aria-expanded="expanded"
      :aria-controls="'collapse-' + id">
      <slot
        v-if="$slots.control"
        name="control"/>
    </div>
  </div>
</template>

<script>
  const idGenerator = new IdGenerator();

  export default {
    props: {
      controlPosition: {type: String, default: 'top'},
      controlLabel: {type: String, default: 'Развернуть'},
      expanded: {type: Boolean, default: true}
    },
    setup() {
      const id = ref('collapse');

      onMounted(() => {
        id.value = idGenerator.generate();
      });

      onBeforeUnmount(() => {
        idGenerator.removeId(id.value);
      });

      return {id};
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .commonCollapse-control {
    display: inline-flex;
  }

  .commonCollapse-defaultControl {
    color: $color-black;
    transition: $transition;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.7rem;

    &:hover {
      color: $color-blue-normal;
    }
  }

  .commonCollapse-defaultControl-label {
    margin-bottom: 0;
  }

  .commonCollapse-defaultControl-icon {
    width: 1rem;
    transform: rotate(0deg);
    transition: all 350ms ease-out;
  }

  .commonCollapse-defaultControl[aria-expanded='true'] .commonCollapse-defaultControl-icon {
    transform: rotate(-180deg);
  }
</style>
