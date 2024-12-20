<template>
  <nuxt-layout name="default">
    <div class="create-task content-container">
      <div class="create-task-header">
        <common-breadcrumbs
          :items="[{to: '/training', title: 'Подготовка'}]"/>
        <h2 ref="scrollTarget">
          Новый тематический тест
        </h2>
      </div>

      <div class="create-task-selects">
        <div>Название</div>
        <input-simple
          ref="nameInput"
          placeholder="Название"
          v-model:value="taskName"
          :error="nameError"/>

        <div>Класс</div>
        <input-select-single
          placeholder="Класс"
          :list="classes"
          v-model:value="selectedClassId"
          style="width: 33%;"/>

        <div>Предмет</div>
        <input-select-single
          placeholder="Предмет"
          :list="subjects"
          v-model:value="selectedSubjectId"
          max-height="314px"
          style="width: 50%;"/>

        <div>Год заданий</div>
        <input-select-multi
          placeholder="Год заданий"
          :list="years"
          v-model:value="selectedYearsIds"
          style="width: 33%;"/>
        <template v-if="!loading && (!showTable || showTable && !parts.length)">
          <div/>
          <div
            class="alert-info"
            role="alert">
            <div class="d-flex">
              <svg-icon
                name="info-square"
                class="flex-shrink-0"/>
              <span v-if="!showTable">Выберите класс и предмет</span>
              <span v-if="showTable && !parts.length">Материалы с заданными параметрами будут добавлены позже, попробуйте изменить критерии поиска.</span>
            </div>
          </div>
        </template>
      </div>

      <template v-if="showTable && !loading && parts.length">
        <div class="create-task-list-header">
          <div style="font-weight: 500;">
            Экспресс-тест ⚡
          </div>
          <div class="d-flex align-items-center">
            Случайные
            <input-select-single
              class="select-theme-number"
              v-model:value="expressId"
              :list="expressSelectList"
              :editable="expressId === expressSelectList.length"
              placeholder="0 заданий">
              <template #edit>
                <div
                  v-if="expressId === expressSelectList.length"
                  class="select-theme-number-edit"
                  @click.stop="() => expressEditInput.focus()">
                  <input
                    ref="expressEditInput"
                    type="text"
                    :value="expressEdit.value"
                    :size="expressEdit.size"
                    class="border-0 p-0"
                    placeholder="0 заданий"
                    @input="expressEditChange">
                  <span v-if="expressEdit.value">задан{{ declension(expressEdit.value, ['ие', 'ия', 'ий']) }}</span>
                </div>
              </template>
            </input-select-single>
            по всем темам
          </div>
          <div
            class="form-check d-flex">
            <input-checkbox
              label="Учитывать достижения"
              id="expressAchievements"
              :checked="false"
              v-model:checked="expressAchievements">
              <template #labelAfter>
                <div
                  v-tooltip="{title: 'При составлении теста задания будут подобраны с учетом статистики усвоения тем'}"
                  class="icon-wrapper">
                  <svg-icon
                    class="svg-icon"
                    name="info"/>
                </div>
              </template>
            </input-checkbox>
          </div>
          <button
            type="button"
            class="btn btn-light"
            @click="createExpressTask">
            Решать
          </button>
        </div>

        <common-columns class="mb-5">
          <div>
            <div class="create-task-list">
              <training-create-task-part
                v-for="(part, idx) in parts"
                :key="idx"
                :last="idx === parts.length - 1"
                :single="parts.length === 1"
                :part="part"/>
            </div>
          </div>

          <common-sticky-column>
            <div>
              <div class="create-task-result">
                <training-create-task-result
                  :parts="parts"
                  :all-tasks-num="allTasksNum"
                  :time="time"
                  :details-error="detailsError"
                  @create-task="createTask"/>
              </div>
            </div>
          </common-sticky-column>
        </common-columns>
      </template>
      <loader :listener="loading"/>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useCreateTaskStore from '~/stores/create-task';
  import useUserStore from '~/stores/user';
  import useCommonStore from '~/stores/common';

  const ctStore = useCreateTaskStore();
  const userStore = useUserStore();
  const router = useRouter();

  definePageMeta({
    middleware: ['auth', 'student']
  });

  watch(() => userStore.currentRole, () => {
    if (!userStore.userIsStudent ) router.replace('/training');
  });

  const taskName = ref('');
  const subjects = ref([]);
  const years = ref([]);
  const parts = ref([]);
  const classes = ref([]);

  const nameInput = ref(null);
  const scrollTarget = ref(null);
  const nameError = ref('');
  const detailsError = ref('');

  const expressSelectList = ref([]);
  const expressAchievements = ref(false);
  const expressEditInput = ref(null);
  const expressTasks = ref(0);

  const selectedClassId = ref(null);
  const selectedSubjectId= ref(null);
  const selectedYearsIds= ref([]);
  const loading = ref(false);
  const expressId = ref(null);

  const fetchFilters = async () => {
    const response = await useCommonStore().resolveFilters();
    years.value = response.data.years;
    subjects.value = response.data.subjects;
    classes.value = response.data.classes;
  };

  const initState = () => {
    const stateObj = {};
    parts.value.forEach((part) => {
      stateObj[part.id] = {
        showReady: true,
        rows: part.items.reduce((acc, row) => {
          acc[row.id] = {
            completed: row.completed ? row.completed : 0,
            selected: 0
          };
          return acc;
        }, {})
      };
    });

    ctStore.initState(stateObj);
  };

  const fetchThemes = async () => {
    if (!selectedClassId.value || !selectedSubjectId.value) return;

    loading.value = true;
    try {
      const response = await useApi('/api/sections/topics', {
        method: 'GET',
        query: {
          parallel_id: selectedClassId.value,
          subject_id: selectedSubjectId.value,
          years: selectedYearsIds.value
        }
      });
      if (response.data.done) {
        parts.value = response.data.sections.map((item) => {
          return {
            title: item.name,
            id: item.id,
            items: item.topics
              .filter((row) => row.tasks_count)
              .map((row) => {
                return {
                ...row,
                time: row.avg_task_time,
                completed: row.correctness
                };
              })
          };
        });

        const taskCount = parts.value.reduce((acc, part) => {
          acc += part.items.reduce((sum, theme) => {
            sum += theme.tasks_count;
            return sum;
          }, 0);
          return acc;
        }, 0);
        expressTasks.value = taskCount;
        expressSelectList.value = getExpressList(taskCount);
        expressId.value = expressSelectList.value[0].id;

        initState();
        loading.value = false;
      }
    } catch (e) {
      console.log('Ошибка api: /api/theme/tasks_count', e);
      loading.value = false;
    }
  };

  fetchFilters();

  const taskNumName = (n) => `${n} задан${declension(n, ['ие', 'ия', 'ий'])}`;

  const getExpressList = (n) => {
    if (n === 0) {
      return [{
        id: 1,
        name: '0 заданий',
        value: 0
      }];
    }

    const OPTIONS_MAX_NUMBER = 5;
    const step = n < OPTIONS_MAX_NUMBER ? 1 : Math.ceil(n / OPTIONS_MAX_NUMBER);

    const steps = Math.floor(n / step);
    const res = [];
    for (let i = 1; i <= steps; i++) {
      res.push({
        id: i,
        name: taskNumName(i * step),
        value: i * step
      });
    }
    if (n % step) {
      res.push({
        id: res.length + 1,
        name: taskNumName(n),
        value: n
      });
    }
    res.push({
      id: res.length + 1,
      name: 'Другое',
      value: null
    });

    return res;
  };

  const expressEdit = computed(() => {
    const value = expressSelectList.value[expressSelectList.value.length - 1]?.value;
    return {
      value,
      size: value ? `${value}`.length : null
    };
  });

  const expressEditChange = (e) => {
    const cv = expressEdit.value.value;
    const nv = e.target.value.trim();
    let value;
    if (!isNaN(+nv) && nv !== '') {
      if (+nv === 0) {
        value = 1;
      } else if (+nv > +expressTasks.value) {
        value = expressTasks.value;
      } else {
        value = +nv;
      }
    } else if (nv === '') {
      value = '';
    } else {
      value = cv;
    }
    e.target.value = value;
    expressSelectList.value[expressSelectList.value.length - 1].value = +value ? +value : null;
  };

  const allTasksNum = computed(() => {
    let count = 0;

    parts.value.forEach((part) => {
      part.items.forEach((row) => {
        const completed = ctStore.rowCompleted(part.id, row.id);
        if (ctStore.rowSelected(part.id, row.id)) count += row.tasks_count - completed;
      });
    });

    return count;
  });

  const showTable = computed(() => selectedClassId.value && selectedSubjectId.value && userStore.logged);

  watch(() => selectedClassId.value, fetchThemes);

  watch(() => selectedSubjectId.value, fetchThemes);

  watch(() => selectedYearsIds.value, fetchThemes);

  watch(taskName, () => {
    nameError.value = '';
  });

  watch(() => ctStore.selectedRows, (val, oldVal) => {
    if (Object.keys(val).length && !Object.keys(oldVal).length) {
      detailsError.value = '';
    }
  });

  const time = computed(() => {
    let count = 0;

    parts.value.forEach((part) => {
      part.items.forEach((row) => {
        count += ctStore.rowSelected(part.id, row.id) * row.time;
      });
    });

    return count;
  });

  const nameValidate = () => {
    if (!taskName.value) {
      const input = nameInput.value?.$el.querySelector('input');
      if (input) {
        const intersectionObserver = new IntersectionObserver(([entry]) => {
          nameError.value = 'Введите название теста';
          input.focus();
          if (!entry.isIntersecting) {
            if (scrollTarget.value) scrollTarget.value.scrollIntoView();
          }
          intersectionObserver.disconnect();
        });
        intersectionObserver.observe(input);
      }
      return false;
    }

    return true;
  };

  const createTask = async (with_achievements) => {
    if (!nameValidate()) return;

    if (!ctStore.partsTaskSum) {
      detailsError.value = 'Выберите хотя бы одну тему';
      return;
    }

    try {
      const include_completed = Object.keys(ctStore.parts).reduce((acc, id) => {
        acc[id] = ctStore.parts[id].showReady;
        return acc;
      }, {});

      const body = {
        parallel_id: selectedClassId.value,
        subject_id: selectedSubjectId.value,
        tasks_count: ctStore.selectedRows,
        name: taskName.value,
        include_completed,
        years: selectedYearsIds.value
      };

      if (with_achievements) {
        body.with_achievements = true;
      }

      const response = await useApi('/api/test', {
        method: 'POST',
        body
      });
      if (response.data.done) {
        router.push({path: '/test/'+response.data.test_id});
      }
    } catch (e) {
      console.log('Ошибка api: /api/test', e);
    }
  };

  const expressSelected = computed(() => expressSelectList.value.find((item) => item.id === expressId.value));

  const createExpressTask = async () => {
    if (!nameValidate()) return;

    if (!+expressSelected.value?.value) {
      eventBus.emit('alert:show', {
        title: 'Укажите количество заданий',
        hideAllButtons: true
      });
      return;
    }


    try {
      const body = {
        parallel_id: selectedClassId.value,
        subject_id: selectedSubjectId.value,
        tasks_count: +expressSelected.value.value,
        name: taskName.value,
        years: selectedYearsIds.value
      };

      if (expressAchievements.value.checked) {
        body.with_achievements = true;
      }

      const response = await useApi('/api/test/express', {
        method: 'POST',
        body
      });
      if (response.data.done) {
        router.push({path: '/test/'+response.data.test_id});
      }
    } catch (e) {
      console.log('Ошибка api: /api/test/express', e);
    }
  };
  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'training-create-task') {
      ctStore.$reset();
    }
  });
