<template>
  <div class="badge-item d-inline-flex align-items-center p-2 px-3">
    {{ name }}
    <svg-icon
      name="cross"
      class="ms-2"
      role="button"
      style="width: 0.7rem; height: 0.7rem"
      @click="handleClick"
    />
  </div>
</template>
<script setup lang="ts">
type TBadge = {
  id: number | string;
  name?: string;
  type?: string;
  dateFrom?: string
  dateTo?: string
};

defineProps<TBadge>();

const emit = defineEmits(["onDelete"]);

const handleClick = () => {
  emit("onDelete");
};
</script>

<style scoped lang="scss">
.badge-item {
  color: rgb(37, 76, 232);
  background-color: rgb(240, 242, 252);
  border-radius: 0.75em;
}
</style>
