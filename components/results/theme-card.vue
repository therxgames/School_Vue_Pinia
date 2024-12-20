<template>
  <div>
    <div class="theme-card-line" :class="{'bg-blue-light': isShow}">
      <div class="theme-title" @click="toggleDetails">
        <svg-icon
          name="caret-drop-down"
          class="caret-drop-down"
          :class="{'caret-drop-down_isShow': isShow}"
        />
        <h5 class="my-0">
          {{ theme.name }}
        </h5>
        <div class="theme-card-line__number-tasks">
          <span>{{ theme.tasks_count }}</span>
          <span v-tooltip="{title: 'Все задания выполнены'}">
            <svg-icon class="theme-card-line__icon" name="seal-check"
            />
          </span>
        </div>
        <div class="theme-card-line__experience"
             :class="{'theme-card-line__experience_opacity': true}">
          <span v-tooltip="{title: 'Опыт'}">
            <svg-icon class="theme-card-line__icon"
                      name="star-four"/>
          </span>
          <span>{{ theme.correctness }}</span>
        </div>
      </div>
      <Transition>
        <chart-theme
          v-if="isShow"
          :theme="theme"
          @toggleDetails="toggleDetails"
        />
        <!--        <div-->
        <!--            v-if="isShow"-->
        <!--            class="collapse-block bg-blue-light">-->
        <!--          <div class="card border-0 rounded-4 px-4 py-5">-->
        <!--            <div class="collapse-grid px-3">-->
        <!--              <div>-->
        <!--                <h5>Задания</h5>-->
        <!--                <div class="d-flex align-items-end mt-4 pt-3 pb-1 lh-1">-->
        <!--                <span class="m-0 collapse-counter">{{-->
        <!--                    theme.correctness-->
        <!--                  }}&nbsp;</span><span-->
        <!--                    class="text-muted">из {{ theme.tasks_count }}</span>-->
        <!--                </div>-->
        <!--                <div class="progress mt-2 mb-3">-->
        <!--                  <div-->
        <!--                      class="progress-bar"-->
        <!--                      :style="`width:${theme.correctness / theme.tasks_count * 100}%`" />-->
        <!--                </div>-->
        <!--                <p>Выполнили {{ medium }} задани{{-->
        <!--                    declension(medium, [-->
        <!--                      'е',-->
        <!--                      'я',-->
        <!--                      'й'-->
        <!--                    ])-->
        <!--                  }} повышенной сложности, {{ complex }} — углублённой</p>-->
        <!--                <p class="pb-3">Допустили {{ wrongs }}-->
        <!--                  ошиб{{ declension(wrongs, ['ку', 'ки', 'ок']) }}</p>-->
        <!--                <nuxt-link-->
        <!--                    class="btn btn-primary"-->
        <!--                    :to="`/topic/${theme.id}`">-->
        <!--                  Заниматься-->
        <!--                </nuxt-link>-->
        <!--              </div>-->
        <!--              <div>-->
        <!--                <chart-theme :theme="theme" />-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </Transition>
    </div>
  </div>
</template>

<script>
import useResultsStore from '~/stores/results'
import ChartTheme from '~/components/results/chart-theme.vue'
import ChartStats from '~/components/results/course/chart-stats.vue'

export default {
  props: {
    theme: {
      type: Object,
      required: true
    }
  },
  components: {
    ChartStats,
    ChartTheme
  },
  setup(props) {
    const store = useResultsStore()
    console.log(props.theme)
    const isShow = ref(false)
    const {id} = props.theme
    const tasks = computed(() => store.topicsData[`${id}`].tasks || [])
    const medium = computed(() => {
      const arr = tasks.value.filter((t) => t.complexity === 'medium' && t.has_correct_answer)
      return arr.length
    })
    const complex = computed(() => {
      const arr = tasks.value.filter((t) => t.complexity === 'complex' && t.has_correct_answer)
      return arr.length
    })
    const wrongs = computed(() => {
      const arr = tasks.value.filter((t) => t.has_wrong_answer)
      return arr.length
    })

    watch(() => store.subjectFilters?.params, () => {
      if (isShow.value && store.calendar.updated) {
        store.fetchTopicTrend(id)
      }
    })

    function getColor(num) {
      if (num > 80) return '#3db45a'
      if (num > 55) return '#ffb40a'
      return '#f87342'
    }

    async function toggleDetails() {
      if (!store.topicsData[`${id}`]) {
        await store.fetchTopicsTasks(id)
        await store.fetchTopicTrend(id)
      }
      isShow.value = !isShow.value
    }

    return {
      isShow,
      tasks,
      getColor,
      medium,
      complex,
      wrongs,
      toggleDetails
    }
  }
}
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}

.bg-blue-light {
  background-color: #F0F2FC;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.collapse-block {
  transition: all 0.2s;
  margin: 24px 0 16px;
}

.collapse-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 5.5rem;
}

.collapse-counter {
  font-size: 18px;
  font-weight: 500;
}

.progress {
  height: 4px;
}

.theme-card-line {
  padding: 0 16px;
  border-radius: 16px;
  overflow: hidden;
  transition: $transition;

  &:hover {
    background-color: #F0F2FC;
  }

  &__number-tasks, &__experience {
    display: flex;
    gap: 8px;
    width: 136px;
    min-width: 136px;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 165%;
    letter-spacing: -0.2px;
    margin-right: 32px;
  }

  &__number-tasks {
    margin-left: auto;
    margin-right: 24px;
  }

  &__icon {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
}

.theme-title {
  display: flex;
  margin-right: auto;
  padding: 9px 0;
  cursor: pointer;

  h5 {
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 165%;
    letter-spacing: -0.2px;
    margin-left: 8px;
    margin-right: 32px;
  }

  .svg-icon {
    min-width: 24px;
    width: 24px;
    height: 24px;
    margin-top: 3px;
  }
}

.theme-progress {
  min-width: 56px;
  margin: 0 80px;
  text-align: right;
}
</style>

<style lang="scss">
@import '/assets/scss/theme';

.caret-drop-down {
  color: #DDDEE0;
}

.theme-card-line {
  .caret-drop-down_isShow {
    transform: rotate(180deg);

    path {
      fill: #0C1524;
    }
  }

  &:hover {
    .caret-drop-down path {
      transition: $transition;
      fill: #0C1524;
    }
  }

  .theme-card-line__experience_opacity {
    span {
      color: #DDDEE0;
    }

    path {
      fill: #DDDEE0;
    }
  }
}
</style>
