<template>
  <div class="mt-4">
    <div class="subjects-list">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <div style="font-size: 0.65rem;" class="me-2">
            <svg-icon name="arrow-bottom"/>
          </div>

          <h5 class="mb-0">Избранные предметы<span v-if="favSubjects.length > 0" class="ms-2">{{ favSubjects.length }}</span></h5>        
        </div>

        <div class="d-flex align-items-center mx-5">
          <input-checkbox label="Расширенный прогресс" v-model:checked="fullProgress" id="full-progress" />
          <div
            v-if="fullProgress"
            v-tooltip="{ title: 'Процент усвоения с учетом тем, материалы по которым ещё не добавлены в систему. Для изучения материалов по этим темам можно обратиться в библиотеку Моей Школы.' }"
            style="font-size:0.7rem" class="mx-2"><svg-icon name="info" /></div>
          <div
            v-else
            v-tooltip="{ title: 'Процент усвоения является примерным и не учитывает тем, материалы по которым ещё не добавлены в систему. Для изучения материалов по этим темам можно обратиться в библиотеку Моей Школы.' }"
            style="font-size:0.7rem" class="mx-2"><svg-icon name="info" /></div>
        </div>
      </div>
      <p class="subjects-list-text my-0 w-100">
        Основная статистика, подборки и рекомендации материалов будут сформированы по избранным предметам
      </p>
      <div
        v-if="!favSubjects.length"
        class="text-center">
        <h5 class="mt-4">Мы ничего не нашли</h5>
        <p class="text-muted w-75 mx-auto my-4">
          Предметы в избранном позволяют лучше настроить сервис.<br/>
          Добавьте первый предмет и получайте актуальную информацию<br/>
          о прогрессе усвоения тем, рекомендации учебных материалов и подборок
        </p>
      </div>
      <subjects-block
        v-else
        :subjects="favSubjects"
        :list-length="subjectsLimit"/>
      <div
        v-if="restSubjects.length"
        class="mt-4">
        <button
          class="d-flex align-items-center p-0 border-0 btn"
          @click="() => isCollapse = !isCollapse">
          <h5 class="mb-0 w-auto">
            Все предметы
          </h5>
          <div style="font-size: 0.65rem;" class="mx-3">
            <svg-icon :name="isCollapse ? 'arrow-bottom' : 'arrow-top'"/>
          </div>
        </button>
        <transition name="transition-fade">
          <subjects-block
            v-if="!isCollapse"
            :subjects="restSubjects"
            :list-length="restSubjects.length"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import useResultsStore from '~/stores/results';
  import SubjectCard from '~/components/results/subject-card.vue';
  import SubjectsBlock from '~/components/results/subjects-block.vue';

  export default {
    components: {
      SubjectCard,
      SubjectsBlock
    },
    setup() {
      const store = useResultsStore();
      const fullProgress = computed({
        get: () => store.fullProgress,
        set: ({ checked }) => store.fullProgress = checked
      });
      const subjects = computed(() => store.subjects);
      const isCollapse = ref(true);
      const favSubjects = computed(() => {
        const arr = subjects.value.filter((s) => s.is_favorite);
        return arr;
      });
      const restSubjects = computed(() => {
        const arr = subjects.value.filter((s) => !s.is_favorite);
        if (subjects.value.length && arr.length && (subjects.value.length === arr.length)) {
          isCollapse.value = false;
        }
        return arr;
      });
      const subjectsLimit = 6;

      return {
        fullProgress,
        subjects,
        favSubjects,
        restSubjects,
        subjectsLimit,
        isCollapse
      };
    }
  };
</script>

<style lang="scss" scoped>
.subjects-list {
  background: #f5f5f5;
  border-radius: 16px;
  padding: 2rem;

  &-text {
    font-size: 14px;
    color: #7f838a;

    .svg-icon {
      width: 20px;
      height: 20px;
      padding: 3px;
    }
  }
}
</style>
