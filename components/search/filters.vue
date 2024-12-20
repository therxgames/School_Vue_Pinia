<template>
  <div
    :class="[{'disabled': searchStore.fetching}]"
    class="search-filters"
  >
    <search-city-select class="search-city-select"/>

    <div class="search-filters-query">
      <input-search
        @search="onSearch"
        v-model:value="bySearchString"
        class="search-input"
      />

      <search-date-select/>
    </div>
    <div class="filters-container">
      <!--      <div class="search-filters-content">-->
      <!--        <div class="content-filters" v-for="element of props.filters" :key="element.id">-->
      <!--          <button class="content-filters-element"-->
      <!--                  :class="{'content-filters-element-active': element.isActive}"-->
      <!--                  @click="handleChangeActiveFilter(element.id)"-->
      <!--          >-->
      <!--            {{ element.name }}-->
      <!--          </button>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="filters-go-to-section">
        <a class="filters-go-to-section-text"
           target="_blank"
           :href="pathSection()"
        >
          Перейти в раздел
        </a>
        <svg-icon name="caret-right" class="filters-go-to-section-icon"/>
      </div>
    </div>

    <div class="search-filters-bottom">
      <div class="flex-container">
        <div class="search-filters-bottom-count">
        <span v-if="searchStore.filters.page.total">
          Всего <b>{{ searchStore.filters.page.total }}</b>
        </span>

          <span v-if="!searchStore.filters.page.total">
          Нет результатов
        </span>
        </div>

        <transition name="transition-fade">
          <div
            v-if="isActiveFilters"
            @click="resetFilters"
            class="icon-text search-filters-content-reset"
          >
            <span>Сбросить</span>
            <svg-icon name="cross" class="reset-icon"/>
          </div>
        </transition>
      </div>

      <div class="ms-3 gap-3 d-flex align-items-center">
        <div data-bs-toggle="dropdown" data-bs-offset="0,5">
          <div
            class="d-flex gap-2 align-items-center flags-dropdown__head"
            role="button"
          >
            <span>По {{ findTextById(currentSortElement) }}</span>
            <svg-icon name="arrow-bottom" class="dropdown-arrow"/>
          </div>
          <div class="dropdown-menu animation slide-in shadow flags-dropdown">
            <p class="flags-dropdown__text text-center mt-2 mb-3">
              Сортировка по
            </p>
            <hr class="hr mb-1 mt-1"/>
            <div v-for="({ id, title }, index) of sortList" :key="id">
              <a
                :class="{ 'mt-1': index !== 0, 'btn-primary': id === currentSortElement, 'sort-item': id !== currentSortElement }"
                class="btn w-100"
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
          <svg-icon name="sorting"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useDictionariesCalendar from "~/stores/dictionaries-calendar";
import usesearchStore from '~/stores/cross-cutting-search';
import _debounce from 'lodash.debounce'
import {format} from "date-fns";

const dictionariesStore = useDictionariesCalendar();
const isSortingOrder = ref(false);
const currentSortElement = ref('viewCount')
const addFiltersCollapse = ref(null);
const router = useRouter();
const route = useRoute();

const isActiveFilters = ref(false);
const isResetRegion = ref(false);
const isResetSource = ref(false);
const isResetDate = ref(false);
const isResetPagination = ref(false);

const sortList = [
  {
    id: "viewCount",
    title: "Популярности",
  },
  {
    id: "date",
    title: "Дате",
  },
  {
    id: "name",
    title: "Названию",
  },
];

const props = defineProps({
  filters: {}
});

const pathSection = () => {
  const content = route.query?.content === 'material_library' ? 'library' : route.query?.content;
  return route.query.q ? `/${content}?term=${route.query.q}` : `/${content}`
};

const handleSortingOrder = () => {
  const queryParams = {...route.query};
  isSortingOrder.value = !isSortingOrder.value;

  // Сортировка
  if (!isSortingOrder.value) {
    queryParams.sort = currentSortElement.value;
  } else {
    queryParams.sort = `-${currentSortElement.value}`;
  }

  // Датапикер
  if (searchStore.calendar.date[0] && searchStore.calendar.date[1]) {
    const formattedStart = format(new Date(searchStore.calendar.date[0]), 'yyyy-MM-dd');
    const formattedEnd = format(new Date(searchStore.calendar.date[1]), 'yyyy-MM-dd');

    queryParams.dateFrom = formattedStart
    queryParams.dateTo = formattedEnd
  }

  // Пагинация
  if (searchStore.filters.page.current !== 1) {
    isResetPagination.value = true
  }
  searchStore.filters.page.current = 1
  queryParams.page = '1'

  searchStore.fetchData(queryParams)
};

