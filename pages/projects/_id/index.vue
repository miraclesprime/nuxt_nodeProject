<template>
  <div>
    <nav class="d-flex align-center pt-025 pb-025">
      <nuxt-link to="/projects">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <bib-avatar shape="rounded"></bib-avatar>
      <span class="font-lg font-w-700 p-05 mr-1 rounded ">{{project.title}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <span class=" badge-status">Status</span>
      <div class="ml-auto d-flex align-center">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill class="ml-05"></bib-button>
        <div class="shape-circle bg-light width-2 height-2 d-flex ml-05">
          <bib-icon icon="bookmark" class="m-auto"></bib-icon>
        </div>
        <!-- <div class="shape-circle bg-light width-2 height-2 d-flex ml-05">
          <bib-icon icon="elipsis" class="m-auto">
            </bib-icon>
        </div> -->
        <bib-button pop="horizontal-dots" variant="light" >
          <template v-slot:menu>
            <div class="list">
              <span class="list__item">Show project details</span>
              <hr>
              <span class="list__item"><bib-icon icon="heart-like" class="mr-075"></bib-icon> Add to favorites</span>
              <span class="list__item"><bib-icon icon="user-add" class="mr-075"></bib-icon> Share with</span>
              <span class="list__item"><bib-icon icon="pencil" class="mr-075"></bib-icon> Rename</span>
              <div class="mt-1"></div>
              <span class="list__item"><bib-icon icon="warning" class="mr-075"></bib-icon> Report</span>
              <hr>
              <span class="list__item danger">Delete task</span>
            </div>
          </template>
        </bib-button>
      </div>
    </nav>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'ProjectId',
  data() {
    return {
      
    }
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
      project: 'project/getSingleProject'
    })
  },

  async mounted() {
    let proj = await this.$axios.$get(`project/${this.$route.params.id}`, {
      headers: {'Authorization': `Bearer ${this.token}`}
    })
    this.$store.dispatch('project/setSingleProject', proj.data)
    console.log(proj)
  }
}

</script>
<style lang="scss" scoped>
.badge-status { padding: 0.35rem 2rem; font-size: 0.75rem; background-color: var(--bib-light); color: var(--bib-gray5); border-radius: 0.15rem;}
</style>
