<template>
  <loader :listener="store.loader" class="app-loader"/>
  <div v-if="!store.loader">    
    <record-book />

    <!-- <div v-if="subjects.length" class="mt-5 pt-3">
      <h4>Успеваемость</h4>
      <chart-general/>
      <diff-general/>
    </div> -->
    <div v-if="!store.loader">
      <recommended-block content="tasks">
        Рекомендуемые задания
      </recommended-block>
      <recommended-block content="tests">
        Рекомендуемые демоварианты
      </recommended-block>
      <recommended-tsok v-if="isEtdAuth"/>
    </div>
  </div>
</template>

<script>
import useResultsStore from "~/stores/results";
import useUserStore from "~/stores/user";
import SubjectsList from "~/components/results/subjects-list.vue";
import ChartGeneral from "~/components/results/chart-general.vue";
import DiffGeneral from "~/components/results/diff-general.vue";
import RecommendedBlock from "~/components/results/recommended-block.vue";
import RecommendedTsok from "~/components/results/recommended-tsok.vue";
import _debounce from "lodash.debounce";

export default {
  components: {
    SubjectsList,
    ChartGeneral,
    DiffGeneral,
    RecommendedBlock,
    RecommendedTsok,
  },
  setup() {
    const userIsStudent = computed(() => useUserStore().userIsStudent);
    const isEtdAuth = computed(() => useUserStore().authSource === "etd");
    const store = useResultsStore();
    const router = useRouter();
    const isFetching = ref(false);
    const subjects = computed(() => store.getSubjects);
    const grade = computed(() => store.grade);
    const gradeList = [
      {name: "5 класс", id: 5},
      {name: "6 класс", id: 6},
      {name: "7 класс", id: 7},
      {name: "8 класс", id: 8},
      {name: "9 класс", id: 9},
    ];
    const bank = ref(grade.value === 9 ? 2 : 1);
    const bankList = [
      {name: "ВПР", id: 1},
      {name: "ОГЭ", id: 2},
    ];
    watch(
      () => bank.value,
      () => {
        if (bank.value === 1 && store.grade === 9) store.grade = 8;
        if (bank.value === 2 && store.grade < 9) store.grade = 9;
      }
    );
    watch(
      () => grade.value,
      () => {
        bank.value = grade.value === 9 ? 2 : 1;
        localStorage.setItem("parallel_id", grade.value);
        fetchSubjects();
      }
    );
    watch(
      () => userIsStudent.value,
      () => {
        if (!userIsStudent.value) {
          router.replace("/");
        }
      }
    );
    watch(
      () => store.isFetching,
      _debounce(() => {
        isFetching.value = store.isFetching;
      }, 300)
    );

    function fetchSubjects() {
      store.fetchSubjects(!!store.subjects.length);
    }

    useHead({
      ...pageTitle("Мои достижения"),
    });

    onMounted(async () => {
      if (!useUserStore().userIsStudent) {
        router.replace("/");
      } else {
        store.grade = +localStorage.getItem("parallel_id") || 9;
        await store.fetchSubjects();
        store.fetchGeneralStat();
      }
    });

    onBeforeUnmount(() => {
      if (!router.currentRoute.value.name.startsWith("results")) {
        store.$reset();
      }
    });

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
    };
  },
};
</script>

<style lang="scss">
@import "/assets/scss/theme";

.subject {
  @each $subject, $color in $subjects {
    &-#{$subject} {
      background: $color;
    }
  }
}

.results-top {
  display: grid;
  grid-template-columns: 5fr 3fr;
}

.results-container {
  padding-bottom: 5rem;
}
</style>
