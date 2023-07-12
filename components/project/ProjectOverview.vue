<template>
  <client-only>
    <div id="proj-overview-wrapper" class="row ">
      <div id="proj-overview-inner" class="overview-wrapper mx-auto position-relative">
        <div class="d-flex align-center gap-05" id="proj-overview-bib-avatar-wrap">
          <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" id="proj-overview-bib-avatar-inner-wrap">
            <bib-avatar></bib-avatar>
          </div>
          <div class="flex-grow-1" id="proj-overview-proj-title-input-wrap">
            <input type="text" class="editable-input" id="proj-overview-proj-title-input" ref="taskTitleInput" placeholder="Project name" v-model="activeProject.title" v-on:keyup="debounceUpdate('title', 'title', activeProject.title)" >
          </div>
        </div>
        <div id="proj-overview-row1" class="row my-1">
          <div id="proj-overview-row1-col1" class="col-4">
            <div id="proj-overview-progress-wrap1" class="bg-light shape-rounded text-center px-05 py-1 h-100">
              <p id="proj-overview-progress-title1" class="text-left text-gray5">Progress</p>
              <progress-circle variant="success" :radius="55" :progress="progress" class="mx-auto mt-1"></progress-circle>
            </div>
          </div>
          <div id="proj-overview-row1-col2" class="col-4">
            <div id="proj-overview-progress-wrap2" class="bg-light shape-rounded text-center px-05 py-1 h-100">
              <p id="proj-overview-progress-title2" class="text-left text-gray5">Tasks</p>
              <div id="proj-progress-in" class="px-1 py-05">
                <progress-bar label="Past due" background='danger' :value="taskOverdue" :total="totalTasks.length" class="my-05"></progress-bar>
                <progress-bar label="Due soon" background='warning' :value="taskDuesoon" :total="totalTasks.length" class="my-05"></progress-bar>
                <progress-bar label="Completed" background='success' :value="taskComplete" :total="totalTasks.length" class="my-05"></progress-bar>
                <progress-bar label="In progress" :value="taskInprogress" :total="totalTasks.length" class="mt-05"></progress-bar>
              </div>
            </div>
          </div>
          <div id="proj-overview-row1-col3" class="col-4">
            <div id="proj-overview-progress-wrap3" class="bg-light shape-rounded text-center px-05 py-1 h-100">
            </div>
          </div>
        </div>
        <div id="proj-overview-row2" class="row">
          <div id="proj-overview-row2-col1" class="col-6">
            <bib-select label="Owner" test_id="po-owner-dd1" :options="filterUser" v-model="activeProject.userId" v-on:change="debounceUpdate('Owner', 'userId', activeProject.userId)"></bib-select>
          </div>
          <div id="proj-overview-row2-col2" class="col-3">
            <bib-datepicker test_id="date01" v-model="startDate" :value="startDate" :maxDate="dueDate" format="dd MMM yyyy" @input="debounceUpdate('Start date', 'startDate', startDate)" label="Start date" name="startDate" placeholder="Start date" ></bib-datepicker>
          </div>
          <div id="proj-overview-row2-col3" class="col-3">
            <bib-datepicker test_id="date02" v-model="dueDate" :value="dueDate" :minDate="startDate" format="dd MMM yyyy" @input="debounceUpdate('Due date', 'dueDate', dueDate)" label="Due date" name="dueDate" class="align-right" placeholder="Due date"></bib-datepicker>
          </div>
        </div>
        <div id="proj-overview-row3" class="row">
          <div id="proj-overview-row3-col2" class="col-12">
            <bib-input type="select" label="Department" v-model="activeProject.departmentId" :options="departments" size="md"  v-on:change.native="debounceUpdate('Department', 'departmentId', activeProject.departmentId)"></bib-input>
          </div>
        </div>
        <div id="proj-overview-row4" class="row">
          <div id="proj-overview-row4-col1" class="col-6">
            <bib-input type="select" label="Priority" v-model.number="activeProject.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate('Priority', 'priorityId', activeProject.priorityId)"></bib-input>
          </div>
          <div id="proj-overview-row4-col2" class="col-6">
            <bib-input type="select" label="Status" v-model.number="activeProject.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate('Status', 'statusId', activeProject.statusId)"></bib-input>
          </div>
        </div>
        <div id="proj-overview-row5" class="row">
          <!-- <div id="proj-overview-row5-col1" class="col-4">
            <label class="text-gray6" id="proj-overview-span1">Time</label>
            <div class="shape-rounded border-gray4 my-05 p-05" id="proj-overview-div1">Hours {{time}}</div>
          </div> -->
          <div id="proj-overview-row5-col2" class="col-6">
            <bib-input type="number" icon-left="currency-dollar" v-model="activeProject.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="debounceUpdate('Budget', 'budget', activeProject.budget)"></bib-input>
          </div>
          <div id="proj-overview-row5-col3" class="col-6">
            <label class="text-gray6" id="proj-overview-label1">Progress</label>
            <div class="shape-rounded border-gray4 my-05 p-05" id="proj-overview-div2">{{progress}}%</div>
          </div>
        </div>
        <div id="proj-overview-row6" class="row">
          <div id="proj-overview-row6-col1" class="col-12">
            <bib-input type="textarea" label="Brief" v-model="activeProject.description" placeholder="Project brief" v-on:keyup.native="debounceUpdate('Project brief', 'description', activeProject.description)"></bib-input>
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
import { STATUS, PRIORITY } from '~/config/constants.js'
import dayjs from 'dayjs'

