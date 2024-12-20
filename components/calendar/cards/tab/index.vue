<template>
  <div class="tab" :class="{[type]: type}">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  display: flex;
  padding: 4px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.2px;
  text-align: center;
}

.tag {
  border: 1px solid #DDDEE0;
  background: #FFF;
  color: #0C1524;
  text-wrap: wrap;
}

.status-online {
  background: #21BD4F;
  color: #FFF;
}

.status-online-passed {
  color: black;
  background-color: rgb(243 243 241/1);
}
</style>

<script setup>
const props = defineProps({
  type: {
    required: true
  },
})
</script>
