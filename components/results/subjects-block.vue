<template>
  <div class="mt-4">
    <div class="subjects-grid">
      <subject-card
        v-for="item in showSubjects"
        :key="item.name"
        :card="item"
        :fullProgress="fullProgress"
        @go-to-subject="goToSubject"
        @change-subject-status="changeSubjectStatus"/>
    </div>
    <transition name="transition-fade">
      <div
        v-if="!disableCollapse"
        class="mt-3">
        <button
          class="btn border-0 p-0 text-primary d-flex align-items-center"
          @click="() => (isCollapse = !isCollapse)">
          <div style="font-size: 0.7rem;">
            <svg-icon :name="isCollapse ? 'arrow-bottom' : 'arrow-top'"/>
          </div>
          <span class="mx-2">{{ isCollapse ? 'Развернуть' : 'Свернуть' }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
  import useResultsStore from '~/stores/results';
  import SubjectCard from '~/components/results/subject-card.vue';

  export default {
    components: {
      SubjectCard
    },
    props: {
      subjects: {
        type: Array,
        required: true
      },
      listLength: {
        type: Number
      }
    },
    setup(props) {
      const router = useRouter();
      const store = useResultsStore();
      const fullProgress = computed(() => store.fullProgress);
      const grade = computed(() => store.grade);
      const isCollapse = ref(true);
      const allSubjects = computed(() => props.subjects);
      const showSubjects = computed(() => {
        if (allSubjects.value.length > props.listLength && isCollapse.value) {
          const arr = [].concat(allSubjects.value);
          arr.length = props.listLength;
          return arr;
        }
        return allSubjects.value;
      });
      const disableCollapse = computed(
        () => props.listLength >= allSubjects.value.length
      );

      function goToSubject(subject, middle) {
        const link = `/results/${subject}-${grade.value}`;
        if (middle) {
          window.open(link, '_blank');
        } else {
          router.push(`/results/${subject}-${grade.value}`);
        }
      }
      function changeSubjectStatus({num, value}) {
        store.changeSubjectStatus(num, {is_favorite: value});
      }

      return {
        showSubjects,
        fullProgress,
        isCollapse,
        disableCollapse,
        goToSubject,
        changeSubjectStatus
      };
    }
  };
</script>

<style lang="scss" scoped>
  .subjects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
</style>
