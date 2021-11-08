<template>
  <div class="wrapper">
    <div class="d-flex justify-center pt-1">
      <img src="/img/logo_vertical.png" class="wrapper__logo" />
    </div>
    <div class="pt-2">
      <bib-tabs :tabs="tabs" @change="changeTab" :value="activeTab"></bib-tabs>
    </div>
    <div class="wrapper__form" v-if="activeTab == 'Register'">
      <bib-form-group required label="Email Address ">
        <template v-slot:content>
          <bib-input
            :value="userInfo.email"
            @change="
              (event) => {
                userInfo.email = event.target.value;
              }
            "
            placeholder="Enter email..."
          ></bib-input>
        </template>
      </bib-form-group>

      <bib-form-group class="pt-05" label="First Name ">
        <template v-slot:content>
          <bib-input
            :value="userInfo.fname"
            @change="
              (event) => {
                userInfo.fname = event.target.value;
              }
            "
            placeholder="Enter email..."
          ></bib-input>
        </template>
      </bib-form-group>

      <bib-form-group class="pt-05" label="Last Name ">
        <template v-slot:content>
          <bib-input
            :value="userInfo.lname"
            @change="
              (event) => {
                userInfo.lname = event.target.value;
              }
            "
            placeholder="Enter email..."
          ></bib-input>
        </template>
      </bib-form-group>

      <bib-form-group class="pt-05" label="Telephone Number ">
        <template v-slot:content>
          <bib-input
            :value="userInfo.phone"
            @change="
              (event) => {
                userInfo.phone = event.target.value;
              }
            "
            placeholder="Enter email..."
          ></bib-input>
        </template>
      </bib-form-group>

      <bib-form-group required class="pt-05" label="Password ">
        <template v-slot:content>
          <bib-input
            :value="userInfo.password"
            @change="
              (event) => {
                userInfo.password = event.target.value;
              }
            "
            type="password"
            placeholder="*********"
          ></bib-input>
        </template>
      </bib-form-group>

      <bib-form-group required class="pt-05" label="Confirm Password ">
        <template v-slot:content>
          <bib-input
            :value="userInfo.confirmPassword"
            @change="
              (event) => {
                userInfo.confirmPassword = event.target.value;
              }
            "
            type="password"
            placeholder="*********"
          ></bib-input>
        </template>
      </bib-form-group>

      <div class="wrapper__form__submit">
        <bib-button
          @click.native="register"
          label="Register"
          class="text-center"
          size="md"
          variant="success"
        ></bib-button>
      </div>
      <div class="text-gray6 pt-1">
        <small
          >By selecting Register, you agree to our
          <a href="#">Terms of Use</a> and have read and acknowledge our
          <a href="#">Privacy Policy</a>.</small
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  methods: {
    changeTab(value) {
      this.activeTab = value;
      if (value == "Sign in") {
        window.location.href = "/auth/login";
      }
    },
    async register() {
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.userInfo,
        });
        // console.log(response)
      } catch (err) {
        console.log(err);
      }
    },
  },
  data() {
    return {
      activeTab: "Register",
      userInfo: {
        email: "",
        password: "",
        fname: "",
        lname: "",
        phone: "",
        confirmPassword: "",
      },
      tabs: ["Register", "Sign in"],
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

  &__logo {
    width: 11rem;
  }
  &__form {
    border-top: 1px solid $gray4;
    padding-top: 1.5rem;

    &__submit {
      padding-top: 1.5rem;
      .button {
        width: 100%;
      }
    }
    a:not(.button) {
      color: $gray6;
    }
    small {
      font-size: 0.79rem;
    }
  }
}
</style>
