<template>
  <nuxt-link
    :to="props.data.link?.href"
    class="tag"
    :class="{'tag-outline': outline, 'tag-no-hover': noHover}"
    @click="onClick">
    {{ props.data.name }}
  </nuxt-link>
</template>

<script setup>
  const props = defineProps({
    outline: Boolean,
    noHover: Boolean,
    data: {
      type: Object,
      required: true
    }
  });
  const emit = defineEmits(['click']);
  const link = computed(() => {});

  const getContext = () => {
    return {...props.data};
  };
  const onClick = () => {
    emit('click', getContext());
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .tag {
    font-size: 0.875rem;
    cursor: pointer;
    border-radius: 0.5rem;
    background: $color-black-10;
    padding: 0.43rem 0.68rem;
    white-space: nowrap;
    transition: $transition;
    color: $color-black;

    &:hover {
      color: $color-black;
      background: $color-blue-light;
    }
  }

  .tag-outline {
    background-color: #fff;
    border: 1px solid #DDDEE0;
  }

  .tag-no-hover {
    pointer-events: none;
  }
</style>
