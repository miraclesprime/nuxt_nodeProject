<template>
  <client-only>
  <div class="task-group w-100 position-relative py-05 px-2" id="sbs-task-group-main-wrapper">
    <div id="sbs-task-group-title-wrapper" class="border-bottom-gray2 d-flex justify-between sub-title pb-025">
      <p id="sbs-task-group-title" class="text-gray6 font-sm">Subtasks </p>
    </div>
    <div id="sbs-subtask-title-wrapper" class="section-title w-100 py-025">
      <div v-if="newSubtask" class="d-inline-flex gap-05 align-center py-025 px-05 shape-rounded bg-success-sub6 bg-hover-success-sub3 text-success  cursor-pointer" id="sbs-newSubtask" @click="newSubtask = false">
        <bib-icon icon="close" variant="success" :scale="1.2"></bib-icon>
        <span id="sbs-cancel">Cancel</span>
      </div>
      <div v-else id="sbs-openCreateSubtask" class="d-inline-flex gap-05 align-center py-025 px-1 shape-rounded bg-success-sub6 bg-hover-success-sub3 text-success  cursor-pointer" @click="openCreateSubtask">
        <bib-icon icon="add" variant="success" :scale="1.2"></bib-icon>
        <span id="sbs-addSubtask">Add Subtask</span>
      </div>
    </div>
    <div class="position-relative" id="sbs-table-wrapper">
      
    <table class="table " v-click-outside="removeSelection">
      <thead v-if="localSubTasks.length > 0">
        <tr id="sbs-table-row">
          <th id="sbs-h1">Subtasks</th>
          <th id="sbs-h2">Assignee</th>
          <th id="sbs-h3" width="150">Due date</th>
          <th id="sbs-h4"></th>
        </tr>
      </thead>
      <tbody>
       
        <tr class="table-row" v-for="(sub, index) in localSubTasks" :id="'sbs-'+index" :key="sub.id + subkey" v-bind:class="{'selectedSubRow':rowIsSelected(sub.id)}" @click.prevent= "selectSubTaskRow($event,sub)" @click.right.prevent="subtaskRightClick($event, sub)" v-click-outside="closeContext" :ref="'sbs_' + index">
          <td id="sbs-table-row-2">
            <div class="d-flex gap-05 align-center" id="sbs-icons">
              <span class="cursor-pointer" id="sbs-check-circle-solid" style="width:20px; height:20px" @click="markComplete(sub)"><bib-icon icon="check-circle-solid" :scale="1.25" :variant="sub.isDone ? 'success' : 'gray4'"></bib-icon></span>
              <input type="text" class="editable-input sm" id="sbs-editable-input-1" v-model="sub.title" @input="debounceUpdate(sub, {field: 'title', value: sub.title, name: 'Title'})">
              <span class="cursor-pointer shape-rounded width-105 height-105 align-center justify-center bg-hover-light" id="sbs-detail" v-tooltip="'Detail'" @click="$emit('view-subtask', sub)" >
                <bib-icon icon="arrow-right" :scale="1" variant="gray5" ></bib-icon>
              </span>
            </div>
          </td>
          <td id="sbs-td-1">
            <bib-select :key="subkey" :options="orgUsers" v-model="sub.userId" size="sm" class="bg-white" v-on:change="updateSubtask(sub, {field: 'userId', value: sub.userId, name: 'User'})"></bib-select>
          </td>
          <td id="sbs-td-2">
            <div class="d-inline-flex align-center gap-025 position-relative" >
              <bib-icon icon="calendar" variant="gray4"></bib-icon>
              <datepicker v-model="sub.dueDate" format="dd MMM yyyy" @input="updateSubtask(sub, {field: 'dueDate', value: sub.dueDate, name: 'Due date'})" placeholder="Select date..." class="align-right" ></datepicker>
            </div>            
          </td>
        </tr>
        <tr v-if="newSubtask" class="new" id="sbs-tr-2">
          <td id="sbs-td-3">
            <div class="d-flex gap-05 align-center" id="sbs-white-check-circle-solid">
              <bib-icon icon="check-circle-solid" variant="white" :scale="1.25"></bib-icon>
              <input class="sub-input" ref="subtaskNameInput" type="text" v-model.trim="title" id="sbs-subtaskNameInput" :disabled="loading" pattern="[a-zA-Z0-9-_ ]+" @input="validateInput" @keyup.enter="validateInput" required placeholder="Enter text...">
            </div>
          </td>
          <td id="sbs-td-4">
            <div class="d-flex align-center gap-05" id="sbs-assign-to-wrapper">
              <bib-avatar size="1.25rem"></bib-avatar>
              <span id="sbs-assign-to">Assign to...</span>
            </div>
          </td>
          <td id="sbs-td-5">
            <div class="d-flex align-center gap-025" id="sbs-setdue-wrapper">
              <bib-icon icon="calendar" variant="gray4"></bib-icon>
              <span id="sbs-setdue">Set due...</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- subtask context menu -->
    <table-context-menu :items="subtaskContextMenu" :show="showContext" :coordinates="popupCoords" :activeItem="activeSubtask" @close-context="closeContext" ref="task_menu" @item-click="contextItemClick"></table-context-menu>
    <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
    <!-- <loading :loading="loading"></loading> -->

    <bib-modal-wrapper v-if="taskTeamModal" title="Team" size="lg" @close="taskTeamModal = false">
      <template slot="content">
        <div style="min-height: 12rem;" id="sbs-task-team">
          <task-team :task="activeSubtask" mode="subtask" ></task-team>
        </div>
      </template>
    </bib-modal-wrapper>
    </div>
  </div>
