import Vue from 'vue'

Vue.directive('format-status', {
  bind: (el, binding, vnode) => {
    /*1 Not Started
    2 In-Progress
    3 Waiting
    4 Deferred
    5 Done*/
    switch (binding.value) {
      case 1:
        el.classList.add("text-secondary")
        break;
      case 2:
        el.classList.add("text-blue")
        break;
      case 3:
        el.classList.add("text-orange")
        break;
      case 4:
        el.classList.add("text-red")
        break;
      default:
        el.classList.add("text-green")
        break;
    }

  }
})
