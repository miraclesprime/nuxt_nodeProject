<template>
  <nav :id="id+'-title-wrapper'" class="bg-white d-flex align-center gap-05 py-075 px-025">
    <!-- <button type="button" v-show="visible !== 2" @click="$router.back()" class="d-flex cursor-pointer bg-white border-white" id="pt-button">
      <bib-icon  icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
    </button> -->
    <bib-avatar v-if="avatar" :src="avatar" class="mr-105"></bib-avatar>
    <!-- <span v-show="visible !== 2" class=" mr-1 title-text" :id="id+'-title-text'">{{title}}</span>
    <span v-show="visible === 2" class=" ml-2 title-text" :id="id+'-title-text'">{{title}}</span> -->
    <!-- removed the back arrow -->
    <span class="ml-05 title-text" :id="id+'-title-text'">{{title}}</span> <span :id="id+'-count'" class="text-secondary font-sm">{{count}}</span>
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
  font-weight: bold;
}

</style>
