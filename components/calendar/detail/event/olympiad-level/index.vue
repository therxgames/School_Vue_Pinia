<template>
  <div class="olympiad-level d-flex align-items-center position-relative gap-3">
    <div class="d-grid gap-1 flex-grow-1">
      <div class="olympiad-level-title mb-0">{{ toRoman(level) }} уровень</div>
      <div>Входит в перечень Минобрнауки</div>
    </div>

    <component class="olympiad-level-image" :is="BlazonGoldImage" />

    <svg-icon class="question-gray" name="question-gray" @click="() => showModal = true" />

    <modal v-if="showModal" :is-show="showModal" @close="() => showModal = false">
      <template v-slot:title>
        Уровень олимпиад и на что он влияет
      </template>

      <template v-slot:body>
        <div class="olympiad-modal-body">
          <p>Существует 3 уровня олимпиад. Уровень олимпиады определяется количеством и географией участников.</p>

          <div>
            <h4>Олимпиада I уровня</h4>
            <p>
              В олимпиаде ежегодно (на протяжении 2 и более лет) принимают участие не менее 3000 школьников из 20 и
              более регионов РФ.
            </p>
          </div>

          <div>
            <h4>Олимпиада II уровня</h4>
            <p>
              В олимпиаде ежегодно (на протяжении 2 и более лет) принимают участие не менее 1500 школьников из 10 и
              более регионов РФ.
            </p>
          </div>

          <div>
            <h4>Олимпиада III уровня</h4>
            <p>
              В олимпиаде ежегодно (на протяжении 2 и более лет) принимают участие не менее 300 школьников из 3 и более
              регионов РФ.
            </p>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { toRoman } from '@/utils/utils';
import BlazonGoldImage from '@/assets/images/blazon-gold.svg';
import Modal from '@/components/modal.vue';

const props = defineProps({
  level: {
    type: Number,
  },
});

const showModal = ref(false);
</script>

<style lang="scss" scoped>
.olympiad {
  &-level {
    padding: 1rem;
    padding-inline-end: 1.5rem;
    background-image: linear-gradient(98deg, #fff4db 1.15%, #fff6df 42.86%, #fff7e5 99.16%);
    border-radius: 1rem;

    &-title {
      font-weight: 500;
      font-size: 1.5rem;
      line-height: 2rem;
      color: rgb(66, 73, 85);
    }

    &-image {
      width: 5rem;
      height: 5rem;
      flex-shrink: 0;
    }
  }

  &-modal-body {
    gap: 2rem;
    display: grid;

    p {
      font-size: 18px;
      line-height: 28px;
      margin-bottom: 0;
    }

    h4 {
      font-size: 32px;
      font-weight: 500;
    }
  }
}

.question-gray {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  flex-shrink: 0;
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  cursor: pointer;
  color: transparent;
}
</style>
  