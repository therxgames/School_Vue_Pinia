<template>
  <div class="topic-top">
    <h1 v-if="step === topicSteps.RESULT">
      <span v-if="needScoring">Критерии оценивания</span>
      <span v-else>Результаты</span>
    </h1>

    <div v-else>
      <h1
        ref="truncatedRef"
        class="topic-top-title">
        {{ truncatedTitle }}
      </h1>

      <h1
        id="topic-top-fullTitle"
        class="topic-top-title collapse hide">
        {{ title }}
      </h1>

      <a
        v-if="isTruncated"
        data-bs-toggle="collapse"
        @click="showFullTitle"
        href="#topic-top-fullTitle"
        class="topic-top-showFullTitle">
        Показать полностью
      </a>
    </div>
  </div>

  <div class="d-flex justify-content-between align-items-end w-100">
    <div
      v-if="tags"
      class="topic-top-tags">
      <common-tag
        v-for="(tag, index) in tags"
        :key="index"
        :data="tag"/>
    </div>

    <a
      href="#"
      class="topic-top-printBtn"
      @click.prevent="emit('print')">
      <svg-icon
        class="topic-top-printBtn-icon"
        name="print"/>
      Распечатать
    </a>
  </div>
</template>

<script setup>
  import gsap from 'gsap';

  const props = defineProps({
    topic: {type: Object, required: true},
    title: {type: String, required: true},
    step: {type: String, required: true},
    needScoring: {type: Boolean, required: true}
  });

  const emit = defineEmits(['print']);

  const truncatedRef = ref(null);

  const truncatedTitle = computed(() => {
    return truncateString(props.title, 155);
  });

  const isTruncated = computed(() => {
    return props.title.length !== truncatedTitle.value.length;
  });

  const showFullTitle = () => {
    gsap.to(truncatedRef.value, {
      height: 0,
      overflow: 'hidden',
      duration: 0.25
    });
  };

  const tags = computed(() => {
    if (props.topic.tasks) {
      return [...getTopicAutoTags(props.topic)];
    }

    return [];
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .topic-top {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .topic-top-title {
    margin-bottom: 0;
  }

  .topic-top-title.collapse.show + .topic-top-showFullTitle {
    opacity: 0;
    pointer-events: none;
  }

  .topic-top-showFullTitle {
    margin-top: 0.5rem;
    display: inline-flex;
    color: $color-dark;
    border-bottom: 1px dashed;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      color: $color-blue-normal;
    }
  }

  .topic-top-tags {
    margin: 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .topic-top-printBtn {
    display: flex;
    margin: 1.5rem 0;
    align-items: center;
    color: #7f838a;
    font-size: 0.875rem;
  }

  .topic-top-printBtn-icon {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.3rem;
  }
</style>
