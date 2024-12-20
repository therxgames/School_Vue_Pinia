<template>
  <div class="tab" :class="{[type]: type}, {'cursor-pointer': cursorPointer}" @click="emit('click')">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  display: flex;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.2px;
  text-align: center;
}

.tag {
  border: 1px solid #DDDEE0;
  background: #FFF;
  color: #0C1524;
}

.status-online {
  background: #21BD4F;
  color: #FFF;
}

.status-online-passed {
  color: rgb(147 151 158);
  background-color: rgb(243 243 241/1);
}
</style>

<script setup>
const emit = defineEmits(['click']);

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  cursorPointer: {
    type: Boolean,
    default: true,
  }
})
</script>
