<template>
  <div>
    <div class="course-top">
      <div class="course__header" @click="() => (isCollapse = !isCollapse)">
        <transition name="transition-fade">
          <div v-if="disableCollapse" class="arrow-btn">
            <button
              class="btn border-0 p-0 d-flex">
              <div style="font-size: 0.7rem;">
                <svg-icon :name="isCollapse ? 'arrow-bottom' : 'arrow-top'" />
              </div>
            </button>
          </div>
      </transition>

        <h2 class="list-title">
          <span>{{ props.title }}</span>
          <span class="list-title-length">{{ props.length }}</span>
        </h2>
      </div>
      <transition name="transition-fade">
        <p v-if="isCollapse" v-html="props.desc" class="list-description" />
      </transition>
    </div>
    <transition name="transition-fade">
      <div class="cards-wrapper" v-if="isCollapse">
        <courses-card
          v-for="(card) in props.courses"
          :key="card.id"
          :card="card"
          @go-to-subject="goToSubject"
          @change-subject-status="changeSubjectStatus"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import CoursesCard from '~/components/results/course/courses-card.vue'
import { CoursesItem } from '~/types'
import useResultsStore from '~/stores/results'

const props = defineProps({
  courses: {
    type: Array as () => CoursesItem[],
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  defaultCollapse: {
    type: Boolean,
    required: false,
    default: false
  }
})
const store = useResultsStore()
const router = useRouter()
const isCollapse = ref(props.defaultCollapse)
const disableCollapse = computed(() => !!props.courses?.length)
const grade = computed(() => store.grade)

const goToSubject = (subject: string) => {
  router.push(`/results/${subject}-${grade.value}`)
}

const changeSubjectStatus = ({ num, value }) => {
  store.changeSubjectStatus(num, { is_favorite: value })
}
</script>

<style scoped lang="scss">
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.course-top {
  display: flex;
  flex-direction: column;
  max-width: 590px;

  p {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
  }
}

.course__header {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: max-content;

  .arrow-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    margin-top: 3px;


    .svg-icon-default {
      height: 24px;
      width: 24px;
      padding: 6px;
    }
  }
}

.list-title {
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
  margin-bottom: 0;

  &-length {
    padding-left: 8px;
  }
}

.list-description {
  margin-top: 10px;
  margin-bottom: 32px;
}
</style>
