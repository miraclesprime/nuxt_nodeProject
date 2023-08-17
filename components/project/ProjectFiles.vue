<template>
  <div id="project-files-wrapper" class="project-files-wrapper mb-105">
    <div id="project-file-actions-wrapper" class="file-actions d-flex align-center py-025 ">
      <div class="action-left d-flex " id="pf-file-action-left">
        <div class="d-flex gap-05 cursor-pointer shape-rounded bg-success-sub6 bg-hover-success-sub3 py-025 px-05 text-success " id="pf-file-upload-button" @click="uploadModal = true">
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="pf-file-upload-text" class="">Upload File</span>
        </div>
      </div>
      <div class="action-right d-flex gap-05" id="pf-file-action-right">
        <div class="d-flex width-2 height-2 align-center justify-center bg-light bg-hover-gray4 shape-circle p-025 cursor-pointer" id="pf-file-action5-link">
          <bib-icon v-if="displayType == 'list'" icon="table" variant="gray6" @click.native="displayType = 'grid'"></bib-icon>
          <bib-icon v-if="displayType == 'grid'" icon="list" variant="gray6" @click.native="displayType = 'list'"></bib-icon>
        </div>
      </div>
    </div>
      <template v-if="displayType == 'list'">
        <bib-table :fields="tableFields" :sections="dbFiles" :key="tempKey" :hide-no-column="true">
          <template #cell(name)="data">
            <div class="d-flex align-center text-left gap-05 cursor-pointer" id="pf-file-extensions" @click="showPreviewModal(data.value)">
              <!-- <bib-avatar v-if="imageType(data.value)" shape="rounded" :src="data.value.url" size="1.5rem"></bib-avatar> -->
              <bib-icon :icon="fileIcon(data.value)" ></bib-icon>
              <!-- <bib-icon v-else-if="data.value.extension == '.docx'" icon="word" :scale="1.25"></bib-icon>
              <bib-icon v-else-if="data.value.extension == '.xlsx'" icon="excel" :scale="1.25"></bib-icon>
              <bib-icon v-else-if="data.value.extension == '.pptx'" icon="powerpoint" :scale="1.25"></bib-icon>
              <bib-icon v-else-if="data.value.extension == '.pdf'" icon="pdf" :scale="1.25"></bib-icon>
              <bib-icon v-else icon="file-text-solid" variant="gray4" :scale="1.25"></bib-icon> -->
              <span class="text-gray1 text-truncate" id="pf-file-data-name" v-tooltip="data.value.name" style="max-width: 6rem;">
                {{ data.value.name }}
              </span>
            </div>
          </template>
          <template #cell(type)="data">
            <div class=" text-gray1" id="pf-file-data-ext">
              {{ data.value.extension }}
            </div>
          </template>
          <template #cell(size)="data">
            <div class="text-truncate text-gray1" id="pf-file-data-size">
              {{ $formatBytes(data.value.size) }}
            </div>
          </template>
          <template #cell(owner)="data">
            <user-info :userId="data.value.userId"></user-info>
          </template>
          <template #cell(date)="data">
            <format-date :datetime="data.value.updatedAt"></format-date>
          </template>
          <template #cell_action="data">
            <div class="shape-circle bg-light bg-hover-gray4 width-2 height-2 d-flex justify-center align-center file-menu" id="pf-file-shape-circle">
              <bib-button pop="horizontal-dots" :scale="1">
                <template v-slot:menu>
                  <div class="list " id="pf-file-list">
                    <span class="list__item"  id="pf-file-list-item-1" v-if="canPreview(data.value)" @click="showPreviewModal(data.value)">Preview</span>
                    <!-- <span class="list__item"  id="pf-file-list-item-2">Open</span> -->
                    <span class="list__item"  id="pf-file-list-item-3" @click.stop="openFileDetail(data.value)">Detail</span>
                    <span class="list__item"  id="pf-file-list-item-4" @click.stop="downloadFile(data.value)">Download File</span>
                    <hr>
                    <span v-if="canDelete(data.value)" class="list__item list__item__danger"  id="pf-file-list-item-5" @click.stop="deleteFile(data.value)">Delete</span>
                  </div>
                </template>
              </bib-button>
            </div>
          </template>
        </bib-table>
      </template>
      <template v-if="displayType == 'grid'">
        <div class="files d-grid gap-1 py-1"  id="pf-file-message-files">
          <message-files v-for="file in files" :property="file" :project="project" :key="file.key" @file-click="showPreviewModal(file)" @reload-files="getFiles" ></message-files>
        </div>
      </template>
      <loading :loading="loading"></loading>
    
    <bib-modal-wrapper v-if="uploadModal" title="Select file(s)" @close="uploadModal = false">
      <template slot="content">
        <div style="margin-left: -1rem; margin-right: -1rem;"  id="pf-file-select-files-modal">
          <bib-input type="file" ref="files" @files-dropped="handleChangeFile" variant="accepted" iconLeft="upload" placeholder="Upload from device"></bib-input>
        </div>
        <loading :loading="fileLoader"></loading>
      </template>
      <template slot="footer">
        <div class="d-flex"  id="pf-file-select-files-btns">
          <bib-button label="Cancel"  id="pf-file-cancel-btn" variant="light" pill @click="uploadModal = false"></bib-button>
          <bib-button label="Upload"  id="pf-file-upload-btn" variant="success" class="ml-auto" pill @click="uploadFiles"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <!-- file preview modal -->
    <bib-modal-wrapper v-if="previewModal" title="Preview" size="xl" @close="closePreviewModal">
      <template slot="content">
        <div class="text-center"  id="pf-file-close-preview-content">
          <img v-if="imgPreview"  id="pf-file-img-tag" :src="imgPreview" class="w-fit" style="max-width:100%;" alt="preview">
          <pdf-preview v-else-if="pdfPreview" :pdfsrc="pdfPreview"></pdf-preview>
          <bib-spinner v-else class="mx-auto" ></bib-spinner>
        </div>
      </template>
      <template slot="footer">
        <div class="text-center"  id="pf-file-closePreviewModal">
          <bib-button label="Close" variant="light" pill @click="closePreviewModal"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <!-- file detail modal -->
    <bib-modal-wrapper v-if="fileDetailModal" title="File Details" @close="fileDetailModal = false">
      <template slot="content">
        <table class="table">
          <tr v-for="(file, index) in fileDetail" :id="'pf-file-table-row-'+index" :key="index">
            <template v-if="file.key == 'size'">
              <th id="pf-th1" class="text-right font-w-400">{{file.key}}:</th>
              <td class="text-left text-gray6 pl-1" id="pf-td1">{{$formatBytes(file.value)}}</td>
            </template>
            <template v-else>
              <th id="pf-th2" class="text-right font-w-400">{{file.key}}:</th>
              <td class="text-left text-gray6 pl-1" id="pf-td2">{{file.value}}</td>
            </template>
          </tr>
        </table>
      </template>
      <template slot="footer">
        <div class="d-flex justify-end" id="pf-file-footer">
          <bib-button label="Close" variant="light" pill @click="fileDetailModal = false"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <!-- popup message -->
    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification
          v-for="(msg, index) in popupMessages"
          :key="index"
          :message="msg.text"
          :variant="msg.variant"
          :autohide="5000"
        >
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FILE_FIELDS } from "~/config/constants"
import dayjs from 'dayjs'

