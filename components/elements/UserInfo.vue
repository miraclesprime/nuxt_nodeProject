<template>
  <span :id="'user-info-wrapper-'+ random" class="user-info-wrapper d-flex gap-05 align-center">
    <template v-if="userName">
      <bib-avatar :src="pic" :size="avatarSize"></bib-avatar>
      <span :id="'user-info-'+ random" class="user-name " :class="[ 'text-'+color, 'font-w-'+weight ]">{{userName}}</span>
    </template>
    <template v-else-if="userInfo">
      <bib-avatar :src="userInfo.avatar" :size="avatarSize"></bib-avatar>
      <span :id="'user-info-'+ random" class="user-name " :class="[ 'text-'+color, 'font-w-'+weight ]">{{userInfo.label}}</span>
    </template>
    <!-- <template v-else>
      <span :id="'user-info-'+ random" class="user-name text-dark pl-025 pr-025">{{ user.firstName + '' + user.lastName }} </span>
    </template> -->
    <!-- <bib-spinner :scale="1.5"></bib-spinner> -->
  </span>
</template>
<script>
import { mapGetters } from 'vuex';

export default {

  name: 'UserInfo',

  props: {
    userId: {type: String, default: ""},
    user: {type: Object, default: function() { return { id: "", firstName: "", lastName: ""}}},
    avatarSize: { type: String, default: '1.5rem' },
    color: { type: String, default: 'text-dark' },
    weight: { type: String, default: '400' },
  },
  data() {
    return {
      pic: '',
      userName: null,
      userInfo: null,
      random: 0,
    }
  },

  computed: {
    ...mapGetters({
      members: 'user/getTeamMembers'
    }),
  },

  /*created() {
    if (this.userId) {
      this.members.filter((el) => {
        if (el.id === this.userId) {
          this.userName = el.firstName + ' ' + el.lastName;
          this.pic = el.avatar
        }
      });
    }
  },*/

  mounted() {
    // console.log(this.members)
    this.random = Math.floor(Math.random() * (898) + 100);

    if (this.user?.id) {
      this.userName = `${this.user.firstName} ${this.user.lastName}`
      let m = this.members.find(el => el.id == this.user.id )
      // console.log(m)
      this.pic = m?.avatar
      // this.userName = m?.label
      return
    } 

    if (this.userId) {
      this.userInfo = this.members.find(el => el.id == this.userId)
    }
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