</client-only>
</template>

<script>
import {  STATUS, PRIORITY, SUBTASK_CONTEXT_MENU } from '~/config/constants.js'
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
import _ from 'lodash'
export default {
  name: "SidebarSubtask",

  data: function() {
    return {
      statusValues: STATUS,
      priorityValues: PRIORITY,
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
      user: {},
      flag: false,
      loading: false,
      subkey: 0,
      alertDialog: false,
      alertMsg:"",
      taskTeamModal: false,
      ctrlSelectedRows: [],
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
      if (Object.keys(newVal).length > 0) {
        this.loading = true
        this.user = this.teamMembers.find(t => t.id == this.currentTask.userId)
        this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
          .then(() => {
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
  created(){
    this.ctrlSelectedRows=[]
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
    removeSelection() {
      let i;
      this.localSubTasks.forEach((ele, idx) => {
        this.$refs['sbs_' + idx][0].classList.remove('selectedSubRow');
      });
    }, 

    subtaskRightClick($event, subtask) {
      this.showContext = true
      this.userPickerOpen = false
      this.datePickerOpen = false

      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeSubtask = subtask
      if(subtask.statusId==5){
       this.subtaskContextMenu=this.subtaskContextMenu.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
      }
      else {
         this.subtaskContextMenu=this.subtaskContextMenu.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
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
          this.deleteSubtask(this.activeSubtask)
          break;
        case 'copy-subtask':
          this.copyLink(this.activeSubtask)
          break;
        case 'gotoTeam':
          this.taskTeamModal = true
          break;
        
        default:
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
        departmentId: null,
        description: "",
        startDate: "",
        dueDate: "",
        priorityId: null,
        statusId: null,
        budget: 0,
        text: `added subtask "${this.title}"`,
      }

      if (this.title) {}

      this.$store.dispatch("subtask/createSubtask", subData)
        .then(t => {
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
      if (this.$refs.subtaskNameInput.validity.valid && this.title != "") {
        this.$refs.subtaskNameInput.classList.remove("error")
        this.debounceCreate()
      } else {
        this.$refs.subtaskNameInput.classList.add("error")
      }
    },
    selectSubTaskRow($event,sub){
          if (event.ctrlKey || event.metaKey) {
            const subTaskIndex = this.ctrlSelectedRows.findIndex(item => item.id === sub.id);
            if (subTaskIndex === -1) {
              this.ctrlSelectedRows.push(sub);
            } else {
              this.ctrlSelectedRows.splice(subTaskIndex, 1);
            }
          } else {
            this.ctrlSelectedRows=[]
          }
        
    },
    rowIsSelected(index){
      return  this.ctrlSelectedRows.some(item => item.id === index);
    },

    debounceCreate: _.debounce(function() {
      this.createSubtask()
    }, 800),

    debounceUpdate: _.debounce(function(subtask, data) {
      this.updateSubtask(subtask, data)
    }, 800),

    markComplete(subtask){
      if (subtask.isDone) {
        subtask.statusId = 1
        subtask.isDone = false
      } else {
        subtask.isDone = true
        subtask.statusId = 5
      }

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
          sub = await this.$store.dispatch("subtask/updateSubtask", {
            id: subtask.id,
            data: updata,
            text: `updated ${data.name} to ${histvalue}`
          })
      }
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
      let delSub
      let MultiData=[]
      if(this.ctrlSelectedRows.length>0){
        this.ctrlSelectedRows.map((item)=>{
          MultiData = [...MultiData, { id: item.id, userId: item.userId }];
        })
        delSub= await this.$store.dispatch("subtask/deleteSubtask", { delData:MultiData, text: `deleted Multisubtask"`,key:"multi"});
      }
      else {
        delSub = await this.$store.dispatch("subtask/deleteSubtask", { ...subtask, text: `deleted subtask "${subtask.title}"`,key:"single" })
      }
      if (delSub.statusCode == 200) {
              this.$store.dispatch("subtask/fetchSubtasks", this.currentTask)
              this.$emit('close-sidebar-detail')
              this.$store.dispatch("subtask/setSelectedSubtask", "")
            }
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
.selectedSubRow {
  background-color:#fbf2f2
  // color: black;
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

</style>