export default {
  props: {
    sections: Array
  },
  
  data() {
    return {
      flag: false,
      owner: {},
      filterKey: "",
      status: STATUS,
      priority: PRIORITY,
      activeProject: {},
      loading: false,
      project: {},
    };
  },

  watch: {
    project() {
      if (Object.keys(this.project).length) {
        this.activeProject = _.cloneDeep(this.project)
        this.owner = this.teamMembers.find(tm => tm.id == this.activeProject.userId)
      } else {
        this.activeProject = {
          title: "",
          startDate: "",
          dueDate: "",
          priorityId: null,
          statusId: null,
          departmentId: null,
          budget: 0,
          user: {},
          userId: "",
          description: "",
        }

      }
    },
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      departments: "department/getAllDepartments",
    }),

    totalTasks(){
      let tasks = []
      this.sections.map(t=>{
        tasks.push(...t.tasks)
      })
      return tasks
    },

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
        return { value: u.id, id: u.id, label: u.firstName + ' ' + u.lastName, firstName: u.firstName, lastName: u.lastName, email: u.email, img: u.avatar }
      })
    },

    startDate: {
      get() {
        if (!this.activeProject.startDate) {
          return ""
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
          return ""
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
  },

  mounted() {
    if (process.client) {
      this.loading = true
      this.$axios.$get(`project/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        if (res) {
          this.project = res.data;
          this.loading = false
        }
      }).catch(err => {
        console.warn(err);
      })
    }
  },

  methods: {

    debounceUpdate: _.debounce(function(label, field, value) {

      let updatedvalue = value
      if (label == "Owner") {
        this.owner = this.teamMembers.find(tm => tm.id == value)
        updatedvalue = this.owner.label
      }

      if (label == 'Status') {
        this.status.find(s => {
          if(s.value == value){
            updatedvalue = s.label
          }
        })
      }

      if (label == 'Priority') {
        this.priority.find(p => {
          if(p.value == value){
            updatedvalue = p.label
          }
        })
      }

      if (label == 'Department') {
        this.departments.find(d => {
          if(d.value == value){
            updatedvalue = d.label
          }
        })
      }

      if (label == "Due date") {
        updatedvalue = dayjs(value).format('DD MMM YYYY')
      }

      if( label == "Start date") {
        updatedvalue = dayjs(value).format('DD MMM YYYY')
      }

      if (this.activeProject.priorityId == "") {
        this.activeProject.priority = null
        this.activeProject.priorityId = null
      }
      if (this.activeProject.statusId == "") {
        this.activeProject.status = null
        this.activeProject.statusId = null
      }
      this.$store.dispatch("project/updateProject", {
        id: this.project?.id,
        user: this.owner,
        data: { [field]: value },
        text: `changed ${label} to ${updatedvalue}`
      })
    }, 1200)

  },

};

</script>
<style lang="scss" scoped>
.overview-wrapper {
  width: $overview-width;
}

@media screen and (max-width:1600px) {
  .overview-wrapper {
    max-width: $overview-width - 160px;
    width: 60%;
  }
}

#proj-overview-alert {
  a {
    text-decoration: underline;
  }
}

</style>
