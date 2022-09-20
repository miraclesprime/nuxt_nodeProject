<template>
  <div class="position-relative">
    <template v-for="(group, index) in msgGroup">
      <div v-show="group.data.length > 0" class="d-flex align-center p-05" :key="group.title + index">
        <bib-icon icon="arrow-down" :scale="0.5"></bib-icon>
        <div class="px-1 font-w-500">
          {{group.title}}
        </div>
      </div>
      <!-- <div v-for="msg in messages">
        <message :msg="msg" @delete-message="onDeleteMessage"></message>
      </div> -->
      <div v-for="(msg, index) in group.data" :key="index + msg.id">
        <task-message :msg="msg" @delete-message="onDeleteMessage" @upload-file="uploadFileTrigger"></task-message>
      </div>
    </template>
    <!-- <reaction-picker ref="reactionPicker" @select="onReactionSelect" ></reaction-picker> -->
    
    <loading :loading="msgLoading"></loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
/*import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
dayjs.extend(relativeTime)
dayjs.extend(calendar)*/
export default {

  name: 'TaskMessageList',
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
      task: "task/getSelectedTask",
    }),
    msgGroup() {
      let msglist = [{ title: "Older", data: [] }, { title: "Yesterday", data: [] }, { title: "Today", data: [] }]
      this.messages.map(m => {
        let d = dayjs(m.updatedAt)
        let diff = d.diff(dayjs(), 'd')
        // console.info(diff)
        switch (diff) {
          case 0:
            msglist[2].data.push(m)
            break;
          case -1:
            msglist[1].data.push(m)
            break;
          default:
            msglist[0].data.push(m)
            break;
        }
      })
      return msglist
    }
  },

  /*created() {
    this.$on("upload-file", (msg) => {
      console.log(msg.id)
    })
  },*/
  methods: {

    async onReactionSelect(reaction, message) {
      this.$refs.reactionPicker.hide();
      /*await this.addMessageReaction({
        chatId: this.chat.id,
        messageId: message._id,
        reaction: reaction.data,
      });*/
    },

    async onDeleteMessage(payload) {
      this.msgLoading = true
      // let data = {taskId: this.task.id, commentId: payload.msgId }
      const del = await this.$store.dispatch("task/deleteTaskComment", payload);
      if (del.statusCode == 200) {
        this.$emit("refresh-list")
      }
      this.msgLoading = false
      // console.log(del)
    },
    /*editMessage(msg){
      console.log(msg)
    },*/
    uploadFileTrigger(msg){
      // console.log(msg)
      this.uploadModal = true
      this.msg = msg
    },
    handleChangeFile(files, event) {
      // console.info(this.$refs.files.filesUploaded)
      // console.log(files, event.target.files)
    },
    
  }
}

</script>
<style lang="scss" scoped>
</style>
