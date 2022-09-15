<template>
<client-only>
  <div class="msg position-relative" @mouseenter="isActionBarShowing = true" @mouseleave="onActionBarMouseLeave" v-click-outside="onActionBarClickOutside">
    <figure class="width-4 user-avatar cursor-pointer" :class="{active: userCardVisible}" @click="toggleUserCard">
      <bib-avatar size="3rem" :src="userInfo.pic"></bib-avatar>
    </figure>

    <!-- user info card on click -->
    <div class="user-card bg-white " :class="{active: userCardVisible}">
      <div class="user-info">
        <span class="d-inline-block user-name text-wrap of-hidden text-of-elipsis max-width-13">{{userInfo.name}} </span>
        <span class="d-inline-block user-job text-wrap of-hidden text-of-elipsis max-width-13">{{userInfo.jobTitle}}</span>
      </div>
      <div class="user-btn d-flex justify-between ">
        <button class="bg-gray3 bg-hover-gray4 btn min-width-6 py-05 px-2 cursor-pointer border-gray3 border-hover-gray4">Profile</button>
        <button class="bg-gray3 bg-hover-gray4 btn min-width-6 py-05 px-2 cursor-pointer border-gray3 border-hover-gray4" @click="$nuxt.$emit('remove-member', userInfo)">Remove</button>
      </div>
      <div class="user-contact bg-gray3 p-05  font-sm">
        <p class="mb-05">Contact details</p>
        <div class="d-flex align-center">
          <span class="width-2 flex-shrink-0">
            <bib-icon icon="mail" :scale="1.25" variant="gray5"></bib-icon>
          </span>
          <div class="flex-grow-1 text-gray5 ">Email<br><span class="text-primary d-inline-block of-hidden text-of-elipsis max-width-13">{{userInfo.email}}</span></div>
        </div>
      </div>
    </div>

    <!-- user info -->
    <div class="msg__owner pb-025">{{userInfo.name}} <span class="ml-1 font-sm">{{displayDate}}</span>
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
      <!-- <small>{{files.length}} files</small> -->
      <message-collapsible-section>
        <template slot="title">Files ({{ files.length }})</template>
        <template slot="content">
          <div class="d-flex align-start gap-1 mt-05 mb-075">
            <!-- <bib-file v-for="file in files" :property="property"></bib-file> -->
            <message-file v-for="file in files" :property="file" :key="file.key + tempKey"></message-file>
          </div>
        </template>
      </message-collapsible-section>
    </div>

    <!-- <div v-show="showPlaceholder" class="placeholder mb-1 d-flex gap-05">
      <div class="left">
        <div class="shape-circle width-205 height-205 animated-background"></div>
      </div>
      <div class="right">
        <div class="animated-background width-4"></div>
        <div class="animated-background width-5 mt-05"></div>
      </div>
    </div> -->

    <!-- message replies -->
    <div v-if="repliesExist" class="replies-section pb-05">
      <message-collapsible-section>
        <template slot="title">Replies ({{ msg.replies.length }})</template>
        <template slot="content">
          <div class="replies">
            <message-reply v-for="reply in msg.replies" :key="reply.id" :reply="reply" />
          </div>
        </template>
      </message-collapsible-section>
    </div>

    <!-- message action bar -->
    <div v-if="isActionBarShowing" class="actions-container" @click.stop>
      <!-- <div class="action favorite" :class="{ favorited }" @click="changeFavorite">
        <bib-icon :icon="favorited ? 'bookmark-solid' : 'bookmark'" :scale="1"></bib-icon>
      </div> -->
      <div class="action" @click.stop="onLikeClick">
        <fa :icon="faThumbsUp" />
      </div>
      <tippy :visible="isReactionPickerOpen" :animate-fill="false" :distance="6" interactive placement="bottom-end" trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
        <template slot="trigger">
          <div class="action" :class="{ active: isReactionPickerOpen }" @click="toggleReactionPicker">
            <fa :icon="faSmile" />
          </div>
        </template>
        <div @click.stop>
          <v-emoji-picker @select="onReactionClick" />
        </div>
      </tippy>
      <div class="action" @click="replyMessage">
        <fa :icon="faComment" />
      </div>
      <tippy :visible="isMenuOpen" :animate-fill="false" :distance="6" interactive placement="bottom-end" trigger="manual" :onHide="() => defer(() => (isMenuOpen = false))">
        <template slot="trigger">
          <div class="action" :class="{ active: isMenuOpen }" @click="toggleMenu">
            <fa :icon="faEllipsisH" />
          </div>
        </template>
        <div class="menu" :class="{ open: isMenuOpen }">
          <div class="menu-item">
            <a @click="replyMessage">Reply</a>
          </div>
          <!-- <div class="menu-item">
            <a @click="markAsUnread">Mark unread</a>
          </div> -->
          <!-- <div class="menu-item">
            <a @click="copyMessageLink">Copy link</a>
          </div> -->
          <div v-if="msg.userId == user.Id" class="menu-item">
            <a @click="editMessage">Edit</a>
          </div>
          <div v-if="msg.userId == user.Id" class="menu-item">
            <a @click="attachFile">Attach file</a>
          </div>
          <div class="menu-item-separator"></div>
          <div v-if="canDeleteMessage" class="menu-item danger">
            <a @click="deleteMessage">Delete</a>
          </div>
        </div>
      </tippy>
    </div>

    <!-- submit reply modal -->
    <bib-modal-wrapper v-if="replyModal" size="lg" title="Reply to..." @close="replyModal = false">
      <template slot="content">
        <div style="margin: -1rem -2rem -2rem; ">
          <message-input :value="value" @input="onFileInput" @submit="onReplySubmit"></message-input>
        </div>
        <loading :loading="replyLoading"></loading>
      </template>
    </bib-modal-wrapper>

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
  </div>
