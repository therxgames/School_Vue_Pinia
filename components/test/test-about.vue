<template>
  <div
    v-if="themes.length"
    class="testAbout">
    <div class="testAbout-title">
      <span class="testAbout-title-caption">Тема</span>
    </div>

    <div class="testAbout-content">
      <nuxt-link
        v-for="(topic, index) in sortedThemes"
        :to="`/topic/${topic.id}`"
        :key="index"
        class="testAbout-topic">
        <div
          :title="topic.name"
          class="testAbout-topic-name">
          {{ topic.name }}
        </div>

        <div class="dot"/>

        <div
          class="testAbout-topic-tasksCount">
          {{ topic.tasks_count }}
          {{ declension(topic.tasks_count, lexicon.decl.tasks) }}
        </div>
      </nuxt-link>
    </div>
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

  .testAbout {
    margin-top: 1rem;
    margin-bottom: 1rem;
    align-items: flex-start;
    display: grid;
    gap: 0.8rem;
    grid-template-columns: minmax(150px, 240px) 1fr;
  }

  .testAbout-title {
    position: relative;
    color: $color-dark;
  }

  .testAbout-title::after {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    background: $color-dark-light;
    bottom: 0.2rem;
    left: 0;
  }

  .testAbout-title-caption {
    background: #fff;
    padding: 0.5rem 0.3rem 0.5rem 0;
    position: relative;
    z-index: 1;
  }

  .testAbout-topic {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: $transition;

    &:hover {
      color: $color-blue-normal;
    }
  }

  .testAbout-topic-name {
    max-width: 30rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .testAbout-topic-tasksCount {
    color: $color-dark;
  }
</style>
