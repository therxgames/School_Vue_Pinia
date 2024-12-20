<template>
  <div class="major-assistant">
    <h2 class="mb-0 text-center major-assistant-title">О помощнике ученика</h2>

    <div class="major-assistant-slider">
      <swiper
        v-if="swiperInit"
        :modules="modules"
        :init="false"
        :slides-per-view="1.03"
        navigation
        :pagination="{ clickable: true }"
        :centeredSlides="true"
      >
        <swiper-slide>
          <video class="swiper-slide-video" controls muted>
            <source
              src="~/public/video/major_video.mp4#t=1"
              type="video/mp4"
            />
          </video>
        </swiper-slide>

        <swiper-slide>
          <video class="swiper-slide-video" controls muted>
            <source
            src="~/public/video/major_video.mp4#t=1"
              type="video/mp4"
            />
          </video>
        </swiper-slide>

        <swiper-slide>
          <video class="swiper-slide-video" controls muted>
            <source
              src="~/public/video/major_video.mp4#t=1"
              type="video/mp4"
            />
          </video>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";

const modules = [Pagination, Navigation];
const swiperInit = ref(false);

onMounted(() => {
  swiperInit.value = true;
});
</script>

<style lang="scss">
@import "/assets/scss/theme";

.major-assistant {
  padding: 80px 0;
  background: #f0f2fc;
  min-height: 630px;

  &-title {
    margin-bottom: 0;
    max-width: 1040px;
    margin: 0 auto;
    font-size: 38px;
  }
}

.major-assistant-slider {
  .swiper {
    padding: 32px 0 45px 0;

    &-pagination-bullets {
      bottom: 0;
    }

    &-slide-video {
      border-radius: 24px;
      width: 1040px;
      height: 489px;
      object-fit: cover;
    }

    &-pagination {
      display: flex;
      align-items: center;
      justify-content: center;

      &-bullet {
        width: 6px;
        height: 6px;
        background: #000;
        opacity: 1;

        &-active {
          width: 10px;
          height: 10px;
          background: transparent;
          border: 1px solid #000;
        }
      }
    }

    &-button-next,
    &-button-prev {
      width: 72px;
      height: 72px;
      background: #fff;
      border-radius: 50%;

      &::after {
        width: 20px;
        height: 18px;
        font-family: inherit;
        font-size: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        font-variant: initial;
        line-height: inherit;
      }
    }

    &-button-next {
      right: 80px;

      &::after {
        content: url("~/assets/icons/arrow-right-md.svg");
      }
    }

    &-button-prev {
      left: 80px;

      &::after {
        content: url("~/assets/icons/arrow-left-md.svg");
      }
    }

    &-slide-active {
      text-align: center;
    }

    &-slide-prev {
      text-align: right;
    }

    &-button-disabled {
      display: none;
    }
  }
}
</style>
