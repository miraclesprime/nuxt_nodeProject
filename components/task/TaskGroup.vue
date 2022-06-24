<template>
  <div class="task-group w-100 position-relative" id="task-group-main-wrapper">
    <div id="task-group-title-wrapper" class="d-flex justify-between sub-title pb-05">
      <p id="task-group-title" class="text-gray5 ">Subtasks </p>
      <sorting-comp :items="sortingItems" icon="swap-vertical"></sorting-comp>
    </div>
    <!-- <section-title></section-title> -->
    <div id="subtask-title-wrapper" class="section-title w-100 py-025">
      <div v-if="newSubtask" class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded text-gray6 text-hover-dark bg-hover-light cursor-pointer" @click="newSubtask = false">
        <bib-icon icon="close" variant="secondary" :scale="1.2" />
        <span>Cancel</span>
      </div>
      <div v-else class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded text-gray6 text-hover-dark bg-hover-light cursor-pointer" @click="newSubtask = true">
        <bib-icon icon="add" variant="success" :scale="1.2" />
        <span>Add Subtask</span>
      </div>
    </div>
    <table class="table ">
      <thead v-if="newSubtask">
        <tr>
          <td>
            <bib-input type="text" size="sm" icon-left="check-circle" v-model="title" placeholder="Start typing..."></bib-input>
            <!-- <input type="text" v-model="title" placeholder="Start typing..."> -->
          </td>
          <td>
            <bib-select size="sm" :options="orgUsers" v-model="assignee" v-on:change="changeAssignee"></bib-select>
            <!-- <bib-input type="text" size="sm" avatar-left="" v-model="assignee" placeholder="Assign to..."></bib-input> -->
            <!-- <input type="text" v-model="assignee" placeholder="Assign to..."> -->
          </td>
          <td>
            <bib-input type="date" size="sm" v-model="date" placeholder="Set date..."></bib-input>
            <!-- <input type="text" v-model="date" placeholder="Set date..."> -->
          </td>
          <td>
            <div class="d-flex gap-05">
              <bib-icon icon="trash" variant="gray5" v-on:click="newSubtask = false"></bib-icon>
              <bib-icon icon="tick" variant="success" v-on:click="createSubtask"></bib-icon>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sub in subTasks" :key="sub.key">
          <!-- <td>{{sub.key}}</td> -->
          <td>
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="check-circle" :variant="sub.isDone ? 'success' : 'gray4'"></bib-icon> {{sub.title}}
            </div>
          </td>
          <td>
            <user-info :userId="sub.userId"></user-info>
          </td>
          <td><span v-format-date="sub.dueDate"></span></td>
          <td>
            <!-- <bib-popup :pop="sub.options" icon-variant="gray5" size="sm" >
              <template v-slot:menu>
                <div class="list">
                  <span class="list__item">View</span>
                  <span class="list__item">Edit</span>
                  <span class="list__item danger">Delete</span>
                </div>
              </template>
            </bib-popup> -->
            <bib-icon icon="trash" variant="gray5"></bib-icon>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <bib-table
      :fields="taskFields"
      :sections="taskSections"
      :headless="true"
      hide-no-column
      class="bg-white border-white border-top-gray4"
    >
      <template #cell(name)="data">
        <div  class="d-flex gap-05 align-center">
          <bib-icon icon="check-circle" variant="secondary" class="cursor-pointer" ></bib-icon>
          <span class="text-dark">{{ data.value.name }}</span>
        </div>
      </template>
      <template #cell(assignee)="data">
        <user-info :user="data.value.assignee"></user-info>
      </template>
      <template #cell(dueDate)="data">
        <span class="text-dark">{{ data.value.dueDate }}</span>
      </template>
      <template #cell(options)="data">
        <bib-icon icon="horizontal-dots"></bib-icon>
      </template>
    </bib-table> -->
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: "TaskGroup",

  props: {
    // groupName: {},
  },
  data: function() {
    return {
      sortingItems: [
        { label: "Name", value: "name" },
        { label: "Assignee", value: "assignee" },
        { label: "Due Date", value: "dueDate" },
        // { label: "Status", value:"status" },
      ],
      newSubtask: false,
      title: "",
      assignee: "",
      date: "",
      taskSections: [{
        key: 1,
        id: 199,
        title: "Remind me what time it is",
        userId: "DKgl9av2NwnaG1vz",
        dueDate: "22 Jan 2022",
        // isDone: false,
        options: "elipsis",
      }, ],
      user: {},
      flag: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      currentTask: "task/getSelectedTask",
      subTasks: "subtask/getSubTasks",

      // project: "project/getSingleProject",
      // sections: "section/getProjectSections",
    }),

    orgUsers() {
      let data = this.teamMembers.map(u => {
        return { label: u.firstName + ' ' + u.lastName, value: u.id }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },
  },
  watch: {
    currentTask(newVal) {
      if (Object.keys(newVal).length > 0) {
        this.loading = true
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
          .then(() => {
            console.log('subtask fetched')

            this.loading = false
          })
      }
    }
  },
  mounted() {
    console.log("mounted subtask");
    /*this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
      .then(st => {
        this.taskSections = st.data
      })
      .catch(e => console.log(e))*/
  },
  methods: {
    changeAssignee() {
      this.user = this.teamMembers.filter(t => t.id == this.assignee)
    },
    createSubtask() {
      this.loading = true
      let subData = {
        taskId: this.currentTask.id,
        title: this.title,
        user: {
          id: this.user[0].id,
          firstName: this.user[0].firstName,
          lastName: this.user[0].lastName,
          email: this.user[0].email,
        },
        description: this.description,
        dueDate: this.date,
        priorityId: 1,
        statusId: 1,
        budget: 0
      }
      this.$store.dispatch("subtask/createSubtask", subData)
        .then(t => {
          console.log(t)
          this.newSubtask = false
          this.title = ""
          this.assignee = ""
          this.date = ""
        })
        .catch(e => console.log(e))
        .then(() => {
          this.loading = false
        })
    },
  }
};

</script>
<style scoped lang="scss">
.task-group {
  margin-bottom: 3rem;
}

.sub-title {
  font-size: 1rem;
  border-bottom: 1px solid var(--bib-gray4);
}

.table {
  width: 100%;
  border: 1px solid transparent;
  border-collapse: collapse;
  font-size: 14px;

  thead {

    th,
    td {
      text-align: left;
      font-weight: bold;
      padding: 0.2rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-gray6);
      color: var(--bib-text-light);

      &:not(:first-child) {
        border-left: 1px solid var(--bib-light);
      }
    }

    .input {
      input {
        margin-top: 0;
        margin-bottom: 0;
        border: 0 none;
      }
    }
  }

  tbody {
    td {
      padding: 0.2rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-light);
      color: var(--bib-dark-sub1);

      &:not(:first-child) {
        border-left: 1px solid var(--bib-light);
      }
    }
  }
}

</style>
