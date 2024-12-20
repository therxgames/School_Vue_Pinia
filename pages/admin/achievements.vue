<template>
  <div class="admin-logs">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h4 class="my-0">Управление наградами</h4>
      <div @click="create" class="btn btn-primary">Создать</div>
    </div>

    <div class="admin-achievements-filters">
      <div class="admin-achievements-filters-title">
        <div>
          <svg-icon name="setting"/>
        </div>
        <h5 class="m-0">Фильтры</h5>
      </div>

      <div class="admin-achievements-filters-selects">
        <div class="searches-container">
          <input-search
            placeholder="Поиск по названию"
            class="search-input"
            v-model:value="searchInput"
          />

          <input-search
            placeholder="Фильтр по теме"
            :autocomplete-list="adminAchievementsStore.themeList"
            v-model:value="searchInputTheme"
            :min-length="2"
            @clickItem="onClickTheme"
            :autocomplete-options="{ filter: true }"
          />
        </div>

        <div class="selects-container">
          <input-select-multi
            placeholder="Статус"
            when-select-all-placeholder="Все статусы"
            :list="directory.status"
            v-model:value="selectStatus"
            class="input-select-multi"
            :is-only-place-holder="true"
          />
          <input-select-multi
            placeholder="Предмет"
            when-select-all-placeholder="Все предметы"
            :list="directory.subject"
            v-model:value="selectSubject"
            class="input-select-multi"
            :is-only-place-holder="true"
          />
          <input-select-multi
            placeholder="Класс"
            when-select-all-placeholder="Все классы"
            :list="directory.class"
            v-model:value="selectClass"
            class="input-select-multi"
            :is-only-place-holder="true"
          />
          <input-select-multi
            placeholder="Тип ГИА"
            when-select-all-placeholder="Все типы ГИА"
            :list="directory.course_type_gia"
            v-model:value="selectCourseTypeGia"
            class="input-select-multi"
            :is-only-place-holder="true"
          />
        </div>
      </div>
    </div>


    <div class="admin-logs-filters">
      <div class="part-reset" v-if="isVisibleResetButton" @click="resetFilters">
        <span>Сбросить фильтры</span>
        <svg-icon name="cross"/>
      </div>

      <div class="filters-container">
        <div
          v-for="theme of adminAchievementsStore.filters.currentThemes"
          class="filter-item"
        >
          <div class="filter-text" v-tooltip="{ title: theme.name }">
            {{ theme.name }}
          </div>
          <svg-icon
            class="delete-icon"
            name="cross"
            @click="removeFilter(theme.id)"
          />
        </div>
      </div>
      <div class="admin-logs-filters-info">
        <common-result-info
          :visible-if="true"
          :count="adminAchievementsStore.page.total"
        />
      </div>
    </div>
    <div class="admin-logs-content">
      <div v-if="adminAchievementsStore.list.length">
        <div class="admin-logs-table-container my-5 border rounded">
          <table
            class="admin-logs-table bg-ligh w-100 text-nowrap position-relative"
          >
            <tbody>
            <tr class="border-bottom text-muted admin-logs-table-header-row">
              <td class="p-2 border-bottom">
                <span class="label">ID</span>
              </td>
              <td class="p-2 border-bottom" @click="setSorter('status')">
                <common-sort-label title="Статус" :dir="dir('status')"/>
              </td>
              <td class="p-2 border-bottom" @click="setSorter('name')">
                <common-sort-label title="Название" :dir="dir('name')"/>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Изображение</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Описание для пользователя</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Описание для администратора</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Предмет</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Класс</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Тип ГИА</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Раздел курса</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Подраздел курса</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Тема</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Год</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Режим</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Действие</span>
              </td>
              <td class="p-2 border-bottom">
                <span class="label">Количество действий / опыта</span>
              </td>
              <td class="p-2 border-bottom" @click="setSorter('created_at')">
                <common-sort-label
                  title="Дата создания"
                  :dir="dir('created_at')"
                />
              </td>
              <td class="d-table-cell p-3 border-bottom"/>
            </tr>
            <tr v-for="item in adminAchievementsStore.list" :key="item.id">
              <admin-log-sell :title="item.id"/>
              <admin-log-sell
                :title="
                    directory?.status?.find((elem) => elem.id === item.status)
                      ?.name
                  "
              />
              <admin-log-sell :title="item.name"/>
              <admin-log-sell :title="item?.image?.name || item.image"/>
              <admin-log-sell :title="item.user_descriptions"/>
              <admin-log-sell :title="item.admin_descriptions"/>
              <admin-log-sell
                :title="
                    directory?.subject?.find((elem) => elem.id === item.subject)
                      ?.name
                  "
              />
              <admin-log-sell
                :title="
                    directory?.class?.find((elem) => elem.id === item.class)
                      ?.name
                  "
              />
              <admin-log-sell
                :title="
                    directory?.course_type_gia?.find(
                      (elem) => elem.id === item.course_type_gia
                    )?.name
                  "
              />
              <admin-log-sell
                :title="
                    directory?.course_section?.find(
                      (elem) => elem.id === item.course_section
                    )?.name
                  "
              />
              <admin-log-sell
                :title="
                    directory?.course_subsection?.find(
                      (elem) => elem.id === item.course_subsection
                    )?.name
                  "
              />
              <admin-log-sell
                :title="item.theme_name"
              />
              <admin-log-sell
                :title="item.year > 9999 ? item.year_input : directory?.year?.find((elem) => elem.id === item.year)?.name"
              />
              <admin-log-sell
                :title="
                    directory?.mode?.find((elem) => elem.id === item.mode)?.name
                  "
              />
              <admin-log-sell
                :title="
                    directory?.action?.find((elem) => elem.id === item.action)
                      ?.name
                  "
              />
              <admin-log-sell :title="item.experience"/>
              <admin-log-sell :title="item.created_at"/>
              <td class="sticky-button">
                <button
                  class="btn btn-sm p-0 mx-3 admin-logs-table-edit-btn"
                  @click="toEditAchievement(item)"
                >
                  <svg-icon name="edit"/>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <common-pagination
          :pagination="{ ...adminAchievementsStore.page, current: currentPage }"
          :per-page="adminAchievementsStore.page.per_page"
          @show-more="onShowMore"
          @page="onPage"
        />
      </div>
      <loader
        class="admin-logs-content-loader"
        :listener="adminAchievementsStore.fetching"
      />
      <div v-if="!adminAchievementsStore.list.length">
        <h4 class="my-4">Список наград пуст</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import useAdminAchievementsStore from '~/stores/admin-achievements'
