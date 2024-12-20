<template>
  <div>
    <div
      class="rounded-3 p-3 item position-relative"
      :style="{background: props.backgroundColor}">
      <div class="title">
        Урок
      </div>
      <div class="body">
        <p>
          <a
            target="_blank"
            :href="props.link">{{ props.bodyText }}</a>
        </p>
      </div>
      <svg-icon
        class="pic"
        :name="props.subjectPic"/>
    </div>
    <div class="mt-1 classText">
      {{ props.classText }}
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    subjectPic: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    bodyText: {
      type: String,
      default: ''
    },
    classText: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  });
</script>

<style lang="scss">
  .item {
    width: 236px;
    height: 236px;
  }

  .title {
    font-size: 14px;
    line-height: 140%;
    color: #7f838a;
  }

  .body {
    font-size: 16px;
    line-height: 24px;
    color: #0c1524;
  }

  .classText {
    font-size: 14px;
    line-height: 140%;
    color: #7f838a;
  }

  .pic {
    position: absolute;
    bottom: 10px;
    left: 10px;
    height: 64px;
  }

  a {
    color: #000;
    text-decoration: none;
  }
</style>
