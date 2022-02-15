<template>
  <div>
    <nav class="d-flex align-center pt-025 pb-025">
      <nuxt-link to="/projects">
        <bib-icon icon="arrowhead-left" :scale="1.5"></bib-icon>
      </nuxt-link>
      <bib-avatar shape="rounded"></bib-avatar>
      <span class="font-lg font-w-700 p-05 mr-1 rounded ">Project Name</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <span class=" badge-status">Status</span>
      <div class="ml-auto d-flex">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill class="ml-05"></bib-button>
        <div class="shape-circle bg-light width-2 height-2 d-flex ml-05">
          <bib-icon icon="bookmark" class="m-auto"></bib-icon>
        </div>
        <!-- <div class="shape-circle bg-light width-2 height-2 d-flex ml-05">
          <bib-icon icon="elipsis" class="m-auto">
            </bib-icon>
        </div> -->
        <bib-button dropdown="horizontal-dots" variant="light" pill >
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
              <span class="list__item "><bib-icon icon="trash" variant="danger" class="mr-075"></bib-icon> <span class="text-danger">Delete</span></span>

            </div>
          </template>
        </bib-button>
      </div>
    </nav>
  </div>
</template>
<script>
export default {

  name: 'ProjectId',

  data() {
    return {

    }
  }
}

</script>
<style lang="scss" scoped>
.badge-status { padding: 0.35rem 2rem; font-size: 0.75rem; background-color: var(--bib-light); color: var(--bib-gray5); border-radius: 0.15rem;}
</style>
