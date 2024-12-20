<template>
  <div class="interesting-materials">
    <div class="container">
      <div class="interesting-materials-header">
        <div class="interesting-materials-header__aside">
          <h3 class="mb-3 interesting-materials-header__aside-title">Расширяй свой кругозор</h3>
          <p class="interesting-materials-header__aside-content">
            Изучай дополнительные материалы в Библиотеке цифрового
            образовательного контента, узнавай <br />новое, восполняй
            недостающие знания
          </p>
        </div>
        <div class="interesting-materials-header__controls">
          <div class="slider-nav">
            <div
              class="slider-pagination js-interestingMaterialsPagination"
            ></div>
            <div class="slider-button-prev js-interestingMaterialsPrev"></div>
            <div class="slider-button-next js-interestingMaterialsNext"></div>
          </div>
        </div>
      </div>
      <div class="interesting-materials-swiper">
        <swiper
          v-if="swiperInit"
          :modules="modules"
          :init="false"
          :slides-per-view="1"
          :navigation="{
            prevEl: '.js-interestingMaterialsPrev',
            nextEl: '.js-interestingMaterialsNext',
          }"
          :pagination="{
            clickable: true,
            el: '.js-interestingMaterialsPagination',
          }"
          :space-between="15"
        >
          <swiper-slide>
            <div class="interesting-materials-content">
              <div class="banner">
                <div class="banner-label">Подборка</div>
                <div class="banner-title">
                  Исторические хроники: от древних цивилизаций до современности
                </div>
              </div>
              <div class="cards-grid">
                <MaterialsCardsItem
                  v-for="item in cards"
                  :key="item.id"
                  :item="item"
                  :listMode="false"
                />
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="interesting-materials-content">
              <div class="banner">
                <div class="banner-label">Подборка</div>
                <div class="banner-title">
                  Исторические хроники: от древних цивилизаций до современности
                </div>
              </div>
              <div class="cards-grid">
                <MaterialsCardsItem
                  v-for="item in cards"
                  :key="item.id"
                  :item="item"
                  :listMode="false"
                />
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
    id: 177,
    createdAt: "2023-12-01T11:14:30Z",
    updatedAt: "2023-12-01T11:22:47Z",
    state: "PUBLISHED",
    title: 'Курс "Карьерная грамотность"',
    description:
      "<p>Добро пожаловать на курс &ldquo;Карьерная грамотность&rdquo;! Здесь вы получите все необходимые инструменты и знания для успешного старта и развития вашей карьеры. Мы поможем вам осознать свои профессиональные цели, научиться составлять эффективное резюме, подготовиться к прохождению собеседований и научиться работать в команде.</p>\r\n\r\n<p>Курс &ldquo;Карьерная грамотность&rdquo; состоит из 4 модулей:</p>\r\n\r\n<ol>\r\n\t<li>\r\n\t<p>Самоанализ и определение профессиональных целей. Этот модуль посвящен самопознанию и определению своих сильных и слабых сторон, а также ваших профессиональных интересов и предпочтений. Вы узнаете, как составить свой профессиональный портрет и определить свои карьерные цели.</p>\r\n\t</li>\r\n\t<li>\r\n\t<p>Создание резюме и сопроводительного письма. В этом модуле вы научитесь составлять эффективное и привлекательное резюме, которое подчеркнет ваши профессиональные достижения и навыки. Также мы научим вас составлять сопроводительное письмо, которое поможет вам выделиться среди других кандидатов и продемонстрировать вашу мотивацию на работу.</p>\r\n\t</li>\r\n\t<li>\r\n\t<p>Подготовка к собеседованию. На этом этапе вы научитесь проходить собеседование и задавать правильные вопросы, чтобы получить желаемую работу. Вы освоите техники активного слушания, научитесь задавать вопросы, которые помогут вам узнать больше о компании и понять, подходит ли она вам.</p>\r\n\t</li>\r\n</ol>\r\n\r\n<blockquote>\r\n<p>&ldquo;Карьерная грамотность - это ключ к успеху в мире работы. Этот курс поможет вам получить все необходимые навыки для успешного старта и продвижения в карьере.&rdquo;</p>\r\n</blockquote>\r\n\r\n<p></p>\r\n\r\n<p>Карьерная грамотность &ndash; это не просто курс, это ваш путеводитель в мире успешной карьеры. Он поможет вам определить свои цели, развить необходимые навыки и достичь успеха в выбранной профессии.</p>",
    collection: {
      id: 3,
      title: "Электронные статьи",
      code: "article",
      isProject: false,
    },
    publishedAt: "2023-12-01T11:22:47Z",
    supplier: {
      id: 3,
      title: "Минпросвещения РФ",
      shortTitle: "Минпросвещения РФ",
      logo: null,
    },
    isPaid: false,
    isOnline: true,
    familiarizeTime: 45,
    url: "https://www.yandex.ru/",
    descriptionUrl: "https://www.yandex.ru/",
    files: [
      {
        filename:
          "1646281235_4-sportishka-com-p-tapiola-turizm-krasivo-foto-4.jpg",
        url: "https://cms.cp.srvdev.ru/api/media/download/117",
        size: 404479,
      },
    ],
    generalEducationLevels: [{ id: 1, title: "Основное общее образование" }],
    topics: [],
    cover: {
      filename: "d620a394f14eddac2b92d7d9b9da72d2.jpeg",
      url: "/images/134.jpeg",
      size: 617288,
      isTextbook: true,
      width: 2560,
      height: 1600,
      alt: "карьера",
    },
    holdForms: [{ code: "remote", name: "Дистанционный формат" }],
    roles: [
      { code: "teacher", name: "Педагог" },
      { code: "student", name: "Обучающийся" },
      { code: "parent", name: "Законный представитель" },
    ],
    classes: [
      { code: "class12", name: "Класс 12", number: 12 },
      { code: "class11", name: "Класс 11", number: 11 },
      { code: "class10", name: "Класс 10", number: 10 },
      { code: "class9", name: "Класс 9", number: 9 },
      { code: "class8", name: "Класс 8", number: 8 },
      { code: "class7", name: "Класс 7", number: 7 },
      { code: "class6", name: "Класс 6", number: 6 },
      { code: "class5", name: "Класс 5", number: 5 },
      { code: "class4", name: "Класс 4", number: 4 },
      { code: "class3", name: "Класс 3", number: 3 },
      { code: "class2", name: "Класс 2", number: 2 },
      { code: "class1", name: "Класс 1", number: 1 },
    ],
    courses: [
      { code: "95", name: "Русский язык" },
      { code: "279", name: "Изобразительное искусство" },
      { code: "505", name: "Второй иностранный язык" },
      { code: "516", name: "Вероятность и статистика" },
      { code: "276", name: "Английский язык" },
    ],
    minAge: 6,
    project: null,
  },
  {
    id: 178,
    createdAt: "2023-12-01T11:14:30Z",
    updatedAt: "2023-12-01T11:22:47Z",
    state: "PUBLISHED",
    title: 'Курс "Карьерная грамотность"',
    description:
      "<p>Добро пожаловать на курс &ldquo;Карьерная грамотность&rdquo;! Здесь вы получите все необходимые инструменты и знания для успешного старта и развития вашей карьеры. Мы поможем вам осознать свои профессиональные цели, научиться составлять эффективное резюме, подготовиться к прохождению собеседований и научиться работать в команде.</p>\r\n\r\n<p>Курс &ldquo;Карьерная грамотность&rdquo; состоит из 4 модулей:</p>\r\n\r\n<ol>\r\n\t<li>\r\n\t<p>Самоанализ и определение профессиональных целей. Этот модуль посвящен самопознанию и определению своих сильных и слабых сторон, а также ваших профессиональных интересов и предпочтений. Вы узнаете, как составить свой профессиональный портрет и определить свои карьерные цели.</p>\r\n\t</li>\r\n\t<li>\r\n\t<p>Создание резюме и сопроводительного письма. В этом модуле вы научитесь составлять эффективное и привлекательное резюме, которое подчеркнет ваши профессиональные достижения и навыки. Также мы научим вас составлять сопроводительное письмо, которое поможет вам выделиться среди других кандидатов и продемонстрировать вашу мотивацию на работу.</p>\r\n\t</li>\r\n\t<li>\r\n\t<p>Подготовка к собеседованию. На этом этапе вы научитесь проходить собеседование и задавать правильные вопросы, чтобы получить желаемую работу. Вы освоите техники активного слушания, научитесь задавать вопросы, которые помогут вам узнать больше о компании и понять, подходит ли она вам.</p>\r\n\t</li>\r\n</ol>\r\n\r\n<blockquote>\r\n<p>&ldquo;Карьерная грамотность - это ключ к успеху в мире работы. Этот курс поможет вам получить все необходимые навыки для успешного старта и продвижения в карьере.&rdquo;</p>\r\n</blockquote>\r\n\r\n<p></p>\r\n\r\n<p>Карьерная грамотность &ndash; это не просто курс, это ваш путеводитель в мире успешной карьеры. Он поможет вам определить свои цели, развить необходимые навыки и достичь успеха в выбранной профессии.</p>",
    collection: {
      id: 3,
      title: "Электронные статьи",
      code: "article",
      isProject: false,
    },
    publishedAt: "2023-12-01T11:22:47Z",
    supplier: {
      id: 3,
      title: "Минпросвещения РФ",
      shortTitle: "Минпросвещения РФ",
      logo: null,
    },
    isPaid: false,
    isOnline: true,
    familiarizeTime: 45,
    url: "https://www.yandex.ru/",
    descriptionUrl: "https://www.yandex.ru/",
    files: [
      {
        filename:
          "1646281235_4-sportishka-com-p-tapiola-turizm-krasivo-foto-4.jpg",
        url: "https://cms.cp.srvdev.ru/api/media/download/117",
        size: 404479,
      },
    ],
    generalEducationLevels: [{ id: 1, title: "Основное общее образование" }],
    topics: [],
    cover: {
      filename: "d620a394f14eddac2b92d7d9b9da72d2.jpeg",
      url: "/images/134.jpeg",
      size: 617288,
      isTextbook: true,
      width: 2560,
      height: 1600,
      alt: "карьера",
    },
    holdForms: [{ code: "remote", name: "Дистанционный формат" }],
    roles: [
      { code: "teacher", name: "Педагог" },
      { code: "student", name: "Обучающийся" },
      { code: "parent", name: "Законный представитель" },
    ],
    classes: [
      { code: "class12", name: "Класс 12", number: 12 },
      { code: "class11", name: "Класс 11", number: 11 },
      { code: "class10", name: "Класс 10", number: 10 },
      { code: "class9", name: "Класс 9", number: 9 },
      { code: "class8", name: "Класс 8", number: 8 },
      { code: "class7", name: "Класс 7", number: 7 },
      { code: "class6", name: "Класс 6", number: 6 },
      { code: "class5", name: "Класс 5", number: 5 },
      { code: "class4", name: "Класс 4", number: 4 },
      { code: "class3", name: "Класс 3", number: 3 },
      { code: "class2", name: "Класс 2", number: 2 },
      { code: "class1", name: "Класс 1", number: 1 },
    ],
    courses: [
      { code: "95", name: "Русский язык" },
      { code: "279", name: "Изобразительное искусство" },
      { code: "505", name: "Второй иностранный язык" },
      { code: "516", name: "Вероятность и статистика" },
      { code: "276", name: "Английский язык" },
    ],
    minAge: 6,
    project: null,
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

.interesting-materials {
  padding: 80px 0;
  background-color: #f0f2fc;
}

.interesting-materials-swiper {
  .swiper {
    width: 100%;
  }
}

.interesting-materials-header {
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

.interesting-materials-content {
  display: flex;
  gap: 24px;
}

.cards-grid {
  width: 50%;
  display: grid;
  gap: 24px;
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
  background: #fff;
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
