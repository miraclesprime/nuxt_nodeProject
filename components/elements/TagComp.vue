<template>
  <div :id="'tag-wrap-'+compId" class=" position-relative" v-click-outside="onClickOutside">
    <!-- <template v-if="tags"> -->
    <div class="d-flex gap-025 align-center height-2" @click.stop="triggerOpen">
      <span v-for="(tag, index) in tagsList" :id="'tag-text-'+compId " class="text-gray1 bg-light shape-rounded px-05" :class="{'text-truncate': index > 0}">{{ tag?.content }}</span>
      <!-- </template> -->
      <div v-show="show" class="picker-content p-025" id="tags-select-content" style="min-width: 10rem;">
        <!-- <p id="tags-select-heading" class="font-sm text-left p-025 border-bottom-light">Add tags</p> -->
        <div class="picker-list-wrap " style="max-height: 16rem; overflow-y: auto; overflow-x: clip; " id="tags-select-list-wrap">
          <!-- <input id="tags-search-input" type="text" v-model="filterKey" ref="tagsFilterInput" class="picker-input " @keyup.enter="addTag"> -->
          <!-- <p v-show="filtered.length == 0" class="font-xs">Press enter to add tag</p> -->
          <ul class="m-0 p-0 text-left" id="tags-select-ul">
            <li v-for="(tag, index) in tagsList" :id="'tags-select-li-'+index" :key="'tag-'+index" class="p-025 pr-05 align-center gap-05 font-md cursor-pointer bg-hover-light text-hover-dark" >
              <bib-icon icon="tag-solid" variant="gray4"></bib-icon>
              {{tag?.content}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {

  name: 'TagComp',
  props: {
    tags: { type: Array },
    // iconOnly: { type: Boolean, default: false }
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapGetters({
      alltags: "company/getCompanyTags",
    }),
    tagsList() {
      return this.tags?.map(t => {
        return this.alltags.filter(at => t.tagId == at.id)[0]
      })
    },

    compId() {
      return Math.floor((Math.random() * 1000) + 1);
    },
  },
  methods: {
    triggerOpen() {
      if (this.tagsList.length) {
        this.show = !this.show
      }
    },
    onClickOutside() {
      this.show = false
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-content {
  position: absolute;
  z-index: 55;
  left: -5px;
  top: -5px;
  min-height: fit-content;
  max-height: 30rem;
  min-width: calc(100% + 10px);
  background-color: $white;
  border: 1px solid $gray4;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);

  li {
    min-width: max-content;
  }
}

</style>