import _debounce from 'lodash.debounce';

const selectStatus = ref([]);
const selectSubject = ref([]);
const selectClass = ref([]);
const selectCourseTypeGia = ref([]);

const adminAchievementsStore = useAdminAchievementsStore();
const directory = computed(() => adminAchievementsStore.directory);

const router = useRouter();
const route = useRoute();
const thisYear = ref(new Date().getFullYear());
const prevYear = ref(thisYear.value - 1);
const isVisibleResetButton = ref(false);
const searchInput = ref(route.query.findName || "");
const searchInputTheme = ref("");

const currentPage = computed(() => {
  const queryPage = parseInt(route.query.page);
  const storePage = adminAchievementsStore.page.current;

  return queryPage || storePage;
});

const debouncedFetchAchievements = _debounce((queryParams) => {
  adminAchievementsStore.fetchAchievements(queryParams);
}, 300);

const debouncedFetchAchievementsThemes = _debounce((value) => {
  adminAchievementsStore.fetchAchievementsTheme(value);
}, 300);

const handleSearchName = (value) => {
  const filterQuery = getQueryFiltersInFetch();
  const themes = adminAchievementsStore.filters.currentThemes.map((item) => item.id).join(",");
  const queryParams = {...route.query};

  if (!!value) {
    queryParams.findName = value;
    queryParams.page = 1;
    isVisibleResetButton.value = true;
  } else {
    delete queryParams.findName;
    delete filterQuery.findName
  }

  router.push({query: queryParams});
  debouncedFetchAchievements({...filterQuery, ...queryParams, theme: themes});
};

