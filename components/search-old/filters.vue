<template>
  <div
    :class="[{'disabled': searchStore.fetching}]"
    class="search-filters">
    <div class="search-filters-query">
      <input-search
        find-tpl="btn-default"
        @search="onSearch"
        v-model:value="bySearchString"/>
    </div>
    <div class="search-filters-content">
      <transition name="transition-fade">
        <div
          v-if="currentTub.id !== 'all'"
          v-tooltip="{title: 'Дополнительно'}"
          @click="toggleCategoryFilters"
          :class="[{'toggled': categoryFilterShow}]"
          class="btn search-filters-content-btn">
          <svg-icon
            class="search-filters-content-btn-icon"
            name="setting"/>
          <span>Фильтры</span>
          <div class="search-filters-content-btn-count">
            {{ selectedFiltersCount }}
          </div>
          <svg-icon
            class="search-filters-content-btn-arrow"
            name="arrow-bottom"/>
        </div>
      </transition>
      <transition name="transition-fade">
        <div
          v-if="searchStore.filtersInvolved"
          @click="searchStore.resetFilters()"
          class="icon-text search-filters-content-reset">
          <svg-icon name="cross"/>
          <span>Сбросить фильтры</span>
        </div>
      </transition>
    </div>
    <div class="search-filters-add">
      <div
        ref="addFiltersCollapse"
        class="collapse">
        <div class="pt-4"/>
        <div class="search-filters-add-panel">
          <div v-if="currentTub.id === 'tasks'">
            <div class="search-filters-add-panel-grid">
              <div>
                <div class="search-filters-add-panel-f-attestation">
                  <div class="search-filters-add-panel-caption">
                    Экзамен
                  </div>
                  <input-radio-group
                    type="button"
                    theme="gaped"
                    :list="searchStore.getFilterData('attestation')"
                    :resettable="true"
                    v-model:value="byAttestationType"/>
                </div>
                <div class="search-filters-add-panel-f-classes mt-4">
                  <div class="search-filters-add-panel-caption">
                    Класс
                  </div>
                  <input-checkbox-group
                    theme="gaped"
                    type="button"
                    name-field="short"
                    :list="searchStore.getFilterData('classes')"
                    v-model:value="byClasses"/>
                </div>
                <div class="search-filters-add-panel-f-years mt-4">
                  <div class="search-filters-add-panel-caption">
                    Год
                  </div>
                  <input-select-multi
                    placeholder="Не важно"
                    when-select-all-placeholder="Все года"
                    :disabled="searchStore.filters.years.disabled"
                    :list="searchStore.getFilterData('years')"
                    v-model:value="byYears"/>
                </div>
                <div class="search-filters-add-panel-f-subjects mt-4">
                  <div class="search-filters-add-panel-caption">
                    Предмет
                  </div>
                  <input-select-multi
                    placeholder="Не важно"
                    when-select-all-placeholder="Все предметы"
                    :disabled="searchStore.filters.subjects.disabled"
                    :list="searchStore.getFilterData('subjects')"
                    v-model:value="bySubjects"/>
                </div>
                <div
                  :class="[{'disabled': !partFilterData.length}]"
                  class="search-filters-add-panel-f-part">
                  <div class="search-filters-add-panel-caption mt-4">
                    Часть
                  </div>
                  <input-checkbox-group
                    v-if="partFilterData.length"
                    theme="gaped"
                    type="button"
                    :list="partFilterData"
                    v-model:value="byPartType"/>
                  <div
                    v-if="!partFilterData.length"
                    class="btn btn-simple disabled">Недоступно
                  </div>
                  <loader
                    class="search-filters-add-panel-f-part-loader"
                    :listener="searchStore.fetchingParts"/>
                </div>
              </div>
              <div>
                <div class="search-filters-add-panel-f-type">
                  <div class="search-filters-add-panel-caption">
                    Тип задания
                  </div>
                  <input-checkbox-group
                    theme="gaped"
                    type="button"
                    :list="searchStore.getFilterData('type')"
                    v-model:value="byProblemType"/>
                </div>
                <div class="search-filters-add-panel-f-topics mt-4">
                  <div class="search-filters-add-panel-caption">
                    Тема
                  </div>
                  <div
                    v-if="topicsDetails.length"
                    class="search-filters-add-panel-topics">
                    <div
                      v-for="(topic, index) in topicsDetails"
                      :key="index"
                      v-tooltip="{title: topic.name}"
                      class="search-filters-add-panel-topic">
                      <div class="search-filters-add-panel-topic-name">
                        {{ topic.name }}
                      </div>
                      <svg-icon
                        @click="removeTopic(topic)"
                        class="search-filters-add-panel-topic-cross"
                        name="cross"/>
                    </div>
                  </div>
                  <div
                    @click="selectTopics"
                    :class="{'disabled': selectTopicsIsDisabled}"
                    class="btn btn-simple">
                    Выбрать тему
                  </div>
                </div>
                <div
                  v-if="userStore.logged"
                  class="search-filters-add-panel-f-status mt-4">
                  <div class="search-filters-add-panel-caption">
                    Статус
                  </div>
                  <input-select-single
                    placeholder="Любой"
                    :disabled="searchStore.filters.status.disabled"
                    :list="searchStore.getFilterData('status')"
                    v-model:value="byStatus"/>
                </div>
                <div class="search-filters-add-panel-f-complexity mt-4">
                  <div class="search-filters-add-panel-caption">
                    Сложность
                  </div>
                  <input-checkbox-group
                    theme="gaped"
                    type="button"
                    :list="searchStore.getFilterData('complexity')"
                    v-model:value="byComplexityType"/>
                </div>
              </div>
              <loader
                class="search-filters-add-panel-loader"
                :listener="localLoaderShow || searchStore.fetching"/>
            </div>
            <div class="search-filters-add-panel-footer mt-5">
              <div class="search-filters-add-panel-footer-col-1">
                <div
                  @click="categoryFilterShow = false"
                  class="icon-text search-filters-add-panel-footer-collapse">
                  <span>Свернуть</span>
                  <svg-icon name="arrow-top"/>
                </div>
                <transition name="transition-fade">
                  <div
                    v-if="searchStore.filtersInvolved"
                    @click="searchStore.resetFilters()"
                    class="icon-text search-filters-content-reset color-blue-normal">
                    <svg-icon name="cross"/>
                    <span>Сбросить фильтры</span>
                  </div>
                </transition>
              </div>
              <div/>
            </div>
          </div>
          <div v-if="currentTub.id === 'tests'">
            <div class="search-filters-add-panel-grid">
              <div>
                <div class="search-filters-add-panel-f-attestation">
                  <div class="search-filters-add-panel-caption">
                    Экзамен
                  </div>
                  <input-radio-group
                    type="button"
                    theme="gaped"
                    :list="searchStore.getFilterData('attestation')"
                    :resettable="true"
                    v-model:value="byAttestationType"/>
                </div>
                <div class="search-filters-add-panel-f-classes mt-4">
                  <div class="search-filters-add-panel-caption">
                    Класс
                  </div>
                  <input-checkbox-group
                    theme="gaped"
                    type="button"
                    name-field="short"
                    :list="searchStore.getFilterData('classes')"
                    v-model:value="byClasses"/>
                </div>
                <div class="search-filters-add-panel-f-years mt-4">
                  <div class="search-filters-add-panel-caption">
                    Год
                  </div>
                  <input-select-multi
                    placeholder="Не важно"
                    when-select-all-placeholder="Все года"
                    :disabled="searchStore.filters.years.disabled"
                    :list="searchStore.getFilterData('years')"
                    v-model:value="byYears"/>
                </div>
              </div>
              <div>
                <div class="search-filters-add-panel-f-subjects">
                  <div class="search-filters-add-panel-caption mt-4">
                    Предмет
                  </div>
                  <input-select-multi
                    placeholder="Не важно"
                    when-select-all-placeholder="Все предметы"
                    :disabled="searchStore.filters.subjects.disabled"
                    :list="searchStore.getFilterData('subjects')"
                    v-model:value="bySubjects"/>
                </div>
                <div class="search-filters-add-panel-f-topics mt-4">
                  <div class="search-filters-add-panel-caption">
                    Тема
                  </div>
                  <div
                    v-if="topicsDetails.length"
                    class="search-filters-add-panel-topics">
                    <div
                      v-for="(topic, index) in topicsDetails"
                      :key="index"
                      v-tooltip="{title: topic.name}"
                      class="search-filters-add-panel-topic">
                      <div class="search-filters-add-panel-topic-name">
                        {{ topic.name }}
                      </div>
                      <svg-icon
                        @click="removeTopic(topic)"
                        class="search-filters-add-panel-topic-cross"
                        name="cross"/>
                    </div>
                  </div>
                  <div
                    @click="selectTopics"
                    :class="{'disabled': selectTopicsIsDisabled}"
                    class="btn btn-simple">
                    Выбрать тему
                  </div>
                </div>
                <div
                  v-if="userStore.logged"
                  class="search-filters-add-panel-f-status mt-4">
                  <div class="search-filters-add-panel-caption">
                    Статус
                  </div>
                  <input-select-single
                    placeholder="Любой"
                    :disabled="searchStore.filters.status.disabled"
                    :list="searchStore.getFilterData('status')"
                    v-model:value="byStatus"/>
                </div>
              </div>
              <loader
                class="search-filters-add-panel-loader"
                :listener="localLoaderShow || searchStore.fetching"/>
            </div>
            <div class="search-filters-add-panel-footer mt-5">
              <div class="search-filters-add-panel-footer-col-1">
                <div
                  @click="categoryFilterShow = false"
                  class="icon-text search-filters-add-panel-footer-collapse">
                  <span>Свернуть</span>
                  <svg-icon name="arrow-top"/>
                </div>
                <transition name="transition-fade">
                  <div
                    v-if="searchStore.filtersInvolved"
                    @click="searchStore.resetFilters()"
                    class="icon-text search-filters-content-reset color-blue-normal">
                    <svg-icon name="cross"/>
                    <span>Сбросить фильтры</span>
                  </div>
                </transition>
              </div>
              <div/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-filters-bottom">
      <div class="search-filters-bottom-count">
        <span v-if="currentTotal">
          Нашлось <b>{{ currentTotal }} {{ declension(currentTotal, lexicon.decl.variants) }}</b>
        </span>
        <span v-if="!currentTotal">
          Нет результатов
        </span>
      </div>
      <div
        :class="[{'disabled': !searchStore.list.length}]"
        class="search-filters-bottom-sorter">
        <div
          @click="setOrder('popular')"
          :class="{'active': searchStore.getFilterValue('order') === 'popular'}"
          class="search-filters-bottom-sorter-item">
          Популярные
        </div>
        <div
          @click="setOrder('new')"
          :class="{'active': searchStore.getFilterValue('order') === 'new'}"
          class="search-filters-bottom-sorter-item">
          Новые
        </div>
        <div
          @click="setOrder('old')"
          :class="{'active': searchStore.getFilterValue('order') === 'old'}"
          class="search-filters-bottom-sorter-item">
          Старые
        </div>
      </div>
      <div
        :class="[{'disabled': !searchStore.list.length}]"
        class="search-filters-bottom-view-mode">
        <div
          :class="{'active': searchStore.getFilterValue('mode') === 'tile'}"
          @click="setViewMode('tile')"
          class="search-filters-bottom-view-mode-item">
          <svg-icon name="menu"/>
        </div>
        <div
          :class="{'active': searchStore.getFilterValue('mode') === 'row'}"
          @click="setViewMode('row')"
          class="search-filters-bottom-view-mode-item">
          <svg-icon name="menu-list"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useSearchStore from '~/stores/search';