const handleSortingBy = (id) => {
  const queryParams = {...route.query};
  currentSortElement.value = id

  // Сортировка
  if (!isSortingOrder.value) {
    queryParams.sort = id;
  } else {
    queryParams.sort = `-${id}`;
  }

  // Датапикер
  if (searchStore.calendar.date[0] && searchStore.calendar.date[1]) {
    const formattedStart = format(new Date(searchStore.calendar.date[0]), 'yyyy-MM-dd');
    const formattedEnd = format(new Date(searchStore.calendar.date[1]), 'yyyy-MM-dd');

    queryParams.dateFrom = formattedStart
    queryParams.dateTo = formattedEnd
  }

  // Пагинация
  if (searchStore.filters.page.current !== 1) {
    isResetPagination.value = true
  }
  searchStore.filters.page.current = 1
  queryParams.page = '1'

  searchStore.fetchData(queryParams)
};

const findTextById = (currentId) => {
  return String(sortList.find((elem) => elem.id === currentId)?.title).toLocaleLowerCase();
};

await dictionariesStore.fetchRegions();
const searchStore = usesearchStore();

const bySearchString = computed({
  get: () => route.query.q ?? searchStore.getFilterValue('q'),
  set: _debounce((value) => {
    searchStore.setFilterValue('q', value);

    const queryParams = {...route.query};
    queryParams.q = value

    if (!queryParams.q) {
      delete queryParams.q
    }

    router.push({query: queryParams});

    // Датапикер
    if (searchStore.calendar.date[0] && searchStore.calendar.date[1]) {
      const formattedStart = format(new Date(searchStore.calendar.date[0]), 'yyyy-MM-dd');
      const formattedEnd = format(new Date(searchStore.calendar.date[1]), 'yyyy-MM-dd');

      queryParams.dateFrom = formattedStart
      queryParams.dateTo = formattedEnd
    }

    // Сортировка
    if (!isSortingOrder.value) {
      queryParams.sort = currentSortElement.value;
    } else {
      queryParams.sort = `-${currentSortElement.value}`;
    }

    searchStore.fetchData(queryParams)
  }, 300)
});

watch(() => searchStore.citySelect.region,
  (region) => {
    if (isResetRegion.value) {
      isResetRegion.value = false
      return
    }

    const queryParams = {...route.query};
    if (!region) {
      searchStore.fetchData(queryParams)
      return
    }

    // Датапикер
    if (searchStore.calendar.date[0] && searchStore.calendar.date[1]) {
      const formattedStart = format(new Date(searchStore.calendar.date[0]), 'yyyy-MM-dd');
      const formattedEnd = format(new Date(searchStore.calendar.date[1]), 'yyyy-MM-dd');

      queryParams.dateFrom = formattedStart
      queryParams.dateTo = formattedEnd
    }

    // Сортировка
    if (!isSortingOrder.value) {
      queryParams.sort = currentSortElement.value;
    } else {
      queryParams.sort = `-${currentSortElement.value}`;
    }

    // Пагинация
    if (searchStore.filters.page.current !== 1) {
      isResetPagination.value = true
    }
    searchStore.filters.page.current = 1
    queryParams.page = '1'

    queryParams.region = region;
    searchStore.fetchData(queryParams)
  }
)

const categoryFilterShow = computed({
  get: () => searchStore.getFilterValue('ac'),
  set: (value) => searchStore.setFilterValue('ac', value)
});

const resetFilters = () => {
  isResetRegion.value = true;
  isResetDate.value = true;
  isResetPagination.value = true;

  const queryParams = {...route.query};
  isActiveFilters.value = false;

  // Сортировка
  let sort;
  if (!isSortingOrder.value) {
    sort = currentSortElement.value;
  } else {
    sort = `-${currentSortElement.value}`;
  }

  props.filters.map((element) => element.isActive = false)

  // Датапикер
  searchStore.resetDate()

  // Регион
  searchStore.citySelect.region = null;

  // Пагинация
  if (searchStore.filters.page.current !== 1) {
    isResetPagination.value = true
  }
  searchStore.filters.page.current = 1
  router.push({query: queryParams});

  queryParams.page = '1'
  searchStore.fetchData({...queryParams, sort})
}

