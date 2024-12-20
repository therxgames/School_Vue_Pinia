<template>
  <div
    class="checkbox"
    :class="{'checkbox-disabled':disabled}">
    <div class="checkbox-control">
      <input
        class="checkbox-input"
        type="checkbox"
        autocomplete="off"
        :id="id"
        :checked="checked"
        :disabled="disabled"
        @change="onChange($event)">
      <svg-icon
        class="checkbox-icon"
        name="input-checkbox"/>
    </div>
    <label
      class="form-check-label d-flex align-items-center checkbox-label"
      :for="id">
      {{ props.label }}
      <slot name="labelAfter"/>
    </label>
  </div>
</template>

<script setup>
  const emit = defineEmits(['update:checked', 'change']);

  const props = defineProps({
    checked: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Object, Array],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'checkbox-' + generateString()
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const onChange = ($event) => {
    emit('change', props.value, $event);
    emit('update:checked', {
      value: props.value,
      checked: $event.target.checked,
      $event
    });
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .checkbox {
    position: relative;
    display: flex;
    align-items: center;

    &-control {
      position: relative;
      width: 1.25rem;
      height: 1.25rem;
    }

    &-input {
      opacity: 0;
      margin-left: 0 !important;
      float: none !important;
      width: 100%;
      height: 100%;
      line-height: 1;
      z-index: 5;
      position: relative;
      margin-top: 0;
      display: block;
    }

    &-icon {
      width: 1.25rem;
      height: 1.25rem;
      position: absolute;
      top: 0;
      left: 0;

      svg {
        overflow: visible;
      }

      .input-checkbox-bg {
        opacity: 1;
        transition: all 250ms ease-out;
        fill: #fff;
      }

      .input-checkbox-mark {
        opacity: 0;
        transform: scale(1.5);
        transform-origin: center center;
        transition: all 250ms ease-out;
        transition-delay: 80ms;
      }

      .input-checkbox-border {
        transform-origin: center center;
        transition: $transition;
      }
    }

    &-label {
      user-select: none;
      padding-left: 0.5rem;
    }

    &-input:checked + &-icon {
      .input-checkbox-bg {
        opacity: 1;
        fill: $color-blue-normal;
      }

      .input-checkbox-mark {
        opacity: 1;
        transform: scale(1);
      }

      .input-checkbox-border {
        transform: scale(1.5);
        fill: rgba(0, 0, 0, 0);
      }
    }

    .form-check-label {
      cursor: pointer;
    }

    &-disabled {
      .form-check-label {
        cursor: auto;
      }

      .checkbox-icon {
        opacity: 0.5;
      }
    }
  }
</style>
