<template>
  <div class="themes-list">
    <div class="themes-list__header">
      <div class="parent-sort">
        <h4 class="themes-list__title">Темы</h4>
      </div>
      <input-radio-group
        type="button-swap"
        labelClassNames="px-4"
        :list="typeList"
        v-model:value="type"
      />
      <div class="filters__check-wrapper">
        <input-checkbox
          label="Без заданий"
          v-model:checked="fullProgress"
          id="full-progress"
        />
        <div
          v-if="fullProgress"
          v-tooltip="{ title: 'Включено. Какой-то текст' }"
          class="filters__check-hint">
          <svg-icon name="question-gray" />
        </div>
        <div
          v-else
          v-tooltip="{ title: 'Выключено. Какой-то текст' }"
          class="filters__check-hint">
          <svg-icon name="question-gray" />
        </div>
      </div>
      

      <div 
        v-for="{ name, sorted, value } in sortList"
        class="parent-sort themes-list__col-name" 
        @click="() => themesSortHandler(value, sorted)"
        :class="{'themes-list__col-margin': sorted === 0}">
        <div :class="{'themes__item-active': sorted === 1}" v-if="sorted === 1">
          <svg-icon class="sort__icon" name="arrow-down" />
        </div>

        <div :class="{'themes__item-active': sorted === 2}" v-if="sorted === 2">
          <svg-icon class="sort__icon" name="arrow-up" v-if="sorted === 2" />
        </div>

        <p :class="{'themes__item-active': value === sortType && sorted !== 0}">{{ name }}</p>
      </div>
    </div>
    <transition name="transition-fade">
      <div v-if="type === 'themes'">
        <theme-card v-for="theme in themes" :key="theme.id" :theme="theme" />
      </div>
    </transition>
    <transition name="transition-fade">
      <div v-if="type === 'emptyThemes'">
        <theme-empty
          v-for="(theme, index) in themes"
          :key="index"
          :theme="theme"
        />
      </div>
    </transition>
    <transition name="transition-fade">
      <div v-if="!themes.length">
        <h4 class="text-muted text-center py-5">Список пуст</h4>
      </div>
    </transition>
  </div>
</template>

<script>
import useResultsStore from '~/stores/results'
import ThemeCard from '~/components/results/theme-card.vue'
import ThemeEmpty from '~/components/results/theme-empty.vue'

export default {
  components: {
    ThemeCard,
    ThemeEmpty
  },
  setup () {
    const store = useResultsStore()
    const typeList = [
      { name: 'Все', id: 'themes' },
      { name: 'Обрати внимание', id: 'emptyThemes' },
      { name: 'В процессе', id: 'inProgress' },
      { name: 'Завершенные', id: 'completed' }

      // { name: 'С заданиями', id: 'themes' },
      // { name: 'Без заданий', id: 'emptyThemes' }
    ];

    const sortList = ref([
      {
        id: 1,
        name: 'Кол-во заданий',
        value: 'tasks_count',
        sorted: 0,
      },
      {
        id: 2,
        name: 'Опыт',
        value: 'correctness',
        sorted: 0,
      },
    ]);
    
    const sortType = ref('');
    const sortObj = reactive({});

    // function setSortType(value) {
    //   sortType.value = value
    // }
    
    const type = ref('themes')
    const sectionList = computed(() => {
      return ['Все разделы'].concat(store.sections).map((el, ind) => {
        return { name: el, id: ind + 1 }
      })
    })
    const section = ref(1)
    const fullProgress = ref(false)
    const sortedThemes = ref(0)

    const themes = computed(() => {
      let list = [];

      const currentSection = section.value > 1 ? store[type.value][section.value - 2]?.topics : store[type.value][0]?.topics;
      list = currentSection || [];

      if (sectionList.value.length > 2 && section.value <= 1) {
        list = [...store[type.value]].reduce((arr, s) => arr.concat(s.topics), []);
      }

      sortObj.value = sortList.value.find(item => item.value === sortType.value);
      sortList.value = sortList.value.map(item => ({
        ...item,
        sorted: item.value === sortType.value ? item.sorted : 0,
      }));

      if (sortObj.value?.sorted > 2) {
        sortList.value = sortList.value.map(item => ({
          ...item,
          sorted: 0,
        }));
      }

      if (sortObj.value?.sorted === 1 || sortObj.value?.sorted === 2) {
        list = [...list].sort((a, b) => (sortObj.value.sorted === 1 ? a[sortType.value] - b[sortType.value] : b[sortType.value] - a[sortType.value]));
      }

      return list;
    });

    const themesSortHandler = (value, sorted) => {
      sortType.value = value; 
      sortList.value = sortList.value.map(item => (item.value === value ? { ...item, sorted: sorted + 1 } : item)); 
    }

    return {
      themes,
      sortedThemes,
      typeList,
      sortList,
      sortObj,
      type,
      sectionList,
      section,
      fullProgress,
      sortType,
      themesSortHandler
    }
  }
}
</script>

<style lang="scss" scoped>
.themes-list {
  margin-top: 48px;
  padding-right: 80px;

  &__title {
    margin-bottom: 0;
  }

  &__col-name {
    display: flex;
    align-items: center;

    p {
      min-width: 136px;
      margin-bottom: 0;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 160%;
      margin-bottom: 0;
    }
  }

  &__col-margin {
    margin-left: -15px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 32px;
    width: 100%;
    padding: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #DDDEE0;

    .filters {
      &__check-wrapper {
        display: flex;
        align-items: center;
      }

      &__check-hint {
        margin-left: 8px;
        margin-right: 12px;
      }
    }
  }

  .themes__item {
    &-active {
      color: #0576FF;
    }
  }

  .parent-sort {
    position: relative;
    cursor: pointer;

    .sort__icon {
      position: absolute;
      top: 50%;
      left: -4px;
      transform: translate(-100%, -55%);
      width: 16px;
      height: 16px;
      padding: 1px;

      &_big {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.rotate {
  &-up {
    transform: rotate(270deg);
  }

  &-down {
    transform: rotate(90deg);
  }
}
</style>

<style lang="scss">
.themes-list__header .filters__check-hint {
  svg {
    fill: none;
  }
}

.parent-sort {
  .sort__icon_active {
    svg path {
      fill: none;
      stroke: #266FED;
    }
  }
}
</style>
