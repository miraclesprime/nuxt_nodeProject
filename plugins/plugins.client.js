import Vue from 'vue'
import Vuelidate from 'vuelidate'
import vClickOutside from 'v-click-outside'
// import VueScrollTo from 'vue-scrollto';
import BibUILibrary from "~/node_modules/@bizinbox/bib-ui-lib/dist/library";
// import VueColumnsResizable from '~/node_modules/vue-columns-resizable';

// Vue.use(VueColumnsResizable);
Vue.use(BibUILibrary)

Vue.use(Vuelidate)
Vue.use(vClickOutside)
// Vue.use(VueScrollTo, {
//   container: "#ts-of-scroll-y",
//   duration: 1500,
//   easing: 'ease-out'
// });