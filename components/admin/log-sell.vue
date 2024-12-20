<template>
  <td
    class="p-2 text-muted admin-logs-content-sell"
    v-tooltip="viewTpOpts">
    {{ titleName }}
  </td>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: [String, Number],
      default: ' '
    }
  });

  const titleName = computed(() => props.title?props.title:' ');
  const viewTpOpts = computed(() => ({
    title: () => showTitle(props.title)
  }));

  const showTitle = (title) => {
    if (title) {
      return title.length > 53?title:'';
    }
    return '';
  };

  onMounted(() => {});
  onUnmounted(() => {});

</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-logs {
    &-content {
      position: relative;

      &-sell {
        max-width: 30rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
