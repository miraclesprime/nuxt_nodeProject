<template>
  <div class="text-center" id="dashboard-wrapper">
    <h2 class="pt-2 pb-1 text-secondary" id="dashboard-title">Welcome </h2>
    <div v-if="user" class="d-flex justify-center align-center flex-d-column">
      <!-- <email-chip :email="user.sube" :text="user.sube[0]"></email-chip> -->

      <user-info :user="name" :avatar="avatar"></user-info>
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
      user: 'user/getUser',
      user2: 'user/getUser2',
    }),

  },
  watch: {
    user2: function(newValue){
      this.name.firstName = newValue.FirstName
      this.name.lastName = newValue.LastName
      this.avatar = newValue.Photo
    }
  }

}

</script>
