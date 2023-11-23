import Vue from 'vue'
import Vuelidate from 'vuelidate'
import vClickOutside from 'v-click-outside'
// import BibUILibrary from "~/node_modules/@bizinbox/bib-ui-lib/dist/library";
import BibUILibrary from '@bizinbox/bib-ui-lib'

// Vue.use(BibUILibrary)

Vue.use(Vuelidate)
Vue.use(vClickOutside)

export default ({ store }, inject) => {
    Vue.use(BibUILibrary, { store })
}