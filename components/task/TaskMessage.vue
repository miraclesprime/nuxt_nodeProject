<template>
  <div class="msg position-relative" @mouseenter="isActionBarShowing = true" @mouseleave="onActionBarMouseLeave" v-click-outside="onActionBarClickOutside">
    
      <figure class=" user-avatar " :class="{active: userCardVisible}">
        <bib-avatar size="2rem" :src="user1.Photo"></bib-avatar>
      </figure>
      <!-- user info -->
      <div class="msg__owner ">{{user1.Name}} <span class="ml-05">{{$displayDate(msg.updatedAt)}}</span>
      </div>
      <!-- message content -->
      <div class="msg__content pb-05" v-html="msg.comment">
        <p>Lorem ipsum dolor sit amet consectetur 🙂, <a href="https://dev.proj-mgmt.biztree.com/">ipsum</a> adipisicing elit. Sit eum praesentium animi error delectus reprehenderit neque odit? Nesciunt facere quod ab veniam eligendi architecto vitae?</p>
      </div>
    
    <!-- message reactions -->
    <div v-if="reactionsExist" class="reactions-section">
      <div class="reactions">
        <div v-for="react in reactionGroup" :key="reactionKey + react.reaction + msg.id" class="reaction " :class=" ownReaction(react) " name="reaction1" @click.stop="deleteOwnReaction(react)">
          {{ react.reaction }} <span class="count">{{react.count}}</span>
        </div>
        <bib-spinner v-if="reactionSpinner" :scale="2" variant="primary"></bib-spinner>
      </div>
    </div>
    <!-- message files -->
    <div v-if="files.length > 0" class="msg-files pb-05">
      <message-collapsible-section>
        <template slot="title">Files ({{ files.length }})</template>
        <template slot="content">
          <div class="d-flex align-start gap-1 mt-05 mb-075">
            <message-files v-for="file in files" :property="file" :key="tempKey + file.key" @file-click="showPreviewModal(file)"></message-files>
          </div>
        </template>
      </message-collapsible-section>
    </div>
    
    <!-- message action bar -->
    <div v-if="isActionBarShowing" class="actions-container" @click.stop>
      <div class="action" @click.stop="onLikeClick">
        <fa :icon="faThumbsUp" />
      </div>
      <tippy :visible="isReactionPickerOpen" theme="light-border p-0" :animate-fill="false" :distance="6" interactive placement="bottom-end" trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
        <template slot="trigger">
          <div class="action" :class="{ active: isReactionPickerOpen }" @click="toggleReactionPicker">
            <fa :icon="faSmile" />
          </div>
        </template>
        <div @click.stop>
          <v-emoji-picker @select="onReactionClick" />
        </div>
      </tippy>
      <tippy :visible="isMenuOpen" theme="light-border p-0" :animate-fill="false" :distance="6" interactive placement="bottom-end" trigger="manual" :onHide="() => defer(() => (isMenuOpen = false))">
        <template slot="trigger">
          <div v-if="msg.userId == user.Id" class="action" :class="{ active: isMenuOpen }" @click="toggleMenu">
            <fa :icon="faEllipsisH" />
          </div>
        </template>
        <div class="menu" :class="{ open: isMenuOpen }">
          <div v-if="msg.userId == user.Id" class="menu-item">
            <a @click.stop="editMessage">Edit</a>
          </div>
          <div v-if="msg.userId == user.Id" class="menu-item">
            <a @click.stop="attachFile">Attach file</a>
          </div>
          <div class="menu-item-separator"></div>
          <div v-if="canDeleteMessage" class="menu-item danger">
            <a @click.stop="deleteMessage">Delete</a>
          </div>
        </div>
      </tippy>
    </div>
    <!-- file upload modal -->
    <bib-modal-wrapper v-if="uploadModal" title="Select file(s)" @close="uploadModal = false">
      <template slot="content">
        <div style="margin-left: -1rem; margin-right: -1rem;">
          <bib-input type="file" ref="files" @files-dropped="handleChangeFile" variant="accepted" iconLeft="upload" placeholder="Upload from device"></bib-input>
        </div>
        <loading :loading="fileLoader"></loading>
      </template>
      <template slot="footer">
        <div class="d-flex">
          <bib-button label="Cancel" variant="light" pill @click="uploadModal = false"></bib-button>
          <bib-button label="Upload" variant="success" class="ml-auto" pill @click="uploadFiles"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <!-- file preview modal -->
    <bib-modal-wrapper v-if="previewModal" title="Preview" size="lg" @close="closePreviewModal">
      <template slot="content">
        <div class="text-center">
          <img v-if="imgPreview" :src="imgPreview" class="w-fit" style="max-width:100%;" alt="preview">
          <pdf-preview v-else-if="pdfPreview" :pdfsrc="pdfPreview"></pdf-preview>
          <bib-spinner v-else class="mx-auto" ></bib-spinner>
        </div>
      </template>
      <template slot="footer">
        <div class="text-center">
          <bib-button label="Close" variant="light" pill @click="closePreviewModal"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import { TippyComponent } from 'vue-tippy';
