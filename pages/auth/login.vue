<template>
  <div class="wrapper">
    <div class="d-flex justify-center pt-1">
      <img src="/img/logo_vertical.png" class="wrapper__logo" />
    </div>
    <div class="pt-2">
      <bib-tabs :tabs="tabs" @change="changeTab" :value="activeTab"></bib-tabs>
    </div>
    <div class="wrapper__form" v-if="activeTab == 'Sign in'">
      <bib-form-group required label="Email ">
        <template v-slot:content>
          <bib-input
            :variant="emailVariant"
            :value="userInfo.email"
            @change="setEmail"
            placeholder="Enter email..."
          ></bib-input>
        </template>
      </bib-form-group>

      <bib-form-group required class="pt-1" label="Password ">
        <template v-slot:content>
          <bib-input
            :variant="passwordVariant"
            :value="userInfo.password"
            @change="setPassword"
            type="password"
            placeholder="*********"
          ></bib-input>
        </template>
      </bib-form-group>
      <div class="d-flex justify-end">
        <small
          ><bib-link
            label="Forgot Password?"
            class="text-bold text-primary"
          ></bib-link
        ></small>
      </div>
      <div class="wrapper__form__submit">
        <bib-button
          :disabled="isDisabled"
          @click.native="loginWith"
          label="Sign in"
          class="text-center"
          size="md"
          :variant="submitVariant"
        ></bib-button>
      </div>
    </div>
  </div>
</template>
<script>
import { email, required, minLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      activeTab: "Sign in",
      userInfo: { email: "jest-user@biztree.com", password: "password123" },
      emailVariant: "",
      submitVariant: "secondary",
      passwordVariant: "",
      isDisabled: false,
      tabs: ["Register", "Sign in"]
    };
  },
  validations: {
    userInfo: {
      email: { required, email },
      password: { required, minLength: minLength(6) }
    }
  },
  created() {
    this.$v.$touch();
    if (this.$v.$pending || this.$v.$error) {
      this.submitVariant = "secondary";
      this.isDisabled = true;
    } else {
      this.submitVariant = "success";
    }
  },
  methods: {
    changeTab(value) {
      this.activeTab = value;
      if (value == "Register") {
        window.location.href = "/auth/register";
      }
    },
    setEmail(event) {
      this.userInfo.email = event.target.value;
      this.$v.$touch();

      if (this.$v.$pending || this.$v.$error) {
        this.submitStatus = "ERROR";
        this.emailVariant = "danger";
        this.submitVariant = "secondary";
        this.isDisabled = true;
      } else {
        this.submitStatus = "OK";
        this.emailVariant = "";
        this.submitVariant = "success";
        this.isDisabled = false;
      }
    },
    setPassword(event) {
      this.userInfo.password = event.target.value;
      this.$v.$touch();

      if (this.$v.$pending || this.$v.$error) {
        this.submitStatus = "ERROR";
        this.passwordVariant = "danger";
        this.submitVariant = "secondary";
        this.isDisabled = true;
      } else {
        this.submitStatus = "OK";
        this.passwordVariant = "";
        this.submitVariant = "success";
        this.isDisabled = false;
      }
    },
    async loginWith() {
      try {
        this.$router.push("/dashboard");
        // let response = await this.$auth.loginWith("local", {
        //   data: this.userInfo
        // });
      } catch (err) {
        console.log(err);
      }

      console.log(this.$auth.loggedIn);
    }
  }
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
  }
}
</style>