</client-only>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from 'vue-tippy';
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
export default {

  name: 'Message',
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
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      files: [
        // { name: "File Name", type: "image/png", size: "2340", preview: 'https://placeimg.com/200/300/tech' },
        /*{ name: "ImageFile Name", type: "image/png", size: "2340", preview: 'https://placeimg.com/200/360/tech' },
        { name: "ImageFile Name", type: "image/png", size: "2340", preview: 'https://placehold.jp/2ba026/ffffff/180x180.jpg' },
        { name: "ImageFile Name", type: "image/png", size: "2340", preview: 'https://placehold.jp/24/1f42a2/ffffff/250x200.jpg?text=placeholder%20image' }*/
      ],
      replies: [
        /*{ id: 254, user: { id: "DKgl9av2NwnaG1vz", photo: 'https://i.pravatar.cc/100', firstName: "Vishu", lastName: "M", }, updatedAt: "2022-08-14T06:54:37.000Z", comment: "this is reply text" },*/
      ],
      replyLoading: false,
      reactions: [],
      reactionKey: 1,
      reactionSpinner: false,
      tempKey: 1,
      uploadModal: false,
      fileLoader: false,
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers'
    }),
    userInfo() {
      if (this.members.length) {
        let u = this.members.find((el) => el.id == this.msg.userId)
        // console.log(u)
        return { id: u.id, name: u.firstName + ' ' + u.lastName, email: u.email, pic: u.avatar, jobTitle: "Title/Company Name" }
      }
    },
    displayDate() {
      let d = new Date(this.msg.updatedAt)
      let dd = dayjs(this.msg.updatedAt).format('dddd, D MMM, YYYY @ HH:mm')
      // return d.toDateString()
      return dd
    },
    /*reactions() {
      return Object.entries(groupBy(this.message.reactions, (r) => r.reaction)).map(
        ([reaction, entries]) => {
          return {
            reaction,
            entries,
            sent: entries.find((e) => e.sender === this.user.id),
          };
        }
      );
    },*/
    repliesExist() {
      return this.msg.replies?.length ? true : false
    },
    reactionsExist() {
      if (this.msg.reactions?.length || this.reactionGroup.length) {
        return true
      } else {
        return false
      }
      // return this.msg.reactions?.length ? true : false
    },
    reactionGroup() {
      let rg = []
      if (this.reactions.length) {
        this.reactions.map(r => {
          let rindex = rg.findIndex((el) => el.reaction == r.reaction)
          let relem = rg.find((el, index) => el.reaction == r.reaction)
          // console.log(relem, rindex)
          if (relem == undefined) {
            rg.push({ reaction: r.reaction, count: 1, data: [{ id: r.id, user: r.user }] })
          } else {
            rg[rindex].count += 1
            rg[rindex].data.push({ id: r.id, user: r.user })
          }
        })
      }
      // console.log(rg)
      this.reactionKey += 1
      return rg
    },
    /*liked() {
      return this.reactions.find((r) => r.sent && r.reaction === '👍');
    },
    reactionItems() {
      return ['😂', '😍', '😬', '😒', '😐', '😣', '😏', '🙏', '🎉', '🎯'].map((reaction) => ({
        reaction,
        selected: this.reactions.find((r) => r.reaction === reaction)?.sent??false,
      }));
    },
    favorited() {
      return this.favorites.some((fav) => fav.ref === this.message._id);
    },
    link() {
      const chat = this.chats[this.message.chat];
      return chat.type === 'direct' ?
        `/directs/${chat.user.id}/messages/${this.message._id}` :
        `/channels/${chat.id}/messages/${this.message._id}`;
    },*/
    canDeleteMessage() {
      if (this.msg.userId == this.user.Id) {
        return true;
      }
      return false
      /*const chat = this.chats[this.msg.chat];
      return (
        chat?.type === 'group' &&
        chat.members.some(
          ({ access, user }) =>
          (access === 'admin' || access === 'moderator') && user.id === this.user.id
        )
      );*/
    },

  },
  mounted() {
    // this.reactions = []
    // console.info(this.msg.id, " msg reactions =>", this.msg.reactions, 'local reactions =>', this.reactions);
    // this.reactions = this.msg.reactions
    this.reactions = _.cloneDeep(this.msg.reactions);
    this.getFiles()
    /*this.$axios.get('/project/' + this.msg.id + "/reactions", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
      })
      .then(r => {
        this.reactions = r
      })
      .catch(e => console.log(e))*/
  },
  /*updated(){
    console.log('updated', this.msg.reactions)
  },*/

  methods: {
    /*fetchReplies() {
      this.$axios.get('/project/' + this.msg.id + "/replies", {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
        })
        .then(rep => {
          // console.log(rep.data)
          this.replies = rep.data.data
          this.showPlaceholder = false
        })
        .catch(e => console.warn(e))
    },*/
    fetchReactions() {
      this.$axios.get('/project/' + this.msg.id + "/reactions", {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
        })
        .then(r => {
          // console.log(r)
          if (r.data.statusCode == 200) {
            this.reactions = r.data.data
            this.reactionKey += 1
          }
        })
        .catch(e => console.log(e))
    },
    ownReaction(reaction) {
      // console.log(reaction, this.user.Id)
      return { sent: reaction.data.some(d => d.user.id == this.user.Id) }
    },
    deleteOwnReaction(reaction) {
      this.reactionSpinner = true
      let react = reaction.data.find(d => d.user.id == this.user.Id)
      this.$axios.delete("/project/" + this.msg.id + "/reaction", {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") },
          data: { reactionId: react.id },
        })
        .then(d => {
          // console.log(d.data)
          this.fetchReactions()
          this.reactionSpinner = false
        })
        .catch(e => console.log(e))
    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onReplySubmit(data) {
      // console.log(data)
      this.replyLoading = true
      this.$axios.post('/project/' + this.msg.id + "/reply", { projectCommentId: this.msg.id, comment: data.text }, {
          headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
        })
        .then(rep => {
          // console.log(rep.data)
          this.replyLoading = false
          // this.fetchReplies()
          this.$nuxt.$emit("refresh-list")
          this.replyModal = false
        })
        .catch(e => {
          this.replyLoading = false
          console.warn(e)
        })
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
      // console.warn(duplicateReaction)
      // this.$emit('reaction-clicked', this.msg.id, data);
      if (duplicateReaction) {
        alert("Reaction already exists!")
        this.reactionSpinner = false
      } else {
        this.$axios.post("/project/" + this.msg.id + "/reaction", { reaction: data }, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
          })
          .then(d => {
            // console.log(d.data)
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
        alert("Reaction already exists!")
        this.reactionSpinner = false
      } else {
        this.$axios.post("/project/" + this.msg.id + "/reaction", { reaction: "👍" }, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
          })
          .then(d => {
            // console.log(d.data)
            if (d.data.statusCode == 200) {
              // this.reactions.push(d.data.data)
              this.fetchReactions()
              this.reactionSpinner = false
            }
          })
          .catch(e => console.log(e))
      }
    },
    replyMessage() {
      console.log('reply message action')
      this.replyModal = !this.replyModal
    },
    /*copyMessageLink() {
      navigator?.clipboard?.writeText?.(window.location.origin + this.link);
      this.isMenuOpen = false;
    },*/
    defer(func) {
      setTimeout(func, 0);
    },
    /*async changeFavorite() {
      console.log('favorite clicked')
      if (this.favorited) {
        await this.removeFavorite({ type: 'message', id: this.message._id });
      } else {
        await this.addFavorite({ type: 'message', id: this.message._id });
      }
    },*/
    /*async markAsUnread() {
      this.isMenuOpen = false;
      // await this.setMessageAsUnread(this.message._id);
      this.$emit('unread-message');
    },*/
    editMessage() {
      this.$nuxt.$emit('edit-message', this.msg);
      this.isMenuOpen = false;
    },
    deleteMessage() {
      console.log(this.msg)
      this.$emit('delete-message', { 
        taskId: this.msg.taskId ? this.msg.taskId : null, 
        projectId: this.msg.projectId ? this.msg.projectId: null, 
        commentId: this.msg.id 
      });
      this.isMenuOpen = false;
    },
    toggleUserCard() {
      this.userCardVisible = !this.userCardVisible
    },
    attachFile() {
      this.uploadModal = true
      // this.$emit("upload-file", this.msg)
    },
    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded

      let formdata = new FormData()
      myfiles.forEach(file => {
        formdata.append('files', file)
      })
      // formdata.append('projectId', this.project.id)
      formdata.append('projCommentId', this.msg.id)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      // console.log(fi.data)
      if (fi.data.statusCode == 200) {
        // console.log(fi.data)
        _.delay(() => {
          console.log('delay->', fi.data);
          this.getFiles()
        }, 2000);
      }
      this.fileLoader = false
      this.uploadModal = false
    },
    getFiles() {
      // this.loading = true
      let obj1 = { projectCommentId: this.msg.id }
      this.$axios.get("file/db/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
      }).then(f => {
        // console.log(f.data)
        if (f.data.statusCode == 200) {
          // this.loading = false
          this.files = f.data.data
          this.tempKey += 1
        }
      }).catch(e => {
        console.error(e)
        // this.loading = false
      })
    },
  }
}