</script>

<style lang="scss">
  .create-task {
    min-width: 1280px;

    .create-task-header {
      margin-top: 20px;
      margin-bottom: 24px;
    }

    .create-task-selects {
      width: 60%;
      display: grid;
      grid-template-columns: 164px auto;
      align-items: center;
      grid-auto-rows: 72px;
    }

    .alert-info {
      top: 48px;
      position: relative;
      padding: 28px 24px;
      background-color: #f2f5fa;
      border-radius: 8px;

      .svg-icon {
        width: 32px;
        height: 32px;
      }

      span {
        margin-left: 16px;
        line-height: 32px;
      }
    }

    .icon-wrapper {
      .svg-icon {
        width: 0.9rem;
        height: 0.9rem;
        display: inline-block;
        position: relative;
        top: 1px;
        left: 3px;
      }
    }

    .create-task-list-header {
      margin-top: 38px;
      margin-bottom: 48px;
      background-color: #e6f3ff;
      border-radius: 16px;
      display: grid;
      grid-template-columns: 175px auto 291px 106px;
      align-items: center;
      padding: 32px;

      .select-theme-number {
        width: 188px;
        margin: 0 16px;

        .select-theme-number-edit {
          display: flex;
          width: 130px;

          input {
            border: none;
            outline: none;
            background: none;
          }
        }
      }

      .btn {
        border: 1px solid #ced6e0;
      }
    }

    .create-task-list {
      border: 1px solid #ced6e0;
      border-radius: 16px;
      padding: 34px;
    }

    .create-task-result {
      border: 1px solid #ced6e0;
      border-radius: 16px;
      padding: 30px;
    }
  }
</style>
