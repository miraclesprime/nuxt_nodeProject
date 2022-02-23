<template>
  <span class="user-info-wrapper">
    <template v-if="avatar">
      <bib-avatar :src="avatar" size="1.5rem"></bib-avatar>
    </template>
    <span id="user-info-username" class="pl-025 pr-025">{{userName}}</span>
  </span>
</template>

<script>
export default {

  name: 'UserInfo',

  props: {
    id: { type: String, required: true },
  },
  data() {
      return {
          avatar: '',
          userName: null
      }
  },
  async mounted() {
      const res = await this.$axios.get(`${process.env.USER_API_URL}/${this.id}`);
      this.userName = res.data[0].FirstName + ' ' + res.data[0].LastName;
  }
}

</script>
<style lang="css" scoped>
</style>
