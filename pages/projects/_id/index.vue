<template>
  <client-only>
    <div id="page" class="project-id-wrapper ">
      <nav id="project-id-nav" class="d-flex align-center gap-05 py-075 px-025 "> 
        <button type="button" @click="$router.push('/projects')" class="d-flex cursor-pointer bg-white border-white">
          <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
        </button>
        <bib-avatar></bib-avatar>
        <span id="project-id-project-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{project ? project.title : ''}}</span>
        <div class="ml-auto d-flex gap-05 align-center position-relative" id="project-id-button-wraps">
          <team-avatar-list :team="team"></team-avatar-list>

          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item1" @click="projectTeamModal = true" v-tooltip="'Team'">
            <bib-icon icon="user-group-solid" variant="gray5" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item2" @click="conversationModal = true" v-tooltip="'Conversations'">
            <bib-icon icon="comment-forum-solid" variant="gray5" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item3" @click="modalOpen('files', 'Files')" v-tooltip="'Files'">
            <bib-icon icon="folder-solid" variant="gray5" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-bookmark" @click="setFavorite" v-tooltip="'Bookmark'">
            <bib-spinner v-if="favLoading" :scale="2" ></bib-spinner>
            <bib-icon v-else class="m-auto" icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
          </div>
          <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            <bib-popup pop="horizontal-dots" id="project-id-horizontal-dots">
              <template v-slot:menu>
                <div class="list" id="project-id-list">
                  <span class="list__item" id="project-id-list-item1" @click="modalOpen('overview', 'Overview')">View details</span>
                  <span class="list__item" id="project-id-list-item2" @click="setFavorite">
                    <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                  </span>
                  <span class="list__item" id="project-id-list-item3">
                    <bib-icon icon="user-group-solid" class="mr-075"></bib-icon> Team
                  </span>
                  <span class="list__item" id="project-id-list-item3" @click="conversationModal = true">
                    <bib-icon icon="comment-forum-solid" class="mr-075"></bib-icon> Conversation
                  </span>
                  <span class="list__item" id="project-id-list-item3" @click="modalOpen('files', 'Files')">
                    <bib-icon icon="folder-solid" class="mr-075"></bib-icon> Files
                  </span>
                  <span class="list__item" id="project-id-list-item3" @click="copyProjectLink">
                    <bib-icon icon="duplicate" class="mr-075"></bib-icon> Copy Link
                  </span>
                  <span class="list__item" id="project-id-list-item5" @click="reportModal = !reportModal">
                    <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                  </span>
                  <hr id="project-id-hr2">
                  <span v-if="cdp" class="list__item list__item__danger" id="project-id-list-item6" @click="deleteProject(project)">Delete </span>
                </div>
              </template>
            </bib-popup>
          </div>
        </div>
      </nav>

      <!-- Task View -->
      <!-- <div id="project-id-content" class="project-id-content bg-light position-relative h-100 ">
      </div> -->
      
      <task-view :fields="taskFields" :tasks="projectTasks" :sections="projectSections" :gridType="gridType"></task-view>

      <!-- project modals -->
      <bib-modal-wrapper v-if="projectModal" :title="projectModalTitle" size="xl" @close="projectModal = false">
        <template slot="content">
          <project-overview v-if="projectModalContent == 'overview'" :sections="projectSections" ></project-overview>
          <project-files v-if="projectModalContent == 'files'"></project-files>
        </template>
      </bib-modal-wrapper>

      <!-- conversation modal -->
      <bib-modal-wrapper v-if="conversationModal" title="Conversation" size="xl" @close="conversationModal = false" >
        <template slot="content">
          <project-conversation :project="project"></project-conversation>
        </template>
        <template slot="footer">
          <div class="message-input-wrapper d-flex gap-1">
            <bib-avatar :src="user2.Photo" size="2rem" class="flex-shrink-0" ></bib-avatar>
            <message-input class="flex-grow-1" :value="value" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
          </div>
        </template>
      </bib-modal-wrapper>

      <!-- project team -->
      <bib-modal-wrapper v-if="projectTeamModal" title="Team" size="lg" @close="projectTeamModal = false">
        <template slot="content">
          <div style="min-height: 12rem;">
            <project-team-modal></project-team-modal>
          </div>
        </template>
      </bib-modal-wrapper>

      <!-- report modal -->
      <bib-modal-wrapper v-if="reportModal" title="Report" size="sm" @close="reportModal = false">
        <template slot="content">
          <bib-input type="text" label="Subject" v-model.trim="reportSubj" placeholder="enter subject"></bib-input>
          <bib-input type="textarea" label="Message" v-model.trim="reportText" placeholder="enter text"></bib-input>
          <loading :loading="loading"></loading>
        </template>
        <template slot="footer">
          <div class="text-center d-flex justify-between">
            <bib-button label="Cancel" variant="light" pill v-on:click="reportModal = false"></bib-button>
            <bib-button label="Send" variant="success" pill v-on:click="submitReport"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>
      <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>

      <!-- notification -->
      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" autohide="3500">
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { TABLE_FIELDS } from "config/constants";
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: 'ProjectId',
  data() {
    return {
      projectModal: false,
      conversationModal: false,
      value: {
        files: []
      },
      editMessage: {},
      projectModalTitle: '',
      projectModalContent: '',
      projectTeamModal: false,      
      gridType: "list",
      renameModal: false,
      projectTitle: "",
      reportModal: false,
      reportText: "",
      reportSubj: "",
      loading: false,
      favLoading: false,
      popupMessages: [],
      alertDialog: false,
      alertMsg:"",
      cdp: false,
      project: {}
    }
  },

  computed: {

    ...mapGetters({
        projects: 'project/getAllProjects',
        team: "project/getProjectMembers",
        projectSections: 'section/getProjectSections',
        projectTasks: "task/tasksForListView",
        taskFields: "task/tableFields",
        favProjects: "project/getFavProjects",
        user2: "user/getUser2",
    }),

    projectName: {
      get() {
        return this.project.title
      },
      set(value) {
        this.projectTitle = value
      }
    },

    isFavorite() {
      let fav = this.favProjects.some(t => t.id == this.project?.id)
      if (fav) {
        return { variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { variant: "gray5", text: "Add to favorites", status: false }
      }
    },

  },

  created() {
    this.$nuxt.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$nuxt.$on("set-active-task", (task) => {
      this.activeTask = task;
    });

    this.$nuxt.$on("edit-message", (msg) => {
      this.editMessage = msg
    })

  },

  asyncData(context) {
    const token = context.$cookies.get('b_ssojwt')
    return context.$axios.$get(`project/${context.params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((res) => {
        if (res) {
            if (!res.data || res.data.isDeleted) {
              context.store.$router.push("/notfound")
            } else {
              context.store.dispatch('project/setProject', res.data)
              return {project: res.data, validating: false}
            }
        } else {
           context.store.$router.push("/notfound")
        }
      }).catch(err => {
        console.log("There was an issue in project API", err);
        return {validating: false}
      })

  },

  mounted() {
    if (process.client) {

      // let p = JSON.parse(JSON.stringify(this.project))
      // if(Object.keys(p).length != 0) {

        // this.$store.dispatch('project/fetchProjects').then((res) => {
        //   let proj = res.find((p) => {
        //     if(p.id == this.$route.params.id) {
        //       return p;
        //     } 
        //   })

        //   if((proj && JSON.parse(localStorage.getItem('user')).subr == 'USER') || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        //       console.log('user has access!')
        //   } else {
        //       this.alertDialog = true
        //       this.alertMsg = "You do not have access to this page!"
        //       setTimeout(function() {
        //         this.$router.push('/projects')      
        //       }.bind(this),200)
        //   }

        // });
      // } else {
      //   this.$router.push('/notfound')
      // }

      this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' })
      this.$store.dispatch("task/fetchTasks", { id: this.$route.params.id, filter: 'all' })
    }
  },

  beforeDestroy(){
    // console.info("before destroy hook");
    this.$store.dispatch('project/setSingleProject', {})
  },

  methods: {

    modalOpen(content, title) {
      this.projectModal = true
      this.projectModalTitle = title
      this.projectModalContent = content
    },

    setFavorite() {
      this.favLoading = true
      if (this.isFavorite.status) {
        this.$store.dispatch("project/removeFromFavorite", { id: this.$route.params.id })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "orange" })
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      } else {
        this.$store.dispatch("project/addToFavorite", { id: this.$route.params.id })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "success" })
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      }
    },

    deleteProject(project) {
      this.loading = true
      this.$store.dispatch("project/deleteProject", project).then(p => {

        if (p.statusCode == 200) {
          this.$router.push('/projects')
        } else {
          this.popupMessages.push({ text: p.message, variant: "warning" })
          console.warn(p.message);
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.popupMessages.push({ text: e, variant: "danger" })
        console.log(e)
      })
    },

    canDeleteProject() {
      if (this.project.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN' ) {
        this.cdp = true
        return true;
      }
      this.cdp = false
      return false
    },

    onFileInput(payload) {
      this.value.files = payload.files
    },

    copyProjectLink() {
        let url = window.location.href;

        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    },

    onsubmit(data) {
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
    },
    async uploadFile(commentFiles, data){
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
    }

  }
}

</script>
<style lang="scss" scoped>
.project-id-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-id-content {

}

#project-id-nav {
  border-bottom: 1px solid var(--bib-light);
}

.shape-circle {
  .menu {
    margin-left: auto;
    margin-right: auto
  }
}

.team-avatar-list {
  position: relative;

  .avatar:hover {
    z-index: 11
  }

  .extra {
    margin-left: 0.75rem;
    color: $secondary;
  }
}

</style>