const onClickTheme = (item) => {
  const activeFilters = adminAchievementsStore.filters.currentThemes;
  isVisibleResetButton.value = true;

  if (!activeFilters.some((activeElement) => activeElement.id === item.id)) {
    adminAchievementsStore.filters.currentThemes = [...activeFilters, item];
  }
};

const removeFilter = (id) => {
  const newThemes = adminAchievementsStore.filters.currentThemes.filter(
    (item) => item.id !== id
  );
  adminAchievementsStore.filters.currentThemes = [...newThemes];
};

watch(
  () => [
    adminAchievementsStore.filters.currentThemes,
    selectStatus,
    selectSubject,
    selectClass,
    selectCourseTypeGia,
    searchInput.value,
  ],
  ([
     currentThemes,
     selectStatus,
     selectSubject,
     selectClass,
     selectCourseTypeGia,
     search,
   ]) => {
    const queryParams = {...route.query};
    const hasActiveStatus = selectStatus.length > 0;
    const hasActiveSubjects = selectSubject.length > 0;
    const hasActiveClass = selectClass.length > 0;
    const hasActiveTypeGIA = selectCourseTypeGia.length > 0;
    const hasActiveThemes = currentThemes.length > 0;

    const hasSearchInput = queryParams.findName
      ? queryParams.findName !== "" && searchInput.value !== ""
      : false;

    isVisibleResetButton.value =
      hasActiveStatus ||
      hasActiveSubjects ||
      hasActiveClass ||
      hasActiveTypeGIA ||
      hasActiveThemes ||
      hasSearchInput;
  }
);

const isResettingCurrentThemes = ref(false);
const isResettingSearchInputTheme = ref(false);
const isResettingSearchInput = ref(false);
const isResettingPageCurrent = ref(false);
const isResettingFiltersSelect = ref(false);

const resetFilters = async () => {
  isResettingCurrentThemes.value = true;
  isResettingSearchInputTheme.value = true;
  isResettingSearchInput.value = true;
  isResettingPageCurrent.value = true;
  isResettingFiltersSelect.value = true;

  const queryParams = {...route.query};
  router.push({query: {page: 1, sort: queryParams.sort}});

  selectStatus.value = [];
  selectSubject.value = [];
  selectClass.value = [];
  selectCourseTypeGia.value = [];
  adminAchievementsStore.filters.currentThemes = [];
  adminAchievementsStore.filters.subject = [];
  adminAchievementsStore.filters.class = [];
  adminAchievementsStore.filters.status = [];
  adminAchievementsStore.filters.courseTypeGia = [];
  searchInputTheme.value = "";
  searchInput.value = "";
  adminAchievementsStore.page.current = 1;

  await adminAchievementsStore.fetchAchievements({page: 1, sort: queryParams.sort});
  isResettingCurrentThemes.value = false;
  isResettingSearchInputTheme.value = false;
  isResettingSearchInput.value = false;
  isResettingPageCurrent.value = false;
  isResettingFiltersSelect.value = false;
};

const getQueryFiltersInFetch = () => {
  const queryParams = {};

  if (!!adminAchievementsStore.filters.courseTypeGia.length) {
    queryParams.course_type_gia =
      adminAchievementsStore.filters.courseTypeGia.join(",");
  }

  if (!!adminAchievementsStore.filters.status.length) {
    queryParams.status = adminAchievementsStore.filters.status.join(",");
  }

  if (!!adminAchievementsStore.filters.subject.length) {
    queryParams.subject = adminAchievementsStore.filters.subject.join(",");
  }

  if (!!adminAchievementsStore.filters.class.length) {
    queryParams.class = adminAchievementsStore.filters.class.join(",");
  }

  return queryParams;
};

