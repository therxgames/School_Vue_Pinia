<template>
  <nuxt-link :to="getPathCardDetail()" class="card-container">
    <div v-if="data?.data?.logo" class="card-image-data-container" :style="colorImageContainer">
      <img :src="data?.data?.logo" class="card-image-data" :style="styleSizeImage" alt="Логотип">
    </div>

    <materials-cards-item-cover v-else type="project" class="card-image-placeholder" :img-url="data.cover"/>

    <div class="card-content-container">
      <div class="card-content-title">{{ parseData?.title }}</div>
      <div class="card-content-description" v-if="parseData?.description" v-html="parseData?.description"/>
      <div class="card-content-info">
        <div class="card-content-info-more">
          <div v-if="parseData?.collection?.title">{{ parseData?.collection?.title }}</div>
          <div v-if="parseData?.supplier?.title">{{ parseData?.supplier?.title }}</div>
        </div>
        <div class="card-content-info-more">
          <div v-if="publishedAt">{{ publishedAt }}</div>
          <div v-if="parseData?.viewCount" class="view-container">
            <svg-icon name="eye-open" class="eye-icon"/>
            <span>{{ parseData?.viewCount }}</span>
          </div>
          <div v-if="parseData?.classes?.length">{{ parserClasses(parseData.classes) }}</div>
          <div v-if="parseData?.courses?.length" v-for="course of parseData?.courses">{{ course.name }}</div>
        </div>
        <div>Источник: {{ parseData?.source }}</div>
        <div v-if="parseData?.region?.name">{{ parseData?.region?.name }}</div>
      </div>
    </div>

    <div class="card-actions" v-if="parseData?.isOnline">
      <div v-if="parseData?.isOnline" class="status">Онлайн</div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import {format, parseISO} from "date-fns";
import {parserDataSearch} from "~/components/search/utils/parserDataSearch";
import {parserClasses} from "~/components/search/utils/parserClasses";

type TCard = {
  data: any
};

const parseData = ref({});
const props = defineProps<TCard>();

onMounted(() => {
  parseData.value = parserDataSearch(props.data, props.data.source)
})

const parseISODate = props.data.publishedAt && parseISO(props.data.publishedAt);
const publishedAt = parseISODate && format(parseISODate, 'dd.MM.yyyy');

const styleSizeImage = {
  height: props.data?.data?.logo?.height ? `${props.data?.data?.logo?.height}px` : '100%',
  width: props.data?.data?.logo?.width ? `${props.data?.data?.logo?.width}px` : '100%'
};

const colorImageContainer = props.data?.data?.color
  ? {backgroundColor: props.data.data.color}
  : {};

const source = props.data.source;
const toLibraryDetail = `/library/details/${props.data.id}`
const toCalendarDetail = `/calendar/details/${props.data.id}`

const getPathCardDetail = () => {
  switch (source) {
    case 'calendar':
      return toCalendarDetail;
    case 'material_library':
      return toLibraryDetail
    default:
      return '#'
  }
}
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  padding: 8px 12px;
  align-items: center;
  border-radius: 63px;
  background: #21BD4F;
  height: 36px;
  color: #FFF;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.2px;;
}

.eye-icon {
  height: 20px;
  width: 20px;
}

.view-container {
  display: flex;
  gap: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.card-content-info-more {
  display: flex;
  gap: 0 12px;
  flex-wrap: wrap;
}

.card-content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.card-content-title {
  color: #0C1524;
  font-size: 18px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
}

.card-content-info {
  display: flex;
  flex-direction: column;
  color: #93979E;
  line-height: 140%;
  letter-spacing: 0.2px;
  font-size: 14px;
}

.card-content-description {
  color: #0C1524;
  line-height: 160%;
  max-height: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Количество строк, которые вы хотите отобразить */
  -webkit-box-orient: vertical;

  & > p {
    margin-bottom: 0;
  }
}

.card-container {
  display: flex;
  gap: 32px;
  padding: 16px 16px 32px 16px;
  border: 1px solid transparent;
  border-radius: 16px;

  &:hover {
    border: 1px solid #dddee0;

    .card-content-container {
      .card-content-title {
        color: rgb(37 76 232/1);
      }
    }
  }
}

.card-image {
  height: 100%;
  width: 100%;
}

.card-image-placeholder {
  height: 92px !important;
  width: 147px !important;
  flex-shrink: 0;
}

.card-image-data-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  width: 9rem;
  aspect-ratio: 11/16;
  flex-shrink: 0;
}
</style>
