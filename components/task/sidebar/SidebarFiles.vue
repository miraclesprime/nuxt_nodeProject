<template>
  <div
    id="task-files-wrapper"
    class="py-05"
    :class="{ 'px-2': mode == 'task' }"
  >
    <div class="d-flex justify-between sub-title pb-05 border-bottom-gray2">
      <p class="text-gray5 font-md">Files</p>
    </div>
    <div
      id="task-file-actions-wrapper"
      class="file-actions border-bottom-gray2 d-flex align-center py-025"
    >
      <div
        class="d-inline-flex gap-05 cursor-pointer shape-rounded py-025 px-05 bg-success-sub6 bg-hover-success-sub3 text-success"
        id="file-upload-button"
        @click="uploadModal = true"
      >
        <bib-icon
          icon="add"
          variant="success"
          :scale="1.25"
          class=""
        ></bib-icon>
        <span id="file-upload-text" class="">Upload File</span>
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
    <div id="task-files" class="files py-05">
      <!-- <div v-if="showPlaceholder" class="placeholder d-inline-flex align-center gap-1 p-025 border-gray3 bg-white">
        <div class="animated-background width-2 height-2 shape-circle"></div>
        <div class="animated-background  height-105" style="width:9rem;"></div>
      </div> -->
      <template>
        <file-comp
          v-for="file in files"
          :key="file.key + fileKey"
          :property="file"
          @delete-file="deleteFile"
          @preview-file="showPreviewModal(file)"
        ></file-comp>
      </template>
    </div>
    <alert-dialog
      v-show="alertDialog"
      :message="alertMsg"
      @close="alertDialog = false"
    ></alert-dialog>
    <!-- File Upload modal -->
    <bib-modal-wrapper
      v-if="uploadModal"
      title="Select file(s)"
      @close="uploadModal = false"
    >
      <template slot="content">
        <div style="margin-left: -1rem; margin-right: -1rem">
          <bib-input
            type="file"
            ref="files"
            @files-dropped="handleChangeFile"
            variant="accepted"
            iconLeft="upload"
            placeholder="Upload from device"
          ></bib-input>
        </div>
        <loading :loading="fileLoader"></loading>
      </template>
      <template slot="footer">
        <div class="d-flex">
          <bib-button
            label="Cancel"
            variant="light"
            pill
            @click="uploadModal = false"
          ></bib-button>
          <bib-button
            label="Upload"
            variant="success"
            class="ml-auto"
            pill
            @click="uploadFiles"
          ></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <!-- preview modal -->
    <bib-modal-wrapper
      v-if="previewModal"
      title="Preview"
      size="xl"
      @close="closePreviewModal"
    >
      <template slot="content">
        <!-- <div v-if="!imgPreview || !pdfPreview" class="text-center">
        </div> -->
        <div class="text-center">
          <img
            v-if="imgPreview"
            :src="imgPreview"
            class="w-fit"
            style="max-width: 100%"
            alt="preview"
          />
          <pdf-preview
            v-else-if="pdfPreview"
            :pdfsrc="pdfPreview"
          ></pdf-preview>
          <bib-spinner v-else class="mx-auto"></bib-spinner>
        </div>
      </template>
      <template slot="footer">
        <div class="text-center">
          <bib-button
            label="Close"
            variant="light"
            pill
            @click="closePreviewModal"
          ></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FILE_FIELDS } from "~/config/constants";

