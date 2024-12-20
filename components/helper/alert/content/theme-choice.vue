<template>
  <div class="ac-topic-choice">
    <div class="ac-topic-choice-header">
      <input-search
        class="ac-topic-choice-header-by-search"
        @search="onSearch"
        :min-length="3"
        v-model:value="searchString"/>
      <input-select-multi
        class="ac-topic-choice-header-by-classes"
        placeholder="Классы"
        when-select-all-placeholder="Все классы"
        :list="classesList"
        v-model:value="selectedClasses"/>
      <input-select-multi
        class="ac-topic-choice-header-by-subjects"
        placeholder="Предметы"
        when-select-all-placeholder="Все предметы"
        :list="subjectsList"
        v-model:value="selectedSubjects"/>
    </div>
    <div
      ref="infoCollapse"
      class="collapse ac-topic-choice-info">
      <div class="w-100 pt-3"/>
      <div class="ac-topic-choice-info-content">
        <div
          v-for="subject in selectedSubjects"
          :key="subject"
          :title="resolveSubject(subject).name"
          class="ac-topic-choice-info-tag">
          <span class="ac-topic-choice-info-tag-name">{{ resolveSubject(subject).name }}</span>
          <svg-icon
            title="Убрать"
            @click="removeSubject(subject)"
            class="ac-topic-choice-info-tag-cross"
            name="cross"/>
        </div>

        <div
          v-for="subject in selectedClasses"
          :key="subject"
          :title="subject + ' класс'"
          class="ac-topic-choice-info-tag">
          <span class="ac-topic-choice-info-tag-name">{{ subject }} класс</span>
          <svg-icon
            title="Убрать"
            @click="removeClass(subject)"
            class="ac-topic-choice-info-tag-cross"
            name="cross"/>
        </div>

        <div
          v-if="filtersInvolved"
          @click="resetFilters"
          class="ac-topic-choice-info-reset">
          Очистить
        </div>
      </div>
    </div>
    <div class="ac-topic-choice-border mt-3"/>
    <div
      :class="[{'top-gradient': contentTopGradientShow}]"
      class="ac-topic-choice-content mt-4">
      <div
        ref="scroller"
        :class="[{'disabled': fetching || !scrollerEnabled}]"
        class="ac-topic-choice-content-scroller scroller-default">
        <div
          v-for="(item, index) in topicsList"
          :key="index"
          :title="item.name"
          class="ac-topic-choice-content-item"
          @click="topicChoiceChange(item)">
          <div
            class="ac-topic-choice-content-item-name"
            :title="item.name">
            <input
              type="radio"
              :checked="isChecked(item)">
            {{ item.name }}
          </div>
        </div>
        <common-empty
          v-if="!topicsList.length && !fetching"
          @click="resetFilters(true)"/>
      </div>
      <loader
        class="ac-topic-choice-content-loader"
        :listener="fetching"/>
    </div>
  </div>
</template>

