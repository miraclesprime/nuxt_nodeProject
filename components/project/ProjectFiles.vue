<template>
  <div id="project-files-wrapper" class="project-files-wrapper mb-105">
    <div id="project-file-actions-wrapper" class="file-actions d-flex align-center py-025 ">
      <div class="action-left d-flex " id="file-action-left">
        <div class="d-flex gap-05 cursor-pointer shape-rounded bg-success-sub6 bg-hover-success-sub3 py-025 px-05 text-success " id="file-upload-button" @click="uploadModal = true">
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-upload-text" class="">Upload File</span>
        </div>
        <!-- <div class="d-flex gap-05 ml-1 cursor-pointer text-secondary text-hover-dark" id="file-add-section-button" >
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-add-section-text" class="">New Section</span>
        </div> -->
      </div>
      <div class="action-right d-flex gap-05" id="file-action-right">
        <div class="d-flex width-2 height-2 align-center justify-center bg-light bg-hover-gray4 shape-circle p-025 cursor-pointer" id="file-action5-link">
          <bib-icon v-if="displayType == 'list'" icon="table" variant="gray6" @click.native="displayType = 'grid'"></bib-icon>
          <bib-icon v-if="displayType == 'grid'" icon="list" variant="gray6" @click.native="displayType = 'list'"></bib-icon>
        </div>
      </div>
    </div>
    <!-- <div id="project-files"> -->
      <template v-if="displayType == 'list'">
        <bib-table :fields="tableFields" :sections="dbFiles" :key="tempKey" :hide-no-column="true">
          <template #cell(name)="data">
            <div class="d-flex align-center text-left gap-05 cursor-pointer" @click="showPreviewModal(data.value)">
              <bib-avatar v-if="imageType(data.value)" shape="rounded" :src="data.value.url" size="1.5rem">
              </bib-avatar>
              <bib-icon v-else-if="data.value.extension == '.docx'" icon="word" :scale="1.25"></bib-icon>
              <bib-icon v-else-if="data.value.extension == '.xlsx'" icon="excel" :scale="1.25"></bib-icon>
              <bib-icon v-else-if="data.value.extension == '.pptx'" icon="powerpoint" :scale="1.25"></bib-icon>
              <bib-icon v-else-if="data.value.extension == '.pdf'" icon="pdf" :scale="1.25"></bib-icon>
              <bib-icon v-else icon="file-text-solid" variant="gray4" :scale="1.25"></bib-icon>
              <span class="text-gray1">
                {{ data.value.name }}
              </span>
            </div>
          </template>
          <template #cell(type)="data">
            <div class=" text-gray1">
              {{ data.value.extension }}
            </div>
          </template>
          <template #cell(size)="data">
            <div class="text-truncate text-gray1">
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
            <div class="shape-circle bg-light bg-hover-gray4 width-2 height-2 d-flex justify-center align-center file-menu">
              <bib-button pop="horizontal-dots" :scale="1">
                <template v-slot:menu>
                  <div class="list ">
                    <span class="list__item" v-if="canPreview(data.value)" @click="showPreviewModal(data.value)">Preview</span>
                    <span class="list__item">Open</span>
                    <span class="list__item" @click.stop="openFileDetail(data.value)">Detail</span>
                    <span class="list__item" @click.stop="downloadFile(data.value)">Download File</span>
                    <hr>
                    <span class="list__item list__item__danger" @click.stop="deleteFile(data.value)">Delete</span>
                  </div>
                </template>
              </bib-button>
            </div>
            <!-- <div class="d-flex">
              <div class="shape-rounded width-105 height-105 d-flex justify-center align-center cursor-pointer bg-hover-gray4" @click="downloadFile(data.value)">
                <bib-icon icon="align-bottom"></bib-icon>
              </div>
              <div class="shape-rounded width-105 height-105 d-flex justify-center align-center cursor-pointer bg-hover-gray4" @click="deleteFile(data.value)">
                <bib-icon icon="trash" variant="danger"></bib-icon>
              </div>
            </div> -->
          </template>
        </bib-table>
      </template>
      <template v-if="displayType == 'grid'">
        <div class="files d-grid gap-1 py-1">
          <message-files v-for="file in files" :property="file" :key="file.key" @file-click="showPreviewModal(file)" ></message-files>
        </div>
      </template>
      <loading :loading="loading"></loading>
      
    <!-- </div> -->
    
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
    <bib-modal-wrapper v-if="previewModal" title="Preview" size="xl" @close="closePreviewModal">
      <template slot="content">
        <!-- <div v-if="!filePreview" class="text-center">
          <bib-spinner class="mx-auto" ></bib-spinner>
        </div> -->
        <div class="text-center">
          <!-- <img :src="filePreview" class="w-fit" style="max-width:100%;" alt="preview"> -->
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
    <!-- file detail modal -->
    <bib-modal-wrapper v-if="fileDetailModal" title="File Details" @close="fileDetailModal = false">
        <template slot="content">
          <table class="table">
            <tr v-for="file in fileDetail">
              <template v-if="file.key == 'size'">
                <th class="text-right font-w-400">{{file.key}}:</th>
                <td class="text-left text-gray6 pl-1">{{$formatBytes(file.value)}}</td>
              </template>
              <template v-else>
                <th class="text-right font-w-400">{{file.key}}:</th>
                <td class="text-left text-gray6 pl-1">{{file.value}}</td>
              </template>
            </tr>
          </table>
        </template>
        <template slot="footer">
          <div class="d-flex justify-end">
            <bib-button label="Close" variant="light" pill @click="fileDetailModal = false"></bib-button>
            <!-- <bib-button label="Create" variant="success" class="ml-auto" pill></bib-button> -->
          </div>
        </template>
      </bib-modal-wrapper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FILE_FIELDS } from "~/config/constants"
