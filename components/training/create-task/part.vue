<template>
  <div
    class="create-task-part"
    :class="{['no-parts']: ctStore.noParts}">
    <div class="part-header">
      <div class="part-header-left-block">
        <span class="part-header-title">{{ part.title }}</span>
        <span
          class="collapsed-badge"
          v-if="collapsed">Выбрано {{ ctStore.partTaskSum(part.id) }} из {{ tasksSum }}</span>
        <span
          class="part-header-tasks"
          v-if="!collapsed">{{ ctStore.partTaskSum(part.id) }} шт.</span>
        <span
          v-if="!single"
          class="icon-wrapper"
          @click="collapse">
          <svg-icon
            name="arrow-bottom"
            :class="['collapse-icon', {collapsed}]"/>
        </span>
      </div>
      <div class="part-header-right-block">
        <span class="part-header-right-block-themes">{{ themesSum }} тем{{
            declension(themesSum, ['а', 'ы', ''])
          }}</span>
        <span class="part-header-right-block-tasks">{{ tasksSum }} задан{{
            declension(tasksSum, ['ие', 'ия', 'ий'])
          }}</span>

        <span
          v-if="someCompleted"
          class="part-header-right-block-show-ready">
          <input-checkbox
            label="Показывать выполненные"
            :checked="true"
            :id="'showCompleted'+part.id"
            v-model:checked="showReady"/>
        </span>

        <span class="part-header-right-block-select-all">
          <input-checkbox
            label="Выбрать все"
            :checked="selectAll.checked"
            :id="'selectAll'+part.id"
            v-model:checked="selectAll"/>
        </span>
      </div>
    </div>

    <div v-show="!collapsed">
      <div
        v-if="partCompleted && !showReady.checked"
        class="part-finished">
        Вы справились со всем заданиями
      </div>
      <template v-else>
        <training-create-task-row
          v-for="item in filtredPart.items"
          :key="item.id"
          ref="rows"
          :row="item"
          @change="changeRowTask(item, $event)"/>
      </template>

      <div class="part-reset">
        <svg-icon name="cross"/>
        <span @click="reset">Сбросить</span>
      </div>
    </div>

    <div
      v-if="!last"
      class="part-line"/>
  </div>
</template>

<script setup>
import useCreateTaskStore from '~/stores/create-task';

const ctStore = useCreateTaskStore();
const props = defineProps({
  part: {
    type: Object,
    required: true
  },
  last: {
    type: Boolean,
    default: false
  },
  single: {
    type: Boolean,
    required: true
  }
});
const collapsed = ref(false);
const someCompleted = computed(() => props.part.items.some((item) => item.completed));
const showReady = ref({checked: true});

const selectAll = ref({checked: false});
const rows = ref(null);

watch(selectAll, (val) => {
  if (val.checked) {
    rows.value.forEach((row) => row.setMax());
  } else {
    reset();
  }
});

watch(showReady, (val) => {
  ctStore.setShowReady(props.part.id, val.checked);

  const sum = filtredPart.value.items.reduce((acc, row) => acc + row.tasks_count, 0);
  selectAll.value.checked = ctStore.partTaskSum(props.part.id) === sum;
});

const partCompleted = computed(() => {
  return props.part.items.every((row) => row.completed === row.tasks_count);
});

const reset = () => {
  rows.value.forEach((row) => row.reset());
};

const collapse = () => {
  collapsed.value = !collapsed.value;
};


const filtredPart = computed(() => {
  if (!showReady.value.checked) {
    const part = reactive({
      ...props.part,
      items: props.part.items
      .filter((item) => item.tasks_count !== item.completed)
      .map((item) => {
        if (item.completed) {
          item = {...item};
          item.tasks_count = item.tasks_count - item.completed;
          item.completed = 0;
        }
        return item;
      })
    });

    return part;
  }

  return props.part;
});

const themesSum = computed(() => {
  if (filtredPart.value.items) {
    return filtredPart.value.items.length;
  }

  return 0;
});

const tasksSum = computed(() => {
  if (filtredPart.value.items) {
    return filtredPart.value.items.reduce((acc, item) => {
      if (item.tasks_count) return acc + item.tasks_count;
      return acc;
    }, 0);
  }

  return 0;
});


const changeRowTask = (item, value) => {
  ctStore.changeRowTask({
    partId: props.part.id,
    rowId: item.id,
    value
  });
};

watch(() => ctStore.partTaskSum(props.part.id), (val) => {
  const sum = filtredPart.value.items.reduce((acc, row) => {
    return acc + row.tasks_count;
  }, 0);
  selectAll.value.checked = val === sum;
});


</script>

<style lang="scss">
@import './assets/scss/theme';

.create-task-part {
  user-select: none;

  &.no-parts {
    .part-header-title {
      display: none;
    }

    .part-header-tasks {
      &::before {
        display: none;
      }
    }
  }

  .part-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    font-size: 14px;

    .part-header-left-block {
      display: flex;
      align-items: center;
      line-height: 24px;

      .part-header-title {
        font-size: 16px;
        font-weight: 500;
      }

      .part-header-tasks {
        color: $color-dark;

        &::before {
          content: '.';
          position: relative;
          top: -3px;
          margin-right: 7px;
          margin-left: 15px;
        }
      }

      .icon-wrapper {
        padding: 0 11px;
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;

        .collapse-icon {
          width: 10px;
          height: 5px;
          display: inline-block;
          transform: scaleY(-1);

          &.collapsed {
            transform: scaleY(1);
          }
        }
      }

      .collapsed-badge {
        background-color: $color-blue-light-10;
        margin-left: 0.5rem;
        padding: 1px 8px;
        border-radius: 6px;
      }
    }

    .part-header-right-block {
      display: flex;
      align-items: center;

      &-themes {
        color: #7f838a;
        margin-right: 7px;

        &::after {
          content: '.';
          display: inline-block;
          color: black;
          padding-left: 7px;
          position: relative;
          top: -3px;
        }
      }

      &-tasks {
        color: #7f838a;
        margin-right: 24px;
      }

      &-show-ready,
      &-select-all {
        margin-right: 16px;
      }

      input.form-check-input {
        width: 20px;
        height: 20px;
        margin-right: 0.5em;
        margin-top: 0;

        &:checked {
          border: none;
        }
      }
    }
  }

  .part-reset {
    margin-top: 25px;
    color: #0576ff;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    span {
      cursor: pointer;
    }

    .svg-icon {
      width: 1rem;
      height: 1rem;
    }

    &:hover {
      color: $color-blue-normal;
    }
  }

  .part-line {
    height: 1px;
    background-color: #ced6e0;
    margin: 32px 0;
  }

  .part-finished {
    padding: 72px 0;
    text-align: center;
  }
}
</style>
