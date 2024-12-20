<template>
  <major-main-item class="major-main-item">
    <div class="create-box create-col">
      <transition name="fade">
        <div class="create-tooltip" v-if="showToolTip">
          <div class="create-tooltip-text">
            <p>Добавление в избранное доступно только авторизованным пользователям</p>
          </div>
      
          <div class="create-tooltip-cross">
            <svg-icon name="close" @click="showToolTip = false" />
          </div>
        </div>
      </transition>
      
      <div class="create-list">
        <major-counter-item v-for="theme in themes" :key="theme.id" :item="theme" />
      </div>
  
      <div class="create-text">
        <div>
          <div class="create-text-title">
            <p>Выбрано заданий</p>
          </div>
  
          <template v-if="themesCheckedLength() > 0">
            <div class="create-text-numbers">
              {{`${tasksCheckedCount()}/${tasksCount}`}}
            </div>
            
            <div class="create-text-themes">
              {{ themesCheckedLength() }} {{ getThemeLabel(themesCheckedLength()) }}
            </div>
          </template>
            
          <template v-else>
            <div class="create-text-numbers">
              не выбрано
            </div>
          </template>
        </div>
  
        <button class="create-text-button" :disabled="themesCheckedLength() === 0" @click="handleCreateTextButton">Составить тест</button>
      </div>
    </div>
  
    <div class="create-content create-col">
      <div class="create-content-title">
        <p>Создавай собственные тесты</p>
      </div>
  
      <div class="create-content-text">
        <p>Выбирай интересующие темы из банка заданий и проверяй себя. Это поможет фокусироваться на слабых местах</p>
      </div>
    </div>
  </major-main-item>
</template>

<script setup>
import useMajorThemesStore from '~/stores/major-themes';

const { themes, tasksCount, themesCheckedLength, tasksCheckedCount } = useMajorThemesStore();

const showToolTip = ref(false);

const getThemeLabel = (count) => {
  const num = String(count).slice(-1);

  if (num == 1) {
    return 'тема';
  } else if (num >= 2 && num <= 4) {
    return 'темы';
  } else if ((num >= 5 && num <= 9) || num === 0) {
    return 'тем';
  }

  return 'тем';
};

const handleCreateTextButton = () => {
  showToolTip.value = true;

  setTimeout(() => {
    showToolTip.value = false;
  }, 2000);
}
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.fade-enter-active {
  animation: fade 0.5s;
}

.fade-leave-to {
  animation: fade-out 0.5s;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

.major-main-item {
  &::before {
    content: url('~/assets/icons/line_3.svg');
    position: absolute;
    bottom: -170px;
    left: 230px;
  }
}

.create {
  &-col {
    width: 49%;
  }

  &-tooltip {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: -20%;
    right: -20%;
    top: 5%;
    padding: 10px 24px;
    background: #0C1524;
    border-radius: 12px;

    &-text {
      p {
        color: #FFF;
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        margin-bottom: 0;
      }
    }

    &-cross {
      cursor: pointer;
      color: #FFF;
    }
  }

  &-box {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px 40px;
    background: #FFE8AD;
    border-radius: 24px;
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 240px;
    padding: 16px 48px 32px 48px;
    background: #FFF;
    border-radius: 20px;

    &-title {
      p {
        color:#93979E;
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        margin-bottom: 0;
      }
    }

    &-numbers {
      color:#0C1524;
      font-size: 38px;
      font-weight: 500;
      line-height: 54px;
    }

    &-themes {
      color: #0C1524;
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
    }

    &-button {
      border: 1px solid #C5D0FF;
      background: #FFF;
      color: #1B59F5;
      padding: 12px 0;
      border-radius: 10px;
      font-weight: 500;

      &:disabled {
        color: #DDDEE0;
        border: 1px solid #DDDEE0;
        background: #F3F3F1;
      }
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding-left: 48px;
    padding-right: 24px;

    &-title {
      p {
        font-size: 32px;
        font-weight: 500;
        line-height: 38px;
        margin-bottom: 0;
      }
    }

    &-text {
      p {
        font-size: 18px;
        font-weight: 400;
        line-height: 26px;
        margin-bottom: 0;
      }
    }
  }
}
</style>