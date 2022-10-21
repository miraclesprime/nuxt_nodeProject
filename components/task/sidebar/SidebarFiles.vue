<template>
  <div id="task-files-wrapper" class="h-100 px-105 py-05">
    <div class="d-flex justify-between sub-title pb-05 border-bottom-gray2 ">
      <p class="text-gray5 font-md">Files </p>
    </div>
    <div id="task-file-actions-wrapper" class="file-actions border-bottom-gray2 d-flex align-center py-025">
      <div class="d-inline-flex gap-05 cursor-pointer shape-rounded py-025 px-05 bg-success-sub4 bg-hover-success-sub1 text-success text-hover-white" id="file-upload-button" @click="uploadModal = true">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-upload-text" class="">Upload File</span>
      </div>
      <!-- <div class="action-left d-flex " id="file-action-left">
      </div> -->
      <!-- <div class="action-right d-flex gap-05" id="file-action-right">
        <ul class="actions" id="file-action-right-actions">
          <li class="action" id="files-action">
            <span class="mr-025" id="file-action5-text">View</span>
            <div class="d-flex width-105 height-105 align-center justify-center bg-dark bg-hover-gray1 shape-rounded p-025 cursor-pointer" id="file-action5-link">
              <bib-icon v-if="displayType == 'list'" icon="apps-large" variant="white" @click.native="displayType = 'grid'"></bib-icon>
              <bib-icon v-if="displayType == 'grid'" icon="list" variant="white" @click.native="displayType = 'list'"></bib-icon>
            </div>
          </li>
        </ul>
      </div> -->
    </div>
    
    <div id="task-files" class="files d-flex flex-wrap gap-1 py-05">
      <div v-if="showPlaceholder" class="placeholder d-inline-flex align-center gap-1 p-025 border-gray3 bg-white">
        <div class="animated-background width-2 height-2 shape-circle" ></div>
        <div class="animated-background  height-105" style="width:9rem;" ></div>
      </div>
      <template v-else>
        <file-comp v-for="file in files" :key="file.key + fileKey" :property="file" @open-file=""></file-comp>
      </template>
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
  name: "TaskFiles",
  data: function() {
    return {
      displayType: 'grid',
      tableFields: FILE_FIELDS,
      isFileFavorite: false,
      uploadModal: false,
      fileLoader: false,
      dbFiles: [],
      fileKey: 1,
      showPlaceholder: false,
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
      // console.log(newValue.id, newValue.title)
      if (newValue.id && newValue.id != oldValue.id) {
        // console.log(newValue.id, oldValue.id)
        this.getFiles()
      } else {
        this.dbFiles = []
      }
    }
  },
  mounted() {
    // console.log('mounted, task id->', this.task.id)
    this.getFiles()
  },
  methods: {
    imageType(data) {

      if (data.type.indexOf("image/") == 0) {
        return true
      } else { return false }
    },

    handleChangeFile(files, event) {},

    async uploadFiles() {
      this.fileLoader = true
      let myfiles = this.$refs.files.filesUploaded
      let filelist = []

      let formdata = new FormData()
      myfiles.forEach(file => {
        formdata.append('files', file)
        filelist.push(file.name)
      })
      formdata.append('taskId', this.task.id)
      // formdata.append('text', 'File added for task');
      formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to task`)

      if (this.task.project[0]) {
        formdata.append('projectId', this.task.project[0].projectId)
      }

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      // console.log(fi.data)
      if (fi.data.statusCode == 200) {
        _.delay(() => {
          // console.log('delay->', fi.data);
          this.getFiles()
        }, 2000);
        
      }
      this.fileLoader = false
      this.uploadModal = false
    },

    async getFiles() {
      this.showPlaceholder = true
      // console.info(Object.keys(this.task).length, !this.task)
      if (Object.keys(this.task).length == 0) {
        // console.log('no task selected')
        this.dbFiles = []
        return
      }
      let obj1 = { taskId: this.task.id }
      this.$axios.get("file/db/all", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'obj': JSON.stringify(obj1)
          }
        }).then(f => {
          // console.log(f.data)
          if (f.data.statusCode == 200) {
            this.dbFiles = f.data.data
            this.showPlaceholder = false
            this.fileKey += 1;
          }
        })
        .catch(e => console.error(e))
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
              "taskid": this.task.id,
              "text": "File deleted from task"
            }
          }).then(f => {
            // console.log(f.data)
            if (f.data.statusCode == 200) {
              alert(f.data.message);
              _.delay(() => {
                this.getFiles().then((res) => {
                  this.fileKey += 1;
                })
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
  /*border-bottom: 1px solid $gray2;*/
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

</style>
