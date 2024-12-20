<template>
  <nuxt-link
    class="card"
    :class="{ 'card-theme_list': listMode }"
    :to="detailUrl"
  >
    <div class="card-image">
      <ProjectsCardsItemCover type="bcok" />
    </div>
    <div class="card-content" :class="{ 'card-content-hover': !listMode }">
      <div class="card-title">{{ item.title }}</div>
      <p>{{ item.collection.title }}</p>
    </div>
    <div class="card-bottom">
      <div class="card-date">{{ date }}</div>
      <div class="card-bottom-list">
        <common-tag
          v-for="(tag, index) in [{ name: 'Лаборатория' }]"
          :key="index"
          :data="tag"
          :outline="true"
          :noHover="true"
        />
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import { formatDateByMask } from "~/utils/format-date";
const { item, listMode } = defineProps<{ item: any; listMode: any }>();

const classes = computed(() =>
  item.classes.map((item) => item.name).join(", ")
);
const date = computed(() => formatDateByMask(item.publishedAt, "dd.MM.yyyy"));
const courses = computed(() =>
  item.courses.map((item) => item.name).join(", ")
);
const detailUrl = computed(() => `/library/details/${item.id}`);
const isOnline = computed(() => item?.project?.isOnline);
const familiarizeTime = computed(() => item.familiarizeTime);
</script>

<style lang="scss" scoped>
.card {
  border: none;
  position: relative;
  min-height: 480px;
  padding: 8px 8px 16px 8px;
  border-radius: 24px;
  background: #fff;

  &:not(.card-theme_list) {
    &:hover {
      .card-content-hover {
        opacity: 1;
      }
    }
  }
}

.card-content-hover {
  position: absolute;
  inset: 0;
  padding: 32px;
  border-radius: 24px;
  background: #fff;
  opacity: 0;
  z-index: 2;
  border: 1px solid #dddee0;
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1);
  transition: 0.3s opacity ease-out;
}

.card-image {
  position: absolute;
  inset: 0;
}

.card-content {
  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 140%;
  }
}

.card-title {
  color: #0c1524;
  font-size: 20px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
  transition: .3s color ease-out;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
}

.card-bottom {
  padding: 0 8px;
  margin-top: auto;
  position: relative;
}

.card-bottom-list {
  display: flex;
  gap: 12px;
}

.card-list-item {
  color: #93979e;
  font-size: 14px;
}

.card-date {
  font-size: 16px;
  font-weight: 400;
  line-height: 160%;
  margin-bottom: 8px;
}

.card-theme_list {
  min-height: 232px;
  padding: 24px 16px 32px 209px;
  border-radius: 0;
  border-top: 1px solid #dddee0;

  &:hover {
    .card-title {
      color: #1B59F5;
    }
  }

  .card-image {
    width: 161px;
    height: 232px;
    position: absolute;
    top: 16px;
    left: 16px;
    right: auto;
    bottom: auto;
  }

  .card-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 165%;
    letter-spacing: -0.2px;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  .card-bottom {
    padding: 0;
    margin-top: 0;
  }

  .card-date {
    color: #93979E;
    font-size: 14px;
  }
}
</style>
