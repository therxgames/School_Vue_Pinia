<template>
  <div class="awards-card"
       :class="{'awards-card_pointer': withModal}"
       @click="openModal"
  >
    <div class="awards-card__icon-wrapper">
      <img
          v-if="!!card.icon_default && !showImage"
          :src="card.icon_default"
          class="awards-card__icon"
          alt="card"
          :class="{['grayscale-image']: !card.accepted}"
          @error="showImage = true"
      >

      <svg-icon v-else class="awards-card__icon grayscale-image" name="awards-placeholder"/>

      <span v-if="card.rarity" class="awards-card__rarity" v-tooltip="{template:`<div class='tooltip tooltip-theme-dark' role='tooltip'><div class='arrow'></div><div class='tooltip-inner lvl-info__tooltip lvl-info__tooltip_center'></div></div>`, title: 'Процент пользователей с таким же достижением'}">
        {{ card.rarity }}%
      </span>
    </div>

    <div v-if="!card.accepted && !!card.step" class="progress" :class="{'progress_hide': withOutProgress}">
      <div class="progress-bar" :style="progressStyles"/>
    </div>

    <p class="awards-card__title" v-html="card.title" :class="{'title-accepted': card.accepted || !card.step}"/>

    <span v-if="card.date" class="awards-card__date" v-html="card.date"/>
  </div>

  <dialog-modal v-if="showModal" :is-show="showModal" :custom-slot="true">
    <template #customSlot>
      <div class="awards-card-modal awards-card-modal__container" ref="modalContainer">
        <svg-icon class="awards-card-modal__icon-close" name="cross" @click="clickCloseModal"/>

        <div class="awards-card-modal__icon-wrapper">
          <img
              v-if="!!card.icon_default && !showImage"
              :src="card.icon_default"
              class="awards-card__icon"
              alt="card"
              @error="showImage = true"
          >

          <svg-icon v-else class="awards-card__icon" name="awards-placeholder"/>

          <span v-if="card.rarity"
                v-tooltip="{template:`<div class='tooltip tooltip-theme-dark' role='tooltip'><div class='arrow'></div><div class='tooltip-inner lvl-info__tooltip lvl-info__tooltip_center'></div></div>`, title: 'Процент пользователей с таким же достижением'}"
                class="awards-card__rarity awards-card__rarity_modal"
          >
            {{ card.rarity }}%
          </span>

        </div>

        <div class="awards-card-modal__content">
          <h2 class="awards-card-modal__title" v-html="card.title"/>

          <p v-if="card.description" class="awards-card-modal__description" v-html="card.description"/>

          <span
              v-if="card.date && card.accepted"
              class="awards-card__date"
              v-html="card.date"
              :class="{'card-date-accepted': card.accepted}"
          />

          <!--          <div v-if="card.lvl_user && card.lvl_max_award"-->
          <!--               class="lvl-info__wrapper">-->
          <!--            <h4 class="lvl-info__text">{{ card.lvl_user }} уровень из-->
          <!--              {{ card.lvl_max_award }}</h4>-->
          <!--            <svg-icon class="lvl-info__icon-hint" name="question-gray"-->
          <!--                      v-tooltip="{template: `<div class='tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner lvl-info__tooltip'></div></div>`, title: '1 уровень (50)<br />2 уровень (250)<br />3 уровень (500)<br />4 уровень (1000)<br />5 уровень (2500)'}"/>-->
          <!--          </div>-->

          <div v-if="card.progress && !card.accepted && !!card.step" class="progress"
               :class="{'progress_opacity': !card?.progress}">
            <div class="progress-bar" :style="progressStyles"/>
          </div>

          <p v-if="card.more_tasks && (card.progress > 0 && card.progress < 100)"
             class="awards-card-modal__progress-desc"
             :class="{'awards-card-modal__progress-desc_mt0': !card?.progress}"
          >
            {{ card.more_tasks }}
          </p>
        </div>

        <button
            @click="clickCloseModal"
            type="button"
            class="btn btn-outline-primary"
            style="width: 202px; margin: 32px 0;"
        >
          Ок
        </button>
      </div>
    </template>
  </dialog-modal>

</template>

