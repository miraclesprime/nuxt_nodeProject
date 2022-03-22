<template>
  <div id="task-overview-wrapper" class="row">
    <div id="task-overview-inner" class="col-6 my-2 mx-auto">
      
      <div id="to-row1" class="row my-1">
        <div id="to-row1-col1" class="col-4">
          <div class="bg-gray3 shape-rounded text-center p-05">
            <p class="text-left text-secondary">Progress</p>
            <bib-spinner variant="success" ></bib-spinner>
          </div>
        </div>
        <div id="to-row1-col2" class="col-4">
          <div class="bg-gray3 shape-rounded text-center p-05">
            <p class="text-left text-secondary">Tasks</p>
            <bib-spinner variant="warning"></bib-spinner>
          </div>
        </div>
        <div id="to-row1-col3" class="col-4">
          <div class="bg-gray3 shape-rounded text-center">
            <bib-spinner variant="primary"></bib-spinner>
          </div>
        </div>
      </div>
      <div id="to-row2" class="row">
        <div id="to-row2-col1" class="col-8">
          <bib-input type="text" label="Project name" placeholder="Project name" v-model="form.title"></bib-input>
        </div>
        <div id="to-row2-col2" class="col-4">
          <bib-input type="date" label="Due date" v-model="form.dueDate" placeholder=""></bib-input>
        </div>
      </div>
      <div id="to-row3" class="row">
        <div id="to-row3-col1" class="col-6">
          <!-- <bib-input type="text" label="Owner" placeholder="Owner" v-model="form.owner"></bib-input> -->
          <label>Owner</label>
          <user-info style="margin-top: 10px" :user="project.user" avatar="https://i.pravatar.cc/32"></user-info>
        </div>
        <div id="to-row3-col2" class="col-6">
          <bib-input type="select" label="Department" :options="department" placeholder="Department"></bib-input>
        </div>
      </div>
      <div id="to-row4" class="row">
        <div id="to-row4-col1" class="col-6">
          <bib-input type="select" label="Priority" v-model.number="project.priorityId" :options="priority" placeholder="Please select..."></bib-input>
        </div>
        <div id="to-row4-col2" class="col-6">
          <bib-input type="select" label="Status" v-model.number="project.statusId" :options="status" placeholder="Please select..."></bib-input>
        </div>
      </div>
      <div id="to-row5" class="row">
        <div id="to-row5-col1" class="col-4">
          <bib-input type="time" v-model="form.time" placeholder="Select your time" label="Time"></bib-input>
        </div>
        <div id="to-row5-col2" class="col-4">
          <bib-input type="number" v-model="form.budget" placeholder="Set your Budget" label="Budget"></bib-input>
        </div>
        <div id="to-row5-col3" class="col-4">
          <bib-input type="text" v-model="form.progress" placeholder="Select your progress" label="Progress"></bib-input>
        </div>
      </div>
      <div id="to-row6" class="row">
        <div id="to-row6-col1" class="col-12">
          <bib-input type="textarea" label="Project brief" placeholder="Project brief"></bib-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'

export default {
  props: {
    gridType: String,
    project: Object
  },
  data() {
    return {
      flag: false,
      tasks: [],
      owner: [{ label: "Please choose one", value: null },
        { label: "Bruno", value: "1" },
        { label: "Ramon", value: "2" },
        // { label: "Rajeev", value: "3" },
      ],
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
      form: {
        title: this.project.title,
        dueDate: this.project.dueDate,
        owner: this.project.userId,
        priorityId: this.project.priorityId,
        statusId: this.project.statusId,
        time: "",
        budget: 0,
        progress: 0
      }
    };
  },

  computed: {
    ...mapGetters({
      token: 'token/getToken',
    })
  },

  mounted() {
    this.$axios.$get("task/project/1", {
      headers: {
        "Authorization": "Bearer " + this.token
      }
    }).then(r => {
      this.tasks = r
    }).catch(e => console.log(e))
  },

  methods: {
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

  },
};

</script>
