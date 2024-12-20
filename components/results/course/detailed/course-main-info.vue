<template>
  <div class="main-info__wrapper">
    <div class="main-info__top">
      <img
        src="~assets/images/courses/bush.png"
        alt="bush"
      >
    </div>
    <div class="main-info__exp">
      <div class="exp__count">
        <span v-html="info.experience.exp_count.text" />
        <div class="star-four">
          <svg-icon class="star-four-icon" name="star-four" />
          <span v-html="info.experience.exp_count.count" />
        </div>
      </div>
      <div class="exp__progress">
        <p class="progress__title" v-html="info.experience.progress.text" />
        <div class="progress__icon-wrapper">
          <span>1</span>
          <svg-icon
            class="lvl-icon"
            :name="lvlIconNames[info.experience.progress.lvl]"
          />
        </div>
        <p class="progress__text" v-html="info.experience.progress.sub_text" />
        <div class="progress">
          <div class="progress-bar" :style="progressStyles" />
        </div>
      </div>
      <div class="exp__to-day">
        <p class="to-day__title" v-html="info.experience.to_day.text" />
        <span class="to-day__count" v-html="info.experience.to_day.points" />
      </div>
    </div>
    <completed-block
      v-for="(item) in info.completed"
      :key="item.title"
      :completed="item"
    />
  </div>
</template>

<script setup lang="ts">
import CompletedBlock
  from '~/components/results/course/detailed/completed-block.vue'
import { SubjectMainInfo } from '~/types'

const props = defineProps({
  info: {
    type: Object as () => SubjectMainInfo,
    required: true
  },
})

const lvlIconNames = {
  1: 'lvl-icon_1',
  2: 'lvl-icon_1',
  3: 'lvl-icon_1',
  4: 'lvl-icon_1',
  5: 'lvl-icon_1',
  6: 'lvl-icon_1',
  7: 'lvl-icon_1',
  8: 'lvl-icon_8',
}
const progressStyles = computed(() => `width:${props.info?.experience.progress.progress_line}%`)

</script>

<style scoped lang="scss">
.main-info {
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, auto);
    gap: 24px;
    margin-top: 32px;
    padding: 32px 48px 64px 48px;
    flex-direction: column;
    border-radius: 32px;
    background: radial-gradient(83.71% 134.18% at 12.71% 11.82%, #F2F4FF 0%, #D0DDFF 100%);
    overflow: hidden;
  }

  &__top, &__exp, &__completed {
    border-radius: 24px;
    background: #fff;
  }

  &__top {
    display: flex;
    justify-content: center;
    align-items: center;
    grid-area: 1 / 1 / 1 / 4;
    min-height: 194px;
    padding: 32px 48px 32px 24px;
  }

  &__exp {
    display: flex;
    justify-content: space-between;
    gap: 48px;
    grid-area: 2 / 1 / 2 / 4;
    min-height: 244px;
    padding: 32px 48px 32px 24px;
  }

  &__completed {
    min-height: 362px;
    padding: 32px 32px 56px;
  }
}

.star-four {
  display: flex;
  align-items: center;

  &-icon {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 60px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%;
    letter-spacing: -1.8px;
    margin-left: 8px;
  }
}

.exp {
  &__count {
    width: 220px;
    max-width: 220px;
  }

  &__progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .lvl-icon {
      width: 88px;
      height: 88px;
    }

    .progress {
      width: 608px;
      height: 8px;
      margin-top: 16px;

      .progress-bar {
        border-radius: 16px;
        background: linear-gradient(80deg, #00B09B -23.22%, #96C93D 93.88%);
      }

      &__icon-wrapper {
        position: relative;
      }

      &__title {
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        margin-bottom: 8px;
      }

      &__text {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        color: #93979E;
        margin-top: 8px;
        margin-bottom: 0;
      }
    }

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 60px;
      font-style: normal;
      font-weight: 400;
      line-height: 110%;
      letter-spacing: -1.8px;
      color: #fff;
    }
  }

  &__to-day {
    width: 220px;
    max-width: 220px;

    .to-day {
      display: flex;
      flex-direction: column;

      &__title {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        margin-bottom: 0;
      }

      &__count {
        font-size: 60px;
        font-style: normal;
        font-weight: 400;
        line-height: 110%;
        letter-spacing: -1.8px;
        color: transparent;
        background: linear-gradient(80deg, #00B09B -23.22%, #96C93D 93.88%);
        background-clip: text;
      }
    }
  }
}
</style>
