<template>
  <div class="msg position-relative py-025" @mouseenter="isActionBarShowing = true" @mouseleave="onActionBarMouseLeave" v-click-outside="onActionBarClickOutside" id="message-wrapper">
    <div class="d-flex align-center pb-025">
      <figure class="width-2 user-avatar " :class="{active: userCardVisible}" @click="toggleUserCard">
        <bib-avatar size="1.5rem" :src="$userInfo(msg.userId).Photo"></bib-avatar>
      </figure>

      <div class="msg__owner text-dark font-w-600" id="msg-owner">{{$userInfo(msg.userId).Name}} <span id="msg-timepast" class="ml-1 font-sm text-gray4">{{displayDate}}</span>
      </div>
    </div>

    <!-- message content -->
    <div class="msg__content text-dark" v-html="msg.comment" :id="'msg-content'+msg.id">
      <p>Lorem ipsum dolor sit amet consectetur 🙂, <a href="http://dev.proj-mgmt.business-in-a-box.com">ipsum project management</a> adipisicing elit. Sit eum praesentium animi error delectus reprehenderit neque odit? Nesciunt facere quod ab veniam eligendi architecto vitae?</p>
    </div>

    <!-- message reactions -->
    <div v-if="reactionsExist" class="reactions-section my-025" :id="'msg-reaction-section'+msg.id">
      <div class="reactions" :id="'msg-reactions'+msg.id">
        <div v-for="(react, index) in reactionGroup" :key="reactionKey + react.reaction + msg.id" class="reaction " :class=" ownReaction(react) " name="reaction1" @click.stop="deleteOwnReaction(react)" :id="'msg-'+index">
          {{ react.reaction }} <span class="count" :id="'msg-count-'+index">{{react.count}}</span>
        </div>
        <bib-spinner v-if="reactionSpinner" :scale="2" variant="primary"></bib-spinner>
      </div>
    </div>

    <!-- message files -->
    <div v-if="files.length > 0" class="msg-files pb-05" id="msg-file-content-wrapper">
      <message-collapsible-section>
        <template slot="title">Files ({{ files.length }})</template>
        <template slot="content">
          <div class="d-flex align-start flex-wrap gap-1 mt-05 mb-075" id="msg-files-wrap">
            <message-files v-for="file in files" :property="file" :key="file.key" @file-click="showPreviewModal(file)" ></message-files>
          </div>
        </template>
      </message-collapsible-section>
    </div>

    <!-- message action bar -->
    <div v-if="isActionBarShowing" class="actions-container" id="msg-action-container" @click.stop>
      <div class="action" @click.stop="onLikeClick" id="msg-action">
        <fa :icon="faThumbsUp" />
      </div>
      <tippy :visible="isReactionPickerOpen" theme="light-border p-0" :animate-fill="false" :distance="6" interactive placement="bottom-end" trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
        <template slot="trigger">
          <div class="action" id="msg-toggle-reaction-picker" :class="{ active: isReactionPickerOpen }" @click="toggleReactionPicker">
            <fa :icon="faSmile" />
          </div>
        </template>
        <div id="msg-onReactionClick" @click.stop>
          <v-emoji-picker @select="onReactionClick" />
        </div>
      </tippy>
      <tippy :visible="isMenuOpen" theme="light-border p-0" :animate-fill="false" :distance="6" interactive placement="bottom-end" trigger="manual" :onHide="() => defer(() => (isMenuOpen = false))">
        <template slot="trigger">
          <div id="msg-toggleMenu" class="action" :class="{ active: isMenuOpen }" @click="toggleMenu">
            <fa :icon="faEllipsisH" />
          </div>
        </template>
        <div id="msg-isMenuOpen" class="menu" :class="{ open: isMenuOpen }">
          <div id="msg-menu-item1" v-if="msg.userId == user.Id" class="menu-item">
            <a id="msg-editMessage" @click.stop="editMessage">Edit</a>
          </div>
          <div id="msg-menu-item2" v-if="msg.userId == user.Id" class="menu-item">
            <a id="msg-attachFile" @click.stop="attachFile">Attach file</a>
          </div>
          <div id="msg-menu-item-separator" class="menu-item-separator"></div>
          <div id="msg-canDeleteMessage" v-if="canDeleteMessage" class="menu-item danger">
            <a id="msg-deleteMessage" @click.stop="deleteMessage">Delete</a>
          </div>
        </div>
      </tippy>
    </div>
    <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>

    <!-- file upload modal -->
    <bib-modal-wrapper v-if="uploadModal" title="Select file(s)" @close="uploadModal = false">
      <template slot="content">
        <div id="msg-handleChangeFile" style="margin-left: -1rem; margin-right: -1rem;">
          <bib-input type="file" ref="files" @files-dropped="handleChangeFile" variant="accepted" iconLeft="upload" placeholder="Upload from device"></bib-input>
        </div>
        <loading :loading="fileLoader"></loading>
      </template>
      <template slot="footer">
        <div id="msg-upload-modals-wrapper" class="d-flex">
          <bib-button label="Cancel" variant="light" pill @click="uploadModal = false"></bib-button>
          <bib-button label="Upload" variant="success" class="ml-auto" pill @click="uploadFiles"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>

    <!-- file preview modal -->
    <bib-modal-wrapper v-if="previewModal" title="Preview" size="lg" @close="closePreviewModal">
      <template slot="content">
        <div id="msg-image-preview" class="text-center">
          <img id="msg-img-preview" v-if="imgPreview" :src="imgPreview" class="w-fit" style="max-width:100%;" alt="preview">
          <pdf-preview v-else-if="pdfPreview" :pdfsrc="pdfPreview"></pdf-preview>
          <bib-spinner v-else class="mx-auto" ></bib-spinner>
        </div>
      </template>
      <template slot="footer">
        <div id="msg-close-button" class="text-center">
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

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {
  name: 'Message',
  props: {
    msg: Object,
    fieldkey: {
      type: String, 
      default: () => { 
        return 'project'
      }
    }
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
      replyModal: false,
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
      
      files: [],
      previewModal: false,
      imgPreview: '',
      pdfPreview: '',
      reactions: [],
      reactionKey: 1,
      reactionSpinner: false,
      tempKey: 1,
      uploadModal: false,
      fileLoader: false,
      alertDialog: false,
      alertMsg:"",
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers'
    }),
    displayDate() {
      return dayjs(this.msg.updatedAt).fromNow()
    },
    
    reactionsExist() {
      if (this.msg.reactions?.length || this.reactionGroup.length) {
        return true
      } else {
        return false
      }
    },
    reactionGroup() {
      let rg = []
      if (this.reactions) {
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
      if (this.msg.userId == this.user.Id || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        return true;
      }
      return false
      
    },

  },
  created(){
    this.$nuxt.$on("get-msg-files", () => {
      this.getFiles()
    })
  },
  mounted() {
    this.reactions = _.cloneDeep(this.msg.reactions);
    this.getFiles()
  },
  methods: {
    fetchReactions() {
      this.$axios.get(`/${this.fieldkey}/${this.msg.id}/reactions`, {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
        })
        .then(r => {
          // console.log('fetch reactions', r.data)
          if (r.data.statusCode == 200) {
            this.reactions = r.data.data
            this.reactionKey += 1
            if (process.server) return
            if (this.msg?.taskId) {
              this.$nuxt.$emit("reload-taskComments", this.msg)
            }
            if (this.msg?.projectId) {
              this.$nuxt.$emit("reload-projectComments", this.msg)
            }
          }
        })
        .catch(e => console.log(e))
    },
    ownReaction(reaction) {
      return { sent: reaction.data.some(d => d.user.id == this.user.Id) }
    },
    async deleteOwnReaction(reaction) {
      this.reactionSpinner = true
      let react = reaction.data.find(rd => rd.user.id == this.user.Id)
      // console.log(reaction, react)
      if (react) {
        const res = await this.$axios.delete(`/${this.fieldkey}/${this.msg.id}/reaction`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") },
            data: { reactionId: react.id, userId: react.user.id },
          })
        if (res.data.statusCode == 200) {
          this.fetchReactions()
          this.reactionSpinner = false
        } else {
          console.warn(res.data.message)
          this.reactionSpinner = false
        }
      } else {
        // this.onReactionClick(reaction)
        const res = await this.$axios.post(`/${this.fieldkey}/${this.msg.id}/reaction`, { reaction: reaction.reaction, [`${this.fieldkey}Id`]: this.msg[`${this.fieldkey}Id`], text: `reacted ${reaction.reaction} to comment` }, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
          })
        if (res.data.statusCode == 200) {
          this.fetchReactions()
          this.reactionSpinner = false
        } else {
          console.warn(res.data.message)
          this.reactionSpinner = false
        }
      }
        
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
      // console.log(data)
      this.isReactionPickerOpen = false;
      this.reactionSpinner = true
      let duplicateReaction = this.reactions.some(r => r.userId == this.user.Id && r.reaction == data)
      
      if (duplicateReaction) {
        this.alertDialog = true
        this.alertMsg = "Reaction already exists"
        this.reactionSpinner = false
      } else {

        this.$axios.post(`/${this.fieldkey}/${this.msg.id}/reaction`, { reaction: data, [`${this.fieldkey}Id`]: this.msg[`${this.fieldkey}Id`], text: `reacted ${data} to comment` }, {
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
        this.$axios.post(`/${this.fieldkey}/${this.msg.id}/reaction`, { reaction: "👍", [`${this.fieldkey}Id`]: this.msg[`${this.fieldkey}Id`], text: "liked 👍 the comment" }, {
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
    replyMessage() {
      this.replyModal = !this.replyModal
    },

    defer(func) {
      setTimeout(func, 0);
    },

    editMessage() {
      this.$nuxt.$emit('edit-message', this.msg);
      this.isMenuOpen = false;
    },
    deleteMessage() {
      this.$emit('delete-message', { [`${this.fieldkey}Id`]: this.msg[`${this.fieldkey}Id`], commentId: this.msg.id, userId: this.msg.userId });
      this.isMenuOpen = false;
    },
    toggleUserCard() {
      this.userCardVisible = !this.userCardVisible
    },
    attachFile() {
      this.uploadModal = true
    },
    handleChangeFile(){

    },
    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded

      let formdata = new FormData()
      myfiles.forEach(file => {
        formdata.append('files', file)
      })
      formdata.append([`${this.fieldkey}Id`], this.msg[`${this.fieldkey}Id`])
      formdata.append([`${this.fieldkey}CommentId`], this.msg.id)
      formdata.append('text', `file uploaded to ${this.fieldkey} comment`)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (fi.data.statusCode == 200) {
        _.delay(() => {
          this.getFiles()
          _.delay(() => {
              this.getFiles()
            }, 3500)
        }, 2000);
      }
      this.fileLoader = false
      this.uploadModal = false
    },
    getFiles() {
      let obj1 = { [`${this.fieldkey}CommentId`]: this.msg.id }
      this.$axios.get("file/db/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
      }).then(f => {
        if (f.data.statusCode == 200) {
          this.files = f.data.data
        }
      }).catch(e => {
        console.error(e)
      })
    },
    previewDownload(file){
      this.filePreview = true
      this.selectedFile = file
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
  font-size: $base-size;

  &__owner {
    /*color: $text;*/
    span {
      font-weight: normal;
    }
  }

  &__content {
    /*color: $text;*/
    /*refer global.scss*/
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
      fill: #2ba026;
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

</style>