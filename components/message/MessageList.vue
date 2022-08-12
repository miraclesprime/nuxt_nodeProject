<template>
  <div>
    <div class="d-flex align-center p-05 ">
      <bib-icon icon="arrow-down" :scale="0.5"></bib-icon>
      <div class="px-1 ">
        Today
      </div>
    </div>
    <div v-for="msg in messages">
      <message :msg="msg"></message>
    </div>
    <reaction-picker ref="reactionPicker" @select="onReactionSelect" />
  </div>
</template>
<script>
export default {

  name: 'MessageList',
  props: {
    messages: { type: Array },
  },

  data() {
    return {
      /*files: [
        { img: 'https://placeimg.com/200/300/tech' },
        { img: 'https://placeimg.com/200/360/tech' },
        { img: 'https://placehold.jp/2ba026/ffffff/180x180.jpg' },
        { img: 'https://placehold.jp/24/1f42a2/ffffff/250x200.jpg?text=placeholder%20image' }
      ]*/
    }
  },
  methods: {

    showEmojiPicker(e, message) {
      console.log(e.target)
      const rect = this.$el.getBoundingClientRect();
      let left = e.pageX - rect.left;
      let top = e.pageY - rect.top;
      if (top + 424 > window.innerHeight) {
        top -= 312;
      }
      if (left < 327) {
        left += 347;
      }
      this.$refs.reactionPicker.show({ message, top, left });
    },
    async onReactionSelect(reaction, message) {
      this.$refs.reactionPicker.hide();
      await this.addMessageReaction({
        chatId: this.chat.id,
        messageId: message._id,
        reaction: reaction.data,
      });
    },
    async onReactionClick(messageId, reaction) {
      const msg = this.chat.messages.find((m) => m._id === messageId);
      const react = msg.reactions.find((r) => r.reaction === reaction && r.sender === this.user.id);
      if (react) {
        await this.removeMessageReaction({
          chatId: this.chat.id,
          messageId,
          reaction,
        });
      } else {
        await this.addMessageReaction({
          chatId: this.chat.id,
          messageId,
          reaction,
        });
      }
    },
    async onDeleteMessage() {
      await this.deleteMessage(this.deletingMessage);
      this.deletingMessage = null;
    },
  }
}

</script>
<style lang="scss" scoped>
</style>
