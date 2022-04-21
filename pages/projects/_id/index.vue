<template>
  <div id="project-id-wrapper" class="project-id-wrapper ">
    <nav id="project-id-nav" class="d-flex align-center gap-05 py-075 px-025">
      <nuxt-link to="/projects" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
      </nuxt-link>
      <bib-avatar></bib-avatar>
      <span id="project-id-project-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{project ? project.title : ''}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <span id="project-id-badge-status" class="badge-status">{{project.status ? project.status.text : ''}}</span>
      <div class="ml-auto d-flex gap-05 align-center" id="project-id-button-wraps">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-bookmark">
          <bib-icon icon="bookmark" class="m-auto"></bib-icon>
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
                <span class="list__item danger" id="project-id-list-item6">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
      </div>
    </nav>
    <div class="menu " id='project-idmenu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="TABS" />
    </div>
    <div id="project-id-tab-content" class="project-id-tab-content position-relative of-scroll-y">
      <project-overview v-if="activeTab.value == TAB_TITLES.overview" :fields="TABLE_FIELDS" :tasks="projectTasks" :currentProject="project" />
      <task-view v-if="activeTab.value == TAB_TITLES.tasks" :fields="taskFields" :tasks="projectTasks" :sections="projectSections" :gridType="gridType" />
      <task-conversations v-if="activeTab.value == TAB_TITLES.conversations" :fields="TABLE_FIELDS" :tasks="projectTasks" />
      <!-- <task-timeline-view v-if="activeTab.value == TAB_TITLES.timeline" :fields="TABLE_FIELDS" :tasks="tasks" />
      <task-calendar-view v-if="activeTab.value == TAB_TITLES.calendar" :fields="TABLE_FIELDS" :tasks="tasks" /> -->
      <task-team v-if="activeTab.value == TAB_TITLES.team" :fields="TABLE_FIELDS" :tasks="projectTasks" />
      <task-files v-if="activeTab.value == TAB_TITLES.files" :fields="TABLE_FIELDS" :tasks="projectTasks" />
    </div>
    <!-- rename modal -->
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
        <bib-input type="text" label="Subject" v-model.trim="reportSubj" placeholder="enter subject" ></bib-input>
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
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";

export default {
  name: 'ProjectId',
  data() {
    return {
      activeTab: DEFAULT_TAB,
      TABS,
      TAB_TITLES,
      TABLE_FIELDS,
      gridType: "list",
      renameModal: false,
      projectTitle: "",
      reportModal: false,
      reportText: "",
      reportSubj: "",
      loading: false,
    }
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
      project: 'project/getSingleProject',
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
        return { icon: "heart-like-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "heart-like", variant: "gray5", text: "Add to favorites", status: false }
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

    if (process.client) {

      this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        if (res) {
          this.$store.dispatch('project/setSingleProject', res.data)
        }
      }).catch(err => {
        console.log("There was some issue in project API " + err);
      })

    }

  },
  mounted() {
    this.$store.dispatch("section/fetchProjectSections", this.$route.params.id);
    this.$store.dispatch("task/fetchTasks", { id: this.$route.params.id, filter: 'all' });
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
      if (this.isFavorite.status) {
        this.$store.dispatch("project/removeFromFavorite", { id: this.$route.params.id })
          .then(msg => alert(msg))
          .catch(e => console.log(e))
      } else {
        this.$store.dispatch("project/addToFavorite", { id: this.$route.params.id })
          .then(msg => alert(msg))
          .catch(e => console.log(e))
      }
    },
    async renameProject() {
      this.loading = true
      const proj = await this.$axios.put("/project", {
        id: this.project.id,
        data: {
          title: this.projectTitle
        }
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
    async submitReport() {
      // this.reportModal = !this.reportModal
      /*const emai = await this.$axios.post(process.env.EMAIl_API_URL, {
        from: "noreply@biztree.com",
        to: "receiver@receiving.com",
        subject: "email subject",
        html: "<p>html string</p> "
      })
      console.log(emai)*/
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
#project-id-nav { border-bottom: 1px solid var(--bib-light);}

.shape-circle {
  .menu {
    margin-left: auto;
    margin-right: auto
  }
}

</style>
