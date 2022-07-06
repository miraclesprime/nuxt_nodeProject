<template>
  <section v-show="newSection" id="new-section-container">
    <div id="new-section-input-wrapper" class="d-flex align-center p-05 bg-light">
      <input id="new-section-input" type="text" class="new-section-input" ref="newsectioninput" v-model.trim="newSectionName" v-click-outside="onClickOutside" v-on:keyup.enter="$emit('create-section', newSectionName)" placeholder="Enter section name">
      <small v-if="sectionError" class="text-danger ml-05">invalid input</small>
      <div v-show="sectionLoading" class="d-flex align-center">
        <bib-spinner :scale="2"></bib-spinner> <span class="text-secondary">Creating section ...</span>
      </div>
      <bib-icon icon="close" class="ml-auto"></bib-icon>
    </div>
  </section>
</template>
<script>
export default {

  name: 'NewSectionForm',

  data() {
    return {
      newSection: false,
      newSectionName: null,
      sectionLoading: false,
      sectionError: false,
    }
  },
  watch: {
    newSection(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // console.log('nextTick', this.$refs.newsectioninput)
          this.$refs.newsectioninput.focus()
        })
      } else {
        this.newSectionName = null
      }
    }
  },
  methods: {
    
    onClickOutside() {
      if (!this.newSectionName) {
        this.newSectionName = null
        this.newSection = false
      } else {
      	this.$emit("create-section", this.newSectionName)
      }
    },
  }
}

</script>
<style lang="scss" scoped>
.task-view-wrapper {
  min-height: 5rem;
}

.new-section-input {
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: $font-size-sm;
  border-radius: 0.18rem;
  border: 1px solid var(--bib-gray4);

  &:focus {
    outline: none;
    border: 2px solid var(--bib-gray6);
    border-radius: 0;
  }
}

</style>
