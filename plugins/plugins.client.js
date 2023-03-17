import Vue from 'vue'
import Vuelidate from 'vuelidate'
import vClickOutside from 'v-click-outside'
import VueScrollTo from 'vue-scrollto';
// import BibUILibrary from '@bizinbox/bib-ui-lib'
import BibUILibrary from "~/node_modules/@bizinbox/bib-ui-lib/dist/library";

Vue.use(BibUILibrary)

Vue.use(Vuelidate)
Vue.use(vClickOutside)
Vue.use(VueScrollTo, {
  container: "#ts-of-scroll-y",
  duration: 1200,
  easing: 'ease-out'
});