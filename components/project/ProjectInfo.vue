<template>
  <span :id="'project-info-'+ projectId" class="project-title text-dark text-truncate">{{projectTitle}}</span>
</template>

<script>
import {mapGetters} from 'vuex';

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

  computed: {
    ...mapGetters({
      projects: 'project/getAllProjects'
    })
  },

  /*created() {
    // console.log('created project info', this.projectId, this.projects.length)
    if (this.projectId) {
      this.projects.filter((el) => {
        if(el.id == this.projectId) {
          this.projectTitle = el.title;
        }
      })
    }
  },*/

  mounted() {
    // console.log("mounted project info,", this.projectId, this.projects.length)
    if (this.projectId) {
      this.projects.filter((el) => {
        if(el.id == this.projectId) {
          this.projectTitle = el.title;
        }
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
