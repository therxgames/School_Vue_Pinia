<template>
  <div
    @click="onClick"
    class="input-btn btn btn-simple"
    :class="[{'input-btn--with-icon': !!iconName}, {'input-btn--toggled': props.isToggled}, {'disabled': props.disabled}]">
    <svg-icon
      v-if="iconName"
      class="input-btn-icon"
      :name="iconName"/>
    <span>{{ props.title }}</span>
    <slot name="after"/>
  </div>
</template>

<script setup>
  const emit = defineEmits(['update:isToggled', 'click', 'change']);

  const props = defineProps({
    isToggled: {
      type: Boolean,
      default: false
    },
    isToggle: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const onClick = () => {
    emit('change', !props.isToggled);
    emit('update:isToggled', !props.isToggled);
    emit('click');
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .input-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    &-icon {
      display: flex;
      line-height: 1;
      flex-shrink: 0;
      width: 1.1em;
      height: 1.1em;
      align-items: center;
    }

    &-count {
      font-size: 0.875rem;
      background: $color-blue-normal;
      color: #fff;
      width: 1.4rem;
      height: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;

      &:empty {
        display: none;
      }
    }

    &--with-icon {
      align-items: center;
      gap: 0.813em;
    }

    &--toggled:not(.theme-filter) {
      --bs-btn-bg: #{$color-blue-light-10};
      --bs-btn-border-color: #{$color-blue-light-20};
      --bs-btn-color: #{$color-black};
    }
  }

  .btn.theme-filter {
    border-color: #c5d0ff;
    color: rgb(37 76 232);

    &:hover {
      color: #fff;
      border-color: rgb(40 118 251);
      background-color: rgb(40 118 251);
    }

    .input-btn-count {
      color: rgb(12 21 36);
      background-color: rgb(243 243 241);
    }
  }
</style>
