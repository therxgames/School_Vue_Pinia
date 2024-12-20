<template>
  <div class="topic-banner">
    <svg-icon name="feather"/>

    <div class="my-4">
      Создавайте собственные тематические тесты
    </div>

    <a
      href="/training/create-task"
      class="topic-banner-tryBtn btn btn-simple">
      Попробовать
    </a>
  </div>
</template>

<style lang="scss">
  .topic-banner {
    border-radius: 1rem;
    background-color: #e6f2ff;
    padding: 2rem;
    font-weight: 500;

    .svg-icon {
      width: 4rem;
      height: 4rem;
    }
  }

  .topic-banner-tryBtn {
    --bs-btn-padding-x: 1.5rem;
  }
</style>