<script setup>
  import useCommonStore from '~/stores/common';
  import SmoothScrollbar from 'smooth-scrollbar';
  import _isEqual from 'lodash.isequal';
  import {paginationCalculator} from 'pagination-calculator';

  const props = defineProps(alertContentProps());
  const emit = defineEmits(['event']);
  const searchString = ref('');
  const acceptedSearchString = ref('');
  const selectedSubjects = ref([]);
  const selectedClasses = ref([]);
  const pagination = ref({
    page: 1,
    last_page: 1,
    total: 0
  });
  const nextAppend = ref(false);
  const fetching = ref(false);
  const scrollerEnabled = ref(true);
  const scroller = ref(null);
  const infoCollapse = ref(null);
  const scrollerStatus = ref({offset: {x: 0, y: 0}, limit: {x: 0, y: 0}});
  const contentTopGradientShow = ref(false);
  const topicsData = ref([]);
  const topicsList = computed(() => {
    return topicsData.value;
  });
  const selectedTopics = ref([]);
  const subjectsList = computed(() => useCommonStore().filtersData.data.subjects);
  const classesList = computed(() => ([
    {
      name: '5 класс',
      short: '5',
      id: 5
    },
    {
      name: '6 класс',
      short: '6',
      id: 6
    },
    {
      name: '7 класс',
      short: '7',
      id: 7
    },
    {
      name: '8 класс',
      short: '8',
      id: 8
    },
    {
      name: '9 класс',
      short: '9',
      id: 9
    }
  ]));
  const paginationInfo = computed(() => paginationCalculator({
    total: pagination.value.total,
    current: pagination.value.page,
    pageSize: 50
  }));
  const filtersInvolved = computed(() => {
    return selectedSubjects.value.length > 0
      || selectedClasses.value.length > 0;
  });
  let scrollerInst = null;

  watch(
    () => JSON.stringify({
      search: acceptedSearchString.value,
      subjects: selectedSubjects.value,
      classes: selectedClasses.value,
      page: pagination.value.page
    }),
    async (o, n) => {
      const newPayload = JSON.parse(o);
      const oldPayload = JSON.parse(n);
      const objectsDiff = getObjectsDiff(newPayload, oldPayload);

      if (_isEqual(objectsDiff, ['page']) && newPayload.page === 1) {
        return;
      }

      scrollerEnabled.value = false;

      if (objectsDiff.some((filter) => ['search', 'subjects', 'classes'].includes(filter))) {
        if (pagination.value.page > 1) {
          pagination.value.page = 1;
        }
      }

      if (_isEqual(objectsDiff, ['page'])) {
        scrollerInst.setMomentum(0, -20);
      } else {
        scrollerInst.setPosition(0, 0);
      }

      await fetch();
      await sleep(50);
      scrollerEnabled.value = true;
    }
  );
  watch(
    () => scrollerStatus.value.offset.y,
    (y) => {
      contentTopGradientShow.value = y > 0;

      if (y === scrollerStatus.value.limit.y) {
        nextPage();
      }
    }
  );

  watch(
    () => filtersInvolved.value,
    async (involved) => {
      if (involved) {
        await nextTick();
        getInfoCollapse().show();
      } else {
        getInfoCollapse().hide();
      }
    }
  );

  onBeforeMount(() => {
    selectedTopics.value = [];
  });
  onMounted(() => {
    scrollerInst = SmoothScrollbar.init(scroller.value, {alwaysShowTracks: true});
    scrollerInst.addListener((status) => Object.assign(scrollerStatus.value, status));
    fetch();
  });
  onUnmounted(() => {
    if (scrollerInst) {
      SmoothScrollbar.destroy(scroller.value);
    }
  });

  const acceptTopics = () => {
    emit('event', {
      type: 'onAccept',
      data: selectedTopics.value
    });
  };
  const onSearch = (q) => {
    if (!q) {
      return;
    }

    acceptedSearchString.value = searchString.value;
  };

  const topicChoiceChange = (value, $event) => {
    selectedTopics.value = [];
    selectedTopics.value.push(value);
    acceptTopics();
  };
  const isChecked = (item) => {
    return props.data.currentThemeId === item.id;
  };
  const getInfoCollapse = (config) => {
    return window.$bootstrap.Collapse.getOrCreateInstance(infoCollapse.value, config);
  };
  const resetFilters = (withPage = false) => {
    selectedSubjects.value = [];
    selectedClasses.value = [];
    if (withPage === true) {
      pagination.value.page = 1;
    }
  };
  const resolveSubject = (id) => {
    return subjectsList.value.find((_subject) => _subject.id === id);
  };
  const removeSubject = (id) => {
    selectedSubjects.value.splice(
      selectedSubjects.value.indexOf(id),
      1
    );
  };
  const removeClass = (id) => {
    selectedClasses.value.splice(
      selectedClasses.value.indexOf(id),
      1
    );
  };

  const fetch = async () => {
    fetching.value = true;

    try {
      const response = await useApi('/api/topics', {
        ...methodGet,
        query: {
          ...acceptedSearchString.value ? {find: acceptedSearchString.value} : null,
          ...selectedClasses.value.length ? {parallel_id: selectedClasses.value.join(',')} : null,
          ...selectedSubjects.value.length ? {subject_id: selectedSubjects.value.join(',')} : null,
          ...{page: pagination.value.page}
        }
      });
      if (response.data.done) {
        if (nextAppend.value) {
          topicsData.value = [...topicsData.value, ...response.data.topics];
        } else {
          topicsData.value = [...response.data.topics];
        }

        pagination.value.total = response.data.total;
        pagination.value.last_page = response.data.last_page;
        nextAppend.value = false;
      }
    } catch (e) {
      console.error(e.message);
    }

    fetching.value = false;
  };
  const nextPage = () => {
    if (paginationInfo.value.next) {
      nextAppend.value = true;
      pagination.value.page += 1;
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-topic-choice {
    margin-top: -1rem;

    &-header {
      position: relative;
      display: grid;
      grid-template-columns: minmax(400px, 530px) minmax(150px, 200px) minmax(150px, 202px);
      z-index: 510;

      &-by-search {
        position: relative;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;

        &:hover {
          z-index: 20;
        }
      }

      &-by-classes {
        position: relative;
        margin-left: -1px;

        .btn {
          border-radius: 0;
        }

        &:hover {
          z-index: 20;
        }
      }

      &-by-subjects {
        position: relative;
        margin-left: -1px;

        .btn {
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
        }

        &:hover {
          z-index: 20;
        }
      }
    }

    &-info {
      &-content {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
        align-items: center;
      }

      &-tag {
        display: flex;
        align-items: center;
        background: $color-black-10;
        font-size: 0.875rem;
        gap: 0.5rem;
        padding: 0.313rem 0.75rem;
        border-radius: 1.5rem;
        cursor: pointer;
        transition: $transition;

        &:hover {
          background: #e8ecf3;
        }

        &-cross {
          padding: 0.25rem;
          width: 1rem;
          height: 1rem;
          position: relative;
          top: 1px;
          color: $color-dark;

          &:hover {
            color: $color-blue-normal;
          }
        }
      }

      &-reset {
        cursor: pointer;
        font-size: 0.875rem;
        color: $color-blue-normal;
        margin-left: 1rem;

        &:hover {
          color: #004fa2;
        }
      }
    }

    &-classes {
      position: relative;
      display: flex;
      cursor: pointer;
      transition: $transition;
    }

    &-content {
      position: relative;
      min-height: 3rem;

      &.top-gradient::before {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        height: 0.7rem;
        background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
        z-index: 5;
        top: 0;
        pointer-events: none;
      }

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        height: 0.7rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
        z-index: 5;
        bottom: 0;
        pointer-events: none;
      }

      &-item {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin-bottom: 0.5rem;
        cursor: pointer;

        &-name {
          max-width: 95%;
          display: inline-block !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        input {
          margin-right: 0.3rem;
          cursor: pointer;
        }
      }

      &-scroller {
        max-height: 30vh;
        min-height: 30vh;
        overflow: hidden;
        margin-right: -1.2rem;

        &.disabled {
          pointer-events: none;
        }
      }

      &-loader {
        --loader-spinner-width: 2.5rem;
        --loader-spinner-height: 2.5rem;
        --loader-min-height: none;
      }
    }

    &-footer {
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 2rem;
      margin-bottom: -1rem;
      justify-items: flex-start;

      &-reset {
        cursor: pointer;
        display: inline-block;
        transition: $transition;
        color: $color-normal;

        &:hover {
          color: $color-blue-normal;
        }
      }

      &-counter {
        display: flex;
        gap: 0.5rem;
        transition: $transition;

        &.hidden {
          opacity: 0;
        }

        &-count {
          font-size: 0.813rem;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          color: #fff;
          background: $color-blue-normal;
        }
      }
    }

    &-border {
      height: 1px;
      background: $color-normal;
      margin-left: -1.5rem;
      margin-right: -1.5rem;
    }
  }
</style>