watch(
  () => [
    selectStatus.value,
    selectSubject.value,
    selectClass.value,
    selectCourseTypeGia.value,
  ],
  ([
     selectStatus,
     selectSubject,
     selectClass,
     selectCourseTypeGia,
   ]) => {
    if (isResettingFiltersSelect.value) {
      isResettingFiltersSelect.value = false;
      return;
    }

    const themes = adminAchievementsStore.filters.currentThemes.map((item) => item.id).join(",");
    const queryParams = {...route.query, page: 1, theme: themes};
    const isActiveSelects =
      !!selectStatus.length ||
      !!selectSubject.length ||
      !!selectClass.length ||
      !!selectCourseTypeGia.length ||
      !!queryParams.findName ||
      !!themes;

    isVisibleResetButton.value = isActiveSelects;

    if (!!selectCourseTypeGia.length) {
      queryParams.course_type_gia = selectCourseTypeGia.join(",");
      adminAchievementsStore.filters.courseTypeGia = selectCourseTypeGia;
    } else {
      delete queryParams.course_type_gia;
      adminAchievementsStore.filters.courseTypeGia = [];
    }

    if (!!selectStatus.length) {
      queryParams.status = selectStatus.join(",");
      adminAchievementsStore.filters.status = selectStatus;
    } else {
      delete queryParams.status;
      adminAchievementsStore.filters.status = [];
    }

    if (!!selectSubject.length) {
      queryParams.subject = selectSubject.join(",");
      adminAchievementsStore.filters.subject = selectSubject;
    } else {
      delete queryParams.subject;
      adminAchievementsStore.filters.subject = [];
    }

    if (!!selectClass.length) {
      queryParams.class = selectClass.join(",");
      adminAchievementsStore.filters.class = selectClass;
    } else {
      delete queryParams.class;
      adminAchievementsStore.filters.class = [];
    }

    adminAchievementsStore.fetchAchievements(queryParams);
  }
);

watch(
  () => adminAchievementsStore.filters.currentThemes,
  (newCurrentThemes) => {
    if (isResettingCurrentThemes.value) {
      isResettingCurrentThemes.value = false;
      return;
    }

    const filterQuery = getQueryFiltersInFetch();
    const queryParams = {...route.query, page: 1};

    router.push({query: queryParams});

    queryParams.theme = newCurrentThemes.map((item) => item.id).join(",");
    adminAchievementsStore.fetchAchievements({
      ...queryParams,
      ...filterQuery,
    });
  }
);

watch(
  () => searchInputTheme.value,
  (newValue) => {
    if (isResettingSearchInputTheme.value) {
      isResettingSearchInputTheme.value = false;
      return;
    }

    if (newValue.length > 2) {
      debouncedFetchAchievementsThemes(newValue);
    }
  }
);

watch(
  () => searchInput.value,
  (newValue) => {
    if (isResettingSearchInput.value) {
      isResettingSearchInput.value = false;
      return;
    }

    handleSearchName(newValue);
  }
);

watch(
  () => adminAchievementsStore.page.current,
  (newCurrentPage) => {
    if (isResettingPageCurrent.value) {
      isResettingPageCurrent.value = false;
      return;
    }
    const themes = adminAchievementsStore.filters.currentThemes.map((item) => item.id).join(",");
    const filterQuery = getQueryFiltersInFetch();
    const queryParams = {
      ...route.query,
      ...filterQuery,
      theme: themes,
      page: newCurrentPage,
    };

    adminAchievementsStore.fetchAchievements(queryParams);
  }
);


onMounted(async () => {
  const queryParams = {...route.query};
  adminAchievementsStore.order.by = queryParams.sort
    ? queryParams.sort.split("_")[0]
    : "";
  adminAchievementsStore.order.dir = queryParams.sort
    ? queryParams.sort.split("_")[1]
    : "";
  const hasActiveStatus = selectStatus.length > 0;
  const hasActiveSubjects = selectSubject.length > 0;
  const hasActiveClass = selectClass.length > 0;
  const hasActiveTypeGIA = selectCourseTypeGia.length > 0;
  const hasSearchInput = queryParams.findName
    ? queryParams.findName !== ""
    : false;

  isVisibleResetButton.value =
    hasActiveStatus ||
    hasActiveSubjects ||
    hasActiveClass ||
    hasActiveTypeGIA ||
    hasSearchInput;

  await adminAchievementsStore.fetchAchievements(queryParams);
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.name !== "admin-achievements") {
    adminAchievementsStore.$reset();
  }
});

onUnmounted(() => {
  adminAchievementsStore.reset();
});

