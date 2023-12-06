<template>
  <client-only>
    <div class="task-info position-relative py-05 px-105 " id="sbf-task-input-wrap">
      <div class="row mt-05 mb-05 ">
        <div class="col-2 align-center"><label>Start Date</label></div>
        <div class="col-5">
          <bib-datetime-picker v-model="sdate" :format="format" :parseDate="parseDate" :formatDate="formatDate" size="sm" placeholder="Start date" @input="startdateProcess" ></bib-datetime-picker>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Due Date</label></div>
        <div class="col-5">
          <bib-datetime-picker v-model="ddate" :format="format" :parseDate="parseDate" :formatDate="formatDate" size="sm" placeholder="Due date" @input="duedateProcess"></bib-datetime-picker>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Project</label></div>
        <div class="col-6">
          <select-two :options="companyProjects" :value="form.projectId" title="Project" search icon="briefcase-solid" @change="changeProject"></select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Section</label></div>
        <div class="col-6">
          <section-select-two :options="sectionOpts" :value="form.sectionId" icon="menu-hamburger" title="Section" search :disabled="!form.projectId" @change="updateField('Section', 'sectionId', $event.value, $event.label)" ></section-select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Department</label></div>
        <div class="col-6">
          <select-two :options="departments" :value="form.departmentId" icon="projects" title="Department" @change="updateField('Department','departmentId', $event.value, $event.label)"></select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Priority</label></div>
        <div class="col-5">
          <priority-select-two :priority="form.priority" @change="updateField('Priority', 'priorityId', $event.value, $event.label)"></priority-select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Status</label></div>
        <div class="col-5">
          <status-select-two :status="form.status" @change="updateField('Status', 'statusId', $event.value, $event.label)" ></status-select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Difficulty</label></div>
        <div class="col-5">
          <select-two :options="difficultyOpt" :value="form.difficultyId" icon="bib-logo" title="Difficulty" @change="updateField('Difficulty', 'difficultyId', $event.value, $event.label)" ></select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Est. Days</label></div>
        <div class="col-5">
          <input-two type="number" :value="form.estDays" icon="calendar-solid" @input="validate('Est. Days', 'estDays', $event)" ></input-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Budget</label></div>
        <div class="col-5">
          <input-two type="number" :value="form.budget" icon="currency-dollar" @input="validate('Budget','budget', $event)" ></input-two>
        </div>
      </div>
      <div class="row ">
        <div class="col-12">
          <!-- <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter task description..." label="Description" class="w-100" v-on:keyup.native="debounceUpdateField('Description','description',form.description)"></bib-input> -->
          <div class="mb-05"><label>Description</label></div>
          <rich-editor :value="value" :editingMessage="form.description" @submit="updateDescription('Description', 'description', $event)" ></rich-editor>
        </div>
      </div>
      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant" :autohide="4000">
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
      
      <div class="overlay position-absolute" style="inset: 0; z-index: 5;" v-show="!activeProp">
      </div>
    </div>

  </client-only>
