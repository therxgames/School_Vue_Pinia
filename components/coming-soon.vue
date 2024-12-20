<template>
  <div class="comingSoon">
    <div class="comingSoon-title">
      цифровой помощник<br>ученика
    </div>
    <div class="comingSoon-info">
      открытие <span class="comingSoon-date">в&nbsp;мае&nbsp;2023</span>
    </div>
    <div class="comingSoon-image">
      <svg-icon name="coming-soon"/>
    </div>
  </div>
</template>

<style lang="scss">
  .comingSoon-title {
    position: fixed;
    left: 2rem;
    top: 2rem;
    right: 2rem;
    font-size: 40px;
    line-height: 48px;
  }

  .comingSoon-info {
    position: fixed;
    left: 2rem;
    bottom: 2rem;
    font-size: 26px;
    line-height: 34px;
    margin-right: 10rem;
  }

  .comingSoon-date {
    color: #2962ff;
  }

  .comingSoon-image {
    position: fixed;
    right: 2rem;
    bottom: 0;
    width: 50px;
    height: 114px;

    .svg-icon {
      width: 100%;
      height: 100%;
    }
  }

  @media (min-width: 360px) {
    .comingSoon-title {
      top: 3rem;
      left: 3rem;
      right: 3rem;
      font-size: 48px;
      line-height: 56px;
    }

    .comingSoon-info {
      bottom: 3rem;
      left: 3rem;
      font-size: 28px;
      line-height: 36px;
    }

    .comingSoon-image {
      right: 3rem;
      width: 60px;
      height: 137px;
    }
  }

  @media (min-width: 480px) {
    .comingSoon-title {
      font-size: 60px;
      line-height: 66px;
    }

    .comingSoon-info {
      font-size: 38px;
      line-height: 45.6px;
    }
  }
</style>
