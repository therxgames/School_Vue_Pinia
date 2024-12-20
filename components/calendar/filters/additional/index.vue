<template>
  <div class="pt-4">
    <div class="row">
      <div class="col-4 col-lg-2 d-flex align-items-center">Классы</div>
      <div class="col-8 col-lg-9">
        <div class="w-25">
          <input-select-multi
            :is-only-place-holder="true"
            placeholder="Классы"
            when-select-all-placeholder="Классы"
            :list="optionsClasses"
            v-model:value="selectClasses"
            @update:value="
              (selectState) =>
                selectAddValueToFilter(
                  selectState,
                  'class',
                  optionsClasses,
                  calendarStore.setFilterByKey
                )
            "
          />
        </div>
      </div>
    </div>
  </div>
  <div class="pt-4">
    <div class="row">
      <div class="col-4 col-lg-2 d-flex align-items-center">
        Уровень события
      </div>
      <div class="col-8 col-lg-9">
        <input-radio-group
          type="button"
          theme="gaped"
          class="theme-border-light"
          @update:value="(id: number) => {isEventRadio = id, onChangeFindValue(id, eventLevels, 'code', 'eventLevel')}"
          :list="eventLevels"
          v-model:value="isEventRadio"
        />
      </div>
    </div>
  </div>
  <div class="pt-4">
    <div class="row">
      <div class="col-4 col-lg-2 d-flex align-items-center">
        Уровень олимпиад
      </div>
      <div class="col-8 col-lg-9">
        <input-radio-group
          type="button"
          theme="gaped"
          class="theme-border-light"
          @update:value="(id: number) => {isOlympiadRadio = id, calendarStore.setFilterByKey('olympiadLevel', id)}"
          :list="olympiadLevel"
          v-model:value="isOlympiadRadio"
        />
      </div>
    </div>
  </div>
  <div class="pt-4">
    <input-checkbox
      label="Включая прошедшие"
      id="past"
      :checked="isPast"
      @update:checked="handlePast($event)"
    />
  </div>
  <div v-if="isButtonSlot" class="pt-5">
    <slot name="button"/>
  </div>
  <hr class="hr mb-0 mt-4"/>
</template>

<script setup lang="ts">
import useCalendareStore from "~/stores/calendar";
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import {TEvent} from "../types";
import {getIdArrayByList, getRadioId, olympiadLevel, selectAddValueToFilter,} from "../helper";

type TAdditional = {
  resetState: boolean;
  optionsClasses: TEvent[];
  eventLevels: TEvent[];
};

const calendarStore = useCalendareStore();
const dictionariesStore = useDictionariesCalendar();

const props = defineProps<TAdditional>();

const slots = useSlots();
const isButtonSlot = computed(() => !!slots.button);

const selectClasses = ref<Array<TEvent | number>>([]);
const isPast = ref(false);
const isEventRadio = ref<number>();
const isOlympiadRadio = ref<number>();

const onChangeFindValue = (
  id: number,
  list: TEvent[],
  key: string,
  filterKey: string
) => {
  const valueFilter = getKeyFromAnArray(id, list, key);

  if (valueFilter) {
    calendarStore.setFilterByKey(filterKey, valueFilter);
  }
};

const handlePast = ($event: any) => {
  calendarStore.setFilterByKey("all", $event.checked || null);
  isPast.value = $event.checked;
};

const resetFilters = () => {
  selectClasses.value = [];
  isPast.value = false;
  isEventRadio.value = undefined;
  isOlympiadRadio.value = undefined;
};

watch(
  () => props.resetState,
  (newValue) => {
    if (!newValue) {
      resetFilters();
    }
  }
);

watch(
  () => props.optionsClasses,
  () => {
    if (calendarStore.filters?.class) {
      const idArray = getIdArrayByList(
        calendarStore.filters.class,
        props.optionsClasses,
        "code"
      );

      selectClasses.value = [...idArray];
    }
  }
);

watch(
  () => props.eventLevels,
  () => {
    if (calendarStore.filters?.eventLevel) {
      isEventRadio.value = getRadioId(
        calendarStore.filters?.eventLevel,
        props.eventLevels,
        "code"
      );
    }
  }
);

onMounted(() => {
  eventBus.on("badge-delete-class", handleDeleteClassList);
  eventBus.on("badge-delete-event-level", handleDeleteEventLevel);
  eventBus.on("badge-delete-olympiad-level", handleDeleteOlympiadLevel);
  eventBus.on("badge-delete-all", handleDeleteAll);

  if (calendarStore.filters?.all) {
    isPast.value = true;
  }

  if (calendarStore.filters?.olympiadLevel) {
    isOlympiadRadio.value = Number(calendarStore.filters.olympiadLevel);
  }
});

onUnmounted(() => {
  eventBus.off("badge-delete-class", handleDeleteClassList);
  eventBus.off("badge-delete-event-level", handleDeleteEventLevel);
  eventBus.off("badge-delete-olympiad-level", handleDeleteOlympiadLevel);
  eventBus.off("badge-delete-all", handleDeleteAll);
});

const handleDeleteClassList = (id: any) => {
  const cloneClasses = [...selectClasses.value];
  const filteredClasses = cloneClasses.filter((itemId) => itemId !== id);

  selectClasses.value = [...filteredClasses];

  selectAddValueToFilter(
    filteredClasses,
    "class",
    dictionariesStore.optionsClasses,
    calendarStore.setFilterByKey
  );
};

const handleDeleteEventLevel = () => {
  isEventRadio.value = undefined;
  calendarStore.setFilterByKey("eventLevel", null);
};

const handleDeleteOlympiadLevel = () => {
  isOlympiadRadio.value = undefined;
  calendarStore.setFilterByKey("olympiadLevel", null);
};

const handleDeleteAll = () => {
  isPast.value = false;
  calendarStore.setFilterByKey("all", false);
};
</script>
