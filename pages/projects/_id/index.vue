<template>
  <div id="project-id-wrapper" class="project-id-wrapper ">
    <nav id="project-id-nav" class="d-flex align-center gap-05 py-075 px-025 ">
      <nuxt-link to="/projects" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
      </nuxt-link>
        <bib-avatar></bib-avatar>
      <span id="project-id-project-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{project ? project.title : ''}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <template v-if="project.status">
        <span id="project-id-badge-status" class="badge-status">{{project.status.text}}</span>
      </template>
      <div class="ml-auto d-flex gap-05 align-center position-relative" id="project-id-button-wraps">
        <div class="team-avatar-list pr-05">
          <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :style="{ left: -0.5 * index + 'rem'}" class="border-gray2" :key="index"></bib-avatar><span v-show="teammates.extra.length" class="extra">+{{teammates.extra.length}}</span>
        </div>
        <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-bookmark" @click="setFavorite">
          <bib-icon class="m-auto" :icon="isFavorite.icon" :variant="isFavorite.variant"></bib-icon>
        </div>
        <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-button pop="horizontal-dots" id="project-id-horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="project-id-list">
                <!-- <span class="list__item" id="project-id-list-item1">Show project details</span> -->
                <!-- <hr id="project-id-hr"> -->
                <span class="list__item" id="project-id-list-item2" @click="setFavorite">
                  <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="user-add" class="mr-075"></bib-icon> Share with
                </span>
                <span class="list__item" id="project-id-list-item4" @click="renameModal = !renameModal">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span>
                <div class="mt-1" id="project-id-div"></div>
                <span class="list__item" id="project-id-list-item5" @click="reportModal = !reportModal">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr id="project-id-hr2">
                <span class="list__item danger" id="project-id-list-item6" @click="deleteProject(project)">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
        <loading :loading="favLoading"></loading>
      </div>
    </nav>
    <div class="menu " id='project-id-menu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="PROJECT_TABS" />
    </div>
    <div id="project-id-tab-content" class="project-id-tab-content position-relative h-100 of-scroll-y">
      <project-overview v-if="activeTab.value == PROJECT_TAB_TITLES.overview" :fields="TABLE_FIELDS" :tasks="projectTasks" :currentProject="project"></project-overview>
      <task-view v-if="activeTab.value == PROJECT_TAB_TITLES.tasks" :fields="taskFields" :tasks="projectTasks" :sections="projectSections" :gridType="gridType"></task-view>
      <project-conversation v-if="activeTab.value == PROJECT_TAB_TITLES.conversations" :fields="TABLE_FIELDS" :tasks="projectTasks"></project-conversation>
      <!-- <task-timeline-view v-if="activeTab.value == PROJECT_TAB_TITLES.timeline" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-calendar-view v-if="activeTab.value == PROJECT_TAB_TITLES.calendar" :fields="TABLE_FIELDS" :tasks="tasks" /> -->
      <task-team v-if="activeTab.value == PROJECT_TAB_TITLES.team" ></task-team>
      <project-files v-if="activeTab.value == PROJECT_TAB_TITLES.files" ></project-files>
      <project-history v-if="activeTab.value == PROJECT_TAB_TITLES.history" ></project-history>
    </div>
    <!-- project rename modal -->
    <bib-modal-wrapper v-if="renameModal" title="Rename project" @close="renameModal = false">
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

export default {
  name: 'ProjectId',
  data() {
    return {
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
    }
  },

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
    teammates(){
      let tm = { main: [], extra: [] }
      this.allusers.filter(u => {
        this.team.forEach((t, index) => {
          if (t.id == u.id && index < 4) {
            tm.main.push(u)
          } else if(t.id == u.id) {
            tm.extra.push(u)
          }
        })
      })
      /*this.allusers.filter(u => {
        this.team.forEach(t => {
          if (t.id == u.id) {
            tm.push(u)
          }
        })
      })*/
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
      this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        if (res) {
          this.$store.dispatch('project/setSingleProject', res.data)
        }
      }).catch(err => {
        console.log("There was an issue in project API", err);
      })

    }

  },
  mounted() {
    // console.log(this.$route.params.id)
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' })
    this.$store.dispatch("task/fetchTasks", { id: this.$route.params.id, filter: 'all' })
    this.$store.dispatch("project/fetchTeamMember", { projectId: this.$route.params.id })
  },

  methods: {
    
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
            this.popupMessages.push({ text: msg, variant: "success"})

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
  .extra { margin-left: 0.75rem; color: $secondary; }
}

</style>