export default {
  name: "ProjectFiles",
  props: {
    proj: Object,
  },

  data: function() {
    return {
      displayType: 'grid',
      tableFields: FILE_FIELDS,
      loading: false,
      isFileFavorite: false,
      uploadModal: false,
      fileLoader: false,
      dbFiles: [],
      tempKey: 1,
      previewModal: false,
      imgPreview: '',
      pdfPreview: '',
      fileDetailModal: false,
      fileDetail: {},
      popupMessages: [],
    }
  },
  computed: {
    ...mapGetters({
      project: "project/getSingleProject"
    }),
    files() {
      let files = []
      this.dbFiles.map((dbf) => {
        files.push({
          name: dbf.name,
          key: dbf.key,
          preview: dbf.url,
          url: dbf.url,
          extension: dbf.extension,
          type: dbf.type,
          size: dbf.size,
          owner: dbf.userId,
          updatedAt: dbf.updatedAt,
          createdAt: dbf.createdAt,
        })
      })
      return files
    },

  },

  mounted() {
    this.getFiles()
  },
  methods: {
    fileIcon(file){
      if (file.type.includes('image')) {
        return "file-text-solid"
      }
      if (file.type.includes('video')) {
        return "video-solid"
      }
      if (file.type.includes('audio')) {
        return "sales"
      }
      if (file.type.includes('pdf')) {
        return "pdf"
      }
      if (file.type.includes('msword') || file.type.includes("wordprocessingml") || file.type.includes("rtf")) {
        return "word"
      }
      if (file.type.includes('presentation')) {
        return "powerpoint"
      }
      if (file.type.includes('ms-excel') || file.type.includes("sheet")) {
        return "excel"
      }
      return "file-text-solid"
    },
    /*imageType(data) {
      if (data.type.indexOf("image/") == 0) {
        return true
      } else { return false }
    },*/
    handleChangeFile(files, event) {
    },
    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded
      let filelist = []

      let formdata = new FormData()
      myfiles.forEach(file => {
        filelist.push(file.name)
        formdata.append('files', file)
      })
      formdata.append('projectId', this.project?.id || this.proj.id)
      formdata.append('text', `file(s) [${filelist.join(", ")}] uploaded to project`)
      formdata.append('isHidden', true)

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (fi.data.statusCode == 200) {
        _.delay(() => {
          this.getFiles()
        }, 2000);
      }
      this.fileLoader = false
      this.uploadModal = false
    },
    getFiles() {
      this.loading = true
      let obj1 = { projectId: this.project?.id || this.proj?.id }
      this.$axios.get("file/db/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
      }).then(f => {
        if (f.data.statusCode == 200) {
          this.loading = false
          this.dbFiles = f.data.data
          this.tempKey += 1
        }
      }).catch(e => {
        console.error(e)
        this.loading = false
      })
    },
    async showPreviewModal(file){
      console.log(file)

      if (file.type.indexOf('image/') == 0 || file.type.indexOf('pdf') > 0) {
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
          return
        } 
        if(file.type.indexOf('pdf') && "url" in file) { 
          const prev = await this.$axios.get("file/single/"+file.key, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'preview': 'preview'
            }
          })
          this.pdfPreview = `data:application/pdf;base64,${prev.data.data}`
          this.imgPreview = ''
          return
        }
      } else { 
        this.downloadFile(file)
        this.closePreviewModal()
        // this.previewModal = false
      }
    
    },
    closePreviewModal(){
      this.imgPreview = ''
      this.pdfPreview = ''
      this.previewModal = false
    },
    downloadFile(file) {
      this.$axios.get("file/" + file.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
          // console.log(f.data)
          if (f.data.statusCode == 200) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = f.data.data;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(f.data.data);
            // alert('your file downloaded!');
            this.popupMessages.push({text: "your file downloaded", variant: "success"})
          }
        })
        .catch(e => console.error(e))
    },
    deleteFile(file) {
      
      if((file.userId == JSON.parse(localStorage.getItem('user')).sub ) || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
          this.$axios.delete("file/" + file.key, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'projectid': this.project.id || this.proj.id,
                'text': `file ${file.name} deleted`,
                'isHidden': true,
                'userid': file.userId
              }
            }).then(f => {
              console.log(f.data)
              if (f.data.statusCode == 200) {
                // alert(f.data.message);
                this.popupMessages.push({text: f.data.message, variant: "orange"})
                _.delay(() => {
                  this.getFiles()
                }, 3000);
              }
            })
            .catch(e => console.error(e))
      } else {
        this.popupMessages.push({text: "you do not have permission to delete this file", variant: "orange"})
        // console.log("you don't have enough permission to delete this file")
      }
    },
    openFileDetail(file) {
      let arr = []
      if (file.hasOwnProperty("key")) {
        Object.entries(file).map(([key, value]) => {
            if (key == 'name' || key == "extension" || key == "size") {
              arr.push({ value: value, key: key })
            }
            if (key == "createdAt" || key == "updatedAt") {
              arr.push({ key: key, value: dayjs(value).format('DD MMM YYYY')})
            }
        })
      }
      this.fileDetail = arr
      this.fileDetailModal = true
    },
    canPreview(file) {
      if (file.type.indexOf('image/') == 0 || file.type.indexOf('pdf') > 0) {
        return true
      } else {
        return false
      }
    },
    canDelete(file){
      // console.log(file)
      if((file.userId == JSON.parse(localStorage.getItem('user')).sub ) || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        return true
      } else {
        return false
      }
    }
  }
}

</script>
<style scoped lang="scss">
.project-files-wrapper { margin-bottom: 1.5rem; }
.file-actions {
  border-bottom: 1px solid $gray4;
}

.action-right {
  margin-left: auto;
}

.actions {
  display: flex;
  color: $gray1;

  span {
    margin-left: 5px;
    font-size: 13px;
  }

  svg,
  svg g {
    fill: $gray1;
  }
}

.action {
  display: flex;
  padding: 0 20px;
  align-items: center;
}

.files {
  grid-template-columns: repeat(3, 1fr);
  .file {
    border-radius: 0.5rem;

    img {
      object-fit: cover;
      width: 100%;
      height: 12rem;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
  }
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: $base-size;
  th, td {
    padding: 0.25rem;
  }
}

::v-deep{
  .table {
    th, td { padding: 0.15rem 0.3rem;}
  }
}
</style>
