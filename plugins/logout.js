export default async (context, inject) => {
    const logout = () => {
      return new Promise((resolve, reject) => {
        context.app.$cookies.remove(process.env.SSO_COOKIE_NAME, {
          domain: "business-in-a-box.com",
        });
        context.app.$cookies.remove(process.env.SSO_COOKIE_NAME);
        window.location.href = `${process.env.AUTH_REDIRECT_URL}${process.env.VUE_APP_URL}`;
        resolve();
      });
    };
    // Inject $logout() in Vue, context and store.
    inject("logout", logout);
  };