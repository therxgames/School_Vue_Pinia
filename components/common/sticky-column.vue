<template>
  <div
    ref="rootRef"
    class="stickyColumn">
    <div class="stickyColumn-element">
      <div class="stickyColumn-wrapper">
        <div
          class="stickyColumn-scroll"
          :style="{height: scrollHeight}">
          <div
            ref="contentRef"
            class="stickyColumn-content">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const convertRemToPixels = (rem) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  const rootRef = ref(null);
  const contentRef = ref(null);
  const scrollHeight = ref('100vh');

  onMounted(() => {
    window.addEventListener('scroll', calculateHeight);
    window.addEventListener('resize', calculateHeight);
    calculateHeight();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', calculateHeight);
    window.removeEventListener('resize', calculateHeight);
  });

  const calculateHeight = () => {
    const rootRect = rootRef.value.getBoundingClientRect();
    const rootTop = rootRect.top;
    const rootHeight = rootRef.value.offsetHeight;
    const elementHeight = contentRef.value.offsetHeight + convertRemToPixels(6);

    let diff = rootHeight + rootTop - window.innerHeight;

    if (rootTop > 0) {
      scrollHeight.value = elementHeight + 'px';
    } else if (diff < elementHeight) {
      if (diff < 0) {
        diff = 0;
      }

      let height = window.innerHeight + elementHeight - diff;

      if (height > elementHeight) {
        height = elementHeight;
      }

      scrollHeight.value = height + 'px';
    } else {
      scrollHeight.value = `calc(${window.innerHeight}px + 1rem)`;
    }    
  };
</script>

<style lang="scss">
  .stickyColumn {
    height: calc(100% + 6rem);
  }

  .stickyColumn-element {
    position: sticky;
    top: -1rem;
  }

  .stickyColumn-wrapper {
    overflow: hidden;
    margin: -3rem -2.5rem -3rem -3rem;
  }

  .stickyColumn-scroll {
    margin-right: -100px;
    padding: 3rem 2.5rem 3rem 3rem;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .stickyColumn-content {
    width: 295px;
  }
</style>