</template>
<script>
import { STATUS, PRIORITY, DIFFICULTY } from "~/config/constants.js";
import { mapGetters } from "vuex";
import _ from "lodash";
// import dayjs from "dayjs";
export default {
  name: "SidebarFieldsTwo",
  props: {
    task: {
      type: Object,
    },

    departmentId: {
      type: Number,
    },
    activeProp: { default: null }
  },

  data() {
    return {
      assignee: "",
      // statusValues: STATUS,
      priorityValues: PRIORITY,
      difficultyOpt: DIFFICULTY,
      form: {},
      popupMessages: [],
      validationDate: false,
      format: "DD MMM YYYY",
      sdate: "",
      ddate: "",
      value: {
        files: []
      },
      id: null,
      description: "",
    };
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      sections: "section/getProjectSections",
      departments: "department/getAllDepartments",
      project: "project/getSingleProject",
      projects: "project/getAllProjects",
      filterViews :'task/getFilterView',
      sidebarOpen: 'task/getSidebarVisible',
    }),
    orgUsers() {
      let data = this.teamMembers.map((u) => {
        return {
          label: u.firstName + " " + u.lastName,
          img: u.avatar,
          value: u.id,
        };
      });
      let completeData = [{ label: "Please select...", value: null }, ...data];
      return completeData;
    },
    companyProjects() {
      let data = this.projects?.map((p) => {
        return { label: p.title, value: p.id };
      });
      return [{ label: "Please select...", value: null }, ...data];
    },
    sectionOpts() {
      let sec = []
      this.sections.forEach((s) => {
        /*if (s.title.includes("_section")) {
          return false;
        }*/
        sec.push({ label: s.title, value: s.id });
      });
      return sec;
    },
  },
  watch: {
    filterViews(newValue){
         return _.cloneDeep(newValue)
    },
    task() {
      if (Object.keys(this.task).length) {
        this.form = _.cloneDeep(this.task);
        if (this.task.project?.[0]?.project?.id) {
          this.form.projectId = this.task.project?.[0]?.projectId || this.task.project?.[0]?.project?.id;
          // console.log(this.form.projectId)
          /*if (this.form.projectId) {
            this.$store.dispatch("section/fetchProjectSections", {
              projectId: this.form.projectId,
              filter: this.filterViews,
            });
          }*/
        } else {
          this.form.projectId = this.project?.id;
        }
      } else {
        this.form = {
          id: "",
          title: "",
          startDate: "",
          dueDate: "",
          userId: "",
          sectionId: "_section" + this.project?.id,
          projectId: this.project?.id || "",
          departmentId: this.departmentId || null,
          statusId: null,
          priorityId: null,
          description: "",
          budget: 0,
        };

        if (this.sectionIdActive) {
          this.form.sectionId = this.sectionIdActive;
        }
        if (this.project?.id) {
          this.form.sectionId = "_section" + this.project.id;
        } else {
          this.form.sectionId = "";
        }
      }
      this.sdate = this.$formatDate(this.form?.startDate)
      this.ddate = this.$formatDate(this.form?.dueDate)
    },
    sidebarOpen(newValue){
      if (!newValue) {
        if (this.form.description == this.description) { return }
        let hText = this.description.replace( /(<([^>]+)>)/ig, '');
        hText = _.truncate(hText, {'length': 30})
        // console.log(newValue, hText, this.form.description == this.description)
        
        this.$store.dispatch("task/updateTask", {
          id: this.id,
          data: { 'description': this.description },
          projectId: null,
          text: `changed description - ${hText}`,
        })
          
      } else {
        this.description = ""
      }
    }
  },
 mounted () {
  if (Object.keys(this.task).length) {
        this.form = _.cloneDeep(this.task);
        if (this.task.project?.length) {
          this.form.projectId = this.task.project?.[0]?.projectId || this.task.project?.[0]?.project?.id;
          if (this.task.project?.[0]?.project?.id) {
            // console.log(this.form.projectId)
            this.$store.dispatch("section/fetchProjectSections", {
              projectId: this.form.projectId,
              filter: this.filterViews,
            });
          }
        } else {
          this.form.projectId = this.project?.id;
        }
      } else {
        this.form = {
          id: "",
          title: "",
          startDate: "",
          dueDate: "",
          userId: "",
          sectionId: "_section" + this.project?.id,
          projectId: this.project?.id || "",
          departmentId: this.departmentId || null,
          statusId: null,
          priorityId: null,
          description: "",
          budget: 0,
        };
        if (this.sectionIdActive) {
          this.form.sectionId = this.sectionIdActive;
        }
        if (this.project?.id) {
          this.form.sectionId = "_section" + this.project.id;
        } else {
          this.form.sectionId = "";
        }
      }
 },
  methods: {
    parseDate(dateString, format) {
      return new Date(dateString);
    },
    formatDate(dateObj, format) {
      return this.$formatDate(dateObj)
    },
    startdateProcess(newValue, repeat){
      const oldValue = this.form.startDate
      const newStartDate = new Date(newValue);
      this.form.startDate = newValue;

      // console.table({"newvalue":newValue, "newstartdate":newStartDate, "oldvalue":oldValue, "sdate":this.sdate})

      if (newValue == "") {
        this.$emit("update-field", {
          name: 'Start date',
          field: 'startDate',
          value: null,
          historyText: "removed Start date"
        })
        return
      }

      if (this.form.dueDate && this.form.dueDate != null) {
        if (newStartDate.getTime() > new Date(this.form.dueDate).getTime()) {
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.form.startDate = oldValue
          this.sdate = this.$formatDate(oldValue)
          // return
        } else {
          this.$emit("update-field", {
            name: 'Start date',
            field: 'startDate',
            value: newStartDate,
            historyText: `changed Start date to ${this.$formatDate(newValue)}`
          })  
        }
      } else {
        this.$emit("update-field", {
          name: 'Start date',
          field: 'startDate',
          value: newStartDate,
          historyText: `changed Start date to ${this.$formatDate(newValue)}`
        })
      }

    },

    duedateProcess(newValue, repeat){
      const oldValue = this.form.dueDate
      const newDueDate = new Date(newValue);
      this.form.dueDate = newValue;

      // console.table({"newvalue": newValue, "newduedate":newDueDate, "oldvalue":oldValue, "ddate":this.ddate})

      if (newValue == "") {
        this.$emit("update-field", {
          name: "Due date",
          field: "dueDate",
          value: null,
          historyText: "removed Due date"
        })
        return
      } 

      if (this.form.startDate && this.form.startDate != null) {
          // console.log(this.form.startDate )
        if (newDueDate.getTime() < new Date(this.form.startDate).getTime()) {
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.form.dueDate = oldValue
          this.ddate = this.$formatDate(oldValue)
          // return
        } else {
          this.$emit("update-field", {
            name: "Due date",
            field: "dueDate",
            value: newDueDate,
            historyText: `changed Due date to ${this.$formatDate(newValue)}`
          })
        }
      } else {
        this.$emit("update-field", {
          name: "Due date",
          field: "dueDate",
          value: newDueDate,
          historyText: `changed Due date to ${this.$formatDate(newValue)}`
        })
      }
      
    },

    changeProject(proj) {
      // console.log(proj)
      this.form.projectId = proj.value
      this.form.sectionId = null
      if (!this.form.projectId || this.form.projectId == "") {
        this.form.projectId = null;
        this.form.sectionId = null;
        if (this.form.id) { //task edit mode
          this.debounceProjectUpdateField("Project", "projectId", this.form.projectId, "Section", "sectionId", this.form.sectionId, this.form.projectId);
          return false;
        }
        return false;
      }
      if (this.form.projectId && (!this.form.sectionId || this.form.sectionId == "")) {
        this.form.sectionId = "_section" + this.form.projectId;
      }
      this.$store.dispatch("section/fetchProjectSections", {
          projectId: this.form.projectId,
          filter: this.filterViews,
        })
        .then((sections) => {
          if (!this.form.id || this.form.id == "") {
            return false;
          }
          let sec = sections.find((s) => s.title.includes("_section"));
          let proj = this.companyProjects.find(
            (p) => p.value == this.form.projectId
          );
          if (!sec) {
            this.form.sectionId = "_section" + this.form.projectId;
          } else {
            this.form.sectionId = sec.id;
          }
          this.debounceProjectUpdateField("Project", "projectId", this.form.projectId, "Section", "sectionId", this.form.sectionId, this.form.projectId);
        });
    },
    updateField(name, field, value, historyText){
      // console.log(...arguments)
      this.$emit("update-field", {name: name, field: field, value: value, historyText: `changed ${name} to ${historyText || value}`})
    },
    validate(name, field, value) {
      let dec = Number.parseFloat(value).toFixed(2)
      this.debounceUpdateField(name, field, dec)
    },
    debounceUpdateField: _.debounce(function(name, field, value) {
      if (this.form?.id) {
         if(value.text){
          let hText = value.text.replace( /(<([^>]+)>)/ig, '');
          hText = _.truncate(hText, {'length': 30})
          // console.log(hText)
          this.$emit("update-field", { name, field, value: value.text, historyText: `changed ${name} to ${hText}`})
         }
         else {
          this.$emit("update-field", { name: name, field: field, value: value, historyText: `changed ${name} to ${value}` });          
         }
      }
      // console.log(...arguments)
    }, 600),

    debounceProjectUpdateField: _.debounce(function(pName, pField, pValue, sName, sField, sValue, oldProjValue) {
      // console.log(...arguments)
      if (this.form?.id) {
        this.$emit("update-project-field", {
          projName: pName,
          projField: pField,
          projValue: pValue,
          secName: sName,
          secField: sField,
          secValue: sValue,
          oldProjValue: oldProjValue,
        });
      }
    },
    600),
    updateDescription(name, field, value){
      this.description = value.text
      this.id = _.clone(this.task.id)
      // console.log('submit', value.text)
      this.$emit("update-description", {name, field, value})
    }
  },
};

</script>
<style lang="scss" scoped>
.task-info {
  font-size: $font-size-sm;
}

::v-deep {
  .input {

    &--sm {
      .wrapper {
        .icon { top: 0.5rem; }
      }
    }
    input {
      display: inline;
      margin-block: 0;
      width: auto;
      min-width: 5rem;
      max-width: max-content;
      background-color: var(--bib-gray9);
      border: 1px solid transparent;
      color: var(--bib-secondary);
      &:hover, &:focus {
        border-color: var(--bib-gray2);
        color: var(--bib-text);
      }
    }
    textarea {
      background-color: var(--bib-gray9);
      border: 1px solid transparent;
      color: var(--bib-secondary);
    }
  }
  .bib-datepicker__input,
  .vdpComponent__input { margin-block: 0;}
}
</style>
