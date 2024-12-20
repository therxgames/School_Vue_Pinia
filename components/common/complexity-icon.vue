<template>
  <svg-icon
    name="graph"
    :class="['complexityIcon--' + complexity]"
    class="complexityIcon"/>
</template>

<script setup>
  const props = defineProps({
    complexity: {type: String, required: true}
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .complexityIcon {
    display: inline-flex;
    width: 0.813rem;
    height: 0.813rem;
  }

  .complexityIcon--simple {
    .graph-line-1 {
      fill: #{$color-black};
    }

    .graph-line-2 {
      fill: #0c152426;
    }

    .graph-line-3 {
      fill: #0c152426;
    }
  }

  .complexityIcon--medium {
    .graph-line-1 {
      fill: #{$color-black};
    }

    .graph-line-2 {
      fill: #{$color-black};
    }

    .graph-line-3 {
      fill: #0c152426;
    }
  }

  .complexityIcon--complex {
    .graph-line-1 {
      fill: #{$color-black};
    }

    .graph-line-2 {
      fill: #{$color-black};
    }

    .graph-line-3 {
      fill: #{$color-black};
    }
  }
</style>
