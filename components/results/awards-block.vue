<template>
  <div class="awards__search-wrapper">
    <div class="awards__search">
      <input-search
        placeholder="Поиск"
        @search="handleSearch"
        v-model:value="bySearchString"
      />
    </div>

    <div class="awards-stats" v-if="awards?.achievements?.count > 0">
      <span>из {{ awards?.achievements?.count }}</span>
      <h2>{{ awards?.achievements?.label }}</h2>
    </div>
  </div>
  <div class="awards__filters-wrapper">
    <div class="awards-filters__wrapper">
      <span
        class="awards-filters__tab"
        :class="{ 'awards-filters__tab_active': tabRef === 'all' }"
        @click="handleFilter('all')"
      >
        Все
      </span>

      <span
        class="awards-filters__tab"
        :class="{ 'awards-filters__tab_active': tabRef === 'preparing-gia' }"
        @click="handleFilter('preparing-gia')"
      >
        Подготовка к ГИА
      </span>
    </div>

    <div class="awards-sort-wrapper">
      <div
        class="parent-sort"
        @click="handleSortClick('progress')"
        :class="{ ['active-sort-element']: sortRef === 'progress' }"
      >
        <svg-icon
          class="sort__icon"
          :class="
            ({
              ['sort__icon_active-desc']:
                sortRef === 'progress' && currentSort === 'desc',
            },
            {
              ['sort__icon_active-asc']:
                sortRef === 'progress' && currentSort === 'asc',
            })
          "
          name="arrow-up"
        />
        <p class="awards-filters__col-name">По прогрессу</p>
      </div>

      <div
        class="parent-sort"
        @click="handleSortClick('rarity')"
        :class="{ ['active-sort-element']: sortRef === 'rarity' }"
      >
        <svg-icon
          class="sort__icon"
          name="arrow-up"
          :class="{
            ['sort__icon_active-desc']:
              sortRef === 'rarity' && currentSort === 'desc',
            ['sort__icon_active-asc']:
              sortRef === 'rarity' && currentSort === 'asc',
          }"
        />
        <p class="awards-filters__col-name">По редкости</p>
      </div>
    </div>
  </div>

  <loader v-if="store.isFetching" :listener="true" :theme-simple="true" />

  <div v-else>
    <div
      v-if="
        awards?.achievements?.achievements.length && tabRef === 'preparing-gia'
      "
      v-for="{ title, awards } in awards?.achievements?.achievements"
      class="awards-cards__wrapper-gia"
    >
      <div class="awards-cards__wrapper-gia-title">{{ title }}</div>
      <div class="d-flex flex-wrap">
        <awards-card
          v-for="card in awards"
          :key="card.title"
          :card="card"
          :withModal="true"
        />
      </div>
    </div>

    <div
      v-else-if="awards?.achievements?.achievements.length && tabRef === 'all'"
      class="awards-cards__wrapper"
    >
      <awards-card
        v-for="card in awards?.achievements?.achievements"
        :key="card.title"
        :card="card"
        :withModal="true"
      />
    </div>

    <common-empty v-else @click="resetFilters" />
  </div>
</template>

<script setup>
import useResultsStore from "~/stores/results";
import _debounce from "lodash.debounce";
import AwardsCard from "~/components/results/awards-card.vue";

const store = useResultsStore();
const tabRef = ref("all");
const awards = ref([]);
const sortRef = ref(null);
const currentSort = ref(null);
const bySearchString = ref("");
const loaded = ref(false);

const QUERY_GIA = 3;

const fetchAwards = async () => {
  const searchBy = bySearchString.value;
  const filterBy = tabRef.value === "preparing-gia" ? QUERY_GIA : null;
  const sortBy =
    sortRef.value &&
    currentSort.value &&
    `${sortRef.value}_${currentSort.value}`;
  await store.fetchAwards(sortBy, searchBy, filterBy);
};

const resetFilters = async () => {
  const sortBy =
    sortRef.value &&
    currentSort.value &&
    `${sortRef.value}_${currentSort.value}`;
  bySearchString.value = "";
  tabRef.value = "all";
  await store.fetchAwards(sortBy, null, null);
};

const handleFilter = async (field) => {
  if (tabRef.value !== field) {
    tabRef.value = field;
    await fetchAwards();
  }
};

const handleSortClick = async (option) => {
  if (sortRef.value === option) {
    if (currentSort.value === "asc") {
      currentSort.value = "desc";
    } else {
      currentSort.value = null;
      sortRef.value = null;
    }
  } else {
    sortRef.value = option;
    currentSort.value = "asc";
  }

  await fetchAwards();
};

const handleSearch = _debounce(async () => {
  if (!loaded.value) {
    loaded.value = true;
    await fetchAwards();
    loaded.value = false;
  }
}, 1000);

watch(bySearchString, handleSearch);

watch(
  () => store.awards,
  (newAwards) => {
    if (newAwards) {
      awards.value = newAwards;
    }
  }
);

onMounted(async () => {
  await fetchAwards();
});
</script>

<style scoped lang="scss">
@import "/assets/scss/theme";

.awards {
  &__search-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 28px;

    .awards-stats {
      position: relative;
      margin-left: auto;

      h2 {
        font-size: 32px;
        font-style: normal;
        font-weight: 500;
        line-height: 130%;
        letter-spacing: -0.4px;
        margin-bottom: 0;
      }

      span {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-80%);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        color: #93979e;
      }
    }
  }

  &__search {
    width: 644px;
  }

  &__filters-wrapper {
    display: flex;
    align-items: center;
    margin-top: 16px;
    border-bottom: 1px solid #dddee0;

    .parent-sort {
      position: relative;
      cursor: pointer;

      .sort__icon {
        position: absolute;
        top: 50%;
        left: -4px;
        width: 16px;
        height: 16px;
        padding: 1px;
        transition: transform 0.3s ease-in-out;
        display: none;

        &_big {
          width: 20px;
          height: 20px;
        }

        &_active-asc {
          display: inline-block;
          transform: translate(-100%, -55%);
        }

        &_active-desc {
          display: inline-block;
          transform: translate(-100%, -55%) rotate(-180deg);
        }
      }
    }
  }

  &-cards {
    &__wrapper {
      display: flex;
      flex-wrap: wrap;
      row-gap: 24px;
      margin-top: 32px;
    }

    &__wrapper-gia {
      display: flex;
      flex-direction: column;
      margin-top: 48px;

      &-title {
        color: #0c1524;
        font-size: 20px;
        font-weight: 500;
        line-height: 140%;
        margin-bottom: 24px;
      }
    }
  }
}

.awards-filters {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  &__tab {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    padding: 10px 0;
    color: #424955;
    cursor: pointer;
    transition: $transition;

    &:hover {
      color: #266fed;
    }

    &_active {
      color: #0c1524;
      box-shadow: 0 2px 0 0 #2962ff;
    }
  }

  &__col-name {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    white-space: nowrap;
    margin-bottom: 0;
  }
}

.awards-sort-wrapper {
  display: flex;
  align-items: center;
  gap: 38px;
}

.active-sort-element {
  color: #1b59f5;
}
</style>
