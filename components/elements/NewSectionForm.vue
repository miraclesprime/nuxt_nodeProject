<template>
  <section v-show="showNewsection" id="new-section-container">
    <div id="new-section-input-wrapper" class="d-flex align-center p-05 bg-light">
      <input id="new-section-input" type="text" class="new-section-input" ref="newsectioninput" v-model.trim="newSectionName" v-on:blur="onClickOutside" v-on:keyup.enter="$emit('create-section', newSectionName)" @keyup.esc="onClickOutside(true)" placeholder="Enter section name">
      <small v-if="showError" class="text-danger ml-05" id="nsf-show-error">{{showError}}</small>
      <div id="nsf-showloading" v-show="showLoading" class="d-flex align-center">
        <bib-spinner :scale="2"></bib-spinner> <span class="text-secondary">Creating section ...</span>
      </div>
      <bib-icon icon="close" class="ml-auto"></bib-icon>
    </div>
  </section>
</template>
<script>
export default {

  name: 'NewSectionForm',
  props: {
    showNewsection: Boolean,
    showLoading: Boolean,
    showError: {type: String, default: ""},
  },
  data() {
    return {
      newSectionName: null,
    }
  },
  watch: {
    showNewsection(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.newsectioninput.focus()
        })
      } else {
        this.newSectionName = null
      }
    }
  },
  methods: {
    onClickOutside(escape) {
      if (escape) {
        this.newSectionName = null
        this.$emit("toggle-newsection", false)
        return false
      }
      if (!this.newSectionName) {
        this.newSectionName = null
        this.$emit("toggle-newsection", false)
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
