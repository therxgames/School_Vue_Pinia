<template>
  <div class="taskItem-commonQuestion">
    <div
      v-if="props.num !== null"
      class="taskItem-commonQuestion-num">
      {{ num }}.
    </div>

    <div
      v-if="props.tag"
      class="taskItem-commonQuestion-tag">
      {{ tag }}
    </div>

    <common-content
      v-if="showZeroPage && zeroPage"
      :content="zeroPage"
      class="taskItem-commonQuestion-content"/>

    <common-content
      :content="content"
      :components="contentComponents"
      class="taskItem-commonQuestion-content"/>

    <div
      v-if="props.num !== null || props.tag"
      style="clear: both;"/>
  </div>
</template>

<script setup>
  const props = defineProps({
    content: {type: String, default: ''},
    contentComponents: {type: Object, default: null},
    num: {type: Number, default: null},
    tag: {type: String, default: null},
    zeroPage: {type: String, default: null},
    showZeroPage: {type: Boolean, default: true}
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskItem-commonQuestion {
    position: relative;
  }

  .taskItem-commonQuestion-num {
    color: #7f838a;
    float: left;
    padding-right: 0.5rem;
  }

  .taskItem-commonQuestion-tag {
    color: #7f838a;
    float: left;
    padding-right: 0.5rem;
  }

  .taskItem-commonQuestion-content {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
