<template>
  <client-only>
  <div v-if="editor" class="wrapper">
    <div class="container">
      <div class="toolbar-top">
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
          <fa :icon="faBold"></fa>
        </div>
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
          <fa :icon="faItalic"></fa>
        </div>
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()">
          <fa :icon="faUnderline"></fa>
        </div>
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
          <fa :icon="faStrikethrough"></fa>
        </div>
        <div class="toolbar-separator"></div>
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('link') }" @click="toggleLink">
          <fa :icon="faLink"></fa>
        </div>
        <div class="toolbar-separator"></div>
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
          <fa :icon="faListUl"></fa>
        </div>
        <div class="toolbar-icon" :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
          <fa :icon="faListOl"></fa>
        </div>
        <div class="toolbar-separator"></div>
        <mention-popup @select="mentionUser"></mention-popup>
      </div>
      <div class="editor-container">
        <div class="editor-wrapper">
          <div v-if="value.files.length > 0" class="files">
            <div v-for="(file, idx) in value.files" :key="idx" class="file">
              <div class="file-thumbnail">
                <fa :icon="faFile"></fa>
              </div>
              <div class="file-info">
                <div class="file-name">
                  {{ snipFileName(file.name) }}
                </div>
              </div>
              <button type="button" class="file-close" @click="() => removeAttachment(file.id)">
                <fa :icon="faTimes"></fa>
              </button>
            </div>
          </div>
          <!-- <div v-if="value.voices.length" class="voices">
            <div v-for="(voice, idx) in value.voices" :key="idx" class="voice">
              <div class="voice-thumbnail">
                <fa :icon="faMicrophone" ></fa>
              </div>

              <div class="voice-bars">
                <div
                  v-for="(bar, idx) in voice.volumes"
                  class="bar"
                  :key="idx"
                  :style="`height: ${bar + 5}%`"
                />
              </div>

              <button type="button" class="file-close" @click="() => removeVoice(idx)">
                <fa :icon="faTimes"></fa>
              </button>
            </div>
          </div>
        
      </div> -->
          <!-- <div v-if="value.videos.length" class="videos">
            <div v-for="(video, idx) in value.videos" :key="idx" class="video">
              <div class="video-thumbnail">
                <fa :icon="faVideo" />
              </div>

              <button type="button" class="file-close" @click="() => removeVideo(idx)">
                <fa :icon="faTimes"></fa>
              </button>
            </div>
          </div> -->
          <!-- <div v-if="value.images.length" class="images">
            <div v-for="(image, idx) in value.images" :key="idx" class="image">
              <img :src="image.url" />

              <button type="button" class="file-close" @click="() => removeImage(idx)">
                <fa :icon="faTimes"></fa>
              </button>
            </div>
          </div> -->
          <editor-content :editor="editor" class="editor" />
        </div>
      </div>
      <div class="toolbar-bottom d-flex justify-between">
        <div class="d-flex">
          <div class="toolbar-icon" @click="onAttachmentClick">
            <fa :icon="faPaperclip"></fa>
            <input ref="file" multiple type="file" class="attachment-input" @change="onFilesSelect" />
          </div>
          <tippy trigger="click" interactive :animate-fill="false" :distance="60" placement="top-start">
            <div slot="trigger" class="toolbar-icon">
              <fa :icon="faGrin"></fa>
            </div>
            <v-emoji-picker @select="selectEmoji"></v-emoji-picker>
          </tippy>
          <!-- <audio-recorder @record="addVoice" />
          <video-recorder @record="addVideo" />
          <image-capturer @capture="addImage" /> -->
        </div>
        <button class="send-btn" type="button" @click="sendMessage">
          <fa :icon="faPaperPlane"></fa>
        </button>
      </div>
    </div>
    <div class="hint"><b>Shift + Enter</b> to send</div>
    <bib-modal-wrapper v-if="isLinkModalShown" title="Link URL" @close="isLinkModalShown = false">
      <template slot="content">
        <bib-input label="URL" v-model="linkUrl" />
        <div class="d-flex">
          <bib-button label="Cancel" variant="light" pill @click="closeAndResetLinkModal" ></bib-button>
          <bib-button label="Set Link" variant="success" class="ml-auto" pill @click="setLink" ></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
  </client-only>
</template>
<script>
import { Editor, EditorContent, Extension, VueRenderer } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Mention } from '@tiptap/extension-mention';
import Link from '@tiptap/extension-link'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faGrin,
  faPaperPlane,
  faPaperclip,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListUl,
  faListOl,
  faLink,
  faCode,
  faCodeBranch,
  faFile,
  faTimes,
  faAddressCard,
  faMicrophone,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidV4 } from 'uuid';
import { mapGetters } from 'vuex';
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from 'vue-tippy';
import { VEmojiPicker } from 'v-emoji-picker';
import { snipFileName } from '~/utils/file';
// import { ChannelPlugin } from '~/plugins/editor-channel';
// import { ChatLink } from '~/plugins/editor-link';

