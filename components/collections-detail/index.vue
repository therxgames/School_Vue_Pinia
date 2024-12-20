<template>
  <loader
    class="admin-kim-content-loader"
    :listener="collectionsDetailStore.collectionsListIsLoading"
  />
  <div v-if="cardList.length > 0">
    <div class="d-flex justify-content-center gap-3 ms-5 mb-4">
      <div
        :class="[{ 'pe-none is-active': activeMode === 'list' }]"
        class="mode-icon"
        role="button"
        @click="setViewMode('list')"
      >
        <svg-icon name="menu-list" class="svg-size-1-em" />
      </div>
      <div
        :class="[{ 'pe-none is-active': activeMode === 'tile' }]"
        class="mode-icon"
        role="button"
        @click="setViewMode('tile')"
      >
        <svg-icon name="menu" class="svg-size-1-em" />
      </div>
    </div>
    <div
      :class="[
        { 'view-container view-list': activeMode === 'list' },
        { 'view-tile': activeMode === 'tile' },
      ]"
      class="view-items d-flex flex-wrap justify-content-between"
    >
      <div
        v-for="(item, index) of cardList"
        :key="item.id"
        class="view-items__col"
      >
        <div class="collections-card">
          <div
            class="collections-card__count position-relative mt-3"
            :style="{
              color: getCurrentColor(item.subsystem),
            }"
          >
            <svg-icon name="collections-count" />
            <span class="c-white position-absolute start-0 end-0 text-center">{{
              index + 1
            }}</span>
          </div>
          <div
            class="calendar-card-wrapper"
            v-if="item.subsystem === 'calendar'"
          >
            <calendar-cards-tile-card
              v-if="activeMode === 'tile'"
              :card="item"
              :display-type="activeMode"
            />
            <calendar-cards-list-card
              v-if="activeMode !== 'tile'"
              :card="item"
              :display-type="activeMode"
            />
          </div>
          <div
            class="materials-card-wrapper"
            v-if="item.subsystem === 'material_library'"
          >
            <MaterialsCardsItem
              :item="item"
              :listMode="activeMode === 'list'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import useCollectionsDetailStore from "~/stores/collections-detail";

const collectionsDetailStore = useCollectionsDetailStore();

const modeCollectionsDetail = useModeCollectionsDetail();

const modeCookie = useCookie("collectionsDetailMode");

const activeMode = ref(modeCookie.value || "list");

const setViewMode = (mode) => {
  activeMode.value = mode;
  modeCookie.value = mode;

  modeCollectionsDetail.value = mode;
};

const getCurrentColor = (type) => {
  switch (type) {
    case "calendar":
      return "rgb(33, 189, 79)";

    default:
      return "rgb(228, 65, 27)";
  }
};

const cardList = computed(() => {
  return collectionsDetailStore.collectionsList;
});
</script>

<style lang="scss" scoped>
.view-container {
  background-color: rgb(243 243 241);
  border-radius: 2rem;
  padding: 2rem 4rem 4rem;
}

.view-items__col {
  width: calc(50% - 4px);
}

.view-list .view-items__col {
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .card-wrapper {
    margin: 0;
  }

  .materials-card-wrapper {
    width: 100%;
  }

  .card.card-theme_list {
    border: none;
    border-radius: 1rem;
  }

  .calendar-card-wrapper {
    width: 100%;
    max-width: 960px;

    .card-reminder {
      height: 128px
    }
  }
}

.view-tile {

  .materials-card-wrapper {
    max-width: 320px;
  }
  .view-items__col {
    border-radius: 2rem;
    padding: 2rem 4rem 4rem;
    background-color: rgb(243, 243, 241);

    &:nth-child(odd) {
      margin-bottom: 96px;
    }

    &:nth-child(2n) {
      margin-top: 90px;
      margin-bottom: 22px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .view-items__col:nth-child(2n) :deep(.collections-card),
  .view-items__col:nth-child(4n - 1) :deep(.collections-card) {
    flex-direction: row-reverse;
  }

  .view-items__col:nth-child(4n) :deep(.collections-card) {
    flex-direction: row;
  }
}

.collections-card {
  gap: 0 1.5rem;
  display: flex;
  justify-content: center;

  &__count {
    width: 3rem;

    .svg-icon {
      --svg-icon-width: 3rem;
      --svg-icon-height: 3.75rem;
    }

    span {
      top: 0;
      font-size: 2rem;
      line-height: 3rem;
      font-weight: 600;
      top: 0.6rem;
    }
  }
}
</style>
