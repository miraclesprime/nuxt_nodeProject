<template>
  <div class="title text-gray section-drag-handle flex-grow-1">
    <template v-if="sectionEdit">
      <input type="text" class="editable-input" ref="sectionEditInput" v-model="title" @input.stop="debounceUpdateTitle" @blur="() => {sectionEdit = false}" @keyup.esc="() => {sectionEdit = false}">
    </template>
    <span v-else @click.stop="makeSectionEditable">{{ section.title.includes('_section') ? 'Untitled section' : title }}</span>
  </div>
</template>
<script>
import _ from 'lodash'
export default {

  name: 'TaskGridSectionTitle',
  props: { section: Object },

  data() {
    return {
      title: this.section.title,
      sectionEdit: false,
    }
  },
  methods: {
    makeSectionEditable() {
      this.sectionEdit = true
      this.$nextTick(() => {
        // console.info(this.$refs[refid])
        this.$refs.sectionEditInput.focus()
      });
    },

    debounceUpdateTitle: _.debounce(function() {
      // console.log(this.title)
      this.$emit("update-title", {id: this.section.id, title: this.title})
      /*this.$store.dispatch("section/renameSection", {
        id: this.section.id,
        projectId: this.section.projectId,
        data: {
          title: this.title
        },
        text: `renamed section to "${this.title}"`,
      }, ).then(r => {
        // console.log(r)
        if (r.statusCode == 200) {
          this.sectionEdit = false
          this.$nuxt.$emit("update-key")
        }
      }).catch(e => console.warn(e))*/
    }, 1200),
  }
}

</script>
<style lang="scss" scoped>
.title {
  .editable-input {
    font-size: 1rem;
    background-color: transparent;
  }
}

</style>
