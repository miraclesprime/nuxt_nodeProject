<template>
  <div>
    <bib-detail-collapse label="Today" open>
      <template v-slot:content>
        <!-- <div v-rowby="100">
          <div class="pl-1 pr-1">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto soluta repellendus recusandae possimus illum quod nostrum eum aliquid iusto nesciunt, atque commodi consectetur, dolore veniam excepturi delectus reiciendis, officiis ad.
          </div>
        </div> -->
        <div v-for="msg in messages">
          <message :msg="msg"></message>
        </div>
        <reaction-picker ref="reactionPicker" @select="onReactionSelect" />
      </template>
    </bib-detail-collapse>
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
