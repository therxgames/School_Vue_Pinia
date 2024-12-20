<template>
  <div class="testAddAbout">
    <nuxt-link
      v-for="(theme, index) in sortedThemes"
      :to="`/topic/${theme.id}`"
      :key="index"
      class="testAddAbout-topic">
      <div class="testAddAbout-topic-name">
        {{ theme.name }}
      </div>

      <div class="testAddAbout-topic-dot"/>

      <div class="testAddAbout-topic-tasksCount">
        {{ theme.tasks_count }}
        {{ declension(theme.tasks_count, lexicon.decl.tasks) }}
      </div>
    </nuxt-link>
  </div>
</template>

<script setup>
  const props = defineProps({
    themes: {type: Array, required: true}
  });

  const sortedThemes = computed(() => {
    return props.themes.sort((a, b) => b.name.length - a.name.length);
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testAddAbout {
    padding-top: 1rem;
  }

  .testAddAbout-topic {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .testAddAbout-topic-name {
    white-space: nowrap;
    max-width: 40rem;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: $transition;
  }

  .testAddAbout-topic-dot {
    width: 2px;
    height: 2px;
    border-radius: 10px;
    display: inline-block;
    background: $color-black;
  }

  .testAddAbout-topic-tasksCount {
    color: $color-dark;
  }

  .testAddAbout-topic:hover {
    .testAddAbout-topic-name {
      color: $color-blue-normal;
    }
  }
</style>
