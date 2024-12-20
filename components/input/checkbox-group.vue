<template>
  <div
    :class="['checkbox-group--theme-' + props.theme, {'disabled': props.disabled}]"
    class="checkbox-group">
    <div
      v-if="props.type === 'button'"
      class="checkbox-group-button">
      <div
        v-for="(item, index) in props.list"
        :key="index"
        class="checkbox-group-button-item">
        <input
          type="checkbox"
          class="btn-check checkbox-group-button-input"
          autocomplete="off"
          :class="{'disabled': item.disabled}"
          :id="inputId(index)"
          :value="item.id"
          :checked="isChecked(item)"
          @change="onChange(item, $event)">
        <label
          class="btn checkbox-group-button-btn"
          :class="{'disabled': item.disabled}"
          :for="inputId(index)"
          :id="inputId(index)">
          {{ item[props.nameField] }}
        </label>
      </div>
    </div>
    <div
      v-if="props.type === 'checkbox'"
      class="checkbox-group-checkbox">
      <input-checkbox
        v-for="(item, index) in props.list"
        :key="index"
        :label="item[props.nameField]"
        :value="item"
        :id="inputId(index)"
        :checked="isChecked(item)"
        @change="onChange"/>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: 'checkbox'
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    theme: {
      type: String,
      default: 'default'
    },
    nameField: {
      type: String,
      default: 'name'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });
  const uuid = generateString();
  const inputId = computed(() => (index) => 'checkbox-' + uuid + '-' + index);

  const isChecked = (item) => {
    return props.value?.includes(item.id);
  };
  const onChange = (item, $event) => {
    let selectedItem = props.value;

    $event.target.checked
      ? selectedItem.push(item.id)
      : selectedItem.splice(selectedItem.indexOf(item.id), 1);

    emit('update:value', selectedItem);
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .checkbox-group-button {
    &-btn {
      --bs-btn-bg: #fff;
      --bs-btn-padding-x: 0.938rem;
      --bs-btn-border-color: #DDDEE0;
      --bs-btn-color: #{$color-black};
      --bs-btn-hover-color: #{$color-black};
      --bs-btn-hover-border-color: #{$color-dark};
      --bs-btn-hover-bg: #fff;
      --bs-btn-active-border-color: #0576FF;
      --bs-btn-active-bg: #0576FF;
      --bs-btn-disabled-bg: #f2f5fa;
      --bs-btn-disabled-border-color: #ced6e0;
      --bs-btn-active-color: #fff;

      &:hover {
        --bs-btn-bg: rgb(240 242 252);
        --bs-btn-border-color: #c5d0ff;
        --bs-btn-active-bg: rgb(37, 76, 232)
      }
    }
  }

  .checkbox-group-checkbox {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .checkbox-group--theme-gaped,
  .checkbox-group--theme-default {
    .checkbox-group-button {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }

  .size-big {
    .checkbox-group-button-btn {
      font-size: 18px;
      line-height: 165%;
      letter-spacing: -0.2px;
      font-weight: 500;
      border-radius: 12px;
      padding: 11px 20px;
    }
  }
</style>
