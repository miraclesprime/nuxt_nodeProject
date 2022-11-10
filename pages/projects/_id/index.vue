<template>
  <div id="project-id-wrapper" class="project-id-wrapper ">
    <nav id="project-id-nav" class="d-flex align-center gap-05 py-075 px-025 ">
      <button type="button" @click="$router.back()" class="d-flex cursor-pointer bg-white border-white">
        <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
      </button>
      <bib-avatar></bib-avatar>
      <span id="project-id-project-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{project ? project.title : ''}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <!-- <template v-if="project.status">
        <span id="project-id-badge-status" class="badge-status">{{project.status.text}}</span>
      </template> -->
      <div class="ml-auto d-flex gap-05 align-center position-relative" id="project-id-button-wraps">
        <div class="team-avatar-list pr-05">
          <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :key="index" size="2rem" :style="{ left: -0.5 * index + 'rem'}" class="border-gray2"></bib-avatar><span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
        </div>
        <!-- <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button> -->
        
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item1" v-tooltip="'Team'" @click="projectTeamModal = true">
          <bib-icon icon="user-group-solid" class="m-auto"></bib-icon> 
        </div> 
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item2" v-tooltip="'Conversation'">
          <bib-icon icon="comment-forum" class="m-auto"></bib-icon> 
        </div>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item3" v-tooltip="'Files'">
          <bib-icon icon="folder-solid" class="m-auto"></bib-icon> 
        </div>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item4" v-tooltip="'History'" @click="modalOpen('history', 'History')">
          <bib-icon icon="time" class="m-auto"></bib-icon> 
        </div>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-bookmark" @click="setFavorite" v-tooltip="'Favorite'">
          <bib-icon class="m-auto" :icon="isFavorite.icon" :variant="isFavorite.variant"></bib-icon>
        </div>
        <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-button pop="horizontal-dots" id="project-id-horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="project-id-list">
                <span class="list__item" id="project-id-list-item1" @click="modalOpen('overview', 'Overview')">View details</span>
                <!-- <hr id="project-id-hr"> -->
                <span class="list__item" id="project-id-list-item2" @click="setFavorite">
                  <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="user-group-solid" class="mr-075"></bib-icon> Team
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="comment-forum" class="mr-075"></bib-icon> Conversation
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="folder-solid" class="mr-075"></bib-icon> Files
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="group" class="mr-075"></bib-icon> Subtasks
                </span>
                <!-- <span class="list__item" id="project-id-list-item4" @click="renameModal = !renameModal">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span> -->
                <!-- <div class="mt-1" id="project-id-div"></div> -->
                <span class="list__item" id="project-id-list-item5" @click="reportModal = !reportModal">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr id="project-id-hr2">
                <span v-if="cdp" class="list__item list__item__danger" id="project-id-list-item6" @click="deleteProject(project)">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
        <loading :loading="favLoading"></loading>
      </div>
    </nav>
    <!-- <div class="menu " id='project-id-menu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="PROJECT_TABS" />
    </div> -->
    <div id="project-id-tab-content" class="project-id-tab-content position-relative h-100 of-scroll-y">
      <!-- <project-overview v-if="activeTab.value == PROJECT_TAB_TITLES.overview" :fields="TABLE_FIELDS" :tasks="projectTasks" :currentProject="project"></project-overview> -->
      <task-view v-if="activeTab.value == PROJECT_TAB_TITLES.tasks" :fields="taskFields" :tasks="projectTasks" :sections="projectSections" :gridType="gridType"></task-view>
      <project-conversation v-if="activeTab.value == PROJECT_TAB_TITLES.conversations" :fields="TABLE_FIELDS" :tasks="projectTasks"></project-conversation>
      <!-- <task-timeline-view v-if="activeTab.value == PROJECT_TAB_TITLES.timeline" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-calendar-view v-if="activeTab.value == PROJECT_TAB_TITLES.calendar" :fields="TABLE_FIELDS" :tasks="tasks" /> -->
      <!-- <task-team v-if="activeTab.value == PROJECT_TAB_TITLES.team"></task-team> -->
      <project-files v-if="activeTab.value == PROJECT_TAB_TITLES.files"></project-files>
      <!-- <project-history v-if="activeTab.value == PROJECT_TAB_TITLES.history"></project-history> -->
    </div>

    <!-- project modals -->
    <bib-modal-wrapper v-if="projectModal" :title="projectModalTitle" size="xl" @close="projectModal = false">
      <!-- <template slot="header">
        <bib-icon variant="gray5" class="cursor-pointer" :scale="1.2" icon="comment-forum"></bib-icon>
        <bib-icon variant="gray5" class="cursor-pointer ml-05" :scale="1.2" icon="attachment"></bib-icon>
        <bib-icon variant="gray5" class="cursor-pointer ml-05" :scale="1.2" icon="share-arrow"></bib-icon>
        <bib-icon variant="gray5" class="cursor-pointer ml-05" :scale="1.2" icon="trash"></bib-icon>
      </template> -->
      <template slot="content">
        <project-overview v-if="projectModalContent == 'overview'" :fields="TABLE_FIELDS" :tasks="projectTasks" :currentProject="project"></project-overview>
        <!-- <div class="height-1"></div> -->
        <project-history v-if="projectModalContent == 'history'" ></project-history>
      </template>
    </bib-modal-wrapper>

    <!-- project team -->
    <bib-modal-wrapper v-if="projectTeamModal" title="Team" size="lg" @close="projectTeamModal = false">
      <template slot="content">
        <task-team ></task-team>
      </template>
    </bib-modal-wrapper>

    <!-- project rename modal -->
    <!-- <bib-modal-wrapper v-if="renameModal" title="Rename project" @close="renameModal = false">
      <template slot="content">
        <div>
          <bib-input type="text" v-model.trim="projectName" placeholder="Enter name..."></bib-input>
          <loading :loading="loading"></loading>
        </div>
      </template>
      <template slot="footer">
        <div class="d-flex justify-between">
          <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
          <bib-button label="Rename" variant="success" pill v-on:click="renameProject"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper> -->
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
    <!-- notification -->
    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { TABLE_FIELDS, PROJECT_TABS, PROJECT_DEFAULT_TAB, PROJECT_TAB_TITLES } from "config/constants";
