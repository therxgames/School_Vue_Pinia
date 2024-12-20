<template>
  <div
    v-if="tests.length > 0"
    class="testRecommendedTests">
    <h5 class="mb-2">
      Другие тесты по ({{ test.subject }})
    </h5>

    <div class="testRecommendedTests-grid">
      <common-test-row
        v-for="(test, index) in showingTests"
        :key="index"
        :data="test"
        :options="rowOptions"
        @favorite="emit('toggle-favorite', $event)"/>
    </div>

    <common-collapse
      v-if="tests.length > 4"
      control-position="bottom"
      :expanded="false">
      <div class="testRecommendedTests-grid">
        <common-test-row
          v-for="(test, index) in collapsedTests"
          :key="index"
          :data="test"
          :options="rowOptions"
          @favorite="emit('toggle-favorite', $event)"/>
      </div>

      <template #control>
        <a
          href="#"
          class="icon-text testRecommendedTests-moreBtn">
          Ещё
          {{ collapsedTests.length }}
          {{ declension(collapsedTests.length, lexicon.decl.tests) }}
          <svg-icon
            class="testRecommendedTests-moreBtn-icon"
            name="arrow-right"/>
        </a>
      </template>
    </common-collapse>
  </div>
</template>

<script setup>
  const props = defineProps({
    test: {type: Object, required: true},
    tests: {type: Array, required: true}
  });

  const emit = defineEmits(['toggle-favorite']);

  const rowOptions = {
    showMenu: false,
    showFavorite: false
  };

  const showingTests = computed(() => props.tests.slice(0, 4));
  const collapsedTests = computed(() => props.tests.slice(4));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testRecommendedTests-grid {
    margin: 0 -1.25rem;
    align-content: flex-start;

    .test-row {
      position: relative;
      border-radius: 0.7rem;
      padding: 0.75rem 1.2rem;

      .test-row-content {
        grid-template-columns:
          minmax(28px, 28px)
          minmax(55px, 55px)
          minmax(230px, 455px)
          minmax(150px, 155px)
          minmax(60px, 70px)
          minmax(40px, 40px)
          auto;

        .test-row-actions {
          display: none;
        }
      }

      &.test-row--no-favorite {
        .test-row-content {
          grid-template-columns:
            minmax(55px, 55px)
            minmax(230px, 485px)
            minmax(150px, 155px)
            minmax(60px, 70px)
            minmax(40px, 40px)
            auto;
        }
      }
    }
  }

  .testRecommendedTests-moreBtn {
    margin-top: 1rem;
    color: $color-blue-normal;

    &-icon {
      --icon-width: 0.4rem;

      gap: 1rem;
    }

    &:hover {
      color: $color-blue-dark;
    }
  }

  .collapse.show + * > .testRecommendedTests-moreBtn {
    pointer-events: none;
    opacity: 0;
  }
</style>
