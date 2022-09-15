<template>
<client-only>
  <div id="task-files-wrapper" class="h-100">
    <div id="task-file-actions-wrapper" class="file-actions d-flex align-center p-025 ">
      <div class="action-left d-flex " id="file-action-left">
        <div class="d-flex gap-05 cursor-pointer shape-rounded bg-hover-gray3 py-025 px-05 text-secondary text-hover-dark" id="file-upload-button" @click="uploadModal = true">
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-upload-text" class="">Upload File</span>
        </div>
      </div>
      <div class="action-right d-flex gap-05" id="file-action-right">
        <ul class="actions" id="file-action-right-actions">
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
    <div class="of-scroll-y h-100" id="task-files">
      <template v-if="displayType == 'list'">
        <bib-table :fields="tableFields" :sections="files" :hide-no-column="true" :key="task.title + '' + fileKey">
          <template #cell(name)="data">
            <div class="d-flex align-center gap-05">
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
          <bib-file v-for="file in files" :key="file.key + fileKey" :property="file"></bib-file>
        </div>
      </template>
    <loading :loading="loading"></loading>
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
</client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { FILE_FIELDS } from "~/config/constants"

export default {
  name: "SidebarFiles",
  data: function() {
    return {
      displayType: 'grid',
      tableFields: FILE_FIELDS,
      loading: false,
      isFileFavorite: false,
      uploadModal: false,
      fileLoader: false,
      dbFiles: [],
      fileKey: 1
    }
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask"
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
  watch: {
    task(newValue, oldValue) {
      console.log(newValue, oldValue)
      this.getFiles()
    }
  },
  mounted() {
    console.log('mounted, task id->', this.task.id)
    this.getFiles()
  },
  methods: {
    imageType(data) {
      
      if (data.type.indexOf("image/") == 0) {
        return true
      } else { return false }
    },

    handleChangeFile(files, event) {
    },

    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded

      let formdata = new FormData()
      myfiles.forEach(file => {
        formdata.append('files', file)
      })
      formdata.append('taskId', this.task.id)

      if(this.task.project[0]) {
        formdata.append('projectId', this.task.project[0].projectId)
      }

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      console.log(fi.data)
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
      let obj1 = { taskId: this.task.id }
      this.$axios.get("file/db/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify(obj1)
        }
      }).then(f => {
        // console.log(f.data)
        if (f.data.statusCode == 200) {
          this.dbFiles = f.data.data;
          this.loading = false
          this.fileKey += 1;
        }
      }).catch((err) => {
        console.log(err);
        this.loading = false
      })
    },

    downloadFile(file) {

      this.$axios.get("file/" + file.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
        
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
      let del = window.confirm("Are you sure want to delete?")
      if (del) {
        this.$axios.delete("file/" + file.key, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
          }).then(f => {
            // console.log(f.data)
            if (f.data.statusCode == 200) {
              alert(f.data.message);
              _.delay(() => {
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