</script>
<style lang="scss" scoped>
.msg {
  border-top: 1px solid $gray3;
  padding-top: 1rem;
  padding-left: 5rem;
  font-size: $font-size-lg;

  &__owner {
    color: $text;
    font-size: 1rem;
    font-weight: 500;

    span {
      font-size: $font-size-xs;
      color: $gray5;
      font-weight: normal;
    }
  }

  &__content {
    font-size: 1rem;
    color: $gray6;
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

/*@keyframes open {
  from { width: 0; min-width:0; height: 0; min-height: 0; }
  to { width: 18rem; min-width:18rem; height: auto; min-height: 10rem; }
}
@keyframes paddingAnimate {
  from { padding: 0; }
  to { padding: 0.75rem; }
}*/

.user-avatar {
  position: absolute;
  z-index: 2;
  left: 1rem;
  top: 1rem;

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
  /*animation-name: open, paddingAnimate;
  animation-duration: 400ms, 100ms;
  animation-timing-function: linear, linear;
  animation-direction: reverse, reverse;
  animation-fill-mode: forwards, forwards;*/
  /*animation: open 400ms reverse forwards, paddingAnimate 100ms reverse forwards;*/
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

    /*animation: open 400ms linear normal forwards, paddingAnimate 100ms normal linear forwards;*/
    /*animation-name: open, paddingAnimate;
    animation-direction: normal, normal;*/
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

</style>
