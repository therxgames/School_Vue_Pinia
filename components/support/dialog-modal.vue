<template>
  <div
    class="modal fade show"
    :class="showClass"
    style="display: block;">
    <div v-if="customSlot"
         class="modal-dialog modal-dialog-centered"
         style="max-width: 368px;max-height: 80vh;">
      <div class="modal-content">
        <slot name="customSlot" />
      </div>
    </div>
    <div v-else-if="!customSlot"
         class="modal-dialog modal-dialog-centered"
         style="max-width: 560px;max-height: 80vh;">
      <div class="modal-content p-3">
        <div class="d-flex align-items-center justify-content-between">
          <div class="modal-title fs-5">
            <slot name="title" />
          </div>
        </div>
        <div class="modal-body bg-light rounded my-4 d-flex">
          <div class="px-2 lh-lg modal-body-scroll" ref="scrollContainer"
               @wheel="wheeling">
            <slot name="body" />
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <slot name="buttons" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  customSlot: {
    type: Boolean,
    required: false,
    default: false
  }
})

const showClass = computed(() => (props.isShow ? 'show' : 'hide'))
const scrollContainer = ref(null)

function bodyScrollStop (e) {
  e.preventDefault()
}

function wheeling (e) {
  const wheelUp = e.deltaY < 0
  const wheelDown = e.deltaY > 0
  const top = scrollContainer.value.scrollTop === 0
  const bottom = scrollContainer.value.offsetHeight === scrollContainer.value.scrollHeight - scrollContainer.value.scrollTop
  if ((wheelUp && !top) || (wheelDown && !bottom)) {
    e.stopPropagation()
  }
}

onMounted(() => {
  window.addEventListener('wheel', bodyScrollStop, { passive: false })
})
onBeforeUnmount(() => {
  window.removeEventListener('wheel', bodyScrollStop)
})
</script>

<style lang="scss" scoped>
.modal {
  background: #00000080;
}

.hide {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
}

.modal-body-scroll {
  width: 100%;
  max-height: 50vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
