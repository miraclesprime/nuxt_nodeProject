<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>

  export default {
    created() {
      if(process.client) {
        if (document.cookie.includes("b_ssojwt=")) {
              let jwt = document.cookie
              .split("; ")
              .find((row) => row.includes("b_ssojwt="))
              .split("=")[1];
              this.$store.dispatch('token/setToken', jwt);
              localStorage.setItem('accessToken', jwt)
        }
      }
    },

    mounted() {
      if(!localStorage.getItem('accessToken')){
        this.$axios
          .$post(
              "https://www.biztree.com/usr-ctrl-test/api/sso/verify",
              {},
              {
                  headers: {
                      authorization: "Bearer "+accessToken,
                  },
              }
              )
              .then((value) => {
                  console.log(">> in if direction",value.data);
                  if(value.data.code!="valid_token"){
                      console.log("Not valid code")
                      window.location.href ="http://dev.account.business-in-a-box.com/login/?redirect=http://dev.proj-mgmt.business-in-a-box.com/en/dashboard/";
                  }
                  // User API (user exist or not)
                  console.log('user created!!!')
              })
              .catch((err) => {
                  console.log(err);
              });
          } else {
              console.log(">> in else redirection");
              localStorage.removeItem('accessToken')
              window.location.href ="http://dev.account.business-in-a-box.com/login/?redirect=http://dev.proj-mgmt.business-in-a-box.com/en/dashboard/";
          }
    }
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
