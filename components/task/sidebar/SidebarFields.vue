<template>
  <div class="task-info position-relative px-105" id="task-input-wrap">
    <div class="row mx-0" id="sidebar-row-1">
      <div class="col-4" id="sidebar-col-1">
        <bib-select label="Assignee" test_id="task_assignee_select" :options="orgUsers" v-model="form.userId" v-on:change="debounceUpdateField('Assignee', 'userId', form.userId)"></bib-select>
        {{form.userId}}
      </div>
      <div class="col-4">
        <bib-datepicker v-model="startDateInput" :value="startDateInput" format="dd MMM yyyy" label="Start date" placeholder="Start date" @input="debounceUpdateField('Start date', 'startDate', startDateInput)"></bib-datepicker>
      </div>
      <div class="col-4">
        <bib-datepicker class="align-right" v-model="dueDateInput" :value="dueDateInput" format="dd MMM yyyy" label="Due date" placeholder="Due date" @input="debounceUpdateField('Due date', 'dueDate', dueDateInput)"></bib-datepicker>
      </div>
    </div>
    <div class="row mx-0" id="sidebar-row-2">
      <div class="col-4" id="sidebar-col-2">
        <bib-input type="select" label="Project" :options="companyProjects" v-model.number="form.projectId" v-on:change.native="changeProject"></bib-input>
      </div>
      <div class="col-4">
        <bib-input type="select" label="Section" :options="sectionOpts" v-model.number="form.sectionId" placeholder="Please select ..." v-on:change.native="debounceUpdateField('Section', 'sectionId', form.sectionId)" :disabled="!form.projectId"></bib-input>
      </div>
      <div class="col-4" id="sidebar-col-3">
        <bib-input type="select" label="Department" :options="department" placeholder="Please select..."></bib-input>
      </div>
    </div>
    <div class="row mx-0" id="sidebar-row-3">
      <div class="col-4" id="sidebar-col-4">
        <bib-input type="select" label="Priority" v-model.number="form.priorityId" :options="priorityValues" placeholder="Please select..." v-on:change.native="debounceUpdateField('Priority', 'priorityId', form.priorityId)"></bib-input>
      </div>
      <div class="col-4" id="sidebar-col-5">
        <bib-input type="select" label="Status" v-model.number="form.statusId" :options="statusValues" placeholder="Please select..." v-on:change.native="debounceUpdateField('Status', 'statusId', form.statusId)"></bib-input>
      </div>
    </div>
    <div class="row mx-0" id="sidebar-row-4">
      <div class="col-12" id="sidebar-col-6">
        <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter task description..." label="Description" v-on:keyup.native="debounceUpdateField('Description', 'description', form.description)"></bib-input>
      </div>
    </div>
    <div class="py-05 px-05" id="sidebar-btn-wrapper">
      <bib-button v-show="!task.id" label="Create Task" variant="primary" v-on:click="createTask"></bib-button>
    </div>
    <!-- <loading :loading="loading2 || loading"></loading> -->
  </div>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from "vuex"
