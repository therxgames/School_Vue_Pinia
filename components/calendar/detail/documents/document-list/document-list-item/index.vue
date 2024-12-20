<template>
  <li class="d-flex align-items-center gap-2">
    <svg-icon name="document" class="flex-shrink-0" />

    <button-url :url="item.url" icon-class="btn-url" v-if="item.url">
      {{ filename }}
    </button-url>

    <div class="d-flex align-items-center gap-2">
      <span class="file-size">
        <template v-if="ext">{{ ext }}, </template>
        <file-size :value="item.size" />
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import FileSize from "@/components/file-size.vue";
import ButtonUrl from "@/components/input/button-url.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const getFilenameParts = (filename) => {
  const parts = filename.split('.');

  if (parts.length === 1) return [filename];

  return [parts.slice(0, -1).join('.'), parts.slice(-1)[0]];
};

const [filename, ext] = getFilenameParts(props.item.filename);
</script>

<style lang="scss" scoped>
.file-size {
  color: rgb(147, 151, 158);
}
</style>
