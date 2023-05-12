<template>
  <nav :id="id+'-title-wrapper'" class="bg-white d-flex align-center gap-05 py-075 px-025">
    <button type="button" @click="$router.back()" class="d-flex cursor-pointer bg-white border-white" id="pt-button">
      <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
    </button>
    <bib-avatar v-if="avatar" :src="avatar"></bib-avatar>
    <span class=" mr-1 title-text" :id="id+'-title-text'">{{title}}</span>
  </nav>
</template>
<script>
export default {

  name: 'PageTitle',
  props: {
    title: {
      type: String,
      default: "Page Title"
    },
    avatar: {
      type: String,
      default: ""
    }
  },

  data() {
    return {

    }
  },
  computed: {
    id() {
      return this.title.replace(" ", "_").toLowerCase()
    }
  }
}

</script>
<style lang="css" scoped>
nav {
  border-bottom: 1px solid var(--bib-light);
}

.title-text {
  font-size: 1.25rem;
  font-weight: bold;
}

</style>
