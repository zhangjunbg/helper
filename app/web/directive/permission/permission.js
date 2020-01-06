import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const {
      value
    } = binding
    const btnAuth = store.getters && store.getters.btnAuth;
    if (value) {
      if (!btnAuth[value]) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}