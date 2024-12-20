<template>
  <major-selections-slider :selections="materialsSelections" title="Библиотека материалов" v-slot="slotProps">
    <materials-cards-item
      v-for="item in chunkmaterials[slotProps.slideIndex]"
      :item="item"
      :listMode="false"
    />
  </major-selections-slider>
</template>

<script setup>
import { chunkArray } from '~/utils/utils';
import useMaterialsLibraryStore from '~/stores/materials-library';
import useSelectionsStore from '~/stores/selections';

const materialsLibraryStore = useMaterialsLibraryStore();
const selectionsStore = useSelectionsStore();

const materials = computed(() => materialsLibraryStore.list);
const materialsSelections = computed(() => selectionsStore.selections.materials);
const chunkmaterials =  computed(() => chunkArray(materials.value, 2));

await useAsyncData("materials-library", () =>
  Promise.all([materialsLibraryStore.fetchMaterials({})])
);

onMounted(async () => {
  await selectionsStore.fetch({
    role: 'student',
    selectionType: 'materials'
  });
});

const props = defineProps({
  slideIndex: {
    type: Number,
  }
});
</script>

<style lang="scss" scoped>
@import "/assets/scss/theme";
</style>
