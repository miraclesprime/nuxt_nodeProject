<template>
  <div class="text-center" id="dashboard-wrapper">
    <h1 class="mt-3 mb-1 " id="dashboard-title"><span id="dashboard-title-span" class="dashboard-title">Welcome</span> </h1>
    <div class="row">
      <div class="col-3 mx-auto">
        <div v-if="user2" class="d-flex justify-center align-center flex-d-column">
          <bib-user-card :name="user2.FirstName +' '+ user2.LastName" :title="user2.JobTitle" :avatarLink="user2.Photo"></bib-user-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard',
  data() {
    return {
      name: { firstName: "", lastName: "" },
      avatar: "",
    }
  },
  computed: {
    ...mapGetters({
      user2: 'user/getUser2',
    }),

  },
  watch: {
    user2: function(newValue) {
      this.name.firstName = newValue.FirstName
      this.name.lastName = newValue.LastName
      this.avatar = newValue.Photo
    }
  }

}

</script>
<style lang="scss" scoped>
.dashboard-title {
  background: linear-gradient(10deg, $purple, $orange);
  background-clip: text;
  color: transparent;
}
</style>