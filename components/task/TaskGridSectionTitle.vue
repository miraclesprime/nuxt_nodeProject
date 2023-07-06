<template>
  <div class="title text-gray section-drag-handle flex-grow-1" id="task-grid-section-title-wrapper">
    <template v-if="sectionEdit">
      <input type="text" class="editable-input" id="tgst-section-edit-input" ref="sectionEditInput" :value="section.title" @input.stop="debounceUpdateTitle" @blur="() => {sectionEdit = false}" @keyup.esc="() => {sectionEdit = false}">
    </template>
    <span v-else style="cursor: text" id="tgst-mark-section-editable" @click.stop="makeSectionEditable">{{ section.title.includes('_section') ? 'Untitled section' : section.title }}</span>
  </div>
</template>

<script>
import _ from 'lodash'
export default {

  name: 'TaskGridSectionTitle',
  props: { section: Object },

  data() {
    return {
      // title: this.section.title,
      sectionEdit: false,
    }
  },
  methods: {
    makeSectionEditable() {
      this.sectionEdit = true
      this.$nextTick(() => {
        this.$refs.sectionEditInput.focus()
      });
    },

    debounceUpdateTitle: _.debounce(function(event) {
      if (_.trim(event.target.value) == "") {
        event.target.classList.add('error')
        console.warn('section title cannot be left blank')
      } else {
        event.target.classList.remove('error')
        this.$emit("update-title", {id: this.section.id, title: event.target.value})
      }
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
