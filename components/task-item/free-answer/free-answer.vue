<template>
  <div
    class="freeAnswer"
    :class="['freeAnswer--' + step]">
    <task-item-common-question
      class="freeAnswer-body"
      :content="task.question"
      :num="num"
      :tag="tag"
      :zero-page="task.zeropage_text"
      :show-zero-page="showZeroPage"/>

    <div
      v-if="showSolution && task.criteria"
      class="freeAnswer-criteriaLink">
      <svg-icon
        name="info"
        fill="#0576FF"/>
      <a
        href="#"
        @click.prevent="showCriteria">Критерии оценивания</a>
    </div>

    <div
      v-if="variants && variants?.length"
      class="freeAnswer-variants"
      :class="{'disabled': props.preview}">
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="freeAnswer-variant"
        :class="variant.class"
        @click="toggleVariant(variant)"
        @mouseenter="onMouseenter(index)"
        @mouseleave="onMouseleave">
        <div class="freeAnswer-variant-icon">
          <svg-icon :name="variant.icon"/>
        </div>

        <div
          class="freeAnswer-variant-content"
          v-html="variant.text"/>
      </div>
    </div>

    <div v-if="step === 'interaction' && !props.preview">
      <div
        v-if="answer.filenames && answer.result === 'unchecked'"
        class="mb-4">
        <div
          v-for="(item, index) in filteredFilenames"
          :key="index"
          class="card bg-light p-3 mb-2 freeAnswer-file border-0">
          <div class="preview">
            <a
              :href="item.filename.startsWith('blob') ? item.filename : (`${useRuntimeConfig().public.SITE_URL}` + item.filename)"
              target="_blank">
              <img
                v-if="isImg(item.original_name)"
                :src="item.filename.startsWith('blob') ? item.filename : (`${useRuntimeConfig().public.SITE_URL}` + item.filename)"
                class="img-fluid"
                alt="file">

              <div
                v-else
                class="freeAnswer-file-icon">
                {{ fileExt(item.original_name) }}
              </div>
            </a>
          </div>

          <div class="mx-3 lh-lg w-75">
            <div class="overflow-auto text-nowrap">
              {{ item.original_name }}
            </div>
            <div class="text-muted">
              {{ fileSize(item.filesize) }}
            </div>
          </div>

          <button
            type="button"
            class="btn border-0 p-1"
            style="margin-left: auto;"
            @click="removeFile(item)">
            <svg-icon
              name="cross"
              fill="#7f838a"/>
          </button>
        </div>
      </div>

      <div v-if="files">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="card bg-light p-3 mb-2 freeAnswer-file border-0">
          <div class="preview">
            <img
              v-if="isImg(file.name)"
              :src="fileBlob(file)"
              class="img-fluid"
              alt="file">

            <div
              v-else
              class="freeAnswer-file-icon">
              {{ fileExt(file.name) }}
            </div>
          </div>

          <div class="mx-3 lh-lg w-75">
            <div class="overflow-auto text-nowrap">
              {{ file.name }}
            </div>
            <div class="text-muted">
              {{ fileSize(file.size) }}
            </div>
          </div>

          <button
            type="button"
            class="btn border-0 p-1"
            style="margin-left: auto;"
            @click="removeFile(file)">
            <svg-icon
              name="cross"
              fill="#7f838a"/>
          </button>
        </div>

        <div
          v-if="step === 'interaction'"
          class="mb-4">
          <label
            :for="task.id"
            class="form-label">
            Комментарий
          </label>

          <textarea
            v-if="loaded"
            :id="task.id"
            :value="input"
            class="form-control"
            placeholder="Необязательно"
            autocomplete="off"
            @input="onInput"/>
        </div>
      </div>
    </div>

    <div v-else>
      <div
        v-if="answer.filenames"
        class="mb-4">
        <div
          v-for="(item, index) in answer.filenames"
          :key="index"
          class="card bg-light p-3 mb-2 freeAnswer-file border-0">
          <div class="preview">
            <a
              :href="item.filename.startsWith('blob') ? item.filename : (`${useRuntimeConfig().public.API_URL}/` + item.filename)"
              target="_blank">
              <img
                v-if="isImg(item.original_name)"
                :src="item.filename.startsWith('blob') ? item.filename : (`${useRuntimeConfig().public.API_URL}/` + item.filename)"
                class="img-fluid"
                alt="file">

              <div
                v-else
                class="freeAnswer-file-icon">
                {{ fileExt(item.original_name) }}
              </div>
            </a>
          </div>

          <div class="mx-3 lh-lg w-75">
            <div class="overflow-auto text-nowrap">
              {{ item.original_name }}
            </div>
            <div class="text-muted">
              {{ fileSize(item.filesize) }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="answer.answer && answer.answer.comment"
        class="mb-4">
        <label class="form-label">
          Комментарий
        </label>

        <div class="card bg-light py-2 px-3 border-0">
          {{ answer.answer.comment }}
        </div>
      </div>

      <div v-if="step === 'result'">
        <div v-if="answer.result === 'scoring'">
          <h5 class="mb-3">
            Ответ принят 😉
          </h5>

          <div class="text-muted">
            Осталось поставить оценку своей работе!
          </div>
        </div>

        <h5
          class="mb-3"
          v-else>
          Ваша оценка {{ answer.score }} {{ declension(answer.score, ['балл', 'балла', 'баллов']) }}
        </h5>
      </div>
    </div>

    <div
      v-if="step === 'interaction' && !props.preview && files.length < 5 && loaded"
      class="freeAnswer-dropZone"
      :class="dropZoneClasses"
      @dragover="dragOver"
      @dragleave="dragLeave"
      @drop="drop">
      <div class="p-3 rounded freeAnswer-dropZone-icon">
        <svg-icon name="archive"/>
      </div>
      <div class="freeAnswer-dropZone-text">
        Для загрузки файлов перетащите их в область или
      </div>

      <a
        href="#"
        class="btn btn-simple">Загрузите с компьютера</a>

      <input
        class="freeAnswer-input"
        ref="fileInput"
        type="file"
        :accept="getFileAccept()"
        multiple
        @click="inputClick"
        @change="onChange">
    </div>

    <div
      v-if="step === 'interaction' && !props.preview"
      class="freeAnswer-instruction">
      Не более 5 файлов, размер файла до 15 МБ. Общий размер — 20 МБ.
      <br>
      jpg, jpeg, png, txt, pdf, doc, docx, xls, xlsx, ppt, pptx
    </div>

    <task-item-modal-criteria ref="criteriaModal"/>

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
          Не более 5 файлов, размер файла до 15 МБ. Общий размер — 20 МБ.<br>
          jpg, jpeg, png, txt, pdf, doc, docx, xls, xlsx, ppt, pptx
        </p>
      </template>
      <template #body>
        <div v-if="store.filesEvent.length">
          <div
            v-for="item in store.filesEvent"
            :key="item.id">
            <div class="d-flex align-items-center justify-content-between w-100 py-2 text-nowrap">
              <div class="form-check text-cut">
                <input
                  type="checkbox"
                  class="form-check-input mt-2 "
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
        <div v-if="store.wrongFiles.length">
          <div><small class="text-danger">Недопустимый формат файла</small></div>
          <div
            v-for="item in store.wrongFiles"
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
  </div>
</template>

<script setup>
  import useFreeAnswerStore from '~/stores/free-answer';

  const store = useFreeAnswerStore();

  const props = defineProps({
    task: {type: Object, required: true},
    step: {type: String, required: true},
    answer: {type: Object, required: true},
    showSolution: {type: Boolean, default: false},
    preview: {type: Boolean, default: false},
    num: {type: Number, default: null},
    tag: {type: String, default: null},
    showZeroPage: {type: Boolean, default: true}
  });

  const emit = defineEmits(['answer-change']);

  const isActive = ref(false);
  const files = ref([]);
  const filesEvent = ref([]);
  const wrongFiles = ref([]);
  const isModal = ref(false);
  const filesSize = computed(() => {
    if (files.value.length > 0) {
      return [...files.value].reduce((acc, file) => acc + file.size, 0);
    }
    return 0;
  });
  const allFilesCount = computed(() => files.value.length + store.selectFilesEvent.length);
  const allFilesSize = computed(() => selectFilesSize.value + filesSize.value);
  const selectFilesSize = computed(() => {
    if (store.selectFilesEvent.length > 0) {
      return [...store.selectFilesEvent].reduce((acc, file) => acc + file.size, 0);
    }
    return 0;
  });

  const criteriaModal = ref(null);
  const fileInput = ref(null);
  const dropZone = ref(null);

  const acceptExts = ref(['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']);
  const acceptTypes = ref([
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/plain'
  ]);
  const filesLimit = ref(20 * 1048576);
  const fileLimit = ref(15 * 1048576);
  const loaded = ref(false);

  onMounted(() => {
    loaded.value = true;
  });

  const getFileAccept = () => [...acceptExts.value].map((el) => `.${el}`).join(', ');

  const checkboxDisable = (file) => file.disable || file.wrong
    || (allFilesCount.value > 4 && !file.select)
    || (allFilesSize.value + file.size >= filesLimit.value && !file.select);

  const dragOver = (e) => {
    e.preventDefault();
    isActive.value = true;
  };

  const dragLeave = () => {
    isActive.value = false;
  };

  const addAnswer = () => {
    const newAnswer = {...props.answer};
    newAnswer.files = files.value;
    if (!newAnswer.answer) {
      newAnswer.answer = {
        comment: '',
        variant: null,
        score: 0
      };
    }
    emit('answer-change', newAnswer);
  };

  const dropZoneClasses = computed(() => {
    let result = [];

    if (isActive.value) {
      result.push('freeAnswer-dropZone--active');
    }

    return result;
  });

  const fileExt = (url) => {
    return url.split('.').pop();
  };

  const isImg = (url) => {
    const ext = fileExt(url);
    return ext && ['jpeg', 'jpg', 'png'].includes(ext.toLowerCase());
  };

  const fileSize = (num) => {
    if (num < 1024) {
      return num + ' bytes';
    } else if (num > 1024 && num < 1048576) {
      return (num / 1024).toFixed(1) + ' KB';
    } else if (num > 1048576) {
      return (num / 1048576).toFixed(1) + ' MB';
    }
  };

  const fileBlob = (file) => {
    return URL.createObjectURL(file);
  };

  const disabledDrop = ref(false);

  const drop = (e) => {
    isActive.value = false;
    if (!disabledDrop.value) {
      e.preventDefault();
      filesUpload(e.dataTransfer.files);
    }
  };

  function onChange(e) {
    filesUpload(e.target.files);
    disabledDrop.value=false;
  }

  const inputClick = () => disabledDrop.value = true;

  const filesUpload = (input) => {
    const filesEvent = [];
    const wrongFiles = [];
    [...input].forEach((f) => {
      const [ext] = f.name.split('.').reverse();
      const type = f.type;
      if (!acceptExts.value.includes(ext.toLowerCase()) || !acceptTypes.value.includes(type)) {
        wrongFiles.push(f);
      } else {
        filesEvent.push(f);
      }
    });
    const size = filesEvent.reduce((acc, file) => acc + file.size, 0);
    const bigFiles = filesEvent.filter((f) => f.size > fileLimit.value);
    const hasErr = bigFiles.length || wrongFiles.length
      || filesSize.value + size > filesLimit.value
      || files.value.length + filesEvent.length > 5;
    if (hasErr) {
      store.filesEvent = filesEvent.map((el, ind) => {
        const file = el;
        return {
          data: file,
          id: ind + 1,
          name: file.name,
          size: file.size,
          disable: file.size > fileLimit.value,
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
      isModal.value = store.filesEvent.length > 0 || store.wrongFiles.length > 0;
    } else {
      store.filesEvent = filesEvent.map((el, ind) => {
        const file = el;
        return {
          data: file,
          id: ind + 1,
          name: file.name,
          size: file.size,
          disable: file.size > fileLimit.value,
          select: true,
          inputID: `file${ind + 1}`
        };
      });
      submitFiles();
    }
  };

  function submitFiles() {
    const arr = [...store.selectFilesEvent].map((f) => f.data);
    files.value = files.value.concat(arr);
    addAnswer();
    isModal.value = false;
    store.filesEvent = [];
    store.wrongFiles = [];
  }

  const removeFile = (file) => {
    if (file.id) {
      file.deleted = true;
    } else {
      if (files.value.includes(file)) {
        files.value.splice(files.value.indexOf(file), 1);
      }

      const newAnswer = {...props.answer};
      newAnswer.files = files;
      emit('answer-change', newAnswer);
    }
  };

  const showCriteria = () => {
    criteriaModal.value.show(props.task.criteria, props.answer);
  };

  const input = ref('');

  onBeforeUnmount(() => {
    input.value = '';
  });

  watch(() => props.answer, () => {
    if (props.answer && props.answer.answer && props.answer.answer.comment) {
      input.value = props.answer.answer.comment;
    } else {
      input.value = '';
    }
  }, {immediate: true});

  const onInput = (e) => {
    const newAnswer = {...props.answer};
    if (newAnswer.answer) {
      newAnswer.answer = {...newAnswer.answer};
    } else {
      newAnswer.answer = {
        variant: null,
        score: 0
      };
    }

    newAnswer.answer.comment = e.target.value;
    emit('answer-change', newAnswer);
  };

  watch(() => props.step, (newStep) => {
    if (newStep === 'interaction') {
      files.value = [];
    }
  });

  const filteredFilenames = computed(() => {
    return props.answer.filenames.filter((f) => !f.deleted);
  });

  const icons = {
    default: 'defaultIconCircle',
    hover: 'selectedIconCircleHover',
    selected: 'selectedIconCircle'
  };

  const getStatus = (variant, index) => {
    if (props.answer.answer && props.answer.answer.variant === variant.value) {
      return 'selected';
    } else if (props.step === 'interaction' && hover.value === index) {
      return 'hover';
    }

    return 'default';
  };

  const variants = computed(() => {
    return props.task.variants?.map((v, ind) => {
      const status = getStatus(v, ind);

      return {
        value: v.value,
        text: v.text,
        status,
        icon: icons[status],
        class: `freeAnswer-variant--${status}`
      };
    });
  });

  const toggleVariant = (variant) => {
    if (props.step !== 'interaction') {
      return;
    }

    const newAnswer = {...props.answer};

    if (newAnswer.answer) {
      newAnswer.answer = {...newAnswer.answer};
    } else {
      newAnswer.answer = {
        score: 0,
        comment: ''
      };
    }

    newAnswer.answer.variant = variant.value;
    emit('answer-change', newAnswer);
  };

  const hover = ref(null);

  const onMouseenter = (index) => {
    hover.value = index;
  };

  const onMouseleave = (index) => {
    hover.value = null;
  };
</script>

<style lang="scss">
  .freeAnswer-criteriaLink {
    display: flex;
    align-items: center;
    margin: 0.5rem 0 1.5rem;
    pointer-events: auto;

    .svg-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
  }

  .disabled {
    user-select: none;
    pointer-events: none;
  }

  .freeAnswer-variants {
    margin-bottom: 1rem;
  }

  .freeAnswer-variant {
    display: flex;
    border-bottom: 1px solid #f3f6fb;
  }

  .freeAnswer-variant-icon {
    width: calc(1rem + 20px);
    padding: calc(1rem + 1px) 0;
    color: #fff0;
  }

  .freeAnswer-variant-content {
    flex: 1;
    padding: 1rem 0;
  }

  .freeAnswer--interaction .freeAnswer-variant {
    cursor: pointer;

    &:hover {
      color: #0576ff;
      border-bottom: 1px solid #ced6e0;
    }
  }

  .freeAnswer-dropZone {
    padding: 3rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 2px dashed #ced6e0;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .freeAnswer-dropZone--active {
    border-color: #0576ff;
    background-color: #f2f5fa;
  }

  .freeAnswer-dropZone-icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    background: #f2f5fa;

    .svg-icon {
      height: 100%;
      width: 100%;
    }
  }

  .freeAnswer-dropZone-text {
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .freeAnswer-input {
    position: absolute;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    cursor: pointer;
    border: solid transparent;
    opacity: 0;
  }

  .freeAnswer-instruction {
    font-size: 0.875rem;
    color: #7f838a;
  }

  .freeAnswer-file {
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
    align-items: center;
    font-size: 0.9rem;
  }

  .freeAnswer-file img {
    display: block;
    max-height: 3.4rem;
  }

  .freeAnswer-file svg {
    width: 12px;
    height: 12px;
  }

  .freeAnswer-file svg:hover {
    fill: currentcolor;
  }

  .freeAnswer-file-icon {
    width: 3.4rem;
    height: 3.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-transform: uppercase;
    font-size: 0.7rem;
    background-color: #007aff;
    border-radius: 0.25rem;
  }
</style>
