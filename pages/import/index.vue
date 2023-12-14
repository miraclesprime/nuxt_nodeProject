<template>
    <client-only>
        <div id="page" class="project-id-wrapper h-100 overflow-y-auto">
            <page-title title="Import project"></page-title>
            <!-- Task View -->
            <div id="import-content" class="import-content position-relative " >
                <div class=" p-1 m-auto w-50" >
                    <div class="border-gray2 shape-rounded py-1 px-05 mt-1 mb-2" style="min-width: 400px; max-width:600px;">
                        <label class="font-md mb-075 d-inline-block text-secondary">Click to import projects as .csv file from Asana</label>
                        <bib-input type="file" ref="csvImport" @files-dropped="onFileInput" multiple="false" variant="primary-24" iconLeft="upload" placeholder="Select .csv file to upload"></bib-input>

                        <div v-show="files.length > 0" class=" mt-1 justify-end">
                          <bib-button :disabled="loading" variant="primary-24" label="Import CSV" @click="checkUser" pill></bib-button> <bib-spinner v-if="loading" :scale="2" ></bib-spinner>
                        </div>
                    </div>

                    <div class="font-md py-1" >
                        <p class="font-w-500">How to export an Asana Project as a .CSV</p>
                        <ol>
                            <li>First, navigate to the dropdown header of the project next to the project.</li>
                            <li>Next, within the dropdown menu, select the Export/Print option.</li>
                            <li>Select the .CSV file type to download this project as a .CSV.</li>
                        </ol>
                        <p >Know more <a href="https://blog.asana.com/2014/09/export-to-csv/" class="text-primary" target="_blank">https://blog.asana.com/2014/09/export-to-csv/</a></p>
                    </div>

                </div>
            </div>
            
            <!-- modal -->
            <bib-modal-wrapper v-if="importmodal" size="xl" title="Import result" @close="closeModal">
              <!-- <template slot="header">
                
              </template> -->
                <template slot="content">
                    <template v-if="!importfinish && !importError && !dupProject">
                        <h4>Import will be done in steps</h4>
                        <div v-for="item in steps" class="align-center gap-05">
                            <div class="width-105 height-105 align-center justify-center">
                                <bib-spinner v-if="item.progress == 'progress'" :scale="2" variant="primary-24" ></bib-spinner>
                                <bib-icon v-else-if="item.progress == 'done'" icon="check-circle-solid" :variant="item.variant"></bib-icon>
                                <bib-icon v-else-if="item.progress == 'error'" icon="close-circle-solid" :variant="item.variant"></bib-icon>
                                <bib-icon v-else icon="check-circle" :variant="item.variant"></bib-icon>
                            </div>
                            <div :class="'text-'+item.variant" >{{item.status}} {{item.label}} </div>
                        </div>
                        <div v-show="missingMembers.length > 0" class="of-scroll-y mt-1" style="max-height: 400px">
                            <h4>Missing member(s) from import</h4>
                            <p v-for="(mm, index) in missingMembers"> {{index+1}}. {{mm}}</p>
                        </div>
                    </template>

                    <div v-show="importError" class="shape-rounded align-center gap-05 border-danger text-danger p-05">
                      <bib-icon icon="close" variant="danger"></bib-icon>
                        {{importError}}
                    </div>


                    <div v-show="dupProject && !importCompleteMsg" class="shape-rounded align-center gap-05 border-primary text-primary p-05">

                      <bib-icon icon="urgent" variant="primary-24"></bib-icon>
                        {{dupProject}}
                    </div>

                    <div v-show="importfinish" class="shape-rounded align-center gap-05 border-primary text-primary p-05">
                      <bib-icon icon="tick" variant="primary-24"></bib-icon>
                      {{importCompleteMsg}}
                    </div>
                </template>
                <template slot="footer">
                    <div v-show="missingMembers.length > 0 && steps[0].progress == 'done' && !dupProject" class="justify-between">
                        <!-- <bib-button label="Add users" variant="secondary" class="mr-1" pill @click="closeModal"></bib-button> -->
                        <bib-button label="Continue" variant="primary-24" pill @click="importProject"></bib-button>
                    </div>
                    <div v-show="dupProject && !importfinish && !importCompleteMsg">
                        <bib-button label="Cancel" variant="secondary" class="mr-1" pill @click="closeModal"></bib-button>
                        <bib-button label="Continue" variant="primary-24" pill @click="reimportCSV"></bib-button>
                    </div>
                    <div v-show="importfinish">
                        <bib-button label="Finish" variant="primary-24" pill @click="finishImport"></bib-button>
                    </div>
                </template>
            </bib-modal-wrapper>
            <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
            <!-- notification -->
            <bib-popup-notification-wrapper>
                <template #wrapper>
                    <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="4500">
                    </bib-popup-notification>
                </template>
            </bib-popup-notification-wrapper>
        </div>
    </client-only>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
    name: 'Import',
    data() {
        return {
            contentWidth: "100%",
            loading: false,
            popupMessages: [],
            alertDialog: false,
            alertMsg: "",
            files: [],
            plusButton: {
                show: true,
                label: "New Task",
                icon: "add",
            },
            userList: [],
            importmodal: false,
            importfinish: false,
            missingMembers: [],
            steps: [
                {id: 0, label: "Analyzing Users", progress: "progress", variant:"primary-24"},
                {id: 1, label: "Importing Project", progress: "pending", variant:"gray5"},
                {id: 2, label: "Importing Section/Tasks", progress: "pending", variant:"gray5"},
                {id: 3, label: "Importing Subtasks", progress: "pending", variant:"gray5"},
                {id: 4, label: "Importing Tags", progress: "pending", variant:"gray5"},
                ],
            importError: false,
            dupProject: false,
            duplicateProjId: null,
            importCompleteMsg: null
        }
    },

    computed: {

        ...mapGetters({
            appMembers: "user/getAppMembers",
        }),

    },

    methods: {
        async onFileInput(file) {
            /*let csvfile = this.$refs.csvImport.filesUploaded;
            console.log(file[0], csvfile) */

            if (file?.length > 0) {
                if (file[0]?.type != 'text/csv') {
                    this.popupMessages.push({text: "Only csv allowed", variant: "primary-24"})
                    this.files = []
                    return
                } 
                if (file[0]?.size > 2000000) {
                    this.popupMessages.push({text: "File size must be less than 2mb", variant: "primary-24"})
                    this.files = []
                    return
                }
                this.files = file
            } else {
                // this.$refs.csvImport.filesUploaded = []
                this.files = []
            }
        },

        closeModal(){
            this.importmodal = false
            this.missingMembers = []
            this.importfinish = false
            this.importError = false
            this.steps = [
                    {id: 0, label: "Analyzing Users", progress: "progress", variant:"primary-24"},
                    {id: 1, label: "Importing Project", progress: "pending", variant:"gray5"},
                    {id: 2, label: "Importing Section/Tasks", progress: "pending", variant:"gray5"},
                    {id: 3, label: "Importing Subtasks", progress: "pending", variant:"gray5"},
                    {id: 4, label: "Importing Tags", progress: "pending", variant:"gray5"},
                    ]
            this.files = []
            this.$refs.csvImport.filesUploaded = []
        },

        async checkUser() {
          // this.loading = true
            this.importmodal = true
            let file = this.$refs.csvImport.filesUploaded;

            let formdata = new FormData();
            formdata.append('file', file[0])

            let users = await this.$axios.post("/import/check-user", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if (users.data.statusCode == 200) {
              let appMemberEmails = this.appMembers.map(member => member.email); 
              this.missingMembers = users.data.data.filter(email => !appMemberEmails.includes(email)); 

              this.steps[0].progress = "done"
              this.steps[0].variant = "primary-24"
                this.userList = await users?.data?.data;
                return false
            } 
            if (users.data.statusCode == 201) {
                if (users.data.importError == "duplicate-project") {
                    this.duplicateProjId = users.data.projectId
                    this.dupProject = "This project already exists. Continue will overwrite the project data."
                    return
                } else {
                    this.importError = users.data.message
                    return false
                }
            }
             
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              // this.loading = false
              this.steps[0].progress = "error"
              this.steps[0].variant = "danger"
            

        },

        async importProject(){
            this.missingMembers = []
            this.steps[1].progress = "progress"
            this.steps[1].variant = "primary-24"

            let file = this.$refs.csvImport.filesUploaded;

            let formdata = new FormData();
            formdata.append('file', file[0])

            let res = await this.$axios.post("/import/project", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if(res.data.statusCode == 200) {
              this.importSections(res.data.data)
              this.steps[1].progress = "done"
              this.steps[1].variant = "primary-24"
            } else {
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              // this.loading = false
              this.steps[1].progress = "error"
              this.steps[1].variant = "danger"
            }
        },

        async importSections(data) {
            // console.log('Started Importing Sections...')
            this.steps[2].progress = "progress"
            this.steps[2].variant = "primary-24"
            
            let res = await this.$axios.post("/import/sections", {data: data}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if(res.data.statusCode == 200) {
              this.importSubTasks(res.data.data)
              this.steps[2].progress = "done"
              this.steps[2].variant = "primary-24"
            } else {
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              // this.loading = false
              this.steps[2].progress = "error"
              this.steps[2].variant = "danger"
            }
        },

        async importSubTasks(data) {
            // console.log('Started Importing SubTasks...')
            this.steps[3].progress = "progress"
            this.steps[3].variant = "primary-24"

            let res = await this.$axios.post("/import/subtasks", {data: data}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if(res.data.statusCode == 200) {
                this.importTags(res.data.data)
                this.steps[3].progress = "done"
                this.steps[3].variant = "primary-24"
            } else {
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              // this.loading = false
              this.steps[3].progress = "error"
              this.steps[3].variant = "danger"
            }

        },

        async importTags(data) {
            // console.log('Started Importing Tags...')
            this.steps[4].progress = "progress"
            this.steps[4].variant = "primary-24"

            let res = await this.$axios.post("/import/tags", {data: data}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if(res.data.statusCode == 200) {
              // console.log('Import Successful!!!')
              // this.missingMembers = []
                this.steps[4].progress = "done"
                this.steps[4].variant = "primary-24"
                this.importCompleteMsg = 'Imported Project Successfully!'
                this.importfinish = true
            } else {
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              // this.loading = false
              this.steps[4].progress = "error"
              this.steps[4].variant = "danger"
            }
        },

        async reimportCSV(){
            let file = this.$refs.csvImport.filesUploaded;

            let formdata = new FormData();
            formdata.append('file', file[0])
            formdata.append('projectId', Number(this.duplicateProjId))

            let res = await this.$axios.post("/import/re-import", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if(res.data.statusCode == 200) {
                this.importCompleteMsg = 'Re-Imported Project Successfully!'
                this.importfinish = true;
            } 
        },

        finishImport(){
            this.closeModal()
            this.$router.push('/projects')
        }

    }
}
</script>
<style lang="scss" scoped>
</style>