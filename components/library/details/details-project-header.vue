<template>
  <div class="project-header" :style="{boxShadow: `-1000px 0 0 ${computedColor}`}">
    <div class="project-header-image" :style="{backgroundColor: computedColor}" v-if="item?.files[0]">
      <img :src="item?.files[0]?.url" class="project-header-image-img"  />
      <!-- <img v-if="item?.image?.url" :src="item.image?.url" class="project-header-image"  /> -->
    </div>

    <!-- <div class="project-header-icon">
      <svg-icon :name="libraryItemIcon['btsok']" class="details-header-icon"/>
    </div> -->
    
    <div class="project-header-bg" :style="computedBgStyle" />

    <div class="container text-white">
      <div class="project-header-content">
        <p class="mb-0">Проект</p>

        <div class="d-flex gap-3 align-items-center">
          <common-online-btn v-if="item?.isOnline" />

          <div v-if="item?.isPaid">
            <p class="mb-0">Платно</p>
          </div>

          <div class="d-inline-flex align-items-center gap-1">
            <svg-icon name="eye-open" />
            <span>{{ item.viewCount }}</span>
          </div>

          <!-- <div class="d-inline-flex align-items-center gap-1">
            <svg-icon name="thumbs-up" />
            <span>{{ '1'.toLocaleString('ru') }}</span>
          </div> -->
        </div>

        <div class="project-header-logo" v-if="item?.project?.logo">
          <img :src="item?.project?.logo?.url" class="project-header-logo-img" />
        </div>

        <h1 v-if="item?.title" class="mb-0">{{ item?.title }}</h1>

        <h5 class="mb-0" v-html="item?.description"></h5>

        <library-details-project-dates 
          :registrationStart="item?.project.registrationStart" 
          :registrationEnd="item?.project.registrationEnd" 
          :eventDate="item?.project.dateStart" 
          :eventTimeStart="item?.project.timeStart"
          :eventTimeEnd="item?.project.timeEnd" />

        <div class="d-flex align-items-center gap-2" v-if="item?.url">
          <a :href="item.url" target="_blank" class="more-button text-white">
            Подробнее
          </a>

          <!-- <button class="button-circle">
            <svg-icon name="thumbs-up" />
          </button> 

          <button class="button-circle">
            <svg-icon name="star" />
          </button>  -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { libraryItemIcon } from '~/components/library/details/consts';

const props = defineProps({
  item: {
    type: Object,
  },
});

const computedColor = computed(() => {
  return !props.item?.image ? '#73A2FC' : props.item?.color || '#5B7BEB';
});

const computedBgStyle = computed(() => {
  const color = props.item?.color || '#5B7BEB';
  const stops = [`${color} 0%`, `${color} 40%`, 'transparent 60%', 'transparent 100%'];

  return { backgroundImage: `linear-gradient(90deg, ${stops.join(', ')})` };
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.project-header {
  position: relative;
  min-height: 565px;
  width: 100vw;
  left: 50%;
  right: 50%;
  padding-bottom: 6rem;
  padding-top: 2rem;
  margin-left: -50vw;
  margin-right: -50vw;

  &-image {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: -10;
    width: 60%;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      flex-shrink: 0;
    }
  }

  &-icon {
    position: absolute;
    top: 50%;
    right: 25%;
    transform: translateY(-50%);
    color: #FFF;
  }

  &-bg {
    position: absolute;
    inset: 0;
    left: 0;
    z-index: -10;
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 640px;
  }

  &-logo {
    height: 5rem;

    &-img {
      width: auto;
      max-height: 5rem;
      object-fit: cover;
    }
  }
}

.more-button {
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  color: #FFF;
  background: #0576ff;
}

.button-circle {
  border: none;
  border-radius: 100%;
  padding: 0.75rem 0.75rem;
  color: #000;
}
</style>
