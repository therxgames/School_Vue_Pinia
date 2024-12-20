<template>
  <nuxt-layout name="default">
    <div class="page-task page-default content-container">
      <nuxt-link
        @click="$router.go(-1)"
        class="page-task-back">
        <svg-icon
          class="page-task-back-icon"
          name="arrow-left"/>
        <span>Назад</span>
      </nuxt-link>
      <div class="d-flex align-items-center mb-4">
        <h1>
          <router-link
            v-tooltip="{title: 'Перейти к просмотру задания'}"
            :to="taskPageLink"
            class="page-task-header-to-task">
            Задание #{{ store.task.parent_id }}
          </router-link>
          <small
            v-if="true"
            class="px-4 text-muted info"
            @click="moreInfoQti(store.task.id)">
            QTI
          </small>
          <small
            v-if="true"
            class="text-muted"
            @click="moreInfoJson(store.task.id)">
            Код
          </small>
        </h1>
        <common-task-version-selector
          ref="versionSelector"
          class="page-task-version-selector"
          :current-task-id="+route.params.id"
          :task-parent-id="store.task.parent_id"
          switch-route-name="task-settings-id"
          :publish-allow="false"
          :unpublish-allow="false"/>
      </div>
      <div class="my-4">
        <h4>Редактирование</h4>
        <form
          class="card px-4  mx-auto mt-5"
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
          <div class="mt-3 page-task-name">
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
              :class="[{'error': !element.year}]"
              for="table">Год</label>
            <input-select-single
              placeholder="Не задан"
              :list="store.getFilterData('years')"
              v-model:value="element.year"/>
          </div>
          <div class="mt-3">
            <label
              class="form-label"
              :class="[{'error': !element.complexity}]"
              for="table">Сложность</label>
            <input-select-single
              placeholder="Не задана"
              :list="store.getFilterData('complexity')"
              v-model:value="element.complexity"/>
          </div>
          <div class="mt-3">
            <label
              class="form-label"
              :class="[{'error': !element.theme_name}]"
              for="table">Тема</label>
            <div class="page-task-theme">
              <input-simple :placeholder="element.theme_name"/>
              <div
                @click="selectTheme"
                class=" btn btn-light">
                Изменить
              </div>
            </div>
          </div>
          <div class="mt-3 mb-4">
            <label
              class="form-label"
              :class="[{'error': !element.time}]"
              for="table">Время выполнения <span class="color-dark">(в секундах)</span></label>
            <input-simple
              placeholder="Не задано"
              v-model:value="element.time"/>
          </div>
          <div class="my-3">
            <button
              :class="[{'disabled': !saveAllow}]"
              type="button"
              class="btn btn-primary"
              style="width: 100%;"
              @click="editTask">
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
  import useCommonStore from '~/stores/common';
  import useTaskSettingsStore from '~/stores/task-settings';
  import xmlFormatter from 'xml-formatter';

  const userStore = useUserStore();
  const store = useTaskSettingsStore();
  const router = useRouter();
  const route = useRoute();

  const taskPageLink = computed(() => {
    return `/task/${route.params.id}`;
  });

  const versionSelector = ref(null);
  const saveAllow = ref(false);
  const progress = ref(false);

  watch(() => userStore.currentRole, (val) => {
    if (!(userStore.userIsAdmin || userStore.userIsCOSUser)) router.replace('/');
  });

  const editTask = async () => {
    progress.value = true;
    const saved = await store.editTask(query.value);
    if (saved) {
      eventBus.emit('toast:show', {text: 'Успешное сохранение'});
      await store.fetch(store.task.id);
      await useCommonStore().resolveFilters(true);
    } else {
      eventBus.emit('toast:show', {text: 'Необходимо заполнить все поля', hideIcon: true});
      await store.fetch(store.task.id);
    }
    versionSelector.value.fetch();
    progress.value = false;
  };

  const selectTheme = () => {
    eventBus.emit('alert:show', {
      title: 'Выбор темы',
      contentComponent: 'helperAlertContentThemeChoice',
      maxWidth: '980px',
      hideAllButtons: true,
      additionalData: {
        topics: store.themes,
        currentThemeId: element.theme_id
      },

      onAccept(event, context) {
        element.theme_id = event.data[0].id;
        element.theme_name = event.data[0].name;
        context.hide();
      }
    });
  };

  const moreInfoQti = async (id) => {
    try {
      const response = await useApi(`/api/task/${id}/qti`, {
        method: 'GET'
      });

      if (response.data.done) {
        const qti = xmlFormatter(response.data.qti)
          .replace(/src=(['"])\/tasks_images\//g, `src=$1${useRuntimeConfig().public.API_URL}/tasks_images/`);

        eventBus.emit('alert:show', {
          title: 'QTI',
          contentRaw: `${qti}`,
          contentPre: true,
          maxWidth: '800px',
          maxContentHeight: 'calc(100vh - 240px)',
          buttons: [
            {
              title: 'Скопировать',
              async click(modal, context) {
                const res = await copyToClipboard(qti);
                if (res) {
                  eventBus.emit('toast:show', {
                    text: 'QTI скопирован успешно'
                  });
                }
                context.hide();
              }
            },
            {
              title: 'Закрыть',
              class: 'btn-outline-primary',
              click(modal, context) {
                context.hide();
              }
            }
          ]
        });
      }
    } catch (e) {
      console.log('Ошибка загрузки', e);
      eventBus.emit('alert:show', {
        title: 'Ошибка загрузки',
        content: e.response?.data.error,
        maxWidth: '800px',
        hideAllButtons: true
      });
    }
  };

  const moreInfoJson = async (id) => {
    try {
      const response = await useApi(`/api/task/${id}/json`, {
        method: 'GET'
      });

      if (response.data.done) {
        const json = response.data.task_json;
        const jsonPretty = JSON.stringify(JSON.parse(json), null, 2);

        eventBus.emit('alert:show', {
          title: 'JSON',
          contentRaw: `${jsonPretty}`,
          contentPre: true,
          maxWidth: '800px',
          maxContentHeight: 'calc(100vh - 240px)',
          buttons: [
            {
              title: 'Скопировать',
              async click(modal, context) {
                const res = await copyToClipboard(jsonPretty);
                if (res) {
                  eventBus.emit('toast:show', {
                    text: 'JSON скопирован успешно'
                  });
                }
                context.hide();
              }
            },
            {
              title: 'Закрыть',
              class: 'btn-outline-primary',
              click(modal, context) {
                context.hide();
              }
            }
          ]
        });
      }
    } catch (e) {
      console.log('Ошибка загрузки', e);
      eventBus.emit('alert:show', {
        title: 'Ошибка загрузки',
        content: e.response?.data.error,
        maxWidth: '800px',
        hideAllButtons: true
      });
    }
  };

  onMounted(() => {
    eventBus.emit('loader:hide');
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'task-settings-id') {
      store.$reset();
    }
  });

  await useAsyncData(`task-settings-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id)
  ]));

  const element = reactive({
    updating: store.updating,
    subject_name: store.task.subject_name,
    subject_id: store.task.subject_id,
    name: store.task.name,
    status_id: store.task.status_id,
    theme_id: store.task.topic_id,
    theme_name: store.task.topic_name,
    type: store.task.type,
    attestation: store.task.attestation,
    complexity: store.task.complexity,
    year: store.task.year,
    class: store.task.class,
    time: String(store.task.time)
  });

  const query = computed(() => {
    return {
      id: store.task.id,
      name: element.name,
      status_id: element.status_id,
      ref_topic_id: element.theme_id,
      complexity: element.complexity,
      year: element.year,
      time: element.time
    };
  });

  watch(
    () => element,
    () => saveAllow.value = true,
    {deep: true}
  );
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-task {
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

    &-name {
      input {
        text-overflow: ellipsis;
      }
    }

    &-theme {
      display: grid;
      grid-template-columns: minmax(400px, 530px) minmax(150px, 200px) auto;

      input {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        pointer-events: none;
        padding-right: 1em !important;
        text-overflow: ellipsis;
        border-right: none;
      }

      .svg-icon-default {
        display: none;
      }

      .btn {
        --bs-btn-bg: #fff;
        --bs-btn-padding-x: 1rem;
        --bs-btn-color: #0c1524;
        --bs-btn-active-color: #{$color-dark};
        --bs-btn-active-border-color: #{$color-dark};
        --bs-btn-border-color: #{$color-normal};
        --bs-btn-hover-color: #{$color-dark};
        --bs-btn-hover-border-color: #{$color-dark};

        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }

      ::placeholder {
        color: #0c1524;
      }
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

    &-header-to-task {
      color: $color-black;
    }
  }

  .error {
    color: red;
  }

  small {
    color: #0576ff;
    cursor: pointer;
  }
</style>
