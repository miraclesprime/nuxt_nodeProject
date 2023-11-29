<template>
  <div class="dialog-wrapper" id="confirm-dialogue-wrapper">
    <transition name="fade" appear>
      <div class="dialog shape-rounded" id="confirm-dialogue-shape-rounded" :class="[`bg-${variant}`]" :style="computedStyle">
        <!-- message -->
        <div class="d-flex gap-05" id="confirm-dialogue-warning-wrap">
          <bib-icon icon="warning" :variant="iconVariant" :scale="1.2" />
          <div class="dialog__item " id="confirm-dialogue-item" :class="[textVariant]" v-html="message">
          </div>
        </div>
        <!-- buttons -->
        <div class="d-flex justify-between pt-105" id="confirm-dialogue-cancel-ok-btn-wrap">
          <bib-button label="Cancel" id="confirm-dialogue-cancel-btn" variant="secondary" pill @click.native.stop="close(false)"></bib-button>
          <bib-button label="Ok" id="confirm-dialogue-ok-btn" variant="primary-24" pill @click.native.stop="close(true)"></bib-button>
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
 * @vue-prop {any} message = String.
 * @vue-prop {string} position = "center" - message horizontal position [ left | right | center].
 *
 * @vue-emit ['close'] returns [true | false] depends if the user clicks 'Cancel' or 'Ok'.
 */
export default {
  name: "ConfirmDialog",
  props: {
    message: {
      type: String,
      default: 'Notification Message.'
    },
    position: { type: String, default: "center" },
    variant: {
      type: String,
      default: 'white'
    },
  },
  data() {
    return {
      timeoutName: `popupNotificationMsgTimeout_${Math.floor(Math.random() * Date.now())}`
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
  methods: {
    close(state) {
      this.$emit("close", state);
    },
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
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