import dayjs from 'dayjs'
import _ from 'lodash'
export default {

  name: 'SidebarFields',
  props: {
    task: {
      type: Object,
    },
    loading: {
        type: Boolean,
        default: false
    }
  },

  data() {
    return {
      assignee: "",
      statusValues: STATUS,
      priorityValues: PRIORITY,
      department: DEPARTMENT,
      form: {

      },
      loading2: false,
    }
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      sections: "section/getProjectSections",
      // currentTask: 'task/getSelectedTask',
      project: "project/getSingleProject",
      projects: "project/getAllProjects",
    }),
    orgUsers() {
      let data = this.teamMembers
        .map(u => {
          return { label: u.firstName + ' ' + u.lastName, img: u.avatar, value: u.id }
        })
      return [{ label: 'Please select...', value: null }, ...data]
    },
    companyProjects() {
      // console.log("new project", this.project.id, this.project.title)
      let data = this.projects.map(p => {
        return { label: p.title, value: p.id }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },
    sectionOpts() {
      let sec = [{ label: "Select section", value: "_section" + this.form.projectId }]
      this.sections.forEach((s) => {
        if (s.title.includes("_section")) {
          return false
        }
        sec.push({ label: s.title, value: s.id })
      });
      return sec
    },
    startDateInput: {
      get() {
        if (!this.form.startDate) {
          return new Date()
        } else {
          return new Date(this.form.startDate)
        }
      },
      set(newValue) {
        this.form.startDate = new Date(newValue)
      }
    },
    dueDateInput: {
      get() {
        let nd
        if (!this.form.dueDate) {
          nd = new Date()
          return new Date()
        } else {
          nd = new Date(this.form.dueDate)
          return new Date(this.form.dueDate)
        }
      },
      set(newValue) {
        this.form.dueDate = new Date(newValue)
      }
    },
  },
  watch: {
    task() {
      if (Object.keys(this.task).length) {
        // this.form = JSON.parse(JSON.stringify(this.task));
        this.form = _.cloneDeep(this.task);
        if (this.task.project?.length) {
          this.form.projectId = this.task.project[0].projectId || this.task.project[0].project.id
          this.$store.dispatch("section/fetchProjectSections", { projectId: this.form.projectId, filter: 'all' })
        } else {
          this.form.projectId = this.project.id
        }
        // console.info(this.$refs.topScroll)
      } else {
        this.form = {
          id: '',
          title: "Enter title...",
          createdAt: "",
          startDate: "",
          dueDate: "",
          userId: "",
          sectionId: "_section" + this.project.id,
          projectId: this.project.id,
          statusId: 1,
          priorityId: 2,
          description: '',
          budget: 0,
        }
        if (this.sectionIdActive) {
          this.form.sectionId = this.sectionIdActive
        }
      }
    },
  },
  methods: {
    changeProject() {
      if (!this.form.projectId || this.form.projectId == "") {
        this.form.projectId = null
        this.form.sectionId = null
        if (this.form.id) {
          // this.updateTask('removed from project', this.form.projectId)
          // this.debounceUpdateField("Project", "projectId", this.form.projectId)
          this.debounceProjectUpdateField("Project", "projectId", this.form.projectId, "Section","sectionId", this.form.sectionId, this.task.project[0].projectId)
          // this.$emit("update-field", { name: "Project", field: 'projectId', value: this.form.projectId })
          return false
        }
        return false
      }
      this.loading2 = true
      if (this.form.projectId && (!this.form.sectionId || this.form.sectionId == "")) {
        this.form.sectionId = "_section" + this.form.projectId
      }
      // console.log(this.form, this.form.projectId)
      this.$store.dispatch("section/fetchProjectSections", { projectId: this.form.projectId, filter: 'all' }).then((sections) => {
        // console.log(sections)
        if (!this.form.id || this.form.id == "") {
          this.loading2 = false
          return false
        }
        let sec = sections.find(s => s.title.includes("_section"))
        let proj = this.companyProjects.find(p => p.value == this.form.projectId)
        // console.warn(sec);
        if (!sec) {
          // this.form.sectionId = null
          this.form.sectionId = "_section" + this.form.projectId
        } else {
          this.form.sectionId = sec.id
        }
        this.loading2 = false
        // this.debounceUpdateField("Project", "projectId", this.form.projectId)
        this.debounceProjectUpdateField("Project", "projectId", this.form.projectId, "Section","sectionId", this.form.sectionId, this.form.projectId)

      })
    },
    debounceUpdateField: _.debounce(function(name, field, value) {
      // console.log(name, field, value)
      if (this.form?.id) {
        this.$emit("update-field", { name: name, field: field, value: value })
      }
    }, 1000),
    debounceProjectUpdateField: _.debounce(function(pName, pField, pValue, sName, sField, sValue, oldProjValue) {
      // console.log(name, field, value)
      if (this.form?.id) {
        this.$emit("update-project-field", { projName: pName, projField: pField, projValue: pValue, secName: sName, secField: sField, secValue: sValue, oldProjValue: oldProjValue })
      }
    }, 1000),
    createTask(){
      this.$emit("create-task", this.form)
    },
  }
}

</script>
<style lang="scss" scoped>
</style>