// import axios from 'axios';

export default {
  name: 'ProjectId',
  /*middleware({ app, store, redirect, route }) {
    // console.log(route)
    const token = app.$cookies.get('b_ssojwt')
    axios.get(`http://localhost:9000/project/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      console.log(res.data)
      if (res.data.statusCode == 200) {
        // alert("found")
      } else {
        redirect("/notfound")
      }
    })
  },*/
  data() {
    return {
      projectModal: false,
      projectModalTitle: '',
      projectModalContent: '',
      projectTeamModal: false,
      activeTab: PROJECT_DEFAULT_TAB,
      PROJECT_TABS,
      PROJECT_TAB_TITLES,
      TABLE_FIELDS,
      gridType: "list",
      renameModal: false,
      projectTitle: "",
      reportModal: false,
      reportText: "",
      reportSubj: "",
      loading: false,
      favLoading: false,
      popupMessages: [],
      cdp: false
    }
  },

  /*async validate({ params, query, store, redirect }) {
    const res = await axios.get(`http://localhost:9000/project/${params.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
      if (res) {
        // console.log(res)
        if(!res.data.data || res.data.data.isDeleted){
          // this.$router.push("/notfound")
          return redirect("/notfound")
        } else {
          store.dispatch('project/setSingleProject', res.data.data)

          return true // if the params are valid
        }
      } else {
        return redirect("/notfound")
      }

    // return false // will stop Nuxt to render the route and display the error page
  },*/

  /*async fetch({ app, params, query, store, redirect }) {
    // await operations
    const token = app.$cookies.get('b_ssojwt')
    const res = await axios.get(`http://localhost:9000/project/${params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      if (res) {
        // console.log(res)
        if(!res.data.data || res.data.data.isDeleted){
          redirect("/notfound")
        } else {
          store.dispatch('project/setSingleProject', res.data.data)
          
        }
      } else {
        redirect("/notfound")
      }
  },*/

  computed: {
    ...mapGetters({
      token: 'token/getToken',
      allusers: "user/getTeamMembers",
      project: 'project/getSingleProject',
      team: "project/getProjectMembers",
      projectSections: 'section/getProjectSections',
      projectTasks: "task/tasksForListView",
      taskFields: "task/tableFields",
      favProjects: "project/getFavProjects",
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
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    teammates() {
      let tm = { main: [], extra: [] }
      this.allusers.filter(u => {
        this.team.forEach((t, index) => {
          if (t.id == u.id && index < 4) {
            tm.main.push(u)
          } else if (t.id == u.id) {
            tm.extra.push(u)
          }
        })
      })
      return tm
    }
  },

  created() {
    this.$nuxt.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$nuxt.$on("set-active-task", (task) => {
      this.activeTask = task;
    });

    if (process.client) {
      // console.log(this.$route.params.id)
      // this.validating = true
      this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        // console.log(res.data)
        if (res) {
          if (!res.data || res.data.isDeleted) {
            this.$router.push("/notfound")
          } else {
            this.$store.dispatch('project/setSingleProject', res.data)
            this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' })
            this.$store.dispatch("task/fetchTasks", { id: this.$route.params.id, filter: 'all' })
            this.$store.dispatch("project/fetchTeamMember", { projectId: this.$route.params.id })
            this.validating = false
          }
        } else {
          this.$router.push("/notfound")
        }
      }).catch(err => {
        console.log("There was an issue in project API", err);
        this.validating = false
      })

    }

  },
  mounted() {
    // console.log(this.$route.params.id)
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' })
    this.$store.dispatch("task/fetchTasks", { id: this.$route.params.id, filter: 'all' })
    this.$store.dispatch("project/fetchTeamMember", { projectId: this.$route.params.id }).then(() => {
      this.canDeleteProject();
    })
  },

  /*beforeRouteEnter (to, from, next){
    if (process.client) {

    console.log(to.params)

    const token = localStorage.getItem('accessToken')
    
    axios.get(`http://localhost:9000/project/${to.params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((res) => {
        console.log(res.data)
          if (res.data.statusCode == 200) {
            if (res.data.data.isDeleted) {
              next("/projects/noproject")
            } else {
              next()
            }
          }
      }).catch(err => {
        alert( JSON.stringify(err) )
        // console.log("There was an error in project", err);
      })
    }
  },*/

  /*beforeRouteUpdate(to, from, next){
    console.log(to, from)
    next("/projects/noproject")
  },*/

  /*beforeResolve (to, from, next) {
    if (this.$store.getters.isLoggedIn) {
      next('/projects/noproject')
    } else {
      next();
    }
  },*/

  methods: {

    modalOpen(content, title){
      this.projectModal = true
      this.projectModalTitle = title
      this.projectModalContent = content
    },

    async fetchProject() {
      const proj = await this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      })
      if (proj) {
        // console.log(proj)
        this.$store.dispatch('project/setSingleProject', proj.data)
      }
      const sec = await this.$axios.$get(`section/project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (sec) {
        // console.log(sec)
        this.sections = sec.data
      }
    },
    tabChange(value) {
      this.activeTab = value;
    },
    setFavorite() {
      this.favLoading = true
      if (this.isFavorite.status) {
        this.$store.dispatch("project/removeFromFavorite", { id: this.$route.params.id })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "orange" })

            // alert(msg)
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      } else {
        this.$store.dispatch("project/addToFavorite", { id: this.$route.params.id })
          .then(msg => {
            this.popupMessages.push({ text: msg, variant: "success" })

            // alert(msg)
          })
          .catch(e => console.log(e))
          .then(() => this.favLoading = false)
      }
      // this.favLoading = false
    },
    async renameProject() {
      this.loading = true
      const proj = await this.$axios.put("/project", {
        id: this.project.id,
        data: {
          title: this.projectTitle
        },
        user: this.project.user
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      // console.log(proj)
      if (proj.data.statusCode == 200) {
        this.$store.dispatch("project/setSingleProject", proj.data.data)
        this.renameModal = false
      }
      this.loading = false
    },
    deleteProject(project) {
      this.loading = true
      this.$store.dispatch("project/deleteProject", project).then(p => {

        if (p.statusCode == 200) {
          // this.popupMessages.push({ text: p.message, variant: "success" })
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
      console.log(this.project.userId, JSON.parse(localStorage.getItem('user')).sub)
      //  console.log(JSON.parse(localStorage.getItem('user')).subr)
      if (this.project.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN' ) {
        this.cdp = true
        return true;
      }
      this.cdp = false
      return false
    },

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
