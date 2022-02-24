<template>
  <div class="text-center">
    <h2 class="p-2 text-secondary">Welcome <user-info :id="user ? user : ''" /></h2>

  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import UserInfo from '../../components/elements/UserInfo.vue';

  export default {
  components: { UserInfo },
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

      user() {
        if(process.client) {
          return JSON.parse(localStorage.getItem('user')).sub
        }
      }
    },
  }
</script>