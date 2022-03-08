import Vue from 'vue'

Vue.directive('format-priority', {
  bind: (el, binding, vnode) => {

    switch (binding.value) {
      case 1:
        el.classList.add("text-red")
        break;
      case 2:
        el.classList.add("text-orange")
        break;
      default:
        el.classList.add("text-green")
        break;
    }
  }
})
