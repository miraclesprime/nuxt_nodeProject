<template>
  <span class="user-info-wrapper d-flex align-center">
    <!-- <template v-if="avatar">
      <bib-avatar :text="avatar" size="1.5rem"></bib-avatar>
    </template>
    <span v-if="userName" id="user-info-username" class="user-name pl-025 pr-025">{{userName}} </span>
    <bib-spinner v-else :scale="1.5"></bib-spinner> -->
  </span>
</template>

<script>
export default {

  // name: 'UserInfo',

  // props: {
  //   id: { type: String, required: true },
  // },
  // data() {
  //     return {
  //         avatar: '',
  //         userName: null
  //     }
  // },
  // async mounted() {
  //     const res = await this.$axios.get(`${process.env.USER_API_URL}/${this.id}`);
  //     this.userName = res.data[0].FirstName + ' ' + res.data[0].LastName;
  //     this.avatar = res.data[0].FirstName[0]
  // }
}

</script>
<style lang="css" scoped>
</style>
