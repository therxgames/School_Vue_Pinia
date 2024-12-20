const tooltipDirective = {
  created(el, binding, vnode, prevVnode) {},
  mounted(el, binding, vnode, prevVnode) {
    const {value} = binding;
    el._tooltip = new window.$bootstrap.Tooltip(el, {
      animation: true,
      html: true,
      placement: 'top',
      ...value
    });
  },
  updated(el, binding, vnode, prevVnode) {
    el._tooltip?.hide();
    el._tooltip?.update();
  },
  unmounted(el, binding, vnode, prevVnode) {
    el._tooltip?.dispose();
    el._tooltip = null;
  },
  getSSRProps(binding, vnode) {
    return {};
  }
};
const specTitle = {
  created(el, binding, vnode, prevVnode) {},
  mounted(el, binding, vnode, prevVnode) {
    const {value} = binding;
    const element = document.createElement('a');
    element.innerHTML = value;
    el.setAttribute('title', element.innerHTML);
  },
  updated(el, binding, vnode, prevVnode) {
    const {value} = binding;
    const element = document.createElement('a');
    element.innerHTML = value;
    el.setAttribute('title', element.innerHTML);
  },
  unmounted(el, binding, vnode, prevVnode) {

  },
  getSSRProps(binding, vnode) {
    return {};
  }
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tooltip', tooltipDirective);
  nuxtApp.vueApp.directive('spec-title', specTitle);
});
