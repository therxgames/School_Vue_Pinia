<template>
  <div class="counter">
    <div class="counter-controls">
      <div class="counter-controls-symbol counter-controls-minus">
        <button
          class="counter-controls-symbol-button counter-controls-minus-button"
          @click="countDecrement(item.id)"
          :class="{ 'counter-controls-symbol-disabled': item.counter === 0 }"
          :disabled="item.counter === 0"
        >
          <svg-icon name="minus" />
        </button>
      </div>

      <div class="counter-controls-number">
        <input
          class="counter-controls-number-input"
          type="number"
          v-model="item.counter"
          @input="(e) => countChange(e.target.value, item.id)"
        />
      </div>

      <div class="counter-controls-symbol counter-controls-plus">
        <button
          class="counter-controls-symbol-button counter-controls-plus-button"
          @click="countIncrement(item.id)"
          :class="{
            'counter-controls-symbol-disabled': item.counter >= item.maxCount,
          }"
          :disabled="item.counter >= item.maxCount"
        >
          <svg-icon name="plus" />
        </button>
      </div>
    </div>

    <div class="counter-themes">
      <div class="counter-themes-checkbox">
        <input
          class="counter-themes-checkbox-input"
          :id="uniqueId"
          type="checkbox"
          v-model="item.checked"
          @change="selectAllTask(item.id)"
        />

        <label :for="uniqueId">
          {{ item.label }}
        </label>
      </div>

      <div class="counter-themes-circle" />

      <div class="counter-themes-result">
        <p class="counter-themes-result-text">
          {{ item.counter }}/{{ item.maxCount }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { uuid } from "vue-uuid";
import useMajorThemesStore from "~/stores/major-themes";

const { countIncrement, countDecrement, selectAllTask, countChange } =
  useMajorThemesStore();

const uniqueId = uuid.v1();

const props = defineProps({
  item: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.counter {
  display: flex;
  align-items: center;
  gap: 16px;

  &-controls {
    display: flex;
    gap: 4px;

    &-symbol {
      display: flex;
      align-items: center;

      &-button {
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        stroke: #0c1524;

        &:hover:enabled {
          background: #fff;
          border-radius: 4px;
        }
      }

      &-disabled {
        stroke: #93979e;
      }
    }

    &-number {
      &-input {
        width: 47px;
        height: 35px;
        text-align: center;
        border-radius: 6px;
        border: none;

        &:focus {
          outline: none;
          border: 1px solid #7f838a;
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }

  &-themes {
    display: flex;
    align-items: center;
    gap: 8px;

    &-checkbox {
      display: flex;
      align-items: center;

      &-input {
        position: absolute;
        z-index: -1;
        opacity: 0;

        & + label {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          user-select: none;
        }

        & + label::before {
          content: "";
          display: inline-block;
          width: 24px;
          height: 24px;
          border: 1px solid #0c1524;
          border-radius: 6px;
          margin-right: 8px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 60% 60%;
        }

        &:checked + label::before {
          border: 0;
          background-color: #0576ff;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' stroke-width='0.5' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
        }
      }
    }

    &-circle {
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: #0c1524;
    }

    &-result {
      &-text {
        color: #93979e;
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
