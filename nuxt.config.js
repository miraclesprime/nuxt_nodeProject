import { resolve } from "path";
import local_en from './config/lang/en.json'
import global_en from './node_modules/@bizinbox/bib-ui-lib/dist/lang/global_en.json'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  // head: {
  //   title: "BIB Tasks & Projects",
  //   meta: [
  //     { charset: "utf-8" },
  //     { name: "viewport", content: "width=device-width, initial-scale=1" },
  //     { hid: "description", name: "description", content: "" },
  //   ],
  //   link: [
  //     { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  //   ],
  // },

  css: ["~/assets/global.scss"],
  axios: {
    // proxy: true,
    baseURL: process.env.VUE_APP_API_ENDPOINT || "http://localhost:9000",
  },
  /// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/plugins.client.js",
    "~/plugins/axios.js",
    "~/plugins/dayjs.client.js",
    "~/plugins/dateFormat.client.js",
    "~/plugins/statusFormat.client.js",
    "~/plugins/priorityFormat.client.js",
    "~/plugins/datepicker.client.js",
    "~/plugins/logout.js",
    // "~/plugins/chatLink.client.js",
    // "~/plugins/userInfo.js",
    "~/utils/userInfo.client.js",
    "~/utils/utils.client.js",
    "~/utils/color.client.js",
    // "~/../bib-shared/js/colors.js",
    // "~/../bib-shared/js/plugins.js",
    // "~/../bib-shared/plugins/datepicker.js",
    ],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    { path: "~/components/", pathPrefix: false },
    { path: "~/components/elements/", pathPrefix: false },
    // { path: "~/../bib-shared/components/", pathPrefix: false },
  ],
  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    "cookie-universal-nuxt",
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/proxy",
    "@nuxtjs/dotenv",
    "@nuxtjs/dayjs",
    "@nuxtjs/style-resources",
    [
      "nuxt-i18n",
      {
        vueI18nLoader: true,
        defaultLocale: 'en',
        locales: [
          {
            code: "en",
            name: "English",
          },
        ],
        globalInjection: true,
        // vueI18n: i18n,
        vueI18n: {
          locale: "en",
          fallbackLocale: "en",
          messages: { en: { ...global_en, ...local_en } },
        },
      }
    ],
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],
  styleResources: {
    scss: [
      /*"../bib-shared/css/colors.scss",
      "../bib-shared/css/variables.scss",
      "../bib-shared/css/mixins.scss",
      "../bib-shared/css/utilities.scss",
      "../bib-shared/css/basic.scss",*/
      "~/assets/variable.scss",
      // "../bib-shared/css/global.scss",
      "~/node_modules/@bizinbox/bib-ui-lib/dist/utilities.scss",
    ],
  },
  /*router: {
  //   // base: '/dashboard',
    middleware: ["redirects"],
    // trailingSlash: false
  },*/
  serverMiddleware: ["~/middleware/redirects"],
  // proxy: {
  //   '/auth': {
  //     target: process.env.VUE_APP_API_ENDPOINT+'/auth',
  //     pathRewrite: { '^/auth': '' },
  //     changeOrigin: true
  //   },
  // },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, { loaders }) {
      loaders.scss.additionalData = '@use "sass:math";';
    },
  },
  alias: {
    config: resolve(__dirname, "./config"),
    services: resolve(__dirname, "./services"),
    dummy: resolve(__dirname, "./dummy"),
  },
  loading: {
    color: "#2ba026",
    height: 0
  },
  dayjs: {
    locales: ["en", "ca"],
    defaultLocale: "en",
    defaultTimeZone: "Canada/Toronto",
    plugins: ["utc", "timezone", "weekday", "localizedFormat", "isSameOrAfter"],
  },
  server: {
    port: 4000,
  },
  ssr: true,
  target: "static",
  /*auth: {
    plugins: ["~/plugins/authentication"],
    redirect: {
      login: process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL + "/mytasks",
      callback: false,
      home: false
    },
    strategies: {
      local: {
        autoFetchUser: false,
        tokenName: "Authorization",
        required: true,
        tokenType: "Bearer"
      }
    }
  }*/
};