<template>
  <client-only>
  <div id="message-input-wrapper" v-if="editor" class="wrapper" @click.stop>
    <div class="container" id="message-input-container">
      <div class="toolbar-top border-bottom-gray2" id="message-input-toolbar-top">
        <div class="toolbar-icon " id="message-input-toolbar-icon-1" :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
          <fa :icon="faBold"></fa>
        </div>
        <div class="toolbar-icon"  id="message-input-toolbar-icon-2" :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
          <fa :icon="faItalic"></fa>
        </div>
        <div class="toolbar-icon"  id="message-input-toolbar-icon-3" :class="{ 'is-active': editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()">
          <fa :icon="faUnderline"></fa>
        </div>
        <div class="toolbar-icon"  id="message-input-toolbar-icon-4" :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
          <fa :icon="faStrikethrough"></fa>
        </div>
        <!-- <div class="toolbar-separator"  id="message-input-toolbar-separator"></div> -->
        <div class="toolbar-icon"  id="message-input-toolbar-icon-5" :class="{ 'is-active': editor.isActive('link') }" @click="toggleLink">
          <fa :icon="faLink"></fa>
        </div>
        <!-- <div class="toolbar-separator"  id="message-input-toolbar-separator-2"></div> -->
        <div class="toolbar-icon"  id="message-input-toolbar-icon-6" :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
          <fa :icon="faListUl"></fa>
        </div>
        <div class="toolbar-icon"  id="message-input-toolbar-icon-7" :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
          <fa :icon="faListOl"></fa>
        </div>
        <!-- <div class="toolbar-separator"  id="message-input-toolbar-separator-3"></div> -->
        <!-- <div class="toolbar-icon" @click="onAttachmentClick"  id="message-input-toolbar-icon-8">
          <fa :icon="faPaperclip"></fa>
          <input ref="file" multiple type="file" id="message-input-attachment-input" class="attachment-input" @change="onFilesSelect" />
        </div> -->
        <mention-popup @select="mentionUser"></mention-popup>
        <tippy ref="emojiPickerTippy" arrow trigger="click" theme="light-border p-0" interactive :animate-fill="false" :distance="10" placement="top-start" >
          <div slot="trigger" class="toolbar-icon" id="message-input-toolbar-icon-9">
            <fa :icon="faGrin"></fa>
          </div>
          <div @click.stop>
            <v-emoji-picker @select="selectEmoji" ></v-emoji-picker>
          </div>
        </tippy>
        <!-- <div class="toolbar-button d-inline-flex align-center ml-auto"  id="message-input-toolbar-btn-wrap">
          <button type="button" id="message-input-toolbar-btn" class="cursor-pointer text-secondary text-underline border-none bg-white text-hover-dark" @click.stop="cancelMessage">Cancel</button> 
        </div> -->
      </div>
      <div class="editor-container" id="message-input-editor-container">
        <div class="editor-wrapper" id="message-input-editor-container-wrapper">
          <!-- <div v-if="value.files.length > 0" class="files" id="message-input-files-wrapper">
            <div v-for="(file, idx) in value.files" :key="idx" class="file" :id="'message-input-'+idx">
              <div class="file-thumbnail" id="message-input-fafile">
                <fa :icon="faFile"></fa>
              </div>
              <div class="file-info" id="message-input-file-info">
                <div class="file-name" id="message-input-file-name">
                  {{ snipFileName(file.name) }}
                </div>
              </div>
              <button type="button" id="message-input-file-close" class="file-close" @click="() => removeAttachment(file.id)">
                <fa :icon="faTimes"></fa>
              </button>
            </div>
          </div> -->
          <editor-content :editor="editor" class="editor" />
        </div>
      </div>
    </div>
    <bib-modal-wrapper v-if="isLinkModalShown" title="Link URL" @close="isLinkModalShown = false">
      <template slot="content">
        <bib-input label="URL" v-model="linkUrl" />
        <div class="d-flex"  id="message-input-closemodal-setlink-wrap">
          <bib-button label="Cancel"  id="message-input-cancel-btn" variant="light" pill @click="closeAndResetLinkModal" ></bib-button>
          <bib-button label="Set Link"  id="message-input-set-link-btn" variant="success" class="ml-auto" pill @click="setLink" ></bib-button>
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
import Focus from '@tiptap/extension-focus'
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
  /*faCode,
  faCodeBranch,*/
  faFile,
  faTimes,
  faAddressCard,
  /*faMicrophone,
  faVideo,*/
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidV4 } from 'uuid';
import { mapGetters } from 'vuex';
import tippy from 'tippy.js';
import { TippyComponent } from 'vue-tippy';
import { VEmojiPicker } from 'v-emoji-picker';
import { snipFileName } from '~/utils/file';
import "~/assets/tippy-theme.scss";

