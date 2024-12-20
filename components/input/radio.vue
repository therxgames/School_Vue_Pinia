<template>
  <div
    :class="[{'radio--checked': props.checked}]"
    class="radio">
    <div class="radio-control">
      <input
        type="radio"
        class="radio-input"
        autocomplete="off"
        :name="props.name"
        :id="props.id"
        :checked="checked"
        @change="onChange($event)">
      <svg-icon
        class="radio-icon"
        name="input-radio"/>
    </div>
    <label
      class="form-check-label d-flex align-items-center radio-label"
      :for="props.id">
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
    name: {
      type: String,
      default: 'group-' + generateString()
    }
  });

  const onChange = ($event) => {
    emit('change', props.value, $event);
    emit('update:checked', props.value, $event.target.checked);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .radio {
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

      .input-radio-bg {
        opacity: 1;
        transition: all 250ms ease-out;
        fill: #fff;
      }

      .input-radio-mark {
        opacity: 0;
        transform: scale(1.5);
        transform-origin: center center;
        transition: all 250ms ease-out;
        transition-delay: 80ms;
      }

      .input-radio-border {
        transform-origin: center center;
        transition: $transition;
      }
    }

    &-label {
      user-select: none;
      padding-left: 1rem;
    }

    &-input:checked + &-icon {
      .input-radio-bg {
        opacity: 1;
        fill: $color-blue-normal;
      }

      .input-radio-mark {
        opacity: 1;
        transform: scale(1);
      }

      .input-radio-border {
        transform: scale(1.5);
        fill: rgba(0, 0, 0, 0);
      }
    }
  }
</style>
