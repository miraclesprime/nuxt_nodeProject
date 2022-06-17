<template>
  <span :id="'project-info-'+ projectId" class="project-title text-dark text-truncate">{{projectTitle}}</span>
</template>
<script>
export default {

  name: 'ProjectInfo',

  props: {
    projectId: Number,
  },
  data() {
    return {
      projectTitle: null,
    }
  },
  created() {
    if (this.projectId) {
      this.$axios.get(`project/${this.projectId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        // console.log(res.data.data.title)
        this.projectTitle = res.data.data.title;
      }).catch(e => {
        console.log(e);
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.project-title {
  min-width: 6rem;
  max-width: 10rem;
}

</style>