import MentionList from '~/components/message/MessageMentionList.vue';

export default {
  name: "RichEditor",
  components: {
    EditorContent,
    fa: FontAwesomeIcon,
    VEmojiPicker,
    tippy: TippyComponent
  },

  props: {
    value: Object,
    editingMessage: String,
    placeholder: {
      type: String,
      default: 'Type a message...',
    },
  },

  computed: {
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
      /*faCode,
      faCodeBranch,*/
      faFile,
      faTimes,
      faAddressCard,
      /*faMicrophone,
      faVideo,*/
    };
  },

  mounted() {
    if (process.client) {

    this.editor = new Editor({
      content: this.editingMessage || '',
      extensions: [
        StarterKit,
        Link.configure({
          HTMLAttributes: {
            // Remove target entirely so links open in current tab
            target: null,
          },
          openOnClick: false,
          validate: href => /^https?:\/\//.test(href)
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
        Focus.configure({
          className: 'focus',
        }),
      ],
      onBlur: ({ editor, event }) => {
        // console.log(editor.getHTML())
        this.$emit('submit', { text: editor.getHTML(), ...this.value });
      },
    });
    }
  },
  
  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    sendMessage() {
      if (this.editor.isEmpty && [...Object.values(this.value)].flat().length === 0) {
        return;
      }

      this.$emit('submit', { text: this.editor.getHTML(), ...this.value });
      // this.editor.commands.setContent('');
    },
    /*cancelMessage(){
      this.editor.commands.clearContent()
    },*/
    onAttachmentClick() {
      this.$refs.file.click();
    },
    /*removeAttachment(id) {
      this.$emit('input', { ...this.value, files: this.value.files.filter((f) => f.id !== id) });
    },*/
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
      this.$refs.emojiPickerTippy.tip.hide()
    },
    /*reset() {
      this.editor.commands.setContent('');
    },*/
    
    toggleLink() {
      if (this.editor.isActive('link')) {
        this.editor.chain().focus().unsetLink().run();
      } else {
        this.setLink()
      }
    },
    closeAndResetLinkModal() {
      this.isLinkModalShown = false;
      this.linkUrl = '';
    },

    setLink() {
      let previousUrl = this.editor.getAttributes('link').href
      let url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink()
          .run()
        return
      }

      // update link

      const urlPattern = /^(http:\/\/|https:\/\/)/;

      let checkHttp = url.split('http://') ? url.split('http://')[1] : null;
      let checkHttps = url.split('https://') ? url.split('https://')[1] : null;

      // console.log(urlPattern.test(url))

      if(urlPattern.test(url)) {
        // console.log(checkHttp, checkHttps)
        if(checkHttp) {
          checkHttp = 'http://' + checkHttp
          this.editor
          .commands
          .setLink({ href: checkHttp, target: '_blank' })
        } else {
          checkHttps = 'https://' + checkHttps
          this.editor
          .commands
          .setLink({ href: checkHttps, target: '_blank' })
        }
      } else {
        url = 'https://' + url
        this.editor
        .commands
        .setLink({ href: url, target: '_blank' })
      }
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
        this.editor.commands.setContent(value);
      } else {
        this.editor.commands.setContent('');
      }
    },
  },
};

</script>
<style lang="scss" scoped>
.wrapper {}

.container {
  width: auto;
  border: 1px solid $gray2;
  background-color: $gray9;
  border-radius: 6px;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
  /*&:hover {
    border-color: var(--bib-gray2);
  }*/
    &:focus-within {
      background-color: white;
      border-color: $gray8;
    }
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
  font-size: $base-size;

  .ProseMirror {
    /*font-size: $base-size;*/
    ul { list-style-type: disc; }
  }

  ::v-deep {
    p {
      margin: 0 0 2px;
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

/*.toolbar-bottom {
  display: flex;
  font-size: 0.9rem;
  color: #b1b1b4;
  padding: 6px 5px 5px;
}*/

/*.toolbar-section {
  display: flex;
  margin-right: 10px;
}*/

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

.toolbar-top {
  display: flex;
  /*gap: 0.25rem;*/
  font-size: 0.9rem;
  /*padding: 6px 5px 5px;*/
}

::v-deep .toolbar-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /*border-radius: 4px;*/
  color: var(--bib-secondary);
  /*background-color: var(--bib-light);*/
  border-right: 1px solid $gray2;

  &.is-active {
    color: $text;
    background-color: $gray2;
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
  margin: 2px 4px;
  height: 22px;
  background: var(--bib-light);
}

</style>
