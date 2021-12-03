export default function ({ $axios, redirect }) {
  $axios.onError((error) => {
    switch (error.response.status) {
      case 500:
        redirect("/error/500");
        return;

      case 404:
        redirect("/error/404");
        return;
    }
  });
}
