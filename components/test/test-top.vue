<template>
  <div class="testTop">
    <div
      v-if="versionsFeatureAllow"
      class="testTop-versions">
      <h1 class="testTop-versions-title">
        Тест #{{ test.parent_id }}
      </h1>

      <common-test-version-selector
        :current-test-id="+route.params.id"
        :test-parent-id="test.parent_id"/>
    </div>

    <test-versions-difference
      class="mb-3"
      v-if="versionsFeatureAllow"
      :test-parent-id="test.parent_id"
      :version-one="+route.params.id"/>

    <div class="testTop-info">
      <div
        v-if="test.is_new && userStore.userIsStudent"
        class="testTop-info-tagNew">
        Новый
      </div>

      <div class="testTop-info-tag">
        <svg-icon
          class="testTop-info-tag-icon"
          name="tag"/>
        <span>{{ test.id }}</span>
      </div>
    </div>

    <div class="testTop-header">
      <svg-icon
        :class="[{'favorite': test.is_favorite}, {'disabled': userStore.currentRole !== 'student'}]"
        class="testTop-header-toFavorite"
        name="star-filled"
        @click="emit('toggle-favorite')"/>

      <h1 class="testTop-header-title">
        {{ test.name }}
      </h1>
    </div>

    <div class="testTop-tags">
      <div
        v-if="test.in_archive"
        class="testTop-tags-archive tag">
        Архив
      </div>

      <common-tag
        v-for="(tag, index) in tags"
        :key="index"
        :data="tag"/>
    </div>

    <div class="testTop-stat">
      <div
        v-tooltip="viewTpOpts"
        class="testTop-views">
        <svg-icon
          class="testTop-views-icon"
          name="persons"/>
        <span class="testTop-views-value">
          {{ test.solutions_count || 0 }}
        </span>
      </div>
      <div class="testTop-dot"/>
      <div>
        Составлен {{ formatDate(test.created_at, 'd MMM yyyy г.') }}
      </div>
    </div>

    <div
      class="testTop-description"
      v-html="test.description_text || 'Описание отсутствует'"/>

    <a
      v-if="test.instruction_wtext"
      href="#"
      class="testTop-showInstruction"
      @click.prevent="emit('show-instruction')">
      Инструкция
    </a>
  </div>
</template>

<script setup>
  import useUserStore from '~/stores/user';

  const props = defineProps({
    test: {type: Object, required: true}
  });

  const emit = defineEmits(['toggle-favorite', 'show-instruction']);

  const userStore = useUserStore();
  const route = useRoute();

  const tags = computed(() => {
    return [...getTestAutoTags(props.test)];
  });

  const viewTpOpts = computed(() => ({
    title: () => `
      <span class="text-nowrap">
        Тест
        ${declension(props.test.solutions_count, lexicon.decl.passed)}
        ${props.test.solutions_count} ${declension(props.test.solutions_count, lexicon.decl.peoples)}
      </span>
    `
  }));

  const versionsFeatureAllow = computed(() => {
    return userStore.logged && (userStore.currentRole === role.ADMIN || userStore.currentRole === role.USER);
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .testTop-versions {
    display: flex;
    margin-bottom: 1rem;
  }

  .testTop-versions-title {
    margin-right: 1rem;
    margin-bottom: 0;
  }

  .testTop-info {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .testTop-info-tagNew {
    border-radius: $border-radius-light;
    padding: 0.25rem 0.5rem;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    background: $color-violet-normal;
  }

  .testTop-info-tag {
    color: $color-dark;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .testTop-info-tag-icon {
    width: 0.938rem;
    height: 0.938rem;
  }

  .testTop-header {
    display: flex;
    align-items: baseline;
    margin-top: 1rem;
    margin-left: -2.4rem;
    gap: 1rem;
  }

  .testTop-header-title {
    margin-bottom: 0;
    padding-right: 10%;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  .testTop-header-toFavorite {
    color: $color-dark;
    cursor: pointer;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;

    &:hover,
    &.favorite {
      color: $color-yellow-normal;

      path {
        opacity: 1 !important;
      }
    }

    &.disabled {
      opacity: 0;
      pointer-events: none;
    }
  }

  .testTop-tags {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;

    &:empty {
      display: none;
    }
  }

  .testTop-tags-archive {
    cursor: auto;
    background: #ffe4cc;
    color: #e56109;

    &:hover {
      background: #ffe4cc;
      color: #e56109;
    }
  }

  .testTop-stat {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.438rem;
    margin-top: 1.5rem;
    color: $color-dark;
  }

  .testTop-views {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .testTop-views-icon {
    width: 1.2rem;
    height: 1rem;
  }

  .testTop-dot {
    width: 2px;
    height: 2px;
    border-radius: 10px;
    display: inline-block;
    background: $color-dark;
  }

  .testTop-description {
    margin-top: 1rem;
  }

  .testTop-showInstruction {
    display: flex;
    margin-top: 1rem;
  }
</style>
