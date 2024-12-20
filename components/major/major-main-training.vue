<template>
  <major-main-item class="major-main-item">
    <div class="training-box training-col">
      <div class="training-box-title" :class="{'training-box-title-mb': !isDropText}">
        Я точно 
  
        <div @drop="onDrop" @dragenter="isDragHover = true" @dragleave="isDragHover = false" @dragover.prevent class="training-box-drop" :class="[{'training-box-drop-shadow': isDropText}, {'training-box-drop-border': isDragHover}]">
          {{ dropItemText }}
        </div>
  
        ОГЭ!
      </div>
  
      <div class="drag-list" v-if="!isDropText">
        <draggable :list="items" item-key="id" @start="onDragStart">
          <template #item="{ element }">
            <major-drag-item :title="element.name" class="drag-item-left" />
          </template>
        </draggable>
  
        <major-drag-item title="Не сдам" color="#8C3FDF" class="drag-item-right" @mousemove="dragItemHandler"  />
      </div>
  
      <transition name="bounce">
        <div class="training-box-result" v-if="isDropText">
          <div class="training-box-result-icon">
            <svg-icon name="check" />
          </div>
  
          <p class="training-box-result-title">Верно! Мы тоже уверены, что ты справишься!</p>
        </div>
      </transition>
    </div>
  
    <div class="training-content training-col">
      <div class="training-content-title">
        <p>Тренируйся в решении заданий</p>
      </div>
  
      <div class="training-content-text">
        <p>«Цифровой помощник ученика» предлагает большой банк заданий разного типа 
          и уровня сложности. Тренируйся, проверяй 
          свои знания и выявляй пробелы</p>
      </div>
    </div>
  </major-main-item>
</template>

<script setup>
import draggable from 'vuedraggable';
import { getRandomInt } from '~/utils/utils';

const dropItemText = ref('');
const isDropText = ref(false);
const isDragHover = ref(false);

watch(() => dropItemText.value, () => {
  isDropText.value = !!dropItemText.value.length;
});

const dragItemHandler = (e) => {
  e.style.right = getRandomInt(0, 150) + "px";
  e.style.bottom = getRandomInt(0, 150) + "px";
}

const items = reactive([
  { id: 1, name: "Сдам" },
]);

const onDrop = (event) => {
  dropItemText.value = event.dataTransfer.getData('text/plain');
  isDragHover.value = false;
}
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.bounce-enter-active {
  animation: bounce 1s ease-out;
}
.bounce-leave-active {
  animation: bounce 2.5s reverse;
}

@keyframes bounce {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  60% {
    transform: translateY(-30%);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.major-main-item {
  &::after {
    position: absolute;
    content: url('~/assets/icons/line_1.svg');
    bottom: -135px;
    right: 250px;
  }
}

.training {
  display: flex;
  justify-content: space-between;
  position: relative;

  &-col {
    width: 49%;
  }

  &-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    background: #B27BEE;
    border-radius: 24px;
    height: 320px;
    gap: 32px;

    &-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      gap: 16px;
      font-size: 32px;
      font-weight: 500;
      line-height: 32px;
      color: #FFF;
      transition: all 0.2s linear 0s;

      &-mb {
        margin-bottom: 64px;
      }
    }

    &-drop {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 54px;
      border: 1px solid #8D4CD3;
      background: #A764EE;
      border-radius: 12px;
      width: 150px;
      height: 54px;
      text-transform: lowercase;

      &-shadow {
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0px 16px 32px 0px #FFFFFF40;
      }

      &-border {
        border: 2px solid #0C1524;
      }
    }

    &-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      padding: 29px 35px;
      background: #FFF;
      border-radius: 16px;
      transform: rotate(-2deg);
      max-width: 324px;

      &-title {
        font-size: 19px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 0;
      }

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #13BC57;
        color: #FFF;
        font-size: 12px;
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

.drag {
  &-list {
    display: flex;
    gap: 16px;
    width: 100%;
  }

  &-item {
    &-left {
      left: 22%;
      bottom: 30%;
      cursor: pointer;
    }

    &-right {
      right: 22%;
      bottom: 30%;
      user-select: none;
    }
  }
}
</style>