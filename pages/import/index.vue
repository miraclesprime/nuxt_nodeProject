<template>
    <client-only>
        <div id="page" class="project-id-wrapper ">
            <page-title title="Import"></page-title>
            <!-- <task-actions :gridType="gridType" @change-grid-type="changeGridType" @create-task="openSidebar" @add-section="toggleNewsection"></task-actions> -->
            <!-- Task View -->
            <div id="project-id-content" class="project-id-content position-relative overflow-y-auto" :style="{ 'width': contentWidth }">
                <div class="d-flex justify-center p-1">
                  <div class="border-gray2 shape-rounded py-1" style="max-width:300px;">
                    <bib-input type="file" ref="filesUploaded"  @files-dropped="onFileInput" variant="accepted" iconLeft="upload" placeholder="Drop file here or click to upload"></bib-input>
                  </div>
                </div>
            </div>
            <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
            <!-- notification -->
            <bib-popup-notification-wrapper>
                <template #wrapper>
                    <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
                    </bib-popup-notification>
                </template>
            </bib-popup-notification-wrapper>
        </div>
    </client-only>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
// import { DEMO_TASK, TASK_CONTEXT_MENU } from "config/constants";
// import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'
// import { Container, Draggable } from 'vue-smooth-dnd'
// import { applyDrag, generateItems } from '~/utils/helpers'
// import draggable from 'vuedraggable'

export default {
    name: 'Import',
    // components: {Container, Draggable, draggable},
    data() {
        return {
            // tableFields: DEMO_TASK,
            contentWidth: "100%",
            loading: false,

            popupMessages: [],
            alertDialog: false,
            alertMsg: "",

            plusButton: {
                show: true,
                label: "New Task",
                icon: "add",
            },

        }
    },

    watch: {
        /*sidebar(newVal){
          const page = document.getElementById("page")
          this.$nextTick(() => {
            const panel = document.getElementById("side-panel-wrapper")
            // console.log("page width="+page.scrollWidth+", panel width="+panel.offsetWidth)
            if (this.sidebar) {
              this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
            } else {
              this.contentWidth = '100%'
            }
          });
        }*/
    },

    computed: {

        /*...mapGetters({
            project: 'project/getSingleProject',
            projects: 'project/getAllProjects',
            team: "project/getProjectMembers",
            sections: "section/getProjectSections",
            projectTasks: "task/tasksForListView",
            taskFields: "task/tableFields",
            favProjects: "project/getFavProjects",
            user2: "user/getUser2",
            sidebar: "task/getSidebarVisible",
        }),*/

    },

    mounted() {
        if (process.client) {


        }
    },

    beforeDestroy() {
        // console.info("before destroy hook");
        // this.localdata = null
    },

    methods: {
        onFileInput(files) {
            console.log(files);
        },

        /*onsubmit(data) {
          if (this.editMessage?.id) {
            this.$store.dispatch("project/updateProjectComment", { projectId: this.project?.id, commentId: this.editMessage.id, comment: data.text })
            .then(res => {
              if (this.value.files.length > 0) {
                this.uploadFile(this.value.files, this.editMessage)
                this.value.files = []
              }
              this.$nuxt.$emit('refresh-list')
              this.editMessage = {}

            })
            .catch(e => console.log(e))
          } else {
            this.$store.dispatch("project/createProjectComment", { id: this.project?.id, comment: data.text })
              .then(res => {
                if (this.value.files.length > 0) {
                  this.uploadFile(this.value.files, res.data)
                  this.value.files = []
                }
                this.$nuxt.$emit('refresh-list')
              })
              .catch(e => console.log(e))
          }
        },*/
        /*async uploadFile(commentFiles, data){
          let formdata = new FormData()
          let filelist = []

          commentFiles.forEach(file => {
            formdata.append('files', file)
            filelist.push(file.name)
          })
          formdata.append('projectId', this.project?.id)
          formdata.append('projCommentId', data.id)
          formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to comment`)

          const fi = await this.$axios.post("/file/upload", formdata, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
          if (fi.data.statusCode == 200) {
            this.value.files = []
            this.$nuxt.$emit("get-msg-files")
          }
        }*/

    }
}
</script>
<style lang="scss" scoped>
</style>