<template>
  <major-header />
  <major-assistant />
  <major-results v-if="isStudent" />
  <major-main v-if="!isStudent" />
  <major-learn-playful v-if="!isStudent" />
  <major-materials-slider v-if="isStudent" />
  <major-events-slider v-if="isStudent" />
  <major-interesting-materials v-if="!isStudent" />
  <major-interesting-events v-if="!isStudent" />
  <faq :class="{'mt-0': isStudent}" />
  <get-access v-if="!isStudent" />
</template>

<script setup>
import useUserStore from '~/stores/user';

const userStore = useUserStore();
const isStudent = computed(() => userStore.userIsStudent);
</script>

<style lang="scss">
@import '/assets/scss/theme';

.main-page {
  max-width: 920px;
  margin: 0 auto;
}
</style>
