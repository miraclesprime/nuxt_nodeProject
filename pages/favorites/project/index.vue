<template>
  <client-only>
    <div id="page" class="project-id-wrapper ">
      <nav id="project-id-nav" class="d-flex align-center gap-05 py-075 px-025 ">
        <bib-avatar></bib-avatar>
        <span id="project-id-project-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{project ? project.title : ''}}</span>
        <div class="ml-auto d-flex gap-05 align-center position-relative" id="project-id-button-wraps">
          <team-avatar-list :team="team"></team-avatar-list>

          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item1" @click="projectTeamModal = true" v-tooltip="'Team'">
            <bib-icon icon="user-group-solid" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item2" @click="conversationModal = true" v-tooltip="'Conversations'">
            <bib-icon icon="comment-forum-solid" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item3" @click="modalOpen('files', 'Files')" v-tooltip="'Files'">
            <bib-icon icon="folder-solid" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-bookmark" @click="setFavorite" v-tooltip="'Bookmark'">
            <bib-icon class="m-auto" icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
          </div>
          <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            
          </div>
          <loading :loading="favLoading"></loading>
        </div>
      </nav>

      <task-actions :gridType="gridType" @change-grid-type="changeGridType" @create-task="openSidebar" @add-section="toggleNewsection"></task-actions>

      <!-- Task View -->
      <div id="project-id-content" class="project-id-content bg-light position-relative " :style="{ 'width': contentWidth }">
        <template v-if="gridType == 'list'">
          
          <adv-table-three
          :tableFields="tableFields"
          :tableData="localdata"
          :contextItems="contextMenuItems"
          @row-click="openSidebar"
          @title-click="openSidebar"
          @context-item-event="contextItemClick"
          :plusButton="plusButton"
          :newRow="newRow"
          @create-row="createRow"
          :showNewsection="newSection"
          @toggle-newsection="toggleNewsection"
          @create-section="() => alert($event)"
          @edit-section="editSection"
        ></adv-table-three>
        </template>
        <div v-else>
          <h3>Grid view</h3>
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
import { DEMO_TASK, TASK_CONTEXT_MENU } from "config/constants";
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  // name: 'ProjectTask',
  data() {
    return {
      tableFields: DEMO_TASK,
      // projectModal: false,
      localdata: [],
      contextMenuItems: TASK_CONTEXT_MENU,
      conversationModal: false,
      value: {
        files: []
      },
      editMessage: {},
      // projectModalTitle: '',
      // projectModalContent: '',
      projectTeamModal: false,
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
      plusButton: {
        show: true,
        label: "New Task",
        icon: "add",
      },
      newRow: {
        id: "",
        sectionId: "",
        title: "",
        userId: "",
        statusId: null,
        priorityId: null,
        startDate: "",
        dueDate: "",
        departmentId: null,
        description: "",
        budget: "",
        text: "",
      },
      contentWidth: "100%",
      newSection: false,
      gridType: "list",
    }
  },

  watch: {
    sidebar(newVal){
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
    }
  },

  computed: {

    ...mapGetters({
        project: 'project/getSingleProject',
        projects: 'project/getAllProjects',
        team: "project/getProjectMembers",
        sections: "section/getProjectSections",
        projectTasks: "task/tasksForListView",
        taskFields: "task/tableFields",
        favProjects: "project/getFavProjects",
        user2: "user/getUser2",
        sidebar: "task/getSidebarVisible",
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
      let fav = this.favProjects.some(t => t.id == this.project.id)
      if (fav) {
        return { variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { variant: "gray5", text: "Add to favorites", status: false }
      }
    },

  },

  created() {

    this.$nuxt.$on("set-active-task", (task) => {
      this.activeTask = task;
    });

    this.$nuxt.$on("edit-message", (msg) => {
      this.editMessage = msg
    })

  },
  mounted() {
    if (process.client) {
      // this.$store.dispatch("section/fetchProjectSections", { projectId: 1, filter: 'all' })
      this.$store.dispatch("section/fetchProjectSections", {
        projectId: 1,
        filter: "all",
      })
      .then((res) => {
        // console.log(res)
        this.localdata = JSON.parse(JSON.stringify(this.sections));

        let sorted = this.localdata.map((s) => {
          let t = s.tasks.sort((a, b) => a.order - b.order);
          s.tasks = t;
          return s;
        });
        // console.log("sorted =>", sorted)
        this.localdata = sorted;
        this.templateKey += 1;
        this.loading = false;
      })
      .catch((e) => console.log(e));

      this.$store.dispatch("task/fetchTasks", { id: 1, filter: 'all' })
      this.$store.dispatch("project/fetchTeamMember", { projectId: 1 }).then(() => {
        this.canDeleteProject();
      })

    }
  },

  beforeDestroy(){
    console.info("before destroy hook");
    // this.$store.dispatch('project/setSingleProject', {})
  },

  methods: {
    changeGridType(type){
      this.gridType = type
    },
    toggleNewsection(flag) {
      // console.log(flag)
      this.newSection = flag ? false : true

    },
    openSidebar(task) {
      // console.log(task)
      let fwd = this.$donotCloseSidebar(event.target.classList);
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false;
      }

      let project = [
        {
          projectId: this.project?.id,
          project: {
            id: this.project?.id,
          },
        },
      ];
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });
    },
    contextItemClick(event, activeItem){
      console.log(...arguments)
    },
    createRow($event){
      console.log($event)
    },
    editSection($event){
      console.log($event)
    },
    modalOpen(content, title) {
      // this.projectModal = true
      // this.projectModalTitle = title
      // this.projectModalContent = content
    },

    setFavorite() {
      this.favLoading = true
      if (this.isFavorite.status) {
        this.$store.dispatch("project/removeFromFavorite", { id: 1 })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "orange" })
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      } else {
        this.$store.dispatch("project/addToFavorite", { id: 1 })
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
      if (this.project?.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN' ) {
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

#project-id-nav {
  border-bottom: 1px solid var(--bib-light);
}
.project-id-content { height: calc(100% - 110px); }
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
