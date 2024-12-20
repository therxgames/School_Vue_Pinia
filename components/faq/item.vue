<template>
  <div class="faq-item">
    <div class="faq-header" @click="emit('toggle', props.data.id);">
      {{ data.title }}
      <div class="faq-header__icon">
        <svg-icon name="plus" v-if="!data.opened" />
        <svg-icon name="minus" v-if="data.opened" />
      </div>
    </div>
    <div class="faq-content" v-if="data.opened">
      {{ data.content }}
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['toggle']);

const props = defineProps({
  data: {
    required: true
  },
});
</script>

<style lang="scss" scoped>
.faq-item {
  &:not(:last-child) {
    border-bottom: 1px solid #f3f3f1;
  }
}

.faq-header {
  cursor: pointer;
  position: relative;
  font-size: 20px;
  font-weight: 500;
  line-height: 140%;
  padding: 16px 50px 16px 0;
  transition: 0.3s ease-out;

  &:hover {
    color: #1b59f5;
  }

  &__icon {
    width: 25px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    stroke: currentColor;

    .svg-icon {
      position: absolute;
      inset: 0;
      margin: auto;
    }
  }
}

.faq-content {
  max-width: 768px;
  font-size: 18px;
  font-weight: 400;
  line-height: 165%; /* 29.7px */
  letter-spacing: -0.2px;
  padding-bottom: 32px;
}
</style>
