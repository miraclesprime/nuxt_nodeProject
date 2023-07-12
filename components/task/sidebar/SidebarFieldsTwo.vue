<template>
  <client-only>
    <div class="task-info position-relative px-105" id="sbf-task-input-wrap">
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Start Date</label></div>
        <div class="col-5">
          <bib-datetime-picker :value="form.startDate" size="sm" placeholder="Start date" ref="startDate" @input="updateField('Start date', 'startDate', startDateInput)"></bib-datetime-picker>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Due Date</label></div>
        <div class="col-5">
          <bib-datetime-picker :value="form.dueDate" size="sm" placeholder="Due date" ref="dueDate" @input="updateField('Due date', 'dueDate', dueDateInput)"></bib-datetime-picker>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Project</label></div>
        <div class="col-5">
          <select-two :options="companyProjects" :value="form.projectId" title="Project" search icon="briefcase-solid" @change="changeProject"></select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Section</label></div>
        <div class="col-5">
          <section-select-two :options="sectionOpts" :value="form.sectionId" icon="menu-hamburger" title="Section" search :disabled="!form.projectId" @change="updateField('Section', 'sectionId', $event.value, $event.label)" ></section-select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Department</label></div>
        <div class="col-5">
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
          <select-two :options="difficultyOpt" :value="2" icon="bib-logo" title="Difficulty" @change="updateField('Difficulty', 'difficultyId', $event.value, $event.label)" ></select-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Est. Days</label></div>
        <div class="col-5">
          <!-- <bib-input type="text" icon-left="calendar-solid" size="sm" label="" v-model.number="form.time" placeholder="Select estimated days" ></bib-input> -->
          <input-two :value="form.estDays" icon="calendar-solid" @input="debounceUpdateField('Est. Days', 'estDays', $event)" ></input-two>
        </div>
      </div>
      <div class="row mb-05 ">
        <div class="col-2 align-center"><label>Budget</label></div>
        <div class="col-5">
          <!-- <bib-input type="text" icon-left="currency-dollar" size="sm" label="" v-model.number="form.budget" @input="debounceUpdateField('Budget', 'budget', form.budget)" ></bib-input> -->
          <input-two :value="form.budget" icon="currency-dollar" @input="debounceUpdateField('Budget','budget', $event)" ></input-two>
        </div>
      </div>
      <div class="row ">
        <div class="col-12">
          <bib-input type="textarea" v-model.trim="form.description" placeholder="Enter task description..." label="Description" class="w-100" v-on:keyup.native="debounceUpdateField('Description','description',form.description)"></bib-input>
        </div>
      </div>
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
import { STATUS, PRIORITY, DIFFICULTY } from "~/config/constants.js";
import { mapGetters } from "vuex";
import _ from "lodash";
// import fecha, { format } from "fecha";
export default {
  name: "SidebarFieldsTwo",
  props: {
    task: {
      type: Object,
    },

    departmentId: {
      type: Number,
    },
    visible: Boolean,
  },

  data() {
    return {
      assignee: "",
      // statusValues: STATUS,
      priorityValues: PRIORITY,
      difficultyOpt: DIFFICULTY,
      form: {},
      // loading2: false,
      randomKey: 0,
      popupMessages: [],
      validationDate: false
    };
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      sections: "section/getProjectSections",
      departments: "department/getAllDepartments",
      project: "project/getSingleProject",
      projects: "project/getAllProjects",
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
      this.randomKey++;
      return completeData;
    },
    companyProjects() {
      let data = this.projects.map((p) => {
        return { label: p.title, value: p.id };
      });
      return [{ label: "Please select...", value: null }, ...data];
    },
    sectionOpts() {
      let sec = [
        // { label: "No section", value: null },
        // { label: "Select section", value: "_section" + this.form.projectId },
      ];
      this.sections.forEach((s) => {
        /*if (s.title.includes("_section")) {
          return false;
        }*/
        sec.push({ label: s.title, value: s.id });
      });
      return sec;
    },
    startDateInput: {
      get() {
        if (!this.form.startDate) {
          return null
        } else {
          return new Date(this.form.startDate)
        }
      },
      set(newValue) {
        this.$refs.startDate.variant = null;
        if (!newValue) this.form.startDate = "";
        else {
          const newStartDate = new Date(newValue);
          if (this.dueDateInput && newStartDate.toISOString().slice(0, 10) > this.dueDateInput.toISOString().slice(0, 10)) {
            this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            this.dueDateInput = "";
            this.validationDate = false
            // this.$nextTick(() => {
            //   this.$refs.dueDate.$emit("input");
            // });
            this.$refs.startDate.variant = "alert";
          } else {
            if (this.$refs.dueDate.variant) this.$refs.dueDate.variant = null;
            this.validationDate = true
            this.form.startDate = new Date(newValue);
            //    this.$emit("update-field", {
            //   name: "Start date",
            //   field: "startDate",
            //   value: newStartDate,
            // });
          }
        }
      },
    },
    dueDateInput: {
      get() {
        if (!this.form.dueDate) {
          return null
        } else {
          return new Date(this.form.dueDate)
        }
      },
      set(newValue) {
        this.$refs.dueDate.variant = null;
        if (!newValue) {
          this.form.dueDate = "";
        } else {
          const newDueDate = new Date(newValue);
          if (this.startDateInput && newDueDate.toISOString().slice(0, 10) < this.startDateInput.toISOString().slice(0, 10)) {
            this.popupMessages.push({ text: "Invalid date", variant: "danger" });
            this.startDateInput = "";
            this.validationDate = false
            // this.$nextTick(() => {
            //   this.$refs.startDate.$emit("input");
            // });
            this.$refs.dueDate.variant = "alert";
          } else {
            if (this.$refs.startDate.variant) this.$refs.startDate.variant = null;
            this.form.dueDate = newDueDate;
            this.validationDate = true
            //  this.$emit("update-field", {
            //   name: "Due date",
            //   field: "dueDate",
            //   value: newDueDate,
            // });
          }


        }
      },
    },
  },
  watch: {
    visible(newValue, oldValue) {
      if (!newValue) {
        if (!!this.$refs.startDate.variant) this.$refs.startDate.variant = null;
        if (!!this.$refs.dueDate.variant) this.$refs.dueDate.variant = null;
      }
    },

    task() {
      if (Object.keys(this.task).length) {
        this.form = _.cloneDeep(this.task);
        if (this.task.project?.length) {
          this.form.projectId = this.task.project?. [0]?.projectId || this.task.project?. [0]?.project?.id;
          this.$store.dispatch("section/fetchProjectSections", {
            projectId: this.form.projectId,
            filter: "all",
          });
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
  },
  methods: {
    /*parseDate(dateString, format) {
           return fecha.parse(dateString, format);
       },
       formatDate(dateObj, format) {
           return fecha.format(dateObj, format);
       },*/

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
          filter: "all",
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
    debounceUpdateField: _.debounce(function(name, field, value) {
      if (this.form?.id) {
        if ((field === "startDate" || field === "dueDate") && !this.validationDate) return;
        this.$emit("update-field", { name: name, field: field, value: value, historyText: `changed ${name} to ${value}` });
      }
      // console.log(...arguments)
    }, 800),

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
