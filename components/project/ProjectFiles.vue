<template>
  <div id="project-files-wrapper" class="h-100">
    <div id="project-file-actions-wrapper" class="file-actions d-flex align-center p-025 ">
      <div class="action-left d-flex " id="file-action-left">
        <div class="d-flex gap-05 cursor-pointer shape-rounded bg-hover-gray3 py-025 px-05 text-secondary text-hover-dark" id="file-upload-button" @click="uploadModal = true">
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-upload-text" class="">Upload File</span>
        </div>
        <!-- <div class="d-flex gap-05 ml-1 cursor-pointer text-secondary text-hover-dark" id="file-add-section-button" >
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-add-section-text" class="">New Section</span>
        </div> -->
      </div>
      <div class="action-right d-flex gap-05" id="file-action-right">
        <ul class="actions" id="file-action-right-actions">
          <!-- <li class="action" id="file-action1">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="changeViewName"></sorting-comp>
        </li>
        <li class="action" id="file-action2">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy"></sorting-comp>
        </li> -->
          <li class="action" id="files-action">
            <span class="mr-025" id="file-action5-text">View</span>
            <div class="d-flex width-105 height-105 align-center justify-center bg-dark bg-hover-gray1 shape-rounded p-025 cursor-pointer" id="file-action5-link">
              <bib-icon v-if="displayType == 'list'" icon="apps-large" variant="white" @click.native="displayType = 'grid'"></bib-icon>
              <bib-icon v-if="displayType == 'grid'" icon="list" variant="white" @click.native="displayType = 'list'"></bib-icon>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="of-scroll-y h-100" id="project-files">
      <template v-if="displayType == 'list'">
        <bib-table :fields="tableFields" :sections="dbFiles" :key="tempKey" :hide-no-column="true">
          <template #cell(name)="data">
            <div class="d-flex align-center gap-05 ">
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
            <div class=" text-gray1">
              {{ data.value.size }}
            </div>
          </template>
          <template #cell(owner)="data">
            <user-info :userId="data.value.userId"></user-info>
          </template>
          <template #cell(date)="data">
            <format-date :datetime="data.value.updatedAt"></format-date>
          </template>
          <template #cell_action="data">
            <div class="d-flex">
              <div class="shape-rounded width-105 height-105 d-flex justify-center align-center cursor-pointer bg-hover-gray4" @click="downloadFile(data.value)">
                <bib-icon icon="align-bottom"></bib-icon>
              </div>
              <div class="shape-rounded width-105 height-105 d-flex justify-center align-center cursor-pointer bg-hover-gray4" @click="deleteFile(data.value)">
                <bib-icon icon="trash" variant="danger"></bib-icon>
              </div>
            </div>
          </template>
        </bib-table>
      </template>
      <template v-if="displayType == 'grid'">
        <div class="files d-flex flex-wrap gap-1 p-1">
          <bib-file v-for="file in files" :key="file.key + tempKey" :property="file" @click.native="downloadFile(file)"></bib-file>
        </div>
      </template>
      <loading :loading="loading"></loading>
      <!-- <div v-for="n in 15" class="file bg-secondary-sub3 border-hover-gray4 ">
        <img :src="'https://loremflickr.com/320/240?random='+n" alt="">
        <div class="d-flex align-center gap-05 p-05">
          <bib-icon icon="file-text" variant="gray4" :scale="1.5"></bib-icon> <span>extremely-extremely-very-loooong-File-name.jpg</span>
        </div>
      </div> -->
    </div>
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
</template>

<script>
import { mapGetters } from 'vuex'
import { FILE_FIELDS } from "~/config/constants"
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
        },
        {
          name: "Long File Name for microsoft word file",
          // preview: "https://loremflickr.com/640/360?random=2",
          extension: "docx",
          type: "File",
          size: "534",
        },
        {
          name: "Long File Name for adobe pdf file",
          // preview: "https://loremflickr.com/640/360?random=2",
          extension: "pdf",
          type: "File",
          size: "534",
        },
        {
          name: "Long File Name for microsoft excel file",
          // preview: "https://loremflickr.com/640/360?random=2",
          extension: "xlsx",
          type: "File",
          size: "534",
        },
        {
          name: "Extra Long File Name for microsoft powerpoint presentation file",
          // preview: "https://loremflickr.com/640/360?random=2",
          extension: "pptx",
          type: "File",
          size: "534",
        },
      ],*/
      isFileFavorite: false,
      uploadModal: false,
      fileLoader: false,
      dbFiles: [],
      tempKey: 1,
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
          extension: dbf.extension,
          type: dbf.type,
          size: dbf.size,
          owner: dbf.userId,
          updatedAt: dbf.updatedAt,
          createdAt: dbf.createdAt,
        })
      })
      return files
    }
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

      let formdata = new FormData()
      myfiles.forEach(file => {
        formdata.append('files', file)
      })
      formdata.append('projectId', this.project.id)

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
            alert('your file has downloaded!');
          }
        })
        .catch(e => console.error(e))
    },
    deleteFile(file) {
      let del = window.confirm("Are you sure want to delete?")
      if (del) {
        this.$axios.delete("file/" + file.key, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
  }
}

</script>
<style scoped lang="scss">
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
  .file {
    flex: 0 0 18rem;
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

</style>
