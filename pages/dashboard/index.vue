<template>
  <div class="text-center">
    <h2 class="p-2 text-secondary">Welcome <user-info :id="user ? user.sub : ''" /></h2>

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
      })
    },
  }
</script>