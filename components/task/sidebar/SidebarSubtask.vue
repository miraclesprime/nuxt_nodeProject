<template>
  <div class="task-group w-100 position-relative py-05 px-2" id="task-group-main-wrapper">
    <div id="task-group-title-wrapper" class="border-bottom-gray2 d-flex justify-between sub-title pb-05">
      <p id="task-group-title" class="text-gray5 font-md">Subtasks </p>
      <!-- <sorting-comp :items="sortingItems" icon="swap-vertical"></sorting-comp> -->
    </div>
    <div id="subtask-title-wrapper" class="section-title w-100 py-025">
      <div v-if="newSubtask" class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded bg-success-sub6 bg-hover-success-sub3 text-success  cursor-pointer" @click="newSubtask = false">
        <bib-icon icon="close" variant="success" :scale="1.2"></bib-icon>
        <span>Cancel</span>
      </div>
      <div v-else class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded bg-success-sub6 bg-hover-success-sub3 text-success  cursor-pointer" @click="openCreateSubtask">
        <bib-icon icon="add" variant="success" :scale="1.2"></bib-icon>
        <span>Add Subtask</span>
      </div>
    </div>
    <table class="table ">
      <thead>
        <tr>
          <th>Subtasks</th>
          <th>Assignee</th>
          <th width="150">Due date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="newSubtask || localSubTasks.length == 0" class="new">
          <td>
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="check-circle-solid" variant="white" :scale="1.25"></bib-icon>
              <input class="sub-input" ref="subtaskNameInput" type="text" v-model.trim="title" :disabled="loading" pattern="[a-zA-Z0-9-_ ]+" @keyup="validateInput" @blur="validateInput" placeholder="Enter text...">
            </div>
          </td>
          <td>
            <div class="d-flex align-center gap-05">
              <bib-avatar size="1.25rem"></bib-avatar>
              <span>Assign to...</span>
            </div>
            <!-- <bib-select size="sm" :options="orgUsers" v-model="assignee" v-on:change="changeAssignee"></bib-select> -->
            <!-- <bib-input type="text" size="sm" avatar-left="" v-model="assignee" placeholder="Assign to..."></bib-input> -->
          </td>
          <td>
            <div class="d-flex align-center gap-05">
              <bib-icon icon="calendar"></bib-icon>
              <span>Set due...</span>
            </div>
            <!-- <bib-input type="date" size="sm" icon-left="calendar" v-model="date" placeholder="Set date..."></bib-input> -->
            <!-- <bib-datepicker v-model="date" size="sm" class="align-right" format="dd MMM yyyy" placeholder="Set date..."></bib-datepicker> -->
          </td>
          <td>
            <!-- <div class="d-flex gap-05">
              <bib-icon icon="trash" variant="gray5" v-on:click="newSubtask = false"></bib-icon>
              <bib-icon icon="tick" variant="success" v-on:click="createSubtask"></bib-icon>
            </div> -->
          </td>
        </tr>
        <tr v-for="sub in localSubTasks" :key="sub.id + subkey">
          <!-- <td>{{sub.key}}</td> -->
          <td>
            <div class="d-flex gap-05 align-center">
              <span class="cursor-pointer" style="width:20px; height:20px" @click="markComplete(sub)"><bib-icon icon="check-circle" :scale="1.25" :variant="sub.isDone ? 'success' : 'gray4'"></bib-icon></span>
              <input type="text" class="editable-input sm" v-model="sub.title" @input="debounceUpdate(sub, {title: sub.title})">
            </div>
          </td>
          <td>
            <bib-select :options="orgUsers" v-model="sub.userId" size="sm" class="bg-white" v-on:change="updateSubtask(sub, {userId: sub.userId})"></bib-select>
            <!-- <user-info :userId="sub.userId"></user-info> -->
          </td>
          <td>
            <div class="d-inline-flex align-center gap-05" >
              <bib-icon icon="calendar"></bib-icon>
              <datepicker v-model="sub.dueDate" @input="updateSubtask(sub, {dueDate: sub.dueDate})" placeholder="Select date..." clear-button ></datepicker>
            </div>            
          </td>
          <td>
            <div class="d-flex align-center justify-end gap-025">
              <span v-show="sub.canDelete" class="cursor-pointer shape-rounded width-105 height-105 align-center justify-center bg-hover-light" v-tooltip="'Delete'" @click="deleteSubtask(sub)">
                <bib-icon icon="trash-solid" :scale="1" variant="gray5"></bib-icon>
              </span>
              <span class="cursor-pointer shape-rounded width-105 height-105 align-center justify-center bg-hover-light" v-tooltip="'Detail'" @click="$emit('view-subtask', sub)" >
                <bib-icon icon="arrow-right" :scale="1.25" variant="gray5" ></bib-icon>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import _ from 'lodash'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { faCalendar } from '@fortawesome/free-regular-svg-icons';
