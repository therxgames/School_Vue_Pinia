<template>
  <ClientOnly>
    <calendar-filters-date-slider/>
  </ClientOnly>
  <div class="d-grid gap-2 lg:grid-cols-3 xl:grid-cols-2">
    <div>
      <input-search
        placeholder="Поиск"
        v-model:value="searchInput"
        :class="{ 'is-disabled': !pageMounted }"
      />
    </div>
    <div class="d-grid grid-cols-3 gap-2 lg:col-span-2 xl:col-span-1">
      <div>
        <input-select-multi
          :is-only-place-holder="true"
          placeholder="Тип"
          when-select-all-placeholder="Тип"
          :list="dictionariesStore.optionsTypes"
          v-model:value="selectTypes"
          @update:value="
            (selectState) =>
              selectAddValueToFilter(
                selectState,
                'eventType',
                dictionariesStore.optionsTypes,
                calendarStore.setFilterByKey,
                'id'
              )
          "
          :disabled="!pageMounted"
        />
      </div>
      <div>
        <input-select-multi
          :is-only-place-holder="true"
          placeholder="Предмет"
          when-select-all-placeholder="Предмет"
          :list="dictionariesStore.optionsCourses"
          v-model:value="selectCourses"
          @update:value="
            (selectState) =>
              selectAddValueToFilter(
                selectState,
                'course',
                dictionariesStore.optionsCourses,
                calendarStore.setFilterByKey
              )
          "
          :disabled="!pageMounted"
        />
      </div>
      <div>
        <input-button-toggle
          title="Все фильтры"
          class="toggle-add-filter-btn theme-filter"
          icon-name="setting"
          :is-toggle="true"
          v-model:isToggled="isShowFilterAdditional"
          :disabled="!pageMounted"
        >
          <template #after>
            <div v-if="!!activeFiltersCount" class="input-btn-count">
              {{ activeFiltersCount }}
            </div>
          </template>
        </input-button-toggle>
      </div>
    </div>
  </div>
  <div>
    <calendar-filters-badge-list></calendar-filters-badge-list>
  </div>
  <div class="collapse" ref="calendarFiltersCollapse">
    <calendar-filters-additional
      :reset-state="isShowReset"
      :options-classes="dictionariesStore.optionsClasses"
      :event-levels="dictionariesStore.eventLevels"
    >
      <template #button>
        <button
          class="btn border-0 p-0 text-secondary d-flex align-items-center"
          @click="hideFilters"
        >
          <div style="font-size: 0.8rem">
            <svg-icon name="arrow-top"/>
          </div>
          <span class="mx-2">{{ "Свернуть" }}</span>
        </button>
      </template>
    </calendar-filters-additional>
  </div>
  <calendar-filters-flags
    :count="total"
    :sort-id="sortId"
    :show-reset="isShowReset"
    :disabled="!pageMounted"
    @on-change-online="
      (isOnline) => calendarStore.setFilterByKey('online', isOnline || null)
    "
    @on-sorting-order="setSortinOrder"
    @on-sorting-by="(id) => calendarStore.setSort(id || null)"
    @on-reset-all="resetAllFilters"
  />
  <no-result v-if="calendarStore.eventsListNoResult" class="mt-5 mb-5">
    <div class="btn btn-simple" @click="resetAllFilters">Сбросить фильтры</div>
  </no-result>
</template>

<script setup lang="ts">
import {getCount, getIdArrayByList, replaceNullParams, selectAddValueToFilter, stringToArrayNumber,} from "./helper";
import {TEvent} from "./types";
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import useCalendareStore from "~/stores/calendar";
import {formatDateByMask} from "~/utils/format-date";

const calendarStore = useCalendareStore();
const dictionariesStore = useDictionariesCalendar();
const router = useRouter();
const route = useRoute();

const searchInput = ref<string>();
const selectTypes = ref<Array<TEvent | number>>([]);
const selectCourses = ref<Array<TEvent | number>>([]);
const isShowFilterAdditional = ref(false);
const calendarFiltersCollapse = ref();
const sortId = ref("date");
const activeFiltersCount = ref<number>();
const isShowReset = ref(false);
const pageMounted = ref(false);

let bsCollapse: any;

type TFiltersProps = {
  total?: number | null;
};

defineProps<TFiltersProps>();

watch(
  () => isShowFilterAdditional.value,
  () => {
    bsCollapse.toggle();
  }
);

const pushRouter = () => {
  const queryDate = {
    eventDateFrom: !!calendarStore.calendar.date[0]
      ? formatDateByMask(calendarStore.calendar.date[0], "yyyy-MM-dd")
      : null,
    eventDateTo: !!calendarStore.calendar.date[1]
      ? formatDateByMask(calendarStore.calendar.date[1], "yyyy-MM-dd")
      : null,
  };

  const queryParams = {
    sort: calendarStore.sort,
    ...calendarStore.filters,
    ...queryDate,
  };
  const queryParamsValid = replaceNullParams(queryParams);

  router.push({query: {...queryParamsValid}});

  if (pageMounted.value) {
    calendarStore.fetchEventsList({...queryParamsValid});
  }
};