export default {
  name: "TaskFiles",
  data: function () {
    return {
      displayType: "grid",
      tableFields: FILE_FIELDS,
      isFileFavorite: false,
      uploadModal: false,
      fileLoader: false,
      dbFiles: [],
      fileKey: 1,
      showPlaceholder: false,
      previewModal: false,
      imgPreview: "",
      pdfPreview: "",
      oldfilesCount: 0,
      ffcount: 0,
      alertDialog: false,
      alertMsg: "",
    };
  },
  props: {
    mode: { type: String, default: "task" },
    reloadFiles: { type: Number, default: 0 },
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      subtask: "subtask/getSelectedSubTask",
    }),

    files() {
      let files = [];
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
        });
      });
      this.oldfilesCount = files.length;
      return files;
    },
    /*filesCount() {
      return this.dbFiles.length
    },*/
  },
  watch: {
    reloadFiles(newValue, oldValue) {
      if (newValue != oldValue) {
        _.delay(() => {
          this.getFiles();
        }, 3000);
      }
    },
  },
  mounted() {
    // console.log('mounted, task id->', this.task.id)
    this.getFiles();
    // this.canDeleteTaskFile()
    // })
  },
  methods: {
    imageType(data) {
      if (data.type.indexOf("image/") == 0) {
        return true;
      } else {
        return false;
      }
    },

    handleChangeFile(files, event) {},

    async uploadFiles() {
      this.fileLoader = true;
      let myfiles = this.$refs.files.filesUploaded;
      let filelist = [];

      let formdata = new FormData();
      myfiles.forEach((file) => {
        formdata.append("files", file);
        filelist.push(file.name);
      });
      this.mode == "task"
        ? formdata.append("taskId", this.task.id)
        : formdata.append("subTaskId", this.subtask.id);
      // formdata.append('text', 'File added for task');
      formdata.append(
        "text",
        `uploaded file(s) "${filelist.join(", ")}" to ${this.mode}`
      );
      formdata.append("isHidden", true);

      if (
        this.mode == "task" &&
        this.task.hasOwnProperty("project") &&
        this.task.project.length > 0
      ) {
        formdata.append("projectId", this.task.project[0].projectId);
      }

      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // console.log(fi.data)
      if (fi.data.statusCode == 200) {
        _.delay(() => {
          // console.log('delay->', fi.data);
          this.getFiles();
          this.fileLoader = false;
          this.uploadModal = false;
        }, 5000);
      }
    },

    getFiles() {
      // console.log("file mode",this.mode)
      this.showPlaceholder = true;
      // console.info(Object.keys(this.task).length, !this.task)

      if (this.mode == "task" && Object.keys(this.task).length == 0) {
        // console.log('no task selected')
        this.dbFiles = [];
        return;
      }

      let obj1;
      this.mode == "task"
        ? (obj1 = { taskId: this.task.id })
        : (obj1 = { subTaskId: this.subtask.id || this.$route.params.id });

      this.$axios
        .get("file/db/all", {
          // timeout: 2500,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            obj: JSON.stringify(obj1),
          },
        })
        .then((f) => {
          // console.log(f.data)
          if (f.data.statusCode == 200) {
            // let oldfilesCount = this.filesCount
            this.dbFiles = f.data.data;
            this.fileKey += 1;
          }
        })
        .catch((e) => {
          console.error(e);
          this.dbFiles = [];
        });
      this.showPlaceholder = false;
    },

    downloadFile(file) {
      this.$axios
        .get("file/" + file.key, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((f) => {
          if (f.data.statusCode == 200) {
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = f.data.data;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(f.data.data);
          }
        })
        .catch((e) => console.error(e));
    },

    deleteFile(file) {
      let del = window.confirm("Are you sure want to delete?");
      if (del) {
        this.$axios
          .delete("file/" + file.key, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              taskid: this.task.id,
              text: "File deleted from task",
              isHidden: true,
              userid: file.userId,
            },
          })
          .then((f) => {
            // console.log(f.data)
            if (f.data.statusCode == 200) {
              this.alertDialog = true;
              this.alertMsg = f.data.message;
              // alert(f.data.message);
              _.delay(() => {
                this.getFiles().then((res) => {
                  this.fileKey += 1;
                });
              }, 2000);
            }
          })
          .catch((e) => console.error(e));
      }
    },

    async showPreviewModal(file) {
      this.previewModal = true;

      if (file.type.indexOf("image/") == 0 && "url" in file) {
        let imgtype = file.type.split("/")[1];
        const prev = await this.$axios.get("file/single/" + file.key, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            preview: "preview",
          },
        });
        this.imgPreview = `data:image/${imgtype};base64,${prev.data.data}`;
        this.pdfPreview = "";
      } else if (file.type.indexOf("pdf") && "url" in file) {
        const prev = await this.$axios.get("file/single/" + file.key, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            preview: "preview",
          },
        });
        this.pdfPreview = `data:application/pdf;base64,${prev.data.data}`;
        this.imgPreview = "";
      } else {
        this.downloadFile(file);
        this.previewModal = false;
        // this.filePreview = "https://via.placeholder.com/200x160/f0f0f0/6f6f79?text="+file.extension
      }
    },

    closePreviewModal() {
      this.imgPreview = "";
      this.pdfPreview = "";
      this.previewModal = false;
    },

    // canDeleteTaskFile() {
    //   console.log(this.task.userId, JSON.parse(localStorage.getItem('user')).sub)
    //   //  console.log(JSON.parse(localStorage.getItem('user')).subr)
    //   if (this.file.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN' ) {
    //     this.cdtf = true
    //     return true;
    //   }
    //   this.cdtf = false
    //   return false
    // },
  },
};
</script>
<style scoped lang="scss">
.file-actions {
  /*border-bottom: 1px solid $gray2;*/
}

/*.action-right {
  margin-left: auto;
}*/

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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
</style>
