import { max } from 'date-fns';
<template>
  <div class="learn-playful">
    <div class="container">
      <div class="learn-playful-header text-center">
        <h3 class="mb-3">Учись в игровой форме</h3>
        <p>
          Выполняй задания, получай награды, набирай очки опыта
          <br />и&nbsp;переходи на следующие уровни. Подготовка к экзамену может
          <br />быть еще и&nbsp;увлекательной!
        </p>
      </div>
      <div class="learn-playful-box">
        <div class="learn-playful-card text-center">
          <div class="learn-playful-card__image">
            <img
              src="~/assets/images/explorer-discoverer-magnifying-glass-white-backgro1.jpg"
            />
          </div>
          <h5 class="learn-playful-card__title">Исследователь</h5>
          <p>
            Узнали о новом для себя сервисе, который поможет в&nbsp;подготовке к
            экзаменам
          </p>
          <div class="learn-playful-card__date">{{ getTodayDate }} г.</div>
        </div>
      </div>
      <div class="button text-center">
        <div class="btn btn-primary" v-tooltip="lockTpOpts"> Начать сейчас</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru/index.js';
import useUserStore from '~/stores/user';

const store = useUserStore();
const logged = computed(() => store.logged);
const isStudent = computed(() => store.userIsStudent);

const getTodayDate = computed(() => {
  return format(new Date(), 'd MMMM y', { locale: ruLocale });
});

const lockTpOpts = computed(() => {
  return {
    title: () => {
      if (!logged.value) {
        return 'Для авторизованных пользователей';
      }
      if (!isStudent.value) {
        return 'Для обучающихся';
      }
    }
  };
});
</script>

<style lang="scss" scoped>
.learn-playful {
  margin-bottom: 80px;
}

.learn-playful-header {
  max-width: 598px;
  margin: 0 auto 48px;
}

.learn-playful-box {
  max-width: 1040px;
  margin: 0 auto;
  padding: 32px;
  display: flex;
  justify-content: center;
  border-radius: 24px;
  background: #d0ece7;
  margin-bottom: 48px;
}

.learn-playful-card {
  width: 296px;
  position: relative;
  overflow: hidden;
  padding: 0 16px 24px 16px;
  background: #fff;
  border-radius: 24px;

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 140%; /* 22.4px */
  }

  &__title {
    font-size: 24px;
  }

  &__image {
    img {
      max-width: 100%;
    }
  }

  &__date {
    color: #93979e;
    font-size: 14px;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 0.2px;
  }
}

.button {
  .btn {
    padding: 16px 32px;
    border-radius: 12px;
  }
}
</style>
