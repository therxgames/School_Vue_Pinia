<template>
  <div class="dropzone mx-auto mb-5">
    <div>
      <h4 class="my-4">
        Загрузить<span
          @click="clearHistory"
          class="hidden-btn ms-3">clear</span>
      </h4>
      <div
        class="droparea rounded-4 p-4"
        @drop.prevent="dropFile"
        @dragover.prevent
        @dragenter.prevent
        :style="{justifyContent: !files.length ? 'center' : 'start' }">
        <div
          v-if="!files.length"
          class="droparea-controls">
          <div class="p-3 bg-light rounded">
            <svg-icon name="archive"/>
          </div>
          <div class="my-4">
            Для загрузки файлов перетащите их в область или
          </div>
          <label
            for="inputFile"
            class="btn btn-simple px-4 py-2">
            Загрузите с компьютера
          </label>
        </div>
        <input
          id="inputFile"
          type="file"
          ref="input"
          accept=".zip"
          hidden
          @change="inputFiles">
        <admin-uploads-preview
          v-for="(file, idx) in files"
          :key="idx"
          :file="file"
          :index="idx"
          @uploaded="uploaded"
          @add-log="addLog"
          @error="error"/>
        <ul
          v-if="logs.length"
          class="mt-4 upload-logs">
          <li
            v-for="(log, idx) in logs"
            :key="idx">
            {{ log }}
            <div
              v-if="store.step < steps.UPLOADED"
              class="spinner-border"/>
          </li>
        </ul>
        <div
          v-if="store.step >= steps.UPLOADED"
          class="mt-4">
          <div
            v-if="uploadRes"
            class="dropzone-informer">
            <span v-if="uploadRes.uploaded"><svg-icon name="check-square"/> Импортировано {{ uploadRes.uploaded }} {{ taskForm(uploadRes.uploaded) }}</span>
            <span v-if="!uploadRes.uploaded && uploadRes.skipped"><svg-icon name="info-square"/>Новых заданий не обнаружено</span>

            <div class="mt-4">
              <button
                @click="goToFile"
                class="btn btn-primary">
                Подробнее
              </button>
              <button
                v-if="uploadRes.conflicts"
                @click="goToConflicts"
                class="ms-2 btn btn-primary">
                Разрешить конфликты
              </button>
            </div>
          </div>
          <div class="mt-4 text-end">
            <button
              @click="init"
              class="btn btn-simple">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useAdminFilesStore from '~/stores/admin-files';
  import {steps} from './consts';

  const emit = defineEmits(['uploaded', 'error']);

  const store = useAdminFilesStore();
  const router = useRouter();
  const input = ref(null);
  const files = ref([]);
  const logs = reactive([]);

  function inputFiles(e) {
    addFiles([...e.target.files]);
  }

  function dropFile(e) {
    const file = [...e.dataTransfer.files];
    file.length = 1;
    addFiles(file);
  }

  function addFiles(items) {
    if (store.step === steps.INIT) {
      items.forEach((file) => {
        if (file.name.endsWith('.zip')) {
          logs.push('Инициализация загрузки...');
          store.setStep(steps.UPLOADING);
          files.value.push(file);
        }
      });
    }
  }

  function taskForm(n) {
    return `задани${declension(n, ['е', 'я', 'й'])}`;
  }

  function newForm(n) {
    return `нов${declension(n, ['ое', 'ых', 'ых'])}`;
  }

  const uploadRes = ref(null);

  const uploaded = (upload) => {
    uploadRes.value = upload;
    const {uploaded, skipped, errored} = upload;

    if (uploaded && !errored) {
      logs.push(`Импортировано ${uploaded} ${newForm(uploaded)} ${taskForm(uploaded)}`);
    } else if (uploaded && errored) {
      logs.push(`Импортировано ${uploaded} ${newForm(uploaded)} ${taskForm(uploaded)}, ${errored} ${taskForm(errored)} импортировать не удалось`);
    } else if (skipped && !uploaded) {
      logs.push(`Новых заданий не обнаружено`);
    }
    store.setStep(steps.UPLOADED);
  };

  const addLog = (log) => {
    logs.push(log);
  };

  const error = (e) => {
    store.setStep(steps.ERROR);
  };

  const init = () => {
    files.value = [];
    input.value.value = '';
    logs.length = 0;
    uploadRes.value = null;
    store.reset();
  };

  const goToFile = () => router.push(`/admin/uploads/${uploadRes.value.id}`);
  const goToConflicts = () => store.setConflicts(uploadRes.value.conflicts);

  const clearHistory = async () => {
    const response = await useApi('/api/content/clear', {
      method: 'POST'
    });
    if (response.data.done) {
      document.location.reload();
    }
  };

  onMounted(init);
</script>

<style lang="scss">
  @import '~/assets/scss/theme';

  .dropzone {
    max-width: 1200px;

    .droparea {
      position: relative;
      min-height: 440px;
      border: 2px dashed #ced6e0;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-controls {
        display: flex;
        flex-direction: column;
        align-items: center;

        .svg-icon {
          width: 2em;
          height: 2em;
        }
      }
    }

    .upload-logs {
      color: $color-normal;

      li {
        &:not(:last-child)::after {
          content: 'OK';
        }
      }

      .spinner-border {
        display: none;
        width: 1em;
        height: 1em;
        margin-left: 10px;
      }

      li:last-child {
        .spinner-border {
          display: inline-block;
        }
      }
    }

    &-informer {
      background-color: $color-black-10;
      border-radius: 8px;
      padding: 20px 16px;

      .svg-icon-default {
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
        font-size: 16px;
        top: -2px;
        position: relative;
      }
    }

    .hidden-btn {
      font-size: 0.5em;
      font-weight: 200;
      color: #7f838a;
      cursor: pointer;
      margin: 0;
      background: #fff;
      padding: 0.3rem;
      border-radius: 0.3rem;
      border: 1px solid #f2f5fa;
      vertical-align: middle;
      opacity: 0;
      transition: all 150ms linear;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
