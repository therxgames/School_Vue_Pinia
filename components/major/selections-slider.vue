<template>
  <div class="interesting-materials" :class="interestingMaterialsClass" v-if="selections.length > 0">
    <div class="container">
      <div class="interesting-materials-header">
        <div class="interesting-materials-header__aside">
          <h3 class="mb-3 interesting-materials-header__aside-title">{{ title }}</h3>
        </div>
        <div class="interesting-materials-header__controls"  v-if="selections.length > 1">
          <div class="slider-nav">
            <div
              :class="`slider-pagination js-${uniqueId}MaterialsPagination`"
            ></div>
            <div :class="`slider-button-prev js-${uniqueId}MaterialsPrev`"></div>
            <div :class="`slider-button-next js-${uniqueId}MaterialsNext`"></div>
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
            prevEl: `.js-${uniqueId}MaterialsPrev`,
            nextEl: `.js-${uniqueId}MaterialsNext`,
          }"
          :pagination="{
            clickable: true,
            el: `.js-${uniqueId}MaterialsPagination`,
          }"
          :space-between="15"
        >
          <swiper-slide v-for="(item, index) in selections">
            <div class="interesting-materials-content" :class="{'flex-row-reverse': rowReverse,}">
              <div class="banner" :class="bannerClass">
                <div class="banner-label">Подборка</div>
                <div class="banner-title">
                  {{ item.title }}
                </div>
              </div>
      
              <div class="cards-grid">
                <slot :slideIndex="index" />
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";
import { uuid } from 'vue-uuid';

const uniqueId = uuid.v1();

const modules = [Pagination, Navigation];
const swiperInit = ref(false);

const interestingMaterialsClass = computed(() => props.rowReverse ? 'interesting-materials-white' : 'interesting-materials-gray');
const bannerClass = computed(() => props.rowReverse ? 'banner-gray' : 'banner-white');

onMounted(async () => {
  swiperInit.value = true;
});

const props = defineProps({
  selections: {
    type: Array,
  },
  title: {
    type: String,
    required: true,
  },
  rowReverse: {
    type: Boolean,
  },
});
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";

.interesting-materials {
  padding: 80px 0;

  &-white {
    background-color: #FFF;
  }

  &-gray {
    background-color: #f0f2fc;
  }
}

.banner {
  &-white {
    background: #FFF;
  }

  &-gray {
    background: #F3F3F1;
  }
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
}

.banner-label {
  font-size: 18px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.2px;
  margin-bottom: 8px;
}

.banner-title {
  font-size: 38px;
  font-weight: 500;
  line-height: 112%;
  letter-spacing: -0.4px;
}

.slider-nav {
  display: flex;
  position: relative;
}
</style>
