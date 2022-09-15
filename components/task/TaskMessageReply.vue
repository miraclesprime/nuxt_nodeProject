<template>
<client-only>
  <div class="reply position-relative" @mouseenter.stop="isActionBarShowing = true" @mouseleave="onActionBarMouseLeave">
    <figure class=" flex-shrink-0 flex-grow-0">
      <bib-avatar size="2.175rem" :src="$userInfo(reply.userId).Photo"></bib-avatar>
    </figure>
    <div class="content">
      <div class="info">
        <span class="name"> {{ $userInfo(reply.userId).FirstName }} {{ $userInfo(reply.userId).LastName }} </span>
        <span class="time">{{displayDate}}</span>
      </div>
      <div class="reply-text" v-html="reply.comment">Your reply</div>
      <!-- <message-text
        :text="reply.text"
        @mention-click="openUserChat"
        @channel-mention-click="openChannel"
      /> -->
      <div v-if="reactionsExist" class="reactions-section">
        <div class="reactions">
          <div v-for="react in reactionGroup" :key="reactionKey + react.reaction + reply.id" class="reaction " :class=" ownReaction(react) " @click.stop="deleteOwnReaction(react)">
            {{ react.reaction }} <span class="count">{{react.count}}</span>
          </div>
          <bib-spinner v-if="reactionSpinner" :scale="2" variant="primary"></bib-spinner>
        </div>
      </div>
      <!-- <div v-if="reply.files.length" class="files-section">
        <message-collapsible-section>
          <template slot="title"><b>Files</b> ({{ reply.files.length }})</template>
          <template slot="content">
            <div class="files">
              <div
                v-for="file in reply.files"
                :class="{ file, 'image-file': isImg(file), 'non-image-file': !isImg(file) }"
                :key="file._id"
                @mouseenter="isFileOverlayOpen[file._id] = true"
                @mouseleave="closeFileOverlay(file._id)"
              >
                <div class="file-container">
                  <img v-if="isImg(file)" :src="backendUrl(`files/serve/${file.key}`)" />
                  <div v-else class="file-thumbnail">
                    <fa :icon="faFile" />
                  </div>

                  <transition name="fade">
                    <div
                      v-if="isFileOverlayOpen[file._id]"
                      class="file-overlay"
                      @click="isImg(file) ? openFilePreview(file) : downloadFilePreview(file)"
                    >
                      <div class="file-overlay-action">
                        <bib-icon
                          :icon="isImg(file) ? 'search' : 'download'"
                          :scale="1.5"
                          color="white"
                        />
                      </div>

                      <tippy
                        :animate-fill="false"
                        :distance="6"
                        interactive
                        trigger="click"
                        placement="bottom-start"
                        class="tippy"
                        ref="menus"
                        :onHide="() => (isFileOverlayOpen[file._id] = false)"
                      >
                        <template slot="trigger">
                          <div class="action">
                            <fa :icon="faEllipsisH" />
                          </div>
                        </template>

                        <div class="menu">
                          <div class="menu-item file-name">
                            {{ file.name }} ({{ filesize(file.size) }})
                          </div>
                          <div v-if="isImg(file)" class="menu-item">
                            <a @click="openFile(file)"><bib-icon icon="upload" /> Open</a>
                          </div>
                          <div class="menu-item">
                            <a @click="selectFile(file)"><bib-icon icon="urgent" /> Details</a>
                          </div>
                          <div class="menu-item">
                            <a @click="downloadFile(file)">
                              <bib-icon icon="download" /> Download file
                            </a>
                          </div>
                          <div class="menu-item">
                            <a @click="copyFile(file)"><bib-icon icon="copy-file" /> Copy</a>
                          </div>
                          <div class="menu-item-separator" />
                          <div class="menu-item danger">
                            <a @click="deleteFile(file)">Delete file</a>
                          </div>
                        </div>
                      </tippy>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </template>
        </message-collapsible-section>
      </div> -->
      <!-- <div v-if="reply.images && reply.images.length" class="images">
        <div v-for="image in reply.images" :key="image" class="image">
          <div class="image-overlay" @click="showImageModal(image)">
            <bib-icon icon="search" :scale="1.5" color="white" />
          </div>
          <img :src="backendUrl(`files/serve/${image}`)" />
        </div>
      </div> -->
      
    </div>
    <div v-if="isActionBarShowing" class="actions-container" @click.stop>
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
      <div v-if="reply.userId == user.Id" class="action" @click="editReply">
        <fa :icon="faPenToSquare"></fa>
      </div>
      <div v-if="canDeleteReply" class="action " @click="deleteReply">
        <fa :icon="faTrash"></fa>
      </div>
    </div>
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
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faComment, faStar } from '@fortawesome/free-regular-svg-icons';
// import { groupBy } from 'lodash';
// import { mapState } from 'vuex';
// import { getAvatarPlaceholder } from '~/utils/avatar';
// import { makeDateString, makeTimeString } from '~/utils/date';
// import { backendUrl } from '~/utils/url';

