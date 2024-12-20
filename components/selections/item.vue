<template>
  <nuxt-link :to="`/collections/details/${item.id}`" class="selections-item-link">
    <div class="selections-item" :class="`selection-${selectionType}-type`">
      <div class="selections-item-box">
        <div class="selections-item-box-absolute" />
        <div class="selections-item-limit" v-if="!!item?.contentLimit && item.contentLimit > 0">
          <p>{{ item.contentLimit }}</p>
        </div>
  
        <div class="selections-item-title" v-if="!!item?.title">
          <h1>{{ item?.title }}</h1>
        </div>
    
        <div class="selections-item-description" v-if="!!item?.description">
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
  },
});

const selectionType = computed(() => props.item?.selectionType?.code || '');
</script>

<style lang="scss">
@import '/assets/scss/theme';

.selections-item {
  display: flex;
  align-items: center;
  background: rgb(243, 243, 241);
  border-radius: 15px;
  border: 4px solid rgb(243, 243, 241);
  padding: 48px 0;
  cursor: pointer;
  position: relative;
  height: 512px;
  transition: 0.2s;
  overflow: hidden;

  &-link {
    color: #000;
  }

  &:hover {
    background: #dddee0;
    border: 4px solid #dddee0;
  }

  &:hover &-title {
    color: rgb(37, 76, 232);
  }

  &:hover &-box-absolute {
    top: -80px;
    bottom: -80px;
  }

  &-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 16px;
    padding: 64px 32px;
    text-align: center;
    isolation: isolate;
    position: relative;
    transition: 0.2s;
    aspect-ratio: 14/16;

    &-absolute {
      position: absolute;
      z-index: -10;
      transform: rotate(-3deg);
      top: 0;
      bottom: 0;
      left: -40px;
      right: -40px;
      background: #FFF;
      transition: 0.2s;
    }
  }

  &-title {
    transition: color 0.2s;

    h1 {
      margin-bottom: 0;
    }
  }

  &-limit {
    p {
      line-height: 1;
      font-size: 60px;
      margin-bottom: 0;
    }
  }

  &-description {
    p {
      font-size: 14px;
      color: rgb(147, 151, 158);
      margin-bottom: 0;
    }
  }
}

.selection-events-type {
  background: #EFF9DC;
  border: 4px solid #EFF9DC;

  &:hover {
    background: #C0E874;
    border: 4px solid #C0E874;
  }
}

.selection-materials-type {
  background: #FFDDD9;
  border: 4px solid #FFDDD9;

  &:hover {
    background: #F8968A;
    border: 4px solid #F8968A;
  }
}

.selection-new-type {
  background: #E4F1FF;
  border: 4px solid #E4F1FF;

  &:hover {
    background: #9ECAF9;
    border: 4px solid #9ECAF9;
  }
}

</style>
