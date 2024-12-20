<!--<template>-->
<!--  <nuxt-layout name="default">-->
<!--    <div class="page-default content-container results-container">-->
<!--      <h1>Мои достижения</h1>-->
<!--      <loader :listener="store.loader" class="app-loader" />-->
<!--      <div v-if="!store.loader">-->
<!--        <div class="results-top mt-4 py-2">-->
<!--          <div class="d-flex">-->
<!--            <div>-->
<!--              <input-select-single-->
<!--                :resetBtn="false"-->
<!--                :list="bankList"-->
<!--                :disabled="isFetching"-->
<!--                size="lg"-->
<!--                v-model:value="bank" />-->
<!--            </div>-->
<!--            <div class="mx-3">-->
<!--              <input-select-single-->
<!--                :resetBtn="false"-->
<!--                :list="gradeList"-->
<!--                :disabled="isFetching"-->
<!--                v-model:value="store.grade"-->
<!--                size="lg"-->
<!--                @update:value="fetchSubjects" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="w-75">-->
<!--            <p class="m-0">-->
<!--              В 2022—2023 учебном году {{ grade === 9 ? 'ОГЭ' : 'ВПР' }} будут-->
<!--              проводиться по {{ store.subjects.length }}-->
<!--              предмет{{ declension(store.subjects.length, ['у', 'ам', 'ам']) }}-->
<!--            </p>-->
<!--            <a-->
<!--              v-if="bank === 1"-->
<!--              href="https://fioco.ru/obraztsi_i_opisaniya_vpr_2022"-->
<!--              target="_blank">Правила проведения ВПР</a>-->
<!--            <a-->
<!--              v-if="bank === 2"-->
<!--              href="https://fipi.ru/oge/demoversii-specifikacii-kodifikatory"-->
<!--              target="_blank">Правила проведения ОГЭ</a>-->
<!--          </div>-->
<!--        </div>-->
<!--        <subjects-list />-->
<!--        <div v-if="subjects.length" class="mt-5 pt-3">-->
<!--          <h4>Успеваемость</h4>-->
<!--          <chart-general />-->
<!--          <diff-general />-->
<!--        </div>-->
<!--        <div v-if="!store.loader">-->
<!--          <recommended-block content="tasks">-->
<!--            Рекомендуемые задания-->
<!--          </recommended-block>-->
<!--          <recommended-block content="tests">-->
<!--            Рекомендуемые демоварианты-->
<!--          </recommended-block>-->
<!--          <recommended-tsok v-if="isEtdAuth" />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </nuxt-layout>-->
<!--</template>-->

<template>
  <nuxt-layout name="default">
    <div
        class="page-default content-container content-container_max-width-1312 results-container">
      <h1 class="mb-3 result-title">Мои достижения</h1>
      <loader :listener="store.loader" class="app-loader"/>
      <div class="tabs-result">
        <!--        <span class="tabs-result__tab"-->
        <!--              :class="{'tabs-result__tab_active': tabRef === 'courses'}"-->
        <!--              @click="setOrder('courses')">Курсы</span>-->
        <span
            class="tabs-result__tab"
            :class="{'tabs-result__tab_active': tabRef === 'achievements'}"
            @click="setOrder('achievements')"
        >Курсы</span>
        <span class="tabs-result__tab"
              :class="{'tabs-result__tab_active': tabRef === 'awards'}"
              @click="setOrder('awards')">Награды</span>
        <!--        <span class="tabs-result__tab"-->
        <!--              :class="{'tabs-result__tab_active': tabRef === 'rating'}"-->
        <!--              @click="setOrder('rating')">Рейтинг</span>-->
      </div>


      <div class="results-top">
        <div class="results-top__selectors">
          <input-select-single
              :resetBtn="false"
              :list="bankList"
              v-model:value="bank"
          />
          <input-select-single
              :resetBtn="false"
              :list="gradeList"
              v-model:value="grade"
          />
        </div>
        <p class="results-top__title">В 2023—2024 учебном году ОГЭ будут
          проводиться по 7 предметам. <a
              href="http://localhost:3000/results">Правила проведения
            ОГЭ</a></p>
      </div>
      <div class="courses-wrapper">
        <courses-list
            :courses="favSubjects"
            :length="favSubjectsLength"
            :defaultCollapse="true"
            :title="'Избранные предметы'"
            :desc="'Статистика, рекомендации и подборка материалов формируются по избранным предметам'"
        />
        <courses-list
            :courses="restSubjects"
            :length="restSubjectsLength"
            :title="'Все предметы'"
            :desc="'Статистика, рекомендации и подборка материалов формируются по избранным предметам'"
        />
      </div>

      <awards-block v-if="tabRef === 'awards'" :current-tab="tabRef"/>
      <results-achievements v-if="tabRef === 'achievements'"/>
    </div>
  </nuxt-layout>
</template>

