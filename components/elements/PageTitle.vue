<template>
  <nav :id="id+'-title-wrapper'" class="bg-white d-flex align-center gap-05 py-075 px-025">
    <bib-avatar v-if="avatar" :src="avatar" class="mr-105"></bib-avatar>
    <span class="ml-05 title-text font-w-700" :id="id+'-title-text'">{{title}}</span> <span v-if="count > 0" :id="id+'-count'" class="text-secondary font-md font-w-700">({{count}})</span>
  </nav>
</template>
<script>
import { mapGetters } from "vuex";
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
    },
    count: { type: [Number, String], default: ""},
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
  
}

</style>
