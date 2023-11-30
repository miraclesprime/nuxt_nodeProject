export default async function ({ $axios, store, env, redirect, app, $auth }) {
  let $cookie = env.SSO_COOKIE_NAME;
  if (app.$cookies.get($cookie)) {
    store.commit("setToken", app.$cookies.get($cookie));
    $auth.setToken(app.$cookies.get($cookie));
    try {
      $auth.setUser(
        JSON.parse(atob(app.$cookies.get(env.SSO_COOKIE_NAME).split(".")[1]))
      );
      $axios.setToken(app.$cookies.get($cookie), "Bearer");

      await $axios
        .$get(env.USER_API_ENDPOINT + "/" + $auth.user.sub)
        .then((res) => {
          store.commit("user/setUser2", res);
          /*if (app.$cookies.get("gridView")) {
            store.commit("setView", app.$cookies.get("gridView"));
          }*/
        });

      await $axios
        .$get(env.ORG_API_ENDPOINT + "/" + $auth.user.subb + "/users", {
          headers: {
            Authorization: "Bearer " + app.$cookies.get($cookie),
          },
        })
        .then((res) => {
          store.commit("setOrgUsers", res);
        });
    } catch (e) {
      return null;
    }
  } else {
    return redirect(env.AUTH_REDIRECT_URL + env.VUE_APP_URL);
  }
}
