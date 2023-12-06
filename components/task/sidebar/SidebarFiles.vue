<template>
  <div id="sbf-task-files-wrapper" class="py-05 mb-05" :class="{ 'px-105': mode == 'task' }" >
    <div class=" sub-title pb-025 " id="sbf-task-files-heading-wrapper">
      <p class="text-gray6 font-sm" id="sbf-task-files-para">Files</p>
    </div>
    <div id="sbf-task-file-actions-wrapper" class="file-actions d-flex align-center flex-wrap gap-05 py-025" v-show="activeProp">
      <!-- <div class="d-inline-flex gap-05 align-center cursor-pointer shape-rounded height-2 px-1 bg-success-sub6 bg-hover-success-sub3 text-success" id="sbf-file-upload-button" @click="uploadModal = true">
        <bib-icon icon="add" variant="success" :scale="1" class=""></bib-icon>
        <span id="sbf-file-upload-text" class=""> Files</span>
      </div> -->
      <bib-button label="Files" variant="primary--outline" icon="add" class="" @click="uploadModal = true"></bib-button>


      <file-comp v-for="file in files" :key="file.key + fileKey" :property="file" @delete-file="deleteFile" @preview-file="showPreviewModal(file)" ></file-comp>
    </div>
    <!-- <div id="sbf-task-file-comp" class="files py-05">
      <template>
      </template>
    </div> -->
    <!-- <alert-dialog
      v-show="alertDialog"
      :message="alertMsg"
      @close="alertDialog = false"
    ></alert-dialog> -->

    <!-- File Upload modal -->
    <bib-modal-wrapper
      v-if="uploadModal"
      title="Select file(s)"
      @close="uploadModal = false"
    >
      <template slot="content">
        <div style="margin-inline: -1rem; max-height: 65vh; overflow-y: auto;" id="sbf-upload-from-device">
          <bib-input type="file" ref="files" variant="primary" iconLeft="upload" placeholder="Upload from device"></bib-input>
        </div>
        <loading :loading="fileLoader"></loading>
      </template>
      <template slot="footer">
        <div class="d-flex" id="sbf-footer">
          <bib-button label="Cancel" variant="light" pill @click="uploadModal = false" ></bib-button>
          <bib-button label="Upload" variant="primary-24" class="ml-auto" pill @click="uploadFiles"></bib-button>
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
        <div class="text-center" id="sbf-content">
          <img
            v-if="imgPreview"
            :src="imgPreview"
            class="w-fit"
            style="max-width: 100%"
            alt="preview"
            id="sbf-img-preview"
          />
          <pdf-preview
            v-else-if="pdfPreview"
            :pdfsrc="pdfPreview"
          ></pdf-preview>
          <bib-spinner v-else class="mx-auto"></bib-spinner>
        </div>
      </template>
      <template slot="footer">
        <div class="text-center" id="sbf-footer-close">
          <bib-button
            label="Close"
            variant="light"
            pill
            @click="closePreviewModal"
          ></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="4000">
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
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
      // showPlaceholder: false,
      previewModal: false,
      imgPreview: "",
      pdfPreview: "",
      oldfilesCount: 0,
      ffcount: 0,
      // alertDialog: false,
      // alertMsg: "",
      popupMessages: [],
    };
  },
  props: {
    mode: { type: String, default: "task" },
    reloadFiles: { type: Number, default: 0 },
    activeProp: { default: null }
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      subtask: "subtask/getSelectedSubTask",
    }),

    files() {
      let files = [];
      if(this.dbFiles.length > 0) {
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
      } else {
        files = [];
        this.oldfilesCount = files.length;
        this.fileKey++;
      }
      return files;
    },
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
    this.getFiles();
  },
  methods: {
    imageType(data) {
      if (data.type.indexOf("image/") == 0) {
        return true;
      } else {
        return false;
      }
    },

    // handleChangeFile(files, event) {},

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
      formdata.append(
        "text",
        `uploaded file(s) "${filelist.join(", ")}" to ${this.mode}`
      );
      formdata.append("isHidden", true);

      if ( this.mode == "task" && this.task.project?.length > 0 ) {
        formdata.append("projectId", this.task.project[0].project?.id ? this.task.project[0].project.id : null );
      }

      /*for (var pair of formdata.entries()) {
        console.log(pair[0]+ ', ' + pair[1]) 
      }*/
      // console.log(formdata.entries)
      const fi = await this.$axios.post("/file/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (fi.data.statusCode == 200) {
        _.delay(() => {
          this.getFiles();
          this.fileLoader = false;
          this.uploadModal = false;
        }, 5000);
      }
    },

    getFiles() {
      // this.showPlaceholder = true;

      if (this.mode == "task" && Object.keys(this.task).length == 0) {
        this.dbFiles = [];
        return;
      }

      let obj1;
      this.mode == "task"
        ? (obj1 = { taskId: this.task.id })
        : (obj1 = { subTaskId: this.subtask.id || this.$route.params.id });

      this.$axios
        .get("file/db/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            obj: JSON.stringify(obj1),
          },
        })
        .then((f) => {
          if (f.data.statusCode == 200) {
            this.dbFiles = f.data.data;
            this.fileKey += 1;
          }
        })
        .catch((e) => {
          console.error(e);
          this.dbFiles = [];
        });
      // this.showPlaceholder = false;
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

      if((file.userId == JSON.parse(localStorage.getItem('user')).sub ) || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
      if (del) {
        this.$axios
          .delete("file/" + file.key, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              taskid: this.task.id,
              text: "File deleted from task",
              isHidden: true,
              userid: file.owner,
            },
          })
          .then((f) => {
            if (f.data.statusCode == 200) {
              // this.alertDialog = true;
              // this.alertMsg = f.data.message;
              this.popupMessages.push({ text: f.data.message, variant: "primary-24"})
              _.delay(() => {
                this.getFiles().then((res) => {
                  this.fileKey += 1;
                });
              }, 2000);
            }
          })
          .catch((e) => console.error(e));
      }
      } else {
        console.log("you don't have enough permission to delete this file")
      }
    },

    async showPreviewModal(file) {

      console.log(file.type, file.url)
      if ((file.type.indexOf("image/") == 0 || file.type.indexOf("/pdf") > 1) && file.url) {
        this.previewModal = true;
        console.log('preview available')
      } else {
        console.log('file will be downloaded')
        this.downloadFile(file);
        return
      }

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
      } 
      if (file.type.indexOf("/pdf") > 1 && "url" in file) {
        const prev = await this.$axios.get("file/single/" + file.key, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            preview: "preview",
          },
        });
        this.pdfPreview = `data:application/pdf;base64,${prev.data.data}`;
        this.imgPreview = "";
      } 
    },

    closePreviewModal() {
      this.imgPreview = "";
      this.pdfPreview = "";
      this.previewModal = false;
    },
  },
};
</script>
<style scoped lang="scss">

</style>