const setSorter = (name) => {
  const {order} = adminAchievementsStore;
  const queryParams = {...route.query};
  const filterQuery = getQueryFiltersInFetch();

  if (order.by === name) {
    if (order.dir === "asc") {
      order.dir = "desc";
    } else if (order.dir === "desc") {
      delete order.by;
      delete order.dir;
    }
  } else {
    order.by = name;
    order.dir = "asc";
  }

  if (order.by) {
    queryParams.sort = `${order.by}_${order.dir}`;
  } else {
    delete queryParams.sort;
  }

  const themes = adminAchievementsStore.filters.currentThemes.map((item) => item.id).join(",");

  router.push({query: queryParams});
  adminAchievementsStore.fetchAchievements({...filterQuery, ...queryParams, theme: themes});
};

const dir = (name) => {
  const {by, dir} = adminAchievementsStore.order;
  if (by === name) {
    return dir === "desc" ? 1 : 2;
  }
  return 0;
};

const onPage = async (page) => {
  const queryParams = {...route.query};
  queryParams.page = page;
  router.push({query: queryParams});
  adminAchievementsStore.page.current = page;
};

const onShowMore = async (page) => {
  const queryParams = {...route.query};
  queryParams.page = page;
  router.push({query: queryParams});
  adminAchievementsStore.page.append = true;
  adminAchievementsStore.page.current = page;
};

const create = () => {
  eventBus.emit("alert:show", {
    title: "Создать Награду",
    contentComponent: "helperAlertContentAdministrateAchievement",
    maxWidth: "860px",
    additionalData: {isCreate: true},
    hideAllButtons: true,
  });
};

const toEditAchievement = (item) => {
  eventBus.emit("alert:show", {
    title: `Редактирование ${item.name}`,
    contentComponent: "helperAlertContentAdministrateAchievement",
    maxWidth: "860px",
    additionalData: item,
    hideAllButtons: true,
  });
};

await useAsyncData("admin-achievements", () =>
  Promise.all([adminAchievementsStore.fetch({resetBefore: true})])
);
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.part-reset {
  margin: 25px 0;
  color: #0576ff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  .svg-icon {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    color: $color-blue-normal;
  }
}

.filters-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  width: 200px;
  color: rgb(37, 76, 232);
  background-color: rgb(240, 242, 252);
  border-radius: 0.75em;
  padding: 6px 10px;
}

.filter-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
}

.delete-icon {
  margin-left: 10px;
  cursor: pointer;
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}

.searches-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.selects-container {
  display: flex;
  justify-content: space-between;
}

.admin-achievements-filters {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 501;

  &-title {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  &-selects {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.input-select-multi {
  width: 300px;
}

.autocomplete-input {
  border-radius: 10px;
  border: 1px solid #0c1524;
  background: #fff;
  display: flex;
  height: 44px;
  padding: 0 16px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
}

.sticky-button {
  position: sticky;
  right: 0;
}

.admin-logs {
  &-filters {
    position: relative;
    margin-top: 1.5rem;

    &-roles {
      display: grid;
      grid-template-columns: max-content 30% 30%;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    &-info {
      margin-top: 1.5rem;
    }

    &-sub {
      display: grid;
      grid-template-columns: max-content max-content minmax(200px, 300px) minmax(
          200px,
          300px
        );
      gap: 2rem;
      align-items: center;
    }
  }

  &-table {
    position: relative;
    border-collapse: separate;
    border-spacing: 0px;
    border-radius: 0.5rem !important;

    &-container {
      overflow-x: scroll;
      border-right: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
    }

    &-edit-btn {
      border: none !important;

      svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        color: $color-blue-normal;
      }
    }

    &-row-is-me {
      background: #f9f9f9;
    }

    &-header-row {
      user-select: none;
      position: sticky;
      top: 0px;
      background: #fff;

      &-cell {
        cursor: pointer;

        &:hover {
          color: $color-blue-normal;
        }
      }
    }
  }

  &-empty {
    padding: 5rem;
  }

  &-content {
    position: relative;

    &-loader {
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      margin-left: -2px;
      margin-top: -2px;

      --loader-padding-bottom: 30%;
    }
  }
}

.label {
  color: $color-dark;
  font-size: 14px;
}

.admin-link:hover {
  cursor: pointer;
  color: #0576ff;
}
</style>
