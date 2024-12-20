<template>
  <div class="library-content-detail">
    <div
      v-for="(subjectItem, index) in libraryStore.getThemeListByClasses"
      :key="index"
      class="library-content-detail-item">
      <div class="library-content-detail-item-header">
        <h4 class="mb-0">
          {{ subjectItem.class }} класс
        </h4>
        <div class="library-content-detail-item-count">
          {{ subjectItem.themes.length }} {{ declension(subjectItem.themes.length, ['тема', 'темы', 'тем']) }}
        </div>
        <svg-icon
          class="library-content-detail-item-icon d-none"
          name="flag"/>
      </div>
      <div class="library-content-detail-table">
        <div class="library-content-detail-table-header">
          <div>
            <div
              @click="setSorter('name')"
              class="library-content-detail-table-header-item">
              <common-sort-label
                title="Название"
                :dir="dir('name')"/>
            </div>
          </div>
          <div>
            <div
              @click="setSorter('finished')"
              class="library-content-detail-table-header-item">
              <common-sort-label
                title="Выполнено"
                :dir="dir('finished')"/>
            </div>
          </div>
          <div>
            <div
              @click="setSorter('count')"
              class="library-content-detail-table-header-item">
              <common-sort-label
                title="Всего заданий"
                :dir="dir('count')"/>
            </div>
          </div>
        </div>
        <div class="library-content-detail-table-content">
          <div
            v-for="(theme, themeIndex) in sortedThemes(subjectItem.themes)"
            :key="themeIndex"
            class="library-content-detail-table-row"
            @click="$router.push(`/topic/${theme.id}`)">
            <div
              class="library-content-detail-title-col"
              :title="theme.name">
              {{ theme.name }}
            </div>
            <div class="library-content-detail-progress-col">
              <span>{{ completedTasks(theme) }}</span>
              <div class="library-content-detail-progress">
                <div :style="{width: `${progressValue(theme)}%`}"/>
              </div>
            </div>
            <div class="library-content-detail-info-col">
              <div>
                <div v-if="progressValue(theme) === 100">
                  <svg-icon
                    class="library-content-detail-finished-icon"
                    name="check-circle"/>
                </div>
                <div
                  class="library-content-detail-mod-count"
                  v-else>
                  {{ theme.tasks_count }}
                </div>
              </div>
              <div class="position-relative">
                <div
                  v-if="theme.new_module > 0"
                  class="library-content-detail-new-tests">
                  {{ theme.new_module }} новых
                </div>
                <div class="library-content-detail-enter">
                  <span>Заниматься</span>
                  <svg-icon
                    class="library-content-detail-enter-icon"
                    name="arrow-right"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useLibrarySubjectsStore from '~/stores/library-subjects';

  const libraryStore = useLibrarySubjectsStore();
  const router = useRouter();
  const sorter = ref({by: 'name', order: 'asc'});
  const completedTasks = computed(() => (theme) => {
    return theme.correctness || 0;
  });
  const progressValue = computed(() => (theme) => {
    return Math.ceil((completedTasks.value(theme) * 100) / theme.tasks_count);
  });
  const sortedThemes = computed(() => (themes) => {
    switch (sorter.value.by) {
      case 'name': {
        return sorter.value.order === 'desc'
          ? themes.sort(sortString).reverse()
          : themes.sort(sortString);
      }
      case 'finished': {
        return themes;
      }
      case 'count': {
        return sorter.value.order === 'desc'
          ? themes.sort((a, b) => b.tasks_count - a.tasks_count)
          : themes.sort((a, b) => a.tasks_count - b.tasks_count);
      }
      default: {
        return themes;
      }
    }
  });

  const sortString = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  };
  const dir = (name) => {
    const {by, order} = sorter.value;
    if (by === name) {
      return order === 'desc' ? 1 : 2;
    }
    return 0;
  };
  const setSorter = (name) => {
    if (sorter.value?.by === name) {
      sorter.value.order = sorter.value.order === 'desc' ? 'asc' : 'desc';
    } else {
      sorter.value.by = name;
      sorter.value.order = 'desc';
    }
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .library-content-detail {
    display: flex;
    flex-direction: column;
    gap: 3rem;

    &-item {
      max-width: 950px;
    }

    &-item-header {
      margin-bottom: 1.625rem;
      display: flex;
      align-items: baseline;
      gap: 0.6em;
    }

    &-item-icon {
      width: 1.125rem;
      color: $color-yellow-normal;
    }

    &-table {
      border-radius: $border-radius;
      border: 1px solid $color-dark-light;
    }

    &-table-header {
      font-size: 0.875rem;
      border-bottom: 1px solid $color-dark-light;
    }

    &-table-header-item {
      user-select: none;
      color: $color-dark;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: $transition;

      &:hover,
      &--sort {
        color: $color-black;
      }
    }

    &-sort-icon {
      color: $color-dark-light;
      width: 0.5rem;
      margin-bottom: -0.1rem;

      .sort-arrow-top,
      .sort-arrow-bottom {
        transition: $transition;
      }

      &-asc {
        .sort-arrow-top {
          fill: $color-black;
        }
      }

      &-desc {
        .sort-arrow-bottom {
          fill: $color-black;
        }
      }
    }

    &-table-header,
    &-table-row {
      padding: 1rem 1.5rem 1rem 2.5rem;
      display: grid;
      grid-template-columns: 63% 19% auto;
    }

    &-table-row {
      cursor: pointer;
      border-bottom: 1px solid #f2f5fa;
      position: relative;

      &:hover {
        color: $color-blue-normal;

        .library-content-detail-enter {
          transform: translateX(0);
          opacity: 1;
        }

        .library-content-detail-new-tests {
          opacity: 0;
        }

        .library-content-detail-mod-count {
          color: $color-blue-normal;
        }
      }
    }

    &-title-col {
      transition: all 150ms linear;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 4rem;
    }

    &-progress-col {
      display: grid;
      grid-template-columns: 1.5rem auto;
      align-items: center;
      gap: 0.5em;
      padding-right: 30%;
    }

    &-progress {
      height: 4px;
      border-radius: $border-radius;
      background: $color-dark-light;
      overflow: hidden;

      div {
        width: 0;
        height: 100%;
        background: $color-green-normal;
      }
    }

    &-finished-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: $color-green-normal;
    }

    &-mod-count {
      font-size: 0.875rem;
      color: $color-dark;
    }

    &-info-col {
      display: flex;
      align-items: center;
      gap: 0.5em;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    &-enter {
      display: flex;
      align-items: center;
      gap: 0.5em;
      opacity: 0;
      transform: translateX(-10px);
      transition: $transition;
    }

    &-enter-icon {
      width: 0.4rem;
    }

    &-new-tests {
      transition: $transition;
      position: absolute;
      background: #9747ff;
      color: #fff;
      padding: 0.2em 0.7rem;
      border-radius: 0.35rem;
      margin-top: -0.15rem;
      margin-left: -30%;
    }
  }
</style>
