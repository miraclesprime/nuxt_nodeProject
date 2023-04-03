<template>
  <client-only>
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
    <div class="position-relative">
      
    <table class="table ">
      <thead v-if="localSubTasks.length > 0">
        <tr>
          <th>Subtasks</th>
          <th>Assignee</th>
          <th width="150">Due date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="newSubtask" class="new">
          <td>
            <div class="d-flex gap-05 align-center">
              <bib-icon icon="check-circle-solid" variant="white" :scale="1.25"></bib-icon>
              <input class="sub-input" ref="subtaskNameInput" type="text" v-model.trim="title" :disabled="loading" pattern="[a-zA-Z0-9-_ ]+" @keyup="validateInput" required placeholder="Enter text...">
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
            <div class="d-flex align-center gap-025">
              <bib-icon icon="calendar" variant="gray4"></bib-icon>
              <span>Set due...</span>
            </div>
            <!-- <bib-input type="date" size="sm" icon-left="calendar" v-model="date" placeholder="Set date..."></bib-input> -->
            <!-- <bib-datepicker v-model="date" size="sm" class="align-right" format="dd MMM yyyy" placeholder="Set date..."></bib-datepicker> -->
          </td>
          <!-- <td>
            <div class="d-flex gap-05">
              <bib-icon icon="trash" variant="gray5" v-on:click="newSubtask = false"></bib-icon>
              <bib-icon icon="tick" variant="success" v-on:click="createSubtask"></bib-icon>
            </div>
          </td> -->
        </tr>
        <tr class="table-row" v-for="sub in localSubTasks" :key="sub.id + subkey" @click.right.prevent="subtaskRightClick($event, sub)" v-click-outside="closeContext">
          <!-- <td>{{sub.key}}</td> -->
          <td>
            <div class="d-flex gap-05 align-center">
              <span class="cursor-pointer" style="width:20px; height:20px" @click="markComplete(sub)"><bib-icon icon="check-circle-solid" :scale="1.25" :variant="sub.isDone ? 'success' : 'gray4'"></bib-icon></span>
              <input type="text" class="editable-input sm" v-model="sub.title" @input="debounceUpdate(sub, {field: 'title', value: sub.title, name: 'Title'})">
              <span class="cursor-pointer shape-rounded width-105 height-105 align-center justify-center bg-hover-light" v-tooltip="'Detail'" @click="$emit('view-subtask', sub)" >
                <bib-icon icon="arrow-right" :scale="1" variant="gray5" ></bib-icon>
              </span>
            </div>
          </td>
          <td>
            <bib-select :key="subkey" :options="orgUsers" v-model="sub.userId" size="sm" class="bg-white" v-on:change="updateSubtask(sub, {field: 'userId', value: sub.userId, name: 'User'})"></bib-select>
            <!-- <user-info :userId="sub.userId"></user-info> -->
          </td>
          <td>
            <div class="d-inline-flex align-center gap-025 position-relative" >
              <bib-icon icon="calendar" variant="gray4"></bib-icon>
              <!-- <bib-datepicker size="sm" v-model="sub.dueDate" format="dd MM YYYY" @input="updateSubtask(sub, {field: 'dueDate', value: sub.dueDate, name: 'Due date'})" placeholder="Select date..." class="align-right" ></bib-datepicker> -->
              <datepicker v-model="sub.dueDate" format="dd MMM yyyy" @input="updateSubtask(sub, {field: 'dueDate', value: sub.dueDate, name: 'Due date'})" placeholder="Select date..." class="align-right" ></datepicker>
            </div>            
          </td>
          <!-- <td>
            <div class="d-flex align-center justify-end gap-025">
              <span v-show="sub.canDelete" class="cursor-pointer shape-rounded width-105 height-105 align-center justify-center bg-hover-light" v-tooltip="'Delete'" @click="deleteSubtask(sub)">
                <bib-icon icon="trash-solid" :scale="1" variant="gray5"></bib-icon>
              </span>
            </div>
          </td> -->
        </tr>
      </tbody>
    </table>
    <!-- subtask context menu -->
    <table-context-menu :items="subtaskContextMenu" :show="showContext" :coordinates="popupCoords" :activeItem="activeSubtask" @close-context="closeContext" ref="task_menu" @item-click="contextItemClick"></table-context-menu>
    <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
    <!-- <loading :loading="loading"></loading> -->
    </div>
  </div>