import useUserStore from '~/stores/user';
import useCommonStore from '~/stores/common';
import _cloneDeep from 'lodash.clonedeep';

const searchStore = useSearchStore();
const userStore = useUserStore();
const partFilterData = computed(() => {
  return searchStore.getFilterData('part');
});
const bySearchString = computed({
  get: () => searchStore.getFilterValue('q'),
  set: (value) => searchStore.setFilterValue('q', value)
});

const props = defineProps({
  currentTub: {}
});

const byContentSet = (value) => {
  searchStore.savePresetAs({
    name: searchStore.filters.content.value,
    callback(preset) {
      if (preset.content.value === 'all') {
        preset.ac.value = false;
      }
    }
  });

  searchStore.setFilterValue('content', value, {
    withPreset: value,
    onPresetDataParsed(preset) {
      if ('q' in preset) {
        delete preset.q;
      }
    },
    onSetComplete() {
      if (searchStore.filters.content.value === 'all') {
        searchStore.filters.ac.value = false;
      }
    }
  });
};


onUnmounted(() => {
  eventBus.off("handle-change-active-filter-old", byContentSet);
});


const byAttestationType = computed({
  get: () => searchStore.getFilterValue('attestation'),
  set: (value) => searchStore.setFilterValue('attestation', value)
});
const byClasses = computed({
  get: () => searchStore.getFilterValue('classes'),
  set: (value) => searchStore.setFilterValue('classes', value)
});
const byYears = computed({
  get: () => searchStore.getFilterValue('years'),
  set: (value) => searchStore.setFilterValue('years', value)
});
const bySubjects = computed({
  get: () => searchStore.getFilterValue('subjects'),
  set: (value) => searchStore.setFilterValue('subjects', value)
});
const byPartType = computed({
  get: () => searchStore.getFilterValue('part'),
  set: (value) => searchStore.setFilterValue('part', value)
});
const byProblemType = computed({
  get: () => searchStore.getFilterValue('type'),
  set: (value) => searchStore.setFilterValue('type', value)
});
const byStatus = computed({
  get: () => searchStore.getFilterValue('status'),
  set: (value) => searchStore.setFilterValue('status', value)
});
const byComplexityType = computed({
  get: () => searchStore.getFilterValue('complexity'),
  set: (value) => searchStore.setFilterValue('complexity', value)
});
const byTopics = computed({
  get: () => searchStore.getFilterValue('topics'),
  set: (value) => searchStore.setFilterValue('topics', value)
});
const selectTopicsIsDisabled = computed(() => {
  if (props.currentTub.id === 'tests') {
    return searchStore.filters.attestation.disabled
      && searchStore.filters.subjects.disabled
      && searchStore.filters.years.disabled
      && searchStore.filters.classes.disabled
      && searchStore.filters.status.disabled;
  }

  if (props.currentTub.id === 'tasks') {
    return searchStore.filters.attestation.disabled
      && searchStore.filters.classes.disabled
      && searchStore.filters.years.disabled
      && searchStore.filters.subjects.disabled
      && searchStore.filters.type.disabled
      && searchStore.filters.status.disabled
      && searchStore.filters.complexity.disabled;
  }

  return false;
});
const selectedFiltersCount = computed(() => {
  return [
    byAttestationType.value,
    byClasses.value,
    byYears.value,
    bySubjects.value,
    byPartType.value,
    byProblemType.value,
    byTopics.value,
    byStatus.value,
    byComplexityType.value
  ].reduce((acc, item) => item?.length > 0 ? ++acc : acc, 0) || undefined;
});
const categoryFilterShow = computed({
  get: () => searchStore.getFilterValue('ac'),
  set: (value) => searchStore.setFilterValue('ac', value)
});
const currentTotal = computed(() => {
  return searchStore.counters[searchStore.filters.content.value];
});
const topicsDetails = ref([]);
const localLoaderShow = ref(false);
const addFiltersCollapse = ref(null);

