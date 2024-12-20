<template>
  <div class="selections" v-if="isVisible">
    <h1>Подборки</h1>

    <div class="selections-list">
      <selections-item v-for="item in selections" :item="item" :key="item.id" />
    </div>
  </div>
</template>

<script setup>
import useSelectionsStore from '~/stores/selections';
import useUserStore from "~/stores/user";

const props = defineProps({
  type: {
    type: String,
    required: true,
  }
});

const selectionsStore = useSelectionsStore();
const userStore = useUserStore();

const selections = computed(() => selectionsStore.selections[props.type]);
const isVisible = computed(() => userStore.logged && selections.value.length > 0);

onMounted(async () => {
  await selectionsStore.fetch({
    pageSize: 4,
    role: 'student',
    selectionType: props.type,
  });
});
</script>

<style lang="scss">
@import '/assets/scss/theme';

.selections {
  margin-top: 48px;

  &-link {
    color: #000;
  }

  &-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 48px;
    margin-bottom: 64px;
  }
}
</style>
