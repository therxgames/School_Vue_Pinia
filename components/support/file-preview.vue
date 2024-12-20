<template>
  <div class="card border-0 p-3 mb-2 filepreview flex-wrap">
    <div
      v-if="loaded"
      class="preview rounded">
      <img
        v-if="isImg"
        :src="file.src"
        alt="file">
      <svg-icon
        v-else
        :name="previewIcon"/>
    </div>
    <div class="w-75">
      <div class="overflow-auto text-nowrap">
        {{ file.name }}
      </div>
      <div
        v-if="!loaded"
        class="text-muted">
        {{ loadedFile }} из {{ size }}
      </div>
      <div
        v-else
        class="text-muted">
        <small>{{ size }}</small>
      </div>
    </div>
    <button
      type="button"
      class="btn border-0 p-1"
      style="margin-left: auto;"
      @click="deleteFile">
      <svg-icon
        name="cross"
        fill="#7f838a"/>
    </button>
    <div
      v-if="!loaded"
      class="progress w-100 mt-2"
      style="height: 4px;">
      <div
        class="progress-bar bg-success"
        style="transition: none;"
        :style="progressStyles"/>
    </div>
  </div>
</template>

<script setup>
  import useSupportStore from '~/stores/support';
  const props = defineProps({
    file: {
      required: true
    }
  });
  const store = useSupportStore();
  const type = props.file.type;
  const isImg = type.startsWith('image') && !type.includes('tif');
  const previewIcon = computed(() => props.file.name.split('.').reverse()[0].toLowerCase());
  const size = fileSize(props.file.size);
  const progress = ref(0);
  const progressStyles = computed(() => `width: ${progress.value}%`);
  const loaded = ref(false);
  const loadedFile = ref(0);
  async function getProgress(file) {
    const chunksize = Math.round(file.size / 100);
    const decoder = new TextDecoder();
    let result = '';
    let currentByte = 0;
    const lastByte = file.size;
    while (currentByte < lastByte) {
      const chunk = file.slice(currentByte, currentByte + chunksize);
      const buf = await chunk.arrayBuffer();
      result += decoder.decode(buf, {stream: true});
      currentByte += chunksize;
      loadedFile.value = fileSize(currentByte);
      progress.value = Math.round((currentByte / lastByte) * 100);
    }
    setTimeout(() => (loaded.value = true), 200);
  }
  function deleteFile() {
    store.totalCollect.splice(props.file.index, 1);
    store.files.splice(props.file.index, 1);
  }
  onMounted(() => {
    getProgress(props.file.data);
  });
</script>

<style lang="scss">
  .filepreview {
    flex-direction: row;
    justify-content: start;
    align-items: center;
    background: #f5f5f5;

    img {
      display: block;
      max-height: 3rem;
      max-width: 5rem;
    }

    svg {
      width: 12px;
      height: 12px;

      &:hover {
        fill: currentcolor;
      }
    }

    .preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      margin-right: 0.5rem;
      background: #fff;
      overflow: hidden;
      border: 1px solid #dcdee0;

      img {
        max-width: 100%;
        max-height: 100%;
      }

      .svg-icon,
      svg {
        display: block;
        width: 3.4rem;
        height: 3.4rem;
        fill: none;
        stroke: none;
      }
    }
  }
</style>
