<template>
  <client-only>
    <div id="favorite_wrapper" class="favorite-wrapper h-100">
      <page-title title="Favorites"></page-title>
      <favorite-actions v-on:change-viewing="changeView" v-on:change-sorting="changeSort" ></favorite-actions>
      <!-- @search-projects-tasks="searchProjectOrTasks" -->
      <div id="favorite-scroll-wrap" class="favorite-tables position-relative " >
        <!-- project table -->
        <div style="height:50%;">
          <advance-table :drag="false" :tableFields="projectTableFields" :tableData="projLocalData" :lazyComponent="true" :contextItems="projectContextItems" @context-item-event="projContextItemClick" @row-click ="projectRoute" @table-sort="sortProject" @context-open="projectContextOpen" @title-click="projectRoute" @update-field="updateProject" sectionTitle="Favorite Projects" :plusButton="false" :key="templateKey"></advance-table>

        </div>

        <!-- task table -->
        <div style="height:50%;">
          <advance-table :drag="false" :tableFields="taskTableFields" :tableData="taskSubtaskLocalData" :lazyComponent="true" :contextItems="taskContextMenuItems" @context-item-event="taskContextItemClick" @row-click ="openSidebar" @table-sort="sortTask" @context-open="taskContextOpen"  @title-click="openSidebar" @update-field="updateTask" sectionTitle="Favorite Tasks" :plusButton="false" :key="templateKey"></advance-table>
        </div>

        <!-- <loading :loading="loading"></loading> -->
      </div>

      <!-- subtask panel -->
      <transition name="drawer">
        <article v-if="subPanel" id="sub-panel" class="side-panel" v-click-outside="closeSubPanel">
          <keep-alive>
            <subtask-detail titleClick="task" @close-sidebar-detail="subPanel = false"></subtask-detail>
          </keep-alive>
        </article>
      </transition>
      <!-- project rename modal -->
      <bib-modal-wrapper v-if="renameModal" title="Rename project" @close="renameModal = false">
        <template slot="content">
          <div>
            <bib-input type="text" v-model.trim="currentProject.title" placeholder="Enter name..."></bib-input>
            <!-- <loading2 :loading="loading2"></loading2> -->
          </div>
        </template>
        <template slot="footer">
          <div class="d-flex justify-between">
            <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
            <bib-button label="Rename" variant="success" pill v-on:click="renameProject"></bib-button>
          </div>
        </template>
      </bib-modal-wrapper>
      <!-- popup notification -->
      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="'noti-'+index" :message="msg.text" :variant="msg.variant" autohide="5000">
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
      <!-- confirm delete task -->
      <!-- <confirm-dialog v-if="confirmModal" :message="confirmMsg" @close="confirmDelete"></confirm-dialog> -->
      <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
    </div>
  </client-only>
</template>

