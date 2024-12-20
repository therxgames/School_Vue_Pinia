<template>
  <div class="testRunTop">
    <div
      class="testRunTop-icon"
      @click="emit('faster')">
      <svg-icon
        v-if="iconName"
        :name="iconName"/>
    </div>

    <div class="testRunTop-breadcrumbs">
      Подготовка | Прохождение теста
    </div>

    <div
      v-if="tags"
      class="testRunTop-tags mb-4">
      <common-tag
        v-for="(tag, index) in tags"
        :key="index"
        :data="tag"/>
    </div>

    <h1 class="testRunTop-name">
      {{ test.name }}
    </h1>
  </div>
</template>

<script setup>
  const props = defineProps({
    test: {type: Object, required: true}
  });

  const emit = defineEmits(['faster']);

  const iconName = computed(() => {
    const res = mapSubjectNamesToProps[props.test.subject?.toLowerCase()];

    if (res) {
      return res.subjectLogo;
    }

    return null;
  });

  const tags = computed(() => {
    return [...getTestAutoTags(props.test)];
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testRunTop {
    text-align: center;
    border-bottom: 1px solid #ced6e0;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }

  .testRunTop-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .testRunTop-icon .svg-icon {
    width: 5rem;
    height: 5rem;
  }

  .testRunTop-breadcrumbs {
    color: #7f838a;
    font-size: 0.875rem;
  }

  .testRunTop-tags {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
  }

  .testRunTop-name {
    margin-top: 1rem;
  }
</style>
