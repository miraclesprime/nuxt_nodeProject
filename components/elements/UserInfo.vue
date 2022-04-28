<template>
  <span :id="'user-info-wrapper-'+user.id" class="user-info-wrapper d-flex align-center">
    <template v-if="pic">
      <bib-avatar :src="pic" size="1.25rem"></bib-avatar>
    </template>
    <template v-else>
      <bib-avatar :src="avatar" size="1.25rem"></bib-avatar>
    </template>
    <template v-if="userName">
      <span :id="'user-info-'+userId" class="user-name text-dark pl-025 pr-025">{{userName}}</span>
    </template>
    <template v-else>
      <span :id="'user-info-'+user.id" class="user-name text-dark pl-025 pr-025">{{ user.firstName + '' + user.lastName }} </span>
    </template>
    <!-- <bib-spinner :scale="1.5"></bib-spinner> -->
  </span>
</template>
<script>
export default {

  name: 'UserInfo',

  props: {
    userId: String,
    user: {
      type: Object,
      default: function() {
        return { firstName: '', lastName: '' }
      }
    },
    avatar: String
    // id: { type: String, required: true },
  },
  data() {
    return {
      pic: '',
      userName: null,
    }
  },
  /*computed: {
    uName() {
      if (this.user) {
        return `${user.firstName} ${user.lastName}`
      }
    }
  },*/
  created() {
    if (this.userId) {
      this.$axios.get(`${process.env.USER_API_URL}/${this.userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        this.userName = res.data[0].FirstName + ' ' + res.data[0].LastName;
        this.pic = res.data[0].Photo
      }).catch(e => this.userName = e)
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
