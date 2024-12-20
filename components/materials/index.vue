<template>
  <banner>
    <div class="d-flex justify-content-between mb-2">
      <div class="d-inline-flex">
        <link-tag><materials-filters-city-select /></link-tag>
      </div>
      <div class="d-flex gap-2">
        <nuxt-link class="d-inline-flex" to="/">
          <link-tag> Проекты </link-tag>
        </nuxt-link>
        <link-tag
          class="d-inline-flex align-items-center library-modal-link"
          role="button"
          @click="showLibraryModal"
        >
          <svg-icon class="icon-question me-2" name="info-question" />
          <span class="d-inline-flex">О материалах</span>
        </link-tag>
      </div>
    </div>
    <div class="banner-content">
      <h1 class="banner-title fw-normal c-f3f3f1 mb-2">Библиотека</h1>
      <div class="banner-text c-f3f3f1">
        <p class="mb-0">
          Здесь мы собрали для вас верифицированный цифровой контент, который
          поможет вам подготовиться к урокам, дополнить ваши знания по
          профессиональным темам, выбрать и организовать дополнительную
          активность для учащихся.
        </p>
      </div>
    </div>
    <materials-filters>
      <template #button>
        <div
          :class="{ 'is-active': isShowFilterAdditional }"
          class="d-flex align-items-center c-white filter-action"
          role="button"
          @click="toggleShowFilterAdditional"
        >
          Расширенные фильтры
          <span
            v-if="activeFiltersCount"
            class="count-filters d-inline-flex align-items-center justify-content-center ms-2 fw-normal"
            >{{ activeFiltersCount }}</span
          >
          <svg-icon name="arrow-bottom" class="ms-3" />
        </div>
      </template>
    </materials-filters>
  </banner>
  <materials-filters-collections />
  <div class="collapse" ref="materialFiltersCollapse">
    <materials-filters-additional></materials-filters-additional>
  </div>
  <materials-filters-flags
    :count="count"
    :show-reset="isShowReset"
    @on-sorting-order="setSortinOrder"
    @on-sorting-by="(id) => materialsLibraryStore.setSort(id || null)"
  />
  <materials-cards />
  <common-modal-library-materials ref="modalRef" />
  <selections type="materials" />
</template>

<script setup lang="ts">
import useMaterialsLibraryStore from "~/stores/materials-library";
import { getCount, replaceNullParams } from "../calendar/filters/helper";
import useUserStore from "~/stores/user";

const userStore = useUserStore();
const materialsLibraryStore = useMaterialsLibraryStore();

const router = useRouter();
const route = useRoute();
const isShowFilterAdditional = ref(false);
const materialFiltersCollapse = ref();
const pageMounted = ref(false);
const isShowReset = ref(false);
const activeFiltersCount = ref<number>();

const isVisibleSelections = computed(() => userStore.logged && userStore.userIsStudent);

const toggleShowFilterAdditional = () => {
  isShowFilterAdditional.value = !isShowFilterAdditional.value;
};

let bsCollapse: any;

watch(
  () => isShowFilterAdditional.value,
  () => {
    bsCollapse.toggle();
  }
);

const modalRef = ref(null);

const count = computed(() => materialsLibraryStore.total);

const setSortinOrder = () => {
  const sortValue = materialsLibraryStore.sort;
  const isNegativeSort = sortValue ? sortValue[0] === "-" : false;

  if (!sortValue) {
    materialsLibraryStore.setSort("-publishedAt");
    return;
  }

  if (isNegativeSort) {
    materialsLibraryStore.setSort(String(sortValue).substring(1));
    return;
  }

  materialsLibraryStore.setSort(`-${sortValue}`);
};

// @ts-ignore
const showLibraryModal = () => modalRef.value.show();

const pushRouter = () => {
  const queryDate = {
    publishedAtFrom: !!materialsLibraryStore.calendar.date[0]
      ? formatDateByMask(materialsLibraryStore.calendar.date[0], "yyyy-MM-dd")
      : null,
    publishedAtTo: !!materialsLibraryStore.calendar.date[1]
      ? formatDateByMask(materialsLibraryStore.calendar.date[1], "yyyy-MM-dd")
      : null,
  };

  const queryParams = {
    sort: materialsLibraryStore.sort,
    ...materialsLibraryStore.filters,
    ...queryDate,
  };

  const queryParamsValid = replaceNullParams(queryParams);

  router.push({ query: { ...queryParamsValid } });

  if (pageMounted.value) {
    materialsLibraryStore.fetchMaterials({ ...queryParamsValid });
  }
};

watch(
  () => [
    materialsLibraryStore.sort,
    materialsLibraryStore.filters,
    materialsLibraryStore.calendar.date,
  ],
  ([, newFilters]) => {
    const checkActiveOnFilters = getCount(newFilters);
    const checkActiveDate = materialsLibraryStore.calendar.date[0] ? 1 : 0;
    const isActiveFilters = !!checkActiveOnFilters || !!checkActiveDate;

    isShowReset.value = isActiveFilters;

    activeFiltersCount.value = getCount(newFilters) + checkActiveDate;

    pushRouter();

    materialsLibraryStore.queryPageCount = 2;
  },
  { deep: true }
);

onBeforeMount(() => {
  const routeQuery = { ...route.query };

  for (let key in routeQuery) {
    if (
      key !== "sort" &&
      key !== "publishedAtFrom" &&
      key !== "publishedAtTo"
    ) {
      materialsLibraryStore.setFilterByKey(key, routeQuery[key]);
    }

    if (key === "sort") {
      materialsLibraryStore.setSort(routeQuery[key]);
    }

    if (key === "publishedAtFrom") {
      materialsLibraryStore.setDatesFromTextToDate(
        "publishedAtFrom",
        parseDate(routeQuery[key])
      );
    }

    if (key === "publishedAtTo") {
      materialsLibraryStore.setDatesFromTextToDate(
        "publishedAtTo",
        parseDate(routeQuery[key])
      );
    }
  }
});

onMounted(() => {
  if (process.client) {
    // @ts-ignore
    bsCollapse = new window.$bootstrap.Collapse(materialFiltersCollapse.value, {
      toggle: isShowFilterAdditional.value,
    });
  }

  pageMounted.value = true;

  const checkActiveOnFilters = getCount(materialsLibraryStore.filters);
  const checkActiveDate = materialsLibraryStore.calendar.date[0] ? 1 : 0;
  const isActiveFilters = !!checkActiveOnFilters || !!checkActiveDate;

  isShowReset.value = isActiveFilters;
  activeFiltersCount.value = getCount(materialsLibraryStore.filters) + checkActiveDate;
  materialsLibraryStore.queryPageCount = 2;
});

onUnmounted(() => {
  bsCollapse && bsCollapse.dispose();
});
</script>

<style lang="scss" scoped>
.filter-action {
  line-height: 160%;
  font-weight: 500;

  &.is-active {
    opacity: 0.5;
    .svg-icon {
      transform: rotate(-180deg);
    }
  }
  .svg-icon {
    width: 12px;
    height: 12px;
    transition: transform 350ms ease-out;
  }
}

.icon-question {
  width: 1rem;
  height: 1rem;
}

.count-filters {
  color: #0c1524;
  letter-spacing: 0.2px;
  font-size: 14px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background-color: #fff;
}
</style>
