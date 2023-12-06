<template>
  <client-only>
    <div class="file-wrap border-gray2 shape-rounded d-flex " style="flex-direction: column;" id="msg-file-wrapper">
      <figure class="position-relative w-100 align-center justify-center" >
        <img id="msg-file-filePreview" v-if="filePreview" :src="filePreview" class="shape-rounded d-block" :alt="property.name">
        <bib-icon v-else :icon="fileIcon(property.type)" :scale="3" variant="gray2"></bib-icon>
        <!-- <div id="msg-file-file-click" class="file-overlay d-flex align-center justify-center cursor-pointer" @click="$emit('file-click')">
          <bib-icon icon="eye-open" :scale="2" variant="secondary"></bib-icon>
        </div> -->
        <div id="msg-file-list-wrapper" class="shape-circle bg-gray4 width-2 height-2 d-flex justify-center align-center file-menu">
          <bib-popup pop="elipsis" :scale="1">
            <template v-slot:menu>
              <div id="msg-file-list" class="list ">
                <span id="msg-file-list-item-1" class="list__item" v-if="canPreview" @click="$emit('file-click')">Preview</span>
                <!-- <span id="msg-file-list-item-2" class="list__item">Open</span> -->
                <span id="msg-file-list-item-3" class="list__item" @click.stop="fileDetailModal = true">Detail</span>
                <span id="msg-file-list-item-4" class="list__item" @click.stop="downloadFile">Download File</span>
                <span id="msg-file-list-item-5" v-show="canDelete" class="list__item list__item__danger" @click.stop="deleteFile(property)">Delete File</span>
              </div>
            </template>
          </bib-popup>
        </div>
      </figure>
      <div class="file-info align-center flex-grow-1 gap-05 bg-light py-05 px-075">
        <bib-icon :icon="fileIcon(property.type)" variant="gray5" :scale="1.25"></bib-icon>
        <div class="file-name text-black">{{property.key}}</div>
      </div>

      <bib-modal-wrapper v-if="fileDetailModal" title="File Details" @close="fileDetailModal = false">
        <template slot="content">
          <table class="table">
            <tr v-for="file in fileDetail">
              <template v-if="file.key == 'size'">
                <th id="mfd-h1" class="text-right font-w-400">{{file.key}}:</th>
                <td class="text-left text-gray6 pl-1">{{$formatBytes(file.value)}}</td>
              </template>
              <template v-else>
                <th id="mfd-h2" class="text-right font-w-400">{{file.key}}:</th>
                <td class="text-left text-gray6 pl-1">{{file.value}}</td>
              </template>
            </tr>
          </table>
        </template>
        <template slot="footer">
          <div id="msg-file-file-detail-modal" class="d-flex justify-end">
            <bib-button label="Close" variant="light" pill @click="fileDetailModal = false"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>

      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="5000" >
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
    </div>
  </client-only>
</template>

<script>
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs'
import { fileIcon } from '~/utils/file';

export default {

  name: 'MessageFiles',
  props: {
    property: { type: Object },
    project: { type: Object }
  },

  /*components: {
    fa: FontAwesomeIcon,
  },*/

  data() {
    return {
      // faMagnifyingGlassPlus,
      fileDetailModal: false,
      filePreview: "",
      popupMessages: [],
    }
  },
  computed: {

    fileDetail() {
      let arr = []
      if (this.property.hasOwnProperty("key")) {
        Object.entries(this.property).map(([key, value]) => {
          if (key == 'name' || key == "size") {
            arr.push({ value: value, key: key })
          }
          if(key == 'extension') {
            arr.push({key: key, value: value?.split('.')[1]})
          }
          if (key == "createdAt" || key == "updatedAt") {
            arr.push({key: key, value: dayjs(value).format('DD MMM YYYY')})
          }
        })
      }
      return arr
    },
    canPreview() {
      if (this.property.type.indexOf('image/') == 0 || this.property.type.indexOf('pdf') > 0) {
        return true
      } else {
        return false
      }
    },
    canDelete() {
      if((this.property.userId == JSON.parse(localStorage.getItem('user')).sub ) || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        return true
      } else {
        return false
      }
    },
  },
  mounted() {
    this.previewFile()

  },
  methods: {
    fileIcon,
    async previewFile() {
      if (this.property.type.indexOf('image/') == 0 && "url" in this.property) {
        let imgtype = this.property.type.split("/")[1]
        const prev = await this.$axios.get("file/single/" + this.property.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        })
        this.filePreview = `data:image/${imgtype};base64,${prev.data.data}`
      } else {
        // this.filePreview = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAXcAQMAAABAq4doAAAABGdBTUEAALGPC/xhBQAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAGESURBVHic7cExAQAAAMKg9U9tCU+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICnAb7/AAE0lx4oAAAAAElFTkSuQmCC"
        this.filePreview = null
      }
    },

    downloadFile() {
      this.$axios.get("file/" + this.property.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
          console.log(f.data)
          if (f.data.statusCode == 200) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = f.data.data;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(f.data.data);
          }
        })
        .catch(e => console.error(e))
    },

    deleteFile(file) {
      
      if((file.userId == JSON.parse(localStorage.getItem('user')).sub ) || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
          this.$axios.delete("file/" + file.key, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'taskid': this.property.taskId || null,
                'projectid': this.property.projectId || null,
                'text': `file ${file.name} deleted`,
                'ishidden': true,
                'userid': file.userId,
              }
            }).then(f => {
              // console.log(f.data)
              if (f.data.statusCode == 200) {
                this.popupMessages.push({text: f.data.message, variant: "primary-24"})
                _.delay(() => {
                  // this.getFiles()
                  this.$emit("reload-files")
                }, 3000);
              }
            })
            .catch(e => console.error(e))
      } else {
        // console.log("you don't have enough permission to delete this file")
        this.popupMessages.push({text: "you do not have permission to delete this file", variant: "primary-24"})
      }
    },
  }
}

</script>
<style lang="scss" scoped>
.file-wrap {
  font-size: $base-size;
  background-color: $gray9;

  figure {
    aspect-ratio: 1.77 / 1;
    img {
      width: 100%;
      object-fit: cover;
      aspect-ratio: 1.77 / 1;
    }
  }

  /*.file-overlay {
    position: absolute;
    inset: 0;
    z-index: 3;
    background-color: rgba(220, 220, 225, 0.75);
    opacity: 0;
    transition: opacity 200ms ease-in;
  }*/

  .file-menu {
    opacity: 0;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 5;
    transition: opacity 180ms ease-out 200ms;

    .list {
      max-width: 12rem;
    }

  }
  .file-info {

    .file-name {
      white-space: normal;
      word-break: break-all;
      height: auto;
      cursor: default;
    }

  }

  &:hover {
    box-shadow: 0 1px 10px rgba(100,100,100,0.25);
    .file-menu {
      opacity: 1;
    }

  }
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: $base-size;
}

table th,
table td {
  padding: 0.25rem;
}

</style>
