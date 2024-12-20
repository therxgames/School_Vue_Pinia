<template>
  <footer class="app-footer">
    <div class="app-footer-grid content-container">
      <div class="app-footer-grid-col-1">
        <a
          href="https://ficto.ru/"
          target="_blank"
          v-html="fictoPict"/>
      </div>
      <div class="d-flex flex-column align-items-end">
        <nuxt-link
          to="/support/feedback"
          class="app-footer-feedback icon-text">
          <span>Связаться с нами</span>
        </nuxt-link>
        <a
          class="app-footer-mailto"
          href="mailto:student@tech.edu.ru">student@tech.edu.ru</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import fictoPict from '~/assets/images/footer-ficto.svg?raw';
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .app-footer {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    position: relative;

    &-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    &-tel,
    &-mailto {
      transition: $transition;
      color: #7f838a;
    }

    &-feedback {
      --icon-width: 0.65rem;
      --icon-height: 0.65rem;

      color: $color-blue-normal;

      span {
        font-weight: 500;
      }

      &:hover {
        color: $color-black;
      }
    }
  }
</style>
