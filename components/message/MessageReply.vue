<template>
  <div class="reply">
    <bib-avatar size="2.1875rem" ></bib-avatar>

    <div class="content">
      <div class="info">
        <span class="name"> {{ reply.user.firstName }} {{ reply.user.lastName }} </span>
        <span class="time">{{displayDate}}</span>
      </div>

      <div class="reply-text" v-html="reply.comment">Your reply</div>

      <!-- <message-text
        :text="reply.text"
        @mention-click="openUserChat"
        @channel-mention-click="openChannel"
      /> -->

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

      <!-- <div v-if="reply.voices && reply.voices.length" class="voices">
        <div v-for="voice in reply.voices" :key="voice" class="voice">
          <audio controls>
            <source :src="backendUrl(`files/serve/${voice}`)" />
          </audio>
        </div>
      </div> -->

      <!-- <div v-if="reply.videos && reply.videos.length" class="videos">
        <div v-for="video in reply.videos" :key="video" class="video">
          <video controls @click.stop>
            <source :src="backendUrl(`files/serve/${video}`)" />
          </video>
        </div>
      </div> -->

      <!-- <div v-if="reply.images && reply.images.length" class="images">
        <div v-for="image in reply.images" :key="image" class="image">
          <div class="image-overlay" @click="showImageModal(image)">
            <bib-icon icon="search" :scale="1.5" color="white" />
          </div>
          <img :src="backendUrl(`files/serve/${image}`)" />
        </div>
      </div> -->

      <!-- <div v-if="reactions.length > 0" class="reactions-section">
        <message-collapsible-section variant="sm">
          <template slot="title"> <b>Reactions</b> ({{ this.reply.reactions.length }}) </template>
          <template slot="content">
            <div class="reactions">
              <div
                v-for="react in reactions"
                :key="react.reaction"
                class="reaction"
                :class="{ sent: react.sent }"
                @click.stop="() => onReactionClick(react.reaction)"
              >
                {{ react.reaction }} <span class="count">{{ react.entries.length }}</span>
              </div>
            </div>
          </template>
        </message-collapsible-section>
      </div> -->
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import { groupBy } from 'lodash';
// import { mapState } from 'vuex';
// import { getAvatarPlaceholder } from '~/utils/avatar';
// import { makeDateString, makeTimeString } from '~/utils/date';
// import { backendUrl } from '~/utils/url';

export default {
  props: {
    reply: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // isFileOverlayOpen: Object.fromEntries(this.reply.files.map((file) => [file._id, false])),
    };
  },
  computed: {
    // ...mapState(['imagePreviewModal']),
    displayDate() {
      let d = new Date(this.reply.updatedAt)
      let dd = dayjs(this.reply.updatedAt).format('dddd, D MMM, YYYY @ HH:mm')
      // return d.toDateString()
      return dd
    },
  },
  methods: {
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
.reply-text { color: $gray6;
  a { color: $primary; text-decoration: underline; }
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
