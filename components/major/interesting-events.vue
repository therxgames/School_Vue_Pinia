<template>
  <div class="interesting-events">
    <div class="container">
      <div class="interesting-events-header">
        <div class="interesting-events-header__aside">
          <h3 class="mb-3 interesting-events-header__aside-title">Находи интересные события</h3>
          <p class="interesting-events-header__aside-content">
            «Календарь» поможет быть в курсе событий. Для развития и
            развлечения. Онлайн и офлайн. <br />Региональные и федеральные.
            Выбирай то, что нужно!
          </p>
        </div>
        <div class="interesting-events-header__controls">
          <div class="slider-nav">
            <div class="slider-pagination js-interestingEventsPagination"></div>
            <div class="slider-button-prev js-interestingEventsPrev"></div>
            <div class="slider-button-next js-interestingEventsNext"></div>
          </div>
        </div>
      </div>
      <div class="interesting-events-swiper">
        <swiper
          v-if="swiperInit"
          :modules="modules"
          :init="false"
          :slides-per-view="1"
          :navigation="{
            prevEl: '.js-interestingEventsPrev',
            nextEl: '.js-interestingEventsNext',
          }"
          :pagination="{ clickable: true, el: '.js-interestingEventsPagination' }"
          :space-between="15"
        >
          <swiper-slide>
            <div class="interesting-events-content">
              <div class="cards-grid">
                <calendar-cards-tile-card
                  class="interesting-events-card"
                  v-for="card of cards"
                  :key="card.id"
                  :card="card"
                  display-type="list"
                />
              </div>
              <div class="banner">
                <div class="banner-label">Подборка</div>
                <div class="banner-title">
                  Голоса мира: музыкальные и вокальные конкурсы
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="interesting-events-content">
              <div class="cards-grid">
                <calendar-cards-tile-card
                  class="interesting-events-card"
                  v-for="card of cards"
                  :key="card.id"
                  :card="card"
                  display-type="list"
                />
              </div>
              <div class="banner">
                <div class="banner-label">Подборка</div>
                <div class="banner-title">
                  Голоса мира: музыкальные и вокальные конкурсы
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
const cards = ref([
  {
    id: 188,
    eventType: { id: 8, name: "Олимпиада", code: "olympiad" },
    name: "Всероссийская олимпиада по информатике",
    shortName: null,
    dateStart: "2022-10-24",
    dateEnd: "2023-01-22",
    timeStart: null,
    timeEnd: null,
    timezone: "moscow",
    online: false,
    ageFrom: null,
    ageTo: null,
    hours: null,
    cover: "/images/109.jpeg",
    createdAt: "2023-11-14T17:27:27Z",
    updatedAt: "2023-11-14T22:08:58Z",
    datePublished: "2023-11-14T22:08:58Z",
    olympiadLevel: null,
    favoriteItemId: null,
    inMinistryRegister: false,
    duration: null,
    roles: [
      { code: "student", name: "Обучающийся" },
      { code: "parent", name: "Законный представитель" },
      { code: "teacher", name: "Педагог" },
    ],
    classes: [
      { code: "class10", name: "Класс 10", number: null },
      { code: "class11", name: "Класс 11", number: null },
      { code: "class6", name: "Класс 6", number: null },
      { code: "class7", name: "Класс 7", number: null },
      { code: "class8", name: "Класс 8", number: null },
      { code: "class9", name: "Класс 9", number: null },
      { code: "class5", name: "Класс 5", number: null },
    ],
    courses: [{ code: "280", name: "Информатика" }],
    region: null,
    eventLevel: { name: "Федеральный", code: "federal" },
  },
  {
    id: 186,
    eventType: { id: 8, name: "Олимпиада", code: "olympiad" },
    name: "Всероссийская олимпиада по информатике",
    shortName: null,
    dateStart: "2022-10-24",
    dateEnd: "2023-01-22",
    timeStart: null,
    timeEnd: null,
    timezone: "moscow",
    online: false,
    ageFrom: null,
    ageTo: null,
    hours: null,
    cover: "/images/109.jpeg",
    createdAt: "2023-11-14T17:27:27Z",
    updatedAt: "2023-11-14T22:08:58Z",
    datePublished: "2023-11-14T22:08:58Z",
    olympiadLevel: null,
    favoriteItemId: null,
    inMinistryRegister: false,
    duration: null,
    roles: [
      { code: "student", name: "Обучающийся" },
      { code: "parent", name: "Законный представитель" },
      { code: "teacher", name: "Педагог" },
    ],
    classes: [
      { code: "class10", name: "Класс 10", number: null },
      { code: "class11", name: "Класс 11", number: null },
      { code: "class6", name: "Класс 6", number: null },
      { code: "class7", name: "Класс 7", number: null },
      { code: "class8", name: "Класс 8", number: null },
      { code: "class9", name: "Класс 9", number: null },
      { code: "class5", name: "Класс 5", number: null },
    ],
    courses: [{ code: "280", name: "Информатика" }],
    region: null,
    eventLevel: { name: "Федеральный", code: "federal" },
  },
]);

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";

const modules = [Pagination, Navigation];
const swiperInit = ref(false);

onMounted(() => {
  swiperInit.value = true;
});
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.interesting-events {
  padding: 80px 0;
}

.interesting-events-swiper {
  .swiper {
    width: 100%;
  }
}

.interesting-events-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;

  &__aside {
    max-width: 920px;

    &-title {
      font-size: 32px;
    }

    &-content {
      font-size: 18px;
    }
  }
}

.interesting-events-content {
  display: flex;
  gap: 23px;
}

.interesting-events-card {
  height: 480px;
  min-height: inherit;
}

.cards-grid {
  width: 50%;
  display: grid;
  gap: 23px;
  grid-template-columns: repeat(2, 1fr);

  .card-wrapper {
    width: 100%;
    border: 1px solid rgba(#dddee0, 0.7);
  }
}

.banner {
  width: 50%;
  padding: 32px;
  border-radius: 24px;
  background: #f3f3f1;
  height: 480px;
}

.banner-label {
  font-size: 18px;
  font-weight: 500;
  line-height: 140%; /* 25.2px */
  letter-spacing: -0.2px;
  margin-bottom: 8px;
}

.banner-title {
  font-size: 38px;
  font-weight: 500;
  line-height: 112%; /* 42.56px */
  letter-spacing: -0.4px;
}

.slider-nav {
  display: flex;
  position: relative;
}
</style>