import dayjs from 'dayjs'

export default {
  name: "ProjectFiles",
  data: function() {
    return {
      displayType: 'grid',
      tableFields: FILE_FIELDS,
      loading: false,
      /*files: [{
          name: "https://loremflickr.com/640/360?random=1",
          variant: "success",
          preview: "https://loremflickr.com/640/360?random=1",
          extension: "png",
          type: "Image",
          size: "234",
          owner: "dfskh45",
          updatedAt: "2022-08-22T22:40:21",
        }
      ],*/
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
    console.log('mounted, project id->', this.project.id)
    this.getFiles()
    /*let obj1 = { projectId: this.project.id }
    this.$axios.get("file/db/all", {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
    }).then(f=>{
      console.log(f.data)
      if (f.data.statusCode == 200) {
        this.dbFiles = f.data.data
      }
    })*/
  },
  methods: {
    /*uploadFileModal() {
      this.uploadModal = true
    },*/
    imageType(data) {
      // data.extension == '.png'
      // console.log(data)
      if (data.type.indexOf("image/") == 0) {
        return true
      } else { return false }
    },
    handleChangeFile(files, event) {
      // console.info(this.$refs.files.filesUploaded)
      // console.log(files, event.target.files)
    },
    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded
      let filelist = []

      let formdata = new FormData()
      myfiles.forEach(file => {
        // console.info(file.name)
        filelist.push(file.name)
        formdata.append('files', file)
      })
      formdata.append('projectId', this.project.id)
      formdata.append('text', `file(s) [${filelist.join(", ")}] uploaded to project`)
      formdata.append('isHidden', true)

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
          // console.log('delay->', fi.data);
          this.getFiles()
        }, 2000);
      }
      this.fileLoader = false
      this.uploadModal = false
    },
    getFiles() {
      this.loading = true
      let obj1 = { projectId: this.project.id }
      this.$axios.get("file/db/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
      }).then(f => {
        // console.log(f.data)
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
      this.previewModal = true
      // console.info(file)

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
        // this.filePreview = "https://via.placeholder.com/200x160/f0f0f0/6f6f79?text="+file.extension
      }
    
    },
    closePreviewModal(){
      this.imgPreview = ''
      this.pdfPreview = ''
      this.previewModal = false
    },
    downloadFile(file) {
      // console.log(file.key)
      // let key = file.key.split('.')
      this.$axios.get("file/" + file.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
          console.log(f.data)
          if (f.data.statusCode == 200) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = f.data.data;
            // the filename you want
            // a.download = 'todo-1.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(f.data.data);
            alert('your file downloaded!');
          }
        })
        .catch(e => console.error(e))
    },
    deleteFile(file) {
      // console.info(file)
      let del = window.confirm("Are you sure want to delete " + file.name + "?")
      if (del) {
        this.$axios.delete("file/" + file.key, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'projectid': this.project.id,
              'text': `file ${file.name} deleted`,
              'isHidden': true,
              'userid': file.userId
            }
          }).then(f => {
            console.log(f.data)
            if (f.data.statusCode == 200) {
              alert(f.data.message);
              _.delay(() => {
                // console.log('delay->', fi.data);
                this.getFiles()
              }, 2000);
            }
          })
          .catch(e => console.error(e))
      }
    },
    openFileDetail(file) {
      let arr = []
      if (file.hasOwnProperty("key")) {
        Object.entries(file).map(([key, value]) => {
          // if (value) {
            if (key == 'name' || key == "extension" || key == "size") {
              arr.push({ value: value, key: key })
            }
            if (key == "createdAt" || key == "updatedAt") {
              arr.push({ key: key, value: dayjs(value).format('DD MMM YYYY')})
            }
          // }
        })
      }
      this.fileDetail = arr
      this.fileDetailModal = true
      // return arr
    },
    canPreview(file) {
      if (file.type.indexOf('image/') == 0 || file.type.indexOf('pdf') > 0) {
        return true
      } else {
        return false
      }
    },
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
    /*flex: 0 0 18rem;*/
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

</style>
