<template>
  <div
    ref="modal"
    class="modal fade modal-alert">
    <div
      ref="modalDialog"
      class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ data.title }}
          </h5>
          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            <svg-icon name="cross"/>
          </div>
        </div>
        <div
          :class="[
            {'modal-body--top-gradient': contentScrollStatus && contentScrollStatus?.offset?.y > 0},
            {'modal-body--bottom-gradient': contentScrollStatus && contentScrollStatus?.offset?.y > 0 && contentScrollStatus?.offset?.y !== contentScrollStatus?.limit?.y}
          ]"
          class="modal-body">
          <template v-if="data.contentComponent">
            <component
              :context="getContext()"
              :data="data.additionalData"
              :is="resolvedContentComponent"
              @progress="setProgress(progress)"
              @event="onContentComponentEvent"/>
          </template>
          <template v-else-if="data.content">
            <div
              ref="contentScroller"
              class="modal-alert-content-scroller scroller-default">
              <div
                class="modal-alert-content"
                v-html="data.content"/>
            </div>
          </template>
          <template v-else-if="data.contentRaw">
            <div
              ref="contentScroller"
              class="modal-alert-content-scroller scroller-default">
              <div
                class="modal-alert-content"
                style="white-space: pre;">
                {{ data.contentRaw }}
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <template v-if="data.buttons?.length && data.hideAllButtons !== true">
            <button
              v-for="(button, index) in data.buttons"
              :key="index"
              class="btn"
              :class="[button.class || 'btn-primary']"
              @click="customButtonClick(button)">
              <svg-icon
                v-if="button.icon?.name"
                :class="['modal-alert-btn-icon', button.icon.class]"
                :name="button.icon.name"/>
              <span>{{ button.title }}</span>
            </button>
          </template>
          <template v-else-if="data.hideAllButtons !== true">
            <button
              data-bs-dismiss="modal"
              type="button"
              class="btn btn-primary">
              Oк
            </button>
          </template>
        </div>
        <loader
          class="modal-alert-loader"
          :listener="progress"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import SmoothScrollbar from 'smooth-scrollbar';

  const modal = ref(null);
  const modalDialog = ref(null);
  const contentScroller = ref(null);
  const progress = ref(false);
  const contentScrollStatus = ref({});
  const data = ref({});
  const resolvedContentComponent = computed(() => {
    return data.value.contentComponent
      ? resolveComponent(data.value.contentComponent)
      : null;
  });
  let modalInst = null;
  let smoothScrollBarInst = null;

  onMounted(() => {
    modalInst = new window.$bootstrap.Modal(modal.value);

    eventBus.on('alert:show', show);
  });

  onUnmounted(() => {
    if (modalInst) {
      modalInst.hide();
    }

    eventBus.off('alert:show', show);
    window.removeEventListener('popstate', onPopstate);
  });

  const onPopstate =(e)=>{
    hide();
    // window.history.forward();
    window.removeEventListener('popstate', onPopstate);
  }

  const onShowBsModal = () => {
    if (typeof data.value.onShow === 'function') {
      return data.value.onShow(getContext());
    }
  };
  const onShownBsModal = () => {};
  const onHideBsModal = () => {};
  const onHiddenBsModal = async () => {
    if (typeof data.value.onHidden === 'function') {
      data.value.onHidden(getContext());
    }
    if (data.value.contentComponent) {
      data.value.contentComponent = null;
    }
    if (data.value.content) {
      data.value.content = null;
    }
    if (data.value.contentRaw) {
      data.value.contentRaw = null;
    }
    if (smoothScrollBarInst && contentScroller.value) {
      SmoothScrollbar.destroy(contentScroller.value);
    }
  };
  const onHidePreventedBsModal = () => {};

  const show = async (_data = {}) => {
    data.value = _data;
    await nextTick();
    defineEvents();
    setMaxWidth();
    setContentMaxHeight();
    modalInst.show();
  };
  const hide = async () => {
    modalInst.hide();
    await sleep(250);
  };
  const defineEvents = () => {
    if (modal.value) {
      unbindEvents();
      modal.value.addEventListener('show.bs.modal', onShowBsModal);
      modal.value.addEventListener('shown.bs.modal', onShownBsModal);
      modal.value.addEventListener('hide.bs.modal', onHideBsModal);
      modal.value.addEventListener('hidden.bs.modal', onHiddenBsModal);
      modal.value.addEventListener('hidePrevented.bs.modal', onHidePreventedBsModal);
      window.addEventListener('popstate', onPopstate);
    }
  };
  const unbindEvents = () => {
    if (modal.value) {
      modal.value.removeEventListener('show.bs.modal', onShowBsModal);
      modal.value.removeEventListener('shown.bs.modal', onShownBsModal);
      modal.value.removeEventListener('hide.bs.modal', onHideBsModal);
      modal.value.removeEventListener('hidden.bs.modal', onHiddenBsModal);
      modal.value.removeEventListener('hidePrevented.bs.modal', onHidePreventedBsModal);
    }
  };
  const setProgress = async (_progress, delay = 0) => {
    await sleep(delay);
    progress.value = _progress;
  };
  const getContext = () => {
    return {
      show,
      hide,
      setProgress
    };
  };
  const customButtonClick = (button) => {
    if (typeof button.click === 'function') {
      return button.click(button, getContext());
    }
    return hide();
  };
  const setMaxWidth = () => {
    if (!modalDialog.value) {
      return;
    }
    modalDialog.value.style.setProperty('--bs-modal-width', data.value.maxWidth || '500px');
  };
  const setContentMaxHeight = () => {
    if (!contentScroller.value) {
      return;
    }
    contentScroller.value.style.setProperty('--bs-content-max-height', data.value.maxContentHeight || 'none');
    createContentScroller();
  };
  const createContentScroller = (options = {alwaysShowTracks: true}) => {
    if (!contentScroller.value) {
      return;
    }
    smoothScrollBarInst = SmoothScrollbar.init(contentScroller.value, options);
    smoothScrollBarInst.addListener((status) => contentScrollStatus.value = status);
  };
  const onContentComponentEvent = (event) => {
    data.value[event.type]?.call(null, event, getContext());
  };

  defineExpose(getContext());
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .modal-alert {
    .modal-dialog {
      --bs-modal-width: 500px;
    }

    .modal-body {
      &.modal-body--top-gradient::before {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        height: 0.7rem;
        background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
        z-index: 5;
        top: 2rem;
        pointer-events: none;
      }

      &.modal-body--bottom-gradient::after {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        height: 0.7rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
        z-index: 5;
        bottom: 1rem;
        pointer-events: none;
      }
    }

    .modal-footer {
      padding-top: 0;
      padding-bottom: 1.5rem;
      justify-content: flex-start;
      gap: 0.7rem;

      .btn {
        min-width: 8rem;
      }
    }

    &-content-scroller {
      --bs-content-max-height: none;

      max-height: var(--bs-content-max-height);
      overflow: hidden;
      margin-right: -1rem;
      padding-right: 1.5rem;
    }

    &-btn-icon {
      --svg-icon-width: 1em;
      --svg-icon-height: 1em;
    }

    &-loader {
      border-radius: 0.5rem;

      --loader-max-opacity: 0.9;
      --loader-spinner-width: 2.5rem;
      --loader-spinner-height: 2.5rem;
    }
  }
</style>