<script setup lang="ts">
import {AwardCard} from '~/types'
import DialogModal from '~/components/support/dialog-modal.vue'
import {onClickOutside} from '@vueuse/core'

const props = defineProps({
  card: {
    type: Object as () => AwardCard,
    required: true
  },
  withModal: {
    type: Boolean,
    required: false,
    default: false
  },
  withOutProgress: {
    type: Boolean,
    required: false,
    default: false
  }
})

const modalContainer = ref(null)
const showModal = ref(false)
const showImage = ref(false)

const progressStyles = computed(() => `width:${props.card?.progress || 0}%`)

onMounted(() => {
  onClickOutside(modalContainer, clickCloseModal)
})

const openModal = () => {
  if (props.withModal) {
    showModal.value = true
  }
}

const clickCloseModal = () => {
  showModal.value = false
}

interface GetTooltipAwardModalProps {
  text: string
  className: string
}

</script>

<style scoped lang="scss">
@import '/assets/scss/theme';

.title-accepted {
  margin-top: 36px;
}

.awards {
  &__title {
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    letter-spacing: -0.2px;
    margin-bottom: 24px;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
}

.awards-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 184px;
  padding: 16px 8px 24px 8px;
  transition: $transition;
  height: auto;
  border-radius: 24px;
  border: 1px solid transparent;

  &_pointer {
    cursor: pointer;

    &:hover {
      border-color: #DDDEE0;
    }
  }

  &__icon-wrapper {
    position: relative;
    width: 100%;
    height: 144px;
    padding: 0 12px;
  }

  &__icon {
    width: 100%;
    height: 100%;
  }

  &__rarity {
    position: absolute;
    top: 0;
    right: 4px;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid #FFF;
    background: #FFF;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 0.2px;

    &_modal {
      padding: 7px 16px;
      border-radius: 12px;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 160%;
      background-color: #F3F3F1;
      transition: $transition;
      cursor: pointer;
      right: -8px;
      top: -8px;

      &:hover {
        border: 1px solid #DDDEE0;
        background: #FFF;
      }
    }
  }

  &__title {
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    margin-bottom: 0;
    padding: 0 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }

  &__date {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 0.2px;
    color: #93979E;
    padding: 0 8px;
  }
}

.awards-card-modal {
  &__container {
    position: relative;
    width: 368px;
    background-color: #FFF;
    padding: 24px 24px 0;
    margin: auto;
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 8px 0;
  }

  &__icon-close {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 24px;
    height: 24px;
    padding: 4px;
    cursor: pointer;
    z-index: 2;
  }

  &__icon-wrapper {
    position: relative;
    width: 168px;
    height: 168px;
    margin: 16px 0 40px;
  }

  &__title {
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    letter-spacing: -0.4px;
    margin: 0;
  }

  &__description {
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    color: #424955;
    margin: 16px 0 0 0;
  }

  &__progress-desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 0.2px;
    color: #93979E;
    margin: 8px auto 0 0;

    &_mt0 {
      margin: 0 auto 0 0;
    }
  }

  .lvl-info {
    &__wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      margin: 24px 0;
      padding: 11px 16px;
      border-radius: 12px;
      background-color: #F0F2FC;
    }

    &__text {
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%;
      color: #255CE8;
      margin: 0 auto;
    }

    &__icon-hint {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(-16px, -50%);
      cursor: pointer;
    }
  }

  .progress {
    width: 100%;
    height: 4px;
    margin: 24px 0 0 0;
    background-color: #F3F3F1;
    border-radius: 0;

    .progress-bar {
      background-color: #266FED;
    }
  }
}

.progress {
  width: calc(100% - 32px - 16px);
  height: 4px;
  background-color: #F3F3F1;
  margin: 16px;
  border-radius: 0;

  &_hide {
    opacity: 0;
  }

  .progress-bar {
    background-color: #266FED;
  }
}

.card-date-accepted {
  margin-top: 16px;
}

.lvl-info__wrapper {
  .svg-icon-default svg {
    fill: none;

    &:hover path {
      stroke: #266FED;
    }
  }
}

.lvl-info__tooltip {
  text-align: left;
  background-color: #0C1524;

  &_center {
    text-align: center;
  }
}

.grayscale-image {
  filter: grayscale(100%);
}
</style>

