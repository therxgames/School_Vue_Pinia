<template>
    <div
      class="modal fade show"
      :class="showClass"
      @click.self="closeModal"
      style="display: block;">
      <div
        class="modal-dialog modal-dialog-centered"
        style="max-width: 684px;">
        <div class="modal-content p-4">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <p class="modal-title">
              <slot name="title"/>
            </p>
            <button
              type="button"
              class="btn-close btn-sm btn"
              @click="closeModal"/>
          </div>
          <div class="rounded d-flex">
            <div class="lh-lg">
              <slot name="body"/>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <slot name="buttons"/>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import useUploadsStore from '~/stores/admin-files';
    const store = useUploadsStore();
    const emit = defineEmits(['close']);
  
    const props = defineProps({
      isShow: {
        type: Boolean,
        required: true
      },
    });
  
    watch(
      () => props.isShow,
      () => {
        if (props.status === 'warning' || props.status === 'issue') {
          store.modalBusy = props.isShow;
        }
      }
    );
  
    const body = ref(null);
  
    function closeModal() {
      body.value.classList.remove('body-scroll-hide');
      emit('close');
    }
    const showClass = computed(() => (props.isShow ? 'show' : 'hide'));

    onMounted(() => {
      body.value = document.body;
      body.value.classList.add('body-scroll-hide');
    });
  </script>
  
  <style lang="scss" scoped>
    .modal {
      background-color: rgba(12,21,36,.6);
    }
  
    .hide {
      position: absolute;
      overflow: hidden;
      width: 0;
      height: 0;
    }
  
    .status {
      min-width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      margin-right: 1em;
  
      .svg-icon {
        width: 12px;
        height: 12px;
      }
  
      &-success {
        background: #3db45a;
      }
  
      &-issue {
        background: #0576ff;
      }
  
      &-warning,
      &-error {
        background: #f85542;
      }
  
      &-warning {
        border-radius: 50%;
      }
    }
  </style>
  