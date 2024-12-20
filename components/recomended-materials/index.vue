<template>
  <div>
    <h1 class="title">
      <span
        class="icon-wrapper icon"
        v-tooltip="viewTpOpts">
        <svg-icon
          class="icon"
          name="info-thin"/></span>
    </h1>
    <div class="tile-container">
      <div
        class="flex-grow-0 flex-shrink-0 overflow-hidden"
        v-for="(item, index) in props.items"
        :key="index">
        <recomended-materials-test-item v-bind="item"/>
      </div>
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

  const viewTpOpts = computed(() => ({
    title: () => `<span>
                      Материалы из Библиотеки цифрового образовательного контента ФГИС «Моя школа»
                  </span>`
  }));
</script>

<style lang="scss">
  .title {
    display: flex;
  }

  .icon {
    width: 24px;
    height: 24px;
    display: inline;
    margin-left: auto;
  }

  .tile-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    margin: 0 -0.65rem;
    row-gap: 2.5rem;
  }
</style>