watch(
  () => [
    calendarStore.sort,
    calendarStore.filters,
    calendarStore.calendar.date,
  ],
  ([, newFilters]) => {
    const checkActiveOnFilters = getCount(newFilters);
    const checkActiveDate = calendarStore.calendar.date[0] ? 1 : 0;
    const isActiveFilters = !!checkActiveOnFilters || !!checkActiveDate;
    calendarStore.calendar.queryPageCount = 2;
    isShowReset.value = isActiveFilters;
    activeFiltersCount.value = getCount(newFilters) + checkActiveDate;

    pushRouter();
  },
  {deep: true}
);

const updateFieldsOnLoad = () => {
  if (calendarStore.filters.term) {
    searchInput.value = calendarStore.filters.term;
  }

  if (calendarStore.filters?.eventType) {
    selectTypes.value = stringToArrayNumber(calendarStore.filters.eventType);
  }

  if (calendarStore.filters?.course) {
    const idArray = getIdArrayByList(
      calendarStore.filters.course,
      dictionariesStore.optionsCourses,
      "code"
    );

    selectCourses.value = [...idArray];
  }
};

onBeforeMount(() => {
  const routeQuery = {...route.query};

  for (let key in routeQuery) {
    if (key !== "sort" && key !== "eventDateFrom" && key !== "eventDateTo") {
      calendarStore.setFilterByKey(key, routeQuery[key]);
    }

    if (key === "sort") {
      calendarStore.setSort(routeQuery[key]);
    }

    if (key === "eventDateFrom") {
      calendarStore.setDatesFromTextToDate(
        "eventDateFrom",
        parseDate(routeQuery[key])
      );
    }

    if (key === "eventDateTo") {
      calendarStore.setDatesFromTextToDate(
        "eventDateTo",
        parseDate(routeQuery[key])
      );
    }
  }
});

onMounted(async () => {
  eventBus.on("badge-delete-event-type", handleDeleteEventType);
  eventBus.on("badge-delete-course", handleDeleteCourseList);

  // @ts-ignore
  bsCollapse = new window.$bootstrap.Collapse(calendarFiltersCollapse.value, {
    toggle: isShowFilterAdditional.value,
  });

  await dictionariesStore.fetchTypes();
  await dictionariesStore.fetchRegions();
  await dictionariesStore.fetchCourses();
  await dictionariesStore.fetchClasses();
  await dictionariesStore.fetchEventLevels();

  updateFieldsOnLoad();

  const routeQuery = {...route.query};

  calendarStore.fetchEventsList(routeQuery);

  pageMounted.value = true;
});

onUnmounted(() => {
  eventBus.off("badge-delete-event-type", handleDeleteEventType);
  eventBus.off("badge-delete-course", handleDeleteCourseList);
  bsCollapse && bsCollapse.dispose();
});

const hideFilters = () => {
  isShowFilterAdditional.value = false;
};

watch(
  () => searchInput.value,
  () => {
    calendarStore.setFilterByKey("term", searchInput.value || null);
  }
);

const setSortinOrder = () => {
  const sortValue = calendarStore.sort;
  const isNegativeSort = sortValue ? sortValue[0] === "-" : false;

  if (!sortValue) {
    calendarStore.setSort("-date");
    return;
  }

  if (isNegativeSort) {
    calendarStore.setSort(String(sortValue).substring(1));
    return;
  }

  calendarStore.setSort(`-${sortValue}`);
};

const resetAllFilters = () => {
  searchInput.value = "";
  selectTypes.value = [];
  selectCourses.value = [];
  sortId.value = "date";
  activeFiltersCount.value = 0;
  isShowReset.value = false;

  calendarStore.resetAll();
};

const handleDeleteEventType = (id: any) => {
  const cloneSelectTypes = [...selectTypes.value];
  const filtereSelectTypes = cloneSelectTypes.filter((itemId) => itemId !== id);

  selectTypes.value = [...filtereSelectTypes];

  selectAddValueToFilter(
    filtereSelectTypes,
    "eventType",
    dictionariesStore.optionsTypes,
    calendarStore.setFilterByKey,
    "id"
  );
};

const handleDeleteCourseList = (id: any) => {
  const cloneCourseList = [...selectCourses.value];
  const filtereCoureList = cloneCourseList.filter((itemId) => itemId !== id);

  selectCourses.value = [...filtereCoureList];

  selectAddValueToFilter(
    filtereCoureList,
    "course",
    dictionariesStore.optionsCourses,
    calendarStore.setFilterByKey
  );
};
</script>

<style lang="scss" scoped>
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lg\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .xl\:col-span-1 {
    grid-column: span 1 / span 1;
  }
}
</style>
