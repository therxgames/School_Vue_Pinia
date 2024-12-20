<template>
  <div class="input-simple">
    <div class="position-relative">
      <input
        ref="inputEl"
        v-model="inputValue"
        :placeholder="props.placeholder"
        autocomplete="off"
        :type="type"
        class="form-control input-simple-input"
        :class="{'input-simple-input-error': error}">
      <transition name="transition-fade">
        <svg-icon
          v-if="inputValue?.length"
          @click="resetInputValue"
          class="input-simple-resetIcon"
          name="cross"/>
      </transition>
    </div>
    <div
      v-if="error"
      class="input-simple-error"
      v-html="error"/>
  </div>
</template>

<script setup>
  const emit = defineEmits(['update:value']);

  const props = defineProps({
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    }
  });

  const inputValue = ref(props.value);

  watch(inputValue, () => {
    emit('update:value', inputValue.value);
  });

  watch(() => props.value, (val) => {
    inputValue.value = val;
  });

  const resetInputValue = () => inputValue.value = '';
</script>

<style lang="scss">
  .input-simple {
    position: relative;

    .input-simple-input {
      padding-right: 3em;
      padding-left: 1em;
      transition: 0.2s border-color;

      &.input-simple-input-error {
        border-color: #f85542;
      }
    }

    .input-simple-resetIcon {
      width: 0.625rem;
      position: absolute;
      right: 1rem;
      height: 100%;
      top: 0;
      cursor: pointer;
    }

    .input-simple-error {
      color: #f85542;
      font-size: 0.875rem;
      position: absolute;
    }
  }
</style>
