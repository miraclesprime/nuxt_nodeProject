<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>

  export default {
    async created() {
      if(process.client) {
        let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImlhdCI6MTY0NDU1MjQ3ODgwMCwiZXhwIjoxNjUyMzI4NDc4ODAwLCJqdGkiOiJjZmVhZTA1OC03NmE5LTRlYWMtOTVjMy03NmYxNzhlZjA3ZGQifQ._STkz-xT4N82Qix25BrfCVUt2rf488yGPG5N_kHIG5I"
        this.$cookies.set('b_ssojwt', cookie)
        this.$store.dispatch('token/setToken', cookie)
        if (this.$cookies.get('b_ssojwt')) {
              let jwt = this.$cookies.get('b_ssojwt');

              // extract user
              var base64Url = jwt.split('.')[1];
              var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));

              let user = JSON.parse(jsonPayload);

              this.$store.dispatch('user/setUser', user)

              await this.$axios
              .$post(process.env.VUE_APP_API_ENDPOINT + "/user/create", 
              { 
                id: user.sub, 
                email:  user.sube
              }).then((value) => {
                console.log('user created!!')
              }).catch((err) => {
                console.log('there was some issue!!!')
              })

              this.$store.dispatch('token/setToken', jwt);
              localStorage.setItem('accessToken', jwt)
        } else {
              window.location.href = process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL;
        }
      }
    },
  }
  
</script>


<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
