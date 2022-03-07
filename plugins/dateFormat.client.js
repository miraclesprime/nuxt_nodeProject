import Vue from 'vue'

Vue.directive('format-date', {
  bind: (el, binding, vnode) => {
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    if (binding.value) {
      let d = new Date(binding.value);
      // let m = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let m = d.getMonth()
      el.innerHTML = `${d.getDate()} ${months[m]} ${d.getFullYear()}`
    }
  }
})