import MentionList from '~/components/message-mention/MessageMentionList.vue';

export default {
  name: "MessageInput",
  components: {
    EditorContent,
    fa: FontAwesomeIcon,
    VEmojiPicker,
    tippy: TippyComponent
  },

  props: {
    value: Object,
    editingMessage: Object,
    placeholder: {
      type: String,
      default: 'Type a message...',
    },
  },

  computed: {
    // ...mapGetters(['contacts', 'groupChats', 'getChannelById']),
    ...mapGetters({
      contacts: "user/getTeamMembers"
    }),
  },

  data() {
    return {
      editor: null,
      showingPicker: false,
      isLinkModalShown: false,
      linkUrl: '',

      // fontawesome
      faPaperclip,
      faPaperPlane,
      faGrin,
      faBold,
      faItalic,
      faUnderline,
      faStrikethrough,
      faListUl,
      faListOl,
      faLink,
      faCode,
      faCodeBranch,
      faFile,
      faTimes,
      faAddressCard,
      faMicrophone,
      faVideo,
    };
  },

  mounted() {
    if (process.client) {

    this.editor = new Editor({
      content: '',
      extensions: [
        StarterKit,

        /*ChatLink.configure({
          onEdit: (link) => {
            this.linkUrl = link.href;
            this.isLinkModalShown = true;
          },
          onRemove: () => this.editor.chain().focus().unsetLink().run(),
        }),*/
        Link.configure({
          openOnClick: false,
        }),
        Underline,
        Placeholder.configure({ placeholder: this.placeholder }),
        Extension.create({
          name: 'SendShortcut',
          addKeyboardShortcuts: () => ({
            'Shift-Enter': () => {
              this.sendMessage();

              // prevent default
              return true;
            },
          }),
        }),
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderLabel: ({ node }) => {
            // console.log(node)
            // const user = this.contacts[node.attrs.id];
            const user = this.contacts.find(c => c.id == node.attrs.id)
            return `@${user.firstName} ${user.lastName}`;
          },
          suggestion: {
            items: ({ query }) => {
              if (query === '') {
                return Object.values(this.contacts).slice(0, 10);
              }

              const regex = new RegExp(query, 'i');
              return Object.values(this.contacts)
                .filter(({ firstName, lastName }) => regex.test(firstName) || regex.test(lastName))
                .slice(0, 10);
            },
            render: () => {
              let component;
              let popup;

              return {
                onStart: (props) => {
                  component = new VueRenderer(MentionList, {
                    parent: this,
                    propsData: props,
                    editor: props.editor,
                  });

                  popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  });
                },
                onUpdate(props) {
                  component.updateProps(props);

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });
                },
                onKeyDown(props) {
                  if (props.event.key === 'Escape') {
                    popup[0].hide();

                    return true;
                  }

                  return component.ref?.onKeyDown(props);
                },
                onExit() {
                  popup[0].destroy();
                  component.destroy();
                },
              };
            },
          },
        }),
      ],
    });
    }
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    sendMessage() {
      if (this.editor.isEmpty && [...Object.values(this.value)].flat().length === 0) {
        return;
      }

      this.$emit('submit', { text: this.editor.getHTML(), ...this.value });
      this.editor.commands.setContent('');
    },
    onAttachmentClick() {
      this.$refs.file.click();
    },
    removeAttachment(id) {
      this.$emit('input', { ...this.value, files: this.value.files.filter((f) => f.id !== id) });
    },
    onFilesSelect(evt) {
      if (!evt.target.files?.length) {
        return;
      }

      const newFiles = [...evt.target.files];
      newFiles.forEach((file) => (file.id = uuidV4()));
      this.$emit('input', { ...this.value, files: [...this.value.files, ...newFiles] });
    },
    selectEmoji(emoji) {
      const transaction = this.editor.state.tr.insertText(emoji.data);
      this.editor.view.dispatch(transaction);
    },
    reset() {
      this.editor.commands.setContent('');
    },
    getMessage() {
      return !this.editor.isEmpty ? this.editor.getHTML() : null;
    },
    setMessage(message) {
      this.editor.commands.setContent(message);
    },
    toggleLink() {
      if (this.editor.isActive('link')) {
        // unset link
        this.editor.chain().focus().unsetLink().run();
      } else {
        // show link modal
        // this.isLinkModalShown = true;
        this.setLink()
      }
    },
    /*setLink() {
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: this.linkUrl }).run();
      this.closeAndResetLinkModal();
    },*/
    closeAndResetLinkModal() {
      this.isLinkModalShown = false;
      this.linkUrl = '';
    },

    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    },

    addVoice(voice) {
      this.$emit('input', { ...this.value, voices: [...this.value.voices, voice] });
    },
    removeVoice(idx) {
      this.$emit('input', {
        ...this.value,
        voices: this.value.voices.filter((_, i) => i !== idx),
      });
    },
    addVideo(video) {
      this.$emit('input', { ...this.value, videos: [...this.value.videos, video] });
    },
    removeVideo(idx) {
      this.$emit('input', {
        ...this.value,
        videos: this.value.videos.filter((_, i) => i !== idx),
      });
    },
    addImage(img) {
      this.$emit('input', { ...this.value, images: [...this.value.images, img] });
    },
    removeImage(idx) {
      this.$emit('input', {
        ...this.value,
        images: this.value.images.filter((_, i) => i !== idx),
      });
    },
    mentionUser(user) {
      // console.log(user)
      const anchorPos = this.editor.state.selection.anchor;
      this.editor
        .chain()
        .focus()
        .insertContentAt({ from: anchorPos, to: anchorPos }, [{
            type: 'mention',
            attrs: { id: user.id },
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run();
    },
    snipFileName,
  },

  watch: {
    editingMessage(value) {
      if (value) {
        this.editor.commands.setContent(value.comment);
      } else {
        this.editor.commands.setContent('');
      }
    },
  },
};

</script>
<style lang="scss" scoped>
.wrapper {
  padding: 0 15px 5px 15px;
}

.container {
  width: auto;
  border: 2px solid #bdbdc4;
  border-radius: 5px;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.hint {
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-align: right;
}

.editor-container {
  display: flex;
  flex-grow: 1;
  align-items: center;
  padding: 5px 8px;
}

.avatar {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 30px;
  background-color: #fcc;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
}

.editor {
  /*display: flex;*/

  .ProseMirror {
    /*flex-grow: 1;*/
    font-size: 1rem;
  }

  ::v-deep {
    p {
      margin: 8px 0 0 0;
    }
    .mention { 
      color: #a975ff;
      background-color: rgba(169, 117, 255, .1);
      border-radius: .3rem;
      padding: .1rem .3rem;
      cursor: pointer;
    }
  }
}

.send-btn {
  color: #fff;
  border: 0;
  cursor: pointer;
  width: 100px;
  line-height: 15px;
  background-color: transparent;
  background-color: rgb(43, 160, 38);
  border-radius: 5px;

  svg {
    width: 14px;
  }
}

.toolbar-bottom {
  display: flex;
  font-size: 0.9rem;
  color: #b1b1b4;
  padding: 6px 5px 5px;
}

.toolbar-section {
  display: flex;
  margin-right: 10px;
}

.attachment-input {
  display: none;
}

.files {
  flex: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.file {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 6px 10px 6px 6px;
  margin: 10px 8px 0 0;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  background: #fafafa;
  width: fit-content;

  &-thumbnail {
    width: 30px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #d5d5d5;
    background: white;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 14px;
    }
  }

  &-info {
    flex: 1 1 0;
  }

  &-name {
    font-size: 0.85rem;
  }

  &-close {
    position: absolute;
    top: -6px;
    right: -8px;
    padding: 0;
    margin: 0;
    font-size: 0.7rem;
    background: white;
    border: 2px solid #000;
    width: 18px;
    height: 18px;
    border-radius: 50px;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 8px;
    }
  }
}

.voices {
  flex: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.voice {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 6px 10px 6px 6px;
  margin: 10px 8px 0 0;
  border: 1px solid #d0d0d0;
  border-radius: 40px;
  background: #fafafa;
  width: fit-content;

  &-thumbnail {
    width: 30px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #d5d5d5;
    background: white;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;

    svg {
      width: 14px;
    }
  }

  &-bars {
    display: flex;
    gap: 2px;
    align-items: center;

    .bar {
      width: 3px;
      background-color: #4e4e4e;
    }
  }
}

.videos {
  flex: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.video {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 6px 6px 6px 6px;
  margin: 10px 8px 0 0;
  border: 1px solid #d0d0d0;
  border-radius: 40px;
  background: #fafafa;
  width: fit-content;

  &-thumbnail {
    width: 30px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #d5d5d5;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;

    svg {
      width: 14px;
    }
  }
}

.images {
  flex: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;

  .image {
    position: relative;
    border-radius: 40px;
    line-height: 0;
    margin: 10px 8px 0 0;

    img {
      height: 60px;
    }
  }
}

.toolbar-top {
  display: flex;
  font-size: 0.9rem;
  color: #bcbcc3;
  padding: 6px 5px 5px;
  background-color: #f7f7f9;
}

::v-deep .toolbar-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.is-active {
    color: rgb(34, 34, 34);
  }

  svg {
    height: 15px;
  }
}

::v-deep .tippy-active .toolbar-icon {
  color: rgb(34, 34, 34);
}

.toolbar-separator {
  width: 1px;
  margin: 3px 10px 0 10px;
  height: 22px;
  background: #bcbcc3;
}

</style>
