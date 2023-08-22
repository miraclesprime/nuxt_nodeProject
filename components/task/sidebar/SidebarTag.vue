<template>
  <client-only>
    <div class="task-tags w-100 position-relative py-05 px-105 mb-05" id="sbs-task-tags-main-wrapper">
      <div id="task-tags-title-wrapper" class=" sub-title pb-025">
        <p id="task-tags-title" class="text-gray6 font-sm">Tags </p>
      </div>
      <div id="task-tags-actions-wrapper" class="tags-actions d-flex align-center flex-wrap gap-05 py-025">
        <div class="picker-wrapper-two " id="tags-select-wrapper" v-click-outside="onClickOutside">
          <div class="d-inline-flex gap-05 align-center cursor-pointer shape-rounded height-2 px-1 bg-success-sub6 bg-hover-success-sub3 text-success" id="task-tags-add-button" @click.stop="triggerOpen" v-show="activeProp">
            <bib-icon icon="add" variant="success" :scale="1" class=""></bib-icon>
            <span id="task-tags-add-text" class=""> Tags</span>
          </div>
          <!-- dropdown -->
          <div v-show="show" class="picker-content p-025" id="tags-select-content" style="min-width: 10rem;">
            <p id="tags-select-heading" class="font-sm text-left p-025 border-bottom-light">Add tags</p>
            <div class="picker-list-wrap " style="max-height: 16rem; overflow-y: auto; overflow-x: clip; " id="tags-select-list-wrap">
              <input id="tags-search-input" type="text" v-model="filterKey" ref="tagsFilterInput" class="picker-input " @keyup.enter="addTag">
              <p v-show="filtered.length == 0" class="font-xs">Press enter to add tag</p>
              <ul class="m-0 p-0 text-left" id="tags-select-ul">
                <li v-for="(tag, index) in filtered" :id="'tags-select-li-'+index" :key="tag.index" class="p-025 pr-05 align-center gap-05 font-md cursor-pointer bg-hover-light text-hover-dark" @click.stop="selected(tag)">
                  <bib-icon icon="tag-solid" variant="gray4"></bib-icon>
                  {{tag.content}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- tags list -->
        <template v-if="alltags.length > 0">
          <div v-for="tag in tags" :id="'task-tags-wrapper'+tag.id" class="tags-wrap bg-light shape-rounded px-05 ">
            <div :id="'tag-wrap-'+tag.id" class="d-flex gap-05 align-center height-2">
              <bib-icon :scale="1" icon="bib-logo" variant="gray4"></bib-icon>
              <span :id="'tags-comp-text'+tag.id" class="tags-text font-md ">{{tag.content}} </span>
              <span :id="'tags-comp-del'+tag.id" class="d-inline-flex align-center justify-center height-1 width-1 bg-white cursor-pointer shape-circle" @click.stop="deleteTag(tag)">
                <bib-icon icon="close-circle-solid" :scale="1" variant="gray4"></bib-icon>
              </span>
            </div>
          </div>
        </template>
      </div>
      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="4000" >
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
    </div>
  </client-only>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
export default {

  name: 'SidebarTag',

  props: {
    tags: { type: Array, default: function() { return [] }},
    activeProp: { default: null }
  },

  data() {
    return {
      show: false,
      filterKey: "",
      popupMessages: [],
    }
  },
  computed: {
    ...mapGetters({
      alltags: "company/getCompanyTags",
    }),
    filtered() {
      let regex = new RegExp(this.filterKey, 'g\i')
      if (this.alltags) {
        return this.alltags.filter((u) => {
          if (regex.test(u.content)) {
            return u
          }
        })
      } else {
        return []
      }
    },
  },
  mounted(){
    this.fetchalltags()
  },
  methods: {

    ...mapActions({
      fetchalltags: "company/fetchCompanyTags"
    }),

    triggerOpen() {
      this.show = !this.show
      this.$nextTick(() => {
        this.$refs.tagsFilterInput.focus()
        this.$emit("close-other")
      });
    },
    selected(tag) {
      let tagExist = this.tags.find(t => t.id == tag.id)
      if (tagExist) {
        this.popupMessages.push({text: "tag already exists", variant: "orange"})
      } else {
        this.onClickOutside()
        this.$emit("change", tag)
        // this.show = false
      }
    },
    deleteTag(tag) {
      this.$emit("delete-tag", tag)
    },
    onClickOutside() {
      this.filterKey = ""
      this.show = false
    },
    addTag() {
      this.$emit("add-tag", this.filterKey)
      this.onClickOutside()
    },
  }
}

</script>
<style lang="css" scoped>
</style>
