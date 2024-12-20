<template>
  <nuxt-layout name="default">
    <div class="page-test page-default content-container">
      <nuxt-link
        @click="$router.go(-1)"
        class="page-test-back">
        <svg-icon
          class="page-test-back-icon"
          name="arrow-left"/>
        <span>Назад</span>
      </nuxt-link>
      <div class="d-flex align-items-center mb-4">
        <h1 class="mb-0">
          <router-link
            v-tooltip="{title: 'Перейти к просмотру теста'}"
            :to="testPageLink"
            class="page-test-header-to-test">
            Тест #{{ store.test.id }}
          </router-link>
        </h1>
        <common-test-version-selector
          ref="versionSelector"
          class="page-test-version-selector"
          :current-test-id="+route.params.id"
          :test-parent-id="store.test.parent_id"
          switch-route-name="test-settings-id"
          :publish-allow="false"
          :unpublish-allow="false"/>
      </div>
      <div class="my-4">
        <h4>Редактирование</h4>
        <form
          class="card px-4 mx-auto mt-5 page-test-form"
          style="max-width: 600px;">
          <loader
            :listener="progress"
            class="page-task-loader"/>
          <div class="mt-4">
            <label
              class="form-label"
              :class="[{'error': !element.status_id}]"
              for="title">Публикация</label>
            <input-select-single
              placeholder="Не задана"
              :list="store.getFilterData('publish')"
              v-model:value="element.status_id"/>
          </div>
          <div class="mt-3">
            <label
              class="form-label"
              :class="[{'error': !element.name}]"
              for="table">Название</label>
            <input-simple
              v-model:value="element.name"/>
          </div>
          <div class="mt-3">
            <label
              class="form-label"
              :class="[{'error': !element.attestation}]"
              for="table">Аттестация</label>
            <input-select-single
              placeholder="Не задана"
              :list="store.getFilterData('attestation')"
              v-model:value="element.attestation"/>
          </div>
          <div class="mt-3">
            <label
              class="form-label"
              :class="[{'error': !element.subject_id}]"
              for="table">Предмет</label>
            <input-select-single
              placeholder="Не задан"
              :list="store.getFilterData('subjects')"
              v-model:value="element.subject_id"/>
          </div>
          <div class="mt-3">
            <label
              class="form-label"
              :class="[{'error': !checkClass}]"
              for="table">Класс</label>
            <input-select-single
              placeholder="Не задан"
              :list="classes"
              v-model:value="element.itemClass"/>
          </div>
          <div class="mt-3 mb-4">
            <label
              class="form-label"
              :class="[{'error': !element.year}]"
              for="table">Год</label>
            <input-select-single
              placeholder="Не задан"
              :list="store.getFilterData('years')"
              v-model:value="element.year"/>
          </div>
          <div class="my-3">
            <button
              :class="[{'disabled': !saveAllow}]"
              type="button"
              class="btn btn-primary"
              style="width: 100%;"
              @click="editTest">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useUserStore from '~/stores/user';
  import useTestSettingsStore from '~/stores/test-settings';
  import useCommonStore from '~/stores/common';

  const userStore = useUserStore();
  const store = useTestSettingsStore();
  const router = useRouter();
  const route = useRoute();

  const testPageLink = computed(() => {
    return `/test/${route.params.id}`;
  });

  const versionSelector = ref(null);
  const saveAllow = ref(false);
  const progress = ref(false);

  watch(() => userStore.currentRole, (val) => {
    if (!(userStore.userIsAdmin || userStore.userIsCOSUser)) router.replace('/');
  });

  onMounted(() => {
    eventBus.emit('loader:hide');
  });

  const editTest = async () => {
    progress.value = true;
    const saved = await store.editTest(query.value);
    if (saved) {
      eventBus.emit('toast:show', {text: 'Успешное сохранение'});
      await store.fetch(store.test.id);
      await useCommonStore().resolveFilters(true);
    } else {
      eventBus.emit('toast:show', {text: 'Необходимо заполнить все поля', hideIcon: true});
      await store.fetch(store.test.id);
    }
    versionSelector.value.fetch();
    progress.value = false;
  };

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'test-settings-id') {
      store.$reset();
    }
  });

  await useAsyncData(`test-settings-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id)
  ]));

  const element = reactive({
    updating: store.updating,
    subject: store.test.subject,
    subject_id: store.test.subject_id,
    name: store.test.name,
    status_id: store.test.status_id,
    type: store.test.type,
    attestation: store.test.attestation,
    year: store.test.year,
    itemClass: store.test.parallel_id
  });

  const query = computed(() => {
    return {
      id: store.test.id,
      name: element.name,
      status_id: element.status_id,
      type: element.type,
      attestation: element.attestation,
      year: element.year,
      subject_id: element.subject_id,
      class: checkClass.value
    };
  });

  const checkClass = computed(() => {
    if (element.attestation === 'oge' && element.itemClass === 9) return element.itemClass;
    if (element.attestation === 'vpr' && element.itemClass < 9) return element.itemClass;
    return false;
  });

  const classes = computed(() => {
    if (element.attestation === 'oge') {
      return [{
        name: '9 класс',
        short: '9',
        id: 9
      }];
    } else {
      return [
        {
          name: '5 класс',
          short: '5',
          id: 5
        },
        {
          name: '6 класс',
          short: '6',
          id: 6
        },
        {
          name: '7 класс',
          short: '7',
          id: 7
        },
        {
          name: '8 класс',
          short: '8',
          id: 8
        }
      ];
    }
  });

  watch(
    () => element,
    () => saveAllow.value = true,
    {deep: true}
  );
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-test {
    padding-top: 1.125rem;

    &-back {
      color: $color-dark;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.125rem;
      cursor: pointer;

      &-icon {
        width: 0.313rem;
        height: 0.625rem;
      }
    }

    &-loader {
      --loader-max-opacity: 0.9;

      border-radius: 0.5rem;
    }

    &-version-selector {
      margin-left: 2rem;

      .input-select {
        .input-select-version-detail {
          font-size: 0.875rem;
          color: $color-dark;
        }

        .input-select-value {
          display: flex;
          align-items: baseline;
          gap: 0.3rem;

          .svg-icon {
            fill: #ffe54f;
            width: 0.5rem;
            height: 0.5rem;
            position: relative;
            top: -0.15rem;
            margin-right: 0.2rem;
          }
        }

        .input-select-dropdown-itemIcon {
          width: 0.5rem;
          height: 0.5rem;
        }

        .input-select-dropdown-item {
          gap: 0.5rem;
        }
      }
    }

    &-header-to-test {
      color: $color-black;
    }

    &-form {
      .input-select {
        .input-select-value {
          .svg-icon {
            display: none;
          }
        }
      }
    }
  }

  .error {
    color: red;
  }
</style>
