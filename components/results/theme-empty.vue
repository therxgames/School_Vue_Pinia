<template>
  <div class="border-bottom emptytheme-grid">
    <h5 class="my-0">{{ theme.name }}</h5>
    <p class="my-0 text-center">Материалы по данной теме вскоре<br>будут добавлены в систему</p>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.emptytheme-grid {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 2rem;
    padding: 2rem;

    h5 {
      font-weight: 400;
      line-height: 1.5;
    }
  }
</style>
