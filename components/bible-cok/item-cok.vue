<template>
  <div class="d-flex align-items-center testhover">
    <div
      class="mx-4 p-2 rounded-4 subjectLogo"
      :style="{backgroundColor: props.backgroundColor}">
      <svg-icon
        class="w-100 h-100"
        :name="props.subjectPic"/>
    </div>
    <p class="subjectName">
      {{ props.subjectName }}
    </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    subjectName: {
      type: String,
      default: 'Предмет'
    },
    backgroundColor: {
      type: String,
      default: 'white'
    },
    subjectPic: {
      type: String,
      default: '/'
    }
  });
</script>

<style lang="scss">
  .testhover {
    opacity: 1;
    transition: all 150ms linear;

    p {
      margin: 0;
    }
  }

  .testhover:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  .subjectLogo {
    height: 64px !important;
    width: 64px !important;
  }

  .subjectName {
    font-family: 'Golos';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
</style>
