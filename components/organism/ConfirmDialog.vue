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
        <!-- buttons -->
        <div class="d-flex justify-between pt-105">
          <bib-button label="Cancel" variant="secondary" pill @click="close(false)"></bib-button>
          <bib-button label="Ok" variant="primary" pill @click="close(true)"></bib-button>
          <!-- <div class="dialog__close align-center ml-1" @click="close('button')">
          <bib-icon icon="close" :variant="iconVariant" :scale="1.4" class="m-auto" />
        </div> -->
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
/**
 * @module Molecules/Dialog
 * @author Vishwajeet
 * @desc Dialog component to be replaced with window dialogs.
 * @vue-prop {any} message=String.
 * @vue-prop {string} position="center" - message position [ left | right | center].
 * @vue-prop {number} timeout=3000 - miliseconds timeout to hide the message.
 *
 * method [@close] returns [auto | button] depends if the user closes the message box or if it is autoclosed
 */
export default {
  name: "ConfirmDialog",
  props: {
    message: {
      type: String,
      default: 'Notification Message.'
    },
    position: { type: String, default: "center" },
    autohide: { default: 2000 },
    variant: {
      type: String,
      default: 'white'
    },
  },
  data() {
    return {
      // showArray: [],
      // show: false,
      timeoutName: `popupNotificationMsgTimeout_${Math.floor(Math.random() * Date.now())}`
    };
  },

  computed: {
    /*computedStyle() {
      let pos;
      if (this.position === "center") {
        pos = [{ top: "50%" }, { left: "50%" }, { transform: "translate(calc(-50% - 1rem), -50%)" }];
      } else {
        const tempPosition = this.position.split("-");
        pos = [{
          [tempPosition[0]]: "0"
        }, {
          [tempPosition[1]]: "0"
        }];
      }

      return [...pos];
    },*/

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
  mounted() {
    // this.showHide();
  },
  methods: {
    close(state) {
      // this.show = false;
      this.$emit("close", state);
      // clearTimeout(window[this.timeoutName]);
    },
  },
};

</script>
<style lang="scss" scoped>
.dialog-wrapper {
  position: fixed;
  inset: 0;
  /*width: fit-content;
  max-width: 100%;
  height: fit-content;*/
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
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
