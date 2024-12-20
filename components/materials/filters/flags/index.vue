<template>
  <div
    :class="{ 'flags-disabled pe-none': disabled }"
    class="d-flex justify-content-between mt-4 mb-4"
  >
    <div class="d-flex gap-4">
      <p class="mb-0">
        <client-only>
          <span v-if="!!count">
            Всего
            {{ count }}</span
          >
          <span v-else>Ничего не найдено</span>
        </client-only>
      </p>
      <a
        v-if="showReset"
        class="d-flex align-items-center"
        href="#"
        @click.prevent="handleReset"
        >Сбросить<svg-icon
          name="cross"
          class="ms-2"
          style="width: 1rem; height: 1rem"
      /></a>
    </div>

    <div class="d-flex align-items-center">
      <div class="ms-3 gap-3 d-flex align-items-center">
        <div data-bs-toggle="dropdown" data-bs-offset="0,5">
          <client-only>
            <div
              class="d-flex gap-2 align-items-center flags-dropdown__head"
              role="button"
            >
              <span>По {{ findTextById(sortId, sortList) }}</span>
              <svg-icon name="arrow-bottom" class="dropdown-arrow" />
            </div>
          </client-only>
          <div class="dropdown-menu animation slide-in shadow flags-dropdown">
            <p class="flags-dropdown__text text-center mb-0">Сортировка по</p>
            <hr class="dropdown-hr mb-1 mt-1" />
            <a
              v-for="({ id, title }, index) of sortList"
              :key="id"
              :class="{
                'mt-1': index !== 0,
                'is-active':
                  id ===
                  (String(route.query.sort)[0] === '-'
                    ? String(route.query.sort).substring(1)
                    : route.query.sort),
              }"
              class="btn-sort d-inline-flex w-100"
              href="#"
              @click.prevent="handleSortingBy(id)"
            >
              {{ title }}
            </a>
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
import useMaterialsLibraryStore from "~/stores/materials-library";
import { findTextById, sortList } from "./helpers";

const materialsLibraryStore = useMaterialsLibraryStore();
const route = useRoute();

const sortId = computed(() =>
  !!materialsLibraryStore.sort ? materialsLibraryStore.sort : "publishedAt"
);

type TMode = "list" | "tile";

type TFlags = {
  count?: number | null;
  disabled?: boolean;
  showReset?: boolean;
};

defineProps<TFlags>();

const emit = defineEmits(["onSortingOrder", "onSortingBy", "onChangeOnline"]);

const isSortingOrder = ref(false);

const modeCookie = useCookie<TMode>("modeMaterialsLibrary");
const modeMaterialsLibrary = useModeMaterialsLibrary();

const activeMode = ref<TMode>(modeCookie.value || "list");

modeMaterialsLibrary.value = modeCookie.value || "list";

const setViewMode = (mode: TMode) => {
  activeMode.value = mode;
  modeCookie.value = mode;

  modeMaterialsLibrary.value = mode;
};

const handleSortingOrder = () => {
  isSortingOrder.value = !isSortingOrder.value;
  emit("onSortingOrder", isSortingOrder.value);
};

const handleSortingBy = (id: string) => {
  emit("onSortingBy", id);
  isSortingOrder.value = false;
};

const handleReset = () => {
  isSortingOrder.value = false;
  eventBus.emit("reset-filters-materials");

  materialsLibraryStore.resetAll();
};

onMounted(() => {
  const sortValue = materialsLibraryStore.sort;

  if (sortValue && sortValue[0] === "-") {
    isSortingOrder.value = true;
  }
});
</script>

<style lang="scss" scoped>
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
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgb(221 222 224);
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(71, 115, 212, 0.15) 0px 20px 25px -5px,
    rgba(71, 115, 212, 0.15) 0px 8px 10px -6px;
  min-width: auto;

  &__text {
    color: rgb(147, 151, 158);
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0.75rem 1rem;
  }
}

.flags-disabled {
  opacity: 0.5;
}

.dropdown-hr {
  border-top-color: rgb(243, 243, 241);
}
</style>
