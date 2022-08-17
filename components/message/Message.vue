<template>
  <div class="msg position-relative" @mouseenter="isActionBarShowing = true" @mouseleave="onActionBarMouseLeave" v-click-outside="onActionBarClickOutside">
    <div class="d-flex">
      <figure class="width-4 flex-shrink-0">
        <bib-avatar size="3rem" :src="userInfo.pic"></bib-avatar>
      </figure>
      <div class="flex-grow-1">
        <div class="msg__owner pb-025">{{userInfo.name}} <span class="ml-1 font-sm">{{displayDate}}</span>
        </div>
        <div class="msg__content pb-05" v-html="msg.comment">
          <p>Lorem ipsum dolor sit amet consectetur 🙂, <a href="https://dev.proj-mgmt.biztree.com/">ipsum</a> adipisicing elit. Sit eum praesentium animi error delectus reprehenderit neque odit? Nesciunt facere quod ab veniam eligendi architecto vitae?</p>
        </div>
        <!-- <message-files :files="files"></message-files> -->
        <!-- <div v-if="reactions.length > 0" class="reactions-section">
          <message-collapsible-section variant="sm">
            <template slot="title"><b>Reactions</b> ({{ this.message.reactions.length }})</template>
            <template slot="content">
              <div class="reactions">
                <div v-for="react in reactions" :key="react.reaction" class="reaction" :class="{ sent: react.sent }" @click.stop="$emit('reaction-clicked', message._id, react.reaction)">
                  {{ react.reaction }} <span class="count">{{ react.entries.length }}</span>
                </div>
              </div>
            </template>
          </message-collapsible-section>
        </div> -->
        <!-- <div v-if="message.repliesCount > 0" class="replies-count">
          {{ message.repliesCount }} replies
        </div> -->
        <div v-show="showPlaceholder" class="placeholder mb-1 d-flex gap-05">
          <div class="left">
            <div class="shape-circle width-205 height-205 animated-background"></div>
          </div>
          <div class="right">
            <div class="animated-background width-4"></div>
            <div class="animated-background width-5 mt-05"></div>
          </div>
        </div>
        <div v-if="replies.length > 0" class="replies-section">
          <message-collapsible-section>
            <template slot="title">Replies ({{ replies.length }})</template>
            <template slot="content">
              <div class="replies">
                <message-reply v-for="reply in replies" :key="reply.id" :reply="reply" />
              </div>
            </template>
          </message-collapsible-section>
        </div>
      </div>
    </div>
    <!-- <transition name="slide-fade"> -->
    <div v-if="isActionBarShowing" class="actions-container" @click.stop>
      <!-- <div class="action favorite" :class="{ favorited }" @click="changeFavorite">
          <bib-icon :icon="favorited ? 'bookmark-solid' : 'bookmark'" :scale="1"></bib-icon>
        </div> -->
      <!-- <div class="action" :class="{ liked }" @click="$emit('reaction-clicked', message._id, '👍')">
          <fa :icon="faThumbsUp" />
        </div> -->
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
          <!-- <div class="menu-item">
            <a @click="markAsUnread">Mark unread</a>
          </div> -->
          <!-- <div class="menu-item">
            <a @click="copyMessageLink">Copy link</a>
          </div> -->
          <!-- <div class="menu-item">
              <a @click="showForwardModal">Share</a>
            </div> -->
          <div v-if="msg.userId == user.Id" class="menu-item">
              <a @click="editMessage">Edit</a>
            </div>
          <div class="menu-item-separator"></div>
          <div v-if="canDeleteMessage" class="menu-item danger">
              <a @click="
                  $emit('delete-message', { msgId: msg.id });
                  isMenuOpen = false;
                ">
                Delete
              </a>
            </div>
        </div>
      </tippy>
    </div>
    <!-- </transition> -->
    <bib-modal-wrapper v-if="replyModal" size="lg" title="Reply to..." @close="replyModal = false">
      <template slot="content">
        <div style="margin: -1rem -2rem -2rem; ">
          <message-input :value="value" @input="onFileInput" @submit="onReplySubmit"></message-input>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
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
      value: {
        files: [
          /*{ id: 156, name: 'thefile.png' },
          { id: 282, name: 'anotherfile.jpg' },*/
        ]
      },
      files: [
        { img: 'https://placeimg.com/200/300/tech' },
        { img: 'https://placeimg.com/200/360/tech' },
        { img: 'https://placehold.jp/2ba026/ffffff/180x180.jpg' },
        { img: 'https://placehold.jp/24/1f42a2/ffffff/250x200.jpg?text=placeholder%20image' }
      ],
      replies: [
        /*{ id: 254, user: { id: "DKgl9av2NwnaG1vz", photo: 'https://i.pravatar.cc/100', firstName: "Vishu", lastName: "M", }, updatedAt: "2022-08-14T06:54:37.000Z", comment: "this is reply text" },*/
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers'
    }),
    userInfo() {
      let u = this.members.find((el) => el.id == this.msg.userId)
      // console.log(u)
      return { name: u.firstName + ' ' + u.lastName, pic: u.avatar }
    },
    displayDate() {
      let d = new Date(this.msg.updatedAt)
      let dd = dayjs(this.msg.updatedAt).format('dddd, D MMM, YYYY @ HH:mm')
      // return d.toDateString()
      return dd
    },
    reactions() {
      return Object.entries(groupBy(this.message.reactions, (r) => r.reaction)).map(
        ([reaction, entries]) => {
          return {
            reaction,
            entries,
            sent: entries.find((e) => e.sender === this.user.id),
          };
        }
      );
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
  fetch() {
    console.log('fetch nuxt lifecycle hook')
    this.fetchReplies()
    /*this.$axios.get('/project/' + this.msg.id + "/replies", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
      })
      .then(rep => {
        // console.log(rep.data)
        this.replies = rep.data.data
        this.showPlaceholder = false
      })
      .catch(e => console.warn(e))*/
  },
  methods: {
    fetchReplies(){
      this.$axios.get('/project/' + this.msg.id + "/replies", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
      })
      .then(rep => {
        // console.log(rep.data)
        this.replies = rep.data.data
        this.showPlaceholder = false
      })
      .catch(e => console.warn(e))
    },
    onFileInput(payload) {
      // console.log(payload)
      this.value.files = payload.files
    },
    onReplySubmit(data) {
      console.log(data)
      this.$axios.post('/project/' + this.msg.id + "/reply", { projectCommentId: this.msg.id, comment: data.text }, {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
      })
      .then(rep => {
        // console.log(rep.data)
        // this.replies.push(rep.data.data)
        this.fetchReplies()
        this.replyModal = false
      })
      .catch(e => console.warn(e))
      
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
      this.$emit('reaction-clicked', this.message._id, data);
    },
    replyMessage() {
      console.log('reply message action')
      this.replyModal = !this.replyModal
    },
    copyMessageLink() {
      navigator?.clipboard?.writeText?.(window.location.origin + this.link);
      this.isMenuOpen = false;
    },
    defer(func) {
      setTimeout(func, 0);
    },
    async changeFavorite() {
      /*if (this.favorited) {
        await this.removeFavorite({ type: 'message', id: this.message._id });
      } else {
        await this.addFavorite({ type: 'message', id: this.message._id });
      }*/
    },
    async markAsUnread() {
      this.isMenuOpen = false;
      // await this.setMessageAsUnread(this.message._id);
      this.$emit('unread-message');
    },
    editMessage() {
      this.$emit('edit-message');
      this.isMenuOpen = false;
    },
  }
}

</script>
<style lang="scss" scoped>
.msg {
  border-top: 1px solid $gray3;
  padding-top: 1rem;
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

  .mention {
    color: #a975ff;
    background-color: rgba(169, 117, 255, .1);
    border-radius: .3rem;
    padding: .1rem .3rem;
    cursor: pointer;
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

.actions-container {
  position: absolute;
  padding: 6px;
  background-color: #dcdcdf;
  border-radius: 8px;
  top: 5px;
  right: 5px;
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
  margin-top: 5px;

  .reactions {
    display: flex;
    gap: 5px;
    padding-top: 10px;
  }

  .reaction {
    font-size: 17px;
    padding: 4px 8px;
    border-radius: 8px;
    background-color: rgb(224, 224, 224);
    cursor: pointer;

    &.sent {
      background-color: rgb(239, 246, 255);
    }

    .count {
      font-size: 13px;
      color: rgb(78, 78, 78);
      vertical-align: middle;
    }
  }
}

.replies-count {
  padding: 8px 10px;
  border-radius: 5px;
  margin-top: 15px;
  background-color: #fff;
  border: 1px solid #acacac;
  cursor: pointer;
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
