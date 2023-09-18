<template>
    <client-only>
        <div id="page" class="project-id-wrapper ">
            <page-title title="Import"></page-title>
            <!-- <task-actions :gridType="gridType" @change-grid-type="changeGridType" @create-task="openSidebar" @add-section="toggleNewsection"></task-actions> -->
            <!-- Task View -->
            <div id="project-id-content" class="project-id-content position-relative overflow-y-auto" :style="{ 'width': contentWidth }">
                <div class="d-flex justify-center p-1">
                  <div class="border-gray2 shape-rounded py-1" style="max-width:300px;">
                    <bib-input type="file" ref="csvImport"  @files-dropped="onFileInput" variant="accepted" iconLeft="upload" placeholder="Drop file here or click to upload"></bib-input>
                    <bib-button variant="secondary" label="Import CSV" @click="onsubmit"></bib-button>
                  </div>
                </div>
            </div>
            <div class="row">
            <div v-if="appMembers.length > 0" class="col-6">
              <h3>Users in Central Biztree</h3>
              <ol>
                <li v-for="(user, index) in appMembers">{{user.email}}</li>
              </ol>
            </div>
            <div v-if="userList.length > 0" class="col-6">
              <h3>Users in Asana Project</h3>
              <ol>
                <li v-for="(user, index) in userList">{{user}}</li>
              </ol>
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

            userList: []

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

        ...mapGetters({
            appMembers: "user/getAppMembers",
        }),

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
        async onFileInput(file) {
            // console.log(file) 
        },

        async onsubmit() {
          let file = this.$refs.csvImport.filesUploaded;

          let formdata = new FormData();
          formdata.append('file', file[0])

          let users = await this.$axios.post("/file/import", formdata, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            })

          this.userList = await users?.data?.data;
        },

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