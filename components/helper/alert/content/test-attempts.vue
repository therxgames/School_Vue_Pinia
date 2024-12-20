<template>
  <div
    ref="container"
    :class="`ac-test-attempts--${watchGroupAccept}`"
    class="ac-test-attempts">
    <div v-if="(fetching || !isInitialized) && !isError">
      <loader
        class="ac-test-attempts-loader"
        :listener="fetching"/>
    </div>
    <div v-if="!fetching && isInitialized && !isError">
      <div class="ac-test-attempts-header">
        <div class="ac-test-attempts-header-id">
          <svg-icon
            class="ac-test-attempts-header-id-icon"
            name="tag"/>
          <span class="ac-test-attempts-header-id-id">
            {{ props.data.parent_id }}
          </span>
        </div>
        <div class="ac-test-attempts-header-name">
          {{ currentTest.name }}
        </div>
      </div>
      <div
        ref="scroller"
        class="ac-test-attempts-content scroller-default">
        <div
          v-for="(attempt, index) in attemptsGroupJoined"
          :key="index"
          :data-id="attempt.id"
          :class="[
            {'ac-test-attempts-item--actual': attempt.test_id === currentTest.id},
            {'ac-test-attempts-item--outdated': attempt.test_id !== currentTest.id},
            {'d-none': attempt.test_version === currentTest.version && watchGroupAccept === group.OUTDATED},
            {'d-none': attempt.test_version !== currentTest.version && watchGroupAccept === group.ACTUAL}
          ]"
          class="ac-test-attempts-item">
          <div
            @click="toggleInfo(attempt.id)"
            class="ac-test-attempts-item-grid">
            <div class="ac-test-attempts-item-name color-blue-normal">
              Попытка {{ attemptsGroupJoined.length - index }}
            </div>
            <div class="ac-test-attempts-item-date">
              {{ formatDate(parseAndAdd(attempt.last_action_at), 'd MMM yyyy, HH:mm') }}
            </div>
            <div
              v-if="watchGroupAccept === group.OUTDATED"
              class="ac-test-attempts-item-version">
              Версия {{ attempt.test_version }}
            </div>
            <div
              :class="['ac-test-attempts-item-status--' + attemptStatus(attempt).finishedMark]"
              class="ac-test-attempts-item-status">
              {{ attemptStatus(attempt).finishedScore }}
            </div>
          </div>
          <div
            class="ac-test-attempts-item-collapse ac-test-attempts-item-info collapse"
            :data-id="attempt.id">
            <div class="pt-3"/>
            <common-test-score
              :mark="attemptStatus(attempt).finishedMark"
              :score="attemptStatus(attempt).finishedScore"/>
            <div class="pt-3"/>
            <common-test-mode :mode="attempt.mode"/>
            <div class="pt-3"/>
            <div class="ac-test-attempts-item-info-dtl">
              Вы ответили правильно
              на {{ attempt.correctness }}
              {{ declension(attempt.correctness, lexicon.decl.answers) }}
              из {{ resolvedTest(attempt.test_id)?.tasks_count }}
            </div>
            <div class="ac-test-attempts-item-info-times mt-1">
              <div>
                Завершен {{ formatDate(parseAndAdd(attempt.last_action_at), 'd MMM yyyy г.') }}
              </div>
              <div>
                Время выполнения: <img src="~/assets/images/emoji/4.png"> {{ attemptStatus(attempt).duration }}
              </div>
              <a
                href="#"
                class="d-flex"
                style="color: #7f838a; font-size: 0.875rem;"
                @click.prevent="printTest(attempt.test_id, attempt.id)">
                <svg-icon
                  name="print"
                  class="me-2"/>
                <span>Распечатать</span>
              </a>
            </div>
            <div class="ac-test-attempts-item-info-actions mt-3">
              <div
                v-if="!currentTest.in_archive && attempt.test_version === currentTest.version"
                class="btn btn-simple btn-icon">
                <svg-icon name="reset"/>
                <span
                  v-if="attemptStatus(attempt).finishedMark === 'f'"
                  @click="goRetake(attempt.id)">
                  Пересдать
                </span>
                <span
                  v-else
                  @click="goRetake(attempt.id)">
                  Пройти заново
                </span>
              </div>
              <div
                @click="toggleInfo(attempt.id)"
                class="btn btn-primary">
                Свернуть
              </div>
            </div>
            <div class="pt-3"/>
          </div>
        </div>
      </div>
      <div
        v-if="outdatedAttemptsExists"
        class="ac-test-attempts-nav">
        <div
          :class="[{'current': watchGroup === group.ACTUAL}, {'disabled': !actualAttemptsExists}]"
          @click="watchGroup = group.ACTUAL"
          class="icon-text ac-test-attempts-nav-item outdated">
          <svg-icon
            v-if="watchGroup === group.OUTDATED"
            name="arrow-left"/>
          <span>Активные прохождения</span>
        </div>
        <div
          v-tooltip="{title: 'Статистика прохождений прошлых версий этого теста'}"
          :class="[{'current': watchGroup === group.OUTDATED}, {'disabled': !outdatedAttemptsExists}]"
          @click="watchGroup = group.OUTDATED"
          class="icon-text ac-test-attempts-nav-item outdated">
          <span>Неактивные прохождения</span>
          <svg-icon
            v-if="watchGroup === group.ACTUAL"
            name="arrow-right"/>
        </div>
      </div>
    </div>
    <div
      v-if="isError"
      class="ac-test-attempts-error">
      Ошибка разбора попыток
    </div>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import useCommonStore from '~/stores/common';
  import SmoothScrollbar from 'smooth-scrollbar';
  import {parseISO, format} from 'date-fns';

  const props = defineProps(alertContentProps());
  const emit = defineEmits(['event']);
  const group = {
    ACTUAL: 'actual',
    OUTDATED: 'outdated'
  };
  const userStore = useUserStore();
  const currentTest = ref({});
  const attempts = ref([]);
  const container = ref(null);
  const scroller = ref(null);
  const fetching = ref(false);
  const isInitialized = ref(false);
  const isError = ref(false);
  const scrollerStatus = ref({offset: {x: 0, y: 0}, limit: {x: 0, y: 0}});
  const watchGroup = ref(group.ACTUAL);
  const watchGroupAccept = ref(watchGroup.value);
  const finishedAttempts = computed(() => {
    return attempts.value
      .filter((attemptItem) => attemptItem.is_finished === true)
      .sort((a, b) => b.id - a.id);
  });
  const attemptsGroup = computed(() => {
    const actual = finishedAttempts.value.filter((attemptItem) => attemptItem.test_version === currentTest.value.version);
    const outdated = finishedAttempts.value.filter((attemptItem) => attemptItem.test_version !== currentTest.value.version);
    return {
      actual,
      outdated
    };
  });
  const attemptsGroupJoined = computed(() => {
    return [...attemptsGroup.value.actual, ...attemptsGroup.value.outdated];
  });
  const outdatedAttemptsExists = computed(() => {
    return attemptsGroup.value.outdated.length > 0;
  });
  const actualAttemptsExists = computed(() => {
    return attemptsGroup.value.actual.length > 0;
  });
  let scrollerInst = null;

  watch(
    () => [isInitialized.value, fetching.value],
    async () => {
      if (isInitialized.value && !fetching.value) {
        await nextTick();

        if (!actualAttemptsExists.value) {
          watchGroupAccept.value = watchGroup.value = group.OUTDATED;
        }

        if (!outdatedAttemptsExists.value) {
          watchGroupAccept.value = watchGroup.value = group.ACTUAL;
        }

        createScroll();
      }
    }
  );

  watch(
    () => watchGroup.value,
    () => switchGroup()
  );

  onMounted(() => {
    fetch();
    isInitialized.value = true;
  });

  onUnmounted(() => {
    destroyScroll();
  });

  const fetch = async () => {
    fetching.value = true;
    await fetchAttempts();
    await fetchTests();
    fetching.value = false;
  };
  const fetchTests = async () => {
    const testIds = [
      ...attempts.value.map((attempt) => {
        return attempt.test_id;
      }),
      props.data.current?.id || props.data.id
    ];

    for (const id of [...new Set(testIds)] ) {
      await useCommonStore().resolveTest(id);
    }

    currentTest.value = resolvedTest(props.data.current?.id || props.data.id);
  };
  const resolvedTest = (id) => {
    return useCommonStore().resolvedTests[id];
  };
  const fetchAttempts = async () => {
    const fetchFromRemote = async () => {
      return useApi(`/api/test_attempts/versions_list`, {
        ...methodGet,
        query: {
          parent_test_id: props.data.parent_id
        }
      });
    };
    const fetchFromLocal = async () => {
      return {
        data: {
          done: true,
          data: localServer.getAttempts({
            test_parent_id: props.data.parent_id
          })
        }
      };
    };

    try {
      const response = userStore.logged
        ? await fetchFromRemote()
        : await fetchFromLocal();

      if (response.data.done) {
        attempts.value = response.data.data;
      }
    } catch (e) {
      isError.value = true;
      console.error(e.message);
    }
  };
  const switchGroup = async () => {
    props.context.setProgress(true);
    hideAllInfo();
    await sleep(500);
    watchGroupAccept.value = watchGroup.value;
    props.context.setProgress(false);
  };
  const createScroll = () => {
    if (!scroller.value) {
      return;
    }
    scrollerInst = SmoothScrollbar.init(scroller.value, {alwaysShowTracks: true});
    scrollerInst.addListener((status) => Object.assign(scrollerStatus.value, status));
  };
  const destroyScroll = () => {
    if (scrollerInst) {
      SmoothScrollbar.destroy(scroller.value);
    }
  };
  const attemptStatus = (attempt) => {
    const test = resolvedTest(attempt.test_id);

    return passingTestStatus({
      ...{
        allotted_time: test.allotted_time,
        in_archive: test.in_archive,
        tasks_count: test.tasks_count
      },
      ...attempt
    });
  };
  const getInfoCollapse = (id, config = {toggle: false}) => {
    return window.$bootstrap.Collapse.getOrCreateInstance(
      container.value.querySelector(`.ac-test-attempts-item-collapse[data-id="${id}"]`),
      config
    );
  };
  const toggleInfo = (id) => {
    const item = container.value.querySelector(`.ac-test-attempts-item[data-id="${id}"]`);
    const collapse = container.value.querySelector(`.ac-test-attempts-item-collapse[data-id="${id}"]`);

    if ([...collapse.classList].includes('show')) {
      getInfoCollapse(id).hide();
      item.classList.remove('is-not-collapsed');
      item.classList.add('is-collapsed');
    } else {
      getInfoCollapse(id).show();
      item.classList.remove('is-collapsed');
      item.classList.add('is-not-collapsed');
    }

    attemptsGroupJoined.value.forEach((attempt) => {
      if (attempt.id === id) {
        return;
      }
      const item = container.value.querySelector(`.ac-test-attempts-item[data-id="${attempt.id}"]`);
      item.classList.remove('is-not-collapsed');
      item.classList.add('is-collapsed');
      getInfoCollapse(attempt.id).hide();
    });
  };
  const hideAllInfo = () => {
    [...container.value.querySelectorAll('.ac-test-attempts-item')].map((item) => {
      getInfoCollapse(item.dataset.id).hide();
      item.classList.remove('is-not-collapsed');
      item.classList.add('is-collapsed');
    });
  };
  const goRetake = (id) => {
    emit('event', {
      type: 'onGoRetake',
      data: {...currentTest.value}
    });
  };
  const parseAndAdd = (date) => {
    if (userStore.logged) {
      return format(parseISO(date), 'yyyy-MM-dd HH:mm:ss');
    } else {
      return date;
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-test-attempts {
    margin-bottom: -1rem;

    &-actual {
      &-empty {
        background: $color-black-10;
        padding: 0.8rem 1rem;
        border-radius: 0.5rem;
      }
    }

    &-outdated {}

    &-nav {
      margin-top: 2rem;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #ededed;
      padding-top: 0.7rem;
      margin-bottom: -1.5rem;

      &-item {
        --icon-width: 0.75rem;
        --icon-height: 0.75rem;

        user-select: none;
        font-size: 0.875rem;
        color: $color-dark;

        &:hover {
          color: $color-blue-normal;
        }

        &.disabled {
          opacity: 0.2;
          pointer-events: none;
        }

        &.current {
          color: $color-blue-normal;
        }
      }
    }

    &-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;

      &-id {
        display: flex;
        align-items: center;
        color: $color-dark;
        gap: 0.2rem;
        margin-top: 0.4rem;

        &-id {
          font-size: 0.875rem;
        }

        &-icon {
          width: 0.8rem;
        }
      }

      &-name {
        font-size: 1.25rem;
        font-weight: 500;
      }
    }

    &-content {
      max-height: 50vh;

      .scroll-content {
        padding-top: 0.5rem;
      }
    }

    &-item {
      position: relative;
      margin-bottom: 0.5rem;

      &-grid {
        user-select: none;
        cursor: pointer;
        display: grid;
        grid-template-columns: minmax(370px, 370px) minmax(170px, 170px) auto;
        gap: 2rem;
        padding-right: 3rem;
      }

      &-name {
        transition: $transition;
      }

      &-date {
        color: $color-dark;
        transition: $transition;
      }

      &-status {
        text-align: right;
        font-size: 0.875rem;

        &::after {
          content: '%';
        }
      }

      &-status--f {
        color: #f87342;
      }

      &-status--c {
        color: $color-yellow-normal;
      }

      &-status--a {
        color: $color-green-normal;
      }

      &-version {
        color: $color-dark;
        font-size: 0.875rem;
      }

      &.is-not-collapsed &-date {
        opacity: 0;
      }

      &.is-not-collapsed &-status {
        opacity: 0;
      }

      &-info {
        padding-right: 2.8rem;

        &-times {
          display: flex;
          gap: 2rem;
          color: $color-dark;
          font-size: 0.875rem;

          img {
            width: 1rem;
            margin-top: -0.2rem;
          }
        }

        &-actions {
          display: flex;
          justify-content: space-between;
        }
      }
    }

    &-loader {
      --loader-spinner-width: 2rem;
      --loader-spinner-height: 2rem;
      --loader-min-height: none;

      position: relative;
      width: auto;
      display: inline-flex;
    }

    &-error {
      padding: 1rem;
      background: #fff1f1;
      border-radius: 0.7rem;
      color: #ff7878;
      margin-bottom: -1rem;
    }

    &.ac-test-attempts--outdated &-item {
      &-grid {
        grid-template-columns: minmax(300px, 320px) minmax(170px, 170px) auto auto;
      }
    }
  }
</style>