watch(() => [searchStore.calendar.date[0], searchStore.calendar.date[1]],
  ([start, end]) => {
    if (isResetDate.value) {
      isResetDate.value = false
      return
    }

    isActiveFilters.value = !!route.query.content?.[0]?.split(',')?.length || !!searchStore.calendar.date.length;

    const formattedStart = start && format(new Date(start), 'yyyy-MM-dd');
    const formattedEnd = end && format(new Date(end), 'yyyy-MM-dd');
    const queryParams = {...route.query};

    if (formattedStart) {
      queryParams.dateFrom = formattedStart
    } else {
      delete queryParams.dateFrom
    }

    if (formattedEnd) {
      queryParams.dateTo = formattedEnd
    } else {
      delete queryParams.dateTo
    }

    // Сортировка
    if (!isSortingOrder.value) {
      queryParams.sort = currentSortElement.value;
    } else {
      queryParams.sort = `-${currentSortElement.value}`;
    }

    // Регион
    queryParams.region = searchStore.citySelect.region;

    // Пагинация
    if (searchStore.filters.page.current !== 1) {
      isResetPagination.value = true
    }
    searchStore.filters.page.current = 1
    queryParams.page = '1'

    searchStore.fetchData(queryParams)
  })


watch(
  () => searchStore.filters.page.current,
  (newCurrentPage) => {
    if (isResetPagination.value) {
      isResetPagination.value = false
      return
    }

    const queryParams = {
      ...route.query,
      page: newCurrentPage,
    };

    // Регион
    queryParams.region = searchStore.citySelect.region;

    // Сортировка
    if (!isSortingOrder.value) {
      queryParams.sort = currentSortElement.value;
    } else {
      queryParams.sort = `-${currentSortElement.value}`;
    }

    // Датапикер
    if (searchStore.calendar.date[0] && searchStore.calendar.date[1]) {
      const formattedStart = format(new Date(searchStore.calendar.date[0]), 'yyyy-MM-dd');
      const formattedEnd = format(new Date(searchStore.calendar.date[1]), 'yyyy-MM-dd');

      queryParams.dateFrom = formattedStart
      queryParams.dateTo = formattedEnd
    }

    searchStore.fetchData(queryParams);
  }
);

const handleChangeActiveFilter = (id) => {
  const queryParams = {...route.query};

  props.filters.forEach((element) => {
    element.isActive = element.id === id;
  });

  const activeFilters = props.filters
  .filter((element) => element.isActive)
  .map((element) => element.id)
  .join(',')

  if (activeFilters.length) {
    queryParams.content = activeFilters
  } else {
    delete queryParams.content
  }

  router.push({query: queryParams});

  // Сортировка
  if (!isSortingOrder.value) {
    queryParams.sort = currentSortElement.value;
  } else {
    queryParams.sort = `-${currentSortElement.value}`;

  }
  // Регион
  queryParams.region = searchStore.citySelect.region;

  // Датапикер
  if (searchStore.calendar.date[0] && searchStore.calendar.date[1]) {
    const formattedStart = format(new Date(searchStore.calendar.date[0]), 'yyyy-MM-dd');

    const formattedEnd = format(new Date(searchStore.calendar.date[1]), 'yyyy-MM-dd');
    queryParams.dateFrom = formattedStart
    queryParams.dateTo = formattedEnd

  }

  // Пагинация
  if (searchStore.filters.page.current !== 1) {
    isResetPagination.value = true
  }
  searchStore.filters.page.current = 1
  queryParams.page = '1'

  searchStore.fetchData(queryParams)
};

onUnmounted(() => {
  eventBus.off("handle-change-active-filter-new", handleChangeActiveFilter);
});

watch(
  () => categoryFilterShow.value,
  async (show) => {

    await nextTick();
    show
      ? getFiltersCollapse().show()
      : getFiltersCollapse().hide();
  }
);