<script>
import useResultsStore from '~/stores/results'
import useUserStore from '~/stores/user'
import SubjectsList from '~/components/results/subjects-list.vue'
import ChartGeneral from '~/components/results/chart-general.vue'
import DiffGeneral from '~/components/results/diff-general.vue'
import RecommendedBlock from '~/components/results/recommended-block.vue'
import RecommendedTsok from '~/components/results/recommended-tsok.vue'
import _debounce from 'lodash.debounce'
import CoursesList from '~/components/results/course/courses-list.vue'
import AwardsBlock from '~/components/results/awards-block.vue'

export default {
  components: {
    AwardsBlock,
    CoursesList,
    SubjectsList,
    ChartGeneral,
    DiffGeneral,
    RecommendedBlock,
    RecommendedTsok
  },
  setup() {
    const userIsStudent = computed(() => useUserStore().userIsStudent)
    const isEtdAuth = computed(() => useUserStore().authSource === 'etd')
    const store = useResultsStore()
    const router = useRouter()
    const isFetching = ref(false)
    const subjects = computed(() => store.getSubjects)
    const subjectsList = computed(() => store.subjects)
    const isCollapse = ref(true)
    const favSubjects = computed(() => {
      const arr = subjectsList.value.filter((s) => s.is_favorite)
      return arr
    })
    const restSubjects = computed(() => {
      const arr = subjectsList.value.filter((s) => !s.is_favorite)
      if (subjectsList.value.length && arr.length && (subjectsList.value.length === arr.length)) {
        isCollapse.value = false
      }
      return arr
    })
    const grade = computed(() => store.grade)
    const gradeList = [
      {name: '5 класс', id: 5},
      {name: '6 класс', id: 6},
      {name: '7 класс', id: 7},
      {name: '8 класс', id: 8},
      {name: '9 класс', id: 9}
    ]
    const bank = ref(grade.value === 9 ? 2 : 1)
    const bankList = [
      {name: 'ВПР', id: 1},
      {name: 'ОГЭ', id: 2}
    ]
    watch(
        () => bank.value,
        () => {
          if (bank.value === 1 && store.grade === 9) store.grade = 8
          if (bank.value === 2 && store.grade < 9) store.grade = 9
        }
    )
    watch(
        () => grade.value,
        () => {
          bank.value = grade.value === 9 ? 2 : 1
          localStorage.setItem('parallel_id', grade.value)
          fetchSubjects()
        }
    )
    watch(
        () => userIsStudent.value,
        () => {
          if (!userIsStudent.value) {
            router.replace('/')
          }
        }
    )
    watch(() => store.isFetching, _debounce(() => {
      isFetching.value = store.isFetching
    }, 300))

    function fetchSubjects() {
      store.fetchSubjects(!!store.subjects.length)
    }

    onMounted(async () => {
      if (!useUserStore().userIsStudent) {
        router.replace('/')
      } else {
        store.grade = +localStorage.getItem('parallel_id') || 9
        await store.fetchSubjects()
        await store.fetchAwards()
        store.fetchGeneralStat()
      }
    })

    onBeforeUnmount(() => {
      if (!router.currentRoute.value.name.startsWith('results')) {
        store.$reset()
      }
    })

    const favSubjectsLength = computed(() => favSubjects.value.length)
    const restSubjectsLength = computed(() => restSubjects.value.length)

    const tabRef = ref('achievements')
    const setOrder = (field) => {
      if (tabRef.value !== field) {
        tabRef.value = field
      }
    }

    return {
      isEtdAuth,
      store,
      isFetching,
      subjects,
      bank,
      bankList,
      grade,
      gradeList,
      fetchSubjects,
      favSubjects,
      restSubjects,
      setOrder,
      tabRef,
      favSubjectsLength,
      restSubjectsLength,
    }
  }
}
</script>

<style lang="scss">
@import '/assets/scss/theme';

.result-title {
  color: #0C1524;
  font-size: 32px;
  font-weight: 500;
  line-height: 130%;
  letter-spacing: -0.4px;
}

.subject {
  @each $subject, $color in $subjects {
    &-#{$subject} {
      background: $color;
    }
  }
}

.tabs-result {
  display: flex;
  align-items: center;
  gap: 16px;

  &__tab {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
    transition: $transition;
    cursor: pointer;
    color: #255CE8;

    &:hover {
      color: inherit;
    }
  }

  &__tab_active {
    color: inherit;
  }
}

.results-top {
  display: flex;
  align-items: center;
  margin: 32px 0;

  &__selectors {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    margin-bottom: 0;
    margin-left: 24px;
  }
}

.results-container {
  padding-bottom: 5rem;
}

.courses-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 48px 64px 48px;
  background: radial-gradient(83.71% 134.18% at 12.71% 11.82%, #F2F4FF 0%, #D0DDFF 100%);
  border-radius: 32px;
  overflow: hidden;
}
</style>
