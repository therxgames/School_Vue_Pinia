<template>
  <nuxt-link
    class="card"
    :class="{ 'card-theme_list': listMode }"
    :to="detailUrl"
  >
    <div class="card-image">
      <MaterialsCardsItemCover :type="collectionCode" :img-url="imgUrl"/>
      <div v-if="isOnline && !listMode" class="card-online">Онлайн</div>
    </div>
    <div class="card-content">
      <div class="card-title">{{ item.title }}</div>
      <p>{{ item.collection.title }}. {{ item.supplier.title }}</p>
      <p v-if="!listMode">{{ date }}</p>
    </div>
    <div class="card-bottom">
      <div class="card-bottom-list">
        <div v-if="listMode" class="card-list-item">{{ date }}</div>
        <div class="card-list-item card-familiarize-time d-flex align-items-center">
          <svg-icon name="eye-open" />
          <span>{{ viewCount }}</span>
        </div>
        <div
          v-if="familiarizeTime"
          class="card-list-item card-familiarize-time d-flex align-items-center"
        >
          <svg-icon
            v-tooltip="{ title: `Примерное время чтения` }"
            name="time-clock"
          />
          ~{{ familiarizeTime }}
        </div>
        <div class="card-list-item" v-if="item?.classes && item?.classes.length > 0">{{ classes }}</div>
        <div class="card-list-item card-list-item-courses" v-if="item?.courses && item?.courses.length > 0">{{
            courses
          }}
        </div>
      </div>
    </div>
    <div v-if="isOnline && listMode" class="card-online">Онлайн</div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import {formatDateByMask} from "~/utils/format-date";

const {item, listMode} = defineProps<{ item: any; listMode: any }>();

const classes = computed(() => {
  if (item.classes.length === 1) {
    return `${item.classes[0].number} кл.`;
  }

  const sortedClasses = item.classes.sort((a, b) => a.number - b.number);
  const classNumbers = sortedClasses.map(item => item.number);

  let result = '';
  let rangeStart = classNumbers[0];
  let rangeEnd = classNumbers[0];

  for (let i = 1; i < classNumbers.length; i++) {
    if (classNumbers[i] === classNumbers[i - 1] + 1) {
      rangeEnd = classNumbers[i];
    } else {
      result += (rangeStart === rangeEnd) ? `${rangeStart}, ` : `${rangeStart}-${rangeEnd}, `;

      rangeStart = classNumbers[i];
      rangeEnd = classNumbers[i];
    }
  }

  result += (rangeStart === rangeEnd) ? rangeStart : `${rangeStart}-${rangeEnd}`;

  return `${result} кл.`;
});
const date = computed(() => formatDateByMask(item.publishedAt, "dd.MM.yyyy"));
const courses = computed(() =>
  item.courses.map((item) => item.name).join(", ")
);
const detailUrl = computed(() => `/library/details/${item.id}`);
const imgUrl = computed(() => item?.cover?.url);
const isOnline = computed(() => item?.isOnline);
const collectionCode = computed(() => item?.collection?.code);
const familiarizeTime = computed(() => item.familiarizeTime);
const viewCount = computed(() => item.viewCount);
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  min-height: 480px;
  padding: 8px 8px 16px 8px;
  border-radius: 24px;
  border: 1px solid #dddee0;
  background: #fff;
  transition: 0.3s border ease-out;

  &:not(.card-theme_list) {
    &:hover {
      border-color: #b4b4b4;
    }
  }
}

.card-theme_list {
  min-height: 114px;
  padding: 16px 16px 32px 194px;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;

  .card-online {
    bottom: auto;
    left: auto;
    right: 16px;
    top: 16px;
  }

  .card-image {
    width: 144px;
    height: 92px;
    position: absolute;
    top: 16px;
    left: 16px;
  }

  .card-content {
    padding: 8px 0 0 0;
    max-width: 768px;

    p {
      color: #0c1524;
    }
  }

  .card-bottom {
    padding: 0;
    max-width: 768px;
  }
}

.card-image {
  height: 188px;
  position: relative;
}

.card-online {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.2px;
  border-radius: 63px;
  position: absolute;
  bottom: 4px;
  left: 4px;
  color: #fff;
  background: #21bd4f;
}

.card-content {
  padding: 12px 8px;

  p {
    color: #93979e;
    font-size: 16px;
    font-weight: 400;
    line-height: 140%;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}

.card-title {
  color: #0c1524;
  font-size: 18px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
}

.card-bottom {
  padding: 0 8px;
  margin-top: auto;
}

.card-bottom-list {
  display: flex;
  gap: 12px;
  white-space: nowrap;
}

.card-list-item {
  color: #93979e;
  font-size: 14px;

  &-courses {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card-familiarize-time {
  .svg-icon {
    margin-right: 4px;
  }
}
</style>