onMounted(() => {
  eventBus.on("handle-change-active-filter-new", handleChangeActiveFilter);
  sleep(150).then(() => getFiltersCollapse({toggle: categoryFilterShow.value}));
});

const onSearch = (q) => {
  searchStore.filters.q.accepted = searchStore.filters.q.value;
  if (searchStore.filters.q.value?.length > 2) {
    setUserSetting('search.q', searchStore.filters.q.value, {push: true, limit: 20, autoSave: true});
  }
};

const setOrder = (field) => {
  searchStore.setFilterValue('order', field);
  setUserSetting('search.sort.by', field);
};

const toggleCategoryFilters = () => {
  categoryFilterShow.value = !categoryFilterShow.value;
};
const getFiltersCollapse = (config) => {
  return window.$bootstrap.Collapse.getOrCreateInstance(addFiltersCollapse.value, config);
};

</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.reset-icon {
  width: 14px !important;
  height: 14px !important;
}

.filters-go-to-section {
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    .filters-go-to-section-text {
      color: rgb(89 76 232);
    }

    .filters-go-to-section-icon {
      color: rgb(89 76 232);
    }
  }

  &-text {
    color: #1B59F5;
    font-size: 16px;
    font-weight: 500;
    line-height: 160%;
  }

  &-icon {
    width: 16px;
    height: 16px;
    color: #1B59F5;
  }
}

.filters-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem
}

.flex-container {
  display: flex;
  gap: 32px;
}

.sort-item {
  &:hover {
    background-color: rgb(240 242 252/1);
  }
}

.mode-icon {
  transition: opacity 0.05s linear;

  &:not(.is-active):not(:hover) {
    opacity: 0.3;
  }
}

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

.content-filters {
  display: flex;
  justify-content: center;

  &-element {
    cursor: pointer;
    transition: all 150ms linear;
    border: 1px solid #DDDEE0;
    background: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 7px 16px;
    justify-content: center;
    align-items: center;
    color: #424955;
    font-size: 16px;
    font-weight: 500;
    box-sizing: border-box;

    &:hover {
      color: $color-black;
      background: $color-black-10;
    }

    &-active {
      border-radius: 10px;
      background: #0576FF;
      color: #FFFFFF;
      border: 1px solid #0576FF;

      &:hover {
        background: #0576FF;
        color: #FFFFFF;
      }
    }
  }
}

.search-filters {
  &-query {
    display: flex;
    width: 100%;
    height: 56px;

    .search-input {
      //padding: 10px 16px;
      flex-grow: 1;
      margin-right: 8px;
    }
  }

  &-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: none !important;

      &:hover {
        color: $color-blue-normal;
      }

      &-icon {
        width: 1rem;
      }

      &-count {
        font-size: 0.813rem;
        background: $color-blue-normal;
        color: #fff;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;

        &:empty {
          display: none;
        }
      }

      &-arrow {
        width: 0.7rem;
        margin-left: 0.5rem;
        transform: rotate(-180deg);
        transition: all 350ms ease-out;
      }

      &.toggled &-arrow {
        transform: rotate(0deg);
      }
    }

    &-reset {
      --icon-width: 0.5rem;
      --icon-height: 0.5rem;

      user-select: none;
      transition: $transition;

      &:hover {
        color: $color-blue-normal;
      }
    }
  }

  &-bottom {
    display: flex;
    margin-top: 1.5rem;
    gap: 1.5rem;
    border-bottom: 1px solid rgb(221 222 224/1);
    padding: 10px 0;
    justify-content: space-between;

    &-count {
      b {
        font-weight: 500;
      }
    }

    &-sorter {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      &-item {
        cursor: pointer;
        transition: $transition;

        &:hover,
        &.active {
          color: $color-blue-normal;
        }
      }
    }

    &-view-mode {
      display: flex;
      align-items: center;
      gap: 1rem;

      &-item {
        cursor: pointer;
        opacity: 0.3;
        transition: $transition;

        &.active,
        &:hover {
          opacity: 1;
        }

        .svg-icon {
          --svg-icon-width: 1rem;
          --svg-icon-height: 1rem;
        }
      }
    }

    &-sorter.disabled,
    &-view-mode.disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  }

  &.disabled {
    pointer-events: none;
    user-select: none;

    .search-filters-bottom-count {
      opacity: 0;
    }
  }
}
</style>
