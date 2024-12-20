<template>
  <div
    :class="['radio-group--theme-' + props.theme]"
    class="radio-group">
    <div
      v-if="props.type === 'button'"
      class="radio-group-button btn-group">
      <template v-for="(item, index) in processedList">
        <input
          :key="index + '-1'"
          v-if="item.hidden !== true"
          type="radio"
          class="btn-check"
          :name="item.name"
          :id="inputId(index)"
          :value="item.id"
          :checked="isChecked(item)"
          autocomplete="off"
          :disabled="props.disabled"
          @click="($event) => onClick(item, $event)"
          @change="($event) => onChange(item, $event)">
        <label
          :key="index + '-2'"
          v-if="item.hidden !== true"
          :class="[{'disabled': item.disabled}, labelClassNames]"
          :for="inputId(index)"
          class="radio-group-button-label btn text-nowrap btn-outline-primary">
          {{ item.name }}
        </label>
      </template>
    </div>
    <div
      v-if="props.type === 'radio'"
      class="radio-group-radio">
      <input-radio
        v-for="(item, index) in props.list"
        :key="index"
        :name="item.name"
        :label="item[props.nameField]"
        :value="item"
        :id="inputId(index)"
        :checked="isChecked(item)"
        @change="onChange" />
    </div>
    <div
      v-if="props.type === 'button-swap'"
      class="radio-group-button-swap btn-group-swap">
      <template v-for="(item, index) in processedList">
        <input
          :key="index + '-1'"
          v-if="item.hidden !== true"
          type="radio"
          class="btn-check"
          :name="item.name"
          :id="inputId(index)"
          :value="item.id"
          :checked="isChecked(item)"
          autocomplete="off"
          :disabled="props.disabled"
          @click="($event) => onClick(item, $event)"
          @change="($event) => onChange(item, $event)">
        <label
          :key="index + '-2'"
          v-if="item.hidden !== true"
          :class="[{'disabled': item.disabled}, labelClassNames]"
          :for="inputId(index)"
          class="radio-group-button-label-swap btn text-nowrap btn-outline-primary">
          {{ item.name }}
        </label>
      </template>
    </div>
  </div>
</template>

<script setup>
import useUserStore from '~/stores/user'

const userStore = useUserStore()
const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: [Number, String],
    validator (value) {
      return true
    }
  },
  type: {
    type: String,
    default: 'radio'
  },
  list: {
    type: Array,
    default: () => []
  },
  theme: {
    type: String,
    default: 'default'
  },
  nameField: {
    type: String,
    default: 'name'
  },
  resettable: {
    type: Boolean,
    default: false
  },
  resettableValue: {
    default: null
  },
  labelClassNames: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const uuid = generateString()
const inputId = computed(() => (index) => 'radio-' + uuid + '-' + index)
const processedList = computed(() => {
  return props.list.filter((item) => {
    let renderable = true

    if (item.authOnly === true && !userStore.logged) {
      renderable = false
    }

    return renderable
  })
})
const lastValue = ref(props.value)

const isChecked = (item) => {
  return props.value === item.id
}
const onChange = (item, $event) => {
  lastValue.value = item.id
  emit('update:value', item.id)
}
const onClick = async (item, $event) => {
  await nextTick()
  if (props.resettable) {
    if (lastValue.value === item.id) {
      emit('update:value', props.resettableValue)
    }
  }
}
</script>

<style lang="scss">
@import '/assets/scss/theme';

.radio-group {
  position: relative;
}

.radio-group-button {
  &-label {
    --bs-btn-active-border-color: #a2cdff;
    --bs-btn-active-color: #{$color-black};
    --bs-btn-active-bg: #{$color-blue-light};
    --bs-btn-border-color: #{$color-dark-light};
    --bs-btn-color: #{$color-black};
    --bs-btn-padding-x: 1rem;

    min-width: 5rem;

    &:hover {
      border-color: $color-dark !important;
      z-index: 30 !important;
    }

    &.disabled {
      background: #f2f5fa !important;
      border-color: #ced6e0 !important;
      color: #7f838a !important;
    }
  }
}

.radio-group-radio {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.radio-group--theme-impact {
  padding: 0.2rem;
  border-radius: 0.6rem;
  background: #f5f5f5;
}

.radio-group--theme-impact label {
  --bs-btn-color: #{$color-dark};
  --bs-btn-border-color: transperent;
  --bs-btn-active-border-color: transperent;
  --bs-btn-active-color: #{$color-black};
  --bs-btn-active-bg: #fff;
  --bs-btn-padding-y: 0.35rem;

  font-weight: 500;
  border-radius: $border-radius !important;
  min-width: 7.5rem;
}

.radio-group--theme-gaped {
  gap: 0.5rem;
}

.radio-group--theme-gaped label {
  border-radius: var(--bs-btn-border-radius) !important;
}

.radio-group--theme-gaped .btn-group {
  gap: 0.5rem;
}

.radio-group--theme-sheet {
  width: 100%;

  .radio-control {
    display: none;
  }

  .radio-group-radio {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }

  label {
    cursor: pointer;
    padding: 0;
    border-bottom: 2px solid transparent;
    transition: $transition;
    z-index: 5;
    padding-bottom: 10px;
  }

  .radio--checked .radio-label {
    border-bottom: 2px solid $color-blue-normal;
  }

  .radio--checked label {
    color: $color-blue-normal;
  }
}

.radio-group--theme-sheet.radio-group::after {
  content: '';
  width: 100%;
  height: 1px;
  background: $color-normal;
  position: absolute;
  bottom: 1px;
}

.btn-group-swap {
  display: flex;
  border: 1px solid #DDDEE0;
  background: #F3F3F1;
  overflow: hidden;
  border-radius: 12px;
}

.radio-group-button-label-swap {
  --bs-btn-active-border-color: #F3F3F1;
  --bs-btn-active-color: #{$color-black};
  --bs-btn-active-bg: #{$color-white};
  --bs-btn-border-color: inherit;
  --bs-btn-color: #{$color-black};
  --bs-btn-padding-x: 20px;
  --bs-btn-active-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.20) !important;
  --bs-btn-active-border-radius: 10px;
  padding: 8px 20px !important;
  line-height: 160%;
}
</style>
