<template>
  <div
    ref="sd"
    class="dropdown"
    style="grid-column: 1/-1;">
    <slot/>
    <div
      v-if="props.list.length"
      class="dropdown-menu animation shadow show w-100 mt-1">
      <div class="w-100 p-2">
        <div
          v-for="item in props.list"
          :key="item.id"
          class="m-2 admin-cce-content-dropdown-item text-cut"
          @click="select(item)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {onClickOutside} from '@vueuse/core';

  const emit = defineEmits(['select', 'reset']);

  const props = defineProps({
    list: {
      type: Array,
      default: []
    }
  });

  const sd = ref(null);

  onMounted(() => {
    onClickOutside(sd.value, () => emit('reset'));
  });

  const select = (item) => emit('select', item);

</script>
