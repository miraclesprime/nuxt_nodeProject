<template>
  <div id="task-overview-wrapper" class="row">
    <div id="task-overview-inner" class="col-6 my-2 mx-auto position-relative">
      <div id="to-row1" class="row my-1">
        <div id="to-row1-col1" class="col-4">
          <div class="bg-gray3 shape-rounded text-center p-05 h-100">
            <p class="text-left text-secondary">Progress</p>
            <progress-circle variant="success" radius="55" :progress="progress" class="mx-auto mt-1"></progress-circle>
          </div>
        </div>
        <div id="to-row1-col2" class="col-4">
          <div class="bg-gray3 shape-rounded text-center p-05 h-100">
            <p class="text-left text-secondary">Tasks</p>
            <div class="p-1">
              <progress-bar label="Past due" background='danger' :value="taskOverdue" :total="totalTasks" class="my-025"></progress-bar>
              <progress-bar label="Due soon" background='warning' :value="taskDuesoon" :total="totalTasks" class="my-025"></progress-bar>
              <progress-bar label="Completed" background='success' :value="taskComplete" :total="totalTasks" class="my-025"></progress-bar>
              <progress-bar label="In progress" :value="taskInprogress" class="my-025"></progress-bar>
            </div>
          </div>
        </div>
        <div id="to-row1-col3" class="col-4">
          <div class="bg-gray3 shape-rounded text-center p-05 h-100">
            <!-- <bib-spinner variant="primary"></bib-spinner> -->
          </div>
        </div>
      </div>
      <div class="d-flex align-center gap-1 justify-center text-secondary font-sm" v-show="loading">
        <bib-spinner variant="primary" :scale="2"></bib-spinner> Saving changes...
      </div>
      <div id="to-row2" class="row">
        <div id="to-row2-col1" class="col-8">
          <bib-input type="text" label="Project name" placeholder="Project name" v-model="activeProject.title" v-on:keyup.native="debounceUpdate()"></bib-input>
        </div>
        <div id="to-row2-col2" class="col-4">
          <bib-input type="date" label="Due date" v-model="activeProject.dueDate" v-on:keyup.native="debounceUpdate()"></bib-input>
        </div>
      </div>
      <div id="to-row3" class="row">
        <div id="to-row3-col1" class="col-6">
          <!-- <bib-input type="text" label="Owner" placeholder="Owner" v-model="form.owner"></bib-input> -->
          <label class="text-gray6">Owner</label>
          <div class="shape-rounded border-gray4 my-05 p-05">
            {{project.user ? project.user.firstName : ''}} {{project.user ? project.user.lastName : ''}}
            <!-- <user-info :user="project.user ? project.user : ''" avatar="https://i.pravatar.cc/32"></user-info> -->
          </div>
        </div>
        <div id="to-row3-col2" class="col-6">
          <bib-input type="select" label="Department" :options="department" placeholder="Department"></bib-input>
        </div>
      </div>
      <div id="to-row4" class="row">
        <div id="to-row4-col1" class="col-6">
          <bib-input type="select" label="Priority" v-model.number="activeProject.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
        </div>
        <div id="to-row4-col2" class="col-6">
          <bib-input type="select" label="Status" v-model.number="activeProject.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
        </div>
      </div>
      <div id="to-row5" class="row">
        <div id="to-row5-col1" class="col-4">
          <bib-input type="time" v-model="activeProject.time" placeholder="Select your time" label="Time" disabled></bib-input>
        </div>
        <div id="to-row5-col2" class="col-4">
          <bib-input type="number" icon-left="currency-dollar" v-model="activeProject.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="debounceUpdate()"></bib-input>
        </div>
        <div id="to-row5-col3" class="col-4">
          <bib-input type="text" v-model="activeProject.progress" placeholder="Select your progress" label="Progress" disabled></bib-input>
        </div>
      </div>
      <div id="to-row6" class="row">
        <div id="to-row6-col1" class="col-12">
          <bib-input type="textarea" label="Project brief" v-model="activeProject.description" placeholder="Project brief" v-on:keyup.native="debounceUpdate()"></bib-input>
        </div>
      </div>
      <!-- <loading :loading="loading"></loading> -->
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'

export default {
  props: {
    tasks: Array,
    project: Object,
  },
  data() {
    return {
      flag: false,
      totalTasks: this.tasks.length || 0,
      owner: [{ label: "Please choose one", value: null },
        { label: "Bruno", value: "1" },
        { label: "Ramon", value: "2" },
        // { label: "Rajeev", value: "3" },
      ],
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
      activeProject: {},
      loading: false
    };
  },

  watch: {
    project() {
      this.activeProject = {
        title: this.project ? this.project.title : "",
        dueDate: this.project ? this.dateInput(this.project.dueDate) : "",
        // owner: this.project ? this.project.userId : "",
        priorityId: this.project ? this.project.priorityId : "",
        statusId: this.project ? this.project.statusId : "",
        // time: "",
        budget: this.project.bugdet ? this.project.budget : 0,
        // progress: 0
        description: this.project ? this.project.description : "",
      }
    }
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
    }),
    taskOverdue() {
      if (!this.totalTasks) {
        return 0
      } else {
        let over = this.tasks.filter(t =>
          new Date(t.dueDate) < new Date()
        )
        return over.length
      }
    },
    taskDuesoon() {
      if (!this.totalTasks) {
        return 0
      } else {
        let due = this.tasks.filter(t => {
          let dd = new Date(t.dueDate).getDate();
          return (dd + 7) < new Date().getDate()
        })
        return due.length
      }
    },
    taskInprogress() {
      if (!this.totalTasks) {
        return 0
      } else {
        let prog = this.tasks.filter(t => t.statusId == 2)
        return prog.length
      }
    },
    taskComplete(){
      if (!this.totalTasks) {
        return 0
      } else {
        let done = this.tasks.filter(t => t.statusId == 5)
        return done.length
      }
    },
    progress() {
      if (!this.totalTasks) {
        return 0
      } else {
        let done = this.tasks.filter(t => t.statusId == 5)
        return ((done.length / this.totalTasks) * 100).toFixed(0)
      }
    },
  },

  methods: {
    dateInput(date) {
      let nd
      if (!date) {
        nd = new Date()
      } else {
        nd = new Date(date)
      }
      let mm = (nd.getMonth() + 1) < 10 ? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1
      let dd = (nd.getDate()) < 10 ? '0' + (nd.getDate()) : nd.getDate()
      return `${nd.getFullYear()}-${mm}-${dd}`
    },
    toggleSidebar() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
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
      let proj = await this.$axios.$put("/project", { id: this.project.id, data: this.activeProject }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      this.loading = false
    },
    debounceUpdate: _.debounce(function() {
      console.log('Debounce clicked!')
      this.updateProject()
    }, 2000)

  },
};

</script>
