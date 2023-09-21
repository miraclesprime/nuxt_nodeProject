<template>
    <client-only>
        <div id="page" class="project-id-wrapper h-100 overflow-y-auto">
            <page-title title="Import"></page-title>
            <!-- Task View -->
            <div id="project-id-content" class="project-id-content position-relative " :style="{ 'width': contentWidth }">
                <div class="d-flex justify-center p-1">
                    <div class="border-gray2 shape-rounded py-1" style="min-width: 300px; max-width:400px;">
                        <bib-input type="file" ref="csvImport" @files-dropped="onFileInput" multiple="false" variant="accepted" iconLeft="upload" placeholder="Click to upload"></bib-input>
                        <div class="mx-1 mt-1 align-center">
                          <bib-button :disabled="loading" variant="secondary" label="Import CSV" @click="checkUser"></bib-button> <bib-spinner v-if="loading" :scale="2" ></bib-spinner>
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
                        <h4>Missing member from import</h4>
                        <p v-for="(mm, index) in missingMembers" :key="index"> {{index+1}}. {{mm}}</p>
                    </div>
                    <div v-show="importfinish" class="shape-rounded align-center gap-05 border-success text-success p-05">
                      <bib-icon icon="tick" variant="success"></bib-icon>
                      Import finished successfully
                    </div>
                </template>
                <template slot="footer">
                    <div v-show="!importfinish" class="justify-between">
                        <bib-button label="Skip" variant="secondary" class="mr-1" pill @click="closeModal"></bib-button>
                        <bib-button label="Continue" variant="primary" pill @click="importProject"></bib-button>
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

export default {
    name: 'Import',
    data() {
        return {
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
            importfinish: false,
            missingMembers: [],
        }
    },

    computed: {

        ...mapGetters({
            appMembers: "user/getAppMembers",
        }),

    },

    methods: {
        async onFileInput(file) {
          // console.log(file) 
        },

        closeModal(){
          this.importmodal = false
          this.missingMembers = []
          this.importfinish = false
        },

        async checkUser() {
          this.loading = true
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

              this.importmodal = true
              this.loading = false
            } else {
              this.popupMessages.push({text: "Some error occured", variant: "danger"})
              this.loading = false
            }

            this.userList = await users?.data?.data;
        },

        async importProject(){
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
            }

            console.log(res.data);

            this.missingMembers = []
            this.importfinish = true
        },

        async importSections(data) {
            console.log('Start Importing Sections')
            console.log(data)
        }

    }
}
</script>
<style lang="scss" scoped>
</style>