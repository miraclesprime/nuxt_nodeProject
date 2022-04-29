<template>
<client-only>
  <div id="proj-overview-wrapper" class="row ">
    <div id="proj-overview-inner" class="overview-wrapper my-2 mx-auto position-relative">
      <!-- <div id="proj-overview-alert" class="shape-rounded font-sm bg-danger d-flex py-05 px-1 text-white align-center">
        <bib-icon icon="warning" variant="white" class="mr-05"></bib-icon>
        You have two tasks past due! "<a href="#" class="text-white">View task</a>" or "<a href="#" class="text-white">Remind me later</a>".
        <a href="#" class="ml-auto text-white">Snooze</a>
      </div> -->
      <div id="proj-row1" class="row my-1">
        <div id="proj-row1-col1" class="col-4">
          <div id="proj-progress-wrap1" class="bg-gray3 shape-rounded text-center p-05 h-100">
            <p id="proj-progress-title1" class="text-left text-secondary">Progress</p>
            <progress-circle variant="success" :radius="55" :progress="progress" class="mx-auto mt-1"></progress-circle>
          </div>
        </div>
        <div id="proj-row1-col2" class="col-4">
          <div id="proj-progress-wrap2" class="bg-gray3 shape-rounded text-center p-05 h-100">
            <p id="proj-progress-title2" class="text-left text-secondary">Tasks</p>
            <div id="proj-progress-in" class="p-1">
              <progress-bar label="Past due" background='danger' :value="taskOverdue" :total="totalTasks.length" class="my-025"></progress-bar>
              <progress-bar label="Due soon" background='warning' :value="taskDuesoon" :total="totalTasks.length" class="my-025"></progress-bar>
              <progress-bar label="Completed" background='success' :value="taskComplete" :total="totalTasks.length" class="my-025"></progress-bar>
              <progress-bar label="In progress" :value="taskInprogress" :total="totalTasks.length" class="my-025"></progress-bar>
            </div>
          </div>
        </div>
        <div id="proj-row1-col3" class="col-4">
          <div id="proj-progress-wrap3" class="bg-gray3 shape-rounded text-center p-05 h-100">
            <!-- <bib-spinner variant="primary"></bib-spinner> -->
          </div>
        </div>
      </div>
      <!-- <div class="d-flex align-center gap-1 justify-center text-secondary font-sm" v-show="loading">
        <bib-spinner variant="primary" :scale="2"></bib-spinner> Saving changes...
      </div> -->
      <div id="proj-row2" class="row">
        <div id="proj-row2-col1" class="col-8">
          <bib-input type="text" label="Project name" placeholder="Project name" v-model="activeProject.title" v-on:keyup.native="debounceUpdate()" ></bib-input>
        </div>
        <div id="proj-row2-col2" class="col-4">
          <bib-input type="date" label="Due date" v-model="dateInput" v-on:change.native="debounceUpdate()"></bib-input>
        </div>
      </div>
      <div id="proj-row3" class="row">
        <div id="proj-row3-col1" class="col-6">
          <bib-input type="select" :options="filterUser" v-model="activeProject.userId" placeholder="Please select..." label="Owner" v-on:change.native="debounceUpdate()" ></bib-input>
          <!-- <label class="text-gray6">Owner</label> -->
          <!-- <bib-select :options="filterUser" v-model="activeProject.userId" class="mt-025"></bib-select> -->
          <!-- <bib-button test_id="po-owner-dd1" dropdown1="add" label="Type name or email" v-model="owner" v-on:input-keydown="dropdownInputKeydown" :footer="{icon: 'add', label: 'Invite via email', event: 'footer-action'}" @footer-action="inviteViaEmail" class="mt-05 mb-05">
            <template v-slot:menu>
              <ul id="cpm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
                <li :id="'cpm-field-'+index" v-for="(tm, index) in filterUser" :key="'cpm-items'+index" v-on:click="dd1ItemClick(tm)">
                  <bib-avatar size="1.5rem"></bib-avatar>
                  <span id="cpm-person-name" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
                </li>
              </ul>
            </template>
          </bib-button> -->
          <!-- <div id="project-team-members" class="d-flex">
            <email-chip v-if="activeProject.user" :email="activeProject.user.email" :text="activeProject.user.email[0]"></email-chip>
            <small v-else class="text-danger">Project owner is required</small>
          </div> -->
        </div>
        <div id="proj-row3-col2" class="col-6">
          <bib-input type="select" label="Department" :options="department" placeholder="Department" ></bib-input>
        </div>
      </div>
      <div id="proj-row4" class="row">
        <div id="proj-row4-col1" class="col-6">
          <bib-input type="select" label="Priority" v-model.number="activeProject.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate()" ></bib-input>
        </div>
        <div id="proj-row4-col2" class="col-6">
          <bib-input type="select" label="Status" v-model.number="activeProject.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate()" ></bib-input>
        </div>
      </div>
      <div id="proj-row5" class="row">
        <div id="proj-row5-col1" class="col-4">
          <label class="text-gray6">Time</label>
          <div class="shape-rounded border-gray4 my-05 p-05">Hours {{time}}</div>
          <!-- <bib-input type="time" v-model="time" placeholder="Select your time" label="Time"></bib-input> -->
        </div>
        <div id="proj-row5-col2" class="col-4">
          <bib-input type="number" icon-left="currency-dollar" v-model="activeProject.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="debounceUpdate()"></bib-input>
        </div>
        <div id="proj-row5-col3" class="col-4">
          <label class="text-gray6">Progress</label>
          <div class="shape-rounded border-gray4 my-05 p-05">{{progress}}%</div>
          <!-- <bib-input type="text" :value="progress + '%'" placeholder="Select your progress" label="Progress" disabled></bib-input> -->
        </div>
      </div>
      <div id="proj-row6" class="row">
        <div id="proj-row6-col1" class="col-12">
          <bib-input type="textarea" label="Project brief" v-model="activeProject.description" placeholder="Project brief" v-on:keyup.native="debounceUpdate()"></bib-input>
        </div>
      </div>
      <loading :loading="loading"></loading>
    </div>
  </div>
  </client-only>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'