export default {
  components: {
    fa: FontAwesomeIcon,
    tippy: TippyComponent,
    VEmojiPicker,
  },
  props: {
    reply: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      faFile,
      faThumbsUp,
      faSmile,
      faComment,
      faShare,
      faEllipsisH,
      faStar,
      fasStar,
      faPenToSquare,
      faTrash,
      replyLoading: false,
      reactions: [],
      reactionKey: 1,
      reactionSpinner: false,
      // isFileOverlayOpen: Object.fromEntries(this.reply.files.map((file) => [file._id, false])),
      isActionBarShowing: false,
      isReactionPickerOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers'
    }),
    userInfo() {
      if (this.members.length) {
        let u = this.members.find((el) => el.id == this.reply.userId)
        // console.log(u)
        return { id: u.id, name: u.firstName + ' ' + u.lastName, email: u.email, pic: u.avatar, jobTitle: "Title/Company Name" }
      }
    },
    displayDate() {
      let d = new Date(this.reply.updatedAt)
      let dd = dayjs(this.reply.updatedAt).format('dddd, D MMM, YYYY @ HH:mm')
      // return d.toDateString()
      return dd
    },
    reactionsExist() {
      if (this.reply.reactions?.length || this.reactionGroup.length) {
        return true
      } else {
        return false
      }
      // return this.reply.reactions?.length ? true : false
    },
    reactionGroup() {
      let rg = []
      // console.log("reply reactions=> ", this.reply.reactions)
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
    canDeleteReply() {
      if (this.reply.userId == this.user.Id) {
        return true;
      }
      return false
    },
  },
  fetch(){
    // console.info("fetch");
    this.reactions = _.cloneDeep(this.reply.reactions);
    // this.fetchReactions()
  },
  mounted(){
    // console.info("mounted");
    // console.log(this.$fetchState)
  },
  methods: {
    defer(func) {
      setTimeout(func, 10);
    },
    onActionBarMouseLeave() {
      if (!this.isReactionPickerOpen) {
        this.isActionBarShowing = false;
        // this.isMenuOpen = false;
        this.isReactionPickerOpen = false;
      }
    },
    fetchReactions() {
      this.$axios.get('/task/replies/' + this.reply.id + "/reactions", {
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
    toggleReactionPicker() {
      this.isReactionPickerOpen = !this.isReactionPickerOpen;
      // this.isMenuOpen = false;
    },
    deleteOwnReaction(reaction) {
      this.reactionSpinner = true
      let react = reaction.data.find(d => d.user.id == this.user.Id)
      this.$axios.delete("/task/replies/" + this.reply.id + "/reaction", {
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
    onReactionClick({ data }) {
      // console.log(data)
      this.isReactionPickerOpen = false;
      this.reactionSpinner = true
      let duplicateReaction = this.reactions.some(r => r.userId == this.user.Id && r.reaction == data)
      // console.warn(duplicateReaction)
      // this.$emit('reaction-clicked', this.reply.id, data);
      if (duplicateReaction) {
        alert("Reaction already exists!")
        this.reactionSpinner = false
      } else {
        this.$axios.post("/task/replies/" + this.reply.id + "/reaction", { reaction: data }, {
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
        this.$axios.post("/task/replies/" + this.reply.id + "/reaction", { reaction: "👍" }, {
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
    editReply() {
      this.$nuxt.$emit('edit-reply', this.reply);
      // this.isMenuOpen = false;
    },
    deleteReply() {
      this.$emit('delete-reply', { taskId: this.reply.taskId, commentId: this.reply.id });
      // this.isMenuOpen = false;
    },
    // getAvatarPlaceholder,
    // makeDateString,
    // makeTimeString,
    // backendUrl,
    /*openUserChat(userId) {
      this.$router.push(`/directs/${userId}`);
    },
    openChannel(id) {
      this.$router.push(`/channels/${id}`);
    },*/
    /*showImageModal(key) {
      this.imagePreviewModal.setSrc(backendUrl(`files/serve/${key}`));
      this.imagePreviewModal.show();
    },*/
    /*openFilePreview(file) {
      if (!this.$refs.menus[0]?.tip?.state?.isVisible) {
        this.showImageModal(file.key);
        this.isFileOverlayOpen[file._id] = false;
      }
    },*/
    /*downloadFilePreview(file) {
      if (!this.$refs.menus[0]?.tip?.state?.isVisible) {
        downloadFile(file);
        this.isFileOverlayOpen[file._id] = false;
      }
    },*/
  },
};

</script>
<style lang="scss" scoped>
.reply {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(29, 29, 32, 0.12);
  gap: 10px;
  /*&:hover {
    .actions-container {
      top: 10px;
      opacity: 1;
    }
  }*/
}

.name {
  font-size: 0.9rem;
  font-weight: 500;
  color: $text;
}

.time {
  font-size: 0.8rem;
  color: $gray5;
  margin-left: 10px;
}

.content {
  font-size: 0.85rem;
  line-height: 1.5;
  color: $gray6;
}

.reply-text {
  color: $gray6;

  a {
    color: $primary;
    text-decoration: underline;
  }
}
.actions-container {
  position: absolute;
  padding: 6px;
  background-color: #dcdcdf;
  border-radius: 8px;
  top: 10px;
  right: 5px;
  gap: 5px;
  display: flex;
  /*opacity: 0;*/
  transition: all 200ms ease;
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

.reactions-section {
  margin-top: 5px;

  .reactions {
    display: flex;
    gap: 5px;
    padding-top: 10px;
  }

  .reaction {
    font-size: 16px;
    padding: 2px 4px;
    border-radius: 8px;
    border: 1px solid $gray4;
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

.replies-section {
  margin-top: 15px;
}

.files-section {
  margin-top: 15px;

  .files {
    display: flex;
    padding: 10px 0;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px;
  }

  .file-container {
    line-height: 0;
  }

  .file {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    max-height: none;
    width: auto;
    max-width: 20%;
    min-width: 100px;
    min-height: 100px;
    border-radius: 0;

    .file-thumbnail svg {
      height: 45px;
    }

    &.non-image-file {
      border: 1px solid rgb(224, 224, 224);
      border-radius: 5px;

      .file-overlay {
        border-radius: 5px;
      }

      &:hover {
        border: 1px solid rgb(224, 224, 224);
      }
    }

    &:hover {
      border: 0;
      outline: none;
    }

    img {
      width: 100%;
    }

    .file-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.35);
    }

    .tippy {
      position: absolute;
      right: 5px;
      top: 5px;
      color: white;
    }

    .file-overlay-action {
      position: absolute;
      top: calc(50% - 12px);
      left: calc(50% - 12px);
      color: #b1b1b4;
      line-height: 0;
    }

    .action {
      width: 28px;
      height: 28px;
      background-color: #f2f2f5;
      color: #b1b1b4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.images {
  position: relative;
  display: flex;
  padding: 10px 0;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;

  .image {
    display: block;
    position: relative;
    max-height: none;
    border-radius: 0;
    width: auto;
    line-height: 0;
    max-width: 20%;
    cursor: pointer;

    img {
      width: 100%;
    }

    .image-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.35);
      opacity: 0;
      cursor: pointer;
      transition: all 0.02s ease;
    }

    &:hover {
      .image-overlay {
        opacity: 1;
      }
    }
  }
}

</style>
