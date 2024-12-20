<template>
  <div :class="{'image-wrapper-placeholder': !isCorrectSrc(path), [displayType]: displayType}">
    <calendar-cards-tab
        v-if="status"
        class="card-status"
        :type="isPassed ? 'status-online-passed' : 'status-online'"
    >
      онлайн
    </calendar-cards-tab>

    <img
        v-if="isCorrectSrc(path) && !showImage"
        :src="path"
        alt="card"
        class="image"
        @error="showImage = true"
    >

    <svg-icon v-else name="calendar-card-placeholder" class="image"/>
  </div>
</template>

<style lang="scss" scoped>
.image-wrapper-placeholder {
  padding: 16px 48px;
}

.tile {
  position: relative;
  height: 160px;
  width: 100%;
  margin-bottom: 24px;
  border-radius: 8px;
  background: #F0F2FC;
  flex-shrink: 0;
}

.list {
  position: relative;
  height: 120px;
  width: 160px;
  border-radius: 8px;
  background: #F0F2FC;
  flex-shrink: 0;
  margin-right: 32px;
}

.card-status {
  position: absolute;
  left: 4px;
  top: 4px;
  z-index: 2;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 8px;
}
</style>


<script setup lang="ts">
import {isCorrectSrc} from "~/components/calendar/cards/helper";

const props = defineProps({
  path: {
    required: true
  },
  status: {
    required: true
  },
  isPassed: {
    required: true
  },
  displayType: {
    required: true
  },
})

const showImage = ref(false)
</script>
