<template>
  <span :id="'project-info-wrapper-'+ projectId" class="project-info-wrapper d-flex align-center">
    <template >
      <span :id="'project-info-'+ projectId" class="project-title text-dark pl-025 pr-025">{{projectTitle}}</span>
    </template>
  </span>
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
            console.log(res.data.data.title)
            this.projectTitle = res.data.data.title;
      }).catch(e => {
          console.log(e);
      })
    }
  }
}

</script>

<style lang="css" scoped>
.project-title {
  min-width: 6rem;
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>