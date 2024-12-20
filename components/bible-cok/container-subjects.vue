<template>
  <div class="row col-xl-6 ">
    <div
      class="col-6 pl-4 mb-4 "
      v-for="(item, key) in props.items"
      :key="key">
      <bible-cok-item-cok
        v-bind="adaptPic(item)"
        @click.prevent.stop="emit('selectItem', item)"/>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  });
  const emit = defineEmits(['selectItem']);
</script>
