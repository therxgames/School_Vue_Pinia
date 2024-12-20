<template>
  <nuxt-layout>
    <div
        class="page-default content-container content-container_max-width-1312 results-container">
      <nuxt-link
          :to="!isFetching ? '/results' : null"
          class="text-muted position-absolute left-0 d-flex align-items-center"
          style="top:0.5rem">
        Мои достижения
      </nuxt-link>
      <div>
        <h1 class="">
          {{ mainTitle }}
        </h1>
      </div>
      <loader :listener="store.loader" class="app-loader"/>
      <div v-if="subjectsList.length">
        <div class="d-flex mt-4 pt-2 align-items-center">
          <input-select-single
              :resetBtn="false"
              placeholder="Выбрать предмет"
              :list="subjectsList"
              :disabled="isFetching"
              v-model:value="selectedSubject"
              @update:value="selectSubject"/>
          <nuxt-link to="/tree">
            <div class="course-tree-link">
              <svg-icon
                  class="course-tree-link__icon"
                  name="tree"/>
              <span>Дерево обучения</span>
            </div>
          </nuxt-link>
        </div>
        <course-main-info v-if="subject" :info="mainInfo"/>

        <div class="record-book__wrapper">
          <div class="record-book__header d-flex align-items-center">
            <h4 class="record-book__title">
              Зачетная книжка
            </h4>
            <div class="mx-2"
                 v-tooltip="{title: 'Зачетная книжка - это удобный инструмент анализа успеваемости и достижений в рамках изучения предмета'}">
              <svg-icon name="info"/>
            </div>
          </div>
          <chart-subject
              v-if="subjectData"
              :stepSizeMax="subjectData.completed_tasks_count"/>
        </div>
        <themes-list/>
        <awards-list :awards="awards"/>
      </div>
    </div>
  </nuxt-layout>
</template>

<script>
import useResultsStore from '~/stores/results'
import useUserStore from '~/stores/user'
import ChartSubject from '~/components/results/chart-subject.vue'
import ThemesList from '~/components/results/themes-list.vue'
import CourseMainInfo from '~/components/results/course/detailed/course-main-info.vue'
import AwardsList from '~/components/results/course/detailed/awards-list.vue'


export default {
  components: {
    AwardsList,
    CourseMainInfo,
    ChartSubject,
    ThemesList
  },
  setup() {
    const userIsStudent = computed(() => useUserStore().userIsStudent)
    const store = useResultsStore()
    const router = useRouter()
    const params = router.currentRoute.value.params
    const routerParam = params.subject
    const grade = +params.grade
    const toGrade = () => {
      return grade === 9
          ? 'attestation=oge'
          : `classes=${grade}`
    }
    const isFetching = ref(false)
    const mainTitle = `Уровень подготовки к ${+grade === 9
        ? 'ОГЭ'
        : 'ВПР'}, ${grade} класс`
    const subjects = computed(() => store.subjects)
    const fullProgress = computed({
      get: () => store.fullProgress,
      set: ({checked}) => store.fullProgress = checked
    })
    const subject = computed(() =>
        [...subjects.value].find((s) => s.id === +routerParam)
    )

    const mainInfo = ref({
      top: '',
      experience: {
        exp_count: {
          text: 'Очки опыта',
          count: 228
        },
        progress: {
          text: 'Уровень',
          lvl: 1,
          sub_text: 'осталось 20 опыта до 2 уровня',
          progress_line: 80
        },
        to_day: {
          text: 'Заработано сегодня',
          points: '+2'
        }
      },
      completed: [
        {
          title: 'Выполнено заданий',
          count: 9,
          count_total: 152
        },
        {
          title: 'Пройдено тем',
          count: 12,
          count_total: 12
        },
        {
          title: 'Выполнено тестов',
          count: 0,
          count_total: 4
        }
      ]
    })

    const awards = {
      title: 'Награды по физике',
      awards_list: [
        {
          title: 'Первопроходец',
          date: '10 авг. 2023 г.',
          rarity: 3,
          icon_default: 'awards-placeholder',
          lvl_user: 2,
          lvl_max_award: 5,
          more_tasks: 168
        },
        {
          title: 'Соколиный глаз',
          icon_default: 'awards-placeholder',
          lvl_user: 2,
          lvl_max_award: 5,
          more_tasks: 168
        },
        {
          title: 'Воин выходного дня',
          date: '10 авг. 2023 г.',
          rarity: 3,
          icon_default: 'awards-placeholder',
          progress: 80,
          lvl_user: 2,
          lvl_max_award: 5,
          more_tasks: 168
        }
      ]
    }

    const subjectData = computed(() => store.subjectData)

    const subjectsList = computed(() => {
      if (subjects.value.length) {
        return [...subjects.value].map((s) => {
          return {
            id: s.id,
            name: s.name
          }
        })
      }
      return []
    })
    const selectedSubject = ref(+routerParam)

    function selectSubject() {
      router.push(`/results/${selectedSubject.value}-${params.grade}`)
    }

    const progress = computed(() => fullProgress.value
        ? subject.value?.masteringExt
        : subject.value?.mastering)
    const progressStyles = computed(() => `width:${progress.value}%`)

    async function changeSubjectStatus() {
      isFetching.value = true
      await store.changeSubjectStatus(
          subject.value.id,
          {is_favorite: !subject.value.is_favorite}
      )
      isFetching.value = false
    }

    watch(
        () => userIsStudent.value,
        () => {
          if (!userIsStudent.value) {
            router.replace('/')
          }
        }
    )
    onMounted(async () => {
      if (!useUserStore().userIsStudent) {
        router.replace('/')
      } else {
        isFetching.value = true
        store.grade = grade
        store.subjectID = routerParam
        await store.fetchSubjectData(routerParam)
        await store.fetchThemes(routerParam)
        await store.fetchSubjects()
        isFetching.value = false
      }
    })

    onBeforeUnmount(() => {
      if (!router.currentRoute.value.name.startsWith('results')) {
        store.$reset()
      }
    })

    return {
      store,
      isFetching,
      fullProgress,
      routerParam,
      mainTitle,
      grade,
      toGrade,
      subject,
      subjectData,
      subjectsList,
      selectedSubject,
      selectSubject,
      progress,
      progressStyles,
      changeSubjectStatus,
      mainInfo,
      awards
    }
  }
}
</script>

<style lang="scss" scoped>
.record-book {
  &__wrapper {
    margin-top: 52px;
  }

  &__header {
    margin-bottom: 24px;
  }

  &__title {
    margin-bottom: 0;
  }
}

.subject-icon {
  min-width: 218px;
  height: 218px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .svg-icon {
    margin-top: 1.5rem;
    height: 120px;
    width: 120px;
    padding: 1rem;
  }
}

.subject-favorite-icon {
  min-width: 28px;
  height: 28px;

  .svg-icon {
    width: 100%;
    height: 100%;
  }
}

.subject-data {
  margin: 0 80px;
  line-height: 42px;
}

.subject-data-item {
  line-height: 120%;
  margin-right: 80px;
  white-space: nowrap;
}

.subject-data-link {
  display: flex;
  align-items: center;
  font-size: 14px;

  .svg-icon {
    height: 14px;
    width: 14px;
    padding: 2px;
    margin-left: 8px;
  }
}

.progress {
  height: 8px;

  .progress-bar {
    background: #fec84d;
  }
}

.loader {
  max-height: 80vh;
}

.course-tree-link {
  display: flex;
  align-items: center;
  margin-left: 24px;

  &__icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}
</style>
