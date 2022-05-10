<template>
  <span :id="'user-info-wrapper-'+ userId" class="user-info-wrapper d-flex align-center">
    <template >
      <bib-avatar :src="pic" size="1.25rem"></bib-avatar>
    </template>
    <template >
      <span :id="'user-info-'+userId" class="user-name text-dark pl-025 pr-025">{{userName}}</span>
    </template>
    <!-- <template v-else>
      <span :id="'user-info-'+userId" class="user-name text-dark pl-025 pr-025">{{ user.firstName + '' + user.lastName }} </span>
    </template> -->
    <!-- <bib-spinner :scale="1.5"></bib-spinner> -->
  </span>
</template>
<script>
export default {

  name: 'UserInfo',

  props: {
    userId: String,
  },
  data() {
    return {
      pic: '',
      userName: null,
    }
  },
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
