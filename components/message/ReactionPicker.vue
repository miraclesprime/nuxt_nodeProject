<template>
  <div
    v-if="showPicker"
    v-click-outside="() => (showPicker = false)"
    :style="{ position: 'fixed', top: `${top}px`, left: `${left}px` }"
    id="reaction-picker-wrapper"
  >
    <v-emoji-picker @select="(emoji) => $emit('select', emoji, message)" />
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";

export default {
  name: "ReactionPicker",
  components: {
    VEmojiPicker,
  },
  data() {
    return {
      showPicker: false,
      top: 0,
      left: 0,
      message: null,
    };
  },
  methods: {
    show(data) {
      this.top = data.top;
      this.left = data.left;
      this.message = data.message;
      this.showPicker = true;
    },
    hide() {
      this.showPicker = false;
    },
  },
};
</script>