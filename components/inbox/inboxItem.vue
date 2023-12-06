<template>
  <div class="inbox-item border-bottom-gray2 py-105 px-105 position-relative cursor-pointer" :class="{'active': active == inboxItem[0]?.id}" @click="itemClick" id="inbox-item-wrapper">
    <!-- <div v-if="!status.markRead" class="new text-white font-xs position-absolute" id="inbox-item-new">New
      <span class="triangle" id="inbox-item-triangle"></span>
    </div> -->
    <div class="align-center justify-between gap-05">
      <div v-if="projTitle" class="align-center d-inline-flex gap-025 shape-pill bg-light font-sm text-secondary py-025 px-075" id="inbox-item-project" >
        <bib-icon icon="briefcase-solid" variant="secondary" :scale="0.8"></bib-icon> {{projTitle}} 
      </div>

      <div class="d-flex align-center justify-between " id="inbox-item-project-task-title" v-else>
        <div v-if="item.mode == 'task'" class="align-center gap-05">
          <bib-icon icon="check-circle-solid" variant="gray5" :scale="1.25"></bib-icon>
          <h4 id="task-project-title">{{item.title || taskTitle }}</h4>
        </div>
        <!-- <span id="calendar-date-wrapper" class="duedate d-inline-flex align-center shape-pill gap-05 bg-light px-05 py-025 ml-auto text-dark font-xs">
          <format-date :datetime="inboxItem[0].updatedAt"></format-date>
        </span> -->
      </div>

      <span id="calendar-date-wrapper" class="duedate d-inline-flex align-center shape-pill gap-05 bg-light px-05 py-025 ml-auto text-dark font-xs">
        <format-date :datetime="inboxItem[0]?.updatedAt"></format-date>
      </span>

      <div class="inbox-flags d-inline-flex align-center ">
        <!-- <span id="inbox-item-flag-icon" class="width-2 height-2 shape-circle d-flex align-center justify-center" v-tooltip="'Flag message'" @click.stop="markFavorite">
          <bib-icon icon="bookmark-solid" variant="gray5"></bib-icon>
        </span>
        <span id="inbox-item-file-icon" class="width-2 height-2 shape-circle d-flex align-center justify-center" v-tooltip="'Archive'" @click.stop="markArchive">
          <bib-icon icon="collection-solid" variant="gray5"></bib-icon>
        </span> -->
        <span id="inbox-item-bell-icon" class="width-2 height-2 shape-circle d-flex align-center justify-center" v-tooltip="readText" @click.stop="markRead">
          <bib-icon icon="mail" variant="gray5" v-if="!status.markRead"></bib-icon>
          <bib-icon icon="mail-new" variant="gray5" v-else></bib-icon>
        </span>
        <span v-if="!status.markRead" id="inbox-item-new-icon" class="shape-rounded px-025 bg-success text-white font-xs">
          NEW
        </span>
        <!-- <span id="inbox-item-icon" class="shape-rounded px-025 border-gray5 text-gray5 font-xs">{{item.id}}</span> -->
      </div>
    </div>

    <div class="d-flex align-center  py-1" id="inbox-item-project-task-title" v-if="item.mode == 'task' && projTitle">
      <div v-if="item.mode == 'task'" class="align-center gap-05">
        <bib-icon icon="check-circle-solid" variant="gray5" :scale="1.25"></bib-icon>
        <h4 id="task-project-title">{{item.title || taskTitle }}</h4>
      </div>
      <span id="calendar-date-wrapper" class="duedate d-inline-flex align-center shape-pill gap-05 bg-light px-05 py-025 ml-auto text-dark font-xs">
        <format-date :datetime="inboxItem[0]?.updatedAt"></format-date>
      </span>
    </div>

    <!-- <div id="inbox-item-tile-wrapper" class="w-100 d-inline-flex align-center gap-05 pb-05 text-secondary font-md">
      <span>
        <user-info :userId="inboxItem[0].userId" :members="members"></user-info>
      </span>
    </div> -->

    <div class="content font-md pt-05" id="ii-history-comment-wrap">
      <!-- <div v-if="item.content || item.comment" id="ii-content" class="inbox-item-content mb-05">
        <template v-for="(cn, i) in item.content">
          <div class="history" :id="'ii-history-'+i">{{truncateText(cn.title)}}</div>
          <div :id="'ii-time-'+i">@ {{cn.time}}</div>
        </template>
        <template v-for="(cm, i) in item.comment">
          <div class="comment" :id="'ii-comment-'+i">{{truncateText(cm.comment)}}</div>
          <div :id="'ii-updatedAt-'+i">@ {{$toTime(cm.updatedAt)}}</div>
        </template>
      </div> -->
      <div v-if="inboxItem.length > 0" id="ii-content" class="inbox-item-content ">
        <template v-for="(it, i) in inboxItem">
          <!-- <p>{{it.taskCommentId , it.projectCommentId}}</p> -->
          <template v-if="it.taskCommentId || it.projectCommentId">
            <inbox-comment :history="it"></inbox-comment>
          </template>
          <inbox-history v-else :history="it"></inbox-history>
        </template>
      </div>
        <!-- <span v-html="it.text"><br></span> -->
    </div>
    <!-- <div class="sent font-sm text-gray5">Sent
      @ {{$toTime(item.data.updatedAt)}} </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'InboxItem',
  
  props: {
    item: Object,
    active: [Number, String],
    members: [Array]
  },
  data() {
    return {
  
      fields: [{
          key: "title",
          label: "Task name",
          width: "70%",
        },
        {
          key: "time",
          label: "@",
        },
      ],
      status: {
        markRead: false,
        markFlag: false,
        markArchive: false,
      },
    }
  },
  computed: {
    ...mapGetters({
      userInbox: "inbox/getInbox",
    }),
    inboxItem(){
      let loggedUser = JSON.parse( localStorage.getItem("user") )
      let arr = this.item.data.filter(inb => {
        return inb.userId != loggedUser.sub
      })
      // console.log(arr)
      return arr
    },
    taskTitle() {
      return this.item['task'] ? this.item.task.title : ''
    },
    projTitle() {
      if (this.item.mode == "project") {
        return this.item.title
      } else {
        return null
      }
      // return this.item['project'] ? this.item.project.title : ''
    },
    inboxStatus() {
      let st = this.userInbox?.find(it => it.historyId == this.item.data[0].id)
      if (st) {
        this.status = st
        return st
      } else {
        this.status = { markRead: false, markFlag: false, markArchive: false }
        return { markRead: false, markFlag: false, markArchive: false }
      }
    },
    readText() {
      return this.inboxStatus.markRead ? 'Mark as Unread' : 'Mark as Read'
    },

  },
  methods: {
    itemClick() {
      let type = this.item.mode
      let id = this.item.id.split("-")[1]

      // console.log(type, id)
      if (type == "task") {
        this.$emit('task-click', { id: this.item.id, historyId: this.item.data[0].id, taskId: id })
      }
      if (type == "project") {
        // this.$store.dispatch('project/setProject', this.item.project)
        this.$emit('project-click', { id: this.item.id, historyId: this.item.data[0].id, projectId: id })
      }
      this.$store.dispatch("inbox/createInboxEntry", { historyId: this.item.data[0].id, obj: { markRead: true, markFlag: false, markArchive: false } })
    },
    markRead() {

      let obj1 = { markRead: false, markFlag: false, markArchive: false }

      if (this.status.markRead) {
        obj1.markRead = false
      } else {
        obj1.markRead = true
      }

      this.$store.dispatch("inbox/createInboxEntry", { historyId: this.item.data[0].id, obj: obj1 }).then(res => {
        if (res.statusCode == 200) {
          this.$store.dispatch("inbox/fetchInboxEntry", { id: this.status.id })
            .then(res => {
              this.status = res.data
            })
        }
      }).catch(e => console.warn(e))

    },

    /*truncateText(text){
      let t = _.truncate(text, {length: 200})
      return t.replace(/(<([^>]+)>)/gi, "")
    },*/

    markArchive(){
      alert("In-Progress")
    },
    markFavorite(){
      alert("In-Progress")
    },
  }
}

</script>
<style lang="scss" scoped>
.inbox-item {
  h4 {
    font-size: 16px;
  }

  &-content {
    /*background-color: white;
    display: grid;
    grid-template-columns: 1fr max-content;
    border-top: 1px solid $light;
    border-right: 1px solid $light;*/

    /*>* {
      padding: 0.325rem;
      border-bottom: 1px solid $light;
      border-left: 1px solid $light;
    }*/
      
  }

  &.active {
    background-color: white;
    outline: $gray1 solid 1px;
    outline-offset: -1px;

    /*.new {
      span {
        border-right-color: $light;
      }
    }*/
  }
  &:hover {
    background-color: white;
  }
}

.new {
  background-color: $success;
  left: 0;
  top: 1.25rem;
  padding-left: 0.35rem;
  padding-right: 0.75rem;
  height: 24px;
  line-height: 24px;

  span {
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 6px solid white;
  }
}

</style>
