<template>
  <nuxt-link
    :to="!isFetching ? `/results/${props.card.id}-${grade}` : null"
    :key="`/results/${props.card.id}-${grade}`">
    <div class="card user-select-none">
      <div class="card-top">
        <h2 v-html="props.card.name" />
        <button
          class="btn border-0 subject-fav"
          v-tooltip="{ title: props.card.is_favorite ? 'Убрать из избранных' : 'Добавить в избранные' }"
          :disabled="isFetching"
          @click.stop.prevent="changeSubjectStatus"
        >
        <svg-icon
            :class="{'course-favorite-icon__filled': props.card.is_favorite}"
            class="course-favorite-icon"
            :name="props.card.is_favorite ? 'star-fill' : 'star-filled'" />
        </button>

      </div>
      <div class="card-bottom">
        <course-lvl-icon :level="8" />
        <span class="card-bottom-info">{{ 90 }} опыта до {{
            2
          }} уровня</span>
      </div>
      <div class="progress">
        <div
          class="progress-bar"
          :style="progressStyles" />
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import CourseLvlIcon from '~/components/results/course/course-lvl-icon.vue'
import _debounce from 'lodash.debounce'
import useResultsStore from '~/stores/results'
import { CoursesItem } from '~/types'

interface Card {
  card: CoursesItem
}

const store = useResultsStore()
const props = defineProps<Card>()
const emit = defineEmits(['goToSubject', 'changeSubjectStatus'])
const progressStyles = computed(() => `width:20%`)
const isFetching = ref(false)
const grade = computed(() => store.grade)

watch(() => store.isFetching, _debounce(() => {
  isFetching.value = store.isFetching
}, 300))

// const onClick = () => {
//   emit('goToSubject', props.card.id)
// }

const changeSubjectStatus = () => {
  emit('changeSubjectStatus', {
    num: props.card.id,
    value: !props.card.is_favorite
  })
}
</script>

<style scoped lang="scss">
@import '/assets/scss/theme';

.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 190px;
  padding: 24px;
  background-color: #fff;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  border: none;
  transition: $transition;

  &:hover {
    box-shadow: 0 16px 32px #7d94c13d;
  }

  &-top {
    display: flex;
    justify-content: space-between;

    h2 {
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%;
      letter-spacing: -0.2px;
      margin-bottom: 0;
    }

    button {
      padding: 0;
      margin-bottom: auto;
    }
  }

  &-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    margin-bottom: 8px;
  }
}

.card-bottom-info {
  color: #93979E;
}

.course-favorite-icon {
  width: 18px;
  height: 18px;

  &__filled {
    width: 24px;
    height: 24px;
  }
}

.progress {
  height: 4px;

  .progress-bar {
    background: linear-gradient(80deg, #00B09B -23.22%, #96C93D 93.88%);
  }
}
</style>
