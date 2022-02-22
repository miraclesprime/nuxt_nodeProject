import Vue from 'vue'

Vue.directive('format-date', {
  bind: (el, binding, vnode) => {
    if (binding.value) {
      let d = new Date(binding.value);
      let m = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      el.innerHTML = `${d.getDate()}/${m}/${d.getFullYear()}`
    }
  }
})
