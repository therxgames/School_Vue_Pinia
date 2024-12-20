<template>
  <div
    :class="[{'input-switch--checked': isChecked}]"
    class="input-switch">
    <input
      class="input-switch-input"
      :id="id"
      type="checkbox"
      role="switch"
      :checked="props.value"
      @change="onChange">
    <svg-icon
      class="input-switch-svg"
      name="input-switch"/>
    <label
      class="input-switch-label"
      :for="id">
      {{ label }}
    </label>
  </div>
</template>

<script setup>
  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  });

  const isChecked = ref(props.value);
  const id = 'switch-' + generateString();

  const onChange = ($event) => {
    isChecked.value = $event.target.checked;
    emit('update:value', $event.target.checked);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .input-switch {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .input-switch-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
  }

  .input-switch-label {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
    color: $color-normal;
  }

  .input-switch--checked .input-switch-label {
    color: $color-black;
  }

  .input-switch-svg {
    width: 2.5rem;
    height: 1.5rem;
    pointer-events: none;
    position: relative;
    top: 0.2rem;
  }

  .input-switch-svg .input-switch-bg,
  .input-switch-svg .input-switch-mark {
    transition: $transition;
  }

  .input-switch-input:checked + .input-switch-svg .input-switch-mark {
    transform: translateX(15px);
  }
</style>
