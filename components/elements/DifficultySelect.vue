<template>
  <div class="picker-wrapper w-100" id="difficulty-select-wrapper" v-click-outside="onClickOutside">
    <div id="difficulty-select-button" class="user-data cursor-pointer height-2 align-center justify-between" @click.stop="triggerOpen">
      <div id="difficulty-select-inner-wrap" class="align-center flex-grow-1 gap-025">
        <bib-icon icon="node" :variant="localValue.color"></bib-icon>
        <span class="text-capitalize text-truncate" style="max-width: 80%;" id="difficulty-select-localValue-label" >
          {{ localValue.label }}
        </span>
      </div>
      <bib-icon icon="arrow-down" variant="gray4" :scale="0.5"></bib-icon>
    </div>
    <div v-if="show" class="picker-content" id="difficulty-select-content"> 
      <div class="picker-list-wrap" id="difficulty-select-list-wrap">
        <ul class="m-0 p-0 text-left" id="difficulty-select-list">
          <li v-for="diff in difficultyList" :key="diff.value+'stitem'" :id="'ps-'+diff.value" class="p-025 gap-05 align-center font-md cursor-pointer" @click.stop="onStatusChange(diff)">
            <bib-icon icon="node" :variant="diff.color"></bib-icon>
            <span :id="'ps-'+diff.label" class="text-dark text-truncate">{{diff.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { DIFFICULTY } from '~/config/constants.js'

export default {
  name: 'DifficultySelect',
  props: {
    difficulty: { type: [Number, String] },
  },
  data() {
    return {
      difficultyItems: DIFFICULTY,
      show: false,
      localValue: {},
    }
  },
  watch : {
    difficulty(newVal) {
      if (newVal) {
      this.localValue = this.difficultyItems.find( d => d.value == newVal )
    } else {
      this.localValue = { label: '--', value: 0, color: "gray4", bgcolor: "gray4" }
    }
    }
  },
  computed: {
    difficultyList() {
      let diff = []
      this.difficultyItems.forEach(d => {
        if (d.value == 0) diff.push({ value: null, label: "--", color: "gray4", bgcolor: this.$hex2rgba(this.colors.ColorVariants.Gray4) })
        if (d.value == 1) diff.push({ value: d.value, label: d.label, color: d.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Success) })
        if (d.value == 2) diff.push({ value: d.value, label: d.label, color: d.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Orange) })
        if (d.value == 3) diff.push({ value: d.value, label: d.label, color: d.color, bgcolor: this.$hex2rgba(this.colors.ColorVariants.Danger) })
      })

      return diff
    },
  },
  mounted() {
    if (this.difficulty) {
      this.localValue = this.difficultyItems.find( d => d.value == this.difficulty )
    } else {
      this.localValue = { label: '--', value: 0, color: "gray4", bgcolor: "gray4" }
    }
  },
  methods: {
    triggerOpen() {
      this.show = !this.show
      this.$emit('close-other')
    },

    onClickOutside() {
      this.show = false
    },

    onStatusChange(difficulty) {
      this.localValue = difficulty
      this.$emit("change", difficulty)
      this.show = false
    },
  }
}

</script>
<style lang="scss" scoped>
.picker-wrapper {
  /*background-color: $white;*/
  position: relative;

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
    padding: 0.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  }

  .user-data {
    border: 0 none;
    background-color: transparent;
    padding: 0;
    font-size: $base-size;
  }

  .picker-list-wrap {}

}

.circle {
  width: 24px;
  height: 24px;

  .dot {
    width: 8px;
    height: 8px;
  }
}

</style>
