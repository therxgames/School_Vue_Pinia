<template>
    <nuxt-layout>
      <div class="page-default content-container content-container_max-width-1312 tree-container">
        <common-breadcrumbs :items="breadcrumbs" direction="right" :first-arrow="false" />

        <div class="tree-title">
          <svg-icon class="tree-title-icon" name="tree" />

          <h1 class="mb-0">Дерево обучения</h1>
        </div>

        <div class="tree-select">
          <div class="tree-select-title" role="button" data-bs-toggle="dropdown" data-bs-offset="0,5">
            <svg-icon name="arrow-bottom" class="dropdown-arrow" />
            
            <h1 class="mb-0">{{ sortList[0].title }}</h1>
          </div>

          <div class="dropdown-menu animation slide-in shadow flags-dropdown">
            <div v-for="({ id, title }, index) of sortList" :key="id">
              <a
                :class="{ 'mt-1': index !== 0, 'is-active': id === 1 }"
                class="btn btn-primary w-100"
                href="#"
              >
                {{ title }}
              </a>
            </div>
          </div>

          <div class="tree__select__description">
            <p class="tree__select__description-text">При подготовке к ОГЭ по физике вам предстоит сдать 2 ВПР в 7 и 8 классе. Структура ОГЭ имеет 4 раздела.</p>
          </div>
        </div>

        <div class="tree-card-wrapper">
          <div class="tree-card-section">
            <div class="tree-card-line-subsection">
              <svg-icon fill="none" name="tree-line-top-right" class="tree-line-top-right" />

              <div 
                class="tree-vertical-line" 
                :style="{height: `${subsectionLineHeight}px`}"></div>

              <svg-icon fill="none" name="tree-line-bottom-right" class="tree-line-bottom" />
            </div>

            <div class="tree-card-select">
              Раздел 1. Механические явления {{ lessonLineHeight }}
            </div>
          </div>

          <div class="tree-card-subsection-wrapper">
            <div class="tree-card-subsection">
              <!-- <div class="tree-card-line-subsection" :style="{top: '44px'}">
                <svg-icon fill="none" name="tree-line-top-right" class="tree-line-top-right" />

                <div class="tree-vertical-line" :style="{height: '265px'}"></div>

                <svg-icon fill="none" name="tree-line-bottom-right" class="tree-line-bottom" />
              </div> -->

              <div class="tree-card-content">
                Всемирное тяготение. Закон всемирного тяготения. Сила тяжести. 
                Ускорение свободного падения. Формула для вычисления силы тяжести вблизи поверхности Земли. 
                Искусственные спутники Земли
              </div>
            </div>
            
            <div class="tree-lesson-list" ref="lessonListRef">
              <div class="tree-lesson-item ">
                <div class="tree-lesson-line">
                  <svg-icon fill="none" name="tree-line-top-right" class="tree-line-top-right" />

                  <div 
                    class="tree-vertical-line" 
                    :style="{height: '85px'}" />
                </div>

                <div class="tree-lesson-card tree-card-content">
                  Закон всемирного тяготения. Сила тяжести
                </div>
              </div>

              <div class="tree-lesson-item">
                <div class="tree-lesson-line">
                  <svg-icon fill="none" name="tree-line-top-right" class="tree-line-top-right" />

                  <div class="tree-vertical-line" :style="{height: '85px'}"></div>
                </div>

                <div class="tree-lesson-card tree-card-content">
                  Явление тяготения и сила тяжести. Сила тяжести на других планетах
                </div>
              </div>

              <div class="tree-lesson-item" data-id="3">
                <div class="tree-lesson-line">
                  <svg-icon fill="none" name="tree-line-top-right" class="tree-line-top-right" />

                  <div class="tree-vertical-line" :style="{height: calculateLineHeight(3, 'middle')}"></div>

                  <svg-icon fill="none" name="tree-line-bottom-left" class="tree-line-left" />
                </div>

                <div class="tree-lesson-card tree-card-content">
                  Явление тяготения и сила тяжести. Сила тяжести на других планетах
                </div>
              </div>

              <div class="tree-lesson-item" data-id="4">
                <div class="tree-lesson-line">
                  <svg-icon fill="none" name="tree-line-top-left" class="tree-line-top-left" />

                  <div class="tree-vertical-bottom-line" :style="{height: 0}"></div>

                  <svg-icon fill="none" name="tree-line-bottom-right" class="tree-line-bottom-right" />
                </div>

                <div class="tree-lesson-card tree-card-content">
                  Явление тяготения и сила тяжести. Сила тяжести на других планетах432
                </div>
              </div>

              <div class="tree-lesson-item">
                <div class="tree-lesson-line" :style="{top: '-55px'}">

                  <div class="tree-vertical-bottom-line" :style="{height: '85px'}"></div>

                  <svg-icon fill="none" name="tree-line-bottom-right" class="tree-line-bottom-right" />
                </div>

                <div class="tree-lesson-card tree-card-content">
                  Явление тяготения и сила тяжести. Сила тяжести на других планетах432
                </div>
              </div>

              <div class="tree-lesson-item">
                <div class="tree-lesson-line" :style="{top: '-55px'}">

                  <div class="tree-vertical-bottom-line" :style="{height: '85px'}"></div>

                  <svg-icon fill="none" name="tree-line-bottom-right" class="tree-line-bottom-right" />
                </div>

                <div class="tree-lesson-card tree-card-content">
                  Явление тяготения и сила тяжести. Сила тяжести на других планетах432
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nuxt-layout>
</template>

