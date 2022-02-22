<template>
  <span>
    <template v-if="avatar">
      <bib-avatar :src="avatar" size="1.5rem"></bib-avatar>
    </template>
    <span class="pl-025 pr-025">{{userName}}</span>
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
      const res = await this.$axios.get(`/user/get-details/${this.id}`);
      this.userName = res.data[0].FirstName + ' ' + res.data[0].LastName;
  }
}

</script>
<style lang="css" scoped>
</style>
