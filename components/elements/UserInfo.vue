<template>
  <span :id="'user-info-wrapper-'+user.id" class="user-info-wrapper d-flex align-center">
    <template v-if="avatar">
      <bib-avatar :src="avatar" size="1.5rem"></bib-avatar>
    </template>
    <template v-else>
      <bib-avatar :text="user.firstName[0]" size="1.5rem"></bib-avatar>
    </template>
      <span :id="'user-info-'+user.id" class="user-name text-dark pl-025 pr-025">{{user.firstName + " " +  user.lastName}} </span>
    <!-- <bib-spinner v-else :scale="1.5"></bib-spinner> -->
  </span>
</template>
<script>
export default {

  // name: 'UserInfo',

  props: {
    user: { type: Object, required: true, default: { firstName: '', lastName: ''} },
    avatar: { type: String }
    // id: { type: String, required: true },
  },
  data() {
    return {
      /*avatar: '',
      userName: null*/
    }
  },
  /*async mounted() {
      const res = await this.$axios.get(`${process.env.USER_API_URL}/${this.id}`);
      this.userName = res.data[0].FirstName + ' ' + res.data[0].LastName;
      this.avatar = res.data[0].FirstName[0]
  }*/
}

</script>
<style lang="css" scoped>
.user-name { max-width: 10rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
</style>
