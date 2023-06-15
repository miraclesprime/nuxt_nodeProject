<template>
  <client-only>
    <div class="task-info position-relative px-105" id="sbf-task-input-wrap">
      <div class="row mx-0" id="sidebar-row-1">
        <div class="col-4" id="sidebar-col-1">
          <bib-select
            :key="randomKey"
            label="Assignee"
            test_id="task_assignee_select"
            :options="orgUsers"
            v-model="form.userId"
            v-on:change="debounceUpdateField('Assignee', 'userId', form.userId)"
          ></bib-select>
        </div>
        <div class="col-4" id="sidebar-col-2">
          <bib-datepicker
            v-model="startDateInput"
            :value="startDateInput"
            format="dd MMM yyyy"
            label="Start date"
            placeholder="Start date"
            ref="startDate"
            @input="
              debounceUpdateField('Start date', 'startDate', startDateInput)
            "
          ></bib-datepicker>
        </div>
        <div class="col-4" id="sidebar-col-3">
          <bib-datepicker
            class="align-right"
            v-model="dueDateInput"
            :value="dueDateInput"
            format="dd MMM yyyy"
            label="Due date"
            placeholder="Due date"
            ref="dueDate"
            @input="debounceUpdateField('Due date', 'dueDate', dueDateInput)"
          ></bib-datepicker>
        </div>
      </div>
      <div class="row mx-0" id="sidebar-row-2">
        <div class="col-4" id="sidebar-col-4">
          <bib-input
            type="select"
            label="Project"
            :options="companyProjects"
            v-model.number="form.projectId"
            v-on:change.native="changeProject"
          ></bib-input>
        </div>
        <div class="col-4" id="sidebar-col-5">
          <bib-input
            type="select"
            label="Section"
            :options="sectionOpts"
            v-model.number="form.sectionId"
            placeholder="Please select ..."
            v-on:change.native="
              debounceUpdateField('Section', 'sectionId', form.sectionId)
            "
            :disabled="!form.projectId"
          ></bib-input>
        </div>
        <div class="col-4" id="sidebar-col-6">
          <bib-input
            type="select"
            label="Department"
            :options="departments"
            v-model.number="form.departmentId"
            v-on:change.native="
              debounceUpdateField(
                'Department',
                'departmentId',
                form.departmentId
              )
            "
          ></bib-input>
        </div>
      </div>
      <div class="row mx-0" id="sidebar-row-3">
        <div class="col-4" id="sidebar-col-7">
          <bib-input
            type="select"
            label="Priority"
            v-model.number="form.priorityId"
            :options="priorityValues"
            placeholder="Please select..."
            v-on:change.native="
              debounceUpdateField('Priority', 'priorityId', form.priorityId)
            "
          ></bib-input>
        </div>
        <div class="col-4" id="sidebar-col-8">
          <bib-input
            type="select"
            label="Status"
            v-model.number="form.statusId"
            :options="statusValues"
            placeholder="Please select..."
            v-on:change.native="
              debounceUpdateField('Status', 'statusId', form.statusId)
            "
          ></bib-input>
        </div>
      </div>
      <div class="row mx-0" id="sidebar-row-4">
        <div class="col-12" id="sidebar-col-9">
          <bib-input
            type="textarea"
            v-model.trim="form.description"
            placeholder="Enter task description..."
            label="Description"
            v-on:keyup.native="
              debounceUpdateField(
                'Description',
                'description',
                form.description
              )
            "
          ></bib-input>
        </div>
      </div>
      <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification
              v-for="(msg, index) in popupMessages"
              :key="index"
              :message="msg.text"
              :variant="msg.variant"
            >
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
    </div>
  </client-only>
</template>

<script>
import { STATUS, PRIORITY } from "~/config/constants.js";
import { mapGetters } from "vuex";
import _ from "lodash";
// import fecha, { format } from "fecha";
export default {
  name: "SidebarFields",
  props: {
    task: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    departmentId: {
      type: Number,
    },
    visible: Boolean,
  },

  data() {
    return {
      assignee: "",
      statusValues: STATUS,
      priorityValues: PRIORITY,
      form: {},
      loading2: false,
      randomKey: 0,
      popupMessages: [],
      validationDate:false
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
        { label: "Select section", value: "_section" + this.form.projectId },
      ];
      this.sections.forEach((s) => {
        if (s.title.includes("_section")) {
          return false;
        }
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
          if (
            this.dueDateInput &&
            newStartDate.toISOString().slice(0, 10) >
              this.dueDateInput.toISOString().slice(0, 10)
          ) {
            this.popupMessages.push({ text:"Invalid date", variant: "danger" });
            this.dueDateInput = "";
            this.validationDate=false
            // this.$nextTick(() => {
            //   this.$refs.dueDate.$emit("input");
            // });
            this.$refs.startDate.variant = "alert";
          } else {
            if (this.$refs.dueDate.variant) this.$refs.dueDate.variant = null;
            this.validationDate=true
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
          if (
            this.startDateInput &&
            newDueDate.toISOString().slice(0, 10) <
              this.startDateInput.toISOString().slice(0, 10)
          ) {
            this.popupMessages.push({ text:"Invalid date", variant: "danger" });
            this.startDateInput = "";
            this.validationDate=false
            // this.$nextTick(() => {
            //   this.$refs.startDate.$emit("input");
            // });
            this.$refs.dueDate.variant = "alert";
          } else {
            if (this.$refs.startDate.variant)
              this.$refs.startDate.variant = null;
               this.form.dueDate = newDueDate;
               this.validationDate=true 
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
          this.form.projectId =
            this.task.project[0].projectId || this.task.project[0].project.id;
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

    changeProject() {
      if (!this.form.projectId || this.form.projectId == "") {
        this.form.projectId = null;
        this.form.sectionId = null;
        if (this.form.id) {
          this.debounceProjectUpdateField(
            "Project",
            "projectId",
            this.form.projectId,
            "Section",
            "sectionId",
            this.form.sectionId,
            this.task.project[0].projectId
          );
          return false;
        }
        return false;
      }
      this.loading2 = true;
      if (
        this.form.projectId &&
        (!this.form.sectionId || this.form.sectionId == "")
      ) {
        this.form.sectionId = "_section" + this.form.projectId;
      }
      this.$store
        .dispatch("section/fetchProjectSections", {
          projectId: this.form.projectId,
          filter: "all",
        })
        .then((sections) => {
          if (!this.form.id || this.form.id == "") {
            this.loading2 = false;
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
          this.loading2 = false;
          this.debounceProjectUpdateField(
            "Project",
            "projectId",
            this.form.projectId,
            "Section",
            "sectionId",
            this.form.sectionId,
            this.form.projectId
          );
        });
    },
    debounceUpdateField: _.debounce(function (name, field, value) {
      if (this.form?.id) {
        if((field==="startDate"||field==="dueDate")&&!this.validationDate) return;
        this.$emit("update-field", { name: name, field: field, value: value });
      } 
    }, 1000),
    debounceProjectUpdateField: _.debounce(function (
      pName,
      pField,
      pValue,
      sName,
      sField,
      sValue,
      oldProjValue
    ) {
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
    500),
  },
};
</script>
<style lang="scss" scoped></style>
