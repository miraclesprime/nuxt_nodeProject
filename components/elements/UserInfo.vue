<template>
  <span :id="'user-info-wrapper-'+ userId + random" class="user-info-wrapper d-flex gap-05 align-center">
    <template v-if="userName">
      <bib-avatar :src="pic" :size="avatarSize"></bib-avatar>
    </template>
    <span :id="'user-info-'+ userId + random" class="user-name " :class="[ 'text-'+color, 'font-w-'+weight ]">{{userName}}</span>
    <!-- <template v-else>
      <span :id="'user-info-'+ userId + random" class="user-name text-dark pl-025 pr-025">{{ user.firstName + '' + user.lastName }} </span>
    </template> -->
    <!-- <bib-spinner :scale="1.5"></bib-spinner> -->
  </span>
</template>
<script>
import { mapGetters } from 'vuex';

export default {

  name: 'UserInfo',

  props: {
    userId: String,
    avatarSize: { type: String, default: '1.25rem' },
    color: { type: String, default: 'text-dark' },
    weight: { type: String, default: '400' },
  },
  data() {
    return {
      pic: '',
      userName: null,
      random: 0,
    }
  },

  computed: {
    ...mapGetters({
      members: 'user/getTeamMembers'
    }),
  },

  watch: {
    userId(newValue) {
      this.members.filter((el) => {
        if (el.id === newValue) {
          this.userName = el.firstName + ' ' + el.lastName;
          this.pic = el.avatar
        }
      });
    }
  },

  created() {
    if (this.userId) {
      // this.$axios.get(`${process.env.USER_API_URL}/${this.userId}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      // }).then((res) => {
      //   this.userName = res.data[0].FirstName + ' ' + res.data[0].LastName;
      //   this.pic = res.data[0].Photo
      // }).catch(e => this.userName = e)
      this.members.filter((el) => {
        if (el.id === this.userId) {
          this.userName = el.firstName + ' ' + el.lastName;
          this.pic = el.avatar
        }
      });
    }
  },

  mounted() {
    // console.log(this.members)
    // this.random = Math.floor((Math.random()*999) - 99);
    this.random = Math.floor(Math.random() * (898) + 100);
  }
}

</script>
<style lang="css" scoped>
.user-name {
  min-width: 6rem;
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
