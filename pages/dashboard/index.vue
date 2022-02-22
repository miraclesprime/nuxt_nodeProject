<template>
  <div class="text-center">
    <h2 class="p-2 text-secondary">Welcome {{name}}</h2>
    <!-- <p>{{$userInfo('k61YQdJ6J7ldOGpJ')}}</p> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

  export default {
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
    mounted() {
      this.$userInfo(this.user.sub).then((res) => this.name = res)
    }
  }
</script>