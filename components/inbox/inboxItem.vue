<template>
  <div class="inbox-item border-bottom-gray2 py-1 px-3 position-relative cursor-pointer" :class="{'active': active == item.data[0].id}" @click="itemClick" id="inbox-item-wrapper">
    <div v-if="!status.markRead" class="new text-white font-xs position-absolute" id="inbox-item-new">New
      <span class="triangle" id="inbox-item-triangle"></span>
    </div>
    <div id="inbox-item-tile-wrapper" class="w-100 d-inline-flex align-center gap-05 pb-05 text-secondary font-md">
      <span>
        <user-info :userId="item.data[0].userId" :members="members"></user-info>
      </span>
      <span v-if="projTitle" class="align-center gap-025" id="inbox-item-briefcase-icon">
        <bib-icon icon="briefcase" variant="gray5"></bib-icon> {{projTitle}}
      </span>
      <div class="inbox-flags d-inline-flex align-center ml-auto">
        <!-- <span id="inbox-item-flag-racing-icon" class="width-2 height-2 shape-circle d-flex align-center justify-center" v-tooltip="'Flag message'">
          <bib-icon icon="flag-racing" variant="gray5"></bib-icon>
        </span> -->
        <span id="inbox-item-mail-solid-icon" class="width-2 height-2 shape-circle d-flex align-center justify-center" v-tooltip="readText" @click.stop="markRead">
          <bib-icon icon="mail-solid" :variant="status.markRead ? 'gray6' : 'gray5'"></bib-icon>
        </span>
        <!-- <span id="inbox-item-file-multiple-icon" class="width-2 height-2 shape-circle d-flex align-center justify-center" v-tooltip="'Archive'">
          <bib-icon icon="file-multiple" variant="gray5"></bib-icon>
        </span> -->
        <!-- <span id="inbox-item-icon" class="shape-rounded px-025 border-gray5 text-gray5 font-xs">{{item.id}}</span> -->
      </div>
    </div>
    <div class="d-flex align-center justify-between" id="inbox-item-project-task-title">
      <h4 id="task-project-title">{{item.title || taskTitle || projTitle}}</h4>
      <span id="calendar-date-wrapper" class="duedate d-inline-flex align-center gap-05 text-secondary font-md">
        <bib-icon icon="calendar" variant="gray5"></bib-icon>
        <format-date :datetime="item.data[0].updatedAt"></format-date>
      </span>
    </div>
    <div class="content font-md py-05" id="ii-history-comment-wrap">
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
      <div v-if="item.data.length > 0" id="ii-content" class="inbox-item-content mb-05">
        <template v-for="(it, i) in item.data">
            <div class="history" :id="'ii-history-'+i">{{truncateText(it.text)}}</div>
            <div class="text-secondary" :id="'ii-updatedAt-'+i">@ {{$toTime(it.updatedAt)}}</div>
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

    truncateText(text){
      let t = _.truncate(text, {length: 200})
      return t.replace(/(<([^>]+)>)/gi, "")
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
    background-color: white;
    display: grid;
    grid-template-columns: 1fr max-content;
    border-top: 1px solid $light;
    border-right: 1px solid $light;

    >* {
      padding: 0.325rem;
      border-bottom: 1px solid $light;
      border-left: 1px solid $light;
    }
  }

  &.active {
    background-color: $light;

    .new {
      span {
        border-right-color: $light;
      }
    }
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
