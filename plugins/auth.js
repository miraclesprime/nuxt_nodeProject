export default function ({ $axios, store, route, redirect, app }) {
    if (app.$cookies.get('b_ssojwt')) {
        store.commit('setToken', app.$cookies.get('b_ssojwt'));
        $axios.setToken(
            app.$cookies.get('b_ssojwt'),
            "Bearer"
        );
    } else {
        return redirect(process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL + route.fullPath)
    }
}