<script setup>
const breadcrumbs = [
  {
    to: '/results', 
    title: 'Мои достижения'
  },
  {
    to: '/results/2-8', 
    title: 'Подготовка к ОГЭ, 9 класс, физика'
  },
];

const sortList = ref([
  {
    id: 1,
    title: 'Физика',
  },
  {
    id: 2,
    title: 'История'
  }
]);

const lessonsList = [
  {
    id: 1,
    content: 'Явление тяготения и сила тяжести. Сила тяжести на других планетах',
  },
  {
    id: 2,
    content: 'Закон всемирного тяготения. Сила тяжести',
  },
  {
    id: 3,
    content: 'Решение задач на движение тел под действием силы тяжести',
  },
  {
    id: 4,
    content: 'Невесомость и перегрузки',
  },
  {
    id: 5,
    content: 'Первая космическая скорость',
  },
  {
    id: 6,
    content: 'Решение задач на применение закона всемирного тяготения',
  },
];

const lessonListRef = ref(null);
const lessonLineHeight = ref(0);
const lessonsCount = ref(6);
const subsectionLineHeight = ref(0);
const HOOKS_HEIGHT = 32;

// const calculateLineHeight = (height, count) => {
//   return height / count;
// };

const calculateSubsectionLineHeight = (height) => {
  return height / 2;
};

const calculateLineHeight = (id, line_middle = false) => {
  const element = lessonListRef?.value?.querySelector(`.tree-lesson-item[data-id="${id}"]`);
  const nextElement = element?.nextSibling;

  console.log(nextElement)

  return element?.offsetHeight;
}

const calculateMiddleLineHeight = (height_1, height_2) => {
  return (height_1 / 2) + (height_2 / 2 - HOOKS_HEIGHT);
}

// const calculateLineHeight = (line_type, element_id) => {
//   if (line_type === 'middle') {
//     return `${getElementHeight(element_id) - HOOKS_LENGTH}px`;
//   }


// }

onMounted(() => {
  lessonLineHeight.value = calculateLineHeight(lessonListRef.value.getBoundingClientRect().height, lessonsCount.value);
  subsectionLineHeight.value = calculateSubsectionLineHeight(lessonListRef.value.getBoundingClientRect().height);
});
</script>

<style lang="scss" scoped>
.tree-card {
  &-content {
    position: relative;
    background: #FFF;
    padding: 12px 32px 12px 16px;
    border-radius: 24px;
    max-width: 460px;
  }

  &-section {
    position: relative;
    background: #FFF;
    padding: 24px 32px;
    border-radius: 24px;
  }

  &-wrapper {
    border-radius: 32px;
    background: radial-gradient(83.71% 134.18% at 12.71% 11.82%, #F2F4FF 0%, #D0DDFF 100%);
    padding: 32px 165px;
    margin-top: 32px;
  }

  &-line-subsection {
    position: absolute;
    top: 25px;
    left: -20.5px;
  }

  &-subsection {
    margin-top: 180px;
    position: relative;
  }
}

.tree-lesson {
  &-list {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    margin-left: 20px;
  }

  &-item {
    display: flex;
    align-items: flex-start;
    margin-left: 20px;
    position: relative;
  }

  &-line {
    position: absolute;
    margin-top: 20px;
    top: 0;
    left: -20px;
  }
}

.tree-card-subsection {
  &-wrapper {
    display: flex;
    margin-top: 26px;
  }
}

.tree-line-top-left {
  position: relative;
  right: 19px;
  bottom: 30px;
}

.tree-line-bottom-right {
  position: relative;
  right: 2px;
  // bottom: 30px;
}

.tree-lesson-bottom-line {
  position: absolute;
}

.tree-vertical-bottom-line {
  border-left: 1.7px solid #0576FF;
  height: 30px;
  margin-top: -30px;
}

.tree-title {
  display: flex;
  align-items: center;

  &-icon {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
}

.tree-select {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 32px;
  position: relative;
}

.tree-card-item-line {
  color: #0576FF;
  margin-top: 25px;
}

.tree-select-description {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 8px;

  &-text {
    margin-bottom: 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 165%;
    max-width: 700px;
  }
}

.tree-select-title {
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
}

.tree-card-item {
  display: flex;
  align-items: center;
  position: relative;
}

.tree-card-item-line {
  position: absolute;
  top: 5px;
  left: -20px;
}

.tree-vertical-line {
  border-left: 1.7px solid #0576FF;
  height: 30px;
  margin-top: -5px;
}

.tree-line-bottom {
  position: relative;
  right: 2px;
  bottom: 1px;
}

.tree-line-left {
  position: relative;
  right: 20px;
  bottom: 5px;
}

.tree-task-list {
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  margin-left: 56px;
}

.flags-sort {
  .svg-icon {
    --svg-icon-width: 1rem;
    --svg-icon-height: 1rem;
  }
}

.flags-sort:not(.is-active), .show .dropdown-arrow {
  transform: rotate(-180deg);
}
.dropdown-arrow {
  transition: transform 350ms ease-out;
  margin-top: 8px;
  --svg-icon-width: 0.7rem;
  --svg-icon-height: 0.7rem;
}

.flags-dropdown {
  padding: 8px;
  left: 50%!important;
  transform: translate(-50%, 50px)!important;

  &__text {
    color: rgb(147, 151, 158);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

.flags-disabled {
  opacity: 0.5;
}
</style>
