<template>
  <div class="position-relative">
    <div class="d-flex align-center p-05 ">
      <bib-icon icon="arrow-down" :scale="0.5"></bib-icon>
      <div class="px-1 ">
        Today
      </div>
    </div>
    <div v-for="msg in messages">
      <message :msg="msg" @delete-message="onDeleteMessage"></message>
    </div>
    <reaction-picker ref="reactionPicker" @select="onReactionSelect" ></reaction-picker>
    <loading :loading="msgLoading" ></loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {

  name: 'MessageList',
  props: {
    messages: { type: Array },
  },

  data() {
    return {
      msgLoading: false,
      /*files: [
        { img: 'https://placeimg.com/200/300/tech' },
        { img: 'https://placeimg.com/200/360/tech' },
        { img: 'https://placehold.jp/2ba026/ffffff/180x180.jpg' },
        { img: 'https://placehold.jp/24/1f42a2/ffffff/250x200.jpg?text=placeholder%20image' }
      ]*/
    }
  },
  computed: {
    ...mapGetters({
      project: "project/getSingleProject",
    })
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
    async onDeleteMessage(payload) {
      this.msgLoading = true
      // let data = {projectId: this.project.id, commentId: payload.msgId }
      const del = await this.$store.dispatch("project/deleteProjectComment", payload);
      if (del.statusCode == 200) {
        this.$emit("refresh-list")
      }
      this.msgLoading = false
      console.log(del)
    },
    /*editMessage(msg){
      console.log(msg)
    },*/
  }
}

</script>
<style lang="scss" scoped>
</style>
