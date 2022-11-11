<template>
  <div class="task-group w-100 position-relative py-05 px-105" id="task-group-main-wrapper">
    <div id="task-group-title-wrapper" class="border-bottom-gray2 d-flex justify-between sub-title pb-05">
      <p id="task-group-title" class="text-gray5 font-md">Subtasks </p>
      <!-- <sorting-comp :items="sortingItems" icon="swap-vertical"></sorting-comp> -->
    </div>
    <!-- <section-title></section-title> -->
    <div id="subtask-title-wrapper" class="section-title w-100 py-025">
      <div v-if="newSubtask" class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded bg-success-sub4 bg-hover-success-sub1 text-success text-hover-white cursor-pointer" @click="newSubtask = false">
        <bib-icon icon="close" variant="secondary" :scale="1.2"></bib-icon>
        <span>Cancel</span>
      </div>
      <div v-else class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded bg-success-sub4 bg-hover-success-sub1 text-success text-hover-white cursor-pointer" @click="openCreateSubtask">
        <bib-icon icon="add" variant="success" :scale="1.2"></bib-icon>
        <span>Add Subtask</span>
      </div>
    </div>
    <table class="table ">
        <thead>
          <tr>
            <th>Subtasks</th>
            <th>Assignee</th>
            <th>Due date</th>
            <th></th>
          </tr>
        </thead>
      <tbody>
          <tr v-if="newSubtask || localSubTasks.length == 0" class="new">
            <td>
              <div class="d-flex gap-05 align-center">
                <bib-icon icon="check-circle" :scale="1.25"></bib-icon>
                <input class="sub-input" ref="subtaskNameInput" type="text" v-model.trim="title" minlength="3" pattern="[a-zA-Z]{4,128}" @keyup="debounceCreateSubtask" placeholder="Start typing..." >
              </div>
            </td>
            <td>
              <bib-select size="sm" :options="orgUsers" v-model="assignee" v-on:change="changeAssignee" ></bib-select>
              <!-- <bib-input type="text" size="sm" avatar-left="" v-model="assignee" placeholder="Assign to..."></bib-input> -->
              <!-- <input type="text" v-model="assignee" placeholder="Assign to..."> -->
            </td>
            <td>
              <bib-input type="date" size="sm"  icon-left="calendar" v-model="date" placeholder="Set date..."></bib-input>
              <!-- <input type="text" v-model="date" placeholder="Set date..."> -->
            </td>
            <td>
              <div class="d-flex gap-05">
                <bib-icon icon="trash" variant="gray5" v-on:click="newSubtask = false"></bib-icon>
                <bib-icon icon="tick" variant="success" v-on:click="createSubtask"></bib-icon>
              </div>
            </td>
          </tr>
        <tr v-for="sub in localSubTasks" :key="sub.key">
          <!-- <td>{{sub.key}}</td> -->
          <td>
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="check-circle" :scale="1.25" :variant="sub.isDone ? 'success' : 'gray4'"></bib-icon> {{sub.title}}
            </div>
          </td>
          <td>
            <user-info :userId="sub.userId"></user-info>
          </td>
          <td><bib-icon icon="calendar"></bib-icon> <span v-format-date="sub.dueDate"></span></td>
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
          <span v-if="sub.canDelete" class="cursor-pointer shape-circle" @click="deleteSubtask(sub)">
            <bib-icon icon="trash-solid" ></bib-icon>
          </span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <span id="subtask-0" v-show="subTasks.length == 0" class="d-inline-flex gap-1 align-center m-05 bg-warning-sub3 border-warning shape-rounded py-025 px-1">
      <bib-icon icon="warning"></bib-icon> No subtasks found
    </span> -->
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
import _ from 'lodash'
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
    }),

    orgUsers() {
      let data = this.teamMembers.map(u => {
        return { label: u.firstName + ' ' + u.lastName, value: u.id }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },

    localSubTasks() {
      let subTs = _.cloneDeep(this.subTasks);
      subTs.map((s) => {
        if(s.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
          s.canDelete = true;
        } else {
          s.canDelete = false;
        }
      })
      return subTs;
    }
  },
  watch: {
    currentTask(newVal) {
      if (Object.keys(newVal).length > 0) {
        this.loading = true
        this.user = this.teamMembers.filter(t => t.id == this.currentTask.userId)
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
          .then(() => {
            // console.log('subtask fetched')
            this.loading = false
          })
      }
    },
  },
  mounted(){
    console.info('mouted task-group');
    // this.user = this.teamMembers.filter(t => t.id == this.currentTask.userId)
    // this.user = _.cloneDeep(this.currentTask.user)
  },
  methods: {
    openCreateSubtask() {
      this.newSubtask = true
      this.$nextTick(() => {
        this.$refs.subtaskNameInput.focus()
      })
    },
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
        budget: 0,
        text: `added subtask "${this.title}"`,
      }
      this.$store.dispatch("subtask/createSubtask", subData)
        .then(t => {
          console.log(t)
          this.newSubtask = false
          this.title = ""
          this.assignee = ""
          this.date = ""
          this.$nuxt.$emit("refresh-history")
        })
        .catch(e => console.log(e))
        .then(() => {
          this.loading = false
        })
    },

    debounceCreateSubtask: _.debounce(function() {
      // console.log('Debounced function')
      if (this.$refs.subtaskNameInput.validity.valid) {
        console.info('valid input');
        // return false
      } else {
        console.log('invalid input')
      }
      // this.createSubtask()
    }, 1500),
    async deleteSubtask(subtask) {
      this.loading = true
      const delsub = await this.$store.dispatch("subtask/deleteSubtask", {...subtask, text: `deleted subtask "${subtask.title}"`});
      if (delsub.statusCode == 200) {
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
        this.$nuxt.$emit("refresh-history")
      }
      this.loading = false
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
}

.sub-input {
  border: 1px solid $dark;
  border-radius: 0.25rem;
  padding: 0.25rem;
  &:focus { outline: none; }
  &:focus:invalid { outline: 3px solid $danger-sub3; }
  &:invalid { border-color: $danger; }
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
      font-weight: normal;
      color: $gray4;
      padding: 0.25rem 0 0.25rem 0.25rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-light);
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      color: var(--bib-text-light);
    }

    .input {
      input {
        margin-top: 0;
        margin-bottom: 0;
        border: 0 none;
      }
    }
  }

  tr.new {
    td, th {
      background-color: $light;

    }
  }

  tbody {
    td {
      padding: 0.25rem 0 0.25rem 0.25rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-light);
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      color: var(--bib-dark-sub1);

    }
  }
}

::v-deep {
  .bib-select {
    .select__real { margin-top:0; margin-bottom: 0;}
  }
  .input {
    input { margin-top:0; margin-bottom: 0; background-color: transparent; border-color: transparent; }
  }
}

</style>