<script>
import _ from 'lodash'
import { PROJECT_FAVORITES, TASK_FAVORITES, PROJECT_CONTEXT_MENU, TASK_CONTEXT_MENU } from '../../config/constants'
import { mapGetters, mapActions } from 'vuex';
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "Favorites",
  data() {
    return {
      projectTableFields: PROJECT_FAVORITES,
      taskTableFields: TASK_FAVORITES,
      sortedProject: [],
      renameModal: false,
      sortedTask: [],
      sortedSubtask: [],
      activeProject: {},
      currentProject: {},
      activeTask: {},
      taskToDelete: {},
      popupMessages: [],
      key: 0,
      templateKey: 0,
      loading: false,
      loading2: false,
      view: 'all',
      projSortName: '',
      taskSortName: '',
      pTitleSort: 'asc',
      pStatusSort: 'asc',
      pPrioritySort: 'asc',
      pDepartmentSort: 'asc',
      pUserSort: 'asc',
      pStartDateSort: 'asc',
      pDueDateSort: 'asc',
      tTitleSort: 'asc',
      tStatusSort: 'asc',
      tPrioritySort: 'asc',
      tProjSort: 'asc',
      tDepartmentSort: 'asc',
      tDifficultySort: 'asc',
      tUserSort: 'asc',
      tStartDateSort: 'asc',
      tDueDateSort: 'asc',
      projectContextMenu: false,
      projectContextItems: PROJECT_CONTEXT_MENU,
      projUserpickerOpen: false,
      projDatepickerOpen: false,
      projStatuspickerOpen: false,
      projPriorityPickerOpen: false,
      projDeptPickerOpen: false,
      popupCoords: {},
      datepickerArgs: { label: null, field: null },
      taskContextMenu: false,
      taskContextMenuItems: TASK_CONTEXT_MENU,
      taskUserpickerOpen: false,
      taskDatepickerOpen: false,
      taskStatuspickerOpen: false,
      taskPrioritypickerOpen: false,
      taskDeptpickerOpen: false,
      alertDialog: false,
      alertMsg: "",
      projLocalData: [],
      taskLocalData: [],
      taskSubtaskLocalData: [],
      subPanel: false,
    }
  },

  computed: {
    ...mapGetters({
      favProjects: 'project/getFavoriteProjects',
      favTasks: 'task/getFavTasks',
      favSubtasks: "subtask/getFavSubtasks",
      teamMembers: "user/getTeamMembers",
      filterViews:'task/getFilterView',
    }),

  },
  watch: {
      filterViews(newVal) {
          return _.cloneDeep(newVal)
      },
    },

  //   async asyncData({$axios, app,store}){

  // const token = app.$cookies.get(process.env.SSO_COOKIE_NAME)
  // const filter=store.getters['task/getFilterView']
  // const fav = await $axios.get("project/user/favorites", {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,'Filter': filter 
  //       }
  //     })
  // return { localData: res.data.data}

  // },

  created() {
    if (process.client) {
      this.$nuxt.$on("update-key", (msg) => {
        this.fetchFavProjects()
        this.getFavTasks()
        if (msg) {
          this.popupMessages.push({ text: msg, variant: 'success' })
        }
      })

    }
  },

  mounted() {

    for(let field of this.projectTableFields) {
      if(field.header_icon) {
        if(field.key == 'priority') {
          field.header_icon.isActive = true;
        } else {
          field.header_icon.isActive = false;
        }
      }
    }

    for(let field of this.taskTableFields) {
      if(field.header_icon) {
        if(field.key == 'priority') {
          field.header_icon.isActive = true;
        } else {
          field.header_icon.isActive = false;
        }
      }
    }

    this.loading = true
    let user = JSON.parse(localStorage.getItem("user"))
    this.$store.dispatch("company/fetchCompanyMembers", user.subb)
    this.$store.dispatch('project/fetchFavProjects')
    .then(() => {
      this.fetchProjects()
    })

    const fetchTask = this.$store.dispatch('task/getFavTasks')
    const fetchSubtask = this.$store.dispatch("subtask/fetchFavorites")
    Promise.all([fetchTask, fetchSubtask]).then((values) => {
      values[0].data.forEach(d => { 
        this.taskSubtaskLocalData.push(d.task)
        this.sortedTask.push(d.task)
        })
      values[1].data.forEach(d => {
        if(d.subtasks){
          this.taskSubtaskLocalData.push({...d.subtasks, project: d.subtasks.task?.project || {}})
          this.sortedTask.push({...d.subtasks, project: d.subtasks.task?.project || {}})
        }
      })

      let newArr = []

      for(let i=0; i < this.taskSubtaskLocalData.length; i++) {
        if(this.taskSubtaskLocalData[i].priorityId) {
          newArr.unshift(this.taskSubtaskLocalData[i])
        } else {
          newArr.push(this.taskSubtaskLocalData[i])
        }
      }

      newArr.sort((a,b) => {
        if(a.priorityId && b.priorityId) {
          return a.priorityId - b.priorityId
        }
      })

      this.taskSubtaskLocalData = newArr;
    })
  },

  methods: {

    ...mapActions({
      fetchFavProjects: "project/fetchFavProjects",
      setSingleTask: "task/setSingleTask",
      getFavTasks: "task/getFavTasks",
    }),

    closeSubPanel(){
      this.subPanel = false
    },

    async fetchProjects() {
      let favProj = await JSON.parse(JSON.stringify(this.favProjects))
      let prArr = []
      let newArr = []

      favProj.forEach(p => { prArr.push(p.projects) })

      for(let i=0; i < prArr.length; i++) {
          if(prArr[i].priorityId) {
            newArr.unshift(prArr[i])
          } else {
            newArr.push(prArr[i])
          }
        }

      newArr.sort((a,b) => {
        if(a.priorityId && b.priorityId) {
          return a.priorityId - b.priorityId
        }
      })

        
      this.projLocalData = newArr
      this.sortedProject = newArr
      if (this.projSortName) {
        this.sortProject(this.projSortName) //forever loop
      }
      this.loading = false
    },

    async fetchTasks() {
      const favTask = await _.cloneDeep(this.favTasks)
      const favSubtask = await _.cloneDeep(this.favSubtasks)

      let taskSubtask = [...favTask, ...favSubtask]

      let stsArr = []
      taskSubtask.forEach(el => {
        if (el.hasOwnProperty('taskId')) {
          stsArr.push(el.task)
        } else {
          if (el.subtasks) {
            stsArr.push({...el.subtasks, project: el.subtasks.task?.project})
          }
        }
      })
      this.taskSubtaskLocalData = stsArr
      this.sortedTask = stsArr
      if (this.taskSortName) {
        this.sortTask(this.taskSortName) //forever loop issue
      }
      this.loading = false
    },
    projectContextOpen(item){
      if(this.$CheckFavProject(item.id)){
       this.projectContextItems=this.projectContextItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.projectContextItems=this.projectContextItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
    },
    taskContextOpen(item){
      if(this.$CheckFavTask(item.id)){
       this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
      else{
        this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Remove favorite" ? { ...item, label: "Add to Favorites"} : item);
      }
      if(item.statusId==5){
       this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
      }
      else {
         this.taskContextMenuItems=this.taskContextMenuItems.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
    },
    projectRoute(project) {
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        return false
      }
      this.$router.push('/projects/' + project.id)
    },

    changeView($event) {
      if ($event == 'complete') {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
        this.fetchProjects().then(() => {
          let com = this.projLocalData.filter(p => p.statusId == 5)
          this.projLocalData = com
        })
        this.fetchTasks().then(() => {
          let com = this.taskSubtaskLocalData.filter(t => t.statusId == 5)
          this.taskSubtaskLocalData = com
        })

      }

      if ($event == 'incomplete') {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
        this.fetchProjects().then(() => {
          let com = this.projLocalData.filter(p => p.statusId != 5)
          this.projLocalData = com
        })
        this.fetchTasks().then(() => {
          let com = this.taskSubtaskLocalData.filter(t => t.statusId != 5)
          this.taskSubtaskLocalData = com
        })
      }

      if ($event == 'all') {
        this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
      }

    },
    changeSort($event) {
      console.log($event)
      if($event == 'difficultyId' || $event == 'project') {
        this.sortTask($event)
      } else {
        this.sortProject($event)
        this.sortTask($event)
      }
    },

    checkActive() {
      for (let i = 0; i < this.projectTableFields.length; i++) {
        if (this.projectTableFields[i].header_icon) {
          this.projectTableFields[i].header_icon.isActive = false
        }

        if (this.projectTableFields[i].header_icon && this.projectTableFields[i].key == this.projSortName) {
          this.projectTableFields[i].header_icon.isActive = true
        }
      }
      for (let i = 0; i < this.taskTableFields.length; i++) {
        if (this.taskTableFields[i].header_icon) {
          this.taskTableFields[i].header_icon.isActive = false
        }

        if (this.taskTableFields[i].header_icon && this.taskTableFields[i].key == this.taskSortName) {
          this.taskTableFields[i].header_icon.isActive = true
        }
      }
      this.templateKey++;
    },

    resetProjSorts(sName) {

      switch (sName) {
        case 'title':
          this.pStatusSort = 'asc';
          this.pUserSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pDueDateSort = 'asc';
          break;
      
        case 'userId':
          this.pStatusSort = 'asc';
          this.pTitleSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pDueDateSort = 'asc';
          break;
        
        case 'status':
          this.pTitleSort = 'asc';
          this.pUserSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pDueDateSort = 'asc';
          break;

        case 'priority':
          this.pStatusSort = 'asc';
          this.pUserSort = 'asc';
          this.pTitleSort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pDueDateSort = 'asc';
          break;

        case 'department':
          this.pStatusSort = 'asc';
          this.pUserSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pTitleSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pDueDateSort = 'asc';
          break;

        case 'startDate':
          this.pStatusSort = 'asc';
          this.pUserSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pTitleSort = 'asc';
          this.pDueDateSort = 'asc';
          break;

        case 'dueDate':
          this.pStatusSort = 'asc';
          this.pUserSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pTitleSort = 'asc';
          break;

        default:
          this.pTitleSort = 'asc';
          this.pStatusSort = 'asc';
          this.pUserSort = 'asc';
          this.pPrioritySort = 'asc';
          this.pDepartmentSort = 'asc';
          this.pStartDateSort = 'asc';
          this.pDueDateSort = 'asc';
          break;
      }
    },


    resetTaskSorts(sName) {

      switch (sName) {

        case 'title':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;
      
        case 'userId':
          this.tStatusSort = 'asc';
          this.tTitleSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;
        
        case 'status':
          this.tTitleSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;

        case 'priority':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tTitleSort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;

        case 'department':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tTitleSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;

        case 'startDate':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tTitleSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;

        case 'dueDate':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tTitleSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tProjSort = 'asc';
          break;
        
        case 'project':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tTitleSort = 'asc';
          break;

        case 'difficultyId':
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tTitleSort = 'asc';
          this.tProjSort = 'asc';
          break;

        default:
          this.tStatusSort = 'asc';
          this.tUserSort = 'asc';
          this.tPrioritySort = 'asc';
          this.tDepartmentSort = 'asc';
          this.tStartDateSort = 'asc';
          this.tDueDateSort = 'asc';
          this.tDifficultySort = 'asc';
          this.tTitleSort = 'asc';
          this.tProjSort = 'asc';
          break;
      }
    },

    sortProject(field) {
      
      this.projSortName = field
      switch (field) {

        case 'title':
          if (this.pTitleSort == "asc") {
            this.projLocalData.sort((a, b) => a.title.localeCompare(b.title))
            this.pTitleSort = "desc"
          } else {
            this.projLocalData.sort((a, b) => b.title.localeCompare(a.title))
            this.pTitleSort = "asc"
          }

          this.key += 1
          this.projSortName = 'title'
          this.resetProjSorts(field);
          this.checkActive()
          break;

        case 'status':
          let sArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].statusId) {
              sArr.unshift(this.projLocalData[i])
            } else {
              sArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = sArr;

          if (this.pStatusSort == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.status && b.status) { return a.statusId - b.statusId }
            });
            this.pStatusSort = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.status && b.status) { return b.statusId - a.statusId }
            });
            this.pStatusSort = "asc"
          }

          this.key += 1
          this.projSortName = 'status'
          this.resetProjSorts(field)
          this.checkActive()
          break;

        case 'priority':
          let pArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].priorityId) {
              pArr.unshift(this.projLocalData[i])
            } else {
              pArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = pArr;

          if (this.pPrioritySort == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.priority && b.priority) { return a.priority.id - b.priority.id }
            });
            this.pPrioritySort = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.priority && b.priority) { return b.priority.id - a.priority.id }
            });
            this.pPrioritySort = "asc"
          }
          this.key += 1
          this.projSortName = 'priority'
          this.resetProjSorts(field);
          this.checkActive()
          break;

        case 'department':
          let deptArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].departmentId) {
              deptArr.unshift(this.projLocalData[i])
            } else {
              deptArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = deptArr;

          if (this.pDepartmentSort == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.departmentId && b.departmentId) { return a.department.title.localeCompare(b.department.title) }
            });
            this.pDepartmentSort = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.departmentId && b.departmentId) { return b.department.title.localeCompare(a.department.title) }
            });
            this.pDepartmentSort = "asc"
          }

          this.key += 1
          this.projSortName = 'department'
          this.resetProjSorts(field);
          this.checkActive()
          break;

        case 'userId':
          let uArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].userId) {
              uArr.unshift(this.projLocalData[i])
            } else {
              uArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = uArr;

          if (this.pUserSort == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.user && b.user) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.pUserSort = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.user && b.user) { b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.pUserSort = "asc"
          }
          this.key += 1
          this.projSortName = 'userId'
          this.resetProjSorts(field);
          this.checkActive()
          break;

        case 'dueDate':
          let dArr = []
          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].dueDate) {
              dArr.unshift(this.projLocalData[i])
            } else {
              dArr.push(this.projLocalData[i])
            }
          }

          this.projLocalData = dArr;
          if (this.pDueDateSort == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.pDueDateSort = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.pDueDateSort = "asc"
          }
          this.key += 1
          this.projSortName = 'dueDate'
          this.resetProjSorts(field);
          this.checkActive()
          break;

        case 'startDate':
          let dArr2 = []

          for (let i = 0; i < this.projLocalData.length; i++) {
            if (this.projLocalData[i].startDate) {
              dArr2.unshift(this.projLocalData[i])
            } else {
              dArr2.push(this.projLocalData[i])
            }
          }

          this.projLocalData = dArr2;
          if (this.pStartDateSort == "asc") {
            this.projLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(a.startDate) - new Date(b.startDate) }
            });
            this.pStartDateSort = "desc"
          } else {
            this.projLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(b.startDate) - new Date(a.startDate) }
            });
            this.pStartDateSort = "asc"
          }
          this.key += 1
          this.projSortName = 'startDate'
          this.resetProjSorts(field);
          this.checkActive()
          break;

        default:
          this.fetchProjects()
          break;
      }
    },

    async sortTask(field) {
      
      this.taskSortName = field

      switch (field) {

        case 'title':
          if (this.tTitleSort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => a.title.localeCompare(b.title))
            this.tTitleSort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => b.title.localeCompare(a.title))
            this.tTitleSort = "asc"
          }
          this.key += 1
          this.taskSortName = 'title'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case 'status':
          let taskStArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].statusId) {
              taskStArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskStArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskStArr;

          if (this.tStatusSort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => { 
              if (a.statusId && b.statusId) {
                return a.statusId - b.statusId;
              }
            });
            this.tStatusSort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => { 
              if (a.statusId && b.statusId) {
                return b.statusId - a.statusId;
              }
            });
            this.tStatusSort = "asc"
          }
          this.key += 1
          this.taskSortName = 'status'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case 'difficultyId':
          let taskDiffArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].difficultyId) {
              taskDiffArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskDiffArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskDiffArr;

          if (this.tDifficultySort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => { 
              if (a.difficultyId && b.difficultyId) {
                return a.difficultyId - b.difficultyId;
              }
            });
            this.tDifficultySort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => { 
              if (a.difficultyId && b.difficultyId) {
                return b.difficultyId - a.difficultyId;
              }
            });
            this.tDifficultySort = "asc"
          }
          this.key += 1
          this.taskSortName = 'difficultyId'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case 'priority':
          let taskPrArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].priorityId) {
              taskPrArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskPrArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskPrArr;

          if (this.tPrioritySort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => { 
              if (a.priorityId && b.priorityId) {
                return a.priorityId - b.priorityId;
              }
            });
            this.tPrioritySort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => { 
              if (a.priorityId && b.priorityId) {
                return b.priorityId - a.priorityId;
              }
            });
            this.tPrioritySort = "asc"
          }
          this.key += 1
          this.taskSortName = 'priority'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case 'department':
          let taskDeptArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].departmentId) {
              taskDeptArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskDeptArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskDeptArr;

          if (this.tDepartmentSort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => a.department.title.localeCompare(b.department.title));
            this.tDepartmentSort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => b.department.title.localeCompare(a.department.title));
            this.tDepartmentSort = "asc"
          }
          this.key += 1
          break;

        case 'userId':
          let taskUserArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].userId) {
              taskUserArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskUserArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskUserArr;

          if (this.tUserSort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => {
              if (a.user && b.user) { return a.user.firstName.localeCompare(b.user.firstName) }
            });
            this.tUserSort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => {
              if (a.user && b.user) { return b.user.firstName.localeCompare(a.user.firstName) }
            });
            this.tUserSort = "asc"
          }
          this.key += 1
          this.taskSortName = 'userId'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case 'dueDate':
          let taskDArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].dueDate) {
              taskDArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskDArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskDArr;
          if (this.tDueDateSort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate) }
            });
            this.tDueDateSort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => {
              if (a.dueDate && b.dueDate) { return new Date(b.dueDate) - new Date(a.dueDate) }
            });
            this.tDueDateSort = "asc"
          }
          this.key += 1
          this.taskSortName = 'dueDate'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case 'startDate':
          let taskSArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].startDate) {
              taskSArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              taskSArr.push(this.taskSubtaskLocalData[i])
            }
          }

          this.taskSubtaskLocalData = taskSArr;
          if (this.tStartDateSort == "asc") {
            this.taskSubtaskLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(a.startDate) - new Date(b.startDate) }
            });
            this.tStartDateSort = "desc"
          } else {
            this.taskSubtaskLocalData.sort((a, b) => {
              if (a.startDate && b.startDate) { return new Date(b.startDate) - new Date(a.startDate) }
            });
            this.tStartDateSort = "asc"
          }
          this.key += 1
          this.taskSortName = 'startDate'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        case "project":
          let newArr = []
          for (let i = 0; i < this.taskSubtaskLocalData.length; i++) {
            if (this.taskSubtaskLocalData[i].project[0]) {
              newArr.unshift(this.taskSubtaskLocalData[i])
            } else {
              newArr.push(this.taskSubtaskLocalData[i])
            }
          }

          if (this.tProjSort == "asc") {
            newArr.sort((a, b) => {
              if (a.project[0] && b.project[0]) {
                return a.project[0].project.title.localeCompare(b.project[0].project.title);
              }
            });
            this.tProjSort = 'desc'
          } else {
            newArr.sort((a, b) => {
              if (a.project[0] && b.project[0]) {
                return b.project[0].project.title.localeCompare(a.project[0].project.title);
              }
            });
            this.tProjSort = 'asc'
          }

          this.taskSubtaskLocalData = newArr;
          this.key += 1
          this.taskSortName = 'project'
          this.resetTaskSorts(field);
          this.checkActive()
          break;

        default:
          this.fetchTasks()
          break;
      }
      this.key += 1
    },

    projContextItemClick(key, item) {
      switch (key) {
        case 'fav-project':
          this.projSetFavorite(item)
          break;
        case 'rename-project':
          this.renameModal = true
          break;
        case 'delete-project':
          this.projDelete(item)
          break;
        case 'copy-project':
          this.copyProjectLink(item)
          break;
        case 'share-project':
          break;
        case 'report-project':
          break;
        default:
          this.alertDialog = true
          this.alertMsg = "no project assigned"
          break;
      }
    },

    taskContextItemClick(key, item) {
      switch (key) {
        case 'done-task':
          this.taskMarkComplete(item)
          break;
        case 'fav-task':
          this.taskSetFavorite(item)
          break;
        case 'delete-task':
          this.deleteTask(item)
          break;
        case 'copy-task':
          this.copyTaskLink(item)
          break;
        case 'gotoTeam':
          this.$store.dispatch('task/setSingleTask', item)
          this.$nuxt.$emit('add-member-to-task')
          break;
        case 'gotoComment':
          this.openSidebar(item, 'task_conversation')
          break;
        case 'gotoSubtask':
          this.openSidebar(item, 'task_subtasks')
          break;
        case 'gotoFiles':
          this.openSidebar(item, 'task_files')
          break;
        default:
          this.alertDialog = true
          this.alertMsg = "no task assigned"
          break;
      }
    },

    // project context menu methods ------------------------

    projSetFavorite(project) {
      this.loading = true
      let isFav = this.favProjects.some((f) => f.projects.id == project.id)

      if (isFav) {
        this.$store.dispatch("project/removeFromFavorite", { id: project.id })
          .then(msg => {
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      } else {
        this.$store.dispatch("project/addToFavorite", { id: project.id })
          .then(msg => {
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      }
    },

    projDelete(project) {
      // let del = confirm("Are you sure")
      this.loading = true
      if (project) {
        this.$store.dispatch("project/deleteProject", project).then(t => {

          if (t.statusCode == 200) {
            this.updateKey(t.message)
          } else {
            console.warn(t.message);
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          console.log(e)
        })
      } else {
        this.loading = false
      }
    },

    updateProject(payload){
      const { item, label, field, value, historyText } = payload
      
      let user = this.teamMembers.find(t => t.id == item.userId)

      let data = { [field]: value }
    
      if(field == "dueDate" && item.startDate){
        // console.log(field, value)
        if(value=="Invalid Date"){
          data = { [field]: null }
        }
        else {
          if(new Date(value).getTime() > new Date(item.startDate).getTime()){
          data = { [field]: value }
        } else{
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
        }
      
      }
      if(field == "startDate" && item.dueDate){
        // console.log(field, value)
        if(value=="Invalid Date"){
          data = { [field]: null }
        }else {
          if(new Date(value).getTime() < new Date(item.dueDate).getTime()){
          data = { [field]: value }
        } else {
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
        }
      
      }

      this.$store.dispatch("project/updateProject", {
        id: item.id,
        user,
        data: data,
        text: historyText
      })
        .then(t => {
          if (t.statusCode == 200) {
            this.updateKey()
          } else {
            console.warn(t)
          }
        })
        .catch(e => console.warn(e))
    },

    copyProjectLink(proj) {

      let url = window.location.host + `/projects/${proj.id}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      } else {
        unsecuredCopyToClipboard(url);
      }
    },

    copyTaskLink(task) {
      let url
      if (task.task) {
        url = window.location.host + `/subtasks/${task.id}`;
      } else {
        url = window.location.host + `/tasks/${task.id}`;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      } else {
        unsecuredCopyToClipboard(url);
      }
    },

    updateTask(payload) {
      const { item, label, field, value, historyText } = payload
      // payload consists of task, label, field, value, historyText
      let user
      let data = { [field]: value }

      if (field == "userId" && value != '') {
        user = this.teamMembers.filter(t => t.id == value)
      } else {
        user = null
      }

      let projectId = null
      if (item.project?.length > 0) {
        projectId = item.project[0].projectId
      }

      let taskId
      if (item?.id) {
        taskId = item.id
      } else {
        taskId = item.id
      }

      if(field == "dueDate" && item.startDate){
        // console.log(field, value)
        if(value=="Invalid Date"){
          data = { [field]: null }
        }
        else {
          if(new Date(value).getTime() > new Date(item.startDate).getTime()){
          data = { [field]: value }
        } else{
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
        }
  
      }
      if(field == "startDate" && item.dueDate){
        // console.log(field, value)
        if(value=="Invalid Date"){
          data = { [field]: null }
        }
        else {
          if(new Date(value).getTime() < new Date(item.dueDate).getTime()){
          data = { [field]: value }
        } else {
          data = { [field]: null }
          this.popupMessages.push({ text: "Invalid date", variant: "danger" });
          this.updateKey()
          return false
        }
        }
       
      }

      if (item.task) {
        this.$store.dispatch("subtask/updateSubtask", {
          id: taskId,
          data: data,
          user:user ? [user] : null,
          text: `updated ${label} to ${historyText || value}`
        })
        .then(() => this.updateKey())
        .catch(e => console.warn(e))
      } else {
        this.$store.dispatch("task/updateTask", {
          id: taskId,
          projectId,
          data: data,
          user:user ? [user] : null,
          text: `changed ${label} to ${historyText || value}`
        }).then(t => {
          this.updateKey()
        }).catch(e => console.warn(e))
      }
    },

    // task context menu methods ----------------------------------------

    taskSetFavorite(task) {
      let isTaskFav = this.favTasks.some((f) => f.taskId == task.id)
      let isSubtaskFav = this.favSubtasks.some((f) => f.taskId == task.id)

      // console.log(task, isTaskFav, isSubtaskFav)

      if (task.task) {
        this.$store.dispatch("subtask/removeFromFavorite", { id: task.id })
        .then(res => this.updateKey(res.message))
        .catch(e => console.warn(e))
      } else {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => this.updateKey(msg))
          .catch(e => console.warn(e))
      }
    },

    taskMarkComplete(task) {

      let data, historyText
      if (task.statusId == 5) {
        data = { statusId: 2, isDone: false }
        historyText = "In-Progress"
      } else {
        data = { statusId: 5, isDone: true }
        historyText = "Done"
      }

      if (task.task) {
        console.log('subtask selected')
        this.$store.dispatch("subtask/updateSubtask", {
          id: task.id,
          data,
          // user: null,
          text: `updated status to ${historyText}`
        })
        .then(res => this.updateKey())
        .catch(e => console.warn(e))
      } else {
        this.$store.dispatch('task/updateTaskStatus', task)
          .then((d) => {
            this.updateKey()
            this.setSingleTask(d)
          })
          .catch(e => console.warn(e))
      }
    },

    // confirmDelete(state) {
    //   console.log(state, this.taskToDelete)
    //   this.confirmModal = false
    //   this.confirmMsg = ""
    //   if (state) {
    //     if (this.taskToDelete.task) {
    //       console.log('subtask selected')
    //       this.$store.dispatch("subtask/deleteSubtask", { ...this.taskToDelete, text: `deleted subtask "${this.taskToDelete.title}"` })
    //       .then(st => {
    //         this.taskToDelete = {}
    //         this.updateKey(st.message)
    //       })
    //       .catch(e => console.warn(e))
    //     } else {
    //       this.$store.dispatch("task/deleteTask", this.taskToDelete)
    //         .then(t => {
    //           // console.log(t)
    //           if (t.statusCode == 200) {
    //             this.taskToDelete = {}
    //             this.updateKey(t.message)
    //           } else {
    //             this.popupMessages.push({ text: t.message, variant: "orange" })
    //             console.warn(t.message);
    //           }
    //         })
    //         .catch(e => console.warn(e))
    //     }
    //   } else {
    //     this.popupMessages.push({ text: "Action cancelled", variant: "orange" })
    //     this.taskToDelete = {}
    //   }
    // },

    deleteTask(task) {
      if (task) {
        if (task.task) {
          console.log('subtask selected')
          this.$store.dispatch("subtask/deleteSubtask", { ...task, text: `deleted subtask "${task.title}"` })
          .then(st => {
            // this.taskToDelete = {}
            this.updateKey(st.message)
          })
          .catch(e => console.warn(e))
        } else {
          this.$store.dispatch("task/deleteTask", task)
            .then(t => {
              // console.log(t)
              if (t.statusCode == 200) {
                // this.taskToDelete = {}
                this.updateKey(t.message)
              } else {
                this.popupMessages.push({ text: t.message, variant: "orange" })
                console.warn(t.message);
              }
            })
            .catch(e => console.warn(e))
        }
      } else {
        this.popupMessages.push({ text: "Action cancelled", variant: "orange" })
        // this.taskToDelete = {}
      }
      // this.taskToDelete = task
      // this.confirmMsg = "Are you sure "
      // this.confirmModal = true
    },

    async updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" })
      }

      this.$store.dispatch('project/fetchFavProjects').then(() => {
        this.fetchProjects()
      })

      const tsk = await this.$store.dispatch('task/getFavTasks')
      const sbtsk = await this.$store.dispatch("subtask/fetchFavorites")
      Promise.all([tsk, sbtsk]).then((values) => {
        this.fetchTasks()
      })
    },

    // task context menu methods ------------------------------------------
    openSidebar(task, scroll) {
      // console.log(...arguments)
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      }
      
      if (task.task) {
        this.$nuxt.$emit("close-sidebar");
        this.$store.dispatch("subtask/setSelectedSubtask", task)
        this.subPanel = true
      } else {
        this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
        this.subPanel = false
      }
    },

    // searchProjectOrTasks(text) {

    //   let formattedText = text.toLowerCase().trim();
    //   let tArr = this.sortedTask.filter((t) => {
    //     if (t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
    //       return t
    //     }
    //   })

    //   let pArr = this.sortedProject.filter((p) => {
    //     if (p.title.includes(formattedText) || p.title.toLowerCase().includes(formattedText)) {
    //       return p
    //     }
    //   })

    //   if (pArr.length >= 0) {
    //     this.projLocalData = pArr
    //     this.key++;
    //   } else {
    //     this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
    //     this.key++;
    //   }

    //   if (tArr.length >= 0) {
    //     this.taskSubtaskLocalData = tArr
    //     this.key++;
    //   } else {
    //     this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
    //     this.key++;
    //   }
    // }

  }
}

</script>
<style lang="scss" scoped>
.favorite-wrapper {
  display: flex;
  flex-direction: column;

}
.favorite-tables {
  display: flex;
  height: calc(100% - 110px);
  flex-direction: column;
}
</style>
