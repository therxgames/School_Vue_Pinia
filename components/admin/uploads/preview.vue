<template>
  <div class="admin-filepreview rounded my-2">
    <div class="img">
      <svg-icon name="folder"/>
    </div>
    <div class="w-100 mx-3">
      <div>{{ file.name }}</div>
      <template v-if="progress <= 100">
        <div
          class="progress my-1"
          style="height: 8px;">
          <div
            class="progress-bar rounded"
            :style="progressStyles"
            :class="{'bg-danger': abort}"/>
        </div>
        <div
          v-if="progress < 100"
          class="text-muted">
          {{ progress }}%
        </div>
        <div
          v-else
          class="class-muted">
          {{ fileSize(file.size) }}
        </div>
      </template>
    </div>
    <svg-icon
      v-if="progress < 100"
      name="cross"
      :fill="abort ? '#ced6e0' : 'black'"
      @click="controllerAbort"
      :style="{transform: 'scale(0.6)', cursor: abort ? 'auto':'pointer'}"/>
    <svg-icon
      v-if="progress === 100"
      name="check-circle"
      fill="#3DB45A"/>
  </div>
</template>

<script setup>
  const emit = defineEmits(['uploaded', 'error', 'add-log']);

  const props = defineProps({
    file: {
      required: true
    },
    index: {
      type: Number
    }
  });

  const abort = ref(false);
  const controller = new AbortController();

  function controllerAbort() {
    if (!abort.value) {
      emit('add-log', 'Загрузка была прервана...');
      abort.value = true;
      controller.abort();
    }
  }

  const progress = ref(0);
  const progressStyles = computed(() => `width: ${progress.value}%`);

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('tasks', file);
    try {
      const res = await useApi('/api/content/import', {
        formData,
        onUploadProgress: (event) => {
          progress.value = Math.round((event.loaded * 100) / event.total);
          if (event.loaded === event.total) {
            emit('add-log', 'Ожидание парсинга...');
          }
        },
        signal: controller.signal
      });
      if (res.data.done) {
        emit('uploaded', res.data.upload);
      }
    } catch (error) {
      if (!abort.value) emit('add-log', 'Файл не может быть импортирован.');
      emit('error', error);
    }
  }

  onMounted(() => {
    uploadFile(props.file);
  });
</script>

<style lang="scss">
  .admin-filepreview {
    display: flex;
    width: 100%;
    align-items: center;

    .img {
      .svg-icon {
        width: 64px;
        height: 64px;
      }
    }

    .progress-bar {
      transition: width 0.5s ease;
    }

    .status {
      width: 0.8rem;
      height: 0.8rem;
      display: inline-block;
    }
  }
</style>
