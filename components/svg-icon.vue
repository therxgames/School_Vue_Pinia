<template>
  <div
    ref="iconContainer"
    v-if="icon"
    class="svg-icon svg-icon-default"
    v-html="icon"
    @click="emit('click')"/>
</template>

<script setup>
  import {icons} from '#imports';

  const emit = defineEmits(['click']);
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    fill: {
      type: String,
      default: 'currentColor'
    }
  });
  const iconContainer = ref(null);
  const icon = computed(() => {
    return icons[props.name];
  });

  onMounted(() => {
    watch(
      () => props.fill,
      (fill) => {
        if (iconContainer.value) {
          iconContainer.value.style.setProperty('--fill', fill || 'currentColor');
        }
      },
      {immediate: true}
    );
  });
</script>

<style lang="scss">
  @import './assets/scss/theme';

  .svg-icon {
    --svg-icon-width: 1.375em;
    --svg-icon-height: 1.375em;

    width: var(--svg-icon-width);
    height: var(--svg-icon-height);
    align-items: center;
    justify-content: center;
    display: inline-block;
  }

  .svg-icon-default {
    --fill: currentcolor;

    line-height: 1;
    display: flex;
    align-items: center;

    svg {
      transition: $transition;
      display: block;
      fill: var(--fill);
      width: 100%;
      height: 100%;
    }
  }

  .svg-size-1-em {
    --svg-icon-width: 1em;
    --svg-icon-height: 1em;
  }
</style>
