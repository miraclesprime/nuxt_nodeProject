<template>
  <div class="wrapper">
    <div class="d-flex justify-center pt-1">
      <img src="/img/logo_vertical.png" class="wrapper__logo">
    </div>
    <div class="pt-2">
      <bib-tabs :tabs="tabs" @change="changeTab" :value="activeTab"></bib-tabs>
    </div>
     <div class="wrapper__form" v-if="activeTab == 'Sign in'">
        <bib-form-group required label="Email ">
            <template v-slot:input>
                <bib-input :value="userInfo.email" @change="(event) => { userInfo.email = event.target.value }" placeholder="Enter email..."></bib-input>
            </template>
        </bib-form-group>

        <bib-form-group required class="pt-1" label="Password ">
            <template v-slot:input>
                <bib-input :value="userInfo.password" @change="(event) => { userInfo.password = event.target.value }" type="password" placeholder="*********"></bib-input>
            </template>
        </bib-form-group>
        <div class="d-flex justify-end">
            <small><bib-link label="Forgot Password?" class="text-bold text-primary"></bib-link></small>
        </div>
        <div class="wrapper__form__submit">
            <bib-button @click.native="loginWith" label="Sign in" class="text-center" size="md" variant="success"></bib-button>
        </div>
    </div>

  </div>
</template>
<script>
export default {
  methods: {
    changeTab(value) {
      this.activeTab = value;
      if(value == 'Register'){
         window.location.href = '/register';
      }
    },
    async loginWith(){
        try {
        let response = await this.$auth.loginWith('local', { data: this.userInfo })
        console.log(response.log)
        } catch (err) {
            console.log(err)
        }
    }
  },
  data() {
    return {
      activeTab: "Sign in",
      userInfo: {email: "jest-user@biztree.com", password: "password123"},
      tabs: [
        "Register",
        "Sign in"
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 23rem;
  margin: 6.5rem auto;
  padding: 1.5rem;
  border: 1px solid $gray4;
  &__logo{
      width: 11rem;
  }
  &__form{
      border-top: 1px solid $gray4;
      padding-top: 1.5rem;

    &__submit{
        padding-top: 1.5rem;
         .button{
            width: 100%;
        }
    }
  }
}
</style>