import { VEmojiPicker } from 'v-emoji-picker';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFile,
  faThumbsUp,
  faSmile,
  faShare,
  faEllipsisH,
  faStar as fasStar,
} from '@fortawesome/free-solid-svg-icons';
import { faComment, faStar } from '@fortawesome/free-regular-svg-icons';
import "~/assets/tippy-theme.scss";

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {

  name: 'TaskMessage',
  props: {
    msg: Object,
  },
  components: {
    fa: FontAwesomeIcon,
    tippy: TippyComponent,
    VEmojiPicker,
  },

  data() {
    return {
      isActionBarShowing: false,
      isMenuOpen: false,
      isShowingDeleteConfirmModal: false,
      isReactionPickerOpen: false,
      faFile,
      faThumbsUp,
      faSmile,
      faComment,
      faShare,
      faEllipsisH,
      faStar,
      fasStar,
      showPlaceholder: true,
      userCardVisible: false,
      value: {
        files: []
      },
      files: [],
      reactions: [],
      reactionKey: 1,
      reactionSpinner: false,
      tempKey: 1,
      uploadModal: false,
      fileLoader: false,
      previewModal: false,
      user1: this.$userInfo(this.msg.userId),
      imgPreview: '',
      pdfPreview: '',
      alertDialog: false,
      alertMsg:"",
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers',
      project: 'project/getSingleProject',
      task: 'task/getSelectedTask'
    }),
    
    reactionsExist() {
      if (this.msg.reactions?.length || this.reactionGroup.length) {
        return true
      } else {
        return false
      }
    },
    reactionGroup() {
      let rg = []
      if (this.reactions.length) {
        this.reactions.map(r => {
          let rindex = rg.findIndex((el) => el.reaction == r.reaction)
          let relem = rg.find((el, index) => el.reaction == r.reaction)
          if (relem == undefined) {
            rg.push({ reaction: r.reaction, count: 1, data: [{ id: r.id, user: r.user }] })
          } else {
            rg[rindex].count += 1
            rg[rindex].data.push({ id: r.id, user: r.user })
          }
        })
      }
      this.reactionKey += 1
      return rg
    },
    canDeleteMessage() {
      if (this.msg.userId == this.user.Id || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN' ) {
        return true;
      }
      return false
    },

  },
  created() {
    this.$nuxt.$on("get-taskmsg-files", () => {
      _.delay(() => {
        this.getFiles()
      }, 2000)
    })
  },
  mounted() {
    
    this.fetchReactions()
    this.getFiles()

  },

  methods: {
    fetchReactions() {
      this.$axios.get('/task/' + this.msg.id + "/reactions", {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
        })
        .then(r => {
          if (r.data.statusCode == 200) {
            this.reactions = r.data.data
            this.reactionKey += 1
          }
        })
        .catch(e => console.log(e))
    },
    ownReaction(reaction) {
      return { sent: reaction.data.some(d => d.user.id == this.user.Id) }
    },
    deleteOwnReaction(reaction) {
      this.reactionSpinner = true
      let react = reaction.data.find(d => d.user.id == this.user.Id)
      this.$axios.delete("/task/" + this.msg.id + "/reaction", {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") },
          data: { reactionId: react.id, userId: react.userId },
        })
        .then(d => {
          this.fetchReactions()
          this.reactionSpinner = false
        })
        .catch(e => console.log(e))
    },
    onFileInput(payload) {
      this.value.files = payload.files
    },
   
    onActionBarMouseLeave() {
      if (!(this.isMenuOpen || this.isReactionPickerOpen)) {
        this.isActionBarShowing = false;
        this.isMenuOpen = false;
        this.isReactionPickerOpen = false;
      }
    },
    onActionBarClickOutside() {
      this.isActionBarShowing = false;
      this.isMenuOpen = false;
      this.isReactionPickerOpen = false;
      this.userCardVisible = false
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.isReactionPickerOpen = false;
    },
    toggleReactionPicker() {
      this.isReactionPickerOpen = !this.isReactionPickerOpen;
      this.isMenuOpen = false;
    },
    onReactionClick({ data }) {
      this.isReactionPickerOpen = false;
      this.reactionSpinner = true
      let duplicateReaction = this.reactions.some(r => r.userId == this.user.Id && r.reaction == data)
      if (duplicateReaction) {
        this.alertDialog = true
        this.alertMsg = "Reaction already exists"
        this.reactionSpinner = false
      } else {
        this.$axios.post("/task/" + this.msg.id + "/reaction", { reaction: data, taskId: this.task.id, text: `reacted ${data} to comment` }, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
          })
          .then(d => {
            if (d.data.statusCode == 200) {
              this.fetchReactions()
              this.reactionSpinner = false
            }
          })
          .catch(e => console.log(e))
      }
    },
    onLikeClick() {
      this.reactionSpinner = true
      let duplicateReaction = this.reactions.some(r => r.userId == this.user.Id && r.reaction == "👍")
      if (duplicateReaction) {
        this.alertDialog = true
        this.alertMsg = "Reaction already exists"
        this.reactionSpinner = false
      } else {
        this.$axios.post("/task/" + this.msg.id + "/reaction", { reaction: "👍", taskId: this.task.id, text: "liked 👍 the comment" }, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
          })
          .then(d => {
            if (d.data.statusCode == 200) {
              this.fetchReactions()
              this.reactionSpinner = false
            }
          })
          .catch(e => console.log(e))
      }
    },
    defer(func) {
      setTimeout(func, 0);
    },
    editMessage() {
      this.$nuxt.$emit('edit-message', this.msg);
      this.isMenuOpen = false;
    },
    deleteMessage() {
      this.$emit('delete-message', {
        taskId: this.msg.taskId ? this.msg.taskId : null,
        commentId: this.msg.id,
        userId: this.msg.userId,
      });
      this.isMenuOpen = false;
    },
    attachFile() {
      this.uploadModal = true
      this.isMenuOpen = false;
    },
    handleChangeFile() {
    },
    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded
      let filelist = []

      let formdata = new FormData()
      myfiles.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      formdata.append('projectId', this.project.id)
      formdata.append('taskId', this.task.id)
      formdata.append('taskCommentId', this.msg.id)
      formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to comment`)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (fi.data.statusCode == 200) {
        _.delay(() => {
          this.getFiles()
          if (this.files.length < 1) {
            _.delay(() => {
              this.getFiles()
            }, 3500)
          }
        }, 2000);
      }
      this.fileLoader = false
      this.uploadModal = false
    },
    getFiles() {
      let obj1 = { taskCommentId: this.msg.id }
      this.$axios.get("file/db/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
      }).then(f => {
        if (f.data.statusCode == 200) {
          this.files = f.data.data
          this.tempKey += 1
        }
      }).catch(e => {
        console.error(e)
      })
    },

    async showPreviewModal(file){
      this.previewModal = true

      if (file.type.indexOf('image/') == 0 && "url" in file) {
        let imgtype = file.type.split("/")[1]
        const prev = await this.$axios.get("file/single/"+file.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'preview': 'preview'
          }
        })
        this.imgPreview = `data:image/${imgtype};base64,${prev.data.data}`
        this.pdfPreview = ''

      } else if(file.type.indexOf('pdf') && "url" in file) { 

        const prev = await this.$axios.get("file/single/"+file.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'preview': 'preview'
          }
        })
        this.pdfPreview = `data:application/pdf;base64,${prev.data.data}`
        this.imgPreview = ''
        
      } else {
        this.downloadFile(file)
        this.previewModal = false
      }
    
    },
    closePreviewModal(){
      this.pdfPreview = ''
      this.imgPreview = ''
      this.previewModal = false
    }
  }
}

</script>

<style lang="scss" scoped>
.msg {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 3rem;
  font-size: $base-size;
  color: $text;

  &__owner {
    font-weight: 600;

    span {
      color: $gray6;
      font-weight: normal;
    }
  }

  &__content {
  }

  &__files {
    color: $gray5;

    .file {
      .file-overlay {
        position: absolute;
        inset: 40%;
        z-index: 3;
        background-color: rgba(220, 220, 230, 0.25);
        opacity: 0.1;
        transition: opacity 300ms ease-in, inset 400ms linear;
      }

      .file-menu {
        opacity: 0;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 5;
        transition: opacity 200ms ease-out 400ms;

        .list {
          max-width: 12rem;
        }

        .file-name {
          white-space: normal;
          word-break: break-all;
          height: auto;
          cursor: default;
        }
      }

      &:hover {
        .file-menu {
          opacity: 1;
        }

        .file-overlay {
          inset: 0;
          opacity: 1;
        }
      }
    }
  }
}


.user-avatar {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0.125rem;

  &.active {
    z-index: 5;
  }
}

.user-card {
  position: absolute;
  z-index: 3;
  width: 18rem;
  height: 0;
  min-height: 0;
  padding: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(10, 10, 10, 0.25);
  border-radius: 0.75rem;
  left: 0.25rem;
  top: 0.25rem;
  font-size: 1rem;
  user-select: none;
  pointer-events: none;
  opacity: 0;
  transition: all 400ms ease;

  .user-info {
    padding-left: 3.75rem;

    .user-name {
      font-weight: 500;
      line-height: 1.2;
    }

    .user-job {
      color: $gray6;
      line-height: 1;
    }
  }

  .user-btn {
    margin-top: 1.5rem;

    .btn {
      border-radius: 3rem;
    }
  }

  .user-contact {
    margin-top: 1.5rem;
    border-radius: 0.6rem;
  }

  &.active {
    opacity: 1;
    z-index: 4;
    pointer-events: all;
    height: auto;
    min-height: 10rem;
  }
}

.actions-container {
  position: absolute;
  padding: 6px;
  background-color: #dcdcdf;
  border-radius: 8px;
  top: 10px;
  right: 0px;
  gap: 5px;
  display: flex;
}

.action {
  width: 28px;
  height: 28px;
  font-size: 14px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f2f5;
  color: #b1b1b4;
  cursor: pointer;

  &.active {
    background: $dark;
    color: white !important;
  }

  &.liked {
    color: #2ba026 !important;
  }

  &.reaction-picker-open {
    color: #ffa200;
  }

  &.favorite.favorited {
    ::v-deep svg {
      fill: $primary-24;
    }
  }

  &:hover {
    color: $dark;

    ::v-deep svg {
      fill: $dark;
    }
  }

  ::v-deep svg {
    width: 16px;
    fill: #b1b1b4;
  }
}

.menu {
  width: 170px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.15);

  &-item {
    padding: 3px 3px;
    cursor: pointer;
    font-size: 0.85rem;
    color: #333;

    a {
      display: block;
      padding: 5px 10px;
      border-radius: 5px;
      text-decoration: none;
      color: black;

      &:hover {
        background-color: #efeff2;
      }
    }

    &.danger a {
      color: #d9000d;

      &:hover {
        color: white;
        background-color: #d9000d;
      }
    }
  }

  &-item-separator {
    height: 1px;
    background-color: #efeff2;
  }
}

.reaction-picker {
  width: 290px;
  border-radius: 7px;
  display: none;
  position: absolute;
  top: 45px;
  right: -60px;
  z-index: 9999;
  background: #fff;
  flex-wrap: wrap;
  padding: 10px;
  gap: 5px;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.15);

  &.open {
    display: flex;
  }

  .reaction-item {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #eee8ff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;

    &:hover {
      background-color: #d2c2ff;
    }

    &.selected {
      background-color: #8a60ff;
    }
  }
}

.reactions-section {
  margin-bottom: 8px;

  .reactions {
    display: flex;
    gap: 5px;
  }

  .reaction {
    font-size: 16px;
    border: 1px solid $gray4;
    border-radius: 8px;
    padding: 2px 4px;
    cursor: pointer;

    &.sent {
      background-color: $warning-sub3;
      border-color: $gray5;
    }

    .count {
      font-size: 14px;
      color: $gray6;
    }
  }
}

.msg-files {
  color: $gray5;
}

.highlight {
  animation: highlight 3s ease 0.5s;
}


@keyframes highlight {
  from {
    background-color: #ffba42;
  }

  to {
    background-color: fff;
  }
}
::v-deep {
  .tippy-popper {
    .tippy-tooltip { padding: 1px !important;}
    .tippy-content { margin: -0.3125rem -0.5625rem; }
  }
}
.tippy-popper .tippy-tooltip { padding: 1px !important;}

</style>
