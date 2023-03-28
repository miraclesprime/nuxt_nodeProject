<template>
  <div class="dialog-wrapper">
    <transition name="fade" appear>
      <div class="dialog shape-rounded" :class="[`bg-${variant}`]" :style="computedStyle">
        <!-- message -->
        <div class="d-flex gap-05">
          <bib-icon icon="warning" :variant="iconVariant" :scale="1.2" />
          <div class="dialog__item " :class="[textVariant]" v-html="message">
          </div>
        </div>
        <div class="d-flex justify-end pt-105">
          <bib-button label="Ok" variant="primary" pill @click.native.stop="$emit('close')"></bib-button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
/**
 * @module Molecules/Alert
 * @author Vishwajeet
 * @desc Alert component to be replaced with window alert.
 * @vue-prop {any} message=String.
 * @vue-prop {string} position = "center" - message horizontal position [ left | right | center].
 * @vue-emit ['close'] returns nothings. 
 */
export default {
  name: "AlertDialog",
  props: {
    message: {
      type: String,
      default: 'Alert'
    },
    position: { type: String, default: "center" },
    // autohide: { default: 2000 },
    variant: {
      type: String,
      default: 'white'
    },
  },
  data() {
    return {
      // showArray: [],
      // show: false,
    };
  },

  computed: {

    computedStyle() {
      if (this.position === 'left') {
        return 'margin-right: auto'
      }
      if (this.position === 'right') {
        return 'margin-left: auto'
      }

      if (this.position === 'center') {
        return 'margin-inline: auto';
      }
    },
    textVariant() {
      return this.variant === 'white' ? 'text-dark' : 'text-white'
    },
    iconVariant() {
      return this.variant === 'white' ? 'gray5' : 'light'
    }

  },
};

</script>
<style lang="scss" scoped>
.dialog-wrapper {
  position: fixed;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 101;
}

.dialog {
  min-width: 20rem;
  width: fit-content;
  position: relative;
  max-width: 100%;
  height: fit-content;
  max-height: 50%;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 1rem;
  padding: 1rem;
  box-shadow: 0px 2px 12px rgba(120,120,120,0.5);
  z-index: 100;

  &__item {
    font-size: $base-size;
  }

  &__close {
    top: -0.5rem;
    float: right;
    margin-right: -0.5rem;
    cursor: pointer;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-to,
.fade-leave {
  /*opacity: 1;*/
  margin-top: 2rem;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  margin-top: 1rem;
}

</style>
