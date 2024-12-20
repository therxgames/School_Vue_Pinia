<template>
  <div class="detail-author">
    <h3 class="mb-0">Авторы</h3>

    <div>
      <input-button-url v-if="!!provider?.url" :url="provider?.url">
        {{ provider?.name }}
      </input-button-url>
  
      <p v-else class="detail-author-title">{{ provider?.title }}</p>
  
      <p v-if="!!provider?.description" class="detail-author-description">{{ provider?.description }}</p>
    </div>

    <div class="detail-author-logo" v-if="!!provider?.logo?.url">
      <img class="detail-author-logo-img" :src="provider?.logo?.url" />
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  provider: {
    type: Object,
  }
});
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.detail-author {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
    margin-bottom: 0;
  }

  &-description {
    color: #93979e;
    margin-bottom: 0;
  }

  &-logo {
    width: 100%;
    height: 100%;

    &-img {
      object-fit: cover;
      width: auto;
      max-height: 80px;
    }
  }
}
</style>