export default {
  props: {
    tasks: Array,
    // project: Object,
  },
  data() {
    return {
      flag: false,
      // totalTasks: this.tasks.length || 1,
      owner: {},
      filterKey: "",
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
      activeProject: {},
      loading: false,
      // loading2: false,
      // time: null,
      project: {},
      // user: JSON.parse(localStorage.getItem("user"))
    };
  },

  watch: {
    project() {
      if (Object.keys(this.project).length) {
        this.activeProject = JSON.parse(JSON.stringify(this.project));
        this.owner = this.teamMembers.filter(tm=> tm.id == this.activeProject.userId)
      } else {
        this.activeProject = {
          title: "",
          dueDate: "",
          priorityId: "",
          statusId: "",
          // time: "",
          budget: 0,
          // progress: 0
          user: {},
          userId: "",
          description: "",
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
      // project: 'project/getSingleProject'
      teamMembers: "user/getTeamMembers",
      totalTasks: "task/tasksForListView"
    }),
    /*assignee() {
      let items = this.companyUsers.map(u => {
        return { id: u.id, label: u.firstName + ' ' + u.lastName, event: "item-event", img: "" }
      })
      return { items: items }
    },*/

    taskOverdue() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let over = this.totalTasks.filter(t => {
          if (t.statusId != 5 && new Date(t.dueDate) < new Date()) {
            return t
          }
        })
        return Math.round(over.length)
      }
    },
    taskDuesoon() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let due = this.totalTasks.filter(t => {
          let dd = new Date(t.dueDate).getDate();
          return (dd + 7) < new Date().getDate()
        })
        return Math.round(due.length)
      }
    },
    taskInprogress() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let prog = this.totalTasks.filter(t => t.statusId == 2)
        return Math.round(prog.length)
      }
    },
    taskComplete() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let done = this.totalTasks.filter(t => t.statusId == 5)
        return Math.round(done.length)
      }
    },
    progress() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let done = this.totalTasks.filter(t => t.statusId == 5)
        // console.log(done.length, this.totalTasks.length)
        return Math.round((done.length / this.totalTasks.length) * 100)
      }
    },
    filterUser() {
      return this.teamMembers.map((u) => {
        return { value: u.id, id: u.id, label: u.firstName + ' ' + u.lastName, firstName: u.firstName, lastName: u.lastName, email: u.email, avatar: u.avatar }
      })
    },
    dateInput: {
      get: function() {
        let nd
        if (!this.activeProject.dueDate) {
          nd = new Date()
        } else {
          nd = new Date(this.activeProject.dueDate)
        }
        let mm = (nd.getMonth() + 1) < 10 ? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1
        let dd = (nd.getDate()) < 10 ? '0' + (nd.getDate()) : nd.getDate()
        return `${nd.getFullYear()}-${mm}-${dd}`
      },
      set: function(newValue) {
        this.activeProject.dueDate = new Date(newValue)
      }
    },
    time() {
      if (this.activeProject.dueDate) {
        let diff = new Date(this.activeProject.dueDate) - new Date();
        let diffDays = Math.floor(diff / 864e5); // days
        let diffHrs = Math.floor((diff % 864e5) / 36e5); // hours
        let diffMins = Math.round(((diff % 864e5) % 36e5) / 6e4); // minutes
        let totalHrs = (diffDays * 24) + diffHrs
        return `${totalHrs}:${diffMins}`
      } else {
        return "00:00"
      }
    },
  },

  mounted() {
    if(process.client) {
      this.loading = true
      let user = JSON.parse(localStorage.getItem("user"))
      this.$store.dispatch('task/fetchTasks', {id: this.$route.params.id, filter: 'all'})
      this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        if (res) {
          this.project = res.data;
          this.loading = false
        }
      }).catch(err => {
        console.log(err);
      })
    }
  },

  methods: {
    toggleSidebar() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
    },

    dropdownInputKeydown($event) {
      // console.log('dropdown input keydown', $event)
      this.filterKey = $event
    },
    dd1ItemClick(tm) {
      console.log(tm)
      // this.owner = `${tm.label} - ${tm.email}`
      this.activeProject.user = tm
      this.activeProject.userId = tm.id
      // this.debounceUpdate()
    },
    inviteViaEmail() {
      console.log('inviteViaEmail')
    },

    statusClass(status) {
      if (status === "Past Due") return "text-red";
      if (status === "In-progress") return "text-blue";
    },

    priorityClass(priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      return "text-green";
    },
    async updateProject() {
      // console.log('from debounce function')
      this.loading = true
      let proj = await this.$axios.$put("/project", { id: this.project.id, user: this.owner[0], data: this.activeProject }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      console.log(proj.data)
      if (proj.statusCode == 200) {
        this.project = proj.data
        this.$store.dispatch("project/setSingleProject", proj.data)
      }
      this.loading = false
    },
    debounceUpdate: _.debounce(function() {
      console.log('Debounce clicked!', this.activeProject.userId)
      this.owner = this.teamMembers.filter(tm=> tm.id == this.activeProject.userId)
      this.updateProject()
    }, 1000)

  },

};

</script>
<style lang="scss" scoped>
.overview-wrapper { width: $overview-width;  }

@media screen and (max-width:1600px){
  .overview-wrapper { max-width: $overview-width - 160px; width: 60%; }
}

#proj-overview-alert {
  a { text-decoration: underline;}
}

::v-deep {
  .input--select.input--select--collapsed {
    margin: 0.5em 0 !important;
    border-color: var(--bib-gray4);
  }
}

</style>
