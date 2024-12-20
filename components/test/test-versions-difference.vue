<template>
  <div class="test-versionsDifference">
    <loader
      v-if="!isInitialized"
      class="test-versionsDifference-loader"
      :listener="!isInitialized"/>
    <div
      v-if="isInitialized"
      class="test-versionsDifference-content">
      <div v-if="differenceCount">
        <b class="font-weight-500">Изменения относительно {{ compareWithNumber }} версии:</b>
        <div v-if="difference.test_name">
          Изменено наименование теста
        </div>
        <div v-if="difference.test_content">
          Изменено описание теста
        </div>
        <div v-if="difference.test_count">
          Изменено количество заданий
        </div>
      </div>
      <div v-else-if="compareWithId !== 0">
        <b class="font-weight-500">Изменений относительно {{ compareWithNumber }} версии не обнаружено</b>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    testParentId: {
      type: Number,
      required: true
    },
    versionOne: {
      type: Number,
      required: true
    }
  });

  const difference = ref({});
  const versions = ref([]);
  const isInitialized = ref(false);
  const versionById = computed(() => {
    return versions.value.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  });
  const versionByVersionNumber = computed(() => {
    return versions.value.reduce((acc, item) => {
      acc[item.version] = item;
      return acc;
    }, {});
  });
  const fetchingVersions = ref(false);
  const fetchingVersionsDifference = ref(false);
  const differenceCount = computed(() => {
    return Object.values(difference.value).reduce((partialSum, a) => partialSum + a, 0);
  });
  const compareWithId = computed(() => {
    const startVersion = versionById.value[props.versionOne];

    if (startVersion && startVersion.version !== 1) {
      return versionByVersionNumber.value[startVersion.version - 1].id;
    }

    return 0;
  });
  const compareWithNumber = computed(() => {
    return versionById.value[compareWithId.value]?.version;
  });

  onMounted(() => {
    fetch();
  });

  const fetch = async () => {
    await fetchVersions();
    await fetchDifference();
    isInitialized.value = true;
  };
  const fetchVersions = async () => {
    fetchingVersions.value = true;
    try {
      const response = await useApi(`/api/test/${props.testParentId}/versions`, {...methodGet});
      if (response.data.done) {
        versions.value = response.data.versions;
      }
    } catch (e) {
      console.error(e.message);
    }
    fetchingVersions.value = false;
  };
  const fetchDifference = async () => {
    if (compareWithId.value === 0) {
      return;
    }

    fetchingVersionsDifference.value = true;
    try {
      const response = await useApi(`/api/test/version_differences`, {
        ...methodGet,
        query: {
          test_id_cur: props.versionOne,
          test_id_prev: compareWithId.value
        }
      });
      if (response.data.done) {
        difference.value = response.data.diff;
      }
    } catch (e) {
      console.error(e.message);
    }
    fetchingVersionsDifference.value = false;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .test-versionsDifference {
    display: inline-flex;
  }

  .test-versionsDifference-content {
    background: $color-black-10;
    border-radius: 0.5rem;
    padding: 0.875rem 1.5rem;
    display: inline-flex;
    flex-direction: column;
    transition: all 150ms ease-out;

    &:empty {
      display: none;
    }
  }

  .test-versionsDifference-loader {
    --loader-min-height: none !important;
    --loader-spinner-width: 1.8rem !important;
    --loader-spinner-height: 1.8rem !important;
    --loader-max-opacity: 0.75 !important;
    --loader-spinner-transition-ms: 0 !important;

    position: relative !important;
    width: auto !important;
  }
</style>
