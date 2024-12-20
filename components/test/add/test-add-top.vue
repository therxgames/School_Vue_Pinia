<template>
  <div class="testAddTop">
    <div class="testAddTop-info">
      <div
        v-if="test.is_new"
        class="testAddTop-info-tagNew">
        Новый
      </div>

      <div class="testAddTop-info-tag">
        <svg-icon
          class="testAddTop-info-tag-icon"
          name="tag"/>
        <span>{{ test.id }}</span>
      </div>
    </div>

    <div class="testAddTop-header">
      <h1 class="testAddTop-header-title">
        {{ test.name }}
      </h1>
    </div>

    <div class="testAddTop-tags">
      <common-tag
        v-for="(tag, index) in tags"
        :key="index"
        :data="tag"/>
    </div>

    <div class="testAddTop-stat">
      Составлен {{ formatDate(test.created_at, 'd MMM yyyy г.') }}
    </div>

    <div
      class="testAddTop-description"
      v-html="test.description_text || 'Описание отсутствует'"/>

    <a
      v-if="test.instruction_wtext"
      href="#"
      class="testAddTop-showInstruction"
      @click.prevent="emit('show-instruction')">
      Инструкция
    </a>
  </div>
</template>

<script setup>
  const props = defineProps({
    test: {type: Object, required: true}
  });

  const emit = defineEmits(['show-instruction']);

  const tags = computed(() => {
    return [...getTestAutoTags(props.test)];
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testAddTop-info {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .testAddTop-info-tagNew {
    border-radius: $border-radius-light;
    padding: 0.25rem 0.5rem;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    background: $color-violet-normal;
  }

  .testAddTop-info-tag {
    color: $color-dark;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .testAddTop-info-tag-icon {
    width: 0.938rem;
    height: 0.938rem;
  }

  .testAddTop-header {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }

  .testAddTop-header-title {
    margin-bottom: 0;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  .testAddTop-tags {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;

    &:empty {
      display: none;
    }
  }

  .testAddTop-stat {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.438rem;
    margin-top: 1.5rem;
    color: $color-dark;
  }

  .testAddTop-description {
    margin-top: 1rem;
  }

  .testAddTop-showInstruction {
    display: flex;
    margin-top: 1rem;
  }
</style>
