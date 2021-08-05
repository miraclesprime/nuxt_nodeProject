<template>
  <div class="wrapper">
    <div class="d-flex justify-center pt-1">
      <h3 class="text-primary">Business in a Box</h3>
    </div>
    <div class="pt-2">
      <bib-tabs :tabs="tabs" @change="changeTab" :value="activeTab"></bib-tabs>
    </div>
    <div >
        <bib-form-group label="Email *">
            <template v-slot:input>
            <bib-input></bib-input>
            </template>
        </bib-form-group>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    changeTab(value) {
      this.activeTab = value;
      if(value == 'Sign in'){
         window.location.href = '/login';
      }
    },
  },
  data() {
    return {
      activeTab: "Register",
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

  &__logo {
    display: flex;
    justify-content: center;
  }
}
</style>