</client-only>
</template>
<script>
import { DEPARTMENT, STATUS, PRIORITY, SUBTASK_CONTEXT_MENU } from '~/config/constants.js'
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import _ from 'lodash'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { faCalendar } from '@fortawesome/free-regular-svg-icons';
// import Datepicker from 'vue-datepicker'
export default {
  name: "SidebarSubtask",
  /*props: {
    reloadSubtask: Number
  },*/

  data: function() {
    return {
      statusValues: STATUS,
      priorityValues: PRIORITY,
      // faCalendar,
      /*sortingItems: [
        { label: "Name", value: "name" },
        { label: "Assignee", value: "assignee" },
        { label: "Due Date", value: "dueDate" },
        // { label: "Status", value:"status" },
      ],*/
      subtaskContextMenu: SUBTASK_CONTEXT_MENU,
      showContext: false,
      popupCoords: {},
      userPickerOpen: false,
      datePickerOpen: false,
      newSubtask: false,
      activeSubtask: {},
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
      alertDialog: false,
      alertMsg:"",
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
      let completeData = [{ label: 'Please select...', value: null }, ...data];
        this.subkey++;
      return completeData;
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
      // console.log(newVal)
      if (Object.keys(newVal).length > 0) {
        this.loading = true
        this.user = this.teamMembers.find(t => t.id == this.currentTask.userId)
        // this.user = usr[0]
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
          .then(() => {
            // console.log('subtask fetched')
            this.subkey++;
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
  created(){
    this.newSubtask = false
    this.$nuxt.$on("delete-subtask", (subtask) => {
      if (subtask.id) {
        this.deleteSubtask(subtask)
      } else {
        console.log('No subtask to delete')
      }
    })
  },
  methods: {
    subtaskRightClick($event, subtask) {
      this.showContext = true
      this.userPickerOpen = false
      this.datePickerOpen = false
      // console.log($event)

      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeSubtask = subtask
    },
    closeContext(){
      this.showContext = false
    },
    contextItemClick(key) {
      console.log(key)
      switch (key) {
        case 'done-subtask':
          this.markComplete(this.activeSubtask)
          break;
        case 'view-subtask':
          this.$emit("view-subtask", this.activeSubtask)
          break;
        case 'delete-subtask':
          this.deleteTask(this.activeSubtask)
          break;
        case 'copy-subtask':
          this.copyLink(this.activeSubtask)
          break;
        case 'gotoTeam':
          this.$nuxt.$emit('add-member-to-subtask')
          break;
        /*case 'gotoComment':
          this.openSidebar(this.activeSubtask)
          break;
        case 'gotoFiles':
          this.openSidebar(this.activeSubtask)
          break;*/
        
        default:
          // alert("no task assigned")
          this.alertDialog = true
          this.alertMsg = "no task assigned"
          break;
      }
    },
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
        departmentId: 1,
        description: "",
        startDate: "",
        dueDate: "",
        priorityId: 2,
        statusId: 1,
        budget: 0,
        text: `added subtask "${this.title}"`,
      }

      if (this.title) {}

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

    validateInput(){
      // let sb = _.trim(this.title)
      if (this.$refs.subtaskNameInput.validity.valid && this.title != "") {
        // console.info('valid input', this.title);
        this.$refs.subtaskNameInput.classList.remove("error")
        this.debounceCreate()
      } else {
        // console.log('invalid input')
        this.$refs.subtaskNameInput.classList.add("error")
      }
    },

    debounceCreate: _.debounce(function() {
      // console.warn("debounceCreate fired")
      this.createSubtask()
    }, 800),

    debounceUpdate: _.debounce(function(subtask, data) {
      this.updateSubtask(subtask, data)
    }, 800),

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

      this.updateSubtask(subtask, {field: 'statusId', value: subtask.statusId, name: 'Status'})
    },

    async updateSubtask(subtask, data){
      let updata = {[data.field]: data.value}
      let userobj = {}
      let sub
      let histvalue = data.value
      if (data.name == 'Status' && data.value == 5) {
          updata = { [data.field]: data.value, isDone: true }
          let st = this.statusValues.find(s => s.value == data.value)
          histvalue = st.label
      } 
      
      if (data.name == 'Status' && data.value != 5) {
          updata = { [data.field]: data.value, isDone: false }
          let st = this.statusValues.find(s => s.value == data.value)
          histvalue = st.label
      } 

      if ( data.name == "Priority"){
          let pr = this.priorityValues.find(p => p.value == data.value)
          histvalue = pr.label
      }

      if(data.name == 'Title') {
        updata = { [data.field]: data.value }
      }

      if (data.name == "Due date") {
        histvalue = dayjs(data.value).format('DD MMM YYYY')
      }

      if (data.name == 'User') {
          userobj = this.$userInfo(data.value)
          let user = { id: userobj.Id, email: userobj.Email, firstName: userobj.FirstName, lastName: userobj.LastName }
          sub = await this.$store.dispatch("subtask/updateSubtask", {
            id: subtask.id,
            data: updata,
            user,
            text: `updated ${data.name} to ${userobj.Name}`
          })
      } else {
          // console.log(data, userobj, updata)
          sub = await this.$store.dispatch("subtask/updateSubtask", {
            id: subtask.id,
            data: updata,
            text: `updated ${data.name} to ${histvalue}`
          })
      }
      // console.log(sub.data)
      if (sub.statusCode == 200) {
          this.$store.dispatch("subtask/setSelectedSubtask", sub.data)
          this.$store.dispatch('subtask/fetchSubtasks', this.currentTask).then(() => {
            this.$emit('reload-subtask')
          })
      } else {
          console.warn("error")
      }
    },

    async deleteSubtask(subtask) {
      this.loading = true
      const delsub = await this.$store.dispatch("subtask/deleteSubtask", { ...subtask, text: `deleted subtask "${subtask.title}"` });
      if (delsub.statusCode == 200) {
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
        // this.$nuxt.$emit("refresh-history")
        this.$emit('close-sidebar-detail')
        this.$store.dispatch("subtask/setSelectedSubtask", "")
      }
      this.loading = false
    },

    copyLink(subtask) {
      let url = window.location.host + `/subtask/${subtask.id}`;
      if (navigator.clipboard) { 
        navigator.clipboard.writeText(url);
      } else { 
        unsecuredCopyToClipboard(url);
      }
    }
    
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

  .table-row {  }

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
    &.align-right {
      .vdp-datepicker__calendar { right: 0;}
    }
    > :first-child { display: inline-flex; align-items: center; }
    input { border: 0 none; outline: none 0; max-width: 6rem;
      &:focus { outline: none 0; border: 0 none; }
    }
    &__clear-button { color: $gray5; font-size: $font-size-sm;
      i { font-style: normal;}
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
