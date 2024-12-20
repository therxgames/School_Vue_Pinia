<template>
  <div
    :class="`task-tile--${props.subjectClass}`"
    class="task-tile">
    <div class="task-tile-content">
      <div class="task-tile-header">
        <div class="task-tile-header-top">
          <div class="task-tile-header-top-left-col">
            <div class="task-tile-header-tag">
              Урок
            </div>
          </div>
        </div>
        <div class="task-tile-header-title">
          <h3 class="task-tile-title mb-0">
            {{ props.title || lexicon.common.no_title }}
          </h3>
          <div
            v-if="props.title.length > 20"
            class="task-tile-title-shadow"/>
        </div>
        <div class="task-tile-header-bottom">
          <div
            class="task-tile-header-part">
            <svg-icon
              class="task-tile-header-icon"
              :name="props.subjectLogo"/>
          </div>
        </div>
      </div>
      <nuxt-link
        class="task-tile-link"
        :to="props.link"
        target="_blank"/>
      <div class="task-tile-footer mt-2">
        <div class="task-tile-footer-row">
          <span class="text-nowrap">{{ props.classes }} кл</span>
          <span class="task-tile-footer-row-dot"/>
          <span class="text-cut text-nowrap">{{ props.subject }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      default: 'Название'
    },
    subject: {
      type: String,
      default: 'Предмет'
    },
    classes: {
      type: Number,
      default: 0
    },
    link: {
      type: String,
      default: '/'
    },
    subjectLogo: {
      type: String,
      default: ''
    },
    subjectClass: {
      type: String,
      default: 'history'
    }
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .task-tile {
    &-header-icon {
      width: 4rem;
      height: 4rem;
    }

    @each $subject, $color in $subjects {
      .task-tile--#{$subject} &-header {
        background: $color;
      }

      .task-tile--#{$subject} &-title-shadow {
        background: linear-gradient(180deg, rgba($color, 0.5) 0%, $color 100%);
      }
    }

    @each $subject, $color in $subjects-cok {

      .task-tile--#{$subject} &-header-icon {
        color: $color;
      }
    }
  }
</style>
