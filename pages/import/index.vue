<template>
    <client-only>
        <div id="page" class="project-id-wrapper h-100 overflow-y-auto">
            <page-title title="Import"></page-title>
            <!-- <task-actions :gridType="gridType" @change-grid-type="changeGridType" @create-task="openSidebar" @add-section="toggleNewsection"></task-actions> -->
            <!-- Task View -->
            <div id="project-id-content" class="project-id-content position-relative " :style="{ 'width': contentWidth }">
                <div class="d-flex justify-center p-1">
                    <div class="border-gray2 shape-rounded py-1" style="min-width: 300px; max-width:400px;">
                        <bib-input type="file" ref="csvImport" @files-dropped="onFileInput" multiple="false" variant="accepted" iconLeft="upload" placeholder="Click to upload"></bib-input>
                        <div class="mx-1 mt-1 align-center">
                          <bib-button :disabled="loading" variant="secondary" label="Import CSV" @click="onsubmit"></bib-button> <bib-spinner v-if="loading" :scale="2" ></bib-spinner>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="row">
                <div v-if="appMembers.length > 0" class="col-4">
                    <h3>Users in Central Biztree</h3>
                    <ol>
                        <li v-for="(user, index) in appMembers">{{user.label}} ({{user.email}})</li>
                    </ol>
                </div>
                <div v-if="userList.length > 0" class="col-4">
                    <h3>Users from Asana Project</h3>
                    <ol>
                        <li v-for="(user, index) in userList">{{user}}</li>
                    </ol>
                </div>
                <div v-if="missingMembers.length > 0" class="col-4">
                    <h3>Missing members from import</h3>
                    <ol>
                        <li v-for="(mm, index) in missingMembers">{{mm}}</li>
                    </ol>
                </div>
            </div> -->
            <!-- modal -->
            <bib-modal-wrapper v-if="importmodal" title="Import result" @close="closeModal">
              <!-- <template slot="header">
                
              </template> -->
                <template slot="content">
                    <div v-show="missingMembers.length > 0" class="of-scroll-y  " style="max-height: 400px">
                        <!-- <p v-for="(mm, index) in missingMembers">{{index}}. {{mm.label}} - {{(mm.email)}}</p> -->
                        <h4>Missing member from import</h4>
                        <p v-for="(mm, index) in missingMembers"> {{index+1}}. {{mm}}</p>
                    </div>
                    <div v-show="importfinish" class="shape-rounded align-center gap-05 border-success text-success p-05">
                      <bib-icon icon="tick" variant="success"></bib-icon>
                      Import finished successfully
                    </div>
                </template>
                <template slot="footer">
                    <div v-show="!importfinish" class="justify-between">
                        <bib-button label="Skip" variant="secondary" class="mr-1" pill @click="closeModal"></bib-button>
                        <bib-button label="Continue" variant="primary" pill @click="importData"></bib-button>
                    </div>
                </template>
            </bib-modal-wrapper>
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

            userList: [],
            importmodal: false,
            missingMembers: [],
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
          console.log(file) 
        },

        async onsubmit() {
          this.loading = true
            let file = this.$refs.csvImport.filesUploaded;

            let formdata = new FormData();
            formdata.append('file', file[0])

            let users = await this.$axios.post("/file/import", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            console.log(users.data.data, this.appMembers)
            if (users.data.statusCode == 200) {
              let appMemberEmails = this.appMembers.map(member => member.email); 
              this.missingMembers = users.data.data.filter(email => !appMemberEmails.includes(email)); 

              this.importmodal = true
              console.log(this.missingMembers)
              this.loading = false
            } else {
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              this.loading = false
            }

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
        closeModal(){
          this.importmodal = false
          this.missingMembers = []
          this.importfinish = false
        },
        importData(){
          // _.delay(function() {
            this.missingMembers = []
            this.importfinish = true
          // }, 1200)
        },

    }
}
</script>
<style lang="scss" scoped>
</style>