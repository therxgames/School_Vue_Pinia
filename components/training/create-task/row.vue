<template>
  <div :class="['training-create-task-row', {completed: row.completed === row.tasks_count}]">
    <svg-icon
      :class="[
        'training-create-task-row-btn-minus',
        { disabled: minusDisabled },
      ]"
      name="minus"
      @click="minus"/>
    <input
      ref="inputEl"
      type="text"
      @input="input"
      :value="inputValue"
      class="number-task">
    <svg-icon
      :class="['training-create-task-row-btn-plus', { disabled: plusDisabled }]"
      name="plus"
      @click="plus"/>

    <div
      ref="nameEl"
      class="form-row-check">
      <input-checkbox
        :label="row.name"
        :checked="checked"
        :id="'chb'+row.id"
        v-model:checked="checkedNew"/>
    </div>

    <span
      class="item-row-nums"
      ref="numsEl">
      {{ row.completed ? row.completed : 0 }}
      /
      <span
        class="item-row-num"
        @click="setMax">
        {{ row.tasks_count }}
      </span>
    </span>
    <svg-icon
      v-if="row.completed === row.tasks_count"
      class="training-create-task-row-check-circle training-create-task-row-check-circle--green"
      name="check-circle"/>
  </div>
</template>

<script setup>
  const emit = defineEmits(['change']);
  const props = defineProps({
    row: {
      type: Object,
      required: true
    }
  });

  const checkedNew = ref(false);
  watch(() => checkedNew.value, (val) => {
    checkboxChange(val.checked);
  });

  const numsEl = ref(null);
  const nameEl = ref(null);
  onMounted(() => {
    const $bootstrap = inject('$bootstrap');
    new $bootstrap.Tooltip(numsEl.value, {
      delay: 300,
      title: () => `Пройдено / Всего заданий`
    });

    const el = nameEl.value.querySelector('.form-check-label');
    new $bootstrap.Tooltip(el, {
      delay: {'show': 1500, 'hide': 50},
      title: () => props.row.name
    });
  });

  const inputEl = ref(null);
  const inputValue = ref(0);
  const input = (e) => {
    inputValue.value = e.target.value;
  };

  watch(() => props.row.tasks_count, (val) => {
    if (inputValue.value > val) inputValue.value = val;
  });

  watch(inputValue, (val) => {
    val = +(val.toString().replace(/\D/g, ''));
    if (val > props.row.tasks_count) val = props.row.tasks_count;
    inputValue.value = val;
    inputEl.value = val;
    emit('change', val);
  });

  const setMax = () => {
    inputValue.value = props.row.tasks_count;
  };

  const reset = () => {
    inputValue.value = 0;
  };

  defineExpose({
    setMax, reset
  });

  const checked = computed(() => {
    return inputValue.value > 0;
  });

  const checkboxChange = (payload) => {
    if (payload) {
      setMax();
    } else {
      reset();
    }
  };

  const minus = () => {
    if (inputValue.value > 0) {
      inputValue.value--;
    }
  };
  const minusDisabled = computed(() => inputValue.value === 0);

  const plus = () => {
    if (inputValue.value < props.row.tasks_count) {
      inputValue.value++;
    }
  };
  const plusDisabled = computed(() => {
    return inputValue.value === props.row.tasks_count;
  });
</script>

<style lang="scss">
  @import './assets/scss/theme';

  .training-create-task-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    user-select: none;

    &-btn-minus,
    &-btn-plus {
      cursor: pointer;
      stroke: #0c1524;

      &.disabled {
        cursor: auto;

        path {
          stroke: #ced6e0;
        }
      }
    }

    input.number-task {
      width: 48px;
      height: 36px;
      border: 1px solid #ced6e0;
      border-radius: 8px;
      margin: 0 14px;
      text-align: center;
      color: #0c1524;

      &:focus {
        outline: none;
      }
    }

    .form-row-check {
      margin-left: 40px;

      .form-check-label {
        max-width: 520px;
        display: inline-block !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .item-row-nums {
      color: #7f838a;

      &::before {
        content: '.';
        position: relative;
        top: -3px;
        margin-right: 7px;
        margin-left: 7px;
      }

      .item-row-num {
        cursor: pointer;

        &:hover {
          color: #0576ff;
        }
      }
    }

    .training-create-task-row-check-circle {
      width: 1.25rem;
      height: 1.25rem;
      margin-left: 0.25rem;

      &--green {
        color: #3db45a;
      }
    }

    input.form-check-input {
      width: 24px;
      height: 24px;
      margin-right: 0.5em;
      margin-top: 0;
      border: 1px solid #ced6e0;

      &:checked {
        border: none;
      }
    }

    &.completed {
      .item-row-nums {
        .item-row-num {
          cursor: unset;
        }
      }
    }
  }
</style>
