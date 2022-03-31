<template>
  <div class="text-center" id="dashboard-wrapper">
    <h2 class="pt-2 pb-1 text-secondary" id="dashboard-title">Welcome </h2>
    <div class="d-flex justify-center">
      <!-- <email-chip :email="user.sube" :text="user.sube[0]"></email-chip> -->
      <!-- <user-info :id="user ? user : ''" /> -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
// import UserInfo from '../../components/elements/UserInfo.vue';

export default {
  // components: { UserInfo },
  name: 'dashboard',
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser'
    }),

  //   user() {
  //     if (process.client) {
  //       return JSON.parse(localStorage.getItem('user')).sub
  //     }
  //   }
  },
}

</script>
