<template>
  <article class="position-relative p-1">
    <!-- <h3>{{project.title}}</h3> -->
    <!-- <div>{{$userInfo(project.userId).Name}}</div> -->
    <div class="d-flex align-center gap-05">
      <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer">
        <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
        <!-- <bib-avatar></bib-avatar> -->
      </div>
      <div class="flex-grow-1">
        <input type="text" class="editable-input" ref="taskTitleInput" placeholder="Project name" v-model="activeProject.title" v-on:keyup="debounceUpdate('title', activeProject.title)">
      </div>
    </div>
    <div id="proj-row2" class="row">
      <div id="proj-row2-col1" class="col-6">
        <!-- <bib-input type="text" label="Project name" placeholder="Project name" v-model="activeProject.title" v-on:keyup.native="debounceUpdate('title', activeProject.title)"></bib-input> -->
        <bib-select label="Owner" test_id="po-owner-dd1" :options="filterUser" v-model="activeProject.userId" v-on:change="debounceUpdate('Owner', activeProject.userId)"></bib-select>
      </div>
      <div id="proj-row2-col2" class="col-3">
        <!-- <bib-input type="date" label="Start date" v-model="startDate" v-on:change.native="debounceUpdate('Start date', startDate)"></bib-input> -->
        <bib-datepicker test_id="date01" v-model="startDate" :value="startDate" :maxDate="dueDate" format="dd MMM yyyy" @input="debounceUpdate('Start date', startDate)" label="Start date" name="startDate" placeholder="Start date"></bib-datepicker>
      </div>
      <div id="proj-row2-col3" class="col-3">
        <!-- <bib-input type="date" label="Due date" v-model="dueDate" v-on:change.native="debounceUpdate('Due date', dueDate)"></bib-input> -->
        <bib-datepicker test_id="date02" class="align-right" v-model="dueDate" :value="dueDate" :minDate="startDate" format="dd MMM yyyy" @input="debounceUpdate('Due date', dueDate)" label="Due date" name="dueDate" placeholder="Due date"></bib-datepicker>
      </div>
    </div>
    <div id="proj-row3" class="row">
      <div id="proj-row3-col2" class="col-12">
        <bib-input type="select" label="Department" :options="department" placeholder="Department"></bib-input>
      </div>
    </div>
    <div id="proj-row4" class="row">
      <div id="proj-row4-col1" class="col-6">
        <bib-input type="select" label="Priority" v-model.number="activeProject.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate('Priority', activeProject.priorityId)"></bib-input>
      </div>
      <div id="proj-row4-col2" class="col-6">
        <bib-input type="select" label="Status" v-model.number="activeProject.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate('Status', activeProject.statusId)"></bib-input>
      </div>
    </div>
    <div id="proj-row5" class="row">
      <div id="proj-row5-col1" class="col-4">
        <label class="text-gray6">Time</label>
        <div class="shape-rounded border-gray4 my-05 p-05">Hours {{time}}</div>
        <!-- <bib-input type="time" v-model="time" placeholder="Select your time" label="Time"></bib-input> -->
      </div>
      <div id="proj-row5-col2" class="col-4">
        <bib-input type="number" icon-left="currency-dollar" v-model="activeProject.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="debounceUpdate('Budget', activeProject.budget)"></bib-input>
      </div>
      <div id="proj-row5-col3" class="col-4">
        <label class="text-gray6">Progress</label>
        <div class="shape-rounded border-gray4 my-05 p-05">{{progress}}%</div>
        <!-- <bib-input type="text" :value="progress + '%'" placeholder="Select your progress" label="Progress" disabled></bib-input> -->
      </div>
    </div>
    <div id="proj-row6" class="row">
      <div id="proj-row6-col1" class="col-12">
        <bib-input type="textarea" label="Brief" v-model="activeProject.description" placeholder="Project brief" v-on:keyup.native="debounceUpdate('Project brief', activeProject.description)"></bib-input>
      </div>
    </div>
  </article>
</template>
<script>
import { mapGetters } from 'vuex'
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import dayjs from 'dayjs'
import _ from 'lodash'
export default {

  name: 'InboxProject',
  props: {
    project: Object,
  },

  data() {
    return {
      // activeProject: {},
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
    }
  },

  /*watch: {
    project: (val, oldVal) => {
      if (val.id != oldVal.id) {
        this.activeProject = _.cloneDeep(val)
      }
    },
  },*/

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      sections: "section/getProjectSections",
    }),
    activeProject() {
      return this.project;
    },
    totalTasks(){
      let tasks = []
      this.sections.map(t=>{
        tasks.push(...t.tasks)
      })
      return tasks
    },
    isComplete() {
      if (this.project.statusId == 5) {
        return { variant: "success" }
      } else {
        return { variant: "gray5" }
      }
    },
    filterUser() {
      return this.teamMembers.map((u) => {
        return { value: u.id, id: u.id, label: u.firstName + ' ' + u.lastName, firstName: u.firstName, lastName: u.lastName, email: u.email, img: u.avatar }
      })
    },
    startDate: {
      get() {
        if (!this.activeProject.startDate) {
          return new Date()
        } else {
          return new Date(this.activeProject.startDate)
        }
      },
      set(newValue) {
        this.activeProject.startDate = new Date(newValue)
      }
    },

    dueDate: {
      get() {
        if (!this.activeProject.dueDate) {
          return new Date()
        } else {
          return new Date(this.activeProject.dueDate)
        }
      },
      set(newValue) {
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
    progress() {
      if (this.totalTasks.length < 1) {
        return 0
      } else {
        let done = this.totalTasks.filter(t => t.statusId == 5)
        // console.log(done.length, this.totalTasks.length)
        return Math.round((done.length / this.totalTasks.length) * 100)
      }
    },
  },

  methods: {
    debounceUpdate: _.debounce(function(name, value) {
      console.log('Debounce ', name, value)

      let updatedvalue = value
      if (name == "Owner") {
        this.owner = this.teamMembers.filter(tm => tm.id == value)
        updatedvalue = this.owner[0].label
      }
      if (name == 'Status') {
        this.status.find(s => {
          if (s.value == value) {
            updatedvalue = s.label
          }
        })
      }
      if (name == 'Priority') {
        this.priority.find(p => {
          if (p.value == value) {
            updatedvalue = p.label
          }
        })
      }
      if (name == "Due date") {
        updatedvalue = dayjs(value).format('DD MMM, YYYY')
      }

      if (name == "Start date") {
        updatedvalue = dayjs(value).format('DD MMM, YYYY')
      }

      if (this.activeProject.priorityId == "") {
        this.activeProject.priority = null
        this.activeProject.priorityId = null
      }
      if (this.activeProject.statusId == "") {
        this.activeProject.status = null
        this.activeProject.statusId = null
      }
      this.updateProject(`changed ${name} to ${updatedvalue}`)
    }, 1200),
    async updateProject(text) {
      // console.log('update project', this.activeProject)
      this.loading = true
      let proj = await this.$axios.$put("/project", { id: this.project.id, user: this.owner[0], data: this.activeProject, text: text || '' }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      // console.log(proj.data)
      if (proj.statusCode == 200) {
        this.project = proj.data
        this.$store.dispatch("project/setSingleProject", proj.data)
      }
      this.loading = false
    },
  }
}

</script>
<style lang="scss" scoped>
</style>