watch(
  () => categoryFilterShow.value,
  async (show) => {
    await nextTick();
    show
      ? getFiltersCollapse().show()
      : getFiltersCollapse().hide();
  }
);

watch(
  () => byTopics.value,
  async (topics) => {
    topicsDetails.value = await useCommonStore().resolveTopics(topics);
  }, {immediate: true}
);

onMounted(() => {
  eventBus.on("handle-change-active-filter-old", byContentSet);
  sleep(150).then(() => getFiltersCollapse({toggle: categoryFilterShow.value}));
});

const onSearch = (q) => {
  searchStore.filters.q.accepted = searchStore.filters.q.value;
  if (searchStore.filters.q.value?.length > 2) {
    setUserSetting('search.q', searchStore.filters.q.value, {push: true, limit: 20, autoSave: true});
  }
};
const setViewMode = (mode) => {
  setUserSetting('search.viewMode', mode);
  searchStore.setFilterValue('mode', mode);
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
const selectTopics = () => {
  eventBus.emit('alert:show', {
    title: 'Выбор темы',
    contentComponent: 'helperAlertContentTopicsChoice',
    maxWidth: '980px',
    hideAllButtons: true,
    additionalData: {
      topics: _cloneDeep(byTopics.value),
      filters: {
        subjects: searchStore.filters.subjects,
        classes: searchStore.filters.classes,
      }
    },
    onAccept(event, context) {
      byTopics.value = _cloneDeep(event.data || []);
      context.hide();
    }
  });
};
const removeTopic = (topic) => {
  const topicsValue = _cloneDeep(byTopics.value);
  topicsValue.splice(
    topicsValue.indexOf(topic.id),
    1
  );
  byTopics.value = topicsValue;
};
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.search-filters {
  &-query {
    .input-search-input {
      padding: 0.9rem 1.5rem;
    }
  }

  &-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;

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
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    gap: 1.5rem;

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

  &-add {
    &-panel {
      position: relative;
      border: 1px solid $color-normal;
      border-radius: $border-radius;
      padding: 2rem;
      transition: all 250ms ease-out;

      &-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      &-caption {
        font-size: 0.875rem;
        color: $color-dark;
        margin-bottom: 0.5rem;
      }

      &-f-years {
        max-width: 10rem;
      }

      &-f-subjects {
        max-width: 13rem;
      }

      &-f-part {
        position: relative;

        &-loader {
          --loader-spinner-width: 2rem;
          --loader-spinner-height: 2rem;
          --loader-min-height: 0;

          justify-content: flex-start;
          position: absolute;
        }

        &.disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      }

      &-f-status {
        max-width: 13rem;
      }

      &-footer {
        &-col-1 {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        &-collapse {
          --icon-width: 0.7rem;
          --icon-height: 1rem;

          color: $color-dark;

          &:hover {
            color: $color-blue-normal;
          }
        }
      }

      &-topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      &-topic {
        cursor: pointer;
        display: flex;
        align-items: center;
        background: #f2f5fa;
        border-radius: 0.5rem;
        gap: 1rem;
        padding: 0.5rem 1rem;
        transition: $transition;

        &:hover {
          background: #e6e9f4;
        }

        &:hover &-cross {
          opacity: 1;
        }

        &-name {
          max-width: 25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &-cross {
          transition: $transition;
          width: 0.5rem;
          height: 0.5rem;
          opacity: 0.5;
        }
      }

      &-loader {
        border-radius: 1rem;
      }

      .disabled {
        background: #fff !important;
        opacity: 0.5 !important;
      }
    }

    .collapse.show &-panel {
      box-shadow: 0 16px 32px rgba(125, 148, 193, 0.24);
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
