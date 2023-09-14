<template>
  <span :id="'user-info-wrapper-'+ random" class="user-info-wrapper d-flex gap-025 align-center">
    <template v-if="userName">
      <bib-avatar :src="pic" :size="avatarSize"></bib-avatar>
      <span :id="'user-info-'+ random" class="user-name " :class="[ 'text-'+color, 'font-w-'+weight ]">{{userName}}</span>
    </template>
    <template v-else-if="userInfo">
      <bib-avatar :src="userInfo.avatar" :size="avatarSize"></bib-avatar>
      <span :id="'user-info-'+ random" class="user-name " :class="[ 'text-'+color, 'font-w-'+weight ]">{{userInfo.label}}</span>
    </template>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  name: 'UserInfo',

  props: {
    userId: { type: String, default: ""},
    user: { type: Object, default: function() { return { id: "", firstName: "", lastName: ""}} },
    avatarSize: { type: String, default: '1.5rem' },
    color: { type: String, default: 'text-dark' },
    weight: { type: String, default: '400' },
    members: { type: Array, default: function() { return [] } } 
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
      teamMembers: 'user/getTeamMembers'
    }),
  },

  mounted() {

    this.random = Math.floor(Math.random() * (898) + 100);

    if (this.user?.id) {
      this.userName = `${this.user.firstName} ${this.user.lastName}`
      if(this.teamMembers.length > 0) {
        let m = this.teamMembers.find(el => el.id == this.user.id )
        this.pic = m?.avatar
        return
      } else {
        let m = this.members.find(el => el.id == this.user.id )
        this.pic = m?.avatar
        return
      }
    } 

    if (this.userId) {
      if(this.teamMembers.length > 0) {
        this.userInfo = this.teamMembers.find(el => el.id == this.userId)
      } else {
        this.userInfo = this.members.find(el => el.id == this.userId)
      }
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
