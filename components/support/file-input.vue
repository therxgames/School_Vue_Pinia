<template>
  <div class="support-file pb-3">
    <input
      type="file"
      id="formFile"
      :multiple="files.length < 9"
      :accept="getFileAccept"
      @change="filesUpload">
    <label
      v-if="files.length < 10"
      for="formFile"
      class="py-2 text-primary">
      <svg-icon name="file"/>&nbsp; <small>Прикрепить файл</small>
    </label>
    <div class="support-form-text">
      Не более 10 файлов, размер файла до 15 МБ. Общий размер — 20 МБ.<br>
      txt, doc, docx, rtf, xls, xlsx, pps, ppt, pptx, pdf, jpg, jpeg, bmp, png, tif
    </div>
  </div>
  <dialog-modal
    v-if="isModal"
    :is-show="isModal">
    <template #title>
      <h5 class="py-2">
        Загрузка
      </h5>
      <p
        class="text-muted"
        style="font-size: 0.9rem;">
        Не более 10 файлов, размер файла до 15 МБ. Общий размер — 20 МБ.<br>
        txt, doc, docx, rtf, xls, xlsx, pps, ppt, pptx, pdf, jpg, jpeg, bmp, png, tif
      </p>
    </template>
    <template #body>
      <div v-if="previewFilesEvent.length">
        <div
          v-for="item in previewFilesEvent"
          :key="item.id">
          <div class="d-flex align-items-center justify-content-between w-100 py-2 text-nowrap">
            <div class="form-check text-cut">
              <input
                type="checkbox"
                class="form-check-input mt-2"
                :id="item.inputID"
                v-model="item.select"
                :disabled="checkboxDisable(item)">
              <label
                :for="item.inputID"
                class="form-check-label">{{ item.name }}</label>
            </div>
            <div
              class="px-3"
              :class="{ 'text-danger': item.disable }">
              {{ fileSize(item.size) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="previewWrongFiles.length">
        <div><small class="text-danger">Недопустимый формат файла</small></div>
        <div
          v-for="item in previewWrongFiles"
          :key="item.id"
          class="text-nowrap py-2 w-100">
          <div class="d-flex align-items-center justify-content-between w-100">
            <div class="d-flex align-items-center text-cut">
              <div>
                <svg-icon name="wrong"/>
              </div>
              <div class="mx-2 text-cut">
                {{ item.name }}
              </div>
            </div>
            <div class="text-muted px-3">
              {{ item.type }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #buttons>
      <div>
        <div>Всего файлов: {{ allFilesCount }}</div>
        <div class="text-nowrap">
          Размер всех файлов: {{ fileSize(allFilesSize) }}
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary"
        @click="submitFiles">
        OK
      </button>
    </template>
  </dialog-modal>
</template>

<script>
  import useSupportStore from '~/stores/support';
  import DialogModal from '~/components/dialog-modal.vue';

  export default {
    components: {
      DialogModal
    },
    setup() {
      const store = useSupportStore();
      const files = computed(() => store.previewFiles);
      const previewFilesEvent = computed(() => store.filesEvent);
      const previewWrongFiles = computed(() => store.wrongFiles);
      const isModal = computed(() => previewFilesEvent.value.length > 0 || previewWrongFiles.value.length > 0);
      const selectFilesEvent = computed(() => [...store.filesEvent].filter((f) => f.select));
      const allFilesCount = computed(() => store.files.length + selectFilesEvent.value.length);
      const selectFilesSize = computed(() => {
        if (selectFilesEvent.value.length > 0) {
          return [...selectFilesEvent.value].reduce((acc, file) => acc + file.size, 0);
        }
        return 0;
      });
      const filesSize = computed(() => {
        if (files.value.length > 0) {
          return [...files.value].reduce((acc, file) => acc + file.size, 0);
        }
        return 0;
      });
      const allFilesSize = computed(() => selectFilesSize.value + filesSize.value);
      const checkboxDisable = (file) => file.disable || file.wrong
        || (allFilesCount.value > 9 && !file.select)
        || (allFilesSize.value + file.size >= filesLimit && !file.select);

      const filesLimit = 20 * 1048576;
      const fileLimit = 15 * 1048576;
      const acceptExts = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'pps', 'ppt', 'pptx', 'bmp', 'tif'];
      const acceptTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-pps',
        '',
        'application/pdf',
        'image/bmp',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'text/plain',
        'text/rtf',
        'application/rtf'
      ];
      const getFileAccept = [...acceptExts].map((el) => `.${el}`).join(', ');
      function filesUpload(e) {
        const filesEvent = [];
        const wrongFiles = [];
        [...e.target.files].forEach((f) => {
          const [ext] = f.name.split('.').reverse();
          const type = f.type;
          if (!acceptExts.includes(ext.toLowerCase()) || !acceptTypes.includes(type)) {
            wrongFiles.push(f);
          } else {
            filesEvent.push(f);
          }
        });
        const size = filesEvent.reduce((acc, file) => acc + file.size, 0);
        const bigFiles = filesEvent.filter((f) => f.size > fileLimit);
        const hasErr = bigFiles.length || wrongFiles.length
          || filesSize.value + size > filesLimit
          || store.files.length + filesEvent.length > 10;
        if (hasErr) {
          store.filesEvent = filesEvent.map((el, ind) => {
            const file = el;
            return {
              data: file,
              id: ind + 1,
              name: file.name,
              size: file.size,
              disable: file.size > fileLimit,
              select: false,
              inputID: `file${ind + 1}`
            };
          });
          store.wrongFiles = wrongFiles.map((el, ind) => {
            const file = el;
            return {
              data: file,
              id: ind + 1,
              name: file.name,
              type: file.type
            };
          });
        } else {
          store.files = store.files.concat(filesEvent);
        }
        e.target.value = '';
      }

      function submitFiles() {
        const arr = [...selectFilesEvent.value].map((f) => f.data);
        store.files = store.files.concat(arr);
        store.filesEvent = [];
        store.wrongFiles = [];
      }

      return {
        getFileAccept,
        files,
        previewFilesEvent,
        previewWrongFiles,
        isModal,
        allFilesSize,
        allFilesCount,
        filesUpload,
        checkboxDisable,
        submitFiles
      };
    }
  };
</script>
