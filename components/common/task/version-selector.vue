<template>
  <div class="task-version-selector">
    <loader
      v-if="fetchingVersions || !isInitialized"
      class="task-version-selector-loader"
      :listener="fetchingVersions || !isInitialized"/>
    <div
      v-if="isInitialized && !fetchingVersions"
      class="task-version-selector-content">
      <input-select-single
        :reset-btn="false"
        :truncate-from="255"
        :list="versionDataList"
        v-model:value="versionSetter"/>
      <div
        v-if="(publishedVersion?.id !== props.currentTaskId) && publishAllow"
        @click="publishVersion(selectedVersion)"
        :class="{'disabled': publishingVersion}"
        class="btn btn-primary">
        Опубликовать
      </div>
      <div
        v-else-if="unpublishAllow"
        @click="unpublishVersion(selectedVersion)"
        :class="{'disabled': publishingVersion}"
        class="btn btn-primary">
        Снять с публикации
      </div>
    </div>
  </div>
</template>

<script setup>
  import useCommonStore from '~/stores/common';
  import _cloneDeep from 'lodash.clonedeep';

  const props = defineProps({
    taskParentId: {
      type: Number,
      required: true
    },
    currentTaskId: {
      type: Number,
      default: 0
    },
    switchRouteName: {
      type: String,
      default: 'task-id'
    },
    publishAllow: {
      type: Boolean,
      default: true
    },
    unpublishAllow: {
      type: Boolean,
      default: true
    }
  });
  const router = useRouter();
  const fetchingVersions = ref(false);
  const isInitialized = ref(false);
  const publishingVersion = ref(false);
  const selectedVersion = ref(+props.currentTaskId);
  const versions = ref([]);
  const versionDataList = computed(() => {
    return _cloneDeep(versions.value).map((version) => {
      return {
        ...version,
        ...version.status_id === 2 ? {
          icon: {
            name: 'bull',
            fill: '#FFE54F'
          }
        } : null,
        name: `Версия ${version.version_number}
                <span class="input-select-version-detail">от ${formatDate(version.created_at)}</span>`
      };
    });
  });
  const versionSetter = computed({
    get: () => selectedVersion.value,
    set: (value) => {
      const version= versions.value.find((v) => v.id === value);

      if (version.id === +useRoute().params.id) {
        eventBus.emit('toast:show', {
          text: `Вы уже просматриваете версию ${version?.version_number}`
        });
        return;
      }

      selectedVersion.value = version?.id;

      eventBus.emit('loader:show');

      useCommonStore().switchVersionTrigger = version;

      router.push({
        name: props.switchRouteName,
        params: {id: version?.id}
      });
    }
  });
  const publishedVersion = computed(() => {
    return versions.value.find((version) => version.status_id === publishStatus.PUBLISH);
  });
  const versionById = computed(() => {
    return versions.value.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  });

  onMounted(() => {
    fetch();
    showCurrentlyWatchVersion();
  });

  const fetch = async () => {
    await fetchVersions();
    isInitialized.value = true;
  };
  const showCurrentlyWatchVersion = () => {
    if (useCommonStore().switchVersionTrigger) {
      eventBus.emit('toast:show', {
        text: `Вы просматриваете версию ${useCommonStore().switchVersionTrigger?.version_number}`
      });
      useCommonStore().switchVersionTrigger = null;
    }
  };
  const fetchVersions = async () => {
    fetchingVersions.value = true;
    try {
      const response = await useApi(`/api/task/${props.taskParentId}/versions`, {...methodGet});
      if (response.data.done) {
        versions.value = response.data.versions;
      }
    } catch (e) {
      console.error(e.message);
    }
    fetchingVersions.value = false;
  };
  const publishVersion = (id) => {
    const publish = async () => {
      publishingVersion.value = true;
      try {
        const response = await useApi(`/api/task/${id}/publish`, {
          ...methodPatch,
          body: {status_id: publishStatus.PUBLISH}
        });
        if (response.data.done) {
          eventBus.emit('toast:show', {
            text: `Версия ${versionById.value[selectedVersion.value]?.version_number} успешно опубликована`
          });
        }
        await fetchVersions();
      } catch (e) {
        console.error(e.message);
      }
      publishingVersion.value = false;
    };
    const askBefore = () => {
      eventBus.emit('alert:show', {
        title: 'Публикация задания',
        content: `Вы действительно хотите опубликовать версию <b>${versionById.value[versionSetter.value]?.version_number}?</b>`,
        buttons: [
          {
            title: 'Да',
            async click(modal, context) {
              context.hide();
              publish();
            }
          },
          {
            title: 'Отмена',
            class: 'btn-outline-primary',
            click(modal, context) {
              context.hide();
            }
          }
        ]
      });
    };
    askBefore();
  };
  const unpublishVersion = (id) => {
    const unpublish = async () => {
      try {
        const response = await useApi(`/api/task/${id}/publish`, {
          ...methodPatch,
          body: {status_id: publishStatus.UNPUBLISH}
        });
        if (response.data.done) {
          eventBus.emit('toast:show', {
            text: `Версия ${versionById.value[selectedVersion.value]?.version_number} снята с публикации`
          });
        }
        await fetchVersions();
      } catch (e) {
        console.error(e.message);
      }
    };
    const askBeforeFor = () => {
      eventBus.emit('alert:show', {
        title: 'Публикация задания',
        content: `Вы действительно хотите снять с публикации <br> версию <b>${versionById.value[versionSetter.value]?.version_number}?</b>`,
        buttons: [
          {
            title: 'Да',
            async click(modal, context) {
              context.hide();
              unpublish();
            }
          },
          {
            title: 'Отмена',
            class: 'btn-outline-primary',
            click(modal, context) {
              context.hide();
            }
          }
        ]
      });
    };
    askBeforeFor();
  };

  defineExpose({fetch});
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .task-version-selector {
    display: flex;
    gap: 1rem;
    align-items: center;

    &-loader {
      --loader-min-height: none;
      --loader-spinner-width: 1.8rem;
      --loader-spinner-height: 1.8rem;
      --loader-max-opacity: 0.75;
      --loader-spinner-transition-ms: 0;

      position: relative;
      width: auto;
    }

    &-content {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

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
    }
  }
</style>
