<template>
  <nuxt-layout name="default">
    <div class="gradient-bg"/>
    <div
      ref="container"
      class="page-index page-default content-container">
      <h1
        class="page-index-header">
        Твой сервис самоподготовки к ВПР и ОГЭ
      </h1>
      <div
        class="page-index-intro">
        Образовательная платформа для  5—9 классов <br>
        с индивидуальной траекторией подготовки к экзаменам
      </div>
      <div class="page-index-sections">
        <div
          v-for="(section, index) in pageData"
          :key="index"
          class="page-index-sections-container">
          <div
            :class="sectionClasses(section)"
            @mouseenter="sectionOnMouseEnter(section)"
            @mouseleave="sectionOnMouseleave(section)"
            class="page-index-sections-item">
            <h2 class="page-index-sections-item-title">
              <span
                class="page-index-sections-item-title-text"
                v-html="section.title"/>
              <svg-icon
                v-tooltip="lockTpOpts"
                class="page-index-sections-item-title-lock"
                name="lock"/>
            </h2>
            <div class="page-index-sections-item-desc">
              <div
                class="page-index-sections-item-desc-text"
                v-html="section.desc"/>
              <div
                class="page-index-sections-item-desc-text-shadow"
                v-html="section.desc"/>
            </div>
            <div class="page-index-sections-item-footer">
              <span class="page-index-sections-item-footer-cat">{{ section.category }}</span>
              <div class="page-index-sections-item-footer-icon">
                <svg-icon
                  class="page-index-sections-item-footer-logo"
                  :name="section.logo"/>
                <svg-icon
                  class="page-index-sections-item-footer-go"
                  name="arrow-right-md"/>
              </div>
            </div>
            <div class="page-index-sections-item-bg">
              <div class="page-index-sections-item-bg-c1"/>
              <div class="page-index-sections-item-bg-c2"/>
              <div class="page-index-sections-item-bg-c3"/>
            </div>
            <nuxt-link
              class="page-index-sections-item-link"
              v-if="sectionAllowed(section)"
              :to="section.to"/>
            <div
              class="page-index-sections-item-link"
              v-else-if="!logged"
              @click="loginAttempt"/>
          </div>
        </div>
      </div>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import gsap from 'gsap';

  const store = useUserStore();
  const logged = computed(() => store.logged);
  const sectionClasses = computed(() => {
    return (section) => ([
      sectionAllowed.value(section) ? 'allowed' : 'locked',
      `section-${section.id}`]);
  });
  const sectionAllowed = computed(() => {
    return (section) => {
      if (section.role) {
        return logged.value && store[section.role];
      }
      return useUserStore().logged || section.checkLogged === false;
    };
  });
  const lockTpOpts = computed(() => {
    return {
      title: () => {
        if (!store.logged) {
          return 'Для авторизованных пользователей';
        }
        if (!store.userIsStudent) {
          return 'Для обучающихся';
        }
      }
    };
  });
  const container = ref(null);
  const gsapHoverAllow = ref(true);
  const pageData = ref([
    {
      id: 1,
      title: 'Демоварианты <br>ОГЭ и ВПР',
      category: 'Подготовка',
      desc: 'Изучай демоварианты прошлых лет, выполняй тесты из верифицированных заданий. Помечай интересные темы, получай больше полезных рекомендаций',
      logo: 'sc-1',
      checkLogged: false,
      role: null,
      to: '/training'
    },
    {
      id: 2,
      title: 'Статистика <br>и достижения',
      category: 'Достижения',
      desc: 'Помощник учитывает правильность и скорость выполнения заданий, автоматически подбирает учебные материалы. Корректирует траекторию обучения для восполнения недостающих знаний',
      logo: 'sc-2',
      checkLogged: true,
      role: 'userIsStudent',
      to: '/results'
    },
    {
      id: 3,
      title: 'Верифицированные <br>задания',
      category: 'Банк заданий',
      desc: 'Выполняй задания, оценивай ответы, совершенствуй знания по рекомендациям помощника, следи за историей своих результатов',
      logo: 'sc-3',
      checkLogged: false,
      role: null,
      to: '/library/tasks'
    },
    {
      id: 4,
      title: 'Уникальные <br>тесты',
      category: 'Мои тесты',
      desc: 'Создавай тематические тесты любой сложности, получай удобный инструмент для тренировки конкретных тем',
      logo: 'sc-4',
      checkLogged: true,
      role: 'userIsStudent',
      to: '/training/create-task'
    }
  ]);

  onBeforeMount(() => {
    preloadComponents('HelperAlertContentLoginAttempt');
  });
  onMounted(async () => {
    await nextTick();
    await calculateHeights();
  });

  const animateIn = async () => {
    const header = container.value.querySelector('.page-index-header');
    const intro = container.value.querySelector('.page-index-intro');
    const sections = container.value.querySelectorAll('.page-index-sections-item');
    const sectionTitles = container.value.querySelectorAll('.page-index-sections-item-title-text');
    const sectionBgs = container.value.querySelectorAll('.page-index-sections-item-bg');

    gsap.fromTo([header, intro], {
      transformOrigin: '50% 50%',
      y: 20
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.3,
      duration: 0.8
    });
    gsap.fromTo(sections, {
      transformOrigin: '50% 50%',
      y: 10
    }, {
      y: 0,
      scale: 1,
      opacity: 1,
      stagger: 0.3,
      duration: 0.8,
      delay: 0.6,
      onComplete() {
        gsapHoverAllow.value = true;
      }
    });
    gsap.fromTo(sectionTitles, {
      x: 5
    }, {
      x: 0,
      opacity: 1,
      stagger: 0.3,
      duration: 0.8,
      delay: 0.6
    });
    [...sectionBgs].map((bg) => {
      const bgC1 = bg.querySelector('.page-index-sections-item-bg-c1');
      const bgC2 = bg.querySelector('.page-index-sections-item-bg-c2');
      const bgC3 = bg.querySelector('.page-index-sections-item-bg-c3');
      gsap.fromTo([bgC1, bgC2, bgC3], {
        scale: 0.5
      }, {
        scale: 1,
        opacity: 1,
        stagger: 0.5,
        duration: 1.5,
        delay: 0.6
      });
    });
  };
  const calculateHeights = () => {
    const sectionContainer = container.value.querySelectorAll('.page-index-sections-item');
    const textsShadows = container.value.querySelectorAll('.page-index-sections-item-desc-text-shadow');
    const maxHeight = Math.max(...[...textsShadows].map((el) => el.offsetHeight));
    [...sectionContainer].map((section) => {
      const desc = section.querySelector('.page-index-sections-item-desc-text');
      const descShadows = section.querySelector('.page-index-sections-item-desc-text-shadow');
      desc.dataset.expanded = maxHeight.toString();
      desc.dataset.collapsed = desc.offsetHeight;
      section.dataset.expanded = section.offsetHeight + (maxHeight / 2) - 32 + '';
      section.dataset.collapsed = section.offsetHeight;
    });
  };
  const sectionOnMouseEnter = (section) => {
    if (!gsapHoverAllow.value) {
      return;
    }
    const sectionContainer = container.value.querySelector(`.section-${section.id}`);
    const sectionDesc = sectionContainer.querySelector('.page-index-sections-item-desc-text');
    const sectionDescShadow = sectionContainer.querySelector('.page-index-sections-item-desc-text-shadow');
    const sectionBg = sectionContainer.querySelectorAll(`.page-index-sections-item-bg > div`);
    gsap.to(sectionDesc, {
      duration: 0.1,
      opacity: 0
    });
    gsap.to(sectionDescShadow, {
      duration: 0.1,
      opacity: 1
    });
    gsap.to(sectionContainer, {
      duration: 0.3,
      height: sectionContainer.dataset.expanded
    });
    gsap.to(sectionBg, {
      opacity: 0,
      duration: 0.2
    });
  };
  const sectionOnMouseleave = (section) => {
    if (!gsapHoverAllow.value) {
      return;
    }
    const sectionContainer = container.value.querySelector(`.section-${section.id}`);
    const sectionDesc = sectionContainer.querySelector('.page-index-sections-item-desc-text');
    const sectionDescShadow = sectionContainer.querySelector('.page-index-sections-item-desc-text-shadow');
    const sectionBg = sectionContainer.querySelectorAll(`.page-index-sections-item-bg > div`);
    gsap.to(sectionDesc, {
      duration: 0.1,
      opacity: 0
    });
    gsap.to(sectionDescShadow, {
      duration: 0.1,
      opacity: 0
    });
    gsap.to(sectionContainer, {
      duration: 0.3,
      height: sectionContainer.dataset.collapsed
    });
    gsap.to(sectionBg, {
      opacity: 1,
      duration: 0.2
    });
  };
  const loginAttempt = () => {
    eventBus.emit('alert:show', {
      title: 'Авторизация',
      contentComponent: 'helperAlertContentLoginAttempt',
      maxWidth: '400px',
      hideAllButtons: true
    });
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-index {
    padding-top: 4rem;

    &-header {
      font-weight: 500;
      text-align: center;
    }

    &-intro {
      color: #7f838a;
      font-size: 1.125rem;
      text-align: center;
      max-width: 35rem;
      margin: 0.5rem auto 0;
    }

    &-sections {
      margin-top: 4.5rem;
      margin-bottom: 4.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      height: 17.5rem;

      &-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &-item {
        position: absolute;
        overflow: hidden;
        cursor: pointer;
        width: 100%;
        max-width: 18.875rem;
        min-height: 17.5rem;
        margin: 0 auto;
        padding: 1.5rem;
        border-radius: 1.5rem;
        box-shadow: 0 8px 16px 0 #91b1f01a;
        display: grid;
        grid-template-rows: max-content 1fr max-content;
        user-select: none;
        background: #fff;
        border: 1px solid $color-black-10;

        &.allowed:hover &-footer {
          &-logo {
            transform: translateX(10px) scale(0.9);
            opacity: 0;
          }

          &-go {
            opacity: 1;
            transform: translateX(0);
          }

          &-cat {
            color: $color-blue-normal;
          }
        }

        &:hover &-title {
          &-lock {
            color: $color-black;
          }
        }

        &.locked &-title {
          &-lock {
            opacity: 1;
            pointer-events: auto;
          }
        }

        &.allowed &-title {
          &-lock {
            opacity: 0;
            pointer-events: none;
          }
        }

        &-title {
          font-size: 1.25rem;
          font-weight: 500;
          line-height: 140%;
          margin: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          &-lock {
            color: $color-normal;
            top: 0.5rem;
            position: relative;
            z-index: 10;
            width: 0.813rem;
            margin-top: -0.25rem;
          }
        }

        &-desc {
          position: relative;
          padding: 1rem 0;

          &-text {
            opacity: 0;
            height: 7.5rem;
            overflow: hidden;
          }

          &-text-shadow {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            top: 0;
            left: 0;
            padding: 1rem 0;
          }
        }

        &-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          &-cat {
            transition: all 350ms ease-out;
            font-size: 0.875rem;
          }

          &-icon {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;

            .svg-icon-default {
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }

          &-logo {
            transform-origin: center center;
            transition: all 150ms ease-out;
          }

          &-go {
            opacity: 0;
            transform: translateX(-10px);
            transition: all 150ms ease-out;
            color: $color-blue-normal;
            padding: 0.15rem;
          }
        }

        &-bg {
          width: 12.625em;
          height: 12.625em;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          right: -4rem;
          bottom: -3.8rem;

          &-c1 {
            position: absolute;
            border-radius: 100%;
            width: 12.625em;
            height: 12.625em;
            box-shadow: 0 25px 50px #ecf4f7;
          }

          &-c2 {
            position: absolute;
            border-radius: 100%;
            width: 9.063em;
            height: 9.063em;
            box-shadow: 0 25px 50px #ecf4f7;
          }

          &-c3 {
            position: absolute;
            border-radius: 100%;
            width: 5.625em;
            height: 5.625em;
            box-shadow: 0 25px 50px #ecf4f7;
          }
        }

        &-link {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 5;
        }

        &.section-1 &-footer {
          &-icon {
            color: #0576ff;
          }
        }

        &.section-2 &-footer {
          &-icon {
            color: #f87342;
          }
        }

        &.section-3 &-footer {
          &-icon {
            color: #3db45a;
          }
        }

        &.section-4 &-footer {
          &-icon {
            color: #9e52ff;
          }
        }
      }
    }
  }
</style>