export default {
  name: "SidebarSubtask",

  props: {
    // groupName: {},
  },
  /*components: {
    fa: FontAwesomeIcon,
  },*/
  data: function() {
    return {
      // faCalendar,
      /*sortingItems: [
        { label: "Name", value: "name" },
        { label: "Assignee", value: "assignee" },
        { label: "Due Date", value: "dueDate" },
        // { label: "Status", value:"status" },
      ],*/
      newSubtask: false,
      title: "",
      assignee: "",
      date: "",
      /*taskSections: [{
        key: 1,
        id: 199,
        title: "Remind me what time it is",
        userId: "DKgl9av2NwnaG1vz",
        dueDate: "22 Jan 2022",
        // isDone: false,
        options: "elipsis",
      }, ],*/
      user: {},
      flag: false,
      loading: false,
      subkey: 0,
    };
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
      currentTask: "task/getSelectedTask",
      subTasks: "subtask/getSubTasks",
      user2: "user/getUser2",
    }),

    orgUsers() {
      let data = this.teamMembers.map(u => {
        return { label: u.firstName + ' ' + u.lastName, value: u.id, img: u.avatar }
      })
      return [{ label: 'Please select...', value: null }, ...data]
    },

    localSubTasks() {
      let subTs = _.cloneDeep(this.subTasks);
      subTs.map((s) => {
        if (s.userId == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
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
        let usr = this.teamMembers.filter(t => t.id == this.currentTask.userId)
        this.user = usr[0]
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
          .then(() => {
            // console.log('subtask fetched')
            this.loading = false
          })
          .catch(e => {
            console.log(e)
            this.loading = false
          })
      } else {
        this.user = undefined
      }
    },
  },
  /*mounted(){
    console.info('mouted task-group');
    // this.user = this.teamMembers.filter(t => t.id == this.currentTask.userId)
    // this.user = _.cloneDeep(this.user2)
  },*/
  methods: {
    openCreateSubtask() {
      this.newSubtask = true
      this.$nextTick(() => {
        this.$refs.subtaskNameInput.focus()
      })
    },
    /*changeAssignee() {
      let usr = this.teamMembers.filter(t => t.id == this.assignee)
      this.user = usr[0]
    },*/
    createSubtask() {

      this.loading = true
      let subData = {
        taskId: this.currentTask.id,
        title: this.title,
        user: {
          id: this.user?.id || this.user2.Id,
          firstName: this.user?.firstName || this.user2.FirstName,
          lastName: this.user?.lastName || this.user2.LastName,
          email: this.user?.email || this.user2.Email,
        },
        description: "",
        dueDate: "",
        priorityId: 1,
        statusId: 1,
        budget: 0,
        text: `added subtask "${this.title}"`,
      }

      // console.log(subData)
      this.$store.dispatch("subtask/createSubtask", subData)
        .then(t => {
          // console.log(t)
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

    validateInput: _.debounce(function() {
      if (this.$refs.subtaskNameInput.validity.valid) {
        // console.info('valid input');
        this.$refs.subtaskNameInput.classList.remove("error")
        this.createSubtask()
      } else {
        // console.log('invalid input')
        this.$refs.subtaskNameInput.classList.add("error")
      }
    }, 1500),

    debounceUpdate: _.debounce(function(subtask, data) {
      this.updateSubtask(subtask, data)
    }, 1500),

    markComplete(subtask){
      // let sub = subtask
      if (subtask.isDone) {
        subtask.statusId = 1
        subtask.isDone = false
      } else {
        subtask.isDone = true
        subtask.statusId = 5
      }
      // console.log(subtask.id, subtask.statusId, subtask.isDone)

      this.updateSubtask(subtask, {statusId: subtask.statusId, isDone: subtask.isDone})
    },

    async updateSubtask(subtask, data){
      // console.log(subtask.id, key, subtask[key])
      const sub = await this.$store.dispatch("subtask/updateSubtask", { id: subtask.id, data: data })
      // console.log(sub.data)
      if (sub.statusCode == 200) {
        // console.log('update subtask success->', sub.data)
        this.subkey += 1
      } else {
        console.warn("error")
      }
    },

    async deleteSubtask(subtask) {
      this.loading = true
      const delsub = await this.$store.dispatch("subtask/deleteSubtask", { ...subtask, text: `deleted subtask "${subtask.title}"` });
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
  margin-bottom: 1rem;
}

.sub-title {
  font-size: 1rem;
}

.sub-input {
  border: 1px solid $dark;
  border-radius: 0.25rem;
  padding: 0.25rem;

  &:focus {
    outline: none;
  }

  &:focus:invalid {
    outline: 3px solid $danger-sub3;
  }

  &:invalid {
    border-color: $danger;
  }
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
      padding: 0.25rem 0.25rem 0.25rem 0.25rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-light);
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      color: var(--bib-text-light);
      &:first-child { padding-left: 0 }
      &:last-child { padding-right: 0 }
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

    td,
    th {
      background-color: $light;

    }
  }

  tbody {
    td {
      padding: 0.25rem 0.25rem 0.25rem 0.25rem;
      border-top: 1px solid var(--bib-light);
      border-bottom: 1px solid var(--bib-light);
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      color: var(--bib-dark-sub1);
      &:first-child { padding-left: 0 }
      &:last-child { padding-right: 0 }
    }
  }
}

::v-deep {
  .bib-select {
    .select__real {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .input {
    input {
      margin-top: 0;
      margin-bottom: 0;
      background-color: transparent;
      border-color: transparent;
    }
  }
  .vdp-datepicker {
    > :first-child { display: inline-flex; align-items: center; }
    input { border: 0 none; outline: none 0; max-width: 7rem;
      &:focus { outline: none 0; border: 0 none; }
    }
  }
  .bib-select {
    width: 12rem; height: 2rem;
    &.bib-select--sm {
      .select__real { margin: 0;}
    }
    &.bg-white {
      .select__btn { background-color: transparent; padding: 0;}
    }
  }
}

/*.bib-select {
  width: 8rem;
  .select__btn { background-color: transparent;}
}*/

</style>
