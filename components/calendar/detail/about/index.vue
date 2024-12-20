<template>
  <div class="about d-grid gap-3">
    <h3 class="mb-0">{{ title[eventType.code] }}</h3>

    <expandable-content>
      <div v-html="text" ref="taskRef"></div>
    </expandable-content>
  </div>
</template>

<script setup>
  import ExpandableContent from '@/components/expandable-content'

  const props = defineProps({
    eventType: {
      type: Object,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
  });

  const title = {
    'contest': 'О конкурсе',
    'course': 'О курсе',
    'olympiad': 'Об олимпиаде',
    'public-lesson': 'Об уроке'
  };
</script>

<style lang="scss" scoped>
  .about {
    margin-top: 2rem;
  }
</style>
