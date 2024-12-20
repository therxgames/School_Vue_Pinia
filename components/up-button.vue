<template>
  <div
    class="btn-up"
    :class="{'d-none': hide}"
    @click="onTop">
    <svg-icon
      name="arrow-up"/>
  </div>
</template>

<script setup>
const hide = ref(true);

const onScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  scrollY > 600 ? hide.value = false : hide.value = true;
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

const onTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

</script>

<style lang="scss">
@import '/assets/scss/theme';

.btn-up {
  position: fixed;
  width: 40px;
  height: 36px;
  border-radius: $border-radius;
  color: $color-black;
  left: 21px;
  top: 80px;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shows 350ms;
  cursor: pointer;
  transition: all 150ms linear;

  &:hover {
    color: $color-black;
    background: $color-black-10;
  }
}

@keyframes shows {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
