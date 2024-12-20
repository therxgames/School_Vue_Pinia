<template>
  <div
    :class="{ 'flags-disabled pe-none': disabled }"
    class="d-flex justify-content-between mt-5 mb-5"
  >
    <div class="d-flex gap-4">
      <p class="mb-0">
        <span v-if="!!count">
          Найдено
          {{ count }}
          {{ declination("событие", "события", "событий", count) }}</span
        >
        <span v-else>Ничего не найдено</span>
      </p>
      <a
        v-if="showReset"
        class="d-flex align-items-center"
        href="#"
        @click="handleReset"
        >Сбросить<svg-icon
          name="cross"
          class="ms-2"
          style="width: 0.7rem; height: 0.7rem"
      /></a>
    </div>

    <div class="d-flex align-items-center">
      <div class="ms-3 gap-3 d-flex align-items-center">
        <div data-bs-toggle="dropdown" data-bs-offset="0,5">
          <div
            class="d-flex gap-2 align-items-center flags-dropdown__head"
            role="button"
          >
            <span>По {{ findTextById(sortId, sortList) }}</span>
            <svg-icon name="arrow-bottom" class="dropdown-arrow" />
          </div>
          <div class="dropdown-menu animation slide-in shadow flags-dropdown">
            <p class="flags-dropdown__text text-center mt-2 mb-3">
              Сортировка по
            </p>
            <hr class="hr mb-1 mt-1" />
            <div v-for="({ id, title }, index) of sortList" :key="id">
              <a
                :class="{ 'mt-1': index !== 0 }"
                class="btn btn-primary w-100"
                href="#"
                @click="handleSortingBy(id)"
              >
                {{ title }}
              </a>
            </div>
          </div>
        </div>
        <div
          :class="{ 'is-active': isSortingOrder }"
          class="flags-sort text-primary"
          role="button"
          @click="handleSortingOrder"
        >
          <svg-icon name="sorting" />
        </div>
      </div>
      <div class="ms-3">
        <input-checkbox
          label="Онлайн"
          id="online"
          :checked="isOnline"
          @update:checked="handleOnline($event)"
        />
      </div>
      <div class="d-flex gap-3 ms-5">
        <div
          :class="[{ 'pe-none is-active': activeMode === 'list' }]"
          class="mode-icon"
          role="button"
          @click="setViewMode('list')"
        >
          <svg-icon name="menu-list" style="width: 1rem: height: 1rem" />
        </div>
        <div
          :class="[{ 'pe-none is-active': activeMode === 'tile' }]"
          class="mode-icon"
          role="button"
          @click="setViewMode('tile')"
        >
          <svg-icon name="menu" style="width: 1rem: height: 1rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findTextById, sortList } from "./helpers";
import { TMode } from "../types";
import useCalendareStore from "~/stores/calendar";

type TFlags = {
  count?: number | null;
  sortId: string;
  showReset?: boolean;
  disabled?: boolean;
};

defineProps<TFlags>();

const modeCalendar = useModeCalendar();
const calendarStore = useCalendareStore();

const emit = defineEmits([
  "onSortingOrder",
  "onSortingBy",
  "onChangeOnline",
  "onResetAll",
]);

const isOnline = ref(false);
const isSortingOrder = ref(false);

const modeCookie = useCookie<TMode>("calendarMode");

const activeMode = ref<TMode>(modeCookie.value || "list");

const setViewMode = (mode: TMode) => {
  activeMode.value = mode;
  modeCookie.value = mode;

  modeCalendar.value = mode;
};

const handleSortingOrder = () => {
  isSortingOrder.value = !isSortingOrder.value;
  emit("onSortingOrder", isSortingOrder.value);
};

const handleSortingBy = (id: string) => {
  emit("onSortingBy", id);
  isSortingOrder.value = false;
};

const handleOnline = (value: any) => {
  emit("onChangeOnline", value.checked);

  isOnline.value = value.checked;
};

const handleReset = () => {
  isOnline.value = false;
  isSortingOrder.value = false;

  emit("onResetAll");
};

onMounted(() => {
  eventBus.on("badge-delete-online", handleDeleteOnline);
  const sortValue = calendarStore.sort;

  if (sortValue && sortValue[0] === "-") {
    isSortingOrder.value = true;
  }

  if (calendarStore.filters.online) {
    isOnline.value = true;
  }
});

onUnmounted(() => {
  eventBus.off("badge-delete-online", handleDeleteOnline);
});

const handleDeleteOnline = () => {
  isOnline.value = false;
  emit("onChangeOnline", isOnline.value);
};


</script>

<style lang="scss" scoped>
.flags-sort,
.mode-icon {
  .svg-icon {
    --svg-icon-width: 1rem;
    --svg-icon-height: 1rem;
  }
}

.flags-sort:not(.is-active),
.show .dropdown-arrow {
  transform: rotate(-180deg);
}
.dropdown-arrow {
  transition: transform 350ms ease-out;
  --svg-icon-width: 0.7rem;
  --svg-icon-height: 0.7rem;
}

.flags-dropdown {
  padding: 8px;

  &__text {
    color: rgb(147, 151, 158);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

.flags-disabled {
  opacity: 0.5;
}
</style>
