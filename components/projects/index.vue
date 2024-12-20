<template>
  <banner class="banner-projects">
    <div class="d-flex justify-content-between mb-2">
      <div class="d-inline-flex">
        <p class="c-white mb-0">Все регионы РФ</p>
      </div>
    </div>
    <div class="banner-content">
      <h1 class="banner-title fw-normal c-f3f3f1 mb-2">Проекты</h1>
      <div class="banner-text c-f3f3f1">
        <p class="mb-0">
          Коллекция проектов, представленных организаторами чемпионатов,
          конкурсов и грантов для широкой аудитории с целью повышения мотивации
          в достижении высоких результатов процесса обучения
        </p>
      </div>
    </div>
    <projects-filters>
      <template #button>
        <div
          :class="{ 'is-active': isShowFilterAdditional }"
          class="d-flex align-items-center c-white filter-action"
          role="button"
          @click="toggleShowFilterAdditional"
        >
          Расширенные фильтры
          <svg-icon name="arrow-bottom" class="ms-3" />
        </div>
      </template>
    </projects-filters>
  </banner>
  <div class="collapse" ref="materialFiltersCollapse">
    <projects-filters-additional></projects-filters-additional>
  </div>
  <projects-filters-flags
    :count="count"
    @on-sorting-order="setSortinOrder"
    @on-sorting-by="(id) => projectsLibraryStore.setSort(id || null)"
  />
  <projects-cards />
</template>

<script setup lang="ts">
import useMaterialsLibraryStore from "~/stores/materials-library";
const materialsLibraryStore = useMaterialsLibraryStore();

const isShowFilterAdditional = ref(false);
const materialFiltersCollapse = ref();

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

const count = computed(() => materialsLibraryStore.list.length);

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

onMounted(() => {
  if (process.client) {
    // @ts-ignore
    bsCollapse = new window.$bootstrap.Collapse(materialFiltersCollapse.value, {
      toggle: isShowFilterAdditional.value,
    });
  }
});

onUnmounted(() => {
  bsCollapse && bsCollapse.dispose();
});
</script>

<style lang="scss" scoped>
.banner-projects {
  background: linear-gradient(90deg, #353853 0.2%, #587687 99.52%);
}


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
